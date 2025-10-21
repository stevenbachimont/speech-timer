# ⚡ Système de Flash - Guide d'utilisation

## ✅ Système de signal ajouté !

Votre application Speech Timer dispose maintenant d'un système de signal visuel avec flash blanc.

## 🎯 Fonctionnement

### **Quand le flash se déclenche :**
- **À la moitié du temps** : Quand un participant atteint la moitié de son temps alloué
- **Une seule fois** : Le flash ne se déclenche qu'une fois par participant
- **Flash blanc** : Écran blanc bref pour attirer l'attention

### **Exemple :**
- Participant avec 10 minutes → Flash à 5 minutes
- Participant avec 3 minutes → Flash à 1 minute 30 secondes
- Participant avec 1 minute → Flash à 30 secondes

## 🎨 Caractéristiques du flash

### **Apparence :**
- **Couleur** : Blanc pur
- **Durée** : 200ms (0.2 seconde)
- **Opacité** : 80% (bien visible mais pas aveuglant)
- **Zone** : Toute la fenêtre (100vw × 100vh)

### **Animation :**
1. **Apparition** : 0.1s (transition douce)
2. **Maintien** : 0.2s (flash visible)
3. **Disparition** : 0.1s (transition douce)

## 📱 Compatibilité

### **Versions supportées :**
- ✅ **Version PWA** : Flash dans la fenêtre principale
- ✅ **Version Electron** : Flash dans la fenêtre desktop
- ✅ **Version Standalone** : Flash dans le navigateur
- ✅ **Mode plein écran** : Flash synchronisé entre les fenêtres

### **Fenêtre plein écran :**
- Le flash se déclenche **automatiquement** dans la fenêtre plein écran
- **Synchronisation** : Flash simultané dans toutes les fenêtres ouvertes
- **Communication** : Messages entre fenêtres pour la synchronisation

## 🔧 Fonctionnement technique

### **Détection :**
```javascript
const halfTime = Math.floor(currentParticipant.time / 2);
if (currentParticipant.timeElapsed === halfTime && !currentParticipant.halfTimeFlashTriggered) {
    this.flashScreen();
    currentParticipant.halfTimeFlashTriggered = true;
}
```

### **Prévention des doublons :**
- **Flag `halfTimeFlashTriggered`** : Empêche les flashs multiples
- **Reset automatique** : Le flag est réinitialisé lors du reset du timer
- **Par participant** : Chaque participant a son propre flag

## 🎮 Utilisation

### **Pour tester le système :**
1. **Créer un timer** avec des participants
2. **Démarrer le timer**
3. **Attendre la moitié du temps** → Flash automatique
4. **Reset et redémarrer** → Flash se redéclenche

### **Exemple de test :**
1. Créer un participant avec 2 minutes
2. Démarrer le timer
3. Attendre 1 minute → Flash blanc !
4. Le flash ne se redéclenchera plus pour ce participant

## ⚙️ Personnalisation (optionnelle)

### **Modifier la durée du flash :**
```css
/* Dans la fonction flashScreen() */
setTimeout(() => {
    flash.style.opacity = '0';
    // Changer 200 pour modifier la durée (en millisecondes)
}, 200);
```

### **Modifier l'opacité :**
```css
flash.style.opacity = '0.8';  // Plus visible
flash.style.opacity = '0.5';  // Plus discret
```

### **Modifier la couleur :**
```css
background: white;     // Blanc (actuel)
background: yellow;    // Jaune
background: red;       // Rouge
```

## 🚀 Avantages

### **Pour les utilisateurs :**
- **Signal visuel clair** : Impossible de rater le signal
- **Non intrusif** : Flash bref qui ne gêne pas
- **Automatique** : Pas besoin d'intervention manuelle
- **Synchronisé** : Fonctionne en mode plein écran

### **Pour les présentations :**
- **Attention du public** : Flash visible par tous
- **Timing précis** : Signal exact à la moitié du temps
- **Professionnel** : Signal discret mais efficace

## ✅ Résumé

Votre application Speech Timer dispose maintenant d'un système de signal visuel professionnel qui :
- ⚡ **Flash blanc** à la moitié du temps
- 🎯 **Une seule fois** par participant
- 📱 **Compatible** avec toutes les versions
- 🔄 **Se réinitialise** automatiquement
- 🎨 **Personnalisable** si nécessaire

Le système est prêt à l'emploi ! 🎉
