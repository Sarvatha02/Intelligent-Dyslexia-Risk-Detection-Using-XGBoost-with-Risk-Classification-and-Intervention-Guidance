import os
import json
import random
import re

# Load the expanded library
LIBRARY_PATH = os.path.join(os.path.dirname(__file__), 'full_content_library.json')
try:
    with open(LIBRARY_PATH, 'r', encoding='utf-8') as f:
        FULL_LIBRARY = json.load(f)
except Exception as e:
    print(f"Error loading full_content_library.json: {e}")
    FULL_LIBRARY = {}

def get_content_for_age(age, set_index=0):
    is_early = int(age) <= 8
    
    # We use set_index to pick a starting point, but still take a sample
    # to ensure each test has variety even within the set
    def get_slice(key, count=5):
        items = FULL_LIBRARY.get(key, [])
        if not items: return []
        
        # Filter out duplicates to ensure variety
        unique_items = []
        seen_reps = set()
        for item in items:
            # Create a stable representation for checking duplicates
            if key == "sequencing":
                rep = tuple(it.get('image') for it in item.get('items', []))
            elif key == "trace_match":
                rep = item.get('target')
            elif key == "directionality":
                rep = tuple(item.get('sequence', []))
            elif key == "letter_img":
                rep = (item.get('letter'), tuple(item.get('images', [])))
            else:
                rep = json.dumps(item, sort_keys=True)
            
            if rep not in seen_reps:
                seen_reps.add(rep)
                unique_items.append(item)
        
        if not unique_items: return []
        
        # Calculate start position based on set_index
        start = (set_index * count) % len(unique_items)
        
        # Pick the slice from unique items
        result = unique_items[start : start + count]
        if len(result) < count:
            result += unique_items[0 : count - len(result)]
        return result

    # Passage Logic with Emoji Stripping for Seniors
    # We pick a random passage every time to ensure it's different every session
    available_passages = FULL_LIBRARY.get("passages", {}).get("Grade 4-6" if int(age) <= 12 else "Grade 7+", ["The architect observed the complex blueprints carefully."])
    raw_passage = random.choice(available_passages)
    
    if not is_early:
        # Remove any character that is not a standard letter, number, punctuation or whitespace
        clean_passage = re.sub(r'[^\x00-\x7F]+', '', raw_passage).strip()
        # Ensure we don't have double spaces after stripping
        clean_passage = re.sub(r'\s+', ' ', clean_passage)
    else:
        clean_passage = raw_passage

    content = {
        "is_early": is_early,
        "trace_match": get_slice("trace_match", 10), 
        "directionality": get_slice("directionality", 5), 
        "letter_img": get_slice("letter_img", 5),
        "phonic_replacement": get_slice("phonic_replacement", 5),
        "tracing": get_slice("tracing", 5),
        "sequencing": get_slice("sequencing", 5),
        "passage": clean_passage,
        "early_reading_alt": get_slice("early_reading_alt", 5),
        "visual_search": get_slice("visual_search", 5),
        "precision_track": get_slice("precision_track", 5),
        "neural_pattern": get_slice("neural_pattern", 5),
        "spatial_matrix": get_slice("spatial_matrix", 5),
        "phonic_analysis": get_slice("phonic_analysis", 5)
    }
    
    return content
