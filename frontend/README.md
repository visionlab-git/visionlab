# TIMo - Plateforme Interactive de Traitement d'Images

![TIMo Logo](./public/logo.png)

## À Propos
**TIMo** est le module Frontend (interface utilisateur) du projet global de traitement d'images. Actuellement implémenté sous forme d'application **Stateless** stricte, TIMo a pour but d'offrir une plateforme web sans inscription permettant aux étudiants et passionnés de vision par ordinateur d'importer une image et d'en altérer les caractéristiques visuelles instantanément.

L'interface arbore un look moderne qualifié de "Premium", centré sur le principe de design en _Glassmorphism_ et sur un _Mode Sombre_ (Dark Mode) pour mettre en valeur les images traitées.

## Pile Technologique Frontend
- **Framework** : [React](https://react.dev/) instancié via [Vite](https://vitejs.dev/) pour des temps de compilation drastiquement accélérés et un "Hot Module Replacement" instantané.
- **Styling** : [Tailwind CSS v4](https://tailwindcss.com/) géré nativement via le plugin Vite `@tailwindcss/vite`, évitant ainsi le recours à de lourds parseurs PostCSS annexes.
- **Iconographie** : [Lucide-React](https://lucide.dev/).
- **Moteur de Rendu d'Image** : Le traitement mathématique et la modification des tampons colorimétriques de l'image (Buffers) se fait à la volée via l'API Web Javascript de la balise HTML5 `<canvas>`.

## Fonctionnalités Accessibles (Version Sans Serveur)
Ce dossier frontend emporte avec lui la fonction JavaScript de base permettant les manipulations linéaires directes avant déploiement du point API Python :
- **Traitement de Base** : Actionneurs pour la Luminosité (addition de spectres) et le Contraste interactif.
- **Conversion Chromatique** : Extraction des Niveaux de Gris et Effet "Négatif".
- **Binarisation** : Seuillage absolu variable de 0 à 255.
- **Module d'Exportation** : Enregistrement gratuit en local sur la machine du client de l'image résultante au format naturel PNG sans perte.

## Installation et Démarrage Local

Assurez-vous d'avoir [Node.js](https://nodejs.org/) installé sur votre machine. Les dépendances étant gérées par `npm`.

1. Placez-vous dans le répertoire du frontend :
   ```bash
   cd "Projet Images/frontend"
   ```

2. Installez les paquets requis :
   ```bash
   npm install
   ```

3. Lancez le serveur de développement Vite :
   ```bash
   npm run dev -- --force
   ```
   *(NB: le drapeau `--force` est facultatif mais extrêmement conseillé lors des changements d'architectures de styles pour outrepasser le cache natif `node_modules/.vite`)*

4. Ouvrez votre navigateur sur [http://localhost:5173](http://localhost:5173).

## Prochaines Étapes
L'architecture Frontend est conçue pour accueillir les réponses Asynchrones REST d'un futur Backend Python. Les modules de Filtrage Fréquentiel de Fourier, de Segmentation, et de Détection des contours (Filtre de Canny) requièrent ce dit backend pour opérer avec des temps de calcul optimaux. Mettez le hook `useEffect` et la méthode Fetch à jour lorsque le serveur API sera déployé !
