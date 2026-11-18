"""Genera js/assets-inline.js: i modelli dei pet (JSON) e le immagini piccole
usate dal 3D (texture dei pet, loghi dei mantelli, skin di default) dentro un
file JS. Cosi' lo showcase funziona anche aprendo index.html con doppio clic
(file://), dove il browser blocca fetch() e "sporca" le immagini per WebGL.

Uso (dalla cartella del sito):  python tools/inline-assets.py
Da rilanciare quando cambiano i file in assets/cosmetic o assets/skins.
"""
import base64
import json
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FOLDERS = ['assets/cosmetic', 'assets/skins']

out = {}
for folder in FOLDERS:
    for name in sorted(os.listdir(os.path.join(ROOT, folder))):
        path = f'{folder}/{name}'
        full = os.path.join(ROOT, folder, name)
        if name.endswith('.json'):
            with open(full, encoding='utf-8') as f:
                out[path] = json.load(f)
        elif name.endswith('.png'):
            with open(full, 'rb') as f:
                out[path] = 'data:image/png;base64,' + base64.b64encode(f.read()).decode('ascii')

js = ('/* Generato da tools/inline-assets.py: non modificare a mano. */\n'
      'window.ENDER_ASSETS = ' + json.dumps(out, separators=(',', ':')) + ';\n')
with open(os.path.join(ROOT, 'js', 'assets-inline.js'), 'w', encoding='utf-8', newline='\n') as f:
    f.write(js)
print(f'{len(out)} file, {len(js) // 1024} KB -> js/assets-inline.js')
