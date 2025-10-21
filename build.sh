#!/bin/bash

# Script de build pour Speech Timer
# Ce script crée différentes versions de l'application

echo "🚀 Construction de Speech Timer..."

# Créer le dossier de distribution
mkdir -p dist

# 1. Version HTML Standalone
echo "📄 Création de la version HTML standalone..."
cp speech-timer-standalone.html dist/speech-timer-standalone.html
echo "✅ Version standalone créée: dist/speech-timer-standalone.html"

# 2. Version PWA
echo "📱 Création de la version PWA..."
mkdir -p dist/pwa
cp index.html dist/pwa/
cp script.js dist/pwa/
cp style.css dist/pwa/
cp manifest.json dist/pwa/
cp sw.js dist/pwa/

# Copier les icônes si elles existent
if [ -f "icon-192.png" ]; then
    echo "📱 Copie des icônes PWA..."
    cp icon-192.png dist/pwa/
    cp icon-512.png dist/pwa/
    echo "✅ Icônes PWA copiées"
else
    echo "⚠️  Icônes PWA non trouvées. Création d'icônes de base..."
    # Créer une icône simple avec ImageMagick si disponible
    if command -v convert &> /dev/null; then
        convert -size 192x192 xc:blue -fill white -pointsize 48 -gravity center -annotate +0+0 "⏱️" icon-192.png
        convert -size 512x512 xc:blue -fill white -pointsize 128 -gravity center -annotate +0+0 "⏱️" icon-512.png
        cp icon-192.png dist/pwa/
        cp icon-512.png dist/pwa/
        echo "✅ Icônes de base créées et copiées"
    else
        echo "⚠️  ImageMagick non trouvé. Veuillez ajouter manuellement icon-192.png et icon-512.png"
    fi
fi

# Copier l'icône Electron si elle existe
if [ -f "icon.png" ]; then
    echo "⚡ Copie de l'icône Electron..."
    cp icon.png dist/
    echo "✅ Icône Electron copiée"
fi

echo "✅ Version PWA créée: dist/pwa/"

# 3. Version Electron (si Node.js est installé)
if command -v npm &> /dev/null; then
    echo "⚡ Création des versions Electron..."
    
    # Installer les dépendances si package.json existe
    if [ -f "package.json" ]; then
        echo "📦 Installation des dépendances Electron..."
        npm install
        
        # Build pour toutes les plateformes
        echo "🔨 Construction des exécutables pour toutes les plateformes..."
        
        # Créer les builds pour toutes les plateformes
        echo "🪟 Construction pour Windows (x64 + ARM64)..."
        npm run build-win
        
        echo "🍎 Construction pour macOS (ARM64)..."
        npm run build-mac
        
        echo "🐧 Construction pour Linux (x64 + ARM64)..."
        npm run build-linux
        
        echo "✅ Toutes les versions Electron créées dans dist/"
    else
        echo "⚠️  package.json non trouvé. Création d'un package.json de base..."
        cat > package.json << EOF
{
  "name": "speech-timer",
  "version": "1.0.0",
  "description": "Application de timer pour discours",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder"
  },
  "devDependencies": {
    "electron": "^27.0.0",
    "electron-builder": "^24.6.4"
  }
}
EOF
        echo "📦 Veuillez exécuter 'npm install' puis relancer ce script"
    fi
else
    echo "⚠️  Node.js/npm non trouvé. Version Electron ignorée."
fi

# 4. Créer un README pour la distribution
echo "📝 Création du README de distribution..."
cat > dist/README.md << EOF
# Speech Timer - Versions de Distribution

## 🚀 Versions disponibles

### 1. Version HTML Standalone
- **Fichier**: \`speech-timer-standalone.html\`
- **Usage**: Ouvrir directement dans n'importe quel navigateur
- **Avantages**: Aucune installation requise, fonctionne partout
- **Inconvénients**: Fonctionnalités limitées

### 2. Version PWA (Progressive Web App)
- **Dossier**: \`pwa/\`
- **Usage**: Servir via un serveur web, puis installer via le navigateur
- **Avantages**: Installation native, fonctionne hors ligne
- **Installation**: 
  1. Servir le dossier \`pwa/\` via un serveur web
  2. Ouvrir dans Chrome/Edge
  3. Cliquer sur "Installer l'app" dans la barre d'adresse

### 3. Version Electron (Desktop)
- **Fichiers**: Exécutables dans le dossier parent
- **Usage**: Exécutable natif pour Windows/macOS/Linux
- **Avantages**: Application desktop complète, intégration système
- **Inconvénients**: Plus lourd, nécessite Node.js pour le build

## 📋 Instructions d'utilisation

### Version Standalone
1. Ouvrir \`speech-timer-standalone.html\` dans votre navigateur
2. L'application se charge immédiatement

### Version PWA
1. Servir le dossier \`pwa/\` via un serveur web local ou distant
2. Ouvrir l'URL dans Chrome/Edge
3. Cliquer sur l'icône d'installation dans la barre d'adresse
4. L'app s'installe comme une application native

### Version Electron
1. Exécuter l'installateur généré
2. L'application s'installe dans le menu des applications
3. Fonctionne comme une application desktop classique

## 🔧 Développement

Pour modifier l'application :
1. Éditer les fichiers source (\`index.html\`, \`script.js\`, \`style.css\`)
2. Relancer ce script de build
3. Les nouvelles versions seront générées dans \`dist/\`

## 📱 Fonctionnalités

- ✅ Gestion de multiples timers
- ✅ Export/Import XML
- ✅ Sauvegarde locale
- ✅ Interface responsive
- ✅ Raccourcis clavier
- ✅ Mode plein écran intelligent (PWA et Electron)
- ✅ Installation native (PWA et Electron)
- ✅ Guide d'utilisation intégré
- ✅ Mode plein écran adaptatif pour Windows
- ✅ Boutons de contrôle pour multi-écrans
- ✅ Options de personnalisation avancées
- ✅ Système de flash visuel
- ✅ Messages push aux participants

## 🐛 Support

En cas de problème :
1. Vérifier que JavaScript est activé
2. Vérifier la console du navigateur pour les erreurs
3. S'assurer que les fichiers sont servis via HTTPS (pour PWA)
EOF

echo "✅ README créé: dist/README.md"

# 5. Créer un serveur de test simple
echo "🌐 Création d'un serveur de test..."
cat > dist/test-server.py << EOF
#!/usr/bin/env python3
import http.server
import socketserver
import webbrowser
import os

PORT = 8000

class MyHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

if __name__ == "__main__":
    os.chdir('pwa')
    with socketserver.TCPServer(("", PORT), MyHTTPRequestHandler) as httpd:
        print(f"🚀 Serveur de test démarré sur http://localhost:{PORT}")
        print("📱 Ouvrez cette URL dans Chrome/Edge pour tester la PWA")
        webbrowser.open(f'http://localhost:{PORT}')
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Serveur arrêté")
EOF

chmod +x dist/test-server.py
echo "✅ Serveur de test créé: dist/test-server.py"

echo ""
echo "🎉 Build terminé !"
echo ""
echo "📁 Fichiers générés dans dist/:"
echo "   • speech-timer-standalone.html (version standalone)"
echo "   • pwa/ (version PWA)"
echo "   • Speech Timer-3.0.0-arm64.dmg (macOS ARM64)"
echo "   • Speech Timer Setup 3.0.0.exe (Windows x64)"
echo "   • Speech Timer-3.0.0-arm64.dmg (Windows ARM64)"
echo "   • Speech Timer-3.0.0.AppImage (Linux x64)"
echo "   • Speech Timer-3.0.0-arm64.AppImage (Linux ARM64)"
echo "   • README.md (instructions)"
echo "   • test-server.py (serveur de test)"
echo ""
echo "🚀 Pour tester la PWA:"
echo "   cd dist && python3 test-server.py"
echo ""
echo "💡 Pour la version standalone:"
echo "   Ouvrir dist/speech-timer-standalone.html dans votre navigateur"
echo ""
echo "📦 Versions disponibles:"
echo "   🍎 macOS ARM64: Speech Timer-3.0.0-arm64.dmg"
echo "   🪟 Windows x64: Speech Timer Setup 3.0.0.exe"
echo "   🪟 Windows ARM64: Speech Timer-3.0.0-arm64.dmg"
echo "   🐧 Linux x64: Speech Timer-3.0.0.AppImage"
echo "   🐧 Linux ARM64: Speech Timer-3.0.0-arm64.AppImage"
echo "   📱 PWA: Dossier pwa/ (à servir via HTTPS)"
