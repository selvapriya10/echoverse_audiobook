# IBM Watson API Configuration
# Copy this file to config.py and add your actual API credentials

# IBM Watson Text-to-Speech Configuration
WATSON_TTS_CONFIG = {
    'api_key': 'your_watson_tts_api_key_here',
    'url': 'https://api.us-south.text-to-speech.watson.cloud.ibm.com',
    'instance_id': 'your_instance_id_here'
}

# IBM Watsonx LLM Configuration  
WATSONX_CONFIG = {
    'api_key': 'your_watsonx_api_key_here',
    'url': 'https://us-south.ml.cloud.ibm.com',
    'project_id': 'your_project_id_here'
}

# Voice Options for Watson TTS
WATSON_VOICES = {
    'lisa': 'en-US_LisaV3Voice',
    'michael': 'en-US_MichaelV3Voice', 
    'allison': 'en-US_AllisonV3Voice'
}

# Tone Rewriting Prompts for Watsonx
TONE_PROMPTS = {
    'neutral': "Rewrite the following text in a neutral, factual tone while preserving all key information and meaning:",
    'suspenseful': "Rewrite the following text in a suspenseful, dramatic tone that builds tension and creates anticipation:",
    'inspiring': "Rewrite the following text in an inspiring, motivational tone that uplifts and encourages the reader:"
}