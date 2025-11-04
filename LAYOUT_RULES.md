# ? Règles Globales de Layout - Application Répare & Vous

**Date de création:** 2025-01-04  
**Version:** 1.0.0

---

## ? RÈGLE CRITIQUE : Positionnement des Boutons d'Action

### ? À NE JAMAIS FAIRE

**Ne jamais utiliser de boutons avec `position: fixed` qui se superposent au menu footer de navigation.**

```typescript
// ? MAUVAIS EXEMPLE
<div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
  <Button>Action</Button>
</div>
```

**Problème :**
- Le bouton se superpose au menu footer de navigation (Home, Diagnostic, Rendez-vous)
- Empêche l'accès aux boutons du menu
- Mauvaise expérience utilisateur

---

### ? BONNE PRATIQUE

**Les boutons d'action doivent toujours appartenir à la div mère de leur layout et être dans le flux normal du contenu.**

```typescript
// ? BON EXEMPLE
<MobileLayout title="Titre de la page">
  <div className="flex flex-col h-full p-4 overflow-y-auto">
    {/* Contenu de la page */}
    <div className="space-y-4">
      {/* Cards, texte, etc. */}
    </div>

    {/* Bouton d'action EN BAS DU CONTENU */}
    <div className="mt-6 pb-4">
      <Button onClick={handleAction}>
        Action principale
      </Button>
    </div>
  </div>
</MobileLayout>
```

---

## ? Règles Détaillées

### 1. Structure de Page Standard

```typescript
export default function MaPage() {
  return (
    <MobileLayout title="Titre">
      <div className="flex flex-col h-full p-4 pb-4 overflow-y-auto">
        {/* Section 1 : Contenu principal */}
        <div className="flex-1">
          {/* Votre contenu ici */}
        </div>

        {/* Section 2 : Bouton d'action */}
        <div className="mt-6 pb-4">
          <Button>Action</Button>
        </div>
      </div>
    </MobileLayout>
  );
}
```

### 2. Padding et Marges

**Conteneur principal :**
- `p-4` : Padding uniforme de 4 unités
- `pb-4` : Padding bottom réduit (pas besoin de beaucoup d'espace car le bouton n'est plus fixe)
- `overflow-y-auto` : Active le scroll vertical

**Bouton d'action :**
- `mt-6` : Marge top pour espacer du contenu
- `pb-4` : Padding bottom pour respiration avant le menu footer
- `w-full` : Largeur 100%

### 3. Gestion du Scroll

Le contenu doit pouvoir scroller naturellement :
- Le menu footer reste toujours visible (géré par MobileLayout)
- Le bouton d'action scroll avec le contenu
- L'utilisateur peut accéder au menu footer à tout moment

---

## ? Corrections Appliquées

### Fichiers corrigés

1. ? **ConfirmationPage.tsx** (méthode visio)
   - Ancien : Bouton fixe avec `position: fixed`
   - Nouveau : Bouton dans le flux avec `mt-6 pb-4`

2. ? **QuoteInterventionPage.tsx**
   - Ancien : Bouton fixe avec `position: fixed`
   - Nouveau : Bouton dans le flux avec `mt-6 pb-4`
   - Ancien padding : `pb-24` (pour éviter le bouton fixe)
   - Nouveau padding : `pb-4` (normal)

---

## ? Cas d'Usage Spécifiques

### Cas 1 : Page avec une seule action principale
```typescript
<div className="flex-1 overflow-y-auto p-4 pb-4">
  {/* Contenu */}
  
  <div className="mt-6 pb-4">
    <Button>Action</Button>
  </div>
</div>
```

### Cas 2 : Page avec plusieurs actions
```typescript
<div className="flex-1 overflow-y-auto p-4 pb-4">
  {/* Contenu */}
  
  <div className="mt-6 pb-4 space-y-3">
    <Button>Action principale</Button>
    <Button variant="outline">Action secondaire</Button>
  </div>
</div>
```

### Cas 3 : Page avec contenu long (scroll nécessaire)
```typescript
<div className="flex-1 overflow-y-auto p-4 pb-4 space-y-4">
  {/* Cards ou contenu long */}
  {items.map(item => <Card key={item.id}>...</Card>)}
  
  {/* Bouton en bas du contenu scrollable */}
  <div className="mt-6 pb-4">
    <Button>Action</Button>
  </div>
</div>
```

---

## ? Classes Tailwind Recommandées

### Pour le conteneur principal
```typescript
className="flex flex-col h-full p-4 pb-4 overflow-y-auto"
```
- `flex flex-col` : Layout en colonne
- `h-full` : Hauteur 100% du parent
- `p-4` : Padding uniforme
- `pb-4` : Padding bottom normal
- `overflow-y-auto` : Scroll vertical si nécessaire

### Pour la zone de bouton
```typescript
className="mt-6 pb-4"
```
- `mt-6` : Marge top (séparation avec le contenu)
- `pb-4` : Padding bottom (respiration avant le menu)

### Pour le bouton lui-même
```typescript
className="w-full h-12 bg-blue-600 hover:bg-blue-700 active:scale-95 transition-transform"
```
- `w-full` : Largeur 100%
- `h-12` : Hauteur fixe
- Effets hover et active

---

## ?? Erreurs Courantes à Éviter

### ? Erreur 1 : Position Fixed
```typescript
// NE PAS FAIRE
<div className="fixed bottom-0 left-0 right-0">
  <Button>Action</Button>
</div>
```
**Problème :** Se superpose au menu footer

### ? Erreur 2 : Padding Bottom Excessif
```typescript
// NE PAS FAIRE (sauf si bouton fixe, ce qu'on ne veut pas)
<div className="pb-24 overflow-y-auto">
```
**Problème :** Espace inutile qui crée un scroll étrange

### ? Erreur 3 : Absence de Marge Top
```typescript
// NE PAS FAIRE
{/* Contenu */}
<Button>Action</Button>  // Pas d'espace avant le bouton
```
**Problème :** Bouton collé au contenu, pas agréable visuellement

---

## ? Checklist de Validation

Avant de valider une page, vérifier :

- [ ] Le bouton d'action est dans une `<div>` avec `mt-6 pb-4`
- [ ] Le bouton d'action n'utilise PAS `position: fixed`
- [ ] Le conteneur principal a `overflow-y-auto`
- [ ] Le padding bottom est `pb-4` (pas `pb-24` ou `pb-32`)
- [ ] Le menu footer reste accessible en bas
- [ ] Le scroll fonctionne naturellement
- [ ] Sur mobile, le bouton ne cache rien

---

## ? Documentation de Référence

### MobileLayout
Le composant `MobileLayout` gère automatiquement :
- ? Le header avec titre
- ? Le menu footer de navigation
- ? L'espacement entre les sections

**Il NE faut PAS essayer de gérer le footer manuellement dans les pages.**

### Structure Hiérarchique
```
MobileLayout
??? Header (titre + back)
??? Content (votre page)
?   ??? Contenu principal (scroll)
?   ??? Bouton d'action (dans le flow)
??? Footer Menu (Home, Diagnostic, RDV)
```

---

## ? Migration

Si vous avez une page avec un bouton fixe à migrer :

### Étape 1 : Identifier le bouton fixe
```typescript
// Chercher dans le code
<div className="fixed bottom-0...">
```

### Étape 2 : Retirer le fixed
```typescript
// Remplacer par
<div className="mt-6 pb-4">
```

### Étape 3 : Ajuster le padding du conteneur
```typescript
// Passer de pb-24/pb-32 à pb-4
className="... pb-4 overflow-y-auto"
```

### Étape 4 : Tester
- ? Le bouton est visible
- ? Le menu footer est accessible
- ? Le scroll fonctionne
- ? Pas de superposition

---

## ? Pages Conformes

### ? Pages validées
- [x] `ConfirmationPage.tsx` (méthode visio)
- [x] `QuoteInterventionPage.tsx`

### ? Pages à vérifier
- [ ] `ConfirmationPage.tsx` (méthode store)
- [ ] `EstimationPage.tsx`
- [ ] `StoreSelectionPage.tsx`
- [ ] `VisioPage.tsx`
- [ ] `ChooseMethodPage.tsx`
- [ ] Autres pages à venir

---

## ? Résumé en 3 Points

1. **? Jamais de `position: fixed`** pour les boutons d'action
2. **? Toujours dans le flow** avec `mt-6 pb-4`
3. **? Padding normal** `pb-4` (pas `pb-24`)

---

## ? Support

En cas de doute sur le positionnement d'un bouton :
1. Référez-vous à `ConfirmationPage.tsx` ou `QuoteInterventionPage.tsx` comme exemples
2. Utilisez le template de structure standard ci-dessus
3. Testez sur mobile pour vérifier que le menu footer reste accessible

---

**Date de dernière mise à jour:** 2025-01-04  
**Mainteneur:** GitHub Copilot  
**Version:** 1.0.0

---

## ? Tags

`#layout` `#mobile` `#button` `#footer` `#best-practices` `#guidelines` `#ui-ux`

