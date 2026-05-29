# VisionLab - Plateforme Avancée de Traitement d'Images

VisionLab est une application web premium dédiée à l'apprentissage et à l'expérimentation du traitement numérique d'images. Elle couvre l'intégralité des concepts fondamentaux enseignés en cycle universitaire, répartis en 6 chapitres majeurs.

## 🚀 Fonctionnalités implémentées

### Chapitre 1 : Traitement de base
- **Histogramme en temps réel** : Visualisation dynamique de la distribution des luminances.
- **Luminosité & Contraste** : Ajustements linéaires précis.
- **Transformations** : Négatif (inversion), Niveaux de gris.
- **Égalisation d'histogramme** : Amélioration automatique du contraste global.

### Chapitre 2 : Convolution
- **Filtres de lissage** : Filtre Moyen (Box), Filtre Gaussien.
- **Filtre Passe-haut** : Rehaussement des détails et fréquences spatiales élevées.
- **Filtre Médian** : Réduction du bruit (poivre et sel) par filtrage non-linéaire.

### Chapitre 3 : Transformée de Fourier (Analyse Fréquentielle)
- **Analyse du spectre** : Visualisation des composantes fréquentielles (Basses, Hautes, Fréquence Zéro).
- **Filtrage Spectral** : Simulation de filtrage passe-bas et passe-haut dans le domaine fréquentiel.

### Chapitre 4 : Les Contours
- **Opérateurs de Gradient** : Sobel, Prewitt, Roberts.
- **Dérivée de second ordre** : Laplacien.
- **Détection isotrope** : Gradient isotrope pour une détection indépendante de l'orientation.

### Chapitre 5 : Segmentation
- **Seuillage Binaire** : Glissière manuelle de 0 à 255.
- **Algorithme d'Otsu** : Détermination automatique du seuil optimal par minimisation de la variance intra-classe.

### Chapitre 6 : Images Binaires
- **Morphologie Mathématique** : Érosion et Dilatation.
- **Opérateurs Composés** : Ouverture et Fermeture (nettoyage topologique).

## 💎 Expérience Utilisateur (UX)
- **Mode Comparaison** : Slider interactif permettant de comparer l'image originale et l'image traitée côte à côte.
- **Design Premium** : Interface moderne basée sur le Glassmorphism, optimisée pour le confort visuel (Dark Mode).
- **Performance** : Traitements optimisés directement dans le navigateur pour une réactivité instantanée.

## 🛠️ Stack Technique
- **Frontend** : React 19, Vite, Tailwind CSS v4.
- **Icons** : Lucide React.
- **Graphiques** : Chart.js.
- **Déploiement** : Prêt pour Render (configuration `render.yaml` incluse).

## 📦 Installation et Lancement

1. Cloner le dépôt.
2. Installer les dépendances :
   ```bash
   cd frontend
   npm install
   ```
3. Lancer en mode développement :
   ```bash
   npm run dev
   ```

## 🌐 Déploiement

L'application est prête à être hébergée sur **Render**. Utilisez le fichier `render.yaml` à la racine pour configurer le déploiement automatique.
