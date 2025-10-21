@echo off
REM Script de build rapide pour Speech Timer (Windows)
REM Génère les 4 versions principales : Mac ARM, Windows, Linux et PWA

echo 🚀 Build rapide Speech Timer 3.0.0
echo ==================================

REM Créer le dossier de distribution
if not exist dist mkdir dist

REM 1. Version PWA (toujours incluse)
echo 📱 Création de la version PWA...
if not exist dist\pwa mkdir dist\pwa
copy index.html dist\pwa\
copy script.js dist\pwa\
copy style.css dist\pwa\
copy manifest.json dist\pwa\
copy sw.js dist\pwa\

REM Copier les icônes
if exist icon-192.png (
    copy icon-192.png dist\pwa\
    copy icon-512.png dist\pwa\
)

echo ✅ Version PWA créée: dist\pwa\

REM 2. Version HTML Standalone
echo 📄 Création de la version standalone...
copy speech-timer-standalone.html dist\speech-timer-standalone.html
echo ✅ Version standalone créée: dist\speech-timer-standalone.html

REM 3. Vérifier si Node.js est disponible
where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo ⚡ Node.js détecté - Création des versions Electron...
    
    REM Installer les dépendances
    echo 📦 Installation des dépendances...
    npm install
    
    REM Build pour toutes les plateformes
    echo 🔨 Construction des exécutables...
    
    echo 🍎 Construction pour macOS ARM64...
    npm run build-mac
    
    echo 🪟 Construction pour Windows (x64 + ARM64)...
    npm run build-win
    
    echo 🐧 Construction pour Linux (x64 + ARM64)...
    npm run build-linux
    
    echo ✅ Toutes les versions Electron créées
) else (
    echo ⚠️  Node.js non trouvé - Seules les versions PWA et standalone seront créées
)

REM 4. Créer un README de distribution
echo 📝 Création du README de distribution...
(
echo # Speech Timer 3.0.0 - Versions de Distribution
echo.
echo ## 🚀 Versions disponibles
echo.
echo ### 📱 Version PWA ^(Progressive Web App^)
echo - **Dossier**: `pwa\`
echo - **Usage**: Servir via HTTPS, puis installer via le navigateur
echo - **Avantages**: Installation native, fonctionne hors ligne, synchronisation multi-écrans
echo - **Installation**: 
echo   1. Servir le dossier `pwa\` via HTTPS
echo   2. Ouvrir dans Chrome/Edge
echo   3. Cliquer sur "Installer l'app" dans la barre d'adresse
echo.
echo ### 🍎 Version macOS ^(ARM64^)
echo - **Fichier**: `Speech Timer-3.0.0-arm64.dmg`
echo - **Usage**: Double-clic pour installer
echo - **Avantages**: Application native macOS, intégration système complète
echo.
echo ### 🪟 Version Windows
echo - **Fichier**: `Speech Timer Setup 3.0.0.exe` ^(x64^)
echo - **Fichier**: `Speech Timer-3.0.0-arm64.dmg` ^(ARM64^)
echo - **Usage**: Exécuter l'installateur
echo - **Avantages**: Application native Windows, mode plein écran intelligent
echo.
echo ### 🐧 Version Linux
echo - **Fichier**: `Speech Timer-3.0.0.AppImage` ^(x64^)
echo - **Fichier**: `Speech Timer-3.0.0-arm64.AppImage` ^(ARM64^)
echo - **Usage**: `chmod +x` puis double-clic
echo - **Avantages**: Application portable, pas d'installation requise
echo.
echo ### 📄 Version Standalone
echo - **Fichier**: `speech-timer-standalone.html`
echo - **Usage**: Ouvrir directement dans le navigateur
echo - **Avantages**: Aucune installation, fonctionne partout
echo - **Inconvénients**: Fonctionnalités limitées
echo.
echo ## 🆕 Nouvelles fonctionnalités v3.0.0
echo.
echo - ✅ **Guide d'utilisation intégré** : Bouton "Lisez-moi" avec explications complètes
echo - ✅ **Mode plein écran intelligent** : Détection automatique Windows
echo - ✅ **Support multi-écrans** : Boutons de contrôle pour déplacer la fenêtre
echo - ✅ **Options de personnalisation** : Mode plein écran configurable
echo - ✅ **Système de flash visuel** : Signal à la moitié du temps
echo - ✅ **Messages push** : Communication avec les participants
echo - ✅ **Interface améliorée** : Design moderne et responsive
echo.
echo ## 🔧 Installation et utilisation
echo.
echo ### Version PWA ^(Recommandée^)
echo 1. Servir le dossier `pwa\` via HTTPS
echo 2. Ouvrir dans Chrome/Edge
echo 3. Cliquer sur l'icône d'installation
echo 4. L'app s'installe comme une application native
echo.
echo ### Versions Desktop
echo 1. Télécharger la version pour votre plateforme
echo 2. Installer/exécuter selon votre OS
echo 3. L'application s'ouvre comme une app native
echo.
echo ### Version Standalone
echo 1. Ouvrir `speech-timer-standalone.html` dans votre navigateur
echo 2. L'application se charge immédiatement
echo.
echo ## 🎯 Utilisation recommandée
echo.
echo ### Pour les présentations
echo - **PWA** : Installation sur tablette/smartphone pour le contrôle
echo - **Desktop** : Mode plein écran sur écran de présentation
echo - **Multi-écrans** : Contrôle sur un écran, affichage sur l'autre
echo.
echo ### Pour les débats
echo - **PWA** : Installation sur tous les appareils des participants
echo - **Desktop** : Affichage central avec gestion des temps
echo - **Standalone** : Solution de secours sans installation
echo.
echo ## 🐛 Support
echo.
echo En cas de problème :
echo 1. Vérifier que JavaScript est activé
echo 2. Vérifier la console du navigateur pour les erreurs
echo 3. S'assurer que les fichiers sont servis via HTTPS ^(pour PWA^)
echo 4. Consulter le guide d'utilisation intégré ^(bouton "Lisez-moi"^)
echo.
echo ## 📞 Contact
echo.
echo Développé par Steven BACHIMONT
echo Version 3.0.0 - 2024
) > dist\README.md

echo ✅ README créé: dist\README.md

REM 5. Créer un serveur de test pour la PWA
echo 🌐 Création du serveur de test...
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

REM Résumé final
echo.
echo 🎉 Build rapide terminé !
echo.
echo 📁 Fichiers générés dans dist\:
echo    📱 PWA: dist\pwa\ ^(version web installable^)
echo    📄 Standalone: dist\speech-timer-standalone.html

where npm >nul 2>nul
if %errorlevel% equ 0 (
    echo    🍎 macOS ARM64: Speech Timer-3.0.0-arm64.dmg
    echo    🪟 Windows x64: Speech Timer Setup 3.0.0.exe
    echo    🪟 Windows ARM64: Speech Timer-3.0.0-arm64.dmg
    echo    🐧 Linux x64: Speech Timer-3.0.0.AppImage
    echo    🐧 Linux ARM64: Speech Timer-3.0.0-arm64.AppImage
)

echo    📝 README: dist\README.md
echo    🧪 Test: dist\test-server.bat
echo.
echo 🚀 Pour tester la PWA:
echo    cd dist ^&^& test-server.bat
echo.
echo 💡 Pour la version standalone:
echo    Ouvrir dist\speech-timer-standalone.html dans votre navigateur

pause

