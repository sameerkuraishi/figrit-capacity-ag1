"use client";

import { useEffect, useRef, useState } from "react";
import { MessageSquare, Plus, Trash2, X, Send, BrainCircuit, ChevronRight, FileText, GraduationCap, Award, Search, UserRoundCheck } from "lucide-react";
import { demoChatConversations } from "@/lib/capacity-demo";
import type { ChatConversation, SadieMessage, SourceMetadata } from "@/lib/capacity-types";
import { Pill } from "./ui";
import { toast } from "sonner";

export default function SadieChat({ token, onClose, contextPage = "overview" }: { token?: string; onClose: () => void; contextPage?: string }) {
  const [conversations, setConversations] = useState<ChatConversation[]>(demoChatConversations);
  const [activeConvId, setActiveConvId] = useState<string | null>(conversations[0]?.id || null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  
  const activeConv = conversations.find(c => c.id === activeConvId);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConv?.messages, loading]);

  const startNewChat = () => {
    const newConv: ChatConversation = {
      id: `conv-${Date.now()}`,
      title: "New Conversation",
      userId: 1,
      updatedAt: new Date().toISOString(),
      messages: []
    };
    setConversations([newConv, ...conversations]);
    setActiveConvId(newConv.id);
  };

  const deleteChat = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = conversations.filter(c => c.id !== id);
    setConversations(updated);
    if (activeConvId === id) {
      setActiveConvId(updated.length > 0 ? updated[0].id : null);
    }
  };

  const getContextSuggestions = () => {
    switch (contextPage) {
      case "learning":
        return ["Suggest a next learning step", "Explain a course concept"];
      case "opportunities":
        return ["Show preparation for a role", "Recommend a relevant expert"];
      case "assessment":
        return ["Explain a skill gap"];
      default:
        return ["Explain a skill gap", "Suggest a next learning step", "Show preparation for a role"];
    }
  };

  const handleSend = async (text: string = input) => {
    if (!text.trim() || !activeConvId) return;
    
    const userMsg: SadieMessage = {
      id: `msg-${Date.now()}`,
      role: "user",
      content: text,
      createdAt: new Date().toISOString()
    };

    const currentConv = conversations.find(c => c.id === activeConvId);
    if (!currentConv) return;
    
    const updatedConv = {
      ...currentConv,
      title: currentConv.messages.length === 0 ? text.slice(0, 30) + "..." : currentConv.title,
      messages: [...currentConv.messages, userMsg],
      updatedAt: new Date().toISOString()
    };

    setConversations(conversations.map(c => c.id === activeConvId ? updatedConv : c));
    setInput("");
    setLoading(true);

    // Mock API delay
    setTimeout(() => {
      let responseContent = "I'm Sadie, the Ask Capacity assistant. I'm currently in demo mode. Please try asking about a skill gap, learning step, course concept, role preparation, or an expert recommendation.";
      let sources: SourceMetadata[] | undefined;

      const lowerText = text.toLowerCase();
      
      if (lowerText.includes("skill gap")) {
        responseContent = "I'd be happy to explain! While you demonstrated strong foundational knowledge of statistical significance in the diagnostic, the 'Growth Hacking Intern' role requires practical evidence of designing multi-variate experiments and interpreting complex results in real-world scenarios. Your current evidence profile lacks applied project artifacts for these specific tasks.";
      } else if (lowerText.includes("learning step")) {
        responseContent = "I suggest starting with the 'Advanced Experimentation Workshop'. It focuses entirely on applied A/B and multivariate testing. Completing the project at the end of this course will provide the necessary evidence to close your gap.";
        sources = [{ title: "Advanced Experimentation Workshop", type: "course" }];
      } else if (lowerText.includes("course concept") || lowerText.includes("concept")) {
        responseContent = "An attribution window is the period of time after a user interacts with an ad (like a click or view) during which a subsequent conversion can be credited to that ad. For example, a 7-day click attribution window means that if a user buys something within 7 days of clicking your ad, the ad gets the credit.";
        sources = [{ title: "Campaign Measurement Foundations", type: "course" }];
      } else if (lowerText.includes("preparation") || lowerText.includes("prepare") || lowerText.includes("role")) {
        responseContent = "To prepare for the Senior Performance Marketer role, you need to focus on Attribution Modeling. Your current Marketing Analytics skills are excellent, but you need to demonstrate how you assign credit across multiple touchpoints. I recommend reviewing the 'Multi-Touch Attribution Guidelines' and booking a session with an expert to discuss practical application.";
        sources = [
          { title: "Multi-Touch Attribution Guidelines", type: "document" },
          { title: "Senior Performance Marketer", type: "role" }
        ];
      } else if (lowerText.includes("expert")) {
        responseContent = "Based on your need for Attribution Modeling, I highly recommend speaking with David Chen. He is a Senior Performance Marketer with 8 years of experience and is rated 4.9/5 by other trainees.";
        sources = [{ title: "David Chen", type: "expert" }];
      }

      const botMsg: SadieMessage = {
        id: `msg-${Date.now()}`,
        role: "assistant",
        content: responseContent,
        sources,
        createdAt: new Date().toISOString()
      };

      setConversations(prev => prev.map(c => 
        c.id === activeConvId ? { ...c, messages: [...c.messages, botMsg] } : c
      ));
      setLoading(false);
    }, 1500);
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case "course": return <GraduationCap className="w-4 h-4" />;
      case "expert": return <UserRoundCheck className="w-4 h-4" />;
      case "role": return <Award className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[600px] bg-white shadow-[-10px_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col sm:flex-row overflow-hidden border-l border-[#E0E9EA] text-[#0B2E33]">
      {/* Sidebar */}
      <div className="w-full sm:w-[220px] bg-[#F7FAFA] border-r border-[#E0E9EA] flex flex-col h-1/3 sm:h-full">
        <div className="p-4 border-b border-[#E0E9EA] flex items-center justify-between sm:block">
          <button onClick={startNewChat} className="w-full btn-primary flex justify-center sm:justify-start gap-2 py-2 px-3">
            <Plus className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">New Chat</span>
          </button>
          <button onClick={onClose} className="sm:hidden w-8 h-8 rounded-lg hover:bg-[#E0E9EA] flex items-center justify-center">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => setActiveConvId(conv.id)}
              className={`w-full text-left p-3 rounded-xl flex items-center justify-between group transition ${activeConvId === conv.id ? "bg-[#E9F7F3] text-[#0B2E33]" : "hover:bg-white text-[#425B5E]"}`}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <MessageSquare className="w-4 h-4 shrink-0 opacity-70" />
                <span className="text-sm font-medium truncate hidden sm:block">{conv.title}</span>
                <span className="text-sm font-medium truncate sm:hidden block">{conv.title}</span>
              </div>
              <Trash2 
                className="w-3.5 h-3.5 text-[#C85747] opacity-0 group-hover:opacity-100 transition" 
                onClick={(e) => deleteChat(conv.id, e)} 
              />
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white w-full h-2/3 sm:h-full">
        <div className="hidden sm:flex px-5 py-4 border-b border-[#E0E9EA] items-center justify-between bg-[#FBFDFD]">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-xl bg-[#0B2E33] flex items-center justify-center text-white shrink-0">
              <BrainCircuit className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-semibold text-sm">Sadie</h3>
              <p className="text-[10px] text-[#159B8C] uppercase font-bold tracking-wider">Ask Capacity</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-[#F0F4F4] flex items-center justify-center text-[#587174]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {!activeConv || activeConv.messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-[var(--muted-foreground)]">
              <BrainCircuit className="w-12 h-12 mb-4 opacity-20" />
              <p className="text-sm font-medium">How can I help you today?</p>
              <div className="mt-6 space-y-2 w-full max-w-xs">
                {getContextSuggestions().map((suggestion, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleSend(suggestion)}
                    className="w-full text-left p-3 text-xs border border-[#E0E9EA] rounded-xl hover:bg-[#F0F4F4] transition flex items-center justify-between"
                  >
                    <span>{suggestion}</span>
                    <ChevronRight className="w-3 h-3 opacity-50" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {activeConv.messages.map(msg => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-sm ${msg.role === "user" ? "bg-[#159B8C] text-white rounded-tr-sm" : "bg-[#F7FAFA] border border-[#E0E9EA] text-[#0B2E33] rounded-tl-sm"}`}>
                    <p className="leading-relaxed">{msg.content}</p>
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-4 pt-3 border-t border-[#E0E9EA]">
                        <p className="text-[10px] uppercase font-bold tracking-wider mb-2 opacity-70">Sources</p>
                        <div className="flex flex-col gap-2">
                          {msg.sources.map((src, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white border border-[#E0E9EA] p-2 rounded-lg text-xs">
                              <span className="text-[#4F7C82] shrink-0">{getSourceIcon(src.type)}</span>
                              <span className="font-medium truncate">{src.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-[#F7FAFA] border border-[#E0E9EA] rounded-2xl rounded-tl-sm p-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#159B8C] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#159B8C] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-2 h-2 rounded-full bg-[#159B8C] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="p-4 border-t border-[#E0E9EA] bg-white">
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSend(); }}
            className="flex items-end gap-2 bg-[#F7FAFA] border border-[#E0E9EA] p-2 rounded-2xl focus-within:border-[#159B8C] focus-within:ring-1 focus-within:ring-[#159B8C]/20 transition"
          >
            <textarea
              className="flex-1 bg-transparent border-0 resize-none max-h-32 min-h-10 text-sm p-2 focus:outline-none focus:ring-0"
              placeholder="Ask Sadie..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || loading}
              className="w-10 h-10 shrink-0 rounded-xl bg-[#159B8C] text-white flex items-center justify-center disabled:opacity-50 transition mb-0.5"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-[var(--muted-foreground)]">
            AI generated answers can be inaccurate. Verified sources are cited.
          </div>
        </div>
      </div>
    </div>
  );
}
