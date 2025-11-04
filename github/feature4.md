# Feature 4 — Écran : Choix du lieu de dépôt des clés

> **Contexte :** Cet écran doit être appelé **après `QuoteInterventionPage.tsx`**, via le bouton **"Valider et prendre rendez-vous"**.

## ? Objectif
Implémenter l'écran permettant au client de choisir son lieu de dépôt des clés.  
Aucune logique backend — **Front-End uniquement** (UI + gestion des états locaux).

## ? Navigation
- Fichier à créer : `KeyDropLocationPage.tsx`
- Ajout d'une route dans le router + navigation depuis `QuoteInterventionPage.tsx` (sur le CTA "Valider et prendre rendez-vous").

---

## ?? Structure à implémenter

### 1. Header
- Flèche de retour (navigation.goBack)
- Titre : **"Choix du lieu de dépôt des clés"**

### 2. Segmented Control (2 options)
Valeur par défaut : **Enseigne partenaire** (`"partnerStore"`)

| Tab | Label | État sélectionné | Style sélectionné |
|---|---|---|---|
| Tab 1 | Enseigne partenaire | par défaut | Fond **violet (#6200EE)**, texte **blanc** |
| Tab 2 | Locker sécurisé | inactif | Fond transparent, texte gris |

Doit modifier un `useState(tab)`.

### 3. Carte (Image statique)
- Image locale (`/image/map_lille.jpg`)
- Style : Full width + bordures arrondies
- Pas d’interaction

### 4. Champ Adresse
Label : "Saisissez votre adresse"
TextInput avec placeholder `"18 place Leclerc, 59800, Lille"`

### 5. Liste des magasins proches (si tab = partnerStore)
Titre : **"Les magasins les plus proches de chez vous"**

2 cartes magasin par défaut :

| Nom | Horaires | Logo (simple cercle couleur placeholder) |
|---|---|---|
| Leroy Merlin Lesquin | Lundi-Dim : 9h00-20h00 | Cercle vert |
| Decathlon Villeneuve D'Ascq | Lundi-Sam : 9h30-19h30 | Cercle bleu |

**Carte magasin :**
- Fond blanc
- Coins arrondis
- Ombre légère
- Logo à gauche + textes + chevron `>` à droite
- Touchable ? sélectionne le magasin (mettre bordure violette si sélectionné)

Lien sous la liste : **"Voir plus de magasins +"**, aligné à droite, violet.

### 6. Footer CTA (fixé en bas)
Bouton :  
**"Confirmer et passer au paiement (50€)"**

- Pleine largeur
- Fond **violet #6200EE**
- Texte **blanc + gras**
- Coins arrondis

### 7. Barre de navigation inférieure
Déjà existante.  
Sur cet écran, **l'onglet "Accueil" reste actif (accent violet)**.

---

## ? Styles
| Élément | Couleur / Style |
|---|---|
| Fond global | `#F8F8FF` (lavande très clair) |
| Couleur primaire | `#6200EE` (violet) |
| Textes | gris foncé, police sans-serif moderne |
| Cartes | blanc, coins arrondis, ombre subtile |

---

## ? États & Comportements
- `selectedTab` : `"partnerStore"` ou `"locker"`
- `selectedStore` : `null` ou `store.id`
- Le CTA est toujours actif (pas besoin de validation adresse pour l’instant)

---

## ? À fournir (à implémenter)
KeyDropLocationPage.tsx