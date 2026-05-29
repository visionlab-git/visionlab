# Documentation : Traitement d'Images (`imageProcessing.js`)

Ce module fournit des outils de manipulation d'images basse consommation utilisant l'API Canvas 2D de JavaScript. Il permet d'appliquer des filtres en temps réel en manipulant directement les données binaires des pixels.

## 🚀 Utilisation Rapide

```javascript
import { applyFilter } from './utils/imageProcessing';

// Dans un composant ou une fonction
applyFilter(context, canvas, imgSource, {
  brightness: 20,
  contrast: 10,
  grayscale: true
});
```

## 🛠️ Détails techniques de la fonction `applyFilter`

La fonction `applyFilter` modifie le contenu d'un canvas en fonction d'un objet de configuration.

### Paramètres

| Paramètre | Description |
| :--- | :--- |
| `ctx` | Contexte 2D du canvas (`getContext('2d')`). |
| `canvas` | L'élément `<canvas>` cible. |
| `originalImage` | L'image source HTML (chargée) à traiter. |
| `filterConfig` | Objet contenant les réglages (`brightness`, `contrast`, `grayscale`, `invert`, `threshold`). |

### Algorithmes implémentés

#### 1. Nuances de Gris (Grayscale)
Utilise la formule de **Luminance ITU-R 601** pour un rendu naturel :
`Gray = 0.2989*R + 0.5870*G + 0.1140*B`

#### 2. Contraste
Applique un facteur correctif calculé selon la formule :
`Facteur = (259 * (Contraste + 255)) / (255 * (259 - Contraste))`
Chaque canal est ensuite recentré par rapport au pivot gris (128).

#### 3. Seuillage (Threshold)
Transforme l'image en noir et blanc binaire. Chaque pixel devient soit `0` (noir) soit `255` (blanc) selon que sa luminance dépasse ou non la valeur seuil définie.

---

## 🎨 Ordre d'application des filtres
Les filtres sont appliqués dans cet ordre spécifique à chaque pixel :
1.  **Grayscale** (si activé)
2.  **Inversion** (si activé)
3.  **Luminosité**
4.  **Contraste**
5.  **Seuillage** (étape finale pour un rendu binaire propre)

---

## 💡 Conseils d'optimisation
- **Réinitialisation** : La fonction redessine l'image originale sur le canvas à chaque appel (`drawImage`) avant de lire les pixels. Cela garantit que les filtres ne se "cumulent" pas de manière destructive à chaque frame.
- **Uint8ClampedArray** : Le tableau des pixels (`data`) est "clamped", ce qui signifie qu'il gère automatiquement le dépassement (ex: une valeur de 260 devient 255).
