import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, Image as ImageIcon, Video, Settings, 
  User, Check, ChevronDown, Send, Menu, X, Share, 
  ThumbsUp, ThumbsDown, Copy, Bot, UserCircle, Plus,
  Mic, Paperclip, MoreHorizontal, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Logo Component from LandingPage to maintain branding consistency
const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path 
      d="
        M 18 80
        L 38 20
        A 4 4 0 0 1 42 16
        L 58 16
        A 4 4 0 0 1 62 20
        L 62 44
        A 4 4 0 0 0 66 48
        L 76 48
        A 4 4 0 0 1 80 52
        L 80 76
        A 4 4 0 0 1 76 80
        L 56 80
        A 2 2 0 0 1 54 78
        L 54 62
        C 54 52, 48 48, 42 48
        L 32 78
        A 2 2 0 0 1 30 80
        Z
      " 
      stroke="currentColor"
      strokeWidth="4"
      strokeLinejoin="round"
    />
  </svg>
);

// Models configuration
const textModels = [
  { id: 'openai/gpt-oss-120b', name: 'FYOIA-V1', description: 'General purpose default' },
  { id: 'deepseek-ai/deepseek-r1-distil-qwen-32b', name: 'FYOIA-THINK', description: 'Reasoning with visible thought process' },
  { id: 'meta/llama-3.1-405b-instruct', name: 'FYOIA-ULTRA', description: 'Highest capability' },
  { id: 'qwen/qwen3-coder-480b-a35b-instruct', name: 'FYOIA-CODE', description: 'Code generation/debugging' },
  { id: 'mistralai/mistral-small-4-119b-2603', name: 'FYOIA-FAST', description: 'Speed optimized' }
];

const imageModels = [
  { id: 'gptimage', name: 'FYOIA-IMG' },
  { id: 'imagen-4', name: 'FYOIA-IMG-GEN' },
  { id: 'grok-imagine', name: 'FYOIA-BETA' },
  { id: 'klein', name: 'FYOIA-IMG-V2' },
  { id: 'klein-large', name: 'FYOIA-IMG-PRO' }
];

const videoModels = [
  { id: 'grok-video-normal', name: 'FYOIA-VID' }
];

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  reasoning?: string; // For FYOIA-THINK
  timestamp: Date;
  type?: 'text' | 'image' | 'video'; // To handle media embeds if needed
};

type Session = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: Date;
};

export default function ChatApp() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mode, setMode] = useState<'chat' | 'image-gen' | 'video-gen'>('chat');
  const [selectedModel, setSelectedModel] = useState(textModels[0].id);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  
  const [sessions, setSessions] = useState<Session[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('anmix-chat-history');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      } catch (e) {
        console.error("Failed to parse chat history", e);
      }
    } else {
      createNewSession();
    }
    
    // Auto-close sidebar on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  // Save to local storage
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem('anmix-chat-history', JSON.stringify(sessions));
    }
  }, [sessions]);

  const activeSession = sessions.find(s => s.id === activeSessionId);
  const messages = activeSession?.messages || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const createNewSession = () => {
    const newSession: Session = {
      id: Math.random().toString(36).substring(7),
      title: 'New Chat',
      messages: [],
      updatedAt: new Date()
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newSession.id);
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const currentModelsList = () => {
    if (mode === 'image-gen') return imageModels;
    if (mode === 'video-gen') return videoModels;
    return textModels;
  };

  // Adjust model gracefully if switching mode
  useEffect(() => {
    const defaultModelForMode = currentModelsList()[0].id;
    if (!currentModelsList().find(m => m.id === selectedModel)) {
      setSelectedModel(defaultModelForMode);
    }
  }, [mode]);

  const extractReasoning = (rawText: string) => {
    const thinkRegex = /<think>([\s\S]*?)<\/think>/i;
    const match = rawText.match(thinkRegex);
    if (match) {
      return {
        reasoning: match[1].trim(),
        cleanedContent: rawText.replace(thinkRegex, '').trim()
      };
    }
    return { cleanedContent: rawText, reasoning: undefined };
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: Message = {
      id: Math.random().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };
    
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // Reset height
    }

    // Add user message via functional state update to preserve sync
    let currentSessionMessages: Message[];
    setSessions(prev => {
      const updated = prev.map(s => {
        if (s.id === activeSessionId) {
          currentSessionMessages = [...s.messages, userMsg];
          return { ...s, messages: currentSessionMessages, updatedAt: new Date(), title: s.title === 'New Chat' ? userMsg.content.substring(0, 30) + '...' : s.title };
        }
        return s;
      });
      return updated;
    });

    setIsTyping(true);

    try {
      if (mode === 'chat') {
        // Now using our local express proxy to bypass CORS and properly handle the request
        const res = await fetch('/api/groq/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: selectedModel,
            messages: (currentSessionMessages || [userMsg]).map(m => ({ role: m.role, content: m.content }))
          })
        });
        
        let assistantContent = '';
        if (res.ok) {
          const data = await res.json();
          assistantContent = data.choices?.[0]?.message?.content || data.response || "No response generated.";
        } else {
          assistantContent = "Error: Failed to fetch response from Fyoia API.";
        }

        const { cleanedContent, reasoning } = extractReasoning(assistantContent);

        const aiMsg: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: cleanedContent,
          reasoning,
          timestamp: new Date()
        };

        setSessions(prev => 
          prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg], updatedAt: new Date() } : s)
        );

      } else if (mode === 'image-gen') {
        // Simple integration for Pollinations
        const encodedPrompt = encodeURIComponent(currentSessionMessages![currentSessionMessages!.length-1].content);
        const imageUrl = `https://gen.pollinations.ai/prompt/${encodedPrompt}?model=${selectedModel}&nologo=true`;
        
        const aiMsg: Message = {
          id: Math.random().toString(),
          role: 'assistant',
          content: `![Generated Image](${imageUrl})`,
          type: 'image',
          timestamp: new Date()
        };
        
        setSessions(prev => 
          prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg], updatedAt: new Date() } : s)
        );
      }
    } catch (e) {
      console.error(e);
      const aiMsg: Message = {
        id: Math.random().toString(),
        role: 'assistant',
        content: "Network error. Make sure the API proxy is accessible and handles CORS properly.",
        timestamp: new Date()
      };
      setSessions(prev => 
        prev.map(s => s.id === activeSessionId ? { ...s, messages: [...s.messages, aiMsg] } : s)
      );
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans font-normal overflow-hidden relative">
      {/* Global Background Ambient Blur Orbs - matched to LandingPage */}
      <div className="fixed inset-0 z-[0] pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[500px] h-[500px] bg-blue-500/[0.03] rounded-full blur-[100px]" />
        <div className="absolute top-[40%] right-[10%] w-[600px] h-[600px] bg-purple-500/[0.04] rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[700px] h-[700px] bg-blue-500/[0.03] rounded-full blur-[150px]" />
      </div>
      
      {/* Subtle Grid Pattern Overlay - matched to LandingPage */}
      <div className="fixed inset-0 z-[1] pointer-events-none bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGNpcmNsZSBjeD0iMSIgY3k9IjEiIHI9IjEiIGZpbGw9InJnYmEoMjU1LDI1NSwyNTUsMC4wNykiLz48L3N2Zz4=')] opacity-50" />

      {/* Sidebar Overlay (Mobile) */}
      <AnimatePresence>
        {sidebarOpen && window.innerWidth < 768 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: sidebarOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed md:relative z-50 h-full w-[280px] flex flex-col liquid-glass border-r border-white/5 bg-background/80 backdrop-blur-3xl shadow-2xl",
          "md:translate-x-0" // Reset transform on desktop if we were using classes for it, but motion handles it
        )}
        style={{ marginLeft: sidebarOpen ? 0 : window.innerWidth >= 768 ? -280 : 0 }}
      >
        <div className="p-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-[8px] pl-1">
            <Logo className="w-6 h-6 text-foreground" />
            <span className="font-serif italic font-normal text-[20px] tracking-[-0.5px]">FyoiaAi</span>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-muted-foreground hover:text-white p-2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <button 
            onClick={createNewSession}
            className="w-full flex items-center gap-2 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 space-y-1 custom-scrollbar">
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => { setActiveSessionId(session.id); if (window.innerWidth < 768) setSidebarOpen(false); }}
              className={cn(
               "w-full flex items-center justify-between px-3 py-3 rounded-lg text-sm transition-all group border",
               activeSessionId === session.id 
                 ? "bg-white/10 text-white border-white/10" 
                 : "text-muted-foreground hover:bg-white/5 hover:text-white border-transparent"
              )}
            >
              <span className="truncate pr-2">{session.title}</span>
              {activeSessionId === session.id && (
                <div className="w-2 h-2 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 border-t border-white/5 flex flex-col gap-2">
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
            <Settings className="w-4 h-4" />
            Settings
          </div>
          <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg cursor-pointer transition-colors">
            <UserCircle className="w-4 h-4" />
            Profile
          </div>
        </div>
      </motion.aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full relative z-10 min-w-0 bg-transparent">
        
        {/* Header */}
        <header className="h-[60px] md:h-[70px] flex items-center justify-between px-3 md:px-4 sticky top-0 border-b border-white/5 bg-background/80 backdrop-blur-2xl z-20">
          <div className="flex items-center gap-3">
            {!sidebarOpen && (
              <button 
                onClick={() => setSidebarOpen(true)}
                className="p-2 text-muted-foreground hover:text-white hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            
            {/* Mode Selector */}
            <div className="flex items-center p-1 bg-white/[0.03] rounded-[14px] border border-white/10 shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] overflow-x-auto hide-scrollbar max-w-[200px] sm:max-w-none">
              <button 
                onClick={() => setMode('chat')}
                className={cn("px-2.5 sm:px-4 py-1.5 sm:py-1.5 text-[12px] sm:text-sm rounded-[10px] flex items-center gap-1.5 sm:gap-2 transition-all font-medium whitespace-nowrap", mode === 'chat' ? 'bg-white/15 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]' : 'text-muted-foreground hover:text-white')}
              >
                <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">AI Chat</span><span className="sm:hidden">Chat</span>
              </button>
              <button 
                onClick={() => setMode('image-gen')}
                className={cn("px-2.5 sm:px-4 py-1.5 sm:py-1.5 text-[12px] sm:text-sm rounded-[10px] flex items-center gap-1.5 sm:gap-2 transition-all font-medium whitespace-nowrap", mode === 'image-gen' ? 'bg-white/15 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]' : 'text-muted-foreground hover:text-white')}
              >
                <ImageIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Image Gen</span><span className="sm:hidden">Image</span>
              </button>
              <button 
                onClick={() => setMode('video-gen')}
                className={cn("px-2.5 sm:px-4 py-1.5 sm:py-1.5 text-[12px] sm:text-sm rounded-[10px] flex items-center gap-1.5 sm:gap-2 transition-all font-medium whitespace-nowrap", mode === 'video-gen' ? 'bg-white/15 text-white shadow-[0_2px_10px_rgba(0,0,0,0.2)]' : 'text-muted-foreground hover:text-white')}
              >
                <Video className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> <span className="hidden sm:inline">Video Gen</span><span className="sm:hidden">Video</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Voice Toggle */}
            <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 text-xs font-semibold text-muted-foreground hover:text-white hover:bg-white/5 transition-colors">
              <Mic className="w-4 h-4" />
              Voice Mode
            </button>

            {/* Model Selector */}
            <div className="relative">
              <button 
                onClick={() => setModelDropdownOpen(!modelDropdownOpen)}
                className="flex items-center gap-1 sm:gap-2 liquid-glass border border-white/10 px-2 sm:px-3 py-1.5 rounded-full text-[12px] sm:text-[13px] font-medium hover:bg-white/10 transition-colors shadow-[0_0_10px_rgba(255,255,255,0.02)]"
              >
                <span className="max-w-[70px] sm:max-w-[150px] truncate">{currentModelsList().find(m => m.id === selectedModel)?.name || 'Select Model'}</span>
                <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              </button>

              <AnimatePresence>
                {modelDropdownOpen && (
                  <>
                    {/* Invisible overlay to close dropdown on outside click */}
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => setModelDropdownOpen(false)}
                      className="fixed inset-0 z-40 bg-transparent"
                    />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
                      className="absolute right-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-[250px] md:w-[280px] bg-background/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-2 shadow-2xl z-50 liquid-glass origin-top-right sm:origin-top"
                    >
                      {currentModelsList().map(m => (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedModel(m.id); setModelDropdownOpen(false); }}
                          className={cn(
                            "w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between transition-colors",
                            selectedModel === m.id ? "bg-white/10 text-foreground" : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                          )}
                        >
                          <div className="flex flex-col gap-0.5">
                            <span className="font-semibold text-[13px] md:text-sm">{m.name}</span>
                            {'description' in m && (
                              <span className="text-[10px] md:text-[11px] opacity-70 leading-tight">{m.description}</span>
                            )}
                          </div>
                          {selectedModel === m.id && <Check className="w-4 h-4 text-blue-400 shrink-0 ml-2" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6 md:space-y-8 custom-scrollbar scroll-smooth">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4 relative z-10">
              <div className="w-16 h-16 rounded-3xl bg-white/[0.03] border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-xl">
                <Logo className="w-8 h-8 text-foreground" />
              </div>
              <h2 className="text-3xl font-medium tracking-tight mb-2">How can I help you today?</h2>
              <p className="text-muted-foreground max-w-md">Ask anything, generate images, write code, or just chat with the most advanced AI models.</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-12 w-full max-w-[600px]">
                 {[
                   "Write a highly creative poem about the future",
                   "Can you generate an image of a cyber city?",
                   "Help me debug this solidJS React app",
                   "What are the implications of quantum computing?"
                 ].map((suggestion, i) => (
                    <button key={i} onClick={() => setInput(suggestion)} className="bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all p-3 md:p-4 rounded-xl text-left text-sm text-gray-300">
                      {suggestion}
                    </button>
                 ))}
              </div>
            </div>
          ) : (
            <div className="max-w-[800px] mx-auto w-full space-y-8 pb-10">
              {messages.map((msg) => (
                <div key={msg.id} className={cn("flex w-full", msg.role === 'user' ? 'justify-end' : 'justify-start')}>
                  <div className={cn(
                    "flex max-w-[85%] md:max-w-[75%]",
                    msg.role === 'user' ? 'bg-white text-black p-4 md:p-5 rounded-3xl rounded-tr-sm' : 'flex-col gap-2'
                  )}>
                    {msg.role === 'assistant' && (
                       <div className="flex items-center gap-3 mb-2">
                         <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                           <Logo className="w-4 h-4 text-white" />
                         </div>
                         <span className="font-semibold text-sm">FyoiaAi</span>
                       </div>
                    )}

                    {msg.reasoning && (
                      <div className="mb-4 bg-white/5 border border-white/10 rounded-2xl p-4 text-sm text-gray-400 font-mono text-[13px] border-l-4 border-l-blue-500/50 relative overflow-hidden">
                        <div className="flex items-center gap-2 mb-2 text-blue-400/80 font-sans font-semibold">
                          <Settings className="w-4 h-4 animate-spin-slow" />
                          Thinking Process
                        </div>
                        <div className="whitespace-pre-wrap">{msg.reasoning}</div>
                      </div>
                    )}

                    <div className={cn("prose prose-invert max-w-none text-[15px] leading-relaxed", msg.role === 'user' ? 'text-black' : '')}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>

                    {msg.role === 'assistant' && (
                      <div className="flex items-center gap-2 mt-2 opacity-0 hover:opacity-100 transition-opacity">
                         <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition-colors"><Copy className="w-4 h-4" /></button>
                         <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition-colors"><ThumbsUp className="w-4 h-4" /></button>
                         <button className="p-1.5 text-gray-500 hover:text-white rounded hover:bg-white/10 transition-colors"><ThumbsDown className="w-4 h-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex w-full justify-start">
                  <div className="flex flex-col gap-2 max-w-[85%] md:max-w-[75%]">
                     <div className="flex items-center gap-3 mb-1">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shrink-0">
                         <Logo className="w-4 h-4 text-white" />
                       </div>
                       <span className="font-semibold text-sm">FyoiaAi</span>
                     </div>
                     <div className="p-4 bg-transparent text-gray-400 flex items-center gap-2">
                        <span className="flex h-2 w-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="flex h-2 w-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="flex h-2 w-2 rounded-full bg-white/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                     </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-4 md:p-6 bg-gradient-to-t from-background via-background to-transparent w-full pb-6 md:pb-8">
          <div className="max-w-[800px] mx-auto w-full relative">
            <div className="liquid-glass border border-white/10 rounded-[28px] flex items-end p-2 shadow-[0_10px_40px_rgba(0,0,0,0.5)] focus-within:border-white/30 focus-within:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all">
              
              <button className="p-3 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-colors mb-1 ml-1 shrink-0">
                <Paperclip className="w-5 h-5" />
              </button>
              
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleTextareaInput}
                onKeyDown={handleKeyDown}
                placeholder={mode === 'chat' ? "Message FyoiaAi..." : mode === 'image-gen' ? "Describe the image to generate..." : "Describe the video..."}
                className="w-full max-h-[200px] bg-transparent resize-none outline-none text-[15px] md:text-[16px] p-3 text-foreground placeholder:text-muted-foreground overflow-y-auto mb-1 ml-1"
                rows={1}
                style={{ minHeight: '52px' }}
              />

              <div className="flex items-center gap-2 mb-1.5 mr-1.5 shrink-0">
                {mode === 'chat' && (
                  <button className="hidden sm:flex p-2 text-muted-foreground hover:text-white hover:bg-white/10 rounded-full transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
                
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isTyping}
                  className="w-[42px] h-[42px] rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                >
                  <Send className="w-5 h-5 ml-0.5" />
                </button>
              </div>

            </div>
            <div className="text-center mt-3">
              <span className="text-[11px] text-muted-foreground">FyoiaAi can make mistakes. Consider verifying important information.</span>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
