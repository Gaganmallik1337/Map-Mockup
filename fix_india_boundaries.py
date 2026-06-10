import json
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

def run():
    print("Loading countries.geojson...")
    with open('public/countries.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)

    india_features = []
    other_features = []
    merge_keywords = ['kashmir', 'aksai chin', 'siachen']
    
    for feat in data['features']:
        props = feat.get('properties', {})
        name = str(props.get('name', '')).lower()
        iso = props.get('ISO3166-1-Alpha-3', '')
        
        should_merge = False
        if iso == 'IND':
            should_merge = True
        elif any(k in name for k in merge_keywords) or iso == 'KAS':
            should_merge = True
            
        if should_merge:
            india_features.append(feat)
        else:
            other_features.append(feat)

    if india_features:
        print(f"Merging {len(india_features)} features into India...")
        shapes = []
        for feat in india_features:
            geom = feat.get('geometry')
            if geom:
                try:
                    s = shape(geom)
                    if not s.is_valid:
                        s = s.buffer(0)
                    shapes.append(s)
                except Exception as e:
                    pass
        
        merged_india = unary_union(shapes)
        merged_india = merged_india.simplify(0.01, preserve_topology=True)
        
        main_india_feat = india_features[0]
        main_india_feat['geometry'] = mapping(merged_india)
        main_india_feat['properties']['ISO3166-1-Alpha-3'] = 'IND'
        main_india_feat['properties']['name'] = 'India'
        other_features.append(main_india_feat)

    data['features'] = other_features

    print("Saving modified countries.geojson...")
    with open('public/countries.geojson', 'w', encoding='utf-8') as f:
        json.dump(data, f)

    print("Generating country_labels.geojson...")
    label_features = []
    
    for feat in data['features']:
        props = feat.get('properties', {})
        iso = props.get('ISO3166-1-Alpha-3', '')
        name = props.get('name', '')
        if not iso or not name:
            continue
            
        geom = feat.get('geometry')
        if geom:
            try:
                s = shape(geom)
                if not s.is_valid:
                    s = s.buffer(0)
                
                if s.geom_type == 'MultiPolygon':
                    polys = list(s.geoms)
                    largest = max(polys, key=lambda p: p.area)
                    point = largest.centroid
                else:
                    point = s.centroid
                    
                label_features.append({
                    'type': 'Feature',
                    'geometry': mapping(point),
                    'properties': {
                        'name': name,
                        'iso': iso
                    }
                })
            except Exception as e:
                pass
                
    labels_fc = {
        'type': 'FeatureCollection',
        'features': label_features
    }
    with open('public/country_labels.geojson', 'w', encoding='utf-8') as f:
        json.dump(labels_fc, f)
        
    print("Done!")

if __name__ == '__main__':
    run()
