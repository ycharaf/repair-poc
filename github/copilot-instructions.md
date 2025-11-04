# Copilot Instructions — React Frontend (Vite + React Router + Tailwind + shadcn/ui)

## ? Project Goal

This project is a **proof of concept** demonstrating a **smooth, trustworthy device repair experience**, comparable to
buying new. The core value is **rebuilding trust** between customers and repairers.

The POC focuses on:

* Simple onboarding and device selection
* Clear repair **price & time estimation**
* Comparison of **verified repairers** (rating, distance, guarantees)
* Transparent **repair progress tracking** (timeline)

We are optimizing for **speed**, **clarity**, and **demo impact**, *not* production-level complexity.

---

## ? Tech Stack

* **React** (with Vite)
* **React Router** (for navigation)
* **TailwindCSS** (for fast UI development)
* **shadcn/ui** (for pre-built accessible components)
* **Supabase** (data sans auth)
* - **Tidio Chatbot** (support + pré-diagnostic conversationnel)


No custom backend services. No auth flows. User already "logged in" for POC.

---

### 📌 Tidio Chatbot Integration (IMPORTANT)
Le script doit être ajouté **dans `index.html`**, juste avant la balise `</body>` :

```html
<script src="//code.tidio.co/6nua85kfh7hmk82hefsmyuzzv9de0pqc.js" async></script>

## ?? Development Environment

This project runs in a **WSL 2 (Windows Subsystem for Linux)** environment.

**Project root path:**
The command run directly on terminal from project root is:

```bash
/mnt/c/workspace2/repair-poc
```

**When running commands, always use Linux syntax:**

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

**File operations:**

```bash
# Create new file
touch src/components/NewComponent.tsx

# Remove file
rm src/components/OldComponent.tsx

# Create directory
mkdir -p src/features/new-feature

# List files
ls -la src/routes/
```

**Important notes:**

- Use forward slashes `/` for paths (Linux style)
- File paths are case-sensitive
- Use `rm` instead of `del` for file deletion
- Use `mkdir -p` to create nested directories
- Commands should be run from project root: `/mnt/c/workspace2/repair-poc`

---

## ? Project Structure (Guideline for Copilot)

```
src/
  components/        # Shared UI components
  features/
    devices/         # Device selection screens & logic
    estimation/      # Price & delay estimation UI
    repairers/       # Repairer comparison & selection
    tracking/        # Repair progress timeline UI
  lib/
    supabase.ts     # Supabase client
  routes/            # Route-level pages
  app.tsx            # Router + layout
```

**Copilot should:**

* Place UI elements in `/components` when reusable
* Place feature logic/hooks in the relevant `/features/...` folder
* Keep pages simple ? data fetch + layout only

---

## ? Routing Rules

We use **React Router** with the following routes:

| Route                   | Purpose                       |
|-------------------------|-------------------------------|
| `/`                     | Home page (value proposition) |
| `/devices`              | Device selection              |
| `/estimation/:deviceId` | Price & delay estimation      |
| `/repairers/:deviceId`  | Repairer comparison           |
| `/tracking/:repairId`   | Status timeline               |

**Copilot should always create screens as functional components using React Router hooks**:

```ts
import {useParams, useNavigate} from "react-router-dom";
```

---

## ? UI Style Guidelines

* Use **Tailwind** utility classes
* Prefer **shadcn/ui** components when possible:

    * `Button`, `Card`, `Input`, `Badge`, `Dialog`, `Tabs`
* Visual tone: **clean, friendly, trustworthy**
* Use icons with lucide-react if helpful (`npm install lucide-react`)

### Example Component Style

```tsx
import {Card} from "@/components/ui/card";

export function RepairerCard({name, rating, verified, distance}: Props) {
    return (
        <Card className="p-4 flex justify-between items-center">
            <div>
                <div className="font-semibold">{name}</div>
                <div className="text-sm opacity-60">{distance}</div>
            </div>
            <div className="text-sm">
                ? {rating}
                {verified && <span className="ml-2 text-green-600 text-xs">Verified</span>}
            </div>
        </Card>
    );
}
```

---

## ?? Data Access Pattern

We use **Supabase client directly** in components or `features/*/hooks.ts`.

### Example

```ts
import {supabase} from "@/lib/supabase";

export async function getRepairers() {
    const {data} = await supabase
        .from("profils")
        .select("id, nom, rating, verified, localisation")
        .eq("role", "reparateur");
    return data;
}
```

**Copilot should not**:

* create Redux/Zustand state unless explicitly asked
* introduce heavy data abstraction layers

---

## ? Screen Development Workflow (Copilot should follow this)

For each new screen:

1. Create the route page in `/routes/...`
2. Import or create UI components in `/components`
3. Fetch data via Supabase inside `useEffect` or `useQuery` (if asked later)
4. Use Tailwind + shadcn/ui to layout the page
5. Add navigation using `useNavigate()`
6. Keep components small & declarative

---

## ? Core Screens to Implement

| Feature                  | Description                                    | Priority |
|--------------------------|------------------------------------------------|----------|
| Device selection         | List devices, select one                       | High     |
| Estimation view          | Show price range & repair time                 | High     |
| Repairer comparison      | Show verified repairers with rating & distance | High     |
| Repair tracking timeline | Visual step-by-step progress                   | High     |

**Copilot may create placeholder/mock data temporarily if a screen is being designed before data hooking.**

---

## 📚 Documentation

### Feature Documentation

* **Feature 3 - Devis et intervention**
  * `github/FEATURE3_IMPLEMENTATION.md` - Documentation détaillée de l'implémentation
  * `github/FEATURE3_SUMMARY.md` - Résumé de la feature 3

### Layout Guidelines

* **Règles de positionnement des boutons**
  * `LAYOUT_RULES.md` - Règles globales de layout et bonnes pratiques
  * `github/BUTTON_POSITIONING_FIX.md` - Correction du positionnement des boutons d'action

---

## 📐 Layout Rules (IMPORTANT)

### ❌ À NE JAMAIS FAIRE

**Ne jamais utiliser de boutons avec `position: fixed` qui se superposent au menu footer.**

```typescript
// ❌ MAUVAIS
<div className="fixed bottom-0 left-0 right-0 p-4">
  <Button>Action</Button>
</div>
```

### ✅ BONNE PRATIQUE

**Les boutons d'action doivent appartenir à la div mère de leur layout.**

```typescript
// ✅ BON
<MobileLayout title="Titre">
  <div className="flex-1 overflow-y-auto p-4 pb-4">
    {/* Contenu */}
    
    <div className="mt-6 pb-4">
      <Button>Action</Button>
    </div>
  </div>
</MobileLayout>
```

**Voir `LAYOUT_RULES.md` pour plus de détails.**

---

## ? Copilot Behavioral Guidelines

* Prefer clarity over cleverness
* Always generate accessible components (labels, alt text)
* Keep styles consistent, non-fragmented
* Use shadcn components when similar components exist
* Only abstract when duplication appears 3+ times

---

## ? Copilot can now autonomously generate screens.

When prompted to "Create a screen" or "Add UI", Copilot should now:

* Understand project purpose
* Place code in the correct folders
* Use Tailwind + shadcn
* Query data from Supabase
* Produce shippable UI layouts

End of instructions.
