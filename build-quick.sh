#!/bin/bash

# Script de build rapide pour Speech Timer
# Génère les 4 versions principales : Mac ARM, Windows, Linux et PWA

echo "🚀 Build rapide Speech Timer 3.4.0"
echo "=================================="

# Créer le dossier de distribution
mkdir -p dist

# 1. Version PWA (toujours incluse)
echo "📱 Création de la version PWA..."
mkdir -p dist/pwa
cp index.html dist/pwa/
cp script.js dist/pwa/
cp style.css dist/pwa/
cp manifest.json dist/pwa/
cp sw.js dist/pwa/

# Copier les icônes
if [ -f "icon-192.png" ]; then
    cp icon-192.png dist/pwa/
    cp icon-512.png dist/pwa/
fi

echo "✅ Version PWA créée: dist/pwa/"

# 2. Version HTML Standalone
echo "📄 Création de la version standalone..."
cp speech-timer-standalone.html dist/speech-timer-standalone.html
echo "✅ Version standalone créée: dist/speech-timer-standalone.html"

# 3. Vérifier si Node.js est disponible
if command -v npm &> /dev/null; then
    echo "⚡ Node.js détecté - Création des versions Electron..."
    
    # Installer les dépendances
    echo "📦 Installation des dépendances..."
    npm install
    
    # Build pour toutes les plateformes
    echo "🔨 Construction des exécutables..."
    
    echo "🍎 Construction pour macOS ARM64..."
    npm run build-mac
    
    echo "🪟 Construction pour Windows (x64 + ARM64)..."
    npm run build-win
    
    echo "🐧 Construction pour Linux (x64 + ARM64)..."
    npm run build-linux
    
    echo "✅ Toutes les versions Electron créées"
else
    echo "⚠️  Node.js non trouvé - Seules les versions PWA et standalone seront créées"
fi

# 4. Créer un README de distribution
echo "📝 Création du README de distribution..."
cat > dist/README.md << 'EOF'
# Speech Timer 3.4.0 - Versions de Distribution

## 🚀 Versions disponibles

### 📱 Version PWA (Progressive Web App)
- **Dossier**: `pwa/`
- **Usage**: Servir via HTTPS, puis installer via le navigateur
- **Avantages**: Installation native, fonctionne hors ligne, synchronisation multi-écrans
- **Installation**: 
  1. Servir le dossier `pwa/` via HTTPS
  2. Ouvrir dans Chrome/Edge
  3. Cliquer sur "Installer l'app" dans la barre d'adresse

### 🍎 Version macOS (ARM64)
- **Fichier**: `Speech Timer-3.4.0-arm64.dmg`
- **Usage**: Double-clic pour installer
- **Avantages**: Application native macOS, intégration système complète

### 🪟 Version Windows
- **Fichier**: `Speech Timer Setup 3.4.0.exe` (x64)
- **Fichier**: `Speech Timer-3.4.0-arm64.dmg` (ARM64)
- **Usage**: Exécuter l'installateur
- **Avantages**: Application native Windows, mode plein écran intelligent

### 🐧 Version Linux
- **Fichier**: `Speech Timer-3.4.0.AppImage` (x64)
- **Fichier**: `Speech Timer-3.4.0-arm64.AppImage` (ARM64)
- **Usage**: `chmod +x` puis double-clic
- **Avantages**: Application portable, pas d'installation requise

### 📄 Version Standalone
- **Fichier**: `speech-timer-standalone.html`
- **Usage**: Ouvrir directement dans le navigateur
- **Avantages**: Aucune installation, fonctionne partout
- **Inconvénients**: Fonctionnalités limitées

## 🆕 Nouvelles fonctionnalités v3.0.0

- ✅ **Guide d'utilisation intégré** : Bouton "Lisez-moi" avec explications complètes
- ✅ **Mode plein écran intelligent** : Détection automatique Windows
- ✅ **Support multi-écrans** : Boutons de contrôle pour déplacer la fenêtre
- ✅ **Options de personnalisation** : Mode plein écran configurable
- ✅ **Système de flash visuel** : Signal à la moitié du temps
- ✅ **Messages push** : Communication avec les participants
- ✅ **Interface améliorée** : Design moderne et responsive

## 🔧 Installation et utilisation

### Version PWA (Recommandée)
1. Servir le dossier `pwa/` via HTTPS
2. Ouvrir dans Chrome/Edge
3. Cliquer sur l'icône d'installation
4. L'app s'installe comme une application native

### Versions Desktop
1. Télécharger la version pour votre plateforme
2. Installer/exécuter selon votre OS
3. L'application s'ouvre comme une app native

### Version Standalone
1. Ouvrir `speech-timer-standalone.html` dans votre navigateur
2. L'application se charge immédiatement

## 🎯 Utilisation recommandée

### Pour les présentations
- **PWA** : Installation sur tablette/smartphone pour le contrôle
- **Desktop** : Mode plein écran sur écran de présentation
- **Multi-écrans** : Contrôle sur un écran, affichage sur l'autre

### Pour les débats
- **PWA** : Installation sur tous les appareils des participants
- **Desktop** : Affichage central avec gestion des temps
- **Standalone** : Solution de secours sans installation

## 🐛 Support

En cas de problème :
1. Vérifier que JavaScript est activé
2. Vérifier la console du navigateur pour les erreurs
3. S'assurer que les fichiers sont servis via HTTPS (pour PWA)
4. Consulter le guide d'utilisation intégré (bouton "Lisez-moi")

## 📞 Contact

Développé par Steven BACHIMONT
Version 3.0.0 - 2024
EOF

echo "✅ README créé: dist/README.md"

# 5. Créer un serveur de test pour la PWA
echo "🌐 Création du serveur de test..."
cat > dist/test-server.py << 'EOF'
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

# Résumé final
echo ""
echo "🎉 Build rapide terminé !"
echo ""
echo "📁 Fichiers générés dans dist/:"
echo "   📱 PWA: dist/pwa/ (version web installable)"
echo "   📄 Standalone: dist/speech-timer-standalone.html"

if command -v npm &> /dev/null; then
    echo "   🍎 macOS ARM64: Speech Timer-3.4.0-arm64.dmg"
    echo "   🪟 Windows x64: Speech Timer Setup 3.4.0.exe"
    echo "   🪟 Windows ARM64: Speech Timer-3.4.0-arm64.dmg"
    echo "   🐧 Linux x64: Speech Timer-3.4.0.AppImage"
    echo "   🐧 Linux ARM64: Speech Timer-3.4.0-arm64.AppImage"
fi

echo "   📝 README: dist/README.md"
echo "   🧪 Test: dist/test-server.py"
echo ""
echo "🚀 Pour tester la PWA:"
echo "   cd dist && python3 test-server.py"
echo ""
echo "💡 Pour la version standalone:"
echo "   Ouvrir dist/speech-timer-standalone.html dans votre navigateur"

