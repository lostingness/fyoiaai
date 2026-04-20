import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, MotionValue, AnimatePresence, useInView, animate } from 'motion/react';
import { Instagram, Linkedin, Twitter, ChevronLeft, ChevronRight, Quote, MessageCircle, Check, ShieldAlert, Terminal, CheckCircle2, AlertTriangle, Zap, Server, Menu, X, Github, Send, ArrowRight, Star, Plus, Minus, Info, Target, Flame, Gem, Network, Cpu, Globe, Mic, Camera } from 'lucide-react';
import Hls from 'hls.js';

import { cn } from './lib/utils';
import Spiral from './Spiral.jsx';

// ==========================================
// Reusable Animations
// ==========================================

const fadeUpCache = new Map<number, any>();

const fadeUp = (delay: number) => {
  if (!fadeUpCache.has(delay)) {
    fadeUpCache.set(delay, {
      initial: { opacity: 0, y: 30 },
      whileInView: { opacity: 1, y: 0 },
      viewport: { once: true, margin: "-50px" },
      transition: { duration: 0.8, delay, type: "spring", bounce: 0.4 },
    });
  }
  return fadeUpCache.get(delay);
};

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

// ==========================================
// Components
// ==========================================

const HlsVideo = ({ src, className, autoPlay, ...props }: React.VideoHTMLAttributes<HTMLVideoElement> & { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hlsInstance: Hls | null = null;
    let observer: IntersectionObserver | null = null;
    let isLoaded = false;

    const initHls = () => {
      if (isLoaded) return;
      isLoaded = true;

      if (Hls.isSupported()) {
        hlsInstance = new Hls({
          capLevelToPlayerSize: true, // Optimizes bandwidth perfectly dynamically
        });
        hlsInstance.loadSource(src);
        hlsInstance.attachMedia(video);
        hlsInstance.on(Hls.Events.MANIFEST_PARSED, () => {
          if (autoPlay) video.play().catch(() => {});
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = src;
        if (autoPlay) {
            video.addEventListener('loadedmetadata', () => {
                video.play().catch(() => {});
            });
        }
      }
    };

    const playVideo = () => {
      if (video.paused && autoPlay) {
        video.play().catch(() => {});
      }
    };

    const pauseVideo = () => {
      if (!video.paused) {
        video.pause();
      }
    };

    observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!isLoaded) {
            initHls();
          } else {
            playVideo();
          }
        } else {
          pauseVideo();
        }
      });
    }, { rootMargin: "200px" });

    observer.observe(video);

    return () => {
      if (observer) {
        observer.disconnect();
      }
      if (hlsInstance) {
        hlsInstance.destroy();
      }
    };
  }, [src, autoPlay]);

  return <video ref={videoRef} className={className} playsInline muted {...props} />;
};

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, targetId: string) => {
    e.preventDefault();
    const elem = document.getElementById(targetId);
    if (elem) {
      const navbarHeight = 85; 
      const targetPosition = elem.getBoundingClientRect().top + window.scrollY - navbarHeight;
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  };
  
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    
    // Set initial state
    handleScroll();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 pt-4 md:pt-6 pointer-events-none transition-all">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={cn(
            "pointer-events-auto flex items-center justify-between transition-all duration-500",
            scrolled || mobileMenuOpen 
              ? "bg-background/70 backdrop-blur-[20px] border border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.02)] rounded-[24px] px-4 md:px-6 py-3 w-full max-w-[800px]" 
              : "bg-transparent border border-transparent rounded-[32px] px-2 md:px-12 py-2 w-full max-w-7xl"
          )}
        >
          <div className="flex items-center gap-[10px] md:gap-[12px]">
            <Logo className="w-6 h-6 md:w-8 md:h-8 text-foreground" />
            <span className="font-serif italic font-normal text-[22px] md:text-[24px] tracking-[-0.5px]">FyoiaAi</span>
          </div>
          
          <div className="flex md:hidden items-center gap-4">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground p-2 rounded-full active:scale-95 transition-transform bg-white/5 border border-white/10"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-[20px] lg:gap-[32px]">
            <div className="flex items-center gap-[20px] text-[14px] text-muted-foreground font-medium bg-white/[0.03] border border-white/5 px-6 py-2 rounded-full">
              <motion.a whileHover={{ scale: 1.05, color: "var(--foreground)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#features" onClick={(e) => scrollToSection(e, 'features')} className="transition-colors cursor-pointer">Features</motion.a>
              <span className="text-[12px] opacity-30">•</span>
              <motion.a whileHover={{ scale: 1.05, color: "var(--foreground)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#pricing" onClick={(e) => scrollToSection(e, 'pricing')} className="transition-colors cursor-pointer">Pricing</motion.a>
              <span className="text-[12px] opacity-30">•</span>
              <motion.a whileHover={{ scale: 1.05, color: "var(--foreground)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="#about" onClick={(e) => scrollToSection(e, 'about')} className="transition-colors cursor-pointer">About</motion.a>
              <span className="text-[12px] opacity-30">•</span>
              <motion.a whileHover={{ scale: 1.05, color: "var(--foreground)" }} whileTap={{ scale: 0.95 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} href="https://t.me/smoken" target="_blank" rel="noreferrer" className="transition-colors">Contact</motion.a>
            </div>
            
            <motion.a 
              href="#pricing"
              onClick={(e) => scrollToSection(e, 'pricing')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className="liquid-glass px-5 h-[40px] rounded-full flex items-center justify-center gap-2 text-sm font-semibold relative overflow-hidden group border border-white/10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Terminal className="w-4 h-4 relative z-10" />
              <span className="relative z-10">Get Started</span>
            </motion.a>
          </div>
        </motion.nav>
      </div>

      {scrolled && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-[70px] md:top-[85px] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] z-40 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"
        />
      )}

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-0 top-[70px] z-40 md:hidden bg-background/95 backdrop-blur-3xl border-b border-white/10 p-6 flex flex-col gap-6"
          >
            <div className="flex flex-col gap-6 text-[16px] text-muted-foreground font-medium">
              <a href="#features" onClick={(e) => { setMobileMenuOpen(false); scrollToSection(e, 'features'); }} className="hover:text-foreground transition-colors cursor-pointer">Features</a>
              <a href="#pricing" onClick={(e) => { setMobileMenuOpen(false); scrollToSection(e, 'pricing'); }} className="hover:text-foreground transition-colors cursor-pointer">Pricing</a>
              <a href="#about" onClick={(e) => { setMobileMenuOpen(false); scrollToSection(e, 'about'); }} className="hover:text-foreground transition-colors cursor-pointer">About</a>
              <a href="https://t.me/smoken" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            
            <a 
              href="#pricing"
              onClick={(e) => { setMobileMenuOpen(false); scrollToSection(e, 'pricing'); }}
              className="liquid-glass w-full py-3 mt-2 rounded-[12px] flex items-center justify-center gap-2 text-foreground font-semibold relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Terminal className="w-5 h-5 relative z-10" />
              <span className="relative z-10">Get Started</span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const HeroSection = () => {
  return (
    <section className="relative min-h-[600px] min-h-[100dvh] w-full flex flex-col items-center justify-center text-center overflow-hidden pt-[80px] md:pt-[100px]">
      <HlsVideo
        src="https://stream.mux.com/BuGGTsiXq1T00WUb8qfURrHkTCbhrkfFLSv4uAOZzdhw.m3u8"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover object-center z-0 pointer-events-none"
      />
      <div className="absolute inset-0 bg-black/50 z-[1] pointer-events-none" />
      <div className="absolute bottom-0 w-full h-60 bg-gradient-to-t from-[#020202] via-background/80 to-transparent z-[2] pointer-events-none" />
      
      <div className="relative z-10 px-4 md:px-8 mt-12 flex flex-col items-center max-w-[900px] w-full">
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-[12px] mb-[24px]">
          <div className="inline-flex items-center gap-2 liquid-glass rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
            <span className="text-muted-foreground text-[14px] font-medium ml-1">
              FyoiaAi IS NOW FREE!
            </span>
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.2)} className="text-[clamp(44px,8vw,80px)] leading-[0.95] tracking-[-2px] md:tracking-[-3px] font-medium mb-[24px]">
          Build, Create & Automate with <br className="hidden md:block"/> <span className="font-serif italic font-normal bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">FyoiaAi</span>
        </motion.h1>

        <motion.p {...fadeUp(0.3)} className="text-[16px] md:text-[20px] leading-[1.6] md:leading-[1.5] text-hero-subtitle max-w-[680px] mb-[40px] font-medium px-2">
          Powered by GPT-4o, Claude 3.5 Sonnet, Gemini 2.0, Llama 3.3, Flux Pro, DALL·E 3, Grok, and specialized voice/video engines.
        </motion.p>

        <motion.div {...fadeUp(0.4)} className="flex flex-col sm:flex-row items-center gap-4 mt-8 w-full justify-center max-w-[500px]">
          <motion.a
            href="#features"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="w-full sm:w-auto flex items-center justify-center gap-2 liquid-glass border border-white/10 px-10 py-4 md:py-5 rounded-full font-semibold text-[15px] text-foreground hover:bg-white/5 backdrop-blur-xl transition-all overflow-hidden relative group shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] z-10"
          >
            <motion.div 
              className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full pointer-events-none"
              whileHover={{ translateX: ["-100%", "100%"] }}
              transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            <span className="relative z-10">Get Started</span>
            <ArrowRight className="w-5 h-5 relative z-10" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const LogoMarquee = () => {
  const techStack = [
    { name: "Slack", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/slack.svg" },
    { name: "Notion", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg" },
    { name: "Linear", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linear.svg" },
    { name: "Figma", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg" },
    { name: "Webflow", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/webflow.svg" },
    { name: "Monday", icon: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/mondaydotcom.svg" },
  ];
  const doubledLogos = [...techStack, ...techStack, ...techStack];

  return (
    <section className="w-full py-12 md:py-20 border-white/5 overflow-hidden relative flex flex-col items-center">
      <p className="text-muted-foreground text-xs md:text-sm font-semibold tracking-[2px] md:tracking-[3px] uppercase mb-10 text-center px-4">
        POWERED BY THE WORLD'S MOST ADVANCED AI MODELS
      </p>
      
      <div className="absolute left-0 w-[60px] md:w-[200px] h-full bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 w-[60px] md:w-[200px] h-full bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
      
      <div className="flex w-max animate-marquee gap-12 md:gap-24 items-center px-6">
        {doubledLogos.map((tech, i) => (
          <motion.div 
            key={i} 
            whileHover={{ scale: 1.1, y: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="flex items-center gap-3 md:gap-4 opacity-40 hover:opacity-100 cursor-pointer transition-opacity duration-300"
          >
            <img 
              src={tech.icon} 
              className="h-7 md:h-9 w-auto invert" 
              alt={`${tech.name} logo`} 
              referrerPolicy="no-referrer"
              loading="lazy"
              decoding="async"
            />
            <span className="text-foreground font-semibold text-lg md:text-2xl tracking-tight whitespace-nowrap">
              {tech.name}
            </span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const ComparisonSection = () => {
  const otherTools = [
    "Complicated settings and menus.",
    "Require multiple subscriptions.",
    "Slow processing speeds.",
    "Weak privacy protection.",
    "Basic/Generic output quality."
  ];

  const fyoiaFeatures = [
    "One fast, reliable, private platform.",
    "Powerful multi-model intelligence.",
    "Stunning HD image and video generation.",
    "Easy-to-use intuitive interface.",
    "Blazing generation speed."
  ];

  return (
    <section className="pt-24 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 max-w-6xl mx-auto w-full flex flex-col items-center border-t border-white/10">
      <motion.div {...fadeUp(0.1)} className="text-center mb-16 md:mb-20">
        <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
          Where FyoiaAi stands out
        </span>
        <h2 className="text-[clamp(32px,5vw,48px)] leading-[1.1] tracking-[-1px] font-medium mb-6">
          Most tools cater to big teams <br className="hidden md:block"/> or <span className="font-serif italic font-normal">chaotic workflows</span>
        </h2>
      </motion.div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full">
        {/* Other Tools Column */}
        <motion.div {...fadeUp(0.2)} className="liquid-glass border border-white/5 rounded-[24px] p-8 md:p-10 flex flex-col h-full bg-white/[0.01]">
          <h3 className="font-semibold text-xl mb-8 text-muted-foreground flex items-center gap-3">
            <X className="w-6 h-6 text-red-400/80" />
            Other tools
          </h3>
          <ul className="flex flex-col gap-6">
            {otherTools.map((feature, i) => (
              <li key={i} className="flex items-start gap-4 text-muted-foreground/80 text-[15px] leading-relaxed">
                <Minus className="w-5 h-5 text-red-500/50 shrink-0 mt-[2px]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* FyoiaAi Column */}
        <motion.div {...fadeUp(0.3)} className="liquid-glass border border-white/20 rounded-[24px] p-8 md:p-10 flex flex-col h-full relative overflow-hidden group shadow-[0_0_40px_rgba(255,255,255,0.03)] bg-gradient-to-b from-white/[0.04] to-transparent">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          <h3 className="font-semibold text-xl mb-8 text-foreground flex items-center gap-3 relative z-10">
            <CheckCircle2 className="w-6 h-6 text-green-400" />
            FyoiaAi
          </h3>
          <ul className="flex flex-col gap-6 relative z-10">
            {fyoiaFeatures.map((feature, i) => (
              <li key={i} className="flex items-start gap-4 text-foreground/90 text-[15px] leading-relaxed font-medium">
                <Check className="w-5 h-5 text-green-400/80 shrink-0 mt-[2px]" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
};

const CreationStepperSection = () => {
  const steps = [
    {
      title: "Sign up & Choose Mode",
      desc: "Free in seconds. Choose chat, image, video, or voice.",
      icon: Terminal
    },
    {
      title: "Describe in plain words",
      desc: "Type or speak your idea naturally to our system.",
      icon: Zap
    },
    {
      title: "Refine & Perfect",
      desc: "Watch high-quality results appear instantly. Then converse to refine.",
      icon: Send
    }
  ];

  return (
    <section className="relative pt-24 pb-32 md:pb-44 px-4 w-full flex flex-col items-center">
      <div className="absolute inset-x-0 bottom-0 h-full w-full pointer-events-none z-[-1]">
        <HlsVideo 
          className="w-full h-full object-cover opacity-20 mask-linear-fade"
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px]" />
        <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto flex flex-col items-center w-full">
        <motion.div {...fadeUp(0.1)} className="text-center mb-16 md:mb-24">
          <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
            HOW IT WORKS
          </span>
          <h2 className="text-[clamp(36px,5vw,56px)] leading-[1] tracking-[-1.5px] font-medium mb-6">
            Turn ideas into <span className="font-serif italic font-normal">AI creations</span>
          </h2>
          <p className="text-muted-foreground text-[16px] md:text-lg max-w-2xl mx-auto px-2">
            Create images, videos, and conversations instantly with FyoiaAi tools.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 w-full px-2 relative z-10">
          {steps.map((step, i) => (
            <motion.div key={step.title} {...fadeUp(0.2 + i * 0.1)} className="relative flex flex-col items-center text-center group">
              {i !== steps.length - 1 && (
                <div className="hidden md:block absolute top-[40px] left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-white/20 to-transparent z-0" />
              )}
              <div className="w-20 h-20 rounded-full liquid-glass border border-white/10 flex items-center justify-center mb-8 relative z-10 group-hover:scale-110 transition-transform duration-500 shadow-[0_0_30px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_rgba(59,130,246,0.2)]">
                <step.icon className="w-8 h-8 text-foreground" />
                <div className="absolute -inset-2 bg-blue-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <h3 className="font-semibold text-xl mb-4 text-foreground">{step.title}</h3>
              <p className="text-muted-foreground text-[15px] leading-relaxed max-w-[280px]">
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const AnimatedCounter = ({ value, prefix = "", suffix = "" }: { value: number, prefix?: string, suffix?: string }) => {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });
  
  useEffect(() => {
    if (inView && nodeRef.current) {
      const controls = animate(0, value, {
        duration: 2.5,
        ease: [0.16, 1, 0.3, 1],
        onUpdate: (v) => {
          if (nodeRef.current) {
            nodeRef.current.textContent = `${prefix}${Math.floor(v)}${suffix}`;
          }
        }
      });
      return controls.stop;
    }
  }, [value, inView, prefix, suffix]);

  return <span ref={nodeRef}>{prefix}0{suffix}</span>;
};

const InteractiveCard = ({ children, className, delay = 0, onClick, layoutId }: { children: React.ReactNode, className?: string, delay?: number, onClick?: () => void, layoutId?: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div 
      layoutId={layoutId}
      {...fadeUp(delay)}
      ref={cardRef} 
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={cn("relative overflow-hidden liquid-glass rounded-[24px] border border-white/5 transition-colors duration-500 cursor-pointer hover:shadow-[0_0_40px_rgba(255,255,255,0.03)] bg-white/[0.01] hover:bg-white/[0.02]", className)}
    >
      <div 
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 z-10"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.08), transparent 40%)`
        }}
      />
      <div className="relative z-20 h-full w-full">{children}</div>
    </motion.div>
  );
};

const FeaturesListSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<any>(null);

  const closeFeature = () => {
    setSelectedFeature(null);
  };

  useEffect(() => {
    if (selectedFeature) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [selectedFeature]);

  return (
    <section className="relative py-32 md:py-44 px-4 w-full border-t border-border/30 overflow-hidden">
      <div className="absolute inset-x-0 inset-y-0 h-full w-full pointer-events-none z-0">
        <HlsVideo 
          className="w-full h-full object-cover opacity-30 mask-linear-fade"
          src="https://stream.mux.com/8wrHPCX2dC3msyYU9ObwqNdm00u3ViXvOSHUMRYSEe5Q.m3u8"
          autoPlay
          loop
          muted
          playsInline
        />
        <div className="absolute inset-0 bg-background/80 backdrop-blur-[4px]" />
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-background to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-background to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <motion.div {...fadeUp(0.1)} className="text-center mb-16 md:mb-24">
          <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
            CAPABILITIES
          </span>
          <h2 className="text-4xl md:text-6xl font-medium tracking-[-1px]">
            Built for <span className="font-serif italic font-normal">AI creation</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 w-full px-2 lg:auto-rows-[280px]">
          
          {/* Card 1: Large Feature */}
          <InteractiveCard layoutId="feat-chat" delay={0.2} onClick={() => setSelectedFeature({
            id: 'feat-chat',
            title: 'AI Chat Models',
            desc: "Smart AI chat with powerful coding assistance.",
            fullDesc: "Our proprietary and open-source synchronized chat models provide the highest context window capacity in the industry. Generate long-form complex reports, build logic trees, brainstorm architecture, or converse naturally. Capable of zero-latency streaming text right back to the client interface for instant conversational interactions. Includes models like GPT-4o, Claude 3.5 Sonnet, Gemini 2.0, Llama 3.3, and Grok.",
            icon: MessageCircle,
            colorClass: 'bg-blue-500/20',
            textClass: 'text-blue-400'
          })} className="md:col-span-2 lg:col-span-2 lg:row-span-2 p-8 sm:p-10 flex flex-col justify-end group min-h-[300px] lg:min-h-full overflow-hidden">
            <div className="absolute top-10 right-10 w-32 h-32 bg-blue-500/20 blur-[80px] rounded-full group-hover:scale-150 transition-transform duration-700" />
            <MessageCircle className="w-12 h-12 text-blue-400 mb-6 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-semibold text-2xl md:text-3xl mb-3 text-foreground tracking-tight">AI Chat Models</h3>
            <p className="text-muted-foreground text-[16px] leading-relaxed max-w-md">
              Ask questions, generate content, and solve complex tasks with FyoiaAi highly advanced reasoning models.
            </p>
            <div className="absolute top-[-20%] right-[-10%] opacity-10 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none scale-75">
              <Spiral totalDots={100} backgroundColor="transparent" dotColor="#ffffff" maxOpacity={0.8} />
            </div>
            <div className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-blue-400 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               Click to view details <ArrowRight className="w-3 h-3" />
            </div>
          </InteractiveCard>

          {/* Card 2: Square Feature */}
          <InteractiveCard layoutId="feat-code" delay={0.3} onClick={() => setSelectedFeature({
            id: 'feat-vid',
            title: 'Text-to-Video',
            desc: "Advanced text-to-video generation that turns your ideas into moving visuals.",
            fullDesc: "Type your script and instantly watch the scene develop before your eyes. Perfect for marketers, social media creators, and designers who need high-converting, motion-rich content but don't want to deal with complex video editing software.",
            icon: Camera,
            colorClass: 'bg-emerald-500/20',
            textClass: 'text-emerald-400'
          })} className="md:col-span-1 lg:col-span-2 lg:row-span-1 p-8 sm:p-10 flex flex-col justify-end group min-h-[250px] lg:min-h-full">
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-emerald-500/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="flex-1" />
            <Camera className="w-10 h-10 text-emerald-400 mb-5 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-semibold text-xl mb-2 text-foreground">Video Generation</h3>
            <p className="text-muted-foreground text-[14px] leading-relaxed">
              Turn your ideas into moving visuals quickly.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-emerald-400 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               Click to view details <ArrowRight className="w-3 h-3" />
            </div>
          </InteractiveCard>

          {/* Card 3: Square Feature */}
          <InteractiveCard layoutId="feat-pay" delay={0.4} onClick={() => setSelectedFeature({
            id: 'feat-pay',
            title: 'Voice Conversations',
            desc: "Natural and studio-quality interactive voice conversations.",
            fullDesc: "Speak directly to your customized assistant and receive fluid, low-latency audio responses. Our specialized voice engines pick up contextual tones and intent, eliminating the robotic feel of older AI and replacing it with organic, responsive human-like interactions.",
            icon: Mic,
            colorClass: 'bg-rose-500/20',
            textClass: 'text-rose-400'
          })} className="md:col-span-1 lg:col-span-1 lg:row-span-1 p-8 sm:p-10 flex flex-col justify-end group min-h-[250px] lg:min-h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
            <div className="flex-1" />
            <Mic className="w-10 h-10 text-rose-400 mb-5 opacity-80 group-hover:opacity-100 transition-opacity" />
            <h3 className="font-semibold text-xl mb-2 text-foreground">Voice AI</h3>
            <p className="text-muted-foreground text-[14px] leading-relaxed">
              Studio-quality interactive voice conversations.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-rose-400 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               Click to view details <ArrowRight className="w-3 h-3" />
            </div>
          </InteractiveCard>

          {/* Card 4: Horizontal Feature */}
          <InteractiveCard layoutId="feat-img" delay={0.5} onClick={() => setSelectedFeature({
            id: 'feat-img',
            title: 'Image Quality',
            desc: "Multiple premium text-to-image models delivering stunning HD quality.",
            fullDesc: "Imagine entering a text block and receiving cinematic 4K renders back. Leverage industry leaders like Flux Pro and DALL·E 3 to build beautiful concept art, realistic photography, and assets tailored precisely to your brand. Enjoy advanced upscaling options and generation speeds that transform ideas into moving visuals quickly.",
            icon: Zap,
            colorClass: 'bg-yellow-500/20',
            textClass: 'text-yellow-400'
          })} className="md:col-span-2 lg:col-span-1 lg:row-span-1 p-8 sm:p-10 flex flex-col justify-end group min-h-[250px] lg:min-h-full overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-white/[0.02] to-transparent z-0" />
            <Zap className="w-10 h-10 text-yellow-400 mb-5 opacity-80 group-hover:opacity-100 transition-opacity relative z-10" />
            <h3 className="font-semibold text-xl mb-2 text-foreground relative z-10">Image & Video</h3>
            <p className="text-muted-foreground text-[14px] leading-relaxed relative z-10">
              High-quality media from simple text prompts.
            </p>
            <div className="relative z-10 mt-4 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-widest text-yellow-400 opacity-0 transform translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
               Click to view details <ArrowRight className="w-3 h-3" />
            </div>
          </InteractiveCard>
        </div>
        
        {/* Interactive Modal overlay */}
        <AnimatePresence>
          {selectedFeature && (
            <>
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeFeature}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 pointer-events-auto cursor-pointer"
              />
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
                <motion.div 
                  layoutId={selectedFeature.id}
                  className="bg-[#050505] w-full max-w-2xl rounded-[32px] overflow-hidden pointer-events-auto relative shadow-[0_0_80px_rgba(0,0,0,0.8)] border border-white/10"
                >
                  <div className={cn("absolute top-0 inset-x-0 h-40 blur-[80px] pointer-events-none", selectedFeature.colorClass)} />
                  <button onClick={closeFeature} className="absolute top-6 right-6 z-10 p-2 rounded-full bg-white/5 border border-white/10 text-white/70 hover:text-white hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                  <div className="p-8 md:p-12 relative z-10 h-[50vh] sm:h-auto overflow-y-auto scroller">
                     <selectedFeature.icon className={cn("w-14 h-14 mb-8", selectedFeature.textClass)} />
                     <h3 className="text-3xl md:text-4xl font-medium tracking-tight mb-4 text-foreground">{selectedFeature.title}</h3>
                     <p className="text-lg text-muted-foreground/90 font-medium mb-6">
                       {selectedFeature.desc}
                     </p>
                     <div className="h-[1px] w-full bg-white/10 mb-6" />
                     <p className="text-muted-foreground leading-relaxed text-[15px]">
                       {selectedFeature.fullDesc}
                     </p>
                     <motion.button 
                        onClick={closeFeature} 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 400, damping: 10 }}
                        className="mt-10 px-10 py-4 rounded-full font-semibold text-sm transition-all overflow-hidden relative group liquid-glass border border-white/10 text-foreground hover:bg-white/5 backdrop-blur-xl shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] z-10"
                     >
                        <motion.div 
                          className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full pointer-events-none"
                          whileHover={{ translateX: ["-100%", "100%"] }}
                          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                        />
                        <span className="relative z-10">Got it</span>
                     </motion.button>
                  </div>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const PricingSection = () => {
  const [isYearly, setIsYearly] = useState(false);

  const plans = [
    {
      name: "Free",
      priceNum: 0,
      pricePrefix: "$",
      period: "/month",
      desc: "Perfect for exploring the platform",
      features: [
        { name: "1M AI Tokens Per Month", desc: "A great starting supply for standard requests." },
        { name: "Unlimited Chat (FAUP)", desc: "Chat freely within fair usage policies." },
        { name: "Essential Image Tools", desc: "Access standard image generation features." },
        { name: "All Core Models", desc: "GPT-4o, Claude 3.5, Gemini 2.0 access." },
        { name: "Standard Generation Speed", desc: "Default queue priority." }
      ],
      icon: <Target className="w-6 h-6 text-foreground" />,
      popular: false
    },
    {
      name: "Pro",
      priceNum: 15,
      pricePrefix: "$",
      period: "/month",
      popular: true,
      desc: "For serious creators & professionals",
      features: [
        { name: "Massive Token Limits", desc: "Significantly higher allowances for high-volume creation." },
        { name: "Priority Speed", desc: "Skip the queue with top tier processing clusters." },
        { name: "Premium Video & Image Models", desc: "Access Flux Pro, DALL·E 3, and advanced video engines." },
        { name: "Advanced Editing Features", desc: "Upscaling, outpainting, and deep control." },
        { name: "API Access & Commercial Rights", desc: "Use assets anywhere, build into your apps." }
      ],
      icon: <Flame className="w-6 h-6 text-foreground" />
    },
    {
      name: "Enterprise",
      priceNum: 99,
      pricePrefix: "$",
      period: "/month",
      desc: "Custom solutions for teams",
      features: [
        { name: "Dedicated Infrastructure", desc: "Private clusters for isolated processing." },
        { name: "Team Features & Seats", desc: "Manage roles, billing, and shared workspaces." },
        { name: "Full White-label Options", desc: "Brand the outputs and interfaces." },
        { name: "Custom Model Integrations", desc: "Fine-tune models on your private data." },
        { name: "24/7 Dedicated Support", desc: "Direct engineering support channel." }
      ],
      icon: <Gem className="w-6 h-6 text-foreground" />,
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-24 md:py-32 px-4 max-w-7xl mx-auto w-full border-t border-white/10">
      <motion.div {...fadeUp(0.1)} className="text-center mb-16 md:mb-24">
        <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
          SUBSCRIPTIONS
        </span>
        <h2 className="text-[clamp(32px,5vw,56px)] leading-[1] tracking-[-1.5px] font-medium mb-6">
          Simple <span className="font-serif italic font-normal text-muted-foreground">Pricing</span> Plans
        </h2>

        <div className="flex items-center justify-center gap-4 mt-8">
          <span className={cn("text-sm font-semibold transition-colors", !isYearly ? "text-foreground" : "text-muted-foreground")}>Monthly</span>
          <button 
            onClick={() => setIsYearly(!isYearly)}
            className="w-14 h-8 rounded-full liquid-glass border border-white/20 p-1 flex items-center transition-all bg-white/5"
          >
            <motion.div 
              animate={{ x: isYearly ? 24 : 0 }} 
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="w-6 h-6 rounded-full bg-foreground shadow-sm"
            />
          </button>
          <span className={cn("text-sm font-semibold transition-colors flex items-center gap-2", isYearly ? "text-foreground" : "text-muted-foreground")}>
            Yearly
            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">2 months free</span>
          </span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-6xl mx-auto overflow-visible">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.name} 
            {...fadeUp(0.2 + i * 0.1)} 
            className={cn(
              "relative rounded-[24px] p-8 md:p-10 flex flex-col h-full group overflow-hidden transition-all duration-500",
              plan.popular ? "bg-white/[0.04] border border-white/20 hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] scale-100 md:scale-[1.03] z-10" : "liquid-glass hover:bg-white/[0.03]"
            )}
          >
            {/* Animated Hover Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-500/40 via-purple-500/40 to-blue-500/40 text-white text-[10px] font-bold px-5 py-1.5 rounded-b-xl uppercase tracking-widest shadow-[0_0_20px_rgba(120,119,198,0.3)] backdrop-blur-md border hover:border-white/20 border-white/10 transition-colors">
                Most Popular
              </div>
            )}
            
            <div className={cn(
              "mb-8 p-4 rounded-2xl w-fit transition-all duration-500 group-hover:scale-110 relative z-10",
              plan.popular ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "liquid-glass group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            )}>
              {plan.icon}
            </div>
            
            <h3 className="text-2xl font-semibold mb-2 relative z-10">{plan.name}</h3>
            <p className="text-muted-foreground text-sm font-medium h-10 relative z-10">{plan.desc}</p>
            <div className="flex items-center gap-1 mb-8 mt-2 border-b border-white/10 pb-8 relative z-10">
              <div className="text-4xl md:text-5xl font-bold tracking-tight bg-white/[0.03] px-4 py-2 rounded-xl border border-white/5 text-foreground">
                <AnimatedCounter value={isYearly ? (plan.priceNum === 0 ? 0 : plan.priceNum * 10) : plan.priceNum} prefix={plan.pricePrefix} />
              </div>
              <span className="text-muted-foreground font-medium ml-2">{isYearly ? "/year" : plan.period}</span>
            </div>
            
            <ul className="flex flex-col gap-4 mb-10 flex-1 relative z-10">
              {plan.features.map((feat) => (
                <li key={feat.name} className="flex items-start gap-3 text-muted-foreground text-[14px] relative group/feat leading-relaxed">
                  <CheckCircle2 className="w-5 h-5 text-foreground/70 shrink-0 mt-[2px] group-hover/feat:text-foreground transition-colors" />
                  <div className="flex flex-col cursor-help">
                    <span className="hover:text-foreground transition-colors font-medium">
                      {feat.name}
                    </span>
                    <span className="text-[12px] text-muted-foreground/60 mt-0.5 leading-snug">
                      {feat.desc}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
            
            <motion.a 
              href="#pricing"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
              className={cn(
                "w-full py-4 rounded-[12px] font-semibold text-center mt-auto border transition-all relative overflow-hidden group/btn z-10 liquid-glass backdrop-blur-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.1)]",
                plan.popular ? "bg-white/[0.08] hover:bg-white/[0.12] border-white/20 text-foreground" : "bg-white/[0.02] border-white/10 text-foreground"
              )}
            >
              <motion.div 
                className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full pointer-events-none"
                whileHover={{ translateX: ["-100%", "100%"] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
              />
              <span className="relative z-10">{plan.priceNum === 0 ? "Start For Free" : "Upgrade Plan"}</span>
            </motion.a>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

const TestimonialSection = () => {
  const testimonials = [
    {
      quote: "FyoiaAi has completely transformed my workflow. The voice chat and coding models are incredibly advanced, saving me hours every week in Pune.",
      name: "Rahul Verma",
      title: "Indie Developer",
      logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/vercel.svg"
    },
    {
      quote: "The Flux Pro and DALL·E 3 integrations are stunning. I can generate production-ready HD assets in seconds for my clients in Bangalore.",
      name: "Sneha Patel",
      title: "Graphic Designer",
      logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/figma.svg"
    },
    {
      quote: "We use FyoiaAi to automate our entire content pipeline in Mumbai. It's affordable, flexible, and packed with powerful multi-model intelligence.",
      name: "Arjun Reddy",
      title: "Startup Founder",
      logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/stripe.svg"
    },
    {
      quote: "The ability to just switch between Llama 3.3 and GPT-4o smoothly is a game changer for drafting long-form content. Loving it from Delhi!",
      name: "Priya Sharma",
      title: "Marketing Professional",
      logo: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/notion.svg"
    }
  ];

  const marqueeItems = [...testimonials, ...testimonials, ...testimonials];

  return (
    <section className="py-24 md:py-32 w-full border-t border-white/10 overflow-hidden relative">
      <motion.div {...fadeUp(0.1)} className="text-center mb-12 md:mb-16 px-4 max-w-7xl mx-auto">
        <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
          WALL OF LOVE
        </span>
        <h2 className="text-[clamp(32px,5vw,56px)] leading-[1] tracking-[-1.5px] font-medium text-center mb-6">
          Creators across India <span className="font-serif italic font-normal text-muted-foreground">love FyoiaAi</span>
        </h2>
      </motion.div>

      <div className="relative w-full overflow-hidden flex items-center mt-8">
        <div className="absolute left-0 top-0 bottom-0 w-[50px] md:w-[200px] bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-[50px] md:w-[200px] bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />
        
        <div className="flex w-max animate-marquee gap-6 px-4 py-8">
          {marqueeItems.map((testimonial, i) => (
            <div
              key={i}
              className="relative liquid-glass rounded-[24px] p-8 flex flex-col justify-between w-[340px] md:w-[440px] shrink-0 backdrop-blur-2xl transition-all duration-500 hover:scale-[1.04] hover:-translate-y-3 hover:shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,255,255,0.03)] bg-white/[0.01] hover:bg-white/[0.04] border-t border-white/10 hover:border-white/20 cursor-pointer group"
            >
              <div className="absolute top-0 right-0 w-[150px] h-[150px] bg-white/[0.02] blur-[50px] rounded-full group-hover:bg-white/[0.06] transition-colors duration-500" />

              <div className="relative z-10">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, idx) => (
                      <Star key={idx} className="w-4 h-4 fill-white/80 text-white/80" />
                    ))}
                  </div>
                  <img src={testimonial.logo} alt="Company logo" loading="lazy" decoding="async" className="w-6 h-6 object-contain invert opacity-60 mix-blend-screen group-hover:opacity-100 group-hover:scale-110 group-hover:drop-shadow-[0_0_12px_rgba(255,255,255,0.6)] transition-all duration-300" />
                </div>
                
                <p className="text-[16px] md:text-[18px] leading-[1.6] mb-8 text-foreground/90 font-medium">
                  "{testimonial.quote}"
                </p>
              </div>
              
              <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <span className="font-bold text-sm tracking-tighter">{testimonial.name.slice(0, 2).toUpperCase()}</span>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground text-[15px] tracking-tight">{testimonial.name}</h4>
                  <p className="text-[13px] text-muted-foreground">{testimonial.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQItem = ({ faq, index }: { faq: { q: string, a: string }, index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      {...fadeUp(0.1 + index * 0.1)} 
      className="mb-4"
    >
      <motion.div 
        layout
        initial={false}
        animate={{
          backgroundColor: isOpen ? "rgba(255, 255, 255, 0.04)" : "rgba(255, 255, 255, 0.01)",
          borderColor: isOpen ? "rgba(255, 255, 255, 0.12)" : "rgba(255, 255, 255, 0.05)",
          boxShadow: isOpen ? "0 20px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" : "0 0px 0px rgba(0,0,0,0)"
        }}
        whileHover={{
          backgroundColor: isOpen ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.03)",
          borderColor: isOpen ? "rgba(255, 255, 255, 0.2)" : "rgba(255, 255, 255, 0.1)"
        }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="group cursor-pointer relative overflow-hidden rounded-[20px] border"
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Dynamic subtle glass reflection */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-tr from-white/[0.06] via-transparent to-transparent pointer-events-none"
          animate={{ opacity: isOpen ? 1 : 0 }}
          transition={{ duration: 0.5 }}
        />
        {/* Soft radial glow on hover */}
        <motion.div 
          className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            background: "radial-gradient(circle at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 60%)"
          }}
        />
        
        <div className="py-6 px-6 md:px-8 flex items-center justify-between gap-4 relative z-10 w-full">
          <motion.h3 
            layout="position"
            className="text-[16px] md:text-lg font-medium tracking-tight text-foreground/80 group-hover:text-white transition-colors duration-300"
            animate={{ color: isOpen ? "#ffffff" : undefined }}
          >
            {faq.q}
          </motion.h3>
          <motion.div 
            layout="position"
            animate={{ 
              rotate: isOpen ? 135 : 0, 
              backgroundColor: isOpen ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.5)" 
            }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="flex-shrink-0 w-10 h-10 rounded-full border border-white/10 flex items-center justify-center backdrop-blur-md overflow-hidden transition-colors duration-300 group-hover:bg-white/5"
          >
            <Plus className="w-4 h-4 text-white" />
          </motion.div>
        </div>
        
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              key="faq-content"
              initial={{ height: 0, opacity: 0, filter: "blur(4px)", y: -10 }}
              animate={{ height: "auto", opacity: 1, filter: "blur(0px)", y: 0 }}
              exit={{ height: 0, opacity: 0, filter: "blur(4px)", y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-6 md:px-8 pb-8 pt-0 text-muted-foreground/80 leading-relaxed text-[15px] md:text-base max-w-3xl relative z-10 border-t border-white/5 mt-2">
                <div className="pt-6">
                  {faq.a}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

const FAQSection = () => {
  const faqs = [
    {
      q: "What types of AI models does FyoiaAi provide?",
      a: "We offer a unified suite of proprietary and open-source models, including advanced reasoning engines (Language), multimodal image/video generators, and dedicated coding co-pilots configured for low-latency delivery."
    },
    {
      q: "How does the token pricing system work?",
      a: "Our system calculates tokens based on compute complexity. Text models consume standard logic tokens, while voice and video generation map to compute-time tokens. The Starter plan provides 1M free tokens per month that cover all modalities."
    },
    {
      q: "Can I integrate FyoiaAi models into my own application?",
      a: "Absolutely. Our developer API provides a unified, highly optimized endpoint for all models. Simply grab your API key from the dashboard and use our standard REST interface or official SDKs (Node.js, Python, & Go)."
    },
    {
      q: "Are the generated assets commercially cleared?",
      a: "Yes. All images, videos, and code generated on Pro and Enterprise tiers come with full commercial rights and indemnification clauses baked in."
    }
  ];

  return (
    <section className="py-24 md:py-32 px-4 max-w-4xl mx-auto w-full relative border-t border-white/5">
      <div className="absolute top-0 right-10 w-96 h-96 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-10 w-96 h-96 bg-white/[0.02] blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div {...fadeUp(0.1)} className="mb-16 flex flex-col items-center text-center">
        <motion.div 
          whileHover={{ scale: 1.05 }}
          className="inline-flex w-max items-center gap-2 px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-foreground mb-6 backdrop-blur-md cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.05)]"
        >
          <Info className="w-4 h-4" />
          <span className="text-[11px] uppercase tracking-[3px] font-bold">FAQ</span>
        </motion.div>
        
        <h2 className="text-[clamp(32px,5vw,56px)] leading-[1.05] tracking-[-1.5px] font-medium text-foreground">
          Common <span className="font-serif italic font-normal text-muted-foreground">questions</span>
        </h2>
      </motion.div>
      
      <div className="flex flex-col border-t border-white/10 pt-4">
        {faqs.map((faq, i) => (
          <FAQItem key={i} faq={faq} index={i} />
        ))}
      </div>
    </section>
  );
};

const AboutSection = () => {
  return (
    <section id="about" className="relative py-24 md:py-40 overflow-hidden w-full border-t border-white/5 bg-transparent">
      {/* Liquid Glass Animated Background */}
      <div className="absolute inset-x-0 bottom-0 h-[600px] w-full pointer-events-none overflow-hidden">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/2 left-1/4 w-[800px] h-[800px] bg-white/[0.015] blur-[100px] rounded-[40%_60%_70%_30%/40%_50%_60%_50%] origin-center mix-blend-screen"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            scale: [1, 1.4, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 right-1/4 w-[600px] h-[600px] bg-[#ffffff08] blur-[120px] rounded-[60%_40%_30%_70%/60%_30%_70%_40%] origin-center mix-blend-screen"
        />
      </div>
      
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 flex flex-col items-center">
        
        <motion.div 
           {...fadeUp(0.1)} 
           className="flex flex-col items-center text-center w-full liquid-glass rounded-[40px] px-6 py-20 md:py-32 border border-white/5 shadow-[0_0_80px_rgba(0,0,0,0.8)] backdrop-blur-3xl overflow-hidden relative group"
        >
          {/* Internal Flowing Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
          <motion.div 
            className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.05] to-transparent -translate-x-full pointer-events-none"
            whileHover={{ translateX: ["-100%", "100%"] }}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          <span className="text-xs tracking-[5px] uppercase text-foreground/50 font-bold inline-block mb-6 relative z-10">
            READY TO START?
          </span>
          
          <h2 className="text-[clamp(40px,7vw,90px)] leading-[1] tracking-[-2px] font-medium text-foreground mb-8 relative z-10">
            Turn your ideas into <br className="hidden md:block"/> <span className="font-serif italic font-normal text-muted-foreground">reality in seconds.</span>
          </h2>
          
          <p className="text-muted-foreground/80 text-lg md:text-[22px] leading-relaxed max-w-2xl mx-auto font-medium mb-14 relative z-10">
            Join FyoiaAi right now — it's completely free to begin, requires no credit card, and gives you instant access to powerful tools that help you generate text, code, images, videos, and voice content with amazing speed.
          </p>
          
          <motion.a 
            href="#pricing"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
            className="relative z-10 flex items-center justify-center gap-2 liquid-glass border border-white/10 text-foreground px-10 py-5 rounded-full font-bold text-[16px] shadow-[0_0_20px_rgba(255,255,255,0.02)] hover:shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:bg-white/5 transition-all overflow-hidden group/btn"
          >
             <motion.div 
               className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.15] to-transparent -translate-x-full pointer-events-none"
               whileHover={{ translateX: ["-100%", "100%"] }}
               transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
             />
             <span className="relative z-10">Start Creating for Free</span>
             <ChevronRight className="w-5 h-5 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => {
  const socials = [
    { icon: Send, url: "https://t.me/terex", label: "Telegram" },
    { icon: Twitter, url: "https://x.com/lostingness", label: "X (Twitter)" },
    { icon: Instagram, url: "https://instagram.com/Lostingness", label: "Instagram" },
    { icon: Linkedin, url: "https://linkedin.com/in/lostingness", label: "LinkedIn" },
    { icon: Github, url: "https://github.com/lostingness", label: "GitHub" },
  ];

  return (
    <footer className="py-16 md:py-24 px-6 md:px-10 max-w-7xl mx-auto w-full flex flex-col gap-16 border-t border-white/5">
      
      <div className="flex flex-col lg:flex-row justify-between gap-12 lg:gap-24 w-full">
        <div className="flex flex-col items-start gap-6 text-left w-full lg:max-w-[320px]">
          <div className="flex items-center gap-[8px]">
            <Logo className="w-8 h-8 text-foreground" />
            <span className="font-serif italic font-normal text-[26px] tracking-[-0.5px]">Socialize Agency</span>
          </div>
          <p className="text-muted-foreground text-[15px] font-medium leading-relaxed">
            We design systems that automate growth. Elevate your ad distribution with precision.
          </p>
          
          <div className="flex flex-wrap justify-start items-center gap-3 mt-2">
            {socials.map((social, i) => (
              <motion.a
                key={i}
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                whileHover={{ 
                  y: -4, 
                  scale: 1.05, 
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  borderColor: "rgba(255, 255, 255, 0.2)"
                }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="relative overflow-hidden p-3 rounded-full text-muted-foreground hover:text-white flex items-center justify-center border border-white/5 bg-white/[0.02] backdrop-blur-md"
              >
                {/* Flowing background gleam */}
                <motion.div 
                  className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent -translate-x-full"
                  whileHover={{ translateX: ["-100%", "100%"] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                />
                <social.icon className="w-5 h-5 relative z-10 transition-colors duration-300 drop-shadow-md" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 sm:gap-12 w-full lg:flex-1 text-left">
          <div className="flex flex-col gap-4">
            <h4 className="text-foreground font-semibold mb-2">Platform</h4>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Overview</a>
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Pricing</a>
          </div>
          
          <div className="flex flex-col gap-4">
            <h4 className="text-foreground font-semibold mb-2">Support</h4>
            <a href="#about" onClick={(e) => {
                e.preventDefault();
                const elem = document.getElementById('about');
                if (elem) elem.scrollIntoView({ behavior: 'smooth' });
            }} className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">About Us</a>
            <a href="https://t.me/smoken" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Contact Sales</a>
            <a href="https://t.me/smoken" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium">Help Center</a>
          </div>

          <div className="flex flex-col gap-4 col-span-2 sm:col-span-1 border-t border-white/5 sm:border-0 pt-6 sm:pt-0 mt-2 sm:mt-0">
            <h4 className="text-foreground font-semibold mb-2">Network</h4>
            <a href="https://t.me/smoken" target="_blank" rel="noreferrer" className="flex items-center gap-2 group text-muted-foreground transition-colors text-sm font-medium w-fit">
              Join Telegram 
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 group-hover:text-foreground transition-transform" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-8 border-t border-white/5 gap-6 sm:gap-4">
        <div className="flex flex-col gap-2">
          <p className="text-muted-foreground text-sm font-medium text-left">
            © 2026 FyoiaAi. All rights reserved.
          </p>
          <p className="text-muted-foreground/60 text-xs font-semibold text-left">
            Developer : Mohit Gupta
          </p>
        </div>
        <span className="text-xs text-muted-foreground/50 tracking-widest uppercase text-left sm:text-right">Inspiring the future</span>
      </div>
    </footer>
  );
};

  export default function App() {
    return (
      <div className="min-h-screen bg-background text-foreground selection:bg-foreground selection:text-background font-sans font-normal relative overflow-x-hidden">
      
      {/* Global Background Ambient Blur Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.015] blur-[100px]" />
        <div className="absolute top-[40%] right-[-10%] w-[30vw] h-[30vw] rounded-full bg-white/[0.02] blur-[120px]" />
        <div className="absolute bottom-[10%] left-[20%] w-[50vw] h-[50vw] rounded-full bg-white/[0.01] blur-[150px]" />
      </div>

      <div className="relative z-10 w-full flex flex-col items-center">
        <Navbar />
        <main className="w-full">
          <HeroSection />
          <LogoMarquee />
          <ComparisonSection />
          <CreationStepperSection />
          <FeaturesListSection />
          <PricingSection />
          <TestimonialSection />
          <FAQSection />
          <AboutSection />
        </main>
        <Footer />
      </div>
    </div>
  );
}
