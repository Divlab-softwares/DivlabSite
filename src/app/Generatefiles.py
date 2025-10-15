import os
import json

# 📂 Dossier à scanner
FOLDER_PATH = "public/fichiers"   # à adapter à ton projet (par ex: "public/pdfs")

# 📄 Fichier de sortie (JSX-friendly)
OUTPUT_FILE = "src/app/data.js"

def generate_file_list(folder_path):
    file_list = []
    file_id = 1

    for root, dirs, files in os.walk(folder_path):
        for file in files:
            # chemin relatif (utile pour Next.js ou React)
            relative_path = os.path.relpath(os.path.join(root, file), start=folder_path)
            
            file_list.append({
                "id": file_id,
                "location": f"/{relative_path.replace(os.sep, '/')}"  # force format URL
            })
            file_id += 1

    return file_list

def save_as_js(data, output_file):
    with open(output_file, "w", encoding="utf-8") as f:
        f.write("// 🚀 Auto-generated file list\n")
        f.write("export const OnlineFormations = ")
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write(";\n")

if __name__ == "__main__":
    files = generate_file_list(FOLDER_PATH)
    save_as_js(files, OUTPUT_FILE)
    print(f"✅ {len(files)} fichiers trouvés et enregistrés dans {OUTPUT_FILE}")