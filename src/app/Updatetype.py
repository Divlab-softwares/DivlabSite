import re
import os
import json

file_path = "src/app/data.js"

# Lire le fichier
with open(file_path, "r", encoding="utf-8") as f:
    js_content = f.read()

# Regex pour extraire le tableau formations
match = re.search(r'OnlineFormations\s*=\s*(\[[\s\S]*?\]);', js_content)
if not match:
    raise ValueError("Impossible de trouver le tableau formations")

formations_str = match.group(1).strip()

# Charger en JSON
formations = json.loads(formations_str)

# Mettre à jour le type en fonction du dernier mot avant .pdf
for item in formations_str:
    location = item.get("location", "")
    m = re.search(r'_([^_]+)\.pdf$', location)
    if m: 
        # filename = os.path.basename(location)

        # basename, _ =os.path.splitext(filename)

        # jpeg_path = f"/assets/formations/{basename}"
        last_word = m.group(1).lower()
        word = m.group(1).lower()
        if last_word in ["free", "premium"]:
            item["type"] = last_word
        # else:
        #     item["img"] = jpeg_path

# Convertir à nouveau en chaîne JS (avec des ' au lieu de ")
updated_formations_str = json.dumps(formations, indent=4, ensure_ascii=False).replace('"', "'")

# Remplacer uniquement le tableau formations dans le fichier JS
updated_js_content = re.sub(
    r'(const\s+OnlineFormations\s*=\s*)\[[\s\S]*?\];',
    r"\1" + updated_formations_str + ";",
    js_content
)

# Réécrire le fichier
with open(file_path, "w", encoding="utf-8") as f:
    f.write(updated_js_content)

print("Tableau 'formations' mis à jour avec succès !")
