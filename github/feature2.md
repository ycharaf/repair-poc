# Feature 2 - Intégration Supabase

## ? Analyse de l'existant

### État actuel
- ? **Aucune page n'utilise Supabase directement**
- ?? Toutes les données sont stockées en **localStorage** (non persistant, limité au navigateur)
- ? Client Supabase configuré dans `src/lib/supabase.ts`
- ? Edge Function `diagnostic-agent` appelée depuis `ChatAssistant.tsx`

---

## ?? Architecture Base de Données

### Tables à créer

#### 1. **diagnostics**
Stocke les diagnostics des utilisateurs

```sql
CREATE TABLE diagnostics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT UNIQUE NOT NULL,
  appareil TEXT NOT NULL,
  modele TEXT,
  symptome TEXT NOT NULL,
  contexte TEXT,
  estimation_min DECIMAL(10,2),
  estimation_max DECIMAL(10,2),
  duree_min INTEGER, -- en minutes
  duree_max INTEGER, -- en minutes
  status TEXT DEFAULT 'en_cours', -- en_cours, termine, annule
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour recherche rapide
CREATE INDEX idx_diagnostics_session_id ON diagnostics(session_id);
CREATE INDEX idx_diagnostics_created_at ON diagnostics(created_at DESC);
```

#### 2. **messages_chat**
Historique des conversations du diagnostic

```sql
CREATE TABLE messages_chat (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id TEXT NOT NULL,
  diagnostic_id UUID REFERENCES diagnostics(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'user' ou 'bot'
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour récupération rapide des messages d'une session
CREATE INDEX idx_messages_session ON messages_chat(session_id, created_at);
CREATE INDEX idx_messages_diagnostic ON messages_chat(diagnostic_id);
```

#### 3. **stores** (magasins partenaires)
Liste des ateliers de réparation

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postal_code TEXT NOT NULL,
  latitude DECIMAL(10,7),
  longitude DECIMAL(10,7),
  rating DECIMAL(2,1) DEFAULT 0.0,
  phone TEXT,
  email TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index géospatial (si besoin de recherche par localisation)
CREATE INDEX idx_stores_location ON stores(latitude, longitude);
CREATE INDEX idx_stores_active ON stores(is_active) WHERE is_active = true;
```

#### 4. **appointments** (rendez-vous)
Réservations des utilisateurs

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  diagnostic_id UUID REFERENCES diagnostics(id) ON DELETE SET NULL,
  store_id UUID REFERENCES stores(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'visio' ou 'store'
  status TEXT DEFAULT 'confirme', -- confirme, termine, annule, en_attente
  visio_link TEXT, -- lien Google Meet si type = 'visio'
  scheduled_at TIMESTAMP WITH TIME ZONE,
  user_email TEXT,
  user_phone TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour les requêtes fréquentes
CREATE INDEX idx_appointments_diagnostic ON appointments(diagnostic_id);
CREATE INDEX idx_appointments_store ON appointments(store_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_appointments_scheduled ON appointments(scheduled_at);
```

---

## ? Requêtes Supabase par Page

### ? **home.tsx**
**Statut actuel :** Aucune interaction avec la base de données

**Actions nécessaires :**
- ? Aucune modification nécessaire (page statique)
- Optionnel : Compteur de diagnostics effectués

```typescript
// Optionnel : Afficher statistiques
const { count } = await supabase
  .from('diagnostics')
  .select('*', { count: 'exact', head: true })
  .eq('status', 'termine');
```

---

### ? **diagnostic.tsx ? ChatAssistant.tsx**
**Statut actuel :** Utilise localStorage + appelle Edge Function

**Actions nécessaires :**

#### 1. **INSERT** - Créer une session de diagnostic au démarrage
```typescript
// Au montage du composant
const initDiagnostic = async () => {
  const sessionId = crypto.randomUUID();
  
  const { data, error } = await supabase
    .from('diagnostics')
    .insert({
      session_id: sessionId,
      appareil: '',
      symptome: '',
      status: 'en_cours'
    })
    .select()
    .single();
    
  if (data) {
    setDiagnosticId(data.id);
    localStorage.setItem('session_id', sessionId);
  }
};
```

#### 2. **INSERT** - Sauvegarder chaque message du chat
```typescript
// À chaque message envoyé
const saveMessage = async (type: 'user' | 'bot', content: string) => {
  await supabase
    .from('messages_chat')
    .insert({
      session_id: localStorage.getItem('session_id'),
      diagnostic_id: diagnosticId,
      type,
      content
    });
};
```

#### 3. **UPDATE** - Mettre à jour le diagnostic au fur et à mesure
```typescript
// Après chaque étape du diagnostic
const updateDiagnostic = async (updates: Partial<DiagnosticData>) => {
  const sessionId = localStorage.getItem('session_id');
  
  await supabase
    .from('diagnostics')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('session_id', sessionId);
};
```

---

### ? **EstimationPage.tsx**
**Statut actuel :** Lit depuis localStorage

**Actions nécessaires :**

#### 1. **SELECT** - Récupérer le diagnostic
```typescript
// Remplacer localStorage par Supabase
const { data: diagnostic } = await supabase
  .from('diagnostics')
  .select('*')
  .eq('session_id', sessionId)
  .single();
```

#### 2. **UPDATE** - Sauvegarder l'estimation
```typescript
// Sauvegarder l'estimation calculée
const saveEstimation = async () => {
  await supabase
    .from('diagnostics')
    .update({
      estimation_min: 39,
      estimation_max: 79,
      duree_min: 45,
      duree_max: 120,
      status: 'estime'
    })
    .eq('session_id', sessionId);
};
```

---

### ? **ChooseMethodPage.tsx**
**Statut actuel :** Page de navigation pure

**Actions nécessaires :**
- ? Aucune modification nécessaire (pas de données à persister)

---

### ? **StoreSelectionPage.tsx**
**Statut actuel :** Liste hardcodée + localStorage

**Actions nécessaires :**

#### 1. **SELECT** - Récupérer les magasins depuis Supabase
```typescript
// Remplacer STORES hardcodé
const { data: stores } = await supabase
  .from('stores')
  .select('*')
  .eq('is_active', true)
  .order('name');
```

#### 2. **INSERT** - Pré-créer le rendez-vous
```typescript
// Quand l'utilisateur sélectionne un magasin
const selectStore = async (store: Store) => {
  setSelectedStore(store);
  
  // Optionnel : créer le RDV en statut "en_attente"
  const { data } = await supabase
    .from('appointments')
    .insert({
      diagnostic_id: diagnosticId,
      store_id: store.id,
      type: 'store',
      status: 'en_attente'
    })
    .select()
    .single();
    
  if (data) {
    localStorage.setItem('appointment_id', data.id);
  }
};
```

---

### ? **VisioPage.tsx**
**Statut actuel :** Génère un lien Google Meet local

**Actions nécessaires :**

#### 1. **INSERT** - Créer le rendez-vous visio
```typescript
// Quand le lien Meet est généré
const createVisioAppointment = async (meetLink: string) => {
  const { data } = await supabase
    .from('appointments')
    .insert({
      diagnostic_id: diagnosticId,
      type: 'visio',
      status: 'confirme',
      visio_link: meetLink,
      scheduled_at: new Date().toISOString()
    })
    .select()
    .single();
    
  if (data) {
    localStorage.setItem('appointment_id', data.id);
  }
};
```

---

### ? **ConfirmationPage.tsx**
**Statut actuel :** Lit depuis localStorage

**Actions nécessaires :**

#### 1. **SELECT** - Récupérer les détails du rendez-vous
```typescript
// Récupérer l'appointment complet avec les relations
const { data: appointment } = await supabase
  .from('appointments')
  .select(`
    *,
    diagnostic:diagnostics(*),
    store:stores(*)
  `)
  .eq('id', appointmentId)
  .single();
```

#### 2. **UPDATE** - Marquer le diagnostic comme terminé
```typescript
// Au clic sur "Retour à l'accueil"
const finishDiagnostic = async () => {
  const sessionId = localStorage.getItem('session_id');
  
  // Mettre à jour le diagnostic
  await supabase
    .from('diagnostics')
    .update({ status: 'termine' })
    .eq('session_id', sessionId);
    
  // Mettre à jour le rendez-vous
  await supabase
    .from('appointments')
    .update({ status: 'termine' })
    .eq('id', appointmentId);
};
```

---

### ? **appointments.tsx**
**Statut actuel :** Page vide

**Actions nécessaires :**

#### 1. **SELECT** - Lister les rendez-vous (si authentification future)
```typescript
// Récupérer les RDV d'un utilisateur
const { data: appointments } = await supabase
  .from('appointments')
  .select(`
    *,
    diagnostic:diagnostics(*),
    store:stores(*)
  `)
  .eq('user_email', userEmail)
  .order('scheduled_at', { ascending: false });
```

---

## ? Plan d'implémentation

### Phase 1 : Création de la base de données
1. Créer les 4 tables dans Supabase
2. Configurer les politiques RLS (Row Level Security)
3. Insérer des données de test pour `stores`

### Phase 2 : Intégration progressive
1. **diagnostic.tsx / ChatAssistant.tsx** ? Priorité HAUTE
   - Remplacer localStorage par Supabase
   - Sauvegarder messages et diagnostic
   
2. **EstimationPage.tsx** ? Priorité HAUTE
   - Lire depuis Supabase
   - Mettre à jour l'estimation

3. **StoreSelectionPage.tsx** ? Priorité MOYENNE
   - Charger les magasins depuis la DB
   - Créer le rendez-vous

4. **VisioPage.tsx** ? Priorité MOYENNE
   - Sauvegarder le lien Meet
   - Créer le rendez-vous visio

5. **ConfirmationPage.tsx** ? Priorité BASSE
   - Afficher les données depuis Supabase
   - Marquer comme terminé

6. **appointments.tsx** ? Priorité FUTURE
   - Nécessite authentification utilisateur

### Phase 3 : Optimisations
- Ajouter des indices pour performance
- Mettre en place des triggers pour `updated_at`
- Créer des vues pour requêtes complexes

---

## ? Sécurité (RLS Policies)

### Politique pour `diagnostics`
```sql
-- Tout le monde peut créer un diagnostic (anonyme)
CREATE POLICY "Allow anonymous insert"
  ON diagnostics FOR INSERT
  WITH CHECK (true);

-- Tout le monde peut lire son propre diagnostic via session_id
CREATE POLICY "Allow read own diagnostic"
  ON diagnostics FOR SELECT
  USING (true);

-- Tout le monde peut mettre à jour son propre diagnostic
CREATE POLICY "Allow update own diagnostic"
  ON diagnostics FOR UPDATE
  USING (true);
```

### Politique pour `messages_chat`
```sql
CREATE POLICY "Allow insert messages"
  ON messages_chat FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read messages"
  ON messages_chat FOR SELECT
  USING (true);
```

### Politique pour `stores`
```sql
-- Lecture publique uniquement
CREATE POLICY "Allow public read"
  ON stores FOR SELECT
  USING (is_active = true);
```

### Politique pour `appointments`
```sql
CREATE POLICY "Allow insert appointments"
  ON appointments FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow read appointments"
  ON appointments FOR SELECT
  USING (true);

CREATE POLICY "Allow update appointments"
  ON appointments FOR UPDATE
  USING (true);
```

---

## ? Données de seed pour `stores`

```sql
INSERT INTO stores (name, address, city, postal_code, latitude, longitude, rating, phone, is_active) VALUES
('Save République', '12 Rue du Temple', 'Paris', '75003', 48.8632, 2.3632, 4.6, '+33 1 42 77 88 99', true),
('Atelier Mobile Plus', '45 Boulevard Voltaire', 'Paris', '75011', 48.8632, 2.3792, 4.8, '+33 1 43 38 29 10', true),
('Repair Center Paris', '8 Avenue de la République', 'Paris', '75011', 48.8648, 2.3805, 4.5, '+33 1 48 06 77 88', true);
```

---

## ? Checklist

### Base de données
- [x] Créer table `diagnostics` ? **FAIT** - Script SQL créé dans `supabase/migrations/20250104_create_tables.sql`
- [x] Créer table `messages_chat` ? **FAIT** - Script SQL créé
- [x] Créer table `stores` ? **FAIT** - Script SQL créé
- [x] Créer table `appointments` ? **FAIT** - Script SQL créé
- [x] Configurer RLS policies ? **FAIT** - Toutes les politiques configurées
- [x] Insérer données seed `stores` ? **FAIT** - 3 magasins ajoutés dans le script

### Code - ChatAssistant.tsx
- [x] Créer diagnostic au démarrage (INSERT) ? **FAIT** - Ligne 46-61
- [x] Sauvegarder les messages (INSERT) ? **FAIT** - Fonction `saveMessage()` ligne 88-100
- [x] Mettre à jour le diagnostic (UPDATE) ? **FAIT** - Fonction `updateDiagnostic()` ligne 102-116

### Code - EstimationPage.tsx
- [x] Lire diagnostic depuis Supabase (SELECT) ? **FAIT** - Ligne 20-27
- [x] Sauvegarder estimation (UPDATE) ? **FAIT** - Ligne 31-41

### Code - StoreSelectionPage.tsx
- [x] Charger magasins depuis Supabase (SELECT) ? **FAIT** - Ligne 30-41
- [x] Créer rendez-vous magasin (INSERT) ? **FAIT** - Ligne 66-82
- [x] Confirmer rendez-vous (UPDATE) ? **FAIT** - Ligne 92-98

### Code - VisioPage.tsx
- [x] Créer rendez-vous visio (INSERT) ? **FAIT** - Ligne 25-41

### Code - ConfirmationPage.tsx
- [x] Lire rendez-vous depuis Supabase (SELECT) ? **FAIT** - Ligne 29-58
- [x] Marquer comme terminé (UPDATE) ? **FAIT** - Ligne 84-96

### Code - appointments.tsx
- [x] Lister les rendez-vous (SELECT) ? **FAIT** - Ligne 35-49, page complète implémentée

---

## ? Avantages de l'intégration Supabase

1. **Persistance des données** : Plus de perte au refresh
2. **Multi-device** : Accès depuis plusieurs appareils
3. **Analytics** : Statistiques sur les diagnostics
4. **Support client** : Accès aux historiques
5. **Scalabilité** : Gestion de milliers d'utilisateurs
6. **Backup automatique** : Sécurité des données

---

## ? Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation RLS](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor Supabase](https://supabase.com/docs/guides/database/overview)

