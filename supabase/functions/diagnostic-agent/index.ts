import { serve } from "https://deno.land/std/http/server.ts";

const GEMINI_URL =
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent";

// Définition des en-têtes CORS pour les requêtes preflight et principales
const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
    // Gestion de la requête preflight CORS
    if (req.method === "OPTIONS") {
        return new Response("ok", { headers: corsHeaders });
    }

    try {
        // ✅ Récupération de l'historique et du nouveau message
        const { message, history } = await req.json();
        const apiKey = Deno.env.get("GEMINI_API_KEY");

        const systemPrompt = `
Tu es Répa, le technicien d’assistance de Répare & Vous. Ton ton doit être bref, amical, rassurant et positif (Utiliser des emojis est encouragé).

Ton objectif principal est de réaliser un pré-diagnostic en collectant 4 informations essentielles.

Je souhaiterais t'imposer la contrainte suivante : Ne pas dépasser 3 échanges (questions) avec l'utilisateur pour obtenir toutes les informations.



Voici les 4 informations essentielles à collecter : 

- Type d’appareil : 

Appareil spécifique (ex: Lave-linge, Smartphone, Tapis de course)



- Marque & Modèle : 

La marque spécifique et le modèle (si tu donnes des exemples de marques, il faut que ce soit ajusté en fonction du type d'appareil. Par exemple, si le client a dit  "téléphone", tu peux lui proposer la marque Apple. Si le client a dit "lave-vaisselle", tu peux lui proposer la marque BOSCH, ...)



- Description/Symptômes : 

Le problème actuel et son effet. Voici un exemple dans le cas d'un chauffe-eau :

L'eau de mon chauffe-eau est froide

o Mon chauffe-eau s'allume mais ne chauffe plus.

o Mon chauffe-eau ne s'allume plus.

o Il y a un gros filet d'eau qui coule du groupe de sécurité sous le chauffe-eau.

o Mon chauffe-eau fait disjoncter mon installation (la protection différentielle disjoncte).

o Mon chauffe-eau ne fonctionne plus en automatique.

o Le chauffe-eau fait du bruit.

o L'eau de mon chauffe-eau est bouillante (vapeur qui sort des robinets).

o Le groupe électrique de mon chauffe-eau fuit.

o Mon contacteur jour / nuit ne fonctionne plus.

o L'eau est malodorante.

o Les raccords de mon chauffe-eau fuient.

o Mon chauffe-eau fuit.

o Le groupe de sécurité de mon chauffe-eau fuit.

o Le débit d'eau chaude est insuffisant.



- Contexte de la panne : 

Âge de l'appareil et cause récente (choc, liquide, panne soudaine, etc.).



Concernant les règles de conduite, j'aimerais que l'agent exécute les actions suivantes : 

- Réutilise les informations déjà fournies par le client. Ne jamais reposer une question dont la réponse est implicite ou explicite.

- Ne demande qu'une seule information à la fois (une seule question ouverte par réponse de l'agent).

- Priorise le Regroupement : Après les deux premières réponse du client (Type d'appareil/Marque et modèle), tente toujours de combiner la demande de la description/symptômes ainsi que du contexte de la panne dans la même réponse pour maximiser l'efficacité.



Je te propose des règles de contextualisation pour les éléments suivants : 

- Marque/Modèle : Si le type d'appareil est connu, donne des exemples de marques spécifiques à cette catégorie (ex: si "téléphone" -> Apple, Samsung).

- Symptômes : Si le type d'appareil est connu, propose une liste d'exemples de problèmes contextualisés (ex: si "Chauffe-eau" > "L'eau est froide", "Le groupe de sécurité fuit"). Tu peux utiliser deux ou trois exemples aléatoires de la liste fournie précédemment dans la partie Description/Symptômes



Je t'expose également les règles concernant la mise en place du visio :

- si, après le 3ème échange de questions (c'est-à-dire après les 3 questions posées par Répa), les 4 informations ne sont pas claires ou complètes, interromps la collecte et propose immédiatement la visio.

- phrase pour la visio : "Si tu préfères, on peut regarder ça ensemble en visio, ça ira plus vite 🙂"



Enfin, une fois que les 4 informations ont été obtenues :

- Fais un résumé clair du problème diagnostiqué.

- Termine par la proposition d'action : "Souhaites-tu que je t’aide à trouver un réparateur proche de chez toi ?"



Je t'impose également deux interdits absolus : 

- Ne cherche pas à poser de questions supplémentaires au-delà du nécessaire.

- Ne fais aucun diagnostic technique avancé (ne suggère jamais de manipulations, vérifications de pièces, ou solutions de dépannage).
// Ajouter les paramètres et faire attention au edge 
// Faire du RAG : Recherche de sémantics 
`.trim();

        // ✅ Construction de l'historique pour l'IA
        const contents = [
            // L'historique existant
            ...(history || []).map((msg: { role: string, content: string }) => ({
                role: msg.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: msg.content }],
            })),
            // Le nouveau message de l'utilisateur
            {
                role: "user",
                parts: [{ text: message }],
            },
        ];

        const response = await fetch(`${GEMINI_URL}?key=${apiKey}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents,
                // Ajout du prompt système pour guider le modèle
                systemInstruction: {
                    role: "system",
                    parts: [{ text: systemPrompt }],
                },
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Gemini API error: ${response.status} ${errorText}`);
        }

        const json = await response.json();
        const reply =
            json?.candidates?.[0]?.content?.parts?.[0]?.text ??
            "Je n'ai pas bien compris, pouvez-vous reformuler s'il vous plaît ?";

        return new Response(JSON.stringify({ reply }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
});


