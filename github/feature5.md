# Feature 5 — Écran : Rendez-vous validé (Confirmation)

> **Contexte :** Cet écran doit être appelé **après `KeyDropLocationPage.tsx`**, via le bouton **"Confirmer et passer au paiement (50€)"**.  
> Cet écran représente l'état final de confirmation du rendez-vous. Aucun back-end requis à ce stade.

## 🎯 Objectif
Créer un écran de confirmation simple, centré, montrant que le rendez-vous est bien enregistré.  
Cet écran rassure l’utilisateur et lui propose d’accéder directement à la section *Rendez-vous*.

## 📄 Fichier à créer
```
src/screens/AppointmentConfirmedPage.tsx
```

## 🧭 Navigation
- Depuis `KeyDropLocationPage.tsx` → `AppointmentConfirmedPage.tsx`
- Le bouton **Voir mon rendez-vous** redirige vers l’onglet **Rendez-vous** de la bottom navigation.

## 🎨 Style Global
| Élément | Style / Couleur |
|---|---|
| Fond principal | `#F8F8FF` (lavande très pâle) |
| Couleur primaire | `#6200EE` (violet) |
| Police | Sans-serif moderne |
| Alignement | Contenu principal centré verticalement ET horizontalement |

## 🏗️ Structure de l'Écran

### 1. En-tête (Header)
- Icône flèche ← (goBack)
- Titre : **"Rendez-vous validé"**
- Aligné à gauche
- Pas de bouton à droite

### 2. Contenu Principal (Centré dans l’écran)
#### Icône de succès
- Grand checkmark **blanc** dans un **cercle violet**
- Taille large (proportion ~25% largeur écran)
- Épaisseur visible (stroke large)

#### Titre
- **"C'est confirmé !"**
- Taille grande (H1/H2)
- **Gras**
- Couleur gris très foncé

#### Message descriptif
```
Il ne vous reste plus qu'à déposer vos clés dans le magasin partenaire de votre choix.
Besoin de changer la date ? Gérez tout depuis la partie “Rendez-vous”.
```
- Texte centré
- Couleur gris foncé
- Interlignage confortable
- Largeur max ~80% de l’écran

### 3. Bouton d’Action
- Fond **violet primaire #6200EE**
- Coins **fortement arrondis**
- **Pleine largeur** (avec marges latérales)
- **Icône calendrier** à gauche du texte
- Texte : **"Voir mon rendez-vous"** (en blanc, gras)

→ Action : `navigate("AppointmentsTab")`

### 4. Barre de navigation inférieure (Bottom Tab Bar)
| Tab | État | Couleur |
|---|---|---|
| Accueil | inactif | gris foncé |
| Diagnostic | inactif | gris foncé |
| Rendez-vous | **actif** | **violet primaire (#6200EE)** |

## 📂 Assets à prévoir
| Élément | Fichier |
|---|---|
| Icône checkmark dans un cercle | `/assets/icons/check_circle.png` (ou vector) |
| Icône calendrier | `/assets/icons/calendar.png` |
| Icônes tab bar | déjà existants ou réutilisés |

## ✅ Rappels d’implémentation
- Utiliser `View` + `flex: 1 + justifyContent: 'center' + alignItems: 'center'` pour le contenu central.
- Le header peut être géré via navigation standard ou custom component.
- Bouton stylisé en TouchableOpacity / Pressable / Button custom.

*Prêt pour implémentation par Copilot + Claude Sonnet 4.5.*
