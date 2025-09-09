# AI Audiobook Creator - IBM Granite Integration

This enhanced version of the AI Audiobook Creator integrates with IBM's Granite foundation model to provide advanced AI-powered text processing and content generation capabilities.

## 🤖 IBM Granite Features

### Text Enhancement
- **Improve Text**: Enhance existing content for better audiobook narration
- **Summarize**: Create concise summaries suitable for audio format
- **Expand Content**: Add detail and context for richer listening experience
- **Chapter Suggestions**: AI-powered chapter structure recommendations
- **Content Generation**: Generate entirely new audiobook content from topics

### AI-Powered Analysis
- **Content Analysis**: Evaluate text suitability for audiobook production
- **Voice Recommendations**: Suggest optimal voice characteristics
- **Script Generation**: Create complete audiobook scripts from topics

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- IBM Granite API access (optional - has local fallback)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements_granite.txt
   ```

2. **Configure IBM Granite (Optional)**
   ```bash
   # Copy the example environment file
   copy .env.example .env
   
   # Edit .env and add your credentials:
   IBM_GRANITE_API_KEY=your_api_key_here
   IBM_GRANITE_URL=https://bam-api.res.ibm.com/v1
   IBM_GRANITE_MODEL=ibm/granite-13b-chat-v2
   ```

3. **Run the Application**
   ```bash
   # Easy start with batch file
   run_granite.bat
   
   # Or manually
   python backend_granite.py
   ```

4. **Access the Application**
   - Open browser to: http://localhost:5000
   - The enhanced interface includes IBM Granite AI features

## 🎯 How to Use IBM Granite Features

### 1. Text Enhancement
1. Enter or paste your text content
2. Select enhancement type:
   - **Improve Text**: Better flow and clarity
   - **Summarize**: Condensed version
   - **Expand Content**: More detailed version
   - **Suggest Chapters**: AI chapter structure
3. Click "🤖 Enhance with Granite AI"
4. Review and use the enhanced content

### 2. Content Generation
1. Select "Generate New Content" from dropdown
2. Enter a topic in the prompt field
3. Click "🤖 Enhance with Granite AI"
4. Get a complete 5-chapter audiobook script

### 3. Fallback Mode
- If IBM Granite API is not configured, the app uses local fallbacks
- Basic text processing still available without API
- All core audiobook features remain functional

## 🔧 Configuration Options

### Environment Variables
```bash
# Required for full Granite features
IBM_GRANITE_API_KEY=your_key

# Optional - defaults provided
IBM_GRANITE_URL=https://bam-api.res.ibm.com/v1
IBM_GRANITE_MODEL=ibm/granite-13b-chat-v2

# Server settings
FLASK_ENV=development
FLASK_DEBUG=true
```

### Model Options
- `ibm/granite-13b-chat-v2` (default)
- `ibm/granite-20b-multilingual`
- `ibm/granite-34b-code-instruct`

## 🌟 Enhanced Workflow

### Traditional Workflow
1. Write/import text
2. Generate speech
3. Play audiobook
4. Export files

### Granite-Enhanced Workflow
1. **Generate/Import** content with AI assistance
2. **Enhance** text using Granite AI
3. **Analyze** content for audiobook suitability
4. **Generate** speech with AI-optimized content
5. **Export** professional audiobooks

## 🛡️ Privacy & Security

- **Local Processing**: Fallback mode works entirely offline
- **API Security**: Communications encrypted via HTTPS
- **No Data Storage**: Text is processed in real-time, not stored
- **User Control**: Choose when to use AI enhancement

## 🔍 Troubleshooting

### Common Issues

**"Granite backend not available"**
- Backend server not running
- Check if Python dependencies installed
- Verify port 5000 is available

**"Enhancement failed"**
- Check IBM Granite API key configuration
- Verify internet connection
- Try local fallback mode

**"API request failed"**
- Validate API credentials in .env file
- Check IBM Granite service status
- Review API usage limits

### Debug Mode
```bash
# Run with debug logging
FLASK_DEBUG=true python backend_granite.py
```

## 📚 API Endpoints

The backend provides these REST endpoints:

- `GET /health` - Check system status
- `POST /api/granite/enhance-text` - Text enhancement
- `POST /api/granite/generate-script` - Script generation
- `POST /api/granite/analyze-content` - Content analysis
- `POST /api/granite/suggest-voices` - Voice recommendations

## 🤝 Integration Examples

### Custom Enhancement
```javascript
// Frontend JavaScript example
const enhanceText = async (text, type) => {
    const response = await fetch('/api/granite/enhance-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, type })
    });
    return await response.json();
};
```

### Script Generation
```python
# Backend Python example
result = granite_service.generate_text(
    prompt="Create an audiobook about space exploration",
    max_tokens=2000
)
```

## 📈 Benefits

### Content Quality
- **AI-Enhanced**: Professional-grade content improvement
- **Consistency**: Uniform tone and style throughout
- **Accessibility**: Optimized for audio consumption
- **Engagement**: More compelling and listener-friendly

### Productivity
- **Automated Enhancement**: Reduce manual editing time
- **Content Generation**: Create new material quickly
- **Smart Suggestions**: AI-powered recommendations
- **Batch Processing**: Handle multiple chapters efficiently

### Professional Results
- **Industry Standards**: Content meets audiobook production quality
- **Voice Optimization**: Text adapted for speech synthesis
- **Structure Improvement**: Better chapter organization
- **Metadata Generation**: Automatic summaries and descriptions

## 🔄 Updates & Maintenance

- **Model Updates**: Automatically uses latest Granite models
- **Feature Additions**: Regular enhancement capabilities
- **Performance**: Optimized for speed and accuracy
- **Compatibility**: Maintains backward compatibility

## 📞 Support

For issues specific to:
- **IBM Granite API**: Contact IBM Watson support
- **Application Bugs**: Check GitHub issues
- **Feature Requests**: Submit enhancement proposals
- **Integration Help**: Review API documentation

---

**Powered by IBM Granite Foundation Models**
*Enhancing human creativity with AI assistance*