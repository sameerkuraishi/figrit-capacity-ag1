"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Pin, Search, AlertCircle, RefreshCw, MessageSquare, Trash2, Menu, X, Users, MessageCircle } from "lucide-react";
import { toast } from "sonner";
import { demoCommunityMembers, demoChatMessages } from "@/lib/capacity-demo";
import type { UserProfile, ChatMessage } from "@/lib/capacity-types";
import { EmptyState, Pill } from "./ui";

const roleChannels = {
  trainee: [
    { id: "general-trainees", name: "General Trainees", desc: "Announcements & discussions" },
    { id: "cohort-marketing", name: "Cohort: Marketing", desc: "For marketing checkpoint" }
  ],
  trainer: [
    { id: "mentors-lounge", name: "Mentors Lounge", desc: "Sync and knowledge sharing" },
    { id: "trainer-sync", name: "Trainer Sync", desc: "Coordination for clinics" }
  ],
  admin: [
    { id: "admin-operations", name: "Admin Operations", desc: "Daily portal ops" },
    { id: "system-alerts", name: "System Alerts", desc: "Automated warnings" }
  ]
};

export function CommunityLayout({ profile }: { profile: UserProfile }) {
  const [messages, setMessages] = useState<ChatMessage[]>(demoChatMessages);
  const [newMessage, setNewMessage] = useState("");
  const channels = roleChannels[profile.role as keyof typeof roleChannels] || roleChannels.trainee;
  const [activeChannel, setActiveChannel] = useState(channels[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [showMobileMembers, setShowMobileMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, activeChannel]);

  // Handle sending a message
  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!newMessage.trim()) {
      toast.error("Message cannot be empty.");
      return;
    }
    
    // Prevent duplicate exact message within 2 seconds
    const lastMsg = messages[messages.length - 1];
    if (lastMsg && lastMsg.senderId === profile.id && lastMsg.content === newMessage.trim()) {
      const timeDiff = new Date().getTime() - new Date(lastMsg.timestamp).getTime();
      if (timeDiff < 2000) {
        toast.error("Duplicate message prevented.");
        return;
      }
    }

    const msg: ChatMessage = {
      id: Date.now(),
      channelId: activeChannel,
      senderId: profile.id,
      senderName: profile.name,
      senderRole: profile.role,
      content: newMessage.trim(),
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, msg]);
    demoChatMessages.push(msg); // Local state persistence
    setNewMessage("");
  };

  // Reset demo data
  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the local demo chat data?")) {
      const initial = demoChatMessages.filter(m => m.timestamp.includes("2026-")); // rough filter for initial data if needed, or just clear all user messages
      setMessages(initial);
      toast.success("Demo chat reset.");
    }
  };

  const channelMsgs = messages.filter(m => m.channelId === activeChannel);
  
  // Members for the current role community
  const communityMembers = demoCommunityMembers.filter(m => 
    profile.role === 'admin' ? true : m.role === profile.role || (profile.role === 'trainee' && m.role === 'trainer')
  );

  const filteredMembers = communityMembers.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.department.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (ts: string) => new Date(ts).toLocaleTimeString("en-US", { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="h-[calc(100vh-140px)] min-h-[600px] flex rounded-2xl border border-[#E0E9EA] bg-white overflow-hidden relative shadow-sm">
      
      {/* Mobile Overlays */}
      {showMobileSidebar && (
        <div className="md:hidden absolute inset-0 z-40 bg-black/20" onClick={() => setShowMobileSidebar(false)} />
      )}
      {showMobileMembers && (
        <div className="lg:hidden absolute inset-0 z-40 bg-black/20" onClick={() => setShowMobileMembers(false)} />
      )}

      {/* Left Sidebar - Channels */}
      <div className={`
        absolute md:static inset-y-0 left-0 z-50 w-72 bg-[#F9FCFC] border-r border-[#E0E9EA] flex flex-col transition-transform duration-300
        ${showMobileSidebar ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
      `}>
        <div className="p-4 border-b border-[#E0E9EA] flex items-center justify-between">
          <h2 className="font-semibold text-lg flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-[#0D766A]" />
            Spaces
          </h2>
          <button className="md:hidden p-2 text-gray-500" onClick={() => setShowMobileSidebar(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <p className="text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wider mb-2 px-2 mt-2">
            {profile.role} Community
          </p>
          {channels.map(c => (
            <button
              key={c.id}
              onClick={() => { setActiveChannel(c.id); setShowMobileSidebar(false); }}
              className={`w-full text-left p-3 rounded-xl transition-colors flex flex-col gap-1
                ${activeChannel === c.id ? "bg-[#E9F7F3] border border-[#C9E8DF]" : "hover:bg-[#F2F7F7] border border-transparent"}
              `}
            >
              <div className="flex justify-between items-center w-full">
                <span className={`font-medium ${activeChannel === c.id ? "text-[#0B2E33]" : "text-[#465E61]"}`}>
                  # {c.name}
                </span>
                {messages.filter(m => m.channelId === c.id).length > 0 && (
                  <span className="text-[10px] bg-white px-1.5 py-0.5 rounded text-gray-500 shadow-sm border border-gray-100">
                    {messages.filter(m => m.channelId === c.id).length}
                  </span>
                )}
              </div>
              <span className="text-xs text-[var(--muted-foreground)] truncate">{c.desc}</span>
            </button>
          ))}
        </div>
        <div className="p-4 border-t border-[#E0E9EA] bg-[#F2F7F7]">
          <button onClick={handleReset} className="w-full flex items-center justify-center gap-2 text-xs font-medium text-red-600 hover:text-red-700 py-2 transition-colors">
            <Trash2 className="w-4 h-4" /> Reset Demo Chat
          </button>
          <p className="text-[10px] text-center text-[var(--muted-foreground)] mt-2">
            Local demo environment.
          </p>
        </div>
      </div>

      {/* Middle - Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-white">
        {/* Chat Header */}
        <div className="h-[72px] px-4 md:px-6 border-b border-[#E0E9EA] flex items-center justify-between shrink-0 bg-white">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-2 -ml-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowMobileSidebar(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-lg"># {channels.find(c => c.id === activeChannel)?.name}</h2>
              <p className="text-xs text-[var(--muted-foreground)] hidden sm:block">
                {channels.find(c => c.id === activeChannel)?.desc}
              </p>
            </div>
          </div>
          <button className="lg:hidden p-2 text-gray-600 hover:bg-gray-50 rounded-lg" onClick={() => setShowMobileMembers(true)}>
            <Users className="w-5 h-5" />
          </button>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-[#FAFCFC]">
          {channelMsgs.length === 0 ? (
             <div className="h-full flex items-center justify-center">
               <EmptyState 
                 title="No messages yet" 
                 description="Be the first to start the conversation in this space."
               />
             </div>
          ) : (
            channelMsgs.map((msg, i) => {
              const isMe = msg.senderId === profile.id;
              const showHeader = i === 0 || channelMsgs[i-1].senderId !== msg.senderId || (new Date(msg.timestamp).getTime() - new Date(channelMsgs[i-1].timestamp).getTime() > 300000);
              
              return (
                <div key={msg.id} className={`flex gap-3 max-w-[85%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}>
                  {showHeader ? (
                    <div className="w-8 h-8 rounded-full bg-[#EAF5F4] text-[#0D766A] flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                      {msg.senderName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                    </div>
                  ) : (
                    <div className="w-8 shrink-0" />
                  )}
                  <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                    {showHeader && (
                      <div className="flex items-baseline gap-2 mb-1 px-1">
                        <span className="font-semibold text-sm">{isMe ? 'You' : msg.senderName}</span>
                        {!isMe && <span className="text-[10px] text-[var(--muted-foreground)] uppercase">{msg.senderRole}</span>}
                        <span className="text-[10px] text-gray-400">{formatTime(msg.timestamp)}</span>
                      </div>
                    )}
                    <div className={`px-4 py-2.5 rounded-2xl text-sm ${isMe ? 'bg-[#0D766A] text-white rounded-tr-sm' : 'bg-white border border-[#E0E9EA] text-[#0B2E33] rounded-tl-sm shadow-sm'}`}>
                      <p className="whitespace-pre-wrap">{msg.content}</p>
                      {msg.pinnedResource && (
                        <div className={`mt-2 p-2 rounded-lg text-xs flex items-center gap-2 ${isMe ? 'bg-white/20' : 'bg-[#F2F7F7] border border-[#E0E9EA]'}`}>
                          <Pin className="w-3 h-3 shrink-0" />
                          <span className="font-medium truncate">{msg.pinnedResource.title}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="p-4 bg-white border-t border-[#E0E9EA]">
          <form onSubmit={handleSend} className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              placeholder={`Message # ${channels.find(c => c.id === activeChannel)?.name}...`}
              className="flex-1 bg-[#F5F8F8] border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-[#0D766A]/20 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={!newMessage.trim()}
              className="bg-[#0D766A] text-white rounded-xl px-4 py-3 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#0A5F55] transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-2 text-center text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <AlertCircle className="w-3 h-3" /> Live backend messaging is simulated.
          </div>
        </div>
      </div>

      {/* Right Sidebar - Members */}
      <div className={`
        absolute lg:static inset-y-0 right-0 z-50 w-72 bg-white border-l border-[#E0E9EA] flex flex-col transition-transform duration-300
        ${showMobileMembers ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
      `}>
        <div className="p-4 border-b border-[#E0E9EA] flex items-center justify-between">
          <h3 className="font-semibold text-sm">Directory</h3>
          <button className="lg:hidden p-2 text-gray-500" onClick={() => setShowMobileMembers(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-3 border-b border-[#E0E9EA]">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search members..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-[#F5F8F8] border-none rounded-lg pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-[#0D766A]/50 focus:outline-none"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-4">
          {["trainer", "admin", "trainee"].map(role => {
            const users = filteredMembers.filter(m => m.role === role);
            if (users.length === 0) return null;
            return (
              <div key={role}>
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                  {role}s — {users.length}
                </h4>
                <div className="space-y-1">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="relative">
                        <div className="w-8 h-8 rounded-full bg-[#F2F7F7] flex items-center justify-center text-xs font-semibold text-[#315F66]">
                          {u.name.split(' ').map(n => n[0]).join('').substring(0,2)}
                        </div>
                        <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${u.status === 'online' ? 'bg-green-500' : u.status === 'away' ? 'bg-amber-400' : 'bg-gray-300'}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{u.name}</p>
                        <p className="text-[10px] text-gray-500 truncate">{u.department}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
