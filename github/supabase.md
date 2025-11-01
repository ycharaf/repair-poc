# Supabase - Base de données et Requêtes

Ce document décrit le schéma de base de données PostgreSQL et les requêtes utilisées dans le projet.

---

## ? Schema SQL

### 1. Table `profils`

Stocke les informations des utilisateurs (clients et réparateurs).

```sql
-- Create profils table
CREATE TABLE IF NOT EXISTS public.profils (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  nom TEXT NOT NULL,
  prenom TEXT,
  telephone TEXT,
  role TEXT NOT NULL CHECK (role IN ('client', 'reparateur')),
  
  -- Champs spécifiques aux réparateurs
  rating DECIMAL(2,1) DEFAULT 0.0,
  verified BOOLEAN DEFAULT false,
  localisation TEXT,
  specialites TEXT[],
  garantie_mois INTEGER,
  prix_moyen DECIMAL(10,2),
  description TEXT,
  photo_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour améliorer les performances
CREATE INDEX idx_profils_user_id ON public.profils(user_id);
CREATE INDEX idx_profils_role ON public.profils(role);
CREATE INDEX idx_profils_verified ON public.profils(verified);

-- Enable Row Level Security
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Profils are viewable by everyone" 
  ON public.profils FOR SELECT 
  USING (true);

CREATE POLICY "Users can insert their own profile" 
  ON public.profils FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profils FOR UPDATE 
  USING (auth.uid() = user_id);
```

---

### 2. Table `appareils`

Catalogue des appareils disponibles pour réparation.

```sql
-- Create appareils table
CREATE TABLE IF NOT EXISTS public.appareils (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nom TEXT NOT NULL,
  marque TEXT NOT NULL,
  type TEXT NOT NULL,
  modele TEXT,
  image_url TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_appareils_marque ON public.appareils(marque);
CREATE INDEX idx_appareils_type ON public.appareils(type);

-- Enable RLS
ALTER TABLE public.appareils ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Appareils are viewable by everyone" 
  ON public.appareils FOR SELECT 
  USING (true);
```

---

### 3. Table `estimations`

Estimations de prix et délais par appareil.

```sql
-- Create estimations table
CREATE TABLE IF NOT EXISTS public.estimations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  appareil_id UUID REFERENCES public.appareils(id) ON DELETE CASCADE,
  appareil_nom TEXT,
  
  -- Prix en euros
  prix_min DECIMAL(10,2) NOT NULL,
  prix_max DECIMAL(10,2) NOT NULL,
  
  -- Délai en jours
  delai_min INTEGER NOT NULL,
  delai_max INTEGER NOT NULL,
  
  -- Description
  description TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_estimations_appareil_id ON public.estimations(appareil_id);

-- Enable RLS
ALTER TABLE public.estimations ENABLE ROW LEVEL SECURITY;

-- Policy
CREATE POLICY "Estimations are viewable by everyone" 
  ON public.estimations FOR SELECT 
  USING (true);
```

---

### 4. Table `reparations`

Suivi des réparations en cours et terminées.

```sql
-- Create reparations table
CREATE TABLE IF NOT EXISTS public.reparations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  client_id UUID REFERENCES public.profils(id) ON DELETE CASCADE,
  reparateur_id UUID REFERENCES public.profils(id) ON DELETE SET NULL,
  appareil_id UUID REFERENCES public.appareils(id) ON DELETE SET NULL,
  
  -- Informations
  appareil_nom TEXT NOT NULL,
  reparateur_nom TEXT,
  
  -- Statut
  statut TEXT NOT NULL DEFAULT 'en_attente' CHECK (
    statut IN (
      'en_attente',
      'acceptee',
      'en_cours_diagnostic',
      'en_cours_reparation',
      'en_cours_test',
      'terminee',
      'prete_a_recuperer',
      'recuperee',
      'annulee'
    )
  ),
  
  -- Dates
  date_demande TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date_debut TIMESTAMP WITH TIME ZONE,
  date_fin_estimee TIMESTAMP WITH TIME ZONE,
  date_fin_reelle TIMESTAMP WITH TIME ZONE,
  
  -- Prix
  prix_estime DECIMAL(10,2),
  prix_final DECIMAL(10,2),
  
  -- Détails
  description_probleme TEXT,
  notes_reparateur TEXT,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_reparations_client_id ON public.reparations(client_id);
CREATE INDEX idx_reparations_reparateur_id ON public.reparations(reparateur_id);
CREATE INDEX idx_reparations_statut ON public.reparations(statut);
CREATE INDEX idx_reparations_date_demande ON public.reparations(date_demande DESC);

-- Enable RLS
ALTER TABLE public.reparations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Clients can view their own reparations" 
  ON public.reparations FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM public.profils WHERE id = client_id
  ));

CREATE POLICY "Reparateurs can view their reparations" 
  ON public.reparations FOR SELECT 
  USING (auth.uid() IN (
    SELECT user_id FROM public.profils WHERE id = reparateur_id
  ));

CREATE POLICY "Clients can create reparations" 
  ON public.reparations FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.profils WHERE id = client_id
  ));

CREATE POLICY "Reparateurs can update their reparations" 
  ON public.reparations FOR UPDATE 
  USING (auth.uid() IN (
    SELECT user_id FROM public.profils WHERE id = reparateur_id
  ));
```

---

### 5. Table `avis`

Système de notation et avis.

```sql
-- Create avis table
CREATE TABLE IF NOT EXISTS public.avis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Relations
  reparation_id UUID REFERENCES public.reparations(id) ON DELETE CASCADE,
  client_id UUID REFERENCES public.profils(id) ON DELETE CASCADE,
  reparateur_id UUID REFERENCES public.profils(id) ON DELETE CASCADE,
  
  -- Notation
  note INTEGER NOT NULL CHECK (note >= 1 AND note <= 5),
  commentaire TEXT,
  
  -- Modération
  approuve BOOLEAN DEFAULT false,
  
  -- Métadonnées
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX idx_avis_reparateur_id ON public.avis(reparateur_id);
CREATE INDEX idx_avis_reparation_id ON public.avis(reparation_id);
CREATE INDEX idx_avis_approuve ON public.avis(approuve);

-- Enable RLS
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Approved avis are viewable by everyone" 
  ON public.avis FOR SELECT 
  USING (approuve = true);

CREATE POLICY "Clients can create their own avis" 
  ON public.avis FOR INSERT 
  WITH CHECK (auth.uid() IN (
    SELECT user_id FROM public.profils WHERE id = client_id
  ));
```

---

## ? Requêtes principales

### 1. Récupérer tous les appareils

```typescript
const { data, error } = await supabase
  .from('appareils')
  .select('id, nom, marque, type, image_url')
  .order('marque', { ascending: true });
```

---

### 2. Récupérer une estimation par appareil

```typescript
const { data, error } = await supabase
  .from('estimations')
  .select('*')
  .eq('appareil_id', deviceId)
  .single();
```

---

### 3. Récupérer les réparateurs vérifiés

```typescript
const { data, error } = await supabase
  .from('profils')
  .select('id, nom, rating, verified, localisation, specialites, garantie_mois, prix_moyen')
  .eq('role', 'reparateur')
  .eq('verified', true)
  .order('rating', { ascending: false });
```

---

### 4. Créer une réparation

```typescript
const { data, error } = await supabase
  .from('reparations')
  .insert({
    client_id: clientId,
    reparateur_id: reparateurId,
    appareil_id: appareilId,
    appareil_nom: 'iPhone 14 Pro',
    reparateur_nom: 'TechRepair Pro',
    statut: 'en_attente',
    description_probleme: 'Écran cassé',
    prix_estime: 120.00,
    date_fin_estimee: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // +2 jours
  })
  .select()
  .single();
```

---

### 5. Récupérer le statut d'une réparation

```typescript
const { data, error } = await supabase
  .from('reparations')
  .select('*')
  .eq('id', repairId)
  .single();
```

---

### 6. Mettre à jour le statut d'une réparation

```typescript
const { data, error } = await supabase
  .from('reparations')
  .update({ 
    statut: 'en_cours_reparation',
    notes_reparateur: 'Remplacement de l\'écran en cours'
  })
  .eq('id', repairId)
  .select()
  .single();
```

---

### 7. Récupérer les réparations d'un client

```typescript
const { data, error } = await supabase
  .from('reparations')
  .select(`
    *,
    profils:reparateur_id (nom, rating, telephone)
  `)
  .eq('client_id', clientId)
  .order('date_demande', { ascending: false });
```

---

### 8. Récupérer les avis d'un réparateur

```typescript
const { data, error } = await supabase
  .from('avis')
  .select(`
    *,
    profils:client_id (nom, prenom)
  `)
  .eq('reparateur_id', reparateurId)
  .eq('approuve', true)
  .order('created_at', { ascending: false })
  .limit(10);
```

---

### 9. Créer un avis

```typescript
const { data, error } = await supabase
  .from('avis')
  .insert({
    reparation_id: reparationId,
    client_id: clientId,
    reparateur_id: reparateurId,
    note: 5,
    commentaire: 'Excellent service, rapide et efficace !',
    approuve: false // En attente de modération
  })
  .select()
  .single();
```

---

### 10. Calculer la moyenne des avis d'un réparateur

```typescript
const { data, error } = await supabase
  .rpc('calculate_repairer_rating', {
    repairer_id: reparateurId
  });

// Fonction SQL à créer :
/*
CREATE OR REPLACE FUNCTION calculate_repairer_rating(repairer_id UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(note), 0.0)
  FROM public.avis
  WHERE reparateur_id = repairer_id
    AND approuve = true;
$$ LANGUAGE SQL STABLE;
*/
```

---

### 11. Créer une réparation depuis l'interface (à implémenter)

Pour créer une vraie réparation lors de la sélection d'un réparateur, remplacer la fonction `handleSelectRepairer` dans `RepairersPage.tsx` :

```typescript
async function handleSelectRepairer(repairerId: string) {
  try {
    // Get current user (requires authentication)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    // Get client profile
    const { data: clientProfile } = await supabase
      .from('profils')
      .select('id')
      .eq('user_id', user.id)
      .single();

    // Get device info
    const { data: device } = await supabase
      .from('appareils')
      .select('nom')
      .eq('id', deviceId)
      .single();

    // Get repairer info
    const { data: repairer } = await supabase
      .from('profils')
      .select('nom')
      .eq('id', repairerId)
      .single();

    // Create repair
    const { data: repair, error } = await supabase
      .from('reparations')
      .insert({
        client_id: clientProfile?.id,
        reparateur_id: repairerId,
        appareil_id: deviceId,
        appareil_nom: device?.nom || 'Appareil',
        reparateur_nom: repairer?.nom || 'Réparateur',
        statut: 'en_attente',
        date_fin_estimee: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        description_probleme: 'À renseigner',
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating repair:', error);
      alert('Erreur lors de la création de la réparation');
      return;
    }

    // Navigate to tracking page
    navigate(`/tracking/${repair.id}`);
  } catch (err) {
    console.error('Error:', err);
    alert('Une erreur est survenue');
  }
}
```

---

## ? Fonctions SQL utiles

### 1. Fonction pour calculer la note moyenne

```sql
CREATE OR REPLACE FUNCTION calculate_repairer_rating(repairer_id UUID)
RETURNS DECIMAL AS $$
  SELECT COALESCE(AVG(note), 0.0)
  FROM public.avis
  WHERE reparateur_id = repairer_id
    AND approuve = true;
$$ LANGUAGE SQL STABLE;
```

---

### 2. Fonction pour mettre à jour automatiquement `updated_at`

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Appliquer aux tables
CREATE TRIGGER update_profils_updated_at
  BEFORE UPDATE ON public.profils
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appareils_updated_at
  BEFORE UPDATE ON public.appareils
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_estimations_updated_at
  BEFORE UPDATE ON public.estimations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reparations_updated_at
  BEFORE UPDATE ON public.reparations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_avis_updated_at
  BEFORE UPDATE ON public.avis
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

## ? Données de test (Mock Data)

### Insérer des appareils de test

```sql
INSERT INTO public.appareils (nom, marque, type) VALUES
  ('iPhone 14 Pro', 'Apple', 'Smartphone'),
  ('iPhone 13', 'Apple', 'Smartphone'),
  ('Samsung Galaxy S23', 'Samsung', 'Smartphone'),
  ('iPad Air', 'Apple', 'Tablette'),
  ('MacBook Pro 14"', 'Apple', 'Ordinateur portable'),
  ('Samsung Galaxy Tab', 'Samsung', 'Tablette');
```

---

### Insérer des estimations de test

```sql
INSERT INTO public.estimations (appareil_id, appareil_nom, prix_min, prix_max, delai_min, delai_max, description) 
SELECT 
  id,
  nom,
  80.00,
  150.00,
  1,
  3,
  'Réparation d''écran ou remplacement de batterie'
FROM public.appareils
WHERE nom = 'iPhone 14 Pro';
```

---

### Insérer des réparateurs de test

```sql
INSERT INTO public.profils (email, nom, role, rating, verified, localisation, specialites, garantie_mois, prix_moyen, description) VALUES
  ('techrepair@example.com', 'TechRepair Pro', 'reparateur', 4.8, true, 'Paris 11', ARRAY['iPhone', 'Samsung', 'iPad'], 12, 95.00, 'Spécialiste Apple et Samsung avec 10 ans d''expérience'),
  ('mobilefix@example.com', 'Mobile Fix Express', 'reparateur', 4.6, true, 'Paris 10', ARRAY['iPhone', 'Smartphones'], 6, 85.00, 'Réparations rapides, service express disponible'),
  ('reparationplus@example.com', 'Réparation Plus', 'reparateur', 4.9, true, 'Paris 3', ARRAY['Apple', 'Samsung', 'Tablettes'], 12, 110.00, 'Service premium avec garantie étendue');
```

---

## ? Configuration de sécurité

### Activer RLS (Row Level Security) sur toutes les tables

```sql
-- Déjà fait dans les scripts de création ci-dessus
ALTER TABLE public.profils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appareils ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estimations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reparations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.avis ENABLE ROW LEVEL SECURITY;
```

---

## ? Notes importantes

1. **UUID** : Utiliser `uuid_generate_v4()` pour générer des IDs uniques
2. **Timestamps** : Toutes les tables ont `created_at` et `updated_at`
3. **RLS** : Row Level Security activé sur toutes les tables pour la sécurité
4. **Index** : Créés sur les colonnes fréquemment requêtées
5. **Policies** : Définies pour contrôler l'accès aux données

---

**Dernière mise à jour :** 2025-01-11

