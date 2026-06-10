import json
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

def run():
    print("Loading regions_raw.geojson to construct official India boundary...")
    with open('public/regions_raw.geojson', 'r', encoding='utf-8') as f:
        raw_data = json.load(f)

    india_shapes = []
    merge_keywords = ['kashmir', 'aksai chin', 'siachen', 'arunachal']

    for feat in raw_data['features']:
        props = feat.get('properties', {})
        name = str(props.get('name') or props.get('name_en') or props.get('name_local') or '').lower()
        iso = props.get('adm0_a3') or props.get('adm0_iso') or ''
        
        if iso == 'IND' or iso == 'KAS' or any(k in name for k in merge_keywords):
            geom = feat.get('geometry')
            if geom:
                try:
                    s = shape(geom)
                    if not s.is_valid:
                        s = s.buffer(0)
                    india_shapes.append(s)
                except Exception as e:
                    pass

    print(f"Constructed India from {len(india_shapes)} raw geometries. Merging...")
    india_geom = unary_union(india_shapes)
    # Use slight buffer to remove internal seams, then simplify
    india_geom = india_geom.buffer(0.001).buffer(-0.001)
    india_geom = india_geom.simplify(0.01, preserve_topology=True)

    print("Loading countries.geojson...")
    with open('public/countries.geojson', 'r', encoding='utf-8') as f:
        data = json.load(f)

    for feat in data['features']:
        iso = feat['properties'].get('ISO3166-1-Alpha-3', '')
        
        if iso == 'IND':
            feat['geometry'] = mapping(india_geom)
        elif iso in ['PAK', 'CHN']:
            try:
                s = shape(feat['geometry'])
                if not s.is_valid:
                    s = s.buffer(0)
                # Subtract India's official geometry to remove overlapping claims
                s = s.difference(india_geom)
                feat['geometry'] = mapping(s)
            except Exception as e:
                pass

    print("Saving modified countries.geojson...")
    with open('public/countries.geojson', 'w', encoding='utf-8') as f:
        json.dump(data, f)

    # 2. Generate country_labels.geojson
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
                
                # Get the largest polygon if MultiPolygon
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
