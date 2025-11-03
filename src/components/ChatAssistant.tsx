import { useState, useRef, useEffect } from "react";
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
  // Auto-scroll vers le bas quand de nouveaux messages arrivent
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSend = async () => {
    if (!input.trim()) return;
    const userMessage: Message = {
      id: String(Date.now()),
      type: "user",
      content: input,
    };
    // Ajouter le message utilisateur
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    // Simuler un délai de réponse (à remplacer par l'appel API Lyro)
    setTimeout(() => {
      // Logique pré-diagnostic simple (placeholder)
      let botReply = "Merci ! Pouvez-vous décrire la panne en quelques mots ?";
      const lowerContent = input.toLowerCase();
      if (lowerContent.includes("écran") || lowerContent.includes("affichage")) {
        botReply = "D'accord, problème d'écran 📱\n\nCela peut venir de la dalle ou du connecteur.\n\nL'écran est-il fissuré ou présente-t-il des taches noires ?";
      } else if (lowerContent.includes("batterie")) {
        botReply = "Ok, problème de batterie 🔋\n\nAvez-vous remarqué une chauffe anormale ou des extinctions soudaines ?";
      } else if (lowerContent.includes("charge") || lowerContent.includes("recharge")) {
        botReply = "Problème de charge détecté ⚡\n\nLe câble de charge fonctionne-t-il avec d'autres appareils ?\nLe port de charge est-il encombré ?";
      } else if (lowerContent.includes("son") || lowerContent.includes("audio")) {
        botReply = "Problème de son 🔊\n\nLe son ne fonctionne-t-il pas du tout ou est-il déformé ?\nAvez-vous testé avec des écouteurs ?";
      }
      const botMessage: Message = {
        id: String(Date.now() + 1),
        type: "bot",
        content: botReply,
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 800); // Délai réaliste
  };
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
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
      {/* Messages - zone scrollable */}
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
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {/* Input - fixé en bas (mobile keyboard friendly) */}
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
            className="bg-blue-600 text-white p-3 rounded-full disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform shadow-md hover:bg-blue-700 min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Envoyer le message"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
