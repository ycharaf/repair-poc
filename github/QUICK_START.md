# Guide de démarrage rapide - Données de test Supabase

Ce guide vous explique comment configurer rapidement votre base de données Supabase avec des données de test pour tester l'application.

---

## ? Étape 1 : Créer les tables

Copiez et exécutez les scripts SQL suivants dans l'éditeur SQL de Supabase (dans l'ordre) :

### 1. Activer l'extension UUID

```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```

### 2. Créer la table `profils`

```sql
CREATE TABLE IF NOT EXISTS public.profils (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'reparateur')),
  rating DECIMAL(2,1) DEFAULT 0.0,
  verified BOOLEAN DEFAULT false,
  localisation TEXT,
  specialites TEXT[],
  garantie_mois INTEGER,
  prix_moyen DECIMAL(10,2),
  description TEXT,
  photo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profils_user_id ON public.profils(user_id);
CREATE INDEX idx_profils_role ON public.profils(role);
CREATE INDEX idx_profils_verified ON public.profils(verified);

ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profils are viewable by everyone" 
  ON public.profils FOR SELECT USING (true);
```

### 3. Créer la table `appareils`

```sql
CREATE TABLE IF NOT EXISTS public.appareils (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  marque TEXT NOT NULL,
  type TEXT NOT NULL,
  modele TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_appareils_marque ON public.appareils(marque);
CREATE INDEX idx_appareils_type ON public.appareils(type);

ALTER TABLE public.appareils ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Appareils are viewable by everyone" 
  ON public.appareils FOR SELECT USING (true);
```

### 4. Créer la table `estimations`

```sql
CREATE TABLE IF NOT EXISTS public.estimations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appareil_id UUID REFERENCES public.appareils(id) ON DELETE CASCADE,
  appareil_nom TEXT,
  prix_min DECIMAL(10,2) NOT NULL,
  prix_max DECIMAL(10,2) NOT NULL,
  delai_min INTEGER NOT NULL,
  delai_max INTEGER NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_estimations_appareil_id ON public.estimations(appareil_id);

ALTER TABLE public.estimations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Estimations are viewable by everyone" 
  ON public.estimations FOR SELECT USING (true);
```

### 5. Créer la table `reparations`

```sql
CREATE TABLE IF NOT EXISTS public.reparations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID REFERENCES public.profils(id) ON DELETE CASCADE,
  reparateur_id UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  appareil_id UUID REFERENCES public.appareils(id) ON DELETE SET NULL,
  appareil_nom TEXT NOT NULL,
  reparateur_nom TEXT,
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    statut IN (
      'en_attente', 'acceptee', 'en_cours_diagnostic',
      'en_cours_reparation', 'en_cours_test', 'terminee',
      'prete_a_recuperer', 'recuperee', 'annulee'
    )
  ),
  date_demande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_debut TIMESTAMP WITH TIME ZONE,
  date_fin_estimee TIMESTAMP WITH TIME ZONE,
  date_fin_reelle TIMESTAMP WITH TIME ZONE,
  prix_estime DECIMAL(10,2),
  prix_final DECIMAL(10,2),
  description_probleme TEXT,
  notes_reparateur TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_reparations_client_id ON public.reparations(client_id);
CREATE INDEX idx_reparations_reparateur_id ON public.reparations(reparateur_id);
CREATE INDEX idx_reparations_statut ON public.reparations(statut);

ALTER TABLE public.reparations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Reparations are viewable by everyone" 
  ON public.reparations FOR SELECT USING (true);
```

---

## ? Étape 2 : Insérer les données de test

### 1. Insérer les appareils

```sql
INSERT INTO public.appareils (nom, marque, type) VALUES
  ('iPhone 14 Pro', 'Apple', 'Smartphone'),
  ('iPhone 13', 'Apple', 'Smartphone'),
  ('iPhone 12', 'Apple', 'Smartphone'),
  ('Samsung Galaxy S23', 'Samsung', 'Smartphone'),
  ('Samsung Galaxy S22', 'Samsung', 'Smartphone'),
  ('iPad Air', 'Apple', 'Tablette'),
  ('iPad Pro', 'Apple', 'Tablette'),
  ('MacBook Pro 14"', 'Apple', 'Ordinateur portable'),
  ('MacBook Air M2', 'Apple', 'Ordinateur portable'),
  ('Samsung Galaxy Tab S8', 'Samsung', 'Tablette');
```

### 2. Insérer les réparateurs

```sql
INSERT INTO public.profils (email, nom, role, rating, verified, localisation, specialites, garantie_mois, prix_moyen, description) VALUES
  ('techrepair@example.com', 'TechRepair Pro', 'reparateur', 4.8, true, 'Paris 11', 
   ARRAY['iPhone', 'Samsung', 'iPad'], 12, 95.00, 
   'Spécialiste Apple et Samsung avec 10 ans d''expérience. Réparations certifiées avec pièces d''origine.'),
  
  ('mobilefix@example.com', 'Mobile Fix Express', 'reparateur', 4.6, true, 'Paris 10', 
   ARRAY['iPhone', 'Samsung', 'Smartphones'], 6, 85.00, 
   'Réparations rapides, service express disponible. Spécialiste des écrans cassés.'),
  
  ('reparationplus@example.com', 'Réparation Plus', 'reparateur', 4.9, true, 'Paris 3', 
   ARRAY['Apple', 'Samsung', 'Tablettes'], 12, 110.00, 
   'Service premium avec garantie étendue. Expert en réparations complexes.'),
  
  ('iphonerepair@example.com', 'iPhone Repair Center', 'reparateur', 4.7, true, 'Paris 5', 
   ARRAY['iPhone', 'iPad', 'MacBook'], 12, 105.00, 
   'Centre de réparation agréé Apple. Pièces certifiées uniquement.'),
  
  ('quickfix@example.com', 'QuickFix Services', 'reparateur', 4.5, true, 'Paris 18', 
   ARRAY['Tous appareils'], 3, 75.00, 
   'Réparations économiques et rapides. Tous types d''appareils acceptés.');
```

### 3. Insérer les estimations

```sql
-- Estimations pour iPhone 14 Pro
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id, nom, 80.00, 150.00, 1, 3,
  'Réparation d''écran, remplacement de batterie, ou réparation de connecteur de charge'
FROM public.appareils WHERE nom = 'iPhone 14 Pro';

-- Estimations pour iPhone 13
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id, nom, 70.00, 130.00, 1, 2,
  'Réparation d''écran, remplacement de batterie, réparation caméra'
FROM public.appareils WHERE nom = 'iPhone 13';

-- Estimations pour Samsung Galaxy S23
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id, nom, 75.00, 140.00, 1, 3,
  'Réparation d''écran AMOLED, remplacement de batterie'
FROM public.appareils WHERE nom = 'Samsung Galaxy S23';

-- Estimations pour iPad Air
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id, nom, 90.00, 180.00, 2, 4,
  'Réparation d''écran tactile, remplacement de batterie, réparation connecteur'
FROM public.appareils WHERE nom = 'iPad Air';

-- Estimations pour MacBook Pro
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id, nom, 150.00, 400.00, 3, 7,
  'Remplacement d''écran, réparation clavier, changement batterie, réparation carte mère'
FROM public.appareils WHERE nom LIKE 'MacBook%';
```

### 4. (Optionnel) Créer une réparation de test

```sql
-- Insérer une réparation en cours pour tester le tracking
INSERT INTO public.reparations (
  client_id, reparateur_id, appareil_id, 
  appareil_nom, reparateur_nom, statut,
  date_fin_estimee, prix_estime, description_probleme
)
SELECT 
  (SELECT id FROM public.profils WHERE role = 'reparateur' LIMIT 1),
  (SELECT id FROM public.profils WHERE role = 'reparateur' LIMIT 1),
  (SELECT id FROM public.appareils WHERE nom = 'iPhone 14 Pro' LIMIT 1),
  'iPhone 14 Pro',
  'TechRepair Pro',
  'en_cours_diagnostic',
  NOW() + INTERVAL '2 days',
  120.00,
  'Écran cassé suite à une chute'
RETURNING id;
```

**Note :** Gardez l'ID retourné pour tester la page de tracking : `/tracking/{id}`

---

## ? Étape 3 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```env
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_ici
```

Pour trouver vos clés :
1. Allez dans **Settings** > **API** dans votre projet Supabase
2. Copiez l'URL du projet et la clé `anon/public`

---

## ? Étape 4 : Tester l'application

```bash
npm run dev
```

Vous devriez maintenant voir :
- ? Liste des appareils sur `/devices`
- ? Estimations sur `/estimation/:deviceId`
- ? Liste des réparateurs sur `/repairers/:deviceId`
- ? Suivi de réparation sur `/tracking/:repairId` (si vous avez créé une réparation test)

---

## ? Dépannage

### Problème : "Aucun appareil disponible"

**Solution :** Vérifiez que :
1. Les tables sont bien créées
2. Les données sont insérées
3. Les variables d'environnement sont correctes
4. RLS (Row Level Security) est configuré avec les policies

### Problème : Erreur de connexion à Supabase

**Solution :**
```bash
# Vérifiez que les variables sont chargées
echo $VITE_SUPABASE_URL

# Redémarrez le serveur
npm run dev
```

### Vérifier les données dans Supabase

```sql
-- Compter les appareils
SELECT COUNT(*) FROM public.appareils;

-- Compter les réparateurs
SELECT COUNT(*) FROM public.profils WHERE role = 'reparateur';

-- Compter les estimations
SELECT COUNT(*) FROM public.estimations;
```

---

## ? Prochaines étapes

Une fois les données de test en place :

1. **Authentification** : Implémenter l'inscription/connexion
2. **Création de réparations** : Permettre aux clients de créer des demandes
3. **Mise à jour du statut** : Interface réparateur pour mettre à jour les réparations
4. **Système d'avis** : Permettre aux clients de noter les réparateurs

Consultez `github/feature.md` pour la roadmap complète.

---

**Dernière mise à jour :** 2025-01-11

