"""
Improved region processor:
- Dissolves provinces into exactly 7 merged polygons per country
- Bakes 7 distinct color shades into each feature's `region_color` property
- Adds `centroid_lon/lat` for capital symbol placement
"""
import json, math
from collections import defaultdict
from shapely.geometry import shape, mapping
from shapely.ops import unary_union

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def rgb_to_hex(r, g, b):
    return '#{:02x}{:02x}{:02x}'.format(int(max(0,min(255,r))), int(max(0,min(255,g))), int(max(0,min(255,b))))

def adjust(color, lightness_shift):
    """Shift color towards white (positive) or black (negative)."""
    r, g, b = hex_to_rgb(color)
    if lightness_shift > 0:
        r = r + (255 - r) * lightness_shift
        g = g + (255 - g) * lightness_shift
        b = b + (255 - b) * lightness_shift
    else:
        f = 1 + lightness_shift
        r, g, b = r * f, g * f, b * f
    return rgb_to_hex(r, g, b)

# 7 lightness shifts for the 7 regions (creates distinct shades)
REGION_SHIFTS = [0, 0.22, -0.18, 0.12, -0.28, 0.30, -0.12]

# Base colors per country
BASE_COLORS = {
    'IND':'#c2410c','USA':'#1d4ed8','CHN':'#b91c1c','RUS':'#7c3aed',
    'GBR':'#0369a1','FRA':'#4338ca','DEU':'#4d7c0f','BRA':'#15803d',
    'SAU':'#b45309','JPN':'#be185d','PAK':'#0f766e','AUS':'#be123c',
    'CAN':'#e11d48','IRN':'#c2410c','TUR':'#6d28d9','EGY':'#a16207',
    'MEX':'#047857','ARG':'#0e7490','ZAF':'#991b1b','NGA':'#065f46',
    'KOR':'#0c4a6e','VNM':'#7f1d1d','IDN':'#7c2d12','THA':'#1a1a2e',
    'UKR':'#1d4ed8','POL':'#be123c','ESP':'#c2410c','ITA':'#15803d',
    'SWE':'#1d4ed8','NOR':'#4338ca','FIN':'#0891b2','DEU':'#4d7c0f',
}

def get_base_color(iso):
    if iso in BASE_COLORS:
        return BASE_COLORS[iso]
    h = 0
    for c in iso:
        h = (h * 31 + ord(c)) & 0xFFFFFFFF
    palette = ['#1d4ed8','#b91c1c','#15803d','#7c3aed','#b45309',
               '#0f766e','#be185d','#0369a1','#065f46','#9f1239',
               '#166534','#6d28d9','#a16207','#be123c','#0891b2']
    return palette[h % len(palette)]

NAMED_REGIONS = {
    'IND': ['Punjab','Rajasthan','Gujarat','Maharashtra','Tamil Nadu','Uttar Pradesh','Assam'],
    'USA': ['Northeast','Southeast','Midwest','Texas','California','Rockies','Pacific Northwest'],
    'CHN': ['Beijing Region','Shanghai Region','Guangdong','Sichuan','Xinjiang','Tibet','Inner Mongolia'],
    'RUS': ['Moscow Oblast','St. Petersburg','Siberia','Volga Region','Urals','Far East','Caucasus'],
    'GBR': ['London','South England','Midlands','North England','Scotland','Wales','Northern Ireland'],
    'FRA': ['Île-de-France','Normandy','Bretagne','Alsace','Provence','Aquitaine','Rhône-Alpes'],
    'DEU': ['Berlin','Bavaria','North Rhine','Brandenburg','Saxony','Hamburg','Baden-Württemberg'],
    'BRA': ['Brasília Region','São Paulo','Amazonas','Rio de Janeiro','Minas Gerais','Mato Grosso','Bahia'],
    'SAU': ['Riyadh Region','Mecca Region','Eastern Province','Medina Region','Asir Region','Tabuk Region',"Ha'il Region"],
    'JPN': ['Kanto','Kansai','Chubu','Tohoku','Kyushu','Hokkaido','Shikoku'],
    'PAK': ['Punjab','Sindh','KPK','Balochistan','Islamabad','AJK','FATA'],
    'AUS': ['New South Wales','Victoria','Queensland','Western Australia','South Australia','Northern Territory','Tasmania'],
    'CAN': ['Ontario','Quebec','Alberta','British Columbia','Saskatchewan','Manitoba','Yukon & NWT'],
    'IRN': ['Tehran Region','Khorasan','Isfahan','Fars','Azerbaijan','Khuzestan','Sistan'],
    'TUR': ['Istanbul Region','Ankara','Aegean','Mediterranean','Black Sea','Eastern Anatolia','Southeast'],
    'EGY': ['Cairo Region','Alexandria','Sinai','Upper Egypt','Delta','Western Desert','Suez Canal'],
    'MEX': ['Mexico City','North','Bajio','Pacific Coast','Gulf Coast','South','Yucatan'],
    'ARG': ['Buenos Aires','Patagonia','Cuyo','Northwest','Northeast','Pampa','Cordoba'],
    'ZAF': ['Gauteng','KwaZulu-Natal','Western Cape','Eastern Cape','Limpopo','Mpumalanga','Northern Cape'],
    'NGA': ['Lagos','Abuja Region','North West','North East','South South','South East','North Central'],
    'KOR': ['Seoul Region','Gyeonggi','Busan','Daegu','Incheon','Gwangju','Daejeon'],
    'IDN': ['Java','Sumatra','Kalimantan','Sulawesi','Papua','Bali & Nusa','Maluku'],
    'UKR': ['Kyiv Region','Kharkiv','Odessa','Donetsk','Lviv','Dnipro','Zaporizhzhia'],
    'POL': ['Warsaw','Silesia','Malopolska','Wielkopolska','Pomerania','Masovia','Podkarpacie'],
    'ESP': ['Madrid','Catalonia','Andalusia','Valencia','Basque Country','Galicia','Castile'],
    'ITA': ['Lombardy','Lazio','Campania','Sicily','Veneto','Piedmont','Tuscany'],
}

RESOURCES = {
    'IND': ['Grain','None','Oil','Iron','None','Grain','Oil'],
    'USA': ['Iron','Grain','Grain','Oil','None','Iron','None'],
    'CHN': ['Iron','None','None','Grain','Oil','Iron','Grain'],
    'RUS': ['Iron','None','Oil','Grain','Iron','Oil','Grain'],
    'GBR': ['None','Grain','Iron','Iron','Oil','None','Grain'],
    'FRA': ['None','Grain','None','Iron','None','Grain','Iron'],
    'DEU': ['None','Iron','Iron','Grain','None','None','None'],
    'BRA': ['None','None','None','Oil','Iron','Grain','Grain'],
    'SAU': ['Oil','Oil','Oil','None','Grain','Iron','None'],
    'JPN': ['None','None','Iron','None','Grain','Grain','None'],
    'PAK': ['Grain','Oil','None','Iron','None','None','Grain'],
    'AUS': ['Iron','None','Grain','Iron','Grain','Oil','None'],
    'CAN': ['Iron','None','Oil','None','Grain','Grain','Iron'],
}

CAPITAL_IDX = {k:0 for k in list(NAMED_REGIONS.keys())}
CAPITAL_IDX['IND'] = 5  # Uttar Pradesh (Delhi)

print("Loading raw GeoJSON...", flush=True)
with open('public/regions_raw.geojson', encoding='utf-8') as f:
    data = json.load(f)

by_country = defaultdict(list)
for feat in data['features']:
    props = feat.get('properties', {})
    iso = props.get('adm0_a3') or props.get('adm0_iso') or ''
    geom = feat.get('geometry')
    if iso and geom:
        try:
            shp = shape(geom)
            if not shp.is_valid:
                shp = shp.buffer(0)
            if shp.is_valid and not shp.is_empty:
                by_country[iso].append({
                    'shape': shp, 
                    'lat': shp.centroid.y,
                    'area': shp.area,
                    'name': props.get('name') or props.get('name_en') or props.get('name_local') or 'Region'
                })
        except:
            pass

print(f"Loaded {len(by_country)} countries", flush=True)
output_features = []

for iso, feats in by_country.items():
    feats_sorted = sorted(feats, key=lambda f: f['lat'], reverse=True)
    n = len(feats_sorted)
    base_color = get_base_color(iso)

    groups = []
    chunk_size = n / 7
    for i in range(7):
        start = int(round(i * chunk_size))
        end = int(round((i + 1) * chunk_size))
        chunk = feats_sorted[start:min(max(end, start+1), n)]
        if chunk:
            groups.append(chunk)

    while len(groups) < 7:
        largest_idx = max(range(len(groups)), key=lambda i: len(groups[i]))
        g = groups[largest_idx]
        mid = max(1, len(g) // 2)
        groups[largest_idx] = g[:mid]
        groups.insert(largest_idx + 1, g[mid:] if len(g) > mid else [g[-1]])

    if iso in NAMED_REGIONS:
        named = NAMED_REGIONS[iso]
    else:
        named = []
        for g in groups[:7]:
            if not g:
                named.append("Region")
            else:
                largest = max(g, key=lambda f: f['area'])
                n = str(largest['name']).strip()
                if not n or n.lower() == 'none' or n.lower() == 'null':
                    n = "Region"
                named.append(n)
    resources = RESOURCES.get(iso, ['None']*7)
    capital_idx = CAPITAL_IDX.get(iso, 0)

    for i, group in enumerate(groups[:7]):
        if not group:
            continue
        name = named[i].strip() if i < len(named) else f'Region {i+1}'
        res = resources[i] if i < len(resources) else 'None'
        is_capital = (i == capital_idx)

        try:
            merged = unary_union([f['shape'] for f in group])
            merged = merged.simplify(0.05, preserve_topology=True)
            if merged.is_empty:
                continue
            # Centroid for label/capital marker
            centroid = merged.centroid
            geom_json = mapping(merged)
        except:
            geom_json = mapping(group[0]['shape'])
            centroid = group[0]['shape'].centroid

        # Compute distinct color shade for this region
        region_color = adjust(base_color, REGION_SHIFTS[i])

        output_features.append({
            'type': 'Feature',
            'properties': {
                'region_id': f'{iso}-{i+1}',
                'region_name': name,
                'country_iso': iso,
                'region_index': i,
                'resource': res,
                'is_capital': is_capital,
                'region_color': region_color,
                'base_color': base_color,
                'centroid_lon': round(centroid.x, 4),
                'centroid_lat': round(centroid.y, 4),
            },
            'geometry': geom_json
        })

    if len(by_country) and (list(by_country.keys()).index(iso) + 1) % 50 == 0:
        print(f"  Progress...", flush=True)

print(f"Writing {len(output_features)} features...", flush=True)
with open('public/regions.geojson', 'w', encoding='utf-8') as f:
    json.dump({'type':'FeatureCollection','features':output_features}, f, separators=(',',':'))

# Dump the generated names mapping for the frontend to use
print("Writing src/data/dynamic_region_names.json...")
dynamic_names = {}
for iso in by_country.keys():
    # Only store if not in the hardcoded list
    if iso not in NAMED_REGIONS:
        # Re-derive names to store
        feats = sorted(by_country[iso], key=lambda f: f['lat'], reverse=True)
        groups = []
        chunk_size = len(feats) / 7
        for i in range(7):
            start = int(round(i * chunk_size))
            end = int(round((i + 1) * chunk_size))
            chunk = feats[start:min(max(end, start+1), len(feats))]
            if chunk: groups.append(chunk)
        while len(groups) < 7:
            largest_idx = max(range(len(groups)), key=lambda i: len(groups[i]))
            g = groups[largest_idx]
            mid = max(1, len(g) // 2)
            groups[largest_idx] = g[:mid]
            groups.insert(largest_idx + 1, g[mid:] if len(g) > mid else [g[-1]])
        names = []
        for g in groups[:7]:
            if not g: names.append("Region")
            else:
                largest = max(g, key=lambda f: f['area'])
                n = str(largest['name']).strip()
                if not n or n.lower() == 'none' or n.lower() == 'null': n = "Region"
                names.append(n)
        dynamic_names[iso] = names

with open('src/data/dynamic_region_names.json', 'w', encoding='utf-8') as f:
    json.dump(dynamic_names, f, indent=2)

print("Done!", flush=True)
