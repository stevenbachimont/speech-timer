# Build sur Windows 11 - Instructions détaillées

## 🚀 Méthode 1 : Build automatique (Recommandée)

### Étapes :

1. **Ouvrir PowerShell ou CMD en tant qu'administrateur**
   - Clic droit sur le menu Démarrer → "Windows PowerShell (Admin)" ou "Invite de commandes (Admin)"

2. **Naviguer vers le dossier de l'application**
   ```cmd
   cd "C:\chemin\vers\TIMER copie"
   ```

3. **Exécuter le script de build**
   ```cmd
   build.bat
   ```

4. **Attendre la fin du processus**
   - Le script va créer toutes les versions automatiquement

## 🚀 Méthode 2 : Build manuel

### Pour la version HTML Standalone :
```cmd
copy speech-timer-standalone.html dist\speech-timer-standalone.html
```

### Pour la version PWA :
```cmd
mkdir dist\pwa
copy index.html dist\pwa\
copy script.js dist\pwa\
copy style.css dist\pwa\
copy manifest.json dist\pwa\
copy sw.js dist\pwa\
```

### Pour la version Electron :
```cmd
npm install
npm run build-win
```

## 📱 Résultats du build

Après le build, vous aurez dans le dossier `dist\` :

- **speech-timer-standalone.html** - Version standalone
- **pwa\** - Dossier PWA complet
- **Speech Timer Setup.exe** - Installateur Windows
- **README.md** - Instructions d'utilisation

## 🚀 Comment utiliser chaque version

### 1. Version Standalone
```cmd
# Ouvrir directement dans le navigateur
start dist\speech-timer-standalone.html
```

### 2. Version PWA
```cmd
# Démarrer le serveur de test
cd dist
test-server.bat
```
Puis ouvrir http://localhost:8000 dans Chrome/Edge

### 3. Version Electron
```cmd
# Installer l'application
start "dist\Speech Timer Setup.exe"
```

## 🔧 Dépannage Windows 11

### Si le script ne s'exécute pas :
1. Vérifier que PowerShell permet l'exécution de scripts :
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Si Node.js n'est pas reconnu :
1. Redémarrer le terminal après installation
2. Vérifier avec : `node --version`

### Si Python n'est pas reconnu :
1. Redémarrer le terminal après installation
2. Vérifier avec : `python --version`

## 📋 Commandes utiles Windows 11

```cmd
# Vérifier les versions installées
node --version
npm --version
python --version

# Nettoyer et rebuilder
rmdir /s dist
build.bat

# Ouvrir le dossier de distribution
explorer dist
```

