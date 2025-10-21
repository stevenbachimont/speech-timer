# 🎨 Guide pour changer le logo de Speech Timer

## 📋 Étapes pour changer le logo

### 1. **Préparer vos icônes**

Créez 3 fichiers d'icônes avec ces dimensions exactes :

- `icon-192.png` (192x192 pixels) - PWA et favicon
- `icon-512.png` (512x512 pixels) - PWA et favicon  
- `icon.png` (256x256 pixels) - Electron

### 2. **Remplacer les fichiers**

Remplacez les fichiers existants dans le dossier racine :
```
TIMER copie/
├── icon-192.png    ← Remplacer
├── icon-512.png    ← Remplacer  
├── icon.png        ← Remplacer (nouveau)
└── ...
```

### 3. **Rebuilder l'application**

Après avoir remplacé les icônes, relancer le build :

**Sur Mac :**
```bash
./build.sh
```

**Sur Windows :**
```cmd
build.bat
```

## 🎯 Où apparaissent les icônes

### **Version PWA (Progressive Web App)**
- Icône dans le menu des applications
- Icône dans la barre des tâches
- Icône de raccourci sur le bureau
- Favicon dans l'onglet du navigateur

### **Version Electron (Desktop)**
- Icône de la fenêtre de l'application
- Icône dans le menu des applications
- Icône de l'installateur (.exe/.dmg)
- Icône dans la barre des tâches

### **Version Standalone (HTML)**
- Favicon dans l'onglet du navigateur
- Icône si ajoutée aux favoris

## 🛠️ Outils recommandés pour créer les icônes

### **Gratuits :**
- **GIMP** - Éditeur d'images gratuit
- **Paint.NET** - Éditeur Windows simple
- **Canva** - Créateur d'icônes en ligne
- **Figma** - Outil de design gratuit

### **En ligne :**
- **Favicon.io** - Générateur de favicons
- **RealFaviconGenerator** - Générateur complet
- **IconGenerator** - Créateur d'icônes

## 📐 Spécifications techniques

### **Format PNG recommandé :**
- **Transparence** : Supportée
- **Compression** : Optimisée pour le web
- **Qualité** : Haute résolution

### **Design conseillé :**
- **Style** : Simple et reconnaissable
- **Couleurs** : Contrastées
- **Détails** : Visibles à 16x16 pixels
- **Thème** : Cohérent avec l'app (timer/horloge)

## 🔄 Processus complet

1. **Créer** vos 3 icônes aux bonnes dimensions
2. **Remplacer** les fichiers dans le dossier racine
3. **Rebuilder** avec `./build.sh` ou `build.bat`
4. **Tester** chaque version (PWA, Electron, Standalone)

## ✅ Vérification

Après le build, vérifiez que :
- Les icônes apparaissent dans les dossiers `dist/pwa/`
- L'installateur Electron a la nouvelle icône
- Le favicon change dans le navigateur
- L'icône PWA s'affiche correctement

## 🎨 Exemples d'icônes

### **Thème Timer/Horloge :**
- ⏱️ Horloge simple
- ⏰ Réveil
- 🕐 Horloge analogique
- ⏲️ Sablier
- 🎯 Cible avec temps

### **Thème Speech/Discours :**
- 🎤 Microphone
- 🗣️ Parole
- 📢 Haut-parleur
- 💬 Bulle de dialogue

### **Thème Minimaliste :**
- Cercle avec "T"
- Carré avec "⏱"
- Forme géométrique simple

