import re

# Fichiers
input_file = "src/app/data.js"
output_file = "src/app/data.js"

# Lire le fichier entier
with open(input_file, "r", encoding="utf-8") as f:
    code = f.read()

# Fonction pour traiter le contenu du tableau formations
def process_formations(match):
    formations_code = match.group(0)

    def replace_img(obj_match):
        obj_text = obj_match.group(0)

        # Extraire la location
        location_match = re.search(r'["\']\s*location["\']\s*:\s*["\']([^"\']+)["\']', obj_text)
        if not location_match:
            return obj_text

        location_value = location_match.group(1)

        # Extraire le nom de fichier sans extension
        base_name = location_value.split("/")[-1].replace(".pdf", "")

        # Construire le nouveau chemin img
        new_img = f'/assets/formations/{base_name}.jpeg'

        # Remplacer (ou ajouter) la clé img
        if re.search(r'/assets/ImgCarousel/12.jpeg', obj_text):
            obj_text = re.sub(r'/assets/ImgCarousel/12.jpeg', f'{new_img}', obj_text)
        else:
            obj_text = obj_text.rstrip("}")  # retirer la dernière accolade
            obj_text += f', img: "{new_img}" }}'

        return obj_text

    # Remplacer chaque objet du tableau
    updated = re.sub(r'\{[^}]*location[^}]*\}', replace_img, formations_code)

    return updated

# Remplacer uniquement dans le tableau formations
updated_code = re.sub(
    r'const\s+OnlineFormations\s*=\s*\[[\s\S]*?\];',
    process_formations,
    code
)

# Écrire dans un nouveau fichier
with open(output_file, "w", encoding="utf-8") as f:
    f.write(updated_code)

print("✅ Fichier mis à jour :", output_file)