import json
import re
from PyPDF2 import PdfReader

# === Fonctions utilitaires ===

def normalize_text(text: str) -> str:
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text.strip())
    text = text.replace('“', '"').replace('”', '"').replace("’", "'")
    return text

def categorize(title: str) -> str:
    title = title.lower()
    if any(k in title for k in ["react", "javascript", "frontend"]):
        return "Développement Web"
    elif any(k in title for k in ["python", "machine learning", "data"]):
        return "Data Science"
    elif any(k in title for k in ["marketing", "entreprise", "startup"]):
        return "Business"
    elif any(k in title for k in ["ai", "deep learning", "neural"]):
        return "Intelligence Artificielle"
    else:
        return "Autres"

def extract_author_from_pdf(path):
    try:
        with open(path, "rb") as f:
            reader = PdfReader(f)
            meta = reader.metadata
            return meta.author if meta and meta.author else "Inconnu"
    except Exception:
        return "Inconnu"

def extract_page_count(path):
    try:
        with open(path, "rb") as f:
            reader = PdfReader(f)
            return len(reader.pages)
    except Exception:
        return 0

# === Lecture du fichier JS ===
with open("data.js", "r", encoding="utf-8") as f:
    array_js = f.read()

# Nettoyage du code JS pour le convertir en JSON valide
array_clean = (
    array_js
    .replace("export const array = ", "")
    .replace(";", "")
    .strip()
)

# 🧹 Correction des guillemets et échappements
# 1. Supprimer les guillemets cassés de style JS
array_clean = array_clean.replace('\\"', '"')
# 2. Corriger les guillemets dans les textes (we"re -> we\'re)
array_clean = re.sub(r'(?<=\w)"(?=\w)', "'", array_clean)
# 3. Remplacer tous les guillemets simples extérieurs par des doubles (JSON exige des doubles)
array_clean = re.sub(r"'", '"', array_clean)
# 4. Corriger les barres inverses orphelines
array_clean = re.sub(r'\\(?![nrt"\\/bfu])', r'\\\\', array_clean)

# Vérification JSON
try:
    data = json.loads(array_clean)
except json.JSONDecodeError as e:
    print("⚠️ Erreur de parsing JSON :", e)
    print("\n--- Aperçu du contenu problématique ---")
    print(array_clean[:1000])
    with open("error_preview.json", "w", encoding="utf-8") as err:
        err.write(array_clean[:2000])
    print("\n🔎 Un extrait a été enregistré dans error_preview.json pour analyse.")
    exit()

# === Transformation des données ===
for obj in data:
    location = obj.get("location", "")
    title = location.split("/")[-1].replace("DIVLAB_", "").replace(".pdf", "").replace(".epub", "")
    obj["title"] = normalize_text(title)
    obj["description"] = normalize_text(obj.get("description", ""))
    obj["category"] = categorize(obj["title"])

    if location.endswith(".pdf"):
        path = f".{location}" if not location.startswith(".") else location
        obj["author"] = extract_author_from_pdf(path)
        obj["pages"] = extract_page_count(path)
    else:
        obj["author"] = "Inconnu"
        obj["pages"] = 0

# === Écriture du fichier final ===
with open("data_restructured.json", "w", encoding="utf-8") as f:
    json.dump(data, f, indent=4, ensure_ascii=False)

print("✅ Données restructurées et sauvegardées dans data_restructured.json")
