import os
import fitz  # PyMuPDF
import re
import numpy as np
from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer, util

app = Flask(__name__)

# Load AI model for embeddings
model = SentenceTransformer('all-MiniLM-L6-v2')

def extract_text_from_pdf(pdf_path):
    """Extracts text from a PDF file."""
    doc = fitz.open(pdf_path)
    text = "\n".join([page.get_text() for page in doc])
    return text

def clean_text(text):
    """Cleans and tokenizes text."""
    text = text.lower()
    text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
    return text

def get_weighted_score(cv_text, jd_text, skills):
    """Computes AI-based similarity with custom weightage."""
    cv_embedding = model.encode(cv_text, convert_to_tensor=True)
    jd_embedding = model.encode(jd_text, convert_to_tensor=True)
    base_similarity = util.pytorch_cos_sim(cv_embedding, jd_embedding).item()
    
    weighted_score = 0
    total_weight = sum(skills.values()) + 1  # +1 for rest
    
    for skill, weight in skills.items():
        skill_embedding = model.encode(skill, convert_to_tensor=True)
        similarity = util.pytorch_cos_sim(cv_embedding, skill_embedding).item()
        weighted_score += similarity * weight
    
    weighted_score += base_similarity * 1  # Default weight for other words
    weighted_percentage = (weighted_score / total_weight) * 100
    
    return base_similarity * 100, weighted_percentage

@app.route('/match', methods=['POST'])
def match_cvs():
    """API endpoint to match CVs with JD."""
    data = request.json
    jd_path = data.get('jd_path')
    cv_folder = data.get('cv_folder')
    must_have = data.get('must_have', [])
    good_to_have = data.get('good_to_have', [])
    bonus_skills = data.get('bonus_skills', [])
    
    # Read JD text
    with open(jd_path, 'r', encoding='utf-8') as f:
        jd_text = clean_text(f.read())
    
    # Define skill weights
    skill_weights = {}
    for skill in must_have:
        skill_weights[skill] = 3  # High priority
    for skill in good_to_have:
        skill_weights[skill] = 2  # Medium priority
    for skill in bonus_skills:
        skill_weights[skill] = 1  # Low priority
    
    results = []
    for filename in os.listdir(cv_folder):
        if filename.endswith('.pdf'):
            cv_text = clean_text(extract_text_from_pdf(os.path.join(cv_folder, filename)))
            basic_match, weighted_match = get_weighted_score(cv_text, jd_text, skill_weights)
            results.append({
                'cv': filename,
                'basic_match': round(basic_match, 2),
                'weighted_match': round(weighted_match, 2)
            })
    
    results.sort(key=lambda x: x['weighted_match'], reverse=True)  # Rank by weighted match
    return jsonify({'ranked_cvs': results})

if __name__ == '__main__':
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)

