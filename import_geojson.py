import json
import mysql.connector

# MySQL connection
db = mysql.connector.connect(
    host="localhost",
    user="root",
    password="13091878",
    database="kusboku",
    charset="utf8mb4"
)
cursor = db.cursor()

# Cache for ilce name to ID mapping
ilce_id_map = {}

def import_ilceler(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for feature in data["features"]:
            ilce_name = feature["properties"]["address"].get("archipelago") or feature["properties"]["display_name"].split(',')[0]
            ilce_name = ilce_name.strip()

            cursor.execute("INSERT IGNORE INTO ilce (name) VALUES (%s)", (ilce_name,))
            db.commit()

            cursor.execute("SELECT id FROM ilce WHERE name = %s", (ilce_name,))
            ilce_id = cursor.fetchone()[0]
            ilce_id_map[ilce_name] = ilce_id

    print("✅ İlçeler yüklendi.")

def import_mahalleler(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        data = json.load(f)
        for feature in data["features"]:
            props = feature["properties"]["address"]
            mahalle_name = props.get("city") or feature["properties"]["display_name"].split(',')[0]
            ilce_name = props.get("archipelago") or props.get("town") or None

            if not ilce_name:
                print(f"⚠️ İlçe bilgisi yok: {mahalle_name}")
                continue

            ilce_name = ilce_name.strip()

            ilce_id = ilce_id_map.get(ilce_name)
            if not ilce_id:
                print(f"⚠️ Eşleşmeyen ilçe: {ilce_name} (Mahalle: {mahalle_name})")
                continue

            cursor.execute(
                "INSERT INTO mahalle (name, ilce_id) VALUES (%s, %s)",
                (mahalle_name.strip(), ilce_id)
            )

    db.commit()
    print("✅ Mahalleler yüklendi.")

# Run imports
import_ilceler("ilce_geojson.json")
import_mahalleler("mahalle_geojson.json")

cursor.close()
db.close()