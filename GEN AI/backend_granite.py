#!/usr/bin/env python3
"""
AI Audiobook Creator - IBM Granite Integration Backend
Provides enhanced text processing and AI capabilities using IBM Granite model
"""

import os
import json
import logging
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import requests
from datetime import datetime
import re

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# IBM Granite Configuration
class GraniteConfig:
    def __init__(self):
        self.api_key = os.getenv('IBM_GRANITE_API_KEY', '')
        self.base_url = os.getenv('IBM_GRANITE_URL', 'https://bam-api.res.ibm.com/v1')
        self.model_id = os.getenv('IBM_GRANITE_MODEL', 'ibm/granite-13b-chat-v2')
        self.max_tokens = 2048
        self.temperature = 0.7

granite_config = GraniteConfig()

class GraniteService:
    def __init__(self, config):
        self.config = config
        self.headers = {
            'Authorization': f'Bearer {config.api_key}',
            'Content-Type': 'application/json'
        }
    
    def generate_text(self, prompt, max_tokens=None, temperature=None):
        """Generate text using IBM Granite model"""
        try:
            payload = {
                'model_id': self.config.model_id,
                'input': prompt,
                'parameters': {
                    'max_new_tokens': max_tokens or self.config.max_tokens,
                    'temperature': temperature or self.config.temperature,
                    'top_p': 0.9,
                    'top_k': 50
                }
            }
            
            response = requests.post(
                f'{self.config.base_url}/text/generation',
                headers=self.headers,
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                result = response.json()
                return {
                    'success': True,
                    'text': result.get('results', [{}])[0].get('generated_text', ''),
                    'tokens_used': result.get('results', [{}])[0].get('token_count', 0)
                }
            else:
                logger.error(f"Granite API error: {response.status_code} - {response.text}")
                return {
                    'success': False,
                    'error': f"API error: {response.status_code}"
                }
                
        except Exception as e:
            logger.error(f"Granite service error: {str(e)}")
            return {
                'success': False,
                'error': str(e)
            }

granite_service = GraniteService(granite_config)

@app.route('/')
def index():
    """Serve the main application"""
    return send_from_directory('.', 'standalone_fixed.html')

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'granite_configured': bool(granite_config.api_key)
    })

@app.route('/api/granite/enhance-text', methods=['POST'])
def enhance_text():
    """Enhance text content using IBM Granite model"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        enhancement_type = data.get('type', 'improve')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        prompts = {
            'improve': f"""Please improve the following text for audiobook narration. Make it more engaging, clear, and suitable for spoken audio while maintaining the original meaning:

Text: {text}

Enhanced version:""",
            
            'summarize': f"""Create a concise summary of the following text that would work well as an audiobook chapter introduction:

Text: {text}

Summary:""",
            
            'expand': f"""Expand the following text to make it more detailed and engaging for audiobook listeners, adding relevant context and descriptions:

Text: {text}

Expanded version:""",
            
            'chapters': f"""Analyze the following text and suggest better chapter divisions and titles for an audiobook format:

Text: {text}

Suggested chapter structure:"""
        }
        
        prompt = prompts.get(enhancement_type, prompts['improve'])
        result = granite_service.generate_text(prompt)
        
        if result['success']:
            return jsonify({
                'enhanced_text': result['text'].strip(),
                'original_length': len(text),
                'enhanced_length': len(result['text']),
                'tokens_used': result.get('tokens_used', 0),
                'enhancement_type': enhancement_type
            })
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        logger.error(f"Text enhancement error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/granite/generate-script', methods=['POST'])
def generate_script():
    """Generate an audiobook script using IBM Granite model"""
    try:
        data = request.get_json()
        topic = data.get('topic', '')
        chapters = data.get('chapters', 5)
        style = data.get('style', 'educational')
        
        if not topic:
            return jsonify({'error': 'No topic provided'}), 400
        
        prompt = f"""Create a detailed audiobook script about "{topic}" with {chapters} chapters. 
Style: {style}

Format each chapter as:
Chapter X: [Title]
[Content suitable for audio narration]

Make it engaging, informative, and well-structured for audio consumption. Each chapter should be substantial enough for 3-5 minutes of speaking time.

Audiobook Script:"""
        
        result = granite_service.generate_text(prompt, max_tokens=3000)
        
        if result['success']:
            # Parse the generated script into chapters
            script_text = result['text'].strip()
            chapters_data = parse_script_to_chapters(script_text)
            
            return jsonify({
                'script': script_text,
                'chapters': chapters_data,
                'topic': topic,
                'tokens_used': result.get('tokens_used', 0),
                'generation_time': datetime.now().isoformat()
            })
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        logger.error(f"Script generation error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/granite/analyze-content', methods=['POST'])
def analyze_content():
    """Analyze content for audiobook suitability using IBM Granite model"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({'error': 'No text provided'}), 400
        
        prompt = f"""Analyze the following text for audiobook production. Provide insights on:
1. Readability score for audio narration
2. Estimated speaking time
3. Suggested improvements for audio format
4. Chapter structure recommendations
5. Voice and pacing suggestions

Text: {text}

Analysis:"""
        
        result = granite_service.generate_text(prompt)
        
        if result['success']:
            analysis = result['text'].strip()
            
            # Calculate basic metrics
            word_count = len(text.split())
            estimated_minutes = round(word_count / 150)  # ~150 WPM average
            character_count = len(text)
            
            return jsonify({
                'analysis': analysis,
                'metrics': {
                    'word_count': word_count,
                    'character_count': character_count,
                    'estimated_minutes': estimated_minutes,
                    'estimated_hours': round(estimated_minutes / 60, 1)
                },
                'tokens_used': result.get('tokens_used', 0)
            })
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        logger.error(f"Content analysis error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/granite/suggest-voices', methods=['POST'])
def suggest_voices():
    """Suggest voice characteristics using IBM Granite model"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        genre = data.get('genre', 'general')
        
        prompt = f"""Based on the following text content and genre "{genre}", suggest optimal voice characteristics for audiobook narration:

Text sample: {text[:500]}...

Please suggest:
1. Voice type (male/female/neutral)
2. Tone and style
3. Pacing recommendations
4. Accent or regional considerations
5. Emotional delivery notes

Voice recommendations:"""
        
        result = granite_service.generate_text(prompt, max_tokens=1000)
        
        if result['success']:
            return jsonify({
                'suggestions': result['text'].strip(),
                'genre': genre,
                'tokens_used': result.get('tokens_used', 0)
            })
        else:
            return jsonify({'error': result['error']}), 500
            
    except Exception as e:
        logger.error(f"Voice suggestion error: {str(e)}")
        return jsonify({'error': str(e)}), 500

def parse_script_to_chapters(script_text):
    """Parse generated script into chapter structure"""
    chapters = []
    chapter_pattern = r'Chapter\s+(\d+):\s*([^\n]+)\n(.*?)(?=Chapter\s+\d+:|$)'
    
    matches = re.finditer(chapter_pattern, script_text, re.DOTALL | re.IGNORECASE)
    
    for match in matches:
        chapter_num = match.group(1)
        title = match.group(2).strip()
        content = match.group(3).strip()
        
        chapters.append({
            'number': int(chapter_num),
            'title': f"Chapter {chapter_num}: {title}",
            'content': content,
            'status': 'pending'
        })
    
    return chapters

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Endpoint not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500

if __name__ == '__main__':
    # Check for required environment variables
    if not granite_config.api_key:
        logger.warning("IBM_GRANITE_API_KEY not set. Granite features will be disabled.")
    
    print("\n🤖 AI Audiobook Creator with IBM Granite Integration")
    print("="*50)
    print(f"Granite Model: {granite_config.model_id}")
    print(f"API Configured: {'Yes' if granite_config.api_key else 'No'}")
    print("="*50)
    print("🌐 Server starting on http://localhost:5000")
    print("📱 Access the app at: http://localhost:5000")
    print("\n💡 To enable Granite features, set environment variables:")
    print("   IBM_GRANITE_API_KEY=your_api_key")
    print("   IBM_GRANITE_URL=your_endpoint_url")
    print("   IBM_GRANITE_MODEL=ibm/granite-13b-chat-v2")
    
    app.run(debug=True, host='0.0.0.0', port=5000)