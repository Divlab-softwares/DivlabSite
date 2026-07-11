import os
import json
import re
from pathlib import Path
from PyPDF2 import PdfReader
from docx import Document

DATA_FILE = "data_restructured.js"
EPREUVES_DIR = "../../public/fichiers/epreuves"

# ---------------------------
# 1️⃣ Extraction du texte
# ---------------------------
def extract_text_from_file(file_path):
    text = ""
    ext = file_path.suffix.lower()

    try:
        if ext == ".pdf":
            reader = PdfReader(str(file_path))
            for page in reader.pages:
                text += page.extract_text() or ""
        elif ext in [".docx", ".doc"]:
            doc = Document(str(file_path))
            text = "\n".join([p.text for p in doc.paragraphs])
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                text = f.read()
    except Exception as e:
        print(f"⚠️ Erreur lecture {file_path.name}: {e}")

    return text.lower()

# ---------------------------
# 2️⃣ Détection du titre
# ---------------------------
def detect_title(text):
    patterns = [
        r"épreuve de ([^\n\.]+)",
        r"examen de ([^\n\.]+)",
        r"évaluation de ([^\n\.]+)",
    ]
    for pat in patterns:
        match = re.search(pat, text, re.IGNORECASE)
        if match:
            return f"Epreuve de {match.group(1).strip().title()}"
    return None

# ---------------------------
# 3️⃣ Catégorisation par mots-clés
# ---------------------------
def categorize_text(text):
    categories = {
        "Mathématiques": ["équation", "dérivée", "intégrale", "analyse", "algèbre", "probabilité", "statistique"],
        "Intelligence Artificielle": ["deep learning", "machine learning", "réseaux de neurones", "intelligence", "ia"],
        "Programmation": ["python", "java", "code", "programmation", "algorithmique"],
        "Réseaux": ["tcp", "ip", "réseau", "communication", "serveur", "client"],
        "Data Science": ["données", "data", "analyse", "pandas", "matplotlib"]
    }

    scores = {cat: 0 for cat in categories}
    for cat, keywords in categories.items():
        for kw in keywords:
            scores[cat] += len(re.findall(rf"\b{kw}\b", text))

    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "Autres"

# ---------------------------
# 4️⃣ Détection du type d'épreuve
# ---------------------------
def detect_type(text):
    types = {
        "Examen": ["examen", "test final", "partiel"],
        "Concours": ["concours", "épreuve d’entrée"],
        "TD": ["travaux dirigés", "td", "exercice"],
        "TP": ["travaux pratiques", "tp"]
    }

    scores = {t: 0 for t in types}
    for t, kws in types.items():
        for kw in kws:
            scores[t] += len(re.findall(rf"\b{kw}\b", text))

    return max(scores, key=scores.get)

# ---------------------------
# 5️⃣ Image selon école
# ---------------------------
def get_school_image(school):
    school = school.lower()
    if "ensae" in school:
        return "/assets/epreuve/ENSAE.jpeg"
    elif "polytech" in school:
        return "/assets/epreuve/POLYTECH.jpeg"
    elif "iast" in school:
        return "/assets/epreuve/IAST.jpeg"
    elif "ensdp" in school:
        return "/assets/epreuve/IAST.jpeg"
    else:
        return "/assets/epreuve/default.jpeg"

# ---------------------------
# 6️⃣ Injection dans data.js
# ---------------------------
def update_data_js(new_entries):
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        content = f.read()

    pattern = r"(export const Papers\s*=\s*)(\[.*?\])"
    match = re.search(pattern, content, re.DOTALL)

    if match:
        raw_js_array = match.group(2)

        # 🔧 Correction automatique pour passer de JS → JSON
        js_to_json = (
            raw_js_array
            .replace("'", '"')                      # simples → doubles guillemets
            .replace("True", "true")                # booleens
            .replace("False", "false")
            .replace("None", "null")
        )
        js_to_json = re.sub(r'(\w+):', r'"\1":', js_to_json)  # ajoute guillemets autour des clés

        try:
            existing_array = json.loads(js_to_json)
        except Exception as e:
            print("⚠️ Erreur JSON encore présente :", e)
            print("Voici un extrait du texte lu :\n", js_to_json[:300])
            existing_array = []
        combined = existing_array + new_entries
        updated = f"{match.group(1)}{json.dumps(combined, indent=4, ensure_ascii=False)}"
        new_content = re.sub(pattern, updated, content, flags=re.DOTALL)
    else:
        insertion = f"\n\nexport const Papers = {json.dumps(new_entries, indent=4, ensure_ascii=False)};"
        new_content = content + insertion

    with open(DATA_FILE, "w", encoding="utf-8") as f:
        f.write(new_content)
    print("✅ data.js mis à jour avec succès !")

# ---------------------------
# 🚀 Main
# ---------------------------
if __name__ == "__main__":
    files = list(Path(EPREUVES_DIR).glob("*.*"))
    papers = []

    for i, file in enumerate(files, start=1):
        print(f"\n📘 Traitement du fichier: {file.name}")
        text = extract_text_from_file(file)

        title = detect_title(text)
        if not title:
            title = input(f"❓Titre non détecté pour {file.name}. Entrez le titre : ")

        format_ = file.suffix.replace(".", "")
        school = input(f"🏫 École pour {file.name} : ")
        level = input(f"🎓 Niveau : ")
        year = input(f"📅 Année (ex: 2022-2023) : ")
        cursus = input(f"📅 Cursus : (ex: science de l'ingenieur):")
        filiere = input(f"📅 Filière (ex: GLO (genie logiciel)): ")

        category = categorize_text(text)
        type_ = detect_type(text)
        img = get_school_image(school)

        paper = {
            "Id": i,
            "Title": title,
            "Location": f"/fichiers/epreuves/{file.name}",
            "Format": format_,
            "Class": "free",
            "Description": " ",
            "Img": img,
            "Group": "Epreuves",
            "Category": category,
            "School": school,
            "Type": type_,
            "Level": level,
            "Year": year,
            "Cursus": cursus,
            "Filiere": filiere
        }
        papers.append(paper)

    update_data_js(papers)
