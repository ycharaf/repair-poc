# Migration Supabase - Guide d'Installation

## ? Prérequis

- Projet Supabase créé et configuré
- Variables d'environnement `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY` définies dans `.env`
- Supabase CLI installé (optionnel mais recommandé)

## ? Étape 1 : Appliquer la migration SQL

### Option A : Via l'interface Supabase (Recommandé pour débuter)

1. Connectez-vous à votre dashboard Supabase : https://app.supabase.com
2. Sélectionnez votre projet
3. Allez dans **SQL Editor** (dans le menu de gauche)
4. Cliquez sur **New Query**
5. Copiez-collez le contenu du fichier `supabase/migrations/20250104_create_tables.sql`
6. Cliquez sur **Run** (ou Ctrl+Enter)

### Option B : Via Supabase CLI

```bash
# Si vous avez Supabase CLI installé
npx supabase db push

# Ou avec migration spécifique
npx supabase migration up
```

## ? Étape 2 : Vérifier la création des tables

Dans le **SQL Editor**, exécutez cette requête pour vérifier :

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('diagnostics', 'messages_chat', 'stores', 'appointments');
```

Vous devriez voir 4 tables listées.

## ? Étape 3 : Vérifier les données de seed

Vérifiez que les magasins ont bien été insérés :

```sql
SELECT * FROM stores;
```

Vous devriez voir 3 magasins :
- Save République
- Atelier Mobile Plus
- Repair Center Paris

## ? Étape 4 : Vérifier les politiques RLS

Dans le dashboard Supabase :
1. Allez dans **Authentication** > **Policies**
2. Vérifiez que les politiques existent pour chaque table
3. RLS doit être activé (enabled) pour toutes les tables

## ? Étape 5 : Tester l'application

Lancez l'application en mode développement :

```bash
npm run dev
```

### Tests à effectuer :

1. **Page Diagnostic** (`/diagnostic`)
   - ? Démarrer un diagnostic
   - ? Voir les messages s'afficher
   - ? Vérifier dans Supabase que :
     - Un diagnostic est créé dans la table `diagnostics`
     - Les messages apparaissent dans `messages_chat`

2. **Page Estimation** (`/estimation`)
   - ? Vérifier que les données du diagnostic s'affichent
   - ? Vérifier que l'estimation est sauvegardée

3. **Page Magasins** (`/appointment/store`)
   - ? Vérifier que les 3 magasins s'affichent
   - ? Sélectionner un magasin
   - ? Vérifier qu'un rendez-vous est créé dans `appointments`

4. **Page Visio** (`/appointment/visio`)
   - ? Générer un lien de visio
   - ? Vérifier qu'un rendez-vous visio est créé

5. **Page Confirmation** (`/confirmation`)
   - ? Vérifier l'affichage des données
   - ? Cliquer sur "Retour à l'accueil"
   - ? Vérifier que le statut passe à "termine"

6. **Page Rendez-vous** (`/appointments`)
   - ? Vérifier l'affichage des rendez-vous
   - ? Vérifier les différents statuts

## ? Requêtes SQL utiles pour le debug

### Voir tous les diagnostics
```sql
SELECT * FROM diagnostics ORDER BY created_at DESC LIMIT 10;
```

### Voir les messages d'un diagnostic
```sql
SELECT mc.*, d.appareil, d.modele 
FROM messages_chat mc
JOIN diagnostics d ON mc.diagnostic_id = d.id
WHERE d.session_id = 'VOTRE_SESSION_ID'
ORDER BY mc.created_at;
```

### Voir tous les rendez-vous avec leurs détails
```sql
SELECT 
  a.*,
  d.appareil,
  d.modele,
  d.symptome,
  s.name as store_name
FROM appointments a
LEFT JOIN diagnostics d ON a.diagnostic_id = d.id
LEFT JOIN stores s ON a.store_id = s.id
ORDER BY a.created_at DESC;
```

### Compter les diagnostics par statut
```sql
SELECT status, COUNT(*) 
FROM diagnostics 
GROUP BY status;
```

## ? Résolution des problèmes courants

### Erreur : "relation does not exist"
- Vérifiez que la migration a bien été appliquée
- Vérifiez que vous êtes sur le bon projet Supabase

### Erreur : "new row violates row-level security policy"
- Vérifiez que les politiques RLS sont bien créées
- Essayez de désactiver temporairement RLS pour tester :
  ```sql
  ALTER TABLE nom_table DISABLE ROW LEVEL SECURITY;
  ```

### Les magasins ne s'affichent pas
- Vérifiez que les données de seed sont insérées :
  ```sql
  SELECT * FROM stores WHERE is_active = true;
  ```

### Les messages ne s'enregistrent pas
- Vérifiez la console du navigateur pour les erreurs
- Vérifiez que `session_id` et `diagnostic_id` sont bien stockés dans localStorage
- Vérifiez les politiques RLS de la table `messages_chat`

## ? Ajout de données de test supplémentaires

Si vous voulez ajouter plus de magasins pour tester :

```sql
INSERT INTO stores (name, address, city, postal_code, latitude, longitude, rating, phone, is_active) 
VALUES 
('Test Repair Shop', '123 Rue de Test', 'Paris', '75001', 48.8566, 2.3522, 4.7, '+33 1 23 45 67 89', true);
```

## ? Réinitialiser les données de test

Pour effacer toutes les données et recommencer :

```sql
-- ?? ATTENTION : Ceci va supprimer TOUTES les données !
TRUNCATE TABLE appointments, messages_chat, diagnostics CASCADE;
-- Les stores ne sont pas supprimés
```

## ? Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Reference](https://supabase.com/docs/guides/database/overview)

## ? Checklist de vérification finale

- [ ] Toutes les tables sont créées
- [ ] Les politiques RLS sont actives
- [ ] Les 3 magasins sont présents
- [ ] Un diagnostic peut être créé
- [ ] Les messages sont sauvegardés
- [ ] Les rendez-vous peuvent être créés
- [ ] La page rendez-vous affiche les données
- [ ] Le statut passe à "termine" à la fin

---

**? Félicitations ! Votre intégration Supabase est complète.**

Pour toute question, référez-vous au fichier `.github/feature2.md` pour plus de détails sur l'architecture.

