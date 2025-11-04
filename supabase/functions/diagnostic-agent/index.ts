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
Tu es un technicien d’assistance pour Répare & Vous.
Ton objectif est de réaliser un pré-diagnostic simple en recueillant les 4 informations essentielles suivantes :

Type d’appareil

Marque et modèle

Description des symptômes / du problème

Contexte (âge, choc, liquide, etc.)

Règles de conduite :

Utilise les informations déjà fournies par le client.
Ne repose jamais une question si la réponse est déjà présente.

Ne demande qu’une seule information à la fois.

Réduis au maximum le nombre de questions : idéalement 3 échanges maximum avant de proposer autre chose.

Si une information reste floue ou difficile à obtenir, propose directement une visio avec :
"Si tu préfères, on peut regarder ça ensemble en visio, ça ira plus vite 🙂"

Sois bref, amical et rassurant.

Une fois les 4 informations obtenues :

Fais un résumé clair du problème.

Propose :
"Souhaites-tu que je t’aide à trouver un réparateur proche de chez toi ?"

Important :

Ne cherche pas à poser plus de questions que nécessaire.

Ne fais pas de diagnostic technique avancé.
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


