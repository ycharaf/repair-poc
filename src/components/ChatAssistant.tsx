import {useState, useRef, useEffect} from "react";

interface Message {
    id: string;
    type: "user" | "bot";
    content: string;
}

export default function ChatAssistant() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "intro",
            type: "bot",
            content: "Bonjour 👋 Je suis votre assistant diagnostic Répare & Vous. Quel est l'appareil en panne ?",
        }
    ]);

    const [input, setInput] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas quand un message arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: "smooth"});
    }, [messages]);

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

        try {
            // TODO: Activer l'appel Edge Function une fois déployée
            // const res = await fetch(
            //     "https://jrhwyewmeazjokgagbok.functions.supabase.co/diagnostic-agent",
            //     {
            //         method: "POST",
            //         headers: {"Content-Type": "application/json"},
            //         body: JSON.stringify({
            //             message: sentText,
            //             history: messages.map((m) => ({
            //                 role: m.type === "user" ? "user" : "assistant",
            //                 content: m.content,
            //             })),
            //         }),
            //     }
            // );
            // const {reply} = await res.json();

            // Simulation locale en attendant le déploiement Edge Function
            await new Promise(resolve => setTimeout(resolve, 800));

            let reply = "Merci ! Pouvez-vous m'en dire un peu plus sur ce qui se passe exactement ?";

            const lowerContent = sentText.toLowerCase();

            // Logique de pré-diagnostic simple
            if (lowerContent.includes("écran") || lowerContent.includes("ecran") || lowerContent.includes("affichage")) {
                reply = "D'accord, problème d'écran 📱\n\nCela peut venir de la dalle ou du connecteur.\n\nL'écran est-il fissuré ou présente-t-il des taches noires ?";
            } else if (lowerContent.includes("batterie")) {
                reply = "Ok, problème de batterie 🔋\n\nAvez-vous remarqué une chauffe anormale ou des extinctions soudaines ?\n\nDepuis combien de temps avez-vous cet appareil ?";
            } else if (lowerContent.includes("charge") || lowerContent.includes("recharge")) {
                reply = "Problème de charge détecté ⚡\n\nQuelques questions :\n- Le câble de charge fonctionne-t-il avec d'autres appareils ?\n- Le port de charge est-il propre (pas de poussière) ?";
            } else if (lowerContent.includes("son") || lowerContent.includes("audio") || lowerContent.includes("haut-parleur")) {
                reply = "Problème de son 🔊\n\nLe son ne fonctionne-t-il pas du tout ou est-il déformé ?\n\nAvez-vous essayé avec des écouteurs ?";
            } else if (lowerContent.includes("bouton") || lowerContent.includes("touche")) {
                reply = "Problème de bouton 🔘\n\nQuel bouton est concerné ? (power, volume, home...)\n\nEst-il enfoncé ou ne réagit-il simplement pas ?";
            } else if (lowerContent.includes("wifi") || lowerContent.includes("connexion") || lowerContent.includes("réseau")) {
                reply = "Problème de connexion 📶\n\nQuelques vérifications :\n- D'autres appareils se connectent-ils au même réseau ?\n- Avez-vous essayé de redémarrer l'appareil ?";
            } else if (messages.length <= 2) {
                reply = "Bienvenue ! Pour bien vous aider, j'ai besoin de quelques informations :\n\n1️⃣ Quel type d'appareil ? (téléphone, tablette, ordinateur...)\n2️⃣ Quelle marque et modèle ?\n3️⃣ Quel est le problème exact ?";
            }

            const botMessage: Message = {
                id: String(Date.now() + 1),
                type: "bot",
                content: reply,
            };

            setMessages((prev) => [...prev, botMessage]);
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