# Repair POC - Projet React

## ? Statut du projet

Toutes les erreurs TypeScript critiques ont été corrigées. Le projet est maintenant prêt à être exécuté.

## ? Démarrage rapide

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## ? Structure du projet

```
src/
??? routes/                   # Pages principales de l'application
?   ??? HomePage.tsx         # Page d'accueil
?   ??? DevicesPage.tsx      # Sélection d'appareil
?   ??? EstimationPage.tsx   # Estimation de prix
?   ??? RepairersPage.tsx    # Comparaison de réparateurs
?   ??? TrackingPage.tsx     # Suivi de réparation
??? features/                 # Fonctionnalités par domaine
?   ??? devices/             # Gestion des appareils
?   ?   ??? hooks.ts
?   ?   ??? DeviceCard.tsx
?   ??? estimation/          # Estimation de réparation
?   ?   ??? hooks.ts
?   ?   ??? EstimationCard.tsx
?   ??? repairers/           # Gestion des réparateurs
?   ?   ??? hooks.ts
?   ?   ??? RepairerCard.tsx
?   ??? tracking/            # Suivi de réparation
?       ??? hooks.ts
?       ??? TimelineStep.tsx
??? components/              # Composants UI partagés (shadcn/ui)
?   ??? ui/
??? lib/                     # Utilitaires et configuration
?   ??? supabase.ts         # Client Supabase
?   ??? utils.ts            # Fonctions utilitaires
??? App.tsx                  # Configuration du routeur

```

## ?? Routes disponibles

| Route                   | Description                    |
| ----------------------- | ------------------------------ |
| `/`                     | Page d'accueil                 |
| `/devices`              | Sélection d'appareil           |
| `/estimation/:deviceId` | Estimation de prix et délai    |
| `/repairers/:deviceId`  | Comparaison de réparateurs     |
| `/tracking/:repairId`   | Suivi de l'état de réparation  |

## ? Technologies utilisées

- **React 19** avec **Vite**
- **React Router** pour la navigation
- **TypeScript** pour le typage
- **Tailwind CSS** pour le style
- **shadcn/ui** pour les composants UI
- **Supabase** pour la base de données (optionnel, données mock disponibles)

## ?? Configuration

### Variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=your_supabase_url_here
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

> Note : Le projet fonctionne avec des données mock si Supabase n'est pas configuré.

## ? Notes importantes

- Développement sous **WSL 2** (Windows Subsystem for Linux)
- Chemin du projet : `/mnt/c/workspace2/repair-poc`
- Utiliser les commandes Linux (bash) pour les opérations sur les fichiers
- Le projet utilise l'alias `@/` pour référencer le dossier `src/`

## ? Fonctionnalités

### ? Implémentées

- Page d'accueil avec proposition de valeur
- Sélection d'appareil à réparer
- Estimation de prix et délais
- Comparaison de réparateurs vérifiés
- Suivi en temps réel de la réparation avec timeline

### ? Composants UI disponibles

- `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Tabs`
- `Avatar`, `Select`, `Separator`, `Sheet`, `Textarea`

## ? Dépannage

Si vous rencontrez des problèmes :

1. Vérifiez que toutes les dépendances sont installées : `npm install`
2. Vérifiez que le fichier `.env` existe avec les bonnes variables
3. Redémarrez le serveur de développement
4. Vérifiez qu'il n'y a pas d'erreurs TypeScript : `npm run build`

## ? Documentation

Pour plus d'informations sur l'architecture et les conventions, consultez :
- `github/copilot-instructions.md` - Instructions complètes du projet

