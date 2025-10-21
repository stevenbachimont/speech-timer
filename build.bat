@echo off
REM Script de build pour Speech Timer (Windows)
REM Ce script crée différentes versions de l'application

echo 🚀 Construction de Speech Timer...

REM Créer le dossier de distribution
if not exist dist mkdir dist

REM 1. Version HTML Standalone
echo 📄 Création de la version HTML standalone...
copy speech-timer-standalone.html dist\speech-timer-standalone.html
echo ✅ Version standalone créée: dist\speech-timer-standalone.html

REM 2. Version PWA
echo 📱 Création de la version PWA...
if not exist dist\pwa mkdir dist\pwa
copy index.html dist\pwa\
copy script.js dist\pwa\
copy style.css dist\pwa\
copy manifest.json dist\pwa\
copy sw.js dist\pwa\

REM Copier les icônes si elles existent
if exist icon-192.png (
    echo 📱 Copie des icônes PWA...
    copy icon-192.png dist\pwa\
    copy icon-512.png dist\pwa\
    echo ✅ Icônes PWA copiées
) else (
    echo ⚠️  Icônes PWA non trouvées. Veuillez ajouter manuellement icon-192.png et icon-512.png
)

REM Copier l'icône Electron si elle existe
if exist icon.png (
    echo ⚡ Copie de l'icône Electron...
    copy icon.png dist\
    echo ✅ Icône Electron copiée
)

echo ✅ Version PWA créée: dist\pwa\

REM 3. Version Electron (si Node.js est installé)
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo ⚡ Création des versions Electron...
    
    REM Installer les dépendances si package.json existe
    if exist package.json (
        echo 📦 Installation des dépendances Electron...
        npm install
        
        REM Build pour toutes les plateformes
        echo 🔨 Construction des exécutables pour toutes les plateformes...
        
        echo 🪟 Construction pour Windows (x64 + ARM64)...
        npm run build-win
        
        echo 🍎 Construction pour macOS (ARM64)...
        npm run build-mac
        
        echo 🐧 Construction pour Linux (x64 + ARM64)...
        npm run build-linux
        
        echo ✅ Toutes les versions Electron créées dans dist\
    ) else (
        echo ⚠️  package.json non trouvé. Création d'un package.json de base...
        (
            echo {
            echo   "name": "speech-timer",
            echo   "version": "1.0.0",
            echo   "description": "Application de timer pour discours",
            echo   "main": "main.js",
            echo   "scripts": {
            echo     "start": "electron .",
            echo     "build": "electron-builder"
            echo   },
            echo   "devDependencies": {
            echo     "electron": "^27.0.0",
            echo     "electron-builder": "^24.6.4"
            echo   }
            echo }
        ) > package.json
        echo 📦 Veuillez exécuter 'npm install' puis relancer ce script
    )
) else (
    echo ⚠️  Node.js/npm non trouvé. Version Electron ignorée.
)

REM 4. Créer un README pour la distribution
echo 📝 Création du README de distribution...
(
echo # Speech Timer - Versions de Distribution
echo.
echo ## 🚀 Versions disponibles
echo.
echo ### 1. Version HTML Standalone
echo - **Fichier**: `speech-timer-standalone.html`
echo - **Usage**: Ouvrir directement dans n'importe quel navigateur
echo - **Avantages**: Aucune installation requise, fonctionne partout
echo - **Inconvénients**: Fonctionnalités limitées
echo.
echo ### 2. Version PWA ^(Progressive Web App^)
echo - **Dossier**: `pwa\`
echo - **Usage**: Servir via un serveur web, puis installer via le navigateur
echo - **Avantages**: Installation native, fonctionne hors ligne
echo - **Installation**: 
echo   1. Servir le dossier `pwa\` via un serveur web
echo   2. Ouvrir dans Chrome/Edge
echo   3. Cliquer sur "Installer l'app" dans la barre d'adresse
echo.
echo ### 3. Version Electron ^(Desktop^)
echo - **Fichiers**: Exécutables dans le dossier parent
echo - **Usage**: Exécutable natif pour Windows/macOS/Linux
echo - **Avantages**: Application desktop complète, intégration système
echo - **Inconvénients**: Plus lourd, nécessite Node.js pour le build
echo.
echo ## 📋 Instructions d'utilisation
echo.
echo ### Version Standalone
echo 1. Ouvrir `speech-timer-standalone.html` dans votre navigateur
echo 2. L'application se charge immédiatement
echo.
echo ### Version PWA
echo 1. Servir le dossier `pwa\` via un serveur web local ou distant
echo 2. Ouvrir l'URL dans Chrome/Edge
echo 3. Cliquer sur l'icône d'installation dans la barre d'adresse
echo 4. L'app s'installe comme une application native
echo.
echo ### Version Electron
echo 1. Exécuter l'installateur généré
echo 2. L'application s'installe dans le menu des applications
echo 3. Fonctionne comme une application desktop classique
echo.
echo ## 🔧 Développement
echo.
echo Pour modifier l'application :
echo 1. Éditer les fichiers source ^(`index.html`, `script.js`, `style.css`^)
echo 2. Relancer ce script de build
echo 3. Les nouvelles versions seront générées dans `dist\`
echo.
echo ## 📱 Fonctionnalités
echo.
echo - ✅ Gestion de multiples timers
echo - ✅ Export/Import XML
echo - ✅ Sauvegarde locale
echo - ✅ Interface responsive
echo - ✅ Raccourcis clavier
echo - ✅ Mode plein écran intelligent ^(PWA et Electron^)
echo - ✅ Installation native ^(PWA et Electron^)
echo - ✅ Guide d'utilisation intégré
echo - ✅ Mode plein écran adaptatif pour Windows
echo - ✅ Boutons de contrôle pour multi-écrans
echo - ✅ Options de personnalisation avancées
echo - ✅ Système de flash visuel
echo - ✅ Messages push aux participants
echo.
echo ## 🐛 Support
echo.
echo En cas de problème :
echo 1. Vérifier que JavaScript est activé
echo 2. Vérifier la console du navigateur pour les erreurs
echo 3. S'assurer que les fichiers sont servis via HTTPS ^(pour PWA^)
) > dist\README.md

echo ✅ README créé: dist\README.md

REM 5. Créer un serveur de test simple
echo 🌐 Création d'un serveur de test...
(
echo @echo off
echo echo 🚀 Serveur de test Speech Timer
echo echo.
echo echo 📱 Ouvrez http://localhost:8000 dans Chrome/Edge pour tester la PWA
echo echo.
echo cd pwa
echo python -m http.server 8000
) > dist\test-server.bat

echo ✅ Serveur de test créé: dist\test-server.bat

echo.
echo 🎉 Build terminé !
echo.
echo 📁 Fichiers générés dans dist\:
echo    • speech-timer-standalone.html ^(version standalone^)
echo    • pwa\ ^(version PWA^)
echo    • Speech Timer-3.0.0-arm64.dmg ^(macOS ARM64^)
echo    • Speech Timer Setup 3.0.0.exe ^(Windows x64^)
echo    • Speech Timer-3.0.0-arm64.dmg ^(Windows ARM64^)
echo    • Speech Timer-3.0.0.AppImage ^(Linux x64^)
echo    • Speech Timer-3.0.0-arm64.AppImage ^(Linux ARM64^)
echo    • README.md ^(instructions^)
echo    • test-server.bat ^(serveur de test^)
echo.
echo 🚀 Pour tester la PWA:
echo    cd dist ^&^& test-server.bat
echo.
echo 💡 Pour la version standalone:
echo    Ouvrir dist\speech-timer-standalone.html dans votre navigateur
echo.
echo 📦 Versions disponibles:
echo    🍎 macOS ARM64: Speech Timer-3.0.0-arm64.dmg
echo    🪟 Windows x64: Speech Timer Setup 3.0.0.exe
echo    🪟 Windows ARM64: Speech Timer-3.0.0-arm64.dmg
echo    🐧 Linux x64: Speech Timer-3.0.0.AppImage
echo    🐧 Linux ARM64: Speech Timer-3.0.0-arm64.AppImage
echo    📱 PWA: Dossier pwa\ ^(à servir via HTTPS^)

pause
