import urllib.request
import traceback

try:
    req = urllib.request.Request(
        'https://lealieentinc.com/style.css', 
        headers={'User-Agent': 'Mozilla/5.0'}
    )
    with urllib.request.urlopen(req) as response:
        css = response.read().decode('utf-8', errors='ignore')
        with open('lealie_style.css', 'w', encoding='utf-8') as f:
            f.write(css)
    print("Success")
except Exception as e:
    print(traceback.format_exc())
