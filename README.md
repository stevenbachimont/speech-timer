# Speech Timer 3.4.0

Une application de gestion de temps de parole moderne et intuitive, conçue pour les débats, présentations, réunions et tout événement nécessitant un contrôle précis du temps alloué à chaque participant.

## 🚀 Fonctionnalités principales

### ⏱️ Gestion des temps
- **Timers multiples** : Créez et gérez plusieurs timers simultanément
- **Participants dynamiques** : Ajoutez/supprimez des participants à tout moment
- **Temps personnalisables** : Définissez des durées différentes pour chaque participant
- **Modification en temps réel** : Ajustez les temps des participants directement dans l'interface

### 🎯 Mode plein écran intelligent
- **Détection automatique** : Adaptation automatique selon la plateforme (Windows/macOS/Linux)
- **Support multi-écrans** : Ouvrez d'abord en fenêtre pour positionner sur l'écran souhaité
- **Contrôles intégrés** : Boutons pour passer en plein écran ou fermer la fenêtre
- **Options configurables** : Choisissez le comportement du mode plein écran

### 📱 Versions multiples
- **Application desktop** : Versions natives pour macOS, Windows et Linux
- **PWA (Progressive Web App)** : Installation comme application native dans le navigateur
- **Version standalone** : Fichier HTML unique, fonctionne partout
- **Synchronisation** : Communication entre fenêtres pour un contrôle centralisé

### 💬 Communication avec les participants
- **Messages personnalisés** : Assignez des messages spécifiques à chaque participant
- **Affichage automatique** : Les messages apparaissent automatiquement lors du changement de participant
- **Persistance** : Les messages sont sauvegardés et restaurés avec les timers

### 🎨 Interface moderne
- **Design responsive** : S'adapte à tous les écrans et résolutions
- **Animations fluides** : Transitions et effets visuels soignés
- **Thème sombre/clair** : Interface adaptée à vos préférences
- **Guide intégré** : Bouton "Lisez-moi" avec explications complètes

### ⚡ Fonctionnalités avancées
- **Système de flash** : Signal visuel à la moitié du temps alloué
- **Export/Import XML** : Sauvegarde et partage des configurations
- **Raccourcis clavier** : Navigation rapide avec le clavier
- **Sauvegarde automatique** : Données persistantes entre les sessions

## 📦 Installation

### Version Desktop (Recommandée)
1. Téléchargez la version pour votre plateforme :
   - **macOS** : `Speech Timer-3.4.0-arm64.dmg`
   - **Windows** : `Speech Timer Setup 3.4.0.exe` (NSIS) et `Speech Timer Setup 3.4.0.msi` (Windows Installer)
   - **Linux** : `Speech Timer-3.4.0.AppImage`

2. Installez selon votre système d'exploitation

### Version PWA (Progressive Web App)
1. Servez le dossier `pwa/` via HTTPS
2. Ouvrez dans Chrome/Edge
3. Cliquez sur l'icône d'installation dans la barre d'adresse
4. L'application s'installe comme une app native

### Version Standalone
1. Ouvrez `speech-timer-standalone.html` dans votre navigateur
2. Aucune installation requise

## 🎯 Utilisation

### Création d'un timer
1. Cliquez sur "Ajouter un timer"
2. Nommez votre timer (ex: "Débat présidentiel")
3. Ajoutez des participants avec leurs temps respectifs
4. Cliquez sur "Créer"

### Gestion des participants
1. Cliquez sur "Gérer participants" dans un timer
2. Ajoutez/supprimez des participants
3. Modifiez les temps directement dans l'interface
4. Assignez des messages personnalisés

### Mode plein écran
1. Cliquez sur "Options plein écran" dans un timer
2. Choisissez le mode plein écran souhaité
3. Cliquez sur "Ouvrir en plein écran"
4. Positionnez la fenêtre sur l'écran souhaité
5. Utilisez les boutons de contrôle pour passer en plein écran

### Messages aux participants
1. Dans "Options plein écran", sélectionnez un participant
2. Rédigez un message personnalisé
3. Le message apparaîtra automatiquement lors du changement de participant

## 🔧 Développement

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Build pour toutes les plateformes
```bash
npm run build-all
```

### Build rapide (versions principales)
```bash
./build-quick.sh
```

### Test de la PWA
```bash
cd dist && python3 test-server.py
```

## 📁 Structure du projet

```
TIMER 3.0/
├── index.html              # Interface principale
├── script.js               # Logique de l'application
├── style.css               # Styles CSS
├── manifest.json           # Configuration PWA
├── sw.js                   # Service Worker
├── package.json            # Configuration npm/Electron
├── build-quick.sh          # Script de build rapide
├── .gitignore              # Exclusions Git
└── dist/                   # Dossier de build (ignoré par Git)
    ├── pwa/                # Version PWA
    ├── *.dmg               # Version macOS
    ├── *.exe, *.msi        # Version Windows (NSIS + MSI)
    └── *.AppImage          # Version Linux
```

## 🆕 Nouveautés v3.4.0

- ✅ **Modification des temps** : Édition directe des temps des participants
- ✅ **Interface améliorée** : Meilleure présentation des éléments
- ✅ **Modal élargie** : Plus d'espace pour la gestion des participants
- ✅ **Persistance des messages** : Messages assignés et sauvegardés par participant
- ✅ **Export/Import complet** : Sauvegarde de toutes les données modifiées

## 🐛 Support et dépannage

### Problèmes courants
1. **JavaScript désactivé** : Vérifiez que JavaScript est activé dans votre navigateur
2. **Erreurs de console** : Ouvrez les outils de développement (F12) pour voir les erreurs
3. **PWA ne s'installe pas** : Assurez-vous que les fichiers sont servis via HTTPS
4. **Mode plein écran** : Sur Windows, la fenêtre s'ouvre d'abord en mode fenêtre

### Guide d'utilisation
Cliquez sur le bouton "Lisez-moi" dans l'application pour accéder au guide intégré complet.

## 📞 Contact

**Développé par Steven BACHIMONT**  
Version 3.4.0 - 2025

---

