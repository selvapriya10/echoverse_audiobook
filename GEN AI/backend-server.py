#!/usr/bin/env python3
"""
Advanced AI Audiobook Creator - Backend Server
Integrates IBM Watson Text-to-Speech and Watsonx LLM for tone-adaptive audiobook creation
"""

import os
import json
import base64
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import requests
from io import BytesIO
import tempfile

app = Flask(__name__)
CORS(app)

# Configuration (replace with actual API keys)
WATSON_TTS_CONFIG = {
    'api_key': os.getenv('WATSON_TTS_API_KEY', 'your_api_key_here'),
    'url': os.getenv('WATSON_TTS_URL', 'https://api.us-south.text-to-speech.watson.cloud.ibm.com'),
}

WATSONX_CONFIG = {
    'api_key': os.getenv('WATSONX_API_KEY', 'your_api_key_here'),
    'url': os.getenv('WATSONX_URL', 'https://us-south.ml.cloud.ibm.com'),
    'project_id': os.getenv('WATSONX_PROJECT_ID', 'your_project_id_here')
}

WATSON_VOICES = {
    'lisa': 'en-US_LisaV3Voice',
    'michael': 'en-US_MichaelV3Voice',
    'allison': 'en-US_AllisonV3Voice'
}

TONE_PROMPTS = {
    'neutral': "Rewrite the following text in a neutral, factual tone while preserving all key information:",
    'suspenseful': "Rewrite the following text in a suspenseful, dramatic tone that builds tension:",
    'inspiring': "Rewrite the following text in an inspiring, motivational tone that uplifts the reader:"
}

@app.route('/')
def index():
    return send_file('advanced-audiobook.html')

@app.route('/api/rewrite-text', methods=['POST'])
def rewrite_text():
    """Rewrite text using IBM Watsonx LLM with specified tone"""
    try:
        data = request.json
        text = data.get('text', '')
        tone = data.get('tone', 'neutral')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # For demo purposes, use local simulation
        # In production, replace with actual Watsonx API call
        rewritten = simulate_watsonx_rewrite(text, tone)
        
        return jsonify({
            'original_text': text,
            'rewritten_text': rewritten,
            'tone': tone,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-speech', methods=['POST'])
def generate_speech():
    """Generate speech using IBM Watson Text-to-Speech"""
    try:
        data = request.json
        text = data.get('text', '')
        voice = data.get('voice', 'lisa')
        speed = data.get('speed', 1.0)
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
            
        # For demo purposes, simulate Watson TTS
        # In production, replace with actual Watson TTS API call
        audio_url = simulate_watson_tts(text, voice, speed)
        
        return jsonify({
            'audio_url': audio_url,
            'voice': voice,
            'status': 'success'
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download-audio/<audio_id>')
def download_audio(audio_id):
    """Download generated audio file"""
    try:
        # In production, retrieve actual audio file
        # For demo, return a placeholder
        return jsonify({'message': 'Audio download would be implemented here'})
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def simulate_watsonx_rewrite(text, tone):
    """Simulate IBM Watsonx text rewriting (replace with actual API call)"""
    
    tone_adjustments = {
        'neutral': {
            'replacements': {
                'majestically': 'prominently',
                'ancient': 'old',
                'mysterious': 'unexplained',
                'emerged': 'appeared',
                'loomed': 'stood'
            }
        },
        'suspenseful': {
            'replacements': {
                'stood majestically': 'loomed ominously',
                'ancient stones': 'crumbling stones that seemed to whisper dark secrets',
                'emerged': 'crept out like a shadow',
                'moved with purpose': 'moved with sinister, calculated intent',
                'discovery': 'shocking, spine-chilling revelation',
                'mysterious events': 'dark, terrifying incidents that defy explanation',
                'brave enough': 'foolish enough to dare venture',
                'within its walls': 'trapped within its haunted walls',
                'figure': 'shadowy figure'
            }
        },
        'inspiring': {
            'replacements': {
                'stood majestically': 'stood as a magnificent beacon of resilience and hope',
                'weathered by': 'strengthened and refined by',
                'countless stories': 'countless tales of triumph, courage, and human spirit',
                'emerged': 'stepped forth confidently with renewed purpose',
                'discovery': 'life-changing, magnificent discovery',
                'change everything': 'transform lives and inspire generations to come',
                'brave enough': 'courageous and determined enough',
                'revelations': 'profound, life-changing insights',
                'mysterious': 'wondrous and awe-inspiring',
                'ancient': 'timeless and revered'
            }
        }
    }

    rewritten = text
    adjustments = tone_adjustments.get(tone, tone_adjustments['neutral'])
    
    for original, replacement in adjustments['replacements'].items():
        rewritten = rewritten.replace(original, replacement)
    
    return rewritten

def simulate_watson_tts(text, voice, speed):
    """Simulate IBM Watson TTS (replace with actual API call)"""
    # In production, this would call the actual Watson TTS API
    # and return a URL to the generated audio file
    return f"/api/audio/simulated_{voice}_{len(text)}.mp3"

def call_watsonx_api(text, tone):
    """Make actual API call to IBM Watsonx (requires valid credentials)"""
    headers = {
        'Authorization': f'Bearer {WATSONX_CONFIG["api_key"]}',
        'Content-Type': 'application/json'
    }
    
    prompt = f"{TONE_PROMPTS[tone]}\n\nText: {text}\n\nRewritten text:"
    
    payload = {
        'model_id': 'ibm/granite-13b-chat-v2',
        'input': prompt,
        'parameters': {
            'max_new_tokens': len(text) * 2,
            'temperature': 0.7
        },
        'project_id': WATSONX_CONFIG['project_id']
    }
    
    response = requests.post(
        f"{WATSONX_CONFIG['url']}/ml/v1-beta/generation/text",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        return response.json()['results'][0]['generated_text']
    else:
        raise Exception(f"Watsonx API error: {response.text}")

def call_watson_tts_api(text, voice, speed):
    """Make actual API call to IBM Watson TTS (requires valid credentials)"""
    import base64
    
    headers = {
        'Authorization': f'Basic {base64.b64encode(f"apikey:{WATSON_TTS_CONFIG["api_key"]}".encode()).decode()}',
        'Content-Type': 'application/json',
        'Accept': 'audio/mp3'
    }
    
    payload = {
        'text': text,
        'voice': WATSON_VOICES[voice],
        'accept': 'audio/mp3'
    }
    
    response = requests.post(
        f"{WATSON_TTS_CONFIG['url']}/v1/synthesize",
        headers=headers,
        json=payload
    )
    
    if response.status_code == 200:
        return response.content
    else:
        raise Exception(f"Watson TTS API error: {response.text}")

if __name__ == '__main__':
    print("🎭 Advanced AI Audiobook Creator Backend")
    print("🔗 Frontend: http://localhost:5000")
    print("📡 API: http://localhost:5000/api/")
    print("⚙️ Configure IBM Watson credentials in config.py")
    app.run(debug=True, port=5000)