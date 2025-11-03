
# Feature: Diagnostic Conversationnel (Page dédiée)

## 📱 **Important : Projet 100% Mobile**

Cette application est conçue **exclusivement pour mobile** :
- Interface optimisée pour écrans tactiles (smartphones)
- Navigation adaptée au pouce (thumb-friendly)
- Composants et interactions pensés mobile-first
- Pas de version desktop prévue dans le POC

---

Cette feature ajoute une page **/diagnostic** avec une interface de chat **pleine page mobile**, permettant à l'utilisateur de décrire son problème et d'être guidé par un **agent IA (Lyro)** pour réaliser un **pré-diagnostic** avant mise en relation avec un réparateur.

L'interface est **internalisée dans React** (pas de widget Tidio flottant) et optimisée pour l'utilisation sur smartphone.

---

## 🎯 Objectifs

- Collecter 4 informations essentielles :
    1. Type d’appareil
    2. Marque / Modèle
    3. Symptômes (texte + photo optionnelle)
    4. Contexte (âge, dernier usage, bruits, odeurs, voyants, etc.)
- Poser **3 questions de pré-diagnostic simples**.
- Identifier :
    - Cas RAS (produit OK)
    - Cas résolus par manipulation simple
    - Cas nécessitant une visio avec réparateur

---

## 🧱 Architecture Résumée

```
React Page /diagnostic (UI conversation)
↓
Lyro API (Tidio) (Agent conversationnel)
↓
Supabase (conversations table + matching réparateurs)
```

Le widget Tidio est **chargé mais caché**, l’UI est **faite en React**.

---

## ✅ Étape 1 — Configuration Lyro (dans Tidio)

1. Tidio → **AI Chatbots → Lyro → Enable**
2. Tidio → **Lyro → Customize → System instructions**
3. Coller ce prompt :  
   *(prompt interne technicien pré-diagnostic)*

4. Générer un token API :  
   `AI Chatbots → Lyro → Settings → API Access → Generate Token`

5. Ajouter au `.env` :

```env
VITE_LYRO_TOKEN=sk_xxxxx
```

---

## 🟣 Étape 2 — Masquer le widget Tidio

## 🟢 Étape 3 — Interface React Mobile (page `/diagnostic`)

```css
#tidio-chat-iframe {
  display: none !important;
}
```

---

## 🟢 Étape 3 — Interface React (page `/diagnostic`)

Créer `src/pages/Diagnostic.tsx` :

```tsx
import { useState } from "react";

export default function Diagnostic() {
  const [messages, setMessages] = useState([
    { from: "bot", text: "Bonjour 👋 Décris-moi ton problème." }
  ]);
  const [input, setInput] = useState("");

  async function sendMessage() {
    setMessages((m) => [...m, { from: "user", text: input }]);

    const res = await fetch("https://api.tidio.co/lyro/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${import.meta.env.VITE_LYRO_TOKEN}`
      },
      body: JSON.stringify({
        message: input,
    <div className="flex flex-col h-screen bg-white">
      {/* Header mobile */}
      <div className="sticky top-0 bg-white border-b px-4 py-4 shadow-sm">
        <h1 className="text-xl font-bold">Diagnostic guidé</h1>
      </div>
    });
      {/* Messages - zone scrollable */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
    const data = await res.json();
          <div key={i} className={m.from === "user" ? "flex justify-end" : "flex justify-start"}>
            <span className={`inline-block px-4 py-3 rounded-2xl max-w-[80%] ${
              m.from === "user" 
                ? "bg-blue-600 text-white" 
                : "bg-gray-100 text-gray-900"
            }`}>
  }

  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Diagnostic guidé</h1>

      {/* Input - fixé en bas (mobile keyboard friendly) */}
      <div className="sticky bottom-0 bg-white border-t px-4 py-3 safe-area-inset-bottom">
        <div className="flex gap-2 items-end">
          <input
            className="flex-1 border rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Votre réponse..."
            autoComplete="off"
          />
          <button 
            onClick={sendMessage} 
            disabled={!input.trim()}
            className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
            aria-label="Envoyer le message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      <div className="flex gap-2">
        <input
          className="flex-1 border rounded-lg p-2"
          value={input}
          onChange={(e) => setInput(e.target.value)}

### 📱 Spécificités Mobile :
- **Layout pleine hauteur** (`h-screen`) pour occuper tout l'écran mobile
- **Messages scrollables** avec zone de saisie fixée en bas
- **Bulles de chat** avec max-width 80% pour lisibilité mobile
- **Input circulaire** optimisé pour le pouce
- **Bouton d'envoi tactile** avec feedback visuel (`active:scale-95`)
- **Support clavier mobile** avec `onKeyPress` pour Enter
- **Safe area inset** pour les notchs/barres de navigation iOS
- **Tailles de touch targets** ≥ 44px (recommandation Apple/Google)
          placeholder="Votre réponse..."
        />
        <button onClick={sendMessage} className="bg-black text-white px-4 py-2 rounded-lg">
          Envoyer
        </button>
      </div>
    </div>
  );
}
```

Ajouter la route :

```tsx
<Route path="/diagnostic" element={<Diagnostic />} />
```

| Page `/diagnostic` visible sur mobile | ✅ |
| Chat fonctionne en plein écran mobile | ✅ |
## 🔵 Étape 4 — Stockage dans Supabase (option recommandé)

| Interface tactile optimisée (touch targets ≥ 44px) | ✅ |
| Clavier mobile bien géré (input fixé en bas) | ✅ |
| Scroll fluide des messages | ✅ |
| Safe area iOS respectée | ✅ |
Créer table SQL :

---

## 📱 Tests Mobile Recommandés

1. **Responsive** : Tester sur iPhone SE (petit écran) et iPhone 14 Pro Max (grand écran)
2. **Clavier** : Vérifier que l'input reste visible quand le clavier mobile apparaît
3. **Scroll** : Messages plus anciens accessibles par scroll fluide
4. **Touch** : Tous les boutons tactiles facilement cliquables au pouce
5. **Orientation** : Tester portrait uniquement (pas de landscape pour le chat)
6. **Performance** : Vérifier que le chat reste fluide avec 50+ messages

---

## 🎨 Design Mobile Best Practices Appliqués

- ✅ **Touch targets minimums** : 44x44px (Apple) / 48x48dp (Material Design)
- ✅ **Thumb zone** : Boutons principaux en bas, accessibles au pouce
- ✅ **Feedback tactile** : Animations au tap (`active:scale-95`)
- ✅ **Contrast ratio** : 4.5:1 minimum (WCAG AA)
- ✅ **Font size** : 16px minimum pour éviter le zoom auto iOS
- ✅ **Safe areas** : Respect des notchs et barres de navigation
- ✅ **Fixed input** : Clavier mobile ne cache pas la zone de saisie

```sql
create table conversations (
  id bigint generated always as identity primary key,
  session_id text,
  sender text,
  message text,
  created_at timestamptz default now()
);
```

Ajouter l’enregistrement dans `sendMessage()` :

```ts
await fetch("https://YOUR_PROJECT.supabase.co/rest/v1/conversations", {
  method: "POST",
  headers: {
    apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
    Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    session_id: "client-demo",
    sender: "user",
    message: input
  })
});
```

---

## ✅ Critères de complétion

| Élément | État attendu |
|--------|:------------:|
| Page `/diagnostic` visible | ✅ |
| Chat fonctionne | ✅ |
| Lyro répond | ✅ |
| Widget Tidio invisible | ✅ |
| (optionnel) stockage Supabase | ✅ |
