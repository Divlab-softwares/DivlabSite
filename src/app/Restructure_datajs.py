import re
import json
import os
from PyPDF2 import PdfReader

# ============================
# CONFIGURATION DE BASE
# ============================
input_file = "data.js"
output_file = "data_restructured1.js"
pdf_base_path = "../../public/fichiers"  # dossier où sont stockés les PDFs

# ============================
# FONCTIONS UTILITAIRES
# ============================

def extract_title_from_location(location: str) -> str:
    """
    Extrait un titre lisible à partir du chemin du fichier PDF.
    Exemple: '/fichiers/DIVLAB_30-days-of-react-ebook-free.pdf' -> '30 Days Of React Ebook'
    """
    if not location:
        return "Inconnu"
    base = os.path.basename(location)
    title = re.sub(r'(?i)divlab[_-]*', '', base)
    title = re.sub(r'[_-]premium', ' ', title)
    title = re.sub(r'[_-]free', ' ', title)
    title = re.sub(r'\.pdf$', '', title, flags=re.I)
    title = re.sub(r'[_-]+', ' ', title)
    title = re.sub(r'\s+', ' ', title).strip().title()
    return title


def extract_class_and_format_from_location(location: str) -> str:
    """
    Extrait la classe et le format à partir du chemin du fichier PDF.
    Exemple: '/fichiers/DIVLAB_30-days-of-react-ebook-free.pdf' -> ('free', 'pdf')
    """
    if not location:
        return ("Inconnu", "inconnu")
    base = os.path.basename(location)
    class_type = "free" if "free" in base.lower() else "premium"
    format_type = base.split('.')[-1] if '.' in base else "inconnu"
    return (class_type, format_type)
    

def extract_image_from_location(location: str) -> str:
    """
    Extrait l'image à partir du chemin du fichier PDF.
    Exemple: '/fichiers/DIVLAB_30-days-of-react-ebook-free.pdf' -> 'DIVLAB_30-days-of-react-ebook-free'
    """
    if not location:
        return "Inconnu"
    base = os.path.basename(location)
    image_name = base.split("/")[-1]
    #image_name = re.sub(r'(?i)divlab[_-]*', '', base)
    #image_name = re.sub(r'[_-]premium', ' ', image_name)
    #image_name = re.sub(r'[_-]free', ' ', image_name)
    image_name = re.sub(r'\.pdf$', '', base, flags=re.I)
    #image_name = re.sub(r'[_-]+', ' ', image_name)
    image_name = re.sub(r'\s+', ' ', image_name).strip()
    # Construire le nouveau chemin img
    new_img = f'/assets/formations/{image_name}.jpeg'
    return new_img
    

def extract_group_from_location(location: str) -> str:
    """
    Extrait l'image à partir du chemin du fichier PDF.
    Exemple: '/fichiers/DIVLAB_30-days-of-react-ebook-free.pdf' -> 'DIVLAB_30-days-of-react-ebook-free'
    """
    if not location:
        return "Inconnu"
    group_name = location.split("/")[2]
    group_name = "Formations" if "formations" in group_name.lower() else "Ebooks"
    return group_name
    


def categorize(title: str, description: str) -> str:
    """
    Détermine automatiquement une catégorie professionnelle à partir
    d’un titre et d’une description.
    Fonction extensible, basée sur un dictionnaire de mots-clés.
    """
    
    text = f"{title} {description}".lower()

    # Dictionnaire professionnel et extensible de catégories → mots-clés
    categories_keywords = {
        "Intelligence Artificielle / Machine Learning": [
            "ai", "artificial intelligence", "machine learning", "deep learning",
            "neural", "neural network", "tensorflow", "pytorch", "yolo", "cnn",
            "rnn", "nlp", "computer vision", "reinforcement learning"
        ],
        "Data Science / Data Engineering": [
            "data", "pandas", "numpy", "python", "jupyter", "etl",
            "data engineer", "pipeline", "spark", "hadoop", "data mining",
            "data analysis", "extraction", "big data"
        ],
        "Développement Web": [
            "web", "javascript", "js", "react", "vue", "angular",
            "html", "css", "sass", "tailwind", "bootstrap",
            "nextjs", "node", "express", "frontend", "backend",
            "php", "laravel", "django", "flask"
        ],
        "Développement Mobile": [
            "mobile", "android", "ios", "kotlin", "swift",
            "flutter", "react native", "app", "apk"
        ],
        "Cybersécurité": [
            "cyber", "cybersecurity", "security", "pentest",
            "vulnerability", "attack", "malware", "defense",
            "cryptography", "forensics", "ethical hacking"
        ],
        "DevOps / Cloud": [
            "devops", "docker", "kubernetes", "ci/cd",
            "aws", "azure", "gcp", "cloud", "terraform", "ansible"
        ],
        "Réseaux & Télécommunications": [
            "network", "réseau", "switch", "routeur", "tcp", "udp",
            "cisco", "telecom", "5g", "4g", "fiber"
        ],
        "Hardware / Électronique": [
            "hardware", "arduino", "raspberry", "capteur", "sensor",
            "microcontroller", "pcb", "electronics"
        ],
        "Mathématiques / Statistiques": [
            "stat", "statistic", "probability", "probabilités",
            "linear algebra", "optimisation", "math", "equation"
        ],
        "Business / Finance / Gestion": [
            "business", "excel", "finance", "gestion", "market",
            "entreprise", "budget", "analyse financière", "comptabilité",
            "management", "marketing"
        ],
        "Design / UI-UX": [
            "figma", "design", "ui", "ux", "interface",
            "graphisme", "photoshop", "illustrator"
        ],
        "Cloud / Systèmes": [
            "linux", "windows server", "sysadmin", "administration",
            "virtualization", "vmware", "hyper-v"
        ],
        "Jeux Vidéo / Game Development": [
            "unity", "unreal", "game", "gaming", "godot"
        ],
        "Autres": []
    }

    # Parcourt le dictionnaire et retourne la première catégorie correspondante
    for category, keywords in categories_keywords.items():
        if any(k in text for k in keywords):
            return category

    return "Autres"



def normalize_text(text: str) -> str:
    """
    Nettoie et normalise le texte : espaces, retours ligne, etc.
    """
    if not text:
        return ""
    text = re.sub(r'\s+', ' ', text).strip()
    return text


def extract_pdf_metadata(location: str) -> tuple[str, int]:
    """
    Extrait l'auteur et le nombre de pages d’un PDF.
    Retourne ('Inconnu', 0) si le fichier n'existe pas ou est illisible.
    """
    try:
        pdf_path = location
        if not os.path.exists(pdf_path):
            pdf_path = os.path.join(pdf_base_path, os.path.basename(location))
        if not os.path.exists(pdf_path):
            return ("Inconnu", 0)
        reader = PdfReader(pdf_path)
        pages = len(reader.pages)
        meta = reader.metadata
        if not meta:
            return ("Inconnu", pages)
        author = meta.get("/Author", "") or meta.get("Author", "")
        if not author:
            return ("Inconnu", pages)
        author = reader.metadata.get('/Author', 'Inconnu') or reader.metadata.get("Author", "")
        
        return (str(author).strip(), pages)
    except Exception:
        return ("Inconnu", 0)

# ============================
# EXTRACTION DU TABLEAU
# ============================
with open(input_file, "r", encoding="utf-8") as f:
    js_content = f.read()

pattern = r"export const OnlineFormations\s*=\s*(\[[\s\S]*?\]);"
match = re.search(pattern, js_content)

if not match:
    raise ValueError("Le tableau OnlineFormations n’a pas été trouvé dans data.js")

array_js = match.group(1)

# Nettoyage du format JS → JSON
array_clean = (
    array_js
    .replace("'", '"')                       # apostrophes → guillemets doubles
    .replace("\\'", "'")                     # corriger les échappements d'apostrophes
    #.replace("\n", " ")                      # éviter les retours à la ligne cassants
    #.replace("’",'"')
)


# 🧹 Correction des guillemets et échappements
# 1. Supprimer les guillemets cassés de style JS’
array_clean = array_clean.replace('\\"', '`')
array_clean = array_clean.replace('\\’', '`')
# 2. Corriger les guillemets dans les textes (we"re -> we\'re)
#array_clean = re.sub(r'(?<=\w)"(?=\w)', "'", array_clean)
# 3. Remplacer tous les guillemets simples extérieurs par des doubles (JSON exige des doubles)
array_clean = re.sub(r"'", '"', array_clean)
# 4. Corriger les barres inverses orphelines
array_json = re.sub(r'\\(?![nrt"\\/bfu])', r'\\\\', array_clean)

# ✅ Correction des guillemets mal échappés
array_json = array_json.replace('\\"', '`').replace("“", '"').replace("”", '"')

# Vérification JSON
try:
    data = json.loads(array_json)
except json.JSONDecodeError as e:
    print("⚠️ Erreur de parsing JSON :", e)
    print("\n--- Aperçu du contenu problématique ---")
    print(array_json[:1000])
    with open("error_preview.json", "w", encoding="utf-8") as err:
        err.write(array_json)
    print("\n🔎 Un extrait a été enregistré dans error_preview.json pour analyse.")
    exit()

# ============================
# RESTRUCTURATION
# ============================
new_data = []
for item in data:
    location = item.get("location", "")
    description = normalize_text(item.get("description", ""))
    title = extract_title_from_location(location)
    category = categorize(title, description)
    author, pages = extract_pdf_metadata(location)
    class_type, format_type = extract_class_and_format_from_location(location)
    same_class = item.get("class", "")
    same_format = item.get("format", "")
    image_name = extract_image_from_location(location)
    # group = extract_group_from_location(image_name)
    group = "Formations"


    new_item = {
        "Id": item.get("id"),
        "Title": title,
        "Location": location,
        "Format": same_format,
        "Class": same_class,
        "Description": description,
        "Img": image_name,
        "Group": group,
        "Category": category,
        "Author": author,
        "Pages": pages
    }
    new_data.append(new_item)

# ============================
# SAUVEGARDE DU NOUVEAU FICHIER
# ============================
json_str = json.dumps(new_data, indent=4, ensure_ascii=False)
final_js = re.sub(r'"(\w+)":', r"\1:", json_str)
new_js_content = re.sub(pattern, f"export const OnlineFormations = {final_js};", js_content)

with open(output_file, "w", encoding="utf-8") as f:
    f.write(new_js_content)

print("✅ Restructuration terminée avec succès !")
print(f"📂 Nouveau fichier : {output_file}")
