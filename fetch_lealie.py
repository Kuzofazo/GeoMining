import urllib.request
import traceback

try:
    req = urllib.request.Request(
        'https://lealieentinc.com/', 
        headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
    )
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        with open('lealie_html.txt', 'w', encoding='utf-8') as f:
            f.write(html)
    print("Success")
except Exception as e:
    print(traceback.format_exc())
