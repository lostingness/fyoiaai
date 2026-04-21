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
  const [navState, setNavState] = useState<'top' | 'compact' | 'expanded'>('top');
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
    let lastScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          
          if (currentScrollY < 20) {
            setNavState('top');
          } else if (currentScrollY > 50 && currentScrollY > lastScrollY) {
            setNavState('compact');
          } else if (currentScrollY < lastScrollY) {
            setNavState('expanded');
          }
          
          lastScrollY = currentScrollY;
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

  // Helper to determine the classes based on navState and mobileMenuOpen
  const getNavClasses = () => {
    const baseClasses = "pointer-events-auto flex items-center justify-between transition-all duration-500";
    
    if (mobileMenuOpen || navState === 'expanded') {
      return `${baseClasses} bg-background/80 backdrop-blur-[20px] border border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.02)] rounded-[32px] px-4 md:px-10 py-3 w-full max-w-7xl`;
    }
    
    if (navState === 'compact') {
      return `${baseClasses} bg-background/70 backdrop-blur-[20px] border border-white/10 shadow-[0_8px_32px_rgba(255,255,255,0.02)] rounded-[24px] px-4 md:px-6 py-2.5 w-full max-w-[800px] md:max-w-[700px]`;
    }
    
    // Default 'top'
    return `${baseClasses} bg-transparent border border-transparent rounded-[32px] px-2 md:px-12 py-3 w-full max-w-7xl`;
  };

  return (
    <>
      <div className="fixed top-0 inset-x-0 z-50 flex justify-center w-full px-4 pt-4 md:pt-6 pointer-events-none transition-all duration-500 ease-in-out">
        <motion.nav 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className={getNavClasses()}
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

      {navState !== 'top' && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-[75px] md:top-[85px] left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] z-40 bg-gradient-to-r from-transparent via-blue-500/50 to-transparent shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"
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
      
      <div className="relative z-10 px-4 md:px-8 mt-12 flex flex-col items-center max-w-[1200px] w-full">
        <motion.div {...fadeUp(0.1)} className="flex items-center gap-[12px] mb-[24px]">
          <div className="inline-flex items-center gap-2 liquid-glass rounded-full px-3 py-1.5 md:px-4 md:py-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/5">
            <span className="flex h-2 w-2 rounded-full bg-blue-500 animate-[pulse_2s_cubic-bezier(0.4,0,0.6,1)_infinite]"></span>
            <span className="text-muted-foreground text-[14px] font-medium ml-1">
              FyoiaAi IS NOW FREE!
            </span>
          </div>
        </motion.div>

        <motion.h1 {...fadeUp(0.2)} className="text-[clamp(40px,7vw,76px)] leading-[1.05] tracking-[-2px] md:tracking-[-3px] font-medium mb-[24px] w-full max-w-[1100px] mx-auto text-center px-2">
          Build, Create & Automate <br className="hidden md:block"/> with <span className="font-serif italic font-normal bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50">FyoiaAi</span>
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
    { 
      name: "OpenAI", 
      iconPath: "M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142.0852 4.783 2.7582a.7712.7712 0 0 0 .7806 0l5.8428-3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142-.0852-4.7735-2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z"
    },
    { 
      name: "Anthropic", 
      iconPath: "M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z" 
    },
    { 
      name: "Google", 
      iconPath: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" 
    },
    { 
      name: "Meta", 
      iconPath: "M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z" 
    },
    { 
      name: "xAI", 
      iconPath: "M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" 
    },
    { 
      name: "Hugging Face", 
      iconPath: "M1.4446 11.5059c0 1.1021.1673 2.1585.4847 3.1563-.0378-.0028-.0691-.0058-.1058-.0058-.4209 0-.8015.16-1.0704.4512-.3454.3737-.4984.8335-.4316 1.293a1.576 1.576 0 0 0 .2148.5978c-.2319.1864-.4018.4456-.4844.7578-.0646.2448-.131.7543.2149 1.2794a1.4552 1.4552 0 0 0-.0625.1055c-.208.3923-.2207.8372-.0371 1.25.2783.6258.9696 1.1175 2.3126 1.6467.8356.3292 1.5988.5411 1.6056.543 1.1046.2847 2.104.4277 2.969.4277 1.4173 0 2.4754-.3849 3.1525-1.1446 1.538.2651 2.791.1403 3.592.006.6773.7555 1.7332 1.1387 3.1467 1.1387.8649 0 1.8643-.143 2.969-.4278.0068-.0019.77-.2138 1.6056-.543 1.343-.5292 2.0343-1.0208 2.3126-1.6466.1836-.4129.171-.8577-.037-1.25a1.4685 1.4685 0 0 0-.0626-.1056c.346-.525.2795-1.0346.2149-1.2793-.0826-.3122-.2525-.5714-.4844-.7579.11-.1816.1831-.3788.2148-.5977.0669-.4595-.0862-.9193-.4316-1.293-.2688-.2913-.6495-.4513-1.0704-.4513-.0209 0-.0376.0008-.0588.0018.3162-.9966.4846-2.0518.4846-3.1523 0-5.807-4.7362-10.5144-10.5789-10.5144-5.8426 0-10.5788 4.7073-10.5788 10.5144Zm10.5788-9.4831c5.2727 0 9.5476 4.246 9.5476 9.483a9.4201 9.4201 0 0 1-.2696 2.2365c-.0039-.0047-.0079-.011-.0117-.0156-.274-.3255-.6679-.5059-1.1075-.5059-.352 0-.714.1155-1.0763.3438-.2403.1517-.5058.422-.7793.7598-.2534-.3492-.608-.5832-1.0137-.6465a1.5174 1.5174 0 0 0-.2344-.0176c-.9263 0-1.4828.7993-1.6935 1.5177-.1046.2426-.6065 1.3482-1.3614 2.0978-1.1681 1.1601-1.4458 2.3534-.8396 3.6382-.843.1029-1.5836.0927-2.365-.006.5906-1.212.3626-2.4388-.8426-3.6322-.755-.7496-1.2568-1.8552-1.3614-2.0978-.2107-.7184-.7673-1.5177-1.6935-1.5177-.078 0-.1568.0054-.2344.0176-.4057.0633-.7604.2973-1.0137.6465-.2735-.3379-.539-.6081-.7794-.7598-.3622-.2283-.7243-.3438-1.0762-.3438-.4266 0-.8094.171-1.0821.4786a9.4208 9.4208 0 0 1-.2598-2.1936c0-5.237 4.2749-9.483 9.5475-9.483zM8.6443 7.0036c-.4838.0043-.9503.2667-1.1934.7227-.3536.6633-.1006 1.4873.5645 1.84.351.1862.4883-.5261.836-.6485.3107-.1095.841.399 1.0078.086.3536-.6634.1025-1.4874-.5625-1.84a1.3659 1.3659 0 0 0-.6524-.1602Zm6.8403 0c-.2199-.002-.4426.05-.6504.1602-.665.3526-.9181 1.1766-.5645 1.84.1669.313.6971-.1955 1.0079-.086.3476.1224.4867.8347.838.6485.6649-.3527.916-1.1767.5624-1.84-.243-.456-.7096-.7184-1.1934-.7227Zm-9.7565 1.418a.8768.8768 0 0 0-.877.877c0 .4846.3925.877.877.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zm12.6434 0c-.4845 0-.879.3925-.879.877 0 .4846.3945.877.879.877a.8768.8768 0 0 0 .877-.877.8768.8768 0 0 0-.877-.877zM8.7927 11.459c-.179-.003-.2793.1107-.2793.416 0 .8097.3874 2.125 1.4279 2.924.207-.7123 1.3453-1.2832 1.5079-1.2012.2315.1167.2191.4417.6074.7266.3884-.285.374-.6098.6056-.7266.1627-.082 1.3009.4889 1.5079 1.2012 1.0404-.799 1.4278-2.1144 1.4278-2.924 0-1.2212-1.583.6402-3.5413.6485-1.4686-.0061-2.7266-1.0558-3.2639-1.0645zM4.312 14.4768c.5792.365 1.6964 2.2751 2.1056 3.0177.1371.2488.371.3536.582.3536.4188 0 .7465-.4138.0391-.9395-1.0636-.791-.6914-2.0846-.1836-2.1642a.4302.4302 0 0 1 .0664-.004c.4616 0 .666.7892.666.7892s.5959 1.4898 1.6213 2.508c.942.9356 1.062 1.703.4961 2.6661-.0164-.004-.0159.0236-.1484.2149-.1853.2673-.4322.4688-.7188.6152-.5062.2269-1.1397.2696-1.7833.2696-1.037 0-2.1017-.1824-2.6975-.336-.0293-.0075-3.6505-.9567-3.1916-1.8224.0771-.1454.2033-.2031.3633-.2031.6463 0 1.823.9551 2.3283.9551.113 0 .196-.0865.2285-.2031.2249-.8045-3.2787-1.0522-2.9846-2.1642.0519-.1967.193-.2757.3907-.2754.854 0 2.7704 1.4923 3.172 1.4923.0307 0 .0525-.0085.0645-.0274.2012-.3227.1096-.5865-1.3087-1.4395-1.4182-.8533-2.4315-1.329-1.8653-1.9416.0651-.0707.1574-.1015.2695-.1015.8611.0002 2.8948 1.84 2.8948 1.84s.5487.5683.8809.5683c.0762 0 .1416-.0315.1855-.1054.2355-.3946-2.1858-2.2183-2.3224-2.971-.0926-.51.0641-.7676.3555-.7676-.0006.008.1701-.0285.4942.1759zm16.2257.5918c-.1366.7526-2.5579 2.5764-2.3224 2.9709.044.074.1092.1055.1855.1055.3321 0 .881-.5684.881-.5684s2.0336-1.8397 2.8947-1.84c.1121 0 .2044.0308.2695.1016.5662.6125-.447 1.0882-1.8653 1.9415-1.4183.853-1.51 1.1168-1.3087 1.4396.012.0188.0337.0273.0644.0273.4016 0 2.3181-1.4923 3.1721-1.4923.1977-.0002.3388.0787.3907.2754.294 1.112-3.2095 1.3597-2.9846 2.1642.0325.1166.1156.2032.2285.2032.5054 0 1.682-.9552 2.3283-.9552.16 0 .2862.0577.3633.2032.459.8656-3.1623 1.8149-3.1916 1.8224-.5958.1535-1.6605.336-2.6975.336-.6351 0-1.261-.0409-1.7638-.2599-.2949-.1472-.5488-.3516-.7383-.625-.0411-.0682-.1026-.1476-.1426-.205-.5726-.9679-.455-1.7371.4903-2.676 1.0254-1.0182 1.6212-2.508 1.6212-2.508s.2044-.7891.666-.7891a.4318.4318 0 0 1 .0665.0039c.5078.0796.88 1.3732-.1836 2.1642-.7074.5257-.3797.9395.039.9395.211 0 .445-.1047.5821-.3535.4092-.7426 1.5264-2.6527 2.1056-3.0178.5588-.3524.99-.1816.8497.5918z" 
    },
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
            <svg 
              viewBox="0 0 24 24" 
              className="h-7 md:h-9 w-auto fill-current text-white opacity-90 shrink-0"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d={tech.iconPath} />
            </svg>
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
    <section id="pricing" className="py-20 md:py-24 px-4 max-w-6xl mx-auto w-full border-t border-white/10">
      <motion.div {...fadeUp(0.1)} className="text-center mb-16 md:mb-24">
        <span className="text-xs tracking-[3px] uppercase text-muted-foreground font-semibold inline-block mb-4">
          SUBSCRIPTIONS
        </span>
        <h2 className="text-[clamp(32px,5vw,56px)] leading-[1] tracking-[-1.5px] font-medium mb-6">
          Simple <span className="font-serif italic font-normal text-muted-foreground">Pricing</span> Plans
        </h2>

        <div className="flex items-center justify-center gap-4 mt-6">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 w-full max-w-5xl mx-auto overflow-visible mt-2">
        {plans.map((plan, i) => (
          <motion.div 
            key={plan.name} 
            {...fadeUp(0.2 + i * 0.1)} 
            className={cn(
              "relative rounded-[24px] p-6 md:p-8 flex flex-col h-full group overflow-hidden transition-all duration-500",
              plan.popular ? "bg-white/[0.04] border border-white/20 hover:border-white/40 hover:shadow-[0_0_40px_rgba(255,255,255,0.05)] scale-100 md:scale-[1.02] z-10" : "liquid-glass hover:bg-white/[0.03]"
            )}
          >
            {/* Animated Hover Glow Background */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {plan.popular && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 overflow-hidden liquid-glass text-white text-[10px] font-bold px-5 py-1.5 rounded-b-xl uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md border hover:border-white/20 border-white/10 transition-colors z-20">
                  <motion.div 
                    className="absolute inset-0 w-[200%] h-full bg-gradient-to-r from-transparent via-white/[0.3] to-transparent -translate-x-full pointer-events-none"
                    animate={{ translateX: ["-100%", "100%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  Most Popular
                </div>
            )}
            
            <div className={cn(
              "mb-6 p-4 rounded-2xl w-fit transition-all duration-500 group-hover:scale-110 relative z-10",
              plan.popular ? "bg-white/10 shadow-[0_0_20px_rgba(255,255,255,0.1)]" : "liquid-glass group-hover:bg-white/10 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.1)]"
            )}>
              {plan.icon}
            </div>
            
            <h3 className="text-xl md:text-2xl font-semibold mb-2 relative z-10">{plan.name}</h3>
            <p className="text-muted-foreground text-[13px] md:text-sm font-medium h-10 relative z-10">{plan.desc}</p>
            <div className="flex items-center gap-1 mb-6 mt-1 border-b border-white/10 pb-6 relative z-10">
              <div className="text-3xl md:text-5xl font-bold tracking-tight bg-white/[0.03] px-4 py-2 rounded-xl border border-white/5 text-foreground">
                <AnimatedCounter value={isYearly ? (plan.priceNum === 0 ? 0 : plan.priceNum * 10) : plan.priceNum} prefix={plan.pricePrefix} />
              </div>
              <span className="text-muted-foreground text-sm font-medium ml-2">{isYearly ? "/year" : plan.period}</span>
            </div>
            
            <ul className="flex flex-col gap-3 md:gap-4 mb-8 flex-1 relative z-10">
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

  export default function LandingPage() {
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
