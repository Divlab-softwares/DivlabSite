import os
import re
from PyPDF2 import PdfReader

def read_pdf_metadata_and_text(file_path):
    """Lit les métadonnées et le texte d'un PDF"""
    metadata_info = {}
    full_text = ""
    
    if not os.path.exists(file_path):
        return metadata_info, full_text
    
    try:
        reader = PdfReader(file_path)
        metadata = reader.metadata
        if metadata:
            # Extraction des champs clés
            metadata_info['author'] = metadata.get('/Author', '') or metadata.get("Author", "")
            metadata_info['title'] = metadata.get('/Title', '') or metadata.get("Title", "")
            metadata_info['subject'] = metadata.get('/Subject', '') or metadata.get("Subject", "")
            metadata_info['keywords'] = metadata.get('/Keywords', '') or metadata.get("Keywords", "")
            metadata_info['producer'] = metadata.get('/Producer', '') or metadata.get("Producer", "")
            metadata_info['creator'] = metadata.get('/Creator', '') or metadata.get("Creator", "")
        
        # Lecture du texte
        for page in reader.pages:
            full_text += page.extract_text() or ""
    except Exception as e:
        print(f"Erreur lecture PDF {file_path}: {e}")
    
    return metadata_info, full_text


def detect_license_in_text(text):
    """Détecte si le texte contient des mentions de licence"""
    if not text:
        return False
    patterns = [
        "all rights reserved",
        "creative commons",
        "licen[cs]e",
        "usage commercial interdit",
        "copyright",
        "by-nc",
        "cc-by",
        "propriété intellectuelle",
        "rights reserved"
    ]
    text_lower = text.lower()
    return any(p in text_lower for p in patterns)


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
    title = re.sub(r'\.png$', '', title, flags=re.I)
    title = re.sub(r'\.jpeg$', '', title, flags=re.I)
    title = re.sub(r'\.mp4$', '', title, flags=re.I)
    title = re.sub(r'book[_-]cover', ' ', title)
    title = re.sub(r'[_-]+', ' ', title)
    title = re.sub(r'\s+', ' ', title).strip().title()
    return title

def classify_document(file_path):
    """
    Renvoie:
    - class_type: "Sous licence" ou "Libre"
    - author: extrait depuis metadata ou texte
    - title: extrait depuis metadata si possible
    """
    metadata, full_text = read_pdf_metadata_and_text(file_path)
    
    # Auteur
    author = metadata.get("author", "").strip() 
    if not author:
        # heuristique simple: chercher une ligne copyright dans le texte
        lines = full_text.splitlines()
        for line in lines[:50]:  # on regarde juste les premières lignes
            if "©" in line or "copyright" in line.lower():
                author = line.strip()
                break
    
    # Titre
    meta_title = metadata.get('title', '').strip()
    title = extract_title_from_location(meta_title)
    if not title:
        # heuristique: récupérer nom du fichier sans extension
        title = extract_title_from_location(file_path)
    
    # Classe
    if detect_license_in_text(full_text) or "license" in metadata.get('keywords', '').lower():
        class_type = "Sous licence"
    else:
        class_type = "Libre"
    
    return {
        "Class": class_type,
        "Author": author,
        "Title": title
    }


# --- Exemple d'utilisation ---
if __name__ == "__main__":
    pdf_path = "../../public/fichiers/DIVLAB_30-days-of-react-ebook-free.pdf"
    result = classify_document(pdf_path)
    print(result)
    # Sortie possible :
    # {'Class': 'Libre', 'Author': 'FULLSTACK.io', 'Title': 'DIVLAB_30-days-of-react-ebook-free'}
