# ? Guide de Déploiement Rapide - Intégration Supabase

## Étape 1 : Configuration de l'environnement

### 1.1 Vérifier les variables d'environnement

Assurez-vous que votre fichier `.env` contient :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-clé-anon
```

## Étape 2 : Créer les tables dans Supabase

### Option 1 : Via l'interface web (Recommandé)

1. Allez sur https://app.supabase.com
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier : `supabase/migrations/20250104_create_tables.sql`
6. Cliquez sur **Run** (ou Ctrl+Enter)

### Option 2 : Via Supabase CLI

```bash
# Initialiser Supabase localement (si pas déjà fait)
npx supabase init

# Lier votre projet
npx supabase link --project-ref votre-project-ref

# Appliquer les migrations
npx supabase db push
```

## Étape 3 : Vérifier l'installation

### Dans l'interface Supabase

1. Allez dans **Table Editor**
2. Vous devriez voir 4 tables :
   - ? `diagnostics`
   - ? `messages_chat`
   - ? `stores`
   - ? `appointments`

3. Cliquez sur la table `stores`
4. Vous devriez voir 3 magasins pré-insérés

### Via SQL Editor

Exécutez cette requête pour tout vérifier d'un coup :

```sql
-- Vérifier les tables
SELECT 
  'diagnostics' as table_name, COUNT(*) as count FROM diagnostics
UNION ALL
SELECT 'messages_chat', COUNT(*) FROM messages_chat
UNION ALL
SELECT 'stores', COUNT(*) FROM stores
UNION ALL
SELECT 'appointments', COUNT(*) FROM appointments;
```

Résultat attendu :
- diagnostics: 0
- messages_chat: 0
- stores: 3 ?
- appointments: 0

## Étape 4 : Lancer l'application

```bash
# Installer les dépendances (si pas déjà fait)
npm install

# Lancer en mode développement
npm run dev
```

## Étape 5 : Tester le parcours complet

### Test 1 : Diagnostic
1. Ouvrir http://localhost:5173
2. Cliquer sur "Commencer le diagnostic"
3. Répondre aux questions :
   - Type d'appareil : "smartphone"
   - Modèle : "iPhone 12"
   - Problème : "L'écran ne s'allume plus"
   - Contexte : "Tombé hier dans l'eau"

? **Vérification Supabase :**
```sql
-- Voir le dernier diagnostic créé
SELECT * FROM diagnostics ORDER BY created_at DESC LIMIT 1;

-- Voir les messages de la conversation
SELECT * FROM messages_chat 
WHERE diagnostic_id = 'ID_DU_DIAGNOSTIC' 
ORDER BY created_at;
```

### Test 2 : Estimation
1. Vérifier que l'estimation s'affiche (39€-79€)
2. Cliquer sur "Continuer"

? **Vérification Supabase :**
```sql
-- Voir que l'estimation a été sauvegardée
SELECT session_id, appareil, modele, estimation_min, estimation_max, status
FROM diagnostics 
ORDER BY created_at DESC LIMIT 1;
```

### Test 3 : Sélection magasin
1. Cliquer sur "Rendez-vous en magasin"
2. Sélectionner "Save République"
3. Cliquer sur "Confirmer - Save République"

? **Vérification Supabase :**
```sql
-- Voir le rendez-vous créé
SELECT 
  a.type, 
  a.status, 
  s.name as store_name,
  d.appareil
FROM appointments a
LEFT JOIN stores s ON a.store_id = s.id
LEFT JOIN diagnostics d ON a.diagnostic_id = d.id
ORDER BY a.created_at DESC LIMIT 1;
```

### Test 4 : Confirmation
1. Sur la page confirmation, vérifier les détails
2. Cliquer sur "Retour à l'accueil"

? **Vérification Supabase :**
```sql
-- Vérifier que le statut a été mis à jour
SELECT status FROM diagnostics ORDER BY updated_at DESC LIMIT 1;
-- Devrait être 'termine'

SELECT status FROM appointments ORDER BY updated_at DESC LIMIT 1;
-- Devrait être 'termine'
```

### Test 5 : Page Rendez-vous
1. Aller sur http://localhost:5173/appointments
2. Vérifier que le rendez-vous s'affiche

? Vous devriez voir :
- Le type (? ou ?)
- L'appareil et le problème
- Le statut avec la couleur appropriée
- Les détails du magasin

## Étape 6 : Test de la visio

1. Recommencer un nouveau diagnostic
2. Cette fois, choisir "Visio immédiate"
3. Attendre la génération du lien
4. Cliquer sur "Rejoindre la visio"

? **Vérification Supabase :**
```sql
-- Voir le rendez-vous visio
SELECT type, status, visio_link, scheduled_at
FROM appointments
WHERE type = 'visio'
ORDER BY created_at DESC LIMIT 1;
```

## ? Dépannage rapide

### Erreur : "Failed to fetch"
? **Problème :** Les variables d'environnement ne sont pas correctes  
? **Solution :** Vérifiez votre `.env` et redémarrez le serveur (`npm run dev`)

### Erreur : "relation does not exist"
? **Problème :** Les tables ne sont pas créées  
? **Solution :** Réappliquez le script SQL de migration

### Les magasins ne s'affichent pas
? **Problème :** Les données de seed ne sont pas insérées  
? **Solution :** Exécutez manuellement :
```sql
INSERT INTO stores (name, address, city, postal_code, latitude, longitude, rating, phone, is_active) VALUES
('Save République', '12 Rue du Temple', 'Paris', '75003', 48.8632, 2.3632, 4.6, '+33 1 42 77 88 99', true),
('Atelier Mobile Plus', '45 Boulevard Voltaire', 'Paris', '75011', 48.8632, 2.3792, 4.8, '+33 1 43 38 29 10', true),
('Repair Center Paris', '8 Avenue de la République', 'Paris', '75011', 48.8648, 2.3805, 4.5, '+33 1 48 06 77 88', true);
```

### Erreur RLS : "new row violates row-level security policy"
? **Problème :** Les politiques RLS bloquent les insertions  
? **Solution temporaire :** Désactiver RLS pour tester
```sql
ALTER TABLE diagnostics DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages_chat DISABLE ROW LEVEL SECURITY;
ALTER TABLE appointments DISABLE ROW LEVEL SECURITY;
```

?? **IMPORTANT :** Réactivez RLS ensuite :
```sql
ALTER TABLE diagnostics ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages_chat ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
```

## ? Requêtes SQL utiles

### Voir les derniers diagnostics
```sql
SELECT 
  session_id,
  appareil,
  modele,
  symptome,
  status,
  created_at
FROM diagnostics
ORDER BY created_at DESC
LIMIT 5;
```

### Voir les rendez-vous avec tous les détails
```sql
SELECT 
  a.id,
  a.type,
  a.status,
  a.created_at,
  d.appareil || ' ' || d.modele as device,
  d.symptome as problem,
  COALESCE(s.name, 'Visio') as location
FROM appointments a
LEFT JOIN diagnostics d ON a.diagnostic_id = d.id
LEFT JOIN stores s ON a.store_id = s.id
ORDER BY a.created_at DESC;
```

### Statistiques globales
```sql
SELECT 
  (SELECT COUNT(*) FROM diagnostics) as total_diagnostics,
  (SELECT COUNT(*) FROM diagnostics WHERE status = 'termine') as diagnostics_termines,
  (SELECT COUNT(*) FROM appointments WHERE type = 'visio') as rendez_vous_visio,
  (SELECT COUNT(*) FROM appointments WHERE type = 'store') as rendez_vous_magasin;
```

### Nettoyer les données de test
```sql
-- ?? ATTENTION : Supprime toutes les données !
TRUNCATE TABLE appointments, messages_chat, diagnostics CASCADE;
-- Les stores ne sont pas supprimés
```

## ? Checklist finale

- [ ] Tables créées dans Supabase
- [ ] 3 magasins présents dans la table `stores`
- [ ] Variables d'environnement configurées
- [ ] Application lancée sans erreur
- [ ] Test diagnostic complet effectué
- [ ] Test rendez-vous magasin effectué
- [ ] Test rendez-vous visio effectué
- [ ] Page rendez-vous affiche les données
- [ ] Statuts correctement mis à jour

## ? Félicitations !

Si tous les tests passent, votre intégration Supabase est **opérationnelle** ! 

### Prochaines étapes suggérées :

1. **Authentification utilisateur**
   - Ajouter Supabase Auth
   - Filtrer les rendez-vous par utilisateur
   - Ajouter email/téléphone dans les formulaires

2. **Notifications**
   - Envoyer des emails de confirmation
   - SMS pour les rappels de rendez-vous

3. **Améliorations UX**
   - Calcul de distance réelle avec géolocalisation
   - Calendrier de disponibilités des magasins
   - Système de notation après réparation

4. **Analytics**
   - Dashboard admin
   - Statistiques des diagnostics
   - Taux de conversion

---

Pour plus de détails, consultez :
- ? `supabase/MIGRATION_README.md` - Guide détaillé de migration
- ? `.github/feature2.md` - Documentation complète de l'architecture
- ? `.github/IMPLEMENTATION_REPORT.md` - Rapport d'implémentation

**Support :** En cas de problème, ouvrez une issue avec les logs d'erreur.

