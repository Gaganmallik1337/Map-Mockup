import urllib.request
import json
import os
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

def run():
    url = "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries_ind.geojson"
    temp_file = "ne_10m_ind.geojson"
    
    if not os.path.exists(temp_file):
        print("Downloading official Survey of India boundaries from Natural Earth...")
        urllib.request.urlretrieve(url, temp_file)
        
    with open(temp_file, 'r', encoding='utf-8') as f:
        ne_data = json.load(f)
        
    official_ind = None
    for feat in ne_data['features']:
        if feat['properties'].get('ADM0_A3') == 'IND':
            s = shape(feat['geometry'])
            if not s.is_valid:
                s = s.buffer(0)
            official_ind = s
            break
            
    if not official_ind:
        print("Error: Could not find IND in Natural Earth data.")
        return
        
    # Simplify slightly for performance
    official_ind = official_ind.simplify(0.005, preserve_topology=True)
    print("Extracted official India geometry.")

    # 1. Update countries.geojson
    print("Updating countries.geojson...")
    with open('public/countries.geojson', 'r', encoding='utf-8') as f:
        countries_data = json.load(f)
        
    for feat in countries_data['features']:
        iso = feat['properties'].get('ISO3166-1-Alpha-3', '')
        if iso == 'IND':
            feat['geometry'] = mapping(official_ind)
        elif iso in ['PAK', 'CHN']:
            s = shape(feat['geometry'])
            if not s.is_valid:
                s = s.buffer(0)
            s = s.difference(official_ind)
            feat['geometry'] = mapping(s)
            
    with open('public/countries.geojson', 'w', encoding='utf-8') as f:
        json.dump(countries_data, f)

    # 2. Update regions_raw.geojson -> regions_raw_fixed.geojson
    print("Fixing raw region geometries...")
    with open('public/regions_raw.geojson', 'r', encoding='utf-8') as f:
        regions_raw = json.load(f)
        
    # Find Jammu and Kashmir region to dump missing Indian territory into
    jk_feature = None
    ind_union_shapes = []
    
    for feat in regions_raw['features']:
        iso = feat['properties'].get('adm0_a3') or feat['properties'].get('adm0_iso')
        name = str(feat['properties'].get('name', '')).lower()
        
        # Merge KAS into IND
        if iso == 'KAS':
            feat['properties']['adm0_a3'] = 'IND'
            feat['properties']['adm0_iso'] = 'IND'
            iso = 'IND'
            
        if iso == 'IND':
            s = shape(feat['geometry'])
            if not s.is_valid:
                s = s.buffer(0)
            ind_union_shapes.append(s)
            if 'kashmir' in name or 'jammu' in name:
                jk_feature = feat
                
    if not jk_feature:
        # Fallback to the first Indian feature
        for feat in regions_raw['features']:
            iso = feat['properties'].get('adm0_a3') or feat['properties'].get('adm0_iso')
            if iso == 'IND':
                jk_feature = feat
                break

    # Calculate missing territory (Aksai Chin, Gilgit, etc.)
    ind_union = unary_union(ind_union_shapes)
    missing_ind = official_ind.difference(ind_union)
    
    # Add missing territory to J&K
    if missing_ind.area > 0:
        jk_s = shape(jk_feature['geometry'])
        if not jk_s.is_valid:
            jk_s = jk_s.buffer(0)
        jk_s = unary_union([jk_s, missing_ind])
        jk_feature['geometry'] = mapping(jk_s)
        
    # Carve official India out of China and Pakistan regions
    for feat in regions_raw['features']:
        iso = feat['properties'].get('adm0_a3') or feat['properties'].get('adm0_iso')
        if iso in ['PAK', 'CHN']:
            s = shape(feat['geometry'])
            if not s.is_valid:
                s = s.buffer(0)
            if s.intersects(official_ind):
                s = s.difference(official_ind)
                feat['geometry'] = mapping(s)
                
    with open('public/regions_raw_fixed.geojson', 'w', encoding='utf-8') as f:
        json.dump(regions_raw, f)

    print("Done! Now run process_regions.py.")

if __name__ == '__main__':
    run()
