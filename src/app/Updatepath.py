import re

# Nom du fichier qui contient tes tableaux React
FILENAME = "src/app/data.js"

# Le tableau que tu veux modifier
TABLE_NAME = "OnlineFormations"

# Partie du texte dans "location" à remplacer
OLD_PATH = "/assets/Img"
NEW_PATH = "/assets/formations"

with open(FILENAME, "r", encoding="utf-8") as f:
    content = f.read()

# Regex qui cible uniquement le tableau OnlineFormations
pattern = rf"(const {TABLE_NAME}\s*=\s*\[.*?\])"
match = re.search(pattern, content, re.DOTALL)

if match:
    table_code = match.group(1)

    # Remplacer uniquement dans la partie location du tableau
    updated_table = re.sub(rf'(["\']\s*location["\']\s*:\s*["\']){OLD_PATH}', rf'\1{NEW_PATH}', table_code)

    # Réinjecter dans le fichier
    new_content = content.replace(table_code, updated_table)

    with open(FILENAME, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ Tableau '{TABLE_NAME}' mis à jour avec succès !")
else:
    print(f"❌ Tableau '{TABLE_NAME}' non trouvé dans {FILENAME}")



    