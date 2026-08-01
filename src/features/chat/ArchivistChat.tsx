import React, { useState, useRef, useEffect } from "react";
import { MessageSquareCode, X, Send, BookOpen, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { archivesAdapter, ChatMessage } from "../../shared/services/archivesService";

export default function ArchivistChat() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      parts: [{ text: "Pax vobiscum, seeker. I am the Sacred Archivist. Ask me anything about hagiography, historical liturgies, scriptural references, or the biographies of modern witnesses of faith." }]
    }
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory, isChatOpen]);

  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim() || isChatLoading) return;

    const userMsgText = chatMessage.trim();
    setChatMessage("");
    setChatError(null);

    const updatedHistory: ChatMessage[] = [
      ...chatHistory,
      { role: "user", parts: [{ text: userMsgText }] }
    ];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const mappedHistory = chatHistory.map((m) => ({
        role: m.role,
        parts: m.parts
      }));

      const data = await archivesAdapter.archivistChat(userMsgText, mappedHistory);

      setChatHistory([
        ...updatedHistory,
        { role: "model", parts: [{ text: data.response }] }
      ]);
    } catch (err: any) {
      console.error(err);
      setChatError(err.message || "The Archivist was interrupted by silence.");
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-3 sm:right-6 z-40 flex flex-col items-end">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            className="w-[calc(100vw-1.5rem)] max-w-[380px] sm:w-[340px] md:w-[380px] h-[480px] rounded-xl overflow-hidden glass-panel border border-gold-accent/25 shadow-2xl flex flex-col mb-4 bg-gradient-to-b from-canvas to-black"
          >
            {/* Chat Header */}
            <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-gold-accent" />
                <span className="font-serif font-semibold text-sm text-gold-accent tracking-wide">
                  The Sacred Archivist
                </span>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs animate-[fadeIn_0.3s_ease]">
              {chatHistory.map((msg, index) => {
                const isModel = msg.role === "model";
                return (
                  <div
                    key={index}
                    className={`flex ${isModel ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3.5 py-2.5 leading-relaxed text-justify ${
                        isModel
                          ? "bg-white/[0.03] border border-white/5 text-white/85 rounded-tl-none"
                          : "bg-gold-accent/10 border border-gold-accent/20 text-gold-accent rounded-tr-none"
                      }`}
                    >
                      {isModel && (
                        <span className="font-serif text-[9px] uppercase tracking-wider text-gold-accent/70 block mb-1">
                          Archivist scribe
                        </span>
                      )}
                      <p className="whitespace-pre-line">{msg.parts[0].text}</p>
                    </div>
                  </div>
                );
              })}

              {isChatLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/[0.03] border border-white/5 rounded-lg rounded-tl-none px-3.5 py-3 text-white/50 flex items-center gap-2 font-mono text-[10px]">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-gold-accent" />
                    <span>Consulting celestial registers...</span>
                  </div>
                </div>
              )}

              {chatError && (
                <div className="p-3 rounded bg-burgundy-dark/10 border border-burgundy-accent/20 text-center text-white/70 font-mono text-[10px]">
                  {chatError}
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendChatMessage} className="p-3 border-t border-white/5 bg-black/40 flex gap-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask any question about holy witnesses..."
                className="flex-1 bg-white/5 border border-white/10 rounded px-3 py-2 text-white placeholder-white/30 text-xs focus:outline-none focus:border-gold-accent/40 transition-colors"
              />
              <button
                type="submit"
                disabled={!chatMessage.trim() || isChatLoading}
                className="p-2 rounded bg-gold-accent text-canvas hover:bg-white hover:text-canvas transition-all disabled:opacity-30 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4.5 h-4.5" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`px-4 py-3 rounded-full shadow-2xl flex items-center gap-2 cursor-pointer z-50 ${
          isChatOpen ? "bg-white text-canvas" : "bg-gold-accent text-canvas hover:bg-white transition-all"
        }`}
      >
        {isChatOpen ? (
          <X className="w-5 h-5 shrink-0" />
        ) : (
          <>
            <MessageSquareCode className="w-5 h-5 shrink-0" />
            <span className="font-mono text-[10px] tracking-widest font-semibold uppercase">
              ASK ARCHIVIST
            </span>
          </>
        )}
      </motion.button>
    </div>
  );
}