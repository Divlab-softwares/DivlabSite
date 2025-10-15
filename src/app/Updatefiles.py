import json
import re

# 📄 Chemin du fichier généré
INPUT_FILE = "src/app/data.js"
OUTPUT_FILE = "src/app/data.js"

# 🚀 Nouvelles colonnes à ajouter
DEFAULT_COLUMNS = {
    "value": "Formation",
}

def load_js_as_json(js_file):
    """Lit un fichier .js qui contient un export de tableau et renvoie le tableau en JSON"""
    with open(js_file, "r", encoding="utf-8") as f:
        content = f.read()

    # Extraire uniquement le tableau JSON avec regex
    match = re.search(r"export const OnlineFormations = (\[.*\]);", content, re.S)
    if not match:
        raise ValueError("Impossible de trouver le tableau dans le fichier JS")

    return json.loads(match.group(1))

def save_as_js(data, js_file):
    """Réécrit le fichier .js avec les nouvelles colonnes"""
    with open(js_file, "w", encoding="utf-8") as f:
        f.write("// 🚀 Auto-generated file list (updated)\n")
        f.write("export const OnlineFormations = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")

if __name__ == "__main__":
    files = load_js_as_json(INPUT_FILE)

    # Ajouter les nouvelles colonnes
    for file in files:
        for key, default_value in DEFAULT_COLUMNS.items():
            if key not in file:
                # Exemple : titre basé sur le nom du fichier
                if key == "title":
                    file[key] = file["location"].split("/")[-1]
                elif key == "type":
                    file[key] = file["location"].split(".")[-1]
                else:
                    file[key] = default_value

    save_as_js(files, OUTPUT_FILE)
    print(f"✅ Fichier mis à jour avec les nouvelles colonnes dans {OUTPUT_FILE}")

    