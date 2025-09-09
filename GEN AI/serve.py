#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.path.dirname(os.path.abspath(__file__)), **kwargs)

print(f"🎧 AI Audiobook Creator")
print(f"📡 Starting server at http://localhost:{PORT}")
print(f"🌐 Opening browser...")

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    webbrowser.open(f'http://localhost:{PORT}/standalone.html')
    print(f"✅ Server running. Press Ctrl+C to stop.")
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print(f"\n🛑 Server stopped.")
        httpd.shutdown()