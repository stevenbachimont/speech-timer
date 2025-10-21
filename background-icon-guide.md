# 🎨 Guide - Icône d'arrière-plan de l'application

## ✅ Icône d'arrière-plan ajoutée !

L'icône de votre application apparaît maintenant en arrière-plan de la page principale.

## 🎯 Ce qui a été ajouté :

### **1. Version PWA et Electron (`style.css`)**
- Icône en arrière-plan centrée
- Taille : 200x200 pixels
- Position : Centre de l'écran
- Overlay semi-transparent pour la lisibilité

### **2. Version Standalone (`speech-timer-standalone.html`)**
- Icône intégrée en base64 (pas de fichier externe nécessaire)
- Même apparence que la version PWA

## 🎨 Personnalisation de l'icône d'arrière-plan

### **Changer la taille de l'icône :**
```css
background-size: 150px 150px;  /* Plus petit */
background-size: 300px 300px;  /* Plus grand */
```

### **Changer la position :**
```css
background-position: top left;     /* En haut à gauche */
background-position: bottom right; /* En bas à droite */
background-position: 20px 50px;   /* Position personnalisée */
```

### **Changer l'opacité :**
```css
/* Dans body::before */
background: rgba(102, 126, 234, 0.05); /* Plus transparent */
background: rgba(102, 126, 234, 0.2);  /* Plus opaque */
```

### **Désactiver l'icône d'arrière-plan :**
```css
/* Commenter ou supprimer cette ligne */
/* background-image: url('icon-512.png'); */
```

## 🔧 Options avancées

### **Icône en filigrane (très discret) :**
```css
background-size: 100px 100px;
background-position: center;
opacity: 0.1;
```

### **Icône répétée :**
```css
background-repeat: repeat;
background-size: 50px 50px;
```

### **Icône en mosaïque :**
```css
background-repeat: repeat;
background-size: 80px 80px;
background-position: 0 0;
```

## 📱 Responsive Design

### **Masquer l'icône sur mobile :**
```css
@media (max-width: 768px) {
    body {
        background-image: none;
    }
}
```

### **Icône plus petite sur mobile :**
```css
@media (max-width: 768px) {
    body {
        background-size: 100px 100px;
    }
}
```

## 🎨 Exemples de styles

### **Style minimaliste :**
```css
background-size: 120px 120px;
background-position: bottom right;
opacity: 0.3;
```

### **Style professionnel :**
```css
background-size: 150px 150px;
background-position: center;
background-attachment: scroll;
```

### **Style artistique :**
```css
background-size: 300px 300px;
background-position: center;
opacity: 0.15;
filter: blur(1px);
```

## 🔄 Pour appliquer les changements

1. **Modifier le CSS** dans `style.css`
2. **Rebuilder l'application** :
   ```bash
   ./build.sh  # Sur Mac
   build.bat   # Sur Windows
   ```
3. **Tester** les différentes versions

## ✅ Résultat

Maintenant votre application Speech Timer a :
- ✅ Icône d'arrière-plan sur la page principale
- ✅ Lisibilité préservée avec l'overlay
- ✅ Style cohérent sur toutes les versions
- ✅ Personnalisation facile
