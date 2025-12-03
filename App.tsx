
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Sparkles, Globe, Eye, Moon, Star, Menu, X, Calendar, ChevronLeft, ChevronRight, Gem, CheckCircle2, User as UserIcon, LayoutDashboard, Lock, ArrowRight, Layers, MessageCircle, Quote } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ArtistCard from './components/ArtistCard';
import AIChat from './components/AIChat';
import AuthModal from './components/AuthModal';
import Dashboard from './components/Dashboard';
import { Psychic, User, Booking, Message } from './types';

// Dummy Data with Individual Pricing
const PSYCHICS: Psychic[] = [
  { 
    id: '1', 
    name: 'Madame Void', 
    specialty: 'Akashic Records', 
    availability: 'AVAILABLE', 
    deepDivePrice: 150,
    image: 'https://images.unsplash.com/photo-1576504677634-06b2130bd1f3?q=80&w=1000&auto=format&fit=crop',
    description: 'A conduit to the ethereal library of your soul. Madame Void accesses the Akashic Records to reveal your past lives and future timelines.'
  },
  { 
    id: '2', 
    name: 'Star Weaver', 
    specialty: 'Astrology', 
    availability: 'BOOKING FAST', 
    deepDivePrice: 180,
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop',
    description: 'Decoding the celestial language of the cosmos. Star Weaver maps the alignment of planets at your birth to unlock your true potential.'
  },
  { 
    id: '3', 
    name: 'Orion Black', 
    specialty: 'Tarot Master', 
    availability: 'AVAILABLE', 
    deepDivePrice: 120,
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=1000&auto=format&fit=crop',
    description: 'With a deck ancient as time, Orion unveils the hidden truths of your present and the branching paths of your destiny.',
    tarotSpreads: [
      { name: 'Celtic Cross (10 Cards)', price: 45 },
      { name: 'Past, Present, Future', price: 30 },
      { name: 'Lovers Alignment', price: 60 }
    ]
  },
  { 
    id: '4', 
    name: 'Lyra Mist', 
    specialty: 'Aura Reader', 
    availability: 'WAITLIST', 
    deepDivePrice: 200,
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1000&auto=format&fit=crop',
    description: 'Seeing beyond the physical. Lyra perceives the colors of your energy field, identifying blockages and illuminating your vibrational strengths.',
    tarotSpreads: [
      { name: 'Energy Blockage Spread', price: 55 },
      { name: 'Chakra Alignment Cards', price: 50 }
    ]
  },
  { 
    id: '5', 
    name: 'Nova Sage', 
    specialty: 'Crystal Scrying', 
    availability: 'AVAILABLE', 
    deepDivePrice: 110,
    image: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=1000&auto=format&fit=crop',
    description: 'Gazing into the quartz depths to find clarity in chaos. Nova provides actionable guidance through the resonance of ancient stones.',
    tarotSpreads: [
      { name: 'Crystal Clarity Spread', price: 40 },
      { name: 'Year Ahead Forecast', price: 80 }
    ]
  },
  { 
    id: '6', 
    name: 'Luna Tide', 
    specialty: 'Dream Walker', 
    availability: 'AVAILABLE', 
    deepDivePrice: 140,
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1000&auto=format&fit=crop',
    description: 'Interpreter of the subconscious realm. Luna guides you through the symbolism of your dreams to unlock deep psychological healing.'
  },
  { 
    id: '7', 
    name: 'Seraphina Rose', 
    specialty: 'Love Alchemist', 
    availability: 'BOOKING FAST', 
    deepDivePrice: 160,
    image: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=1000&auto=format&fit=crop',
    description: 'Specializing in matters of the heart. Seraphina uses rose quartz frequencies and connection charts to heal relationships and attract soulmates.',
    tarotSpreads: [
      { name: 'Twin Flame Check', price: 75 },
      { name: 'Heart Healing Spread', price: 60 }
    ]
  },
  { 
    id: '8', 
    name: 'Atlas Stone', 
    specialty: 'Rune Caster', 
    availability: 'AVAILABLE', 
    deepDivePrice: 130,
    image: 'https://images.unsplash.com/photo-1504257432389-52343af06ae3?q=80&w=1000&auto=format&fit=crop',
    description: 'Grounded in ancient earth magic. Atlas casts elder futhark runes to provide concrete, stoic advice for career and stability.'
  },
  { 
    id: '9', 
    name: 'Solara Gold', 
    specialty: 'Energy Healer', 
    availability: 'AVAILABLE', 
    deepDivePrice: 175,
    image: 'https://images.unsplash.com/photo-1618151313441-bc79b11e5090?q=80&w=1000&auto=format&fit=crop',
    description: 'Channeling the central sun. Solara clears heavy cosmic debris from your spirit, leaving you feeling lighter, radiant, and re-energized.'
  },
  { 
    id: '10', 
    name: 'Zephyr Wind', 
    specialty: 'Pet Intuitive', 
    availability: 'LIMITED', 
    deepDivePrice: 115,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop',
    description: 'A voice for the voiceless. Zephyr connects telepathically with your animal companions to resolve behavioral issues and deepen your bond.'
  }
];

const SERVICES = [
  { 
    id: 'deep_dive',
    name: 'Deep Dive Analysis', 
    price: 'Varies', 
    priceNote: 'Depends on Guide',
    color: 'white', 
    accent: 'bg-white/5',
    requiresGuide: true,
    description: "A complete natal chart analysis revealing your Cosmic Trinity (Sun, Moon, Rising). Understand your elemental signature, planetary influences, and chart ruler."
  },
  { 
    id: 'tarot',
    name: 'Tarot Spread', 
    price: 'Varies', 
    priceNote: 'Choose Your Spread',
    color: 'teal', 
    accent: 'bg-fuchsia-500/10 border-fuchsia-500/50',
    requiresGuide: true,
    description: "Connect with specific guides for tailored card readings. From Celtic Cross to Love Alignment, find the spread that resonates with your specific query."
  },
  { 
    id: 'soul',
    name: 'Soul Blueprint', 
    price: '$199', 
    color: 'periwinkle', 
    accent: 'bg-indigo-500/10 border-indigo-500/50',
    requiresGuide: false,
    description: "The ultimate path to self-discovery. Receive a master guide to your karmic purpose, life lessons, and hidden potential with ongoing support."
  },
];

const TESTIMONIALS = [
  {
    id: 1,
    name: "Elena R.",
    role: "Scorpio Sun",
    service: "Tarot Spread",
    quote: "Orion's reading was terrifyingly accurate. He mentioned a 'tower moment' and two days later, my career shifted entirely. Best $45 I ever spent.",
    rating: 5
  },
  {
    id: 2,
    name: "Marcus T.",
    role: "Capricorn Rising",
    service: "Deep Dive Analysis",
    quote: "I never understood why I felt so conflicted until Star Weaver explained my square aspect. The transcript is now my daily guide.",
    rating: 5
  },
  {
    id: 3,
    name: "Sarah J.",
    role: "Pisces Moon",
    service: "Soul Blueprint",
    quote: "Madame Void accessed records I didn't even know existed. The daily chat feature helped me integrate the lessons over the week.",
    rating: 5
  }
];

// Helper to define categories for the Wisdom section
const WISDOM_CATEGORIES = {
  natal: {
    id: 'natal',
    title: 'Natal Chart Specialists',
    filter: (p: Psychic) => ['Astrology', 'Akashic Records', 'Love Alchemist'].includes(p.specialty),
    description: 'Masters of planetary alignment and soul records.'
  },
  thirdeye: {
    id: 'thirdeye',
    title: 'Third Eye & Psychic Guides',
    filter: (p: Psychic) => ['Tarot Master', 'Aura Reader', 'Crystal Scrying', 'Rune Caster', 'Pet Intuitive'].includes(p.specialty),
    description: 'Seers who perceive beyond the veil.'
  },
  lunar: {
    id: 'lunar',
    title: 'Lunar & Energy Healing',
    filter: (p: Psychic) => ['Dream Walker', 'Energy Healer'].includes(p.specialty),
    description: 'Guides for moon rituals, dreams, and energetic clearing.'
  }
};

interface GuideSelectorContext {
  title: string;
  description?: string;
  filter: (p: Psychic) => boolean;
  serviceId: string; // The service ID to pass to booking
}

// Personality helper for simulated chat
const getGuideResponse = (guideName: string, messageCount: number): string => {
  if (messageCount > 0) return "I need a moment to meditate on this new layer of information. The energy is shifting.";
  
  const responses: Record<string, string[]> = {
    'Madame Void': [
      "I am sensing a timeline divergence in your past life that echoes into this moment. What do you feel when you look at the color blue?",
      "The Records are showing me a contract you signed long ago. We need to clear this. How has your sleep been lately?"
    ],
    'Star Weaver': [
      "Your Saturn return is creating some friction here, but it is for your growth. Are you feeling restricted in your career?",
      "Mercury is dancing with your natal moon. This explains the emotional tides you've been surfing. Tell me about your dreams this week."
    ],
    'Orion Black': [
      "The Tower card fell out while I was shuffling for you. Don't be alarmed—it means necessary change. What are you holding onto too tightly?",
      "I see the Queen of Cups offering you a gift. Someone close to you has deep feelings they haven't spoken. Does this resonate?"
    ],
    'Seraphina Rose': [
      "Oh, darling, I feel a flutter in your heart chakra. Someone is thinking of you right now. Do you feel a sudden warmth?",
      "Love is trying to enter, but there is a wall of fear. Let's gently dissolve that. Who hurt you three years ago?"
    ],
    'Atlas Stone': [
      "The runes have landed in the shape of 'Jera' - harvest. Patience is required, but the reward is coming. Stand your ground.",
      "I see a mountain in your path. You must climb it, not go around it. What is the hardest thing you are avoiding?"
    ],
    'Zephyr Wind': [
      "Your furry friend is showing me an image of a red ball. They miss playing! They also sense your anxiety. Have you been stressed?",
      "Animals are mirrors. Your pet is acting out because they are absorbing your grief. Let's clear that energy for both of you."
    ],
    'Luna Tide': [
      "The water element is strong in your chart today. Flow with the emotions, do not build a dam. What makes you want to cry tears of joy?",
      "I dreamt of you before you booked. A silver owl was watching you. Wisdom is coming in the silence of the night."
    ]
  };

  const specificResponses = responses[guideName];
  if (specificResponses) {
    return specificResponses[Math.floor(Math.random() * specificResponses.length)];
  }

  return "I feel a strong resonance with your energy field. Please, tell me more about what brought you to me today. My intuition tells me there is more beneath the surface.";
};

const App: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<Psychic | null>(null);
  
  // Auth & User State
  const [user, setUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Booking State
  const [guideSelectorContext, setGuideSelectorContext] = useState<GuideSelectorContext | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [lastBookedService, setLastBookedService] = useState<string>('');

  // Handle keyboard navigation for artist modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedArtist) return;
      if (e.key === 'ArrowLeft') navigateArtist('prev');
      if (e.key === 'ArrowRight') navigateArtist('next');
      if (e.key === 'Escape') setSelectedArtist(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedArtist]);

  const handlePurchaseClick = (serviceId: string) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    // Deep Dive requires picking a guide generally
    if (serviceId === 'deep_dive') {
      setGuideSelectorContext({
        title: 'Select Your Guide',
        filter: () => true, // All guides
        serviceId: 'deep_dive'
      });
    } else if (serviceId === 'tarot') {
      setGuideSelectorContext({
        title: 'Select Tarot Oracle',
        description: 'Choose a guide to view their exclusive spreads',
        filter: (p) => !!p.tarotSpreads && p.tarotSpreads.length > 0,
        serviceId: 'tarot'
      });
    } else {
      // Simulate generic purchase (or auto-assign guide)
      processBooking(serviceId, PSYCHICS[0]); 
    }
  };

  const handleWisdomFeatureClick = (categoryKey: keyof typeof WISDOM_CATEGORIES) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    const category = WISDOM_CATEGORIES[categoryKey];
    setGuideSelectorContext({
      title: category.title,
      description: category.description,
      filter: category.filter,
      serviceId: `wisdom_${categoryKey}` // Custom service ID for tracking
    });
  };

  const processBooking = (serviceId: string, guide: Psychic, customVariant?: { name: string, price: number }) => {
    setProcessingPayment(true);
    
    // Simulate API call
    setTimeout(() => {
      // Determine price
      let price = guide.deepDivePrice;
      let serviceName = SERVICES.find(s => s.id === serviceId)?.name || 'Reading';

      // Custom variant logic (e.g. specific tarot spread)
      if (customVariant) {
        price = customVariant.price;
        serviceName = `${serviceName}: ${customVariant.name}`;
      } else {
        // Fallback or generic logic
        if (serviceId === 'soul') price = 199;
        
        if (!SERVICES.find(s => s.id === serviceId)) {
          // Map wisdom categories to names
          if (serviceId.includes('natal')) serviceName = 'Natal Chart Mapping';
          else if (serviceId.includes('thirdeye')) serviceName = 'Third Eye Awakening';
          else if (serviceId.includes('lunar')) serviceName = 'Lunar Phase Ritual';
          else serviceName = 'Deep Dive Analysis';
        }
      }
      
      const newBooking: Booking = {
        id: Math.random().toString(36).substr(2, 9),
        serviceName: serviceName,
        guideId: guide.id,
        guideName: guide.name,
        price: price,
        status: 'aligning', // aka in_progress
        purchaseDate: Date.now(),
        messages: []
      };

      setBookings(prev => [newBooking, ...prev]);
      setProcessingPayment(false);
      setGuideSelectorContext(null); // Close modal
      setLastBookedService(serviceName);
      setShowConfirmation(true);

      // Simulate guide working on chart (Completion after 10s)
      setTimeout(() => {
        setBookings(prev => prev.map(b => 
          b.id === newBooking.id ? { ...b, status: 'complete' } : b
        ));
      }, 10000);

    }, 2000);
  };

  const handleSendMessage = (bookingId: string, text: string) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      timestamp: Date.now()
    };
    
    // Add user message
    setBookings(prev => prev.map(b => 
      b.id === bookingId ? { ...b, messages: [...b.messages, newMessage] } : b
    ));

    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    // Simulate Guide Reply with "typing" delay and personalized logic
    const responseTime = Math.random() * 2000 + 2000; // 2-4 seconds
    setTimeout(() => {
      // Calculate how many messages user has sent to determine flow
      const userMessageCount = booking.messages.filter(m => m.sender === 'user').length;
      const responseText = getGuideResponse(booking.guideName, userMessageCount);

      const reply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'guide',
        text: responseText,
        timestamp: Date.now()
      };
      setBookings(prev => prev.map(b => 
        b.id === bookingId ? { ...b, messages: [...b.messages, reply] } : b
      ));
    }, responseTime);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateArtist = (direction: 'next' | 'prev') => {
    if (!selectedArtist) return;
    const currentIndex = PSYCHICS.findIndex(a => a.id === selectedArtist.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % PSYCHICS.length;
    } else {
      nextIndex = (currentIndex - 1 + PSYCHICS.length) % PSYCHICS.length;
    }
    setSelectedArtist(PSYCHICS[nextIndex]);
  };
  
  return (
    <div className="relative min-h-screen text-white selection:bg-fuchsia-500 selection:text-white cursor-none overflow-x-hidden">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-6 md:px-8 py-6 mix-blend-difference">
        <div className="font-heading text-xl md:text-2xl font-bold tracking-tighter text-white cursor-default z-50">CELESTIA</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-sm font-bold tracking-widest uppercase items-center">
          {['Oracles', 'Wisdom', 'Bookings'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-fuchsia-300 transition-colors text-white cursor-none bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
          
          {user ? (
            <button 
              onClick={() => setShowDashboard(true)}
              className="flex items-center gap-2 text-fuchsia-300 hover:text-white transition-colors cursor-none"
              data-hover="true"
            >
              <LayoutDashboard className="w-4 h-4" />
              My Void
            </button>
          ) : (
            <button 
              onClick={() => setShowAuthModal(true)}
              className="flex items-center gap-2 text-white hover:text-fuchsia-300 transition-colors cursor-none"
              data-hover="true"
            >
              <UserIcon className="w-4 h-4" />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center cursor-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-30 bg-[#1e1b4b]/95 backdrop-blur-xl flex flex-col items-center justify-center gap-8 md:hidden"
          >
            {['Oracles', 'Wisdom', 'Bookings'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-4xl font-heading font-bold text-white hover:text-fuchsia-400 transition-colors uppercase bg-transparent border-none cursor-none"
              >
                {item}
              </button>
            ))}
             {user ? (
                <button onClick={() => { setShowDashboard(true); setMobileMenuOpen(false); }} className="text-xl font-bold text-fuchsia-300 uppercase cursor-none">My Void</button>
             ) : (
                <button onClick={() => { setShowAuthModal(true); setMobileMenuOpen(false); }} className="text-xl font-bold text-white uppercase cursor-none">Login</button>
             )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[100svh] min-h-[600px] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl pb-24 md:pb-20"
        >
           {/* Date / Location */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-3 md:gap-6 text-xs md:text-base font-mono text-fuchsia-200 tracking-[0.2em] md:tracking-[0.3em] uppercase mb-4 bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm"
          >
            <span>The Void</span>
            <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-fuchsia-500 rounded-full animate-pulse"/>
            <span>Always Open</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text="CELESTIA" 
              as="h1" 
              className="text-[14vw] md:text-[13vw] leading-[0.9] font-black tracking-tighter text-center" 
            />
            {/* Optimized Orb - Reduced Blur for Performance */}
            <motion.div 
               className="absolute -z-20 w-[50vw] h-[50vw] bg-fuchsia-500/10 blur-[60px] rounded-full pointer-events-none will-change-transform"
               animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.3, 0.6, 0.3] }}
               transition={{ duration: 6, repeat: Infinity }}
               style={{ transform: 'translateZ(0)' }}
            />
          </div>
          
          <motion.div
             initial={{ scaleX: 0 }}
             animate={{ scaleX: 1 }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="w-full max-w-md h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent mt-4 md:mt-8 mb-6 md:mb-8"
          />

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="text-base md:text-2xl font-light max-w-xl mx-auto text-white/90 leading-relaxed drop-shadow-lg px-4"
          >
            Unlock the universe within through ancient wisdom
          </motion.p>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-12 md:bottom-16 left-0 w-full py-4 md:py-6 bg-white text-black z-20 overflow-hidden border-y-4 border-black shadow-[0_0_40px_rgba(255,255,255,0.4)]">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
          >
            {/* Duplicate content for seamless loop */}
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(4)].map((_, i) => (
                  <span key={i} className="text-3xl md:text-7xl font-heading font-black px-8 flex items-center gap-4">
                    ASTROLOGY <span className="text-fuchsia-600 text-2xl md:text-4xl">★</span> 
                    TAROT <span className="text-fuchsia-600 text-2xl md:text-4xl">★</span> 
                    CLAIRVOYANCE <span className="text-fuchsia-600 text-2xl md:text-4xl">★</span>
                    MEDIUMSHIP <span className="text-fuchsia-600 text-2xl md:text-4xl">★</span>
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* LINEUP (ORACLES) SECTION */}
      <section id="oracles" className="relative z-10 py-20 md:py-32">
        <div className="max-w-[1600px] mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 px-4">
             <h2 className="text-5xl md:text-8xl font-heading font-bold uppercase leading-[0.9] drop-shadow-lg break-words w-full md:w-auto">
              Our <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 to-indigo-400">Guides</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10 bg-black/20 backdrop-blur-sm">
            {PSYCHICS.map((artist) => (
              <ArtistCard key={artist.id} artist={artist} onClick={() => setSelectedArtist(artist)} />
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE (WISDOM) SECTION */}
      <section id="wisdom" className="relative z-10 py-20 md:py-32 bg-[#0f0c29]/40 backdrop-blur-sm border-t border-white/10 overflow-hidden">
        {/* Decorative blurred circle */}
        <div className="absolute top-1/2 right-[-20%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[60px] pointer-events-none will-change-transform" style={{ transform: 'translateZ(0)' }} />

        <div className="max-w-7xl mx-auto px-4 md:px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-4xl md:text-7xl font-heading font-bold mb-6 md:mb-8 leading-tight">
                Cosmic <br/> <GradientText text="TRUTHS" className="text-5xl md:text-8xl" />
              </h2>
              <p className="text-lg md:text-xl text-gray-200 mb-8 md:mb-12 font-light leading-relaxed drop-shadow-md">
                We combine ancient esoteric traditions with modern intuition. Our realm is designed to help you navigate the stars and find your true north.
              </p>
              
              <div className="space-y-6 md:space-y-8">
                {[
                  { id: 'natal', icon: Globe, title: 'Natal Chart Mapping', desc: 'Precise planetary alignments at your birth.', category: 'natal' },
                  { id: 'thirdeye', icon: Eye, title: 'Third Eye Awakening', desc: 'Techniques to enhance your own intuition.', category: 'thirdeye' },
                  { id: 'lunar', icon: Moon, title: 'Lunar Phase Rituals', desc: 'Sync your life with the cycles of the moon.', category: 'lunar' },
                ].map((feature, i) => (
                  <motion.button
                    key={i} 
                    whileHover={{ scale: 1.02, x: 10 }}
                    onClick={() => handleWisdomFeatureClick(feature.category as any)}
                    className="flex items-start gap-6 w-full text-left group bg-transparent border-none p-0 cursor-none"
                    data-hover="true"
                  >
                    <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/5 group-hover:bg-fuchsia-500/20 group-hover:border-fuchsia-500/50 transition-colors">
                      <feature.icon className="w-6 h-6 text-fuchsia-300 group-hover:text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg md:text-xl font-bold mb-1 md:mb-2 font-heading group-hover:text-fuchsia-300 transition-colors">{feature.title}</h4>
                      <p className="text-sm text-gray-300 group-hover:text-white/80 transition-colors">{feature.desc}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative h-[400px] md:h-[700px] w-full order-1 lg:order-2">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-fuchsia-500 rounded-3xl rotate-3 opacity-30 blur-xl" />
              <div className="relative h-full w-full rounded-3xl overflow-hidden border border-white/10 group shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=1000&auto=format&fit=crop" 
                  alt="Crystal Ball" 
                  className="h-full w-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 will-change-transform" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
                  <div className="text-5xl md:text-8xl font-heading font-bold text-transparent bg-clip-text bg-gradient-to-b from-white to-white/0 opacity-50">
                    ∞
                  </div>
                  <div className="text-lg md:text-xl font-bold tracking-widest uppercase mt-2 text-white">
                    Infinite Possibilities
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKINGS SECTION */}
      <section id="bookings" className="relative z-10 py-20 md:py-32 px-4 md:px-6 bg-black/30 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 md:mb-20">
             <h2 className="text-5xl md:text-9xl font-heading font-bold opacity-20 text-white">
               DESTINY
             </h2>
             <p className="text-fuchsia-300 font-mono uppercase tracking-widest -mt-3 md:-mt-8 relative z-10 text-sm md:text-base">
               Choose your path
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SERVICES.map((ticket, i) => {
              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -20 }}
                  className={`relative p-8 md:p-10 border border-white/10 backdrop-blur-md flex flex-col min-h-[450px] md:min-h-[550px] transition-colors duration-300 ${ticket.accent} will-change-transform`}
                  data-hover="true"
                >
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  
                  <div className="flex-1">
                    <h3 className="text-2xl md:text-3xl font-heading font-bold mb-4 text-white">{ticket.name}</h3>
                    <div className={`text-4xl md:text-5xl font-bold mb-2 tracking-tighter ${ticket.color === 'white' ? 'text-white' : ticket.color === 'teal' ? 'text-fuchsia-400' : 'text-indigo-400'}`}>
                      {ticket.price}
                    </div>
                     {ticket.priceNote && (
                        <p className="text-xs text-white/50 uppercase tracking-wider mb-4">{ticket.priceNote}</p>
                     )}
                     
                     <p className="text-sm text-gray-300 mb-6 leading-relaxed opacity-80">{ticket.description}</p>
                    
                    <ul className="space-y-4 md:space-y-6 text-sm text-gray-200 mt-4">
                      <li className="flex items-center gap-3"><Star className="w-5 h-5 text-gray-400" /> Digital Transcript</li>
                      <li className="flex items-center gap-3"><Gem className="w-5 h-5 text-gray-400" /> 1-on-1 Session</li>
                      
                      {/* Soul Blueprint (Index 2) or custom check for 'soul' gets Daily Chat */}
                      {ticket.id === 'soul' ? (
                        <li className="flex items-center gap-3 text-white"><MessageCircle className={`w-5 h-5 text-fuchsia-300`} /> Daily Chat Access</li>
                      ) : (i > 0 && 
                        <li className="flex items-center gap-3 text-white"><Sparkles className={`w-5 h-5 text-fuchsia-300`} /> 3 Follow-up Questions</li>
                      )}
                      
                      {i > 1 && <li className="flex items-center gap-3 text-white"><Globe className={`w-5 h-5 text-indigo-400`} /> Lifetime Access</li>}
                      {ticket.requiresGuide && <li className="flex items-center gap-3 text-yellow-200"><UserIcon className={`w-5 h-5`} /> Choose Specific Guide</li>}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchaseClick(ticket.id)}
                    className={`w-full py-4 text-sm font-bold uppercase tracking-[0.2em] border border-white/20 transition-all duration-300 mt-8 group overflow-hidden relative cursor-none text-white hover:bg-white hover:text-black`}
                  >
                    <span className="relative z-10">
                      Purchase
                    </span>
                    <div className="absolute inset-0 bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300 ease-out -z-0" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section id="testimonials" className="relative z-10 py-20 bg-gradient-to-t from-[#050314] to-transparent">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4">Cosmic Echoes</h2>
            <div className="w-24 h-1 bg-fuchsia-500 mx-auto rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <motion.div
                key={t.id}
                whileHover={{ y: -10 }}
                className="bg-white/5 border border-white/10 p-8 rounded-2xl relative backdrop-blur-md group hover:bg-white/10 transition-colors"
              >
                <Quote className="w-10 h-10 text-fuchsia-500/30 absolute top-6 right-6" />
                
                <div className="mb-6">
                  <div className="flex gap-1 mb-2">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-300 italic leading-relaxed relative z-10">"{t.quote}"</p>
                </div>
                
                <div className="flex items-center gap-3 pt-6 border-t border-white/5">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-fuchsia-300 uppercase tracking-wider">{t.role}</div>
                  </div>
                </div>
                <div className="absolute bottom-4 right-6 text-[10px] text-gray-500 uppercase tracking-widest">{t.service}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/10 py-12 md:py-16 bg-black/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
             <div className="font-heading text-3xl md:text-4xl font-bold tracking-tighter mb-4 text-white">CELESTIA</div>
             <div className="flex gap-2 text-xs font-mono text-gray-400">
               <span>© 2025 Celestia Oracles</span>
             </div>
          </div>
          
          <div className="flex gap-6 md:gap-8 flex-wrap">
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-none" data-hover="true">
              Instagram
            </a>
            <a href="#" className="text-gray-400 hover:text-white font-bold uppercase text-xs tracking-widest transition-colors cursor-none" data-hover="true">
              Twitter
            </a>
          </div>
        </div>
      </footer>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={showAuthModal} 
        onClose={() => setShowAuthModal(false)}
        onLogin={(newUser) => {
          setUser(newUser);
          setShowDashboard(true);
        }}
      />
      
      {/* Dashboard Modal */}
      {user && (
        <Dashboard 
          isOpen={showDashboard}
          onClose={() => setShowDashboard(false)}
          user={user}
          bookings={bookings}
          onSendMessage={handleSendMessage}
        />
      )}

      {/* Unified Guide Selector Modal */}
      <AnimatePresence>
        {guideSelectorContext && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg cursor-none"
             onClick={() => setGuideSelectorContext(null)}
          >
             <motion.div
               initial={{ y: 20 }}
               animate={{ y: 0 }}
               onClick={(e) => e.stopPropagation()}
               className="bg-[#1e1b4b] border border-white/20 p-8 max-w-4xl w-full max-h-[85vh] overflow-y-auto rounded-2xl relative shadow-2xl shadow-indigo-900/50"
             >
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-3xl font-heading font-bold uppercase">{guideSelectorContext.title}</h2>
                  <button onClick={() => setGuideSelectorContext(null)} className="p-2 hover:bg-white/10 rounded-full" data-hover="true"><X /></button>
                </div>
                {guideSelectorContext.description && (
                  <p className="text-indigo-300 font-mono text-sm uppercase tracking-wider mb-8">{guideSelectorContext.description}</p>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {PSYCHICS.filter(guideSelectorContext.filter).map(p => (
                    <div key={p.id} className="p-6 border border-white/10 bg-black/30 hover:bg-white/5 rounded-xl transition-colors flex flex-col gap-4 group">
                       <div className="flex gap-4 items-center">
                         <img src={p.image} className="w-20 h-20 object-cover rounded-full border border-white/20" alt={p.name} />
                         <div>
                           <h3 className="font-bold text-xl">{p.name}</h3>
                           <p className="text-xs text-fuchsia-400 uppercase tracking-widest">{p.specialty}</p>
                         </div>
                       </div>
                       
                       <p className="text-sm text-gray-400 line-clamp-2">{p.description}</p>
                       
                       {/* Contextual Purchase Options */}
                       {guideSelectorContext.serviceId === 'tarot' && p.tarotSpreads ? (
                         <div className="mt-4 space-y-3">
                           <p className="text-xs font-bold uppercase tracking-widest text-indigo-300 mb-2 flex items-center gap-2">
                             <Layers className="w-3 h-3" /> Available Spreads
                           </p>
                           {p.tarotSpreads.map((spread, idx) => (
                             <div key={idx} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5 hover:border-fuchsia-500/50 transition-colors">
                               <div>
                                 <div className="text-sm font-bold text-white">{spread.name}</div>
                                 <div className="text-xs text-fuchsia-300 font-mono">${spread.price}</div>
                               </div>
                               <button 
                                 onClick={() => processBooking('tarot', p, spread)}
                                 className="px-3 py-1.5 bg-white text-black font-bold uppercase text-[10px] tracking-wider hover:bg-fuchsia-300 transition-colors rounded cursor-none"
                                 data-hover="true"
                               >
                                 Select
                               </button>
                             </div>
                           ))}
                         </div>
                       ) : (
                         <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-2">
                           <div className="text-2xl font-bold text-white">${p.deepDivePrice}</div>
                           <button 
                              onClick={() => processBooking(guideSelectorContext.serviceId, p)}
                              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-bold uppercase text-xs tracking-wider hover:bg-fuchsia-300 transition-colors rounded-lg cursor-none"
                              data-hover="true"
                           >
                             Purchase Now <ArrowRight className="w-4 h-4" />
                           </button>
                         </div>
                       )}
                    </div>
                  ))}
                  
                  {PSYCHICS.filter(guideSelectorContext.filter).length === 0 && (
                    <div className="col-span-2 text-center py-12 text-gray-500">
                      No guides specifically aligned with this frequency are currently available.
                    </div>
                  )}
                </div>
             </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Confirmation Modal */}
      <AnimatePresence>
        {showConfirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg cursor-none"
            onClick={() => setShowConfirmation(false)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md p-8 md:p-12 bg-[#1a103c] border border-fuchsia-500/30 overflow-hidden flex flex-col items-center text-center shadow-2xl shadow-fuchsia-900/50"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-fuchsia-900/20 to-transparent" />
              
              <motion.div 
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-fuchsia-500 to-indigo-500 flex items-center justify-center mb-6 shadow-lg shadow-fuchsia-500/40 z-10"
              >
                <CheckCircle2 className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="font-heading text-3xl md:text-4xl font-bold uppercase mb-2 text-white z-10 tracking-widest">
                Alignment Complete
              </h3>
              
              <p className="text-indigo-200 text-sm font-mono uppercase tracking-wider mb-6 z-10">
                The cosmos has received your request
              </p>
              
              <div className="w-full h-px bg-white/10 mb-6 z-10" />
              
              <div className="mb-8 z-10">
                <p className="text-gray-400 text-sm mb-1">Service Purchased</p>
                <p className="text-2xl font-bold text-white mb-2">{lastBookedService}</p>
              </div>
              
              <button
                onClick={() => { setShowConfirmation(false); setShowDashboard(true); }}
                className="px-8 py-3 bg-white text-black font-bold uppercase tracking-widest text-xs hover:bg-fuchsia-300 transition-colors z-10 cursor-none"
                data-hover="true"
              >
                Go to My Void
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Artist Detail Modal */}
      <AnimatePresence>
        {selectedArtist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedArtist(null)}
            className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md cursor-none"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-5xl bg-[#1e1b4b] border border-fuchsia-500/20 overflow-hidden flex flex-col md:flex-row shadow-2xl shadow-fuchsia-900/40 group/modal"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedArtist(null)}
                className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors cursor-none"
                data-hover="true"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Navigation Buttons */}
              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('prev'); }}
                className="absolute left-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm cursor-none"
                data-hover="true"
                aria-label="Previous Oracle"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={(e) => { e.stopPropagation(); navigateArtist('next'); }}
                className="absolute right-4 bottom-4 translate-y-0 md:top-1/2 md:bottom-auto md:-translate-y-1/2 z-20 p-3 rounded-full bg-black/50 text-white hover:bg-white hover:text-black transition-colors border border-white/10 backdrop-blur-sm md:right-8 cursor-none"
                data-hover="true"
                aria-label="Next Oracle"
              >
                <ChevronRight className="w-6 h-6" />
              </button>

              {/* Image Side */}
              <div className="w-full md:w-1/2 h-64 md:h-auto relative overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedArtist.id}
                    src={selectedArtist.image} 
                    alt={selectedArtist.name} 
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#1e1b4b] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-1/2 p-8 pb-24 md:p-12 flex flex-col justify-center relative">
                <motion.div
                  key={selectedArtist.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="flex items-center gap-3 text-fuchsia-400 mb-4">
                     <Calendar className="w-4 h-4" />
                     <span className="font-mono text-sm tracking-widest uppercase">{selectedArtist.availability}</span>
                  </div>
                  
                  <h3 className="text-4xl md:text-6xl font-heading font-bold uppercase leading-none mb-2 text-white">
                    {selectedArtist.name}
                  </h3>
                  
                  <p className="text-lg text-indigo-300 font-medium tracking-widest uppercase mb-6">
                    {selectedArtist.specialty}
                  </p>
                  
                  <div className="h-px w-20 bg-white/20 mb-6" />
                  
                  <p className="text-gray-300 leading-relaxed text-lg font-light mb-8">
                    {selectedArtist.description}
                  </p>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
