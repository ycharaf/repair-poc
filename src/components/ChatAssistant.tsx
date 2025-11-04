import {useState, useRef, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

interface Message {
    id: string;
    type: "user" | "bot";
    content: string;
}

interface DiagnosticData {
    appareil?: string;
    modele?: string;
    symptome?: string;
    contexte?: string;
}

export default function ChatAssistant() {
    const navigate = useNavigate();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro",
            type: "bot",
            content: "Bonjour 👋 Je suis votre assistant diagnostic Répare & Vous.\n\nQuel est l'appareil en panne ? (smartphone, tablette, ordinateur...)",
        }
    ]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const [diagnosticData, setDiagnosticData] = useState<DiagnosticData>({});
    const [diagnosticId, setDiagnosticId] = useState<string | null>(null);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [step, setStep] = useState(0); // Étape du diagnostic
    const messagesEndRef = useRef<HTMLDivElement>(null);
    // Initialiser le diagnostic dans Supabase au montage du composant
    useEffect(() => {
        const initDiagnostic = async () => {
            // Vérifier si une session existe déjà
            let currentSessionId = localStorage.getItem('session_id');

            if (!currentSessionId) {
                currentSessionId = crypto.randomUUID();
                localStorage.setItem('session_id', currentSessionId);

                try {
                    const { data, error } = await supabase
                        .from('diagnostics')
                        .insert({
                            session_id: currentSessionId,
                            appareil: '',
                            symptome: '',
                            status: 'en_cours'
                        })
                        .select()
                        .single();

                    if (data && !error) {
                        setDiagnosticId(data.id);
                        localStorage.setItem('diagnostic_id', data.id);
                    } else {
                        console.error('Erreur création diagnostic:', error);
                    }
                } catch (error) {
                    console.error('Erreur Supabase:', error);
                }
            } else {
                const storedDiagnosticId = localStorage.getItem('diagnostic_id');
                if (storedDiagnosticId) {
                    setDiagnosticId(storedDiagnosticId);
                }
            }

            setSessionId(currentSessionId);
        };

        initDiagnostic();
    }, []);


    // Auto-scroll vers le bas quand un message arrive
    useEffect(() => {
        if (messages.length > 1) { // Ne pas scroller au premier chargement
            messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    // Fonction pour sauvegarder un message dans Supabase
    const saveMessage = async (type: 'user' | 'bot', content: string) => {
        if (!sessionId || !diagnosticId) return;

        try {
            await supabase
                .from('messages_chat')
                .insert({
                    session_id: sessionId,
                    diagnostic_id: diagnosticId,
                    type,
                    content
                });
        } catch (error) {
            console.error('Erreur sauvegarde message:', error);
        }
    };

    // Fonction pour mettre à jour le diagnostic
    const updateDiagnostic = async (updates: Partial<DiagnosticData>) => {
        if (!sessionId) return;

        try {
            await supabase
                .from('diagnostics')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString()
                })
                .eq('session_id', sessionId);
        } catch (error) {
            console.error('Erreur mise à jour diagnostic:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage: Message = {
            id: String(Date.now()),
            type: "user",
            content: input,
        };

        setMessages((prev) => [...prev, userMessage]);
        const sentText = input;
        setInput("");
        setIsTyping(true);

        // Sauvegarder le message utilisateur dans Supabase
        await saveMessage('user', sentText);

        try {
            let reply: string;
            const newDiagnosticData = {...diagnosticData};

            // ✅ Appel à l'IA Gemini via Supabase Edge Function
            try {
                const response = await fetch(
                    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/diagnostic-agent`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`
                        },
                        body: JSON.stringify({
                            message: sentText,
                            history: messages.map((m) => ({
                                role: m.type === "user" ? "user" : "assistant",
                                content: m.content,
                            })),
                        }),
                    }
                );

                if (response.ok) {
                    const data = await response.json();
                    reply = data.reply || "Je n'ai pas bien compris, pouvez-vous reformuler ?";
                } else {
                    // Fallback en cas d'erreur API
                    console.warn("Erreur API IA, fallback sur logique locale");
                    reply = await generateLocalReply(sentText, step);
                }
            } catch (error) {
                console.error("Erreur appel IA:", error);
                // Fallback sur logique locale
                reply = await generateLocalReply(sentText, step);
            }

            // Logique de progression du diagnostic et collecte des données
            if (step === 0) {
                // Collecte du type d'appareil
                newDiagnosticData.appareil = sentText;
                await updateDiagnostic({ appareil: sentText });
                setStep(1);
            } else if (step === 1) {
                // Collecte du modèle
                newDiagnosticData.modele = sentText;
                await updateDiagnostic({ modele: sentText });
                setStep(2);
            } else if (step === 2) {
                // Collecte du symptôme
                newDiagnosticData.symptome = sentText;
                await updateDiagnostic({ symptome: sentText });
                setStep(3);
            } else if (step === 3) {
                // Collecte du contexte et fin du diagnostic
                newDiagnosticData.contexte = sentText;
                await updateDiagnostic({ contexte: sentText });

                // Sauvegarder les données et rediriger
                localStorage.setItem('diagnostic_data', JSON.stringify(newDiagnosticData));

                // Message de transition
                reply = "Merci pour ces informations ! 🙏\n\nJe prépare votre estimation...";

                setTimeout(() => {
                    navigate('/estimation');
                }, 2000);
            }

            setDiagnosticData(newDiagnosticData);

            const botMessage: Message = {
                id: String(Date.now() + 1),
                type: "bot",
                content: reply,
            };

            setMessages((prev) => [...prev, botMessage]);

            // Sauvegarder le message bot dans Supabase
            await saveMessage('bot', reply);
        } catch (error) {
            console.error("Erreur diagnostic:", error);
            const errorMessage: Message = {
                id: String(Date.now() + 1),
                type: "bot",
                content: "Désolé, je rencontre un problème technique. Pouvez-vous reformuler votre question ?",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    // Fonction de fallback pour réponses locales si l'IA est indisponible
    async function generateLocalReply(text: string, currentStep: number): Promise<string> {
        await new Promise(resolve => setTimeout(resolve, 800));

        const lowerContent = text.toLowerCase();

        if (currentStep === 0) {
            return `Très bien, ${text}.\n\nQuelle est la marque et le modèle ? (ex: iPhone 12, Samsung Galaxy S21...)`;
        } else if (currentStep === 1) {
            return `Parfait, ${text}.\n\nQuel est le problème exact que vous rencontrez ?`;
        } else if (currentStep === 2) {
            // Questions de diagnostic selon le symptôme
            if (lowerContent.includes("écran") || lowerContent.includes("ecran") || lowerContent.includes("affichage")) {
                return "Je comprends, problème d'écran 📱\n\nDernière question : L'écran est-il fissuré ? Y a-t-il eu une chute récente ?";
            } else if (lowerContent.includes("batterie")) {
                return "D'accord, problème de batterie 🔋\n\nDernière question : Avez-vous remarqué une chauffe anormale ou des extinctions soudaines ? Depuis combien de temps ?";
            } else if (lowerContent.includes("charge")) {
                return "Problème de charge détecté ⚡\n\nDernière question : Le câble fonctionne-t-il avec d'autres appareils ? Le port est-il propre ?";
            } else {
                return "Je vois.\n\nDernière question : Y a-t-il eu un événement particulier avant la panne ? (chute, eau, surchauffe...)";
            }
        } else {
            return "Merci pour votre réponse. Continuons...";
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-screen bg-white">

            {/* Header mobile */}
            <div className="sticky top-0 bg-white border-b px-4 py-4 shadow-sm z-10">
                <h1 className="text-xl font-bold text-gray-900">Diagnostic guidé</h1>
                <p className="text-sm text-gray-600 mt-1">Assistant Répare & Vous</p>
            </div>

            {/* Zone scroll messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={message.type === "user" ? "flex justify-end" : "flex justify-start"}
                    >
                        <div
                            className={`inline-block px-4 py-3 rounded-2xl max-w-[80%] shadow-sm ${
                                message.type === "user"
                                    ? "bg-blue-600 text-white"
                                    : "bg-white text-gray-900 border border-gray-200"
                            }`}
                        >
                            <p className="text-base leading-relaxed whitespace-pre-line">
                                {message.content}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Indicateur de frappe */}
                {isTyping && (
                    <div className="flex justify-start">
                        <div className="inline-block px-4 py-3 rounded-2xl bg-white border border-gray-200 shadow-sm">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef}/>
            </div>

            {/* Input */}
            <div className="sticky bottom-0 bg-white border-t px-4 py-3 shadow-lg">
                <div className="flex gap-2 items-end">
                    <input
                        className="flex-1 border border-gray-300 rounded-full px-4 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Décrivez votre problème..."
                        autoComplete="off"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isTyping}
                        className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-md hover:bg-blue-700"
                        aria-label="Envoyer le message"
                    >
                        ➤
                    </button>
                </div>
            </div>
        </div>
    );
}