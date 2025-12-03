
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Clock, CheckCircle2, Send, Sparkles, Star, Moon, Sun, ArrowRight, Layers, Wallet, Receipt } from 'lucide-react';
import { Booking, User, Message } from '../types';

interface DashboardProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  bookings: Booking[];
  onSendMessage: (bookingId: string, text: string) => void;
}

// --- Astrology Helpers ---

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
];

const ELEMENTS = {
  Fire: ['Aries', 'Leo', 'Sagittarius'],
  Earth: ['Taurus', 'Virgo', 'Capricorn'],
  Air: ['Gemini', 'Libra', 'Aquarius'],
  Water: ['Cancer', 'Scorpio', 'Pisces']
};

const getSunSign = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  return 'Pisces';
};

// Simulation helpers for demonstration (Real app would need ephemeris library)
const getRandomSign = (seed: string) => {
  const index = (seed.length + Math.floor(Math.random() * 12)) % 12;
  return ZODIAC_SIGNS[index];
};

const getElement = (sign: string) => {
  if (ELEMENTS.Fire.includes(sign)) return 'Fire';
  if (ELEMENTS.Earth.includes(sign)) return 'Earth';
  if (ELEMENTS.Air.includes(sign)) return 'Air';
  return 'Water';
};

const getSignDescription = (sign: string, placement: 'Sun' | 'Moon' | 'Rising') => {
  const descriptions: Record<string, string> = {
    Sun: `Your core essence. In ${sign}, you shine through action, identity, and the pursuit of self-expression.`,
    Moon: `Your inner emotional world. In ${sign}, your needs are met through security, feelings, and instinctual reactions.`,
    Rising: `The mask you wear. With ${sign} rising, you approach the world with this specific energy and first impression.`
  };
  return descriptions[placement];
};

type ViewMode = 'readings' | 'history';

const Dashboard: React.FC<DashboardProps> = ({ isOpen, onClose, user, bookings, onSendMessage }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('readings');
  const [selectedBookingId, setSelectedBookingId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');

  const selectedBooking = bookings.find(b => b.id === selectedBookingId);

  // Auto-select first booking
  useEffect(() => {
    if (isOpen && bookings.length > 0 && !selectedBookingId) {
      setSelectedBookingId(bookings[0].id);
    }
  }, [isOpen, bookings, selectedBookingId]);

  const handleSend = () => {
    if (!messageInput.trim() || !selectedBookingId) return;
    onSendMessage(selectedBookingId, messageInput);
    setMessageInput('');
  };

  const handleViewTranscript = (id: string) => {
    setSelectedBookingId(id);
    setViewMode('readings');
  };

  // Generate Report Data Memoized
  const reportData = useMemo(() => {
    if (!user.birthDate) return null;
    
    const sun = getSunSign(user.birthDate);
    // Simulate Moon/Rising based on name/city hash to be consistent for the session
    const moon = getRandomSign(user.birthPlace || 'void'); 
    const rising = getRandomSign(user.name || 'seeker');
    
    return {
      sun,
      moon,
      rising,
      sunElement: getElement(sun),
      moonElement: getElement(moon),
      risingElement: getElement(rising)
    };
  }, [user.birthDate, user.birthPlace, user.name]);

  const getElementColor = (el: string) => {
    switch (el) {
      case 'Fire': return 'text-red-400';
      case 'Water': return 'text-blue-400';
      case 'Earth': return 'text-emerald-400';
      case 'Air': return 'text-yellow-200';
      default: return 'text-white';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-0 md:p-6 bg-black/90 backdrop-blur-xl"
        >
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="w-full h-full md:max-w-7xl md:h-[90vh] bg-[#0c0a24] border border-white/10 md:rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 z-50 p-2 bg-black/50 text-white rounded-full hover:bg-white hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Sidebar / List */}
            <div className="w-full md:w-1/4 bg-[#130f2e] border-r border-white/5 flex flex-col z-20">
              <div className="p-8 border-b border-white/5 bg-gradient-to-br from-[#130f2e] to-[#0c0a24]">
                <h2 className="font-heading text-2xl font-bold text-white mb-1">My Void</h2>
                <div className="flex items-center gap-2 mt-2 mb-4">
                   <div className="w-10 h-10 rounded-full bg-gradient-to-br from-fuchsia-600 to-indigo-600 flex items-center justify-center font-bold text-lg">
                      {user.name ? user.name[0].toUpperCase() : 'S'}
                   </div>
                   <div>
                      <p className="text-sm font-bold text-white">{user.name}</p>
                      <p className="text-xs text-fuchsia-400 font-mono uppercase">{getSunSign(user.birthDate)} Sun</p>
                   </div>
                </div>

                {/* View Toggle */}
                <div className="flex bg-black/40 rounded-lg p-1">
                  <button 
                    onClick={() => setViewMode('readings')}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${viewMode === 'readings' ? 'bg-fuchsia-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Readings
                  </button>
                  <button 
                    onClick={() => setViewMode('history')}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-wider rounded-md transition-colors ${viewMode === 'history' ? 'bg-indigo-600 text-white' : 'text-gray-400 hover:text-white'}`}
                  >
                    Wallet
                  </button>
                </div>
              </div>

              {viewMode === 'readings' && (
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest px-4 mb-2">Active Sessions</h3>
                  {bookings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      The void is empty.
                      <br />
                      Seek a guide to begin.
                    </div>
                  ) : (
                    bookings.map(booking => (
                      <button
                        key={booking.id}
                        onClick={() => setSelectedBookingId(booking.id)}
                        className={`w-full text-left p-4 rounded-xl transition-all border group relative overflow-hidden ${
                          selectedBookingId === booking.id 
                            ? 'bg-fuchsia-900/20 border-fuchsia-500/50' 
                            : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                      >
                        <div className="relative z-10">
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-white group-hover:text-fuchsia-300 transition-colors">{booking.guideName}</span>
                            {booking.status === 'complete' ? (
                              <CheckCircle2 className="w-4 h-4 text-green-400" />
                            ) : (
                              <Clock className="w-4 h-4 text-yellow-400 animate-pulse" />
                            )}
                          </div>
                          <div className="text-xs text-gray-300 mb-1">{booking.serviceName}</div>
                          <div className="text-[10px] font-mono text-fuchsia-300/50">
                             {new Date(booking.purchaseDate).toLocaleDateString()}
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
              
              {viewMode === 'history' && (
                <div className="flex-1 overflow-y-auto p-4">
                  <div className="text-center py-8 text-gray-400 text-xs">
                    <Wallet className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Select a transaction to view receipt</p>
                  </div>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col bg-[#050314] relative overflow-hidden">
              {/* Background ambiance */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/5 rounded-full blur-[100px] pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[100px] pointer-events-none" />

              {viewMode === 'history' ? (
                // --- HISTORY TABLE VIEW ---
                <div className="flex-1 flex flex-col p-8 z-10 overflow-hidden">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="font-heading text-2xl font-bold text-white flex items-center gap-3">
                      <Receipt className="w-6 h-6 text-fuchsia-400" />
                      Purchase History
                    </h3>
                  </div>
                  
                  <div className="bg-black/20 border border-white/10 rounded-2xl overflow-hidden flex-1 overflow-y-auto">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-white/5 text-gray-400 uppercase tracking-wider text-xs border-b border-white/10">
                        <tr>
                          <th className="p-4">Date</th>
                          <th className="p-4">Order ID</th>
                          <th className="p-4">Service</th>
                          <th className="p-4">Guide</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {bookings.map(b => (
                          <tr key={b.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 text-gray-300 font-mono">
                              {new Date(b.purchaseDate).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-fuchsia-300 font-mono">#{b.id.toUpperCase()}</td>
                            <td className="p-4 text-white font-bold">{b.serviceName}</td>
                            <td className="p-4 text-gray-300">{b.guideName}</td>
                            <td className="p-4 text-white">${b.price}</td>
                            <td className="p-4">
                              <button 
                                onClick={() => handleViewTranscript(b.id)}
                                className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded uppercase font-bold tracking-wider transition-colors"
                              >
                                View Transcript
                              </button>
                            </td>
                          </tr>
                        ))}
                        {bookings.length === 0 && (
                           <tr>
                             <td colSpan={6} className="p-8 text-center text-gray-500">No transactions found in this timeline.</td>
                           </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                // --- CHAT VIEW ---
                selectedBooking ? (
                  <>
                    {/* Header */}
                    <div className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-md bg-[#050314]/80 z-10">
                      <div>
                        <h3 className="font-heading text-xl text-white mb-1 flex items-center gap-2">
                          {selectedBooking.serviceName}
                          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-white/10 text-gray-300">#{selectedBooking.id.toUpperCase()}</span>
                        </h3>
                        <p className="text-sm text-gray-400">Oracle: <span className="text-fuchsia-300 font-bold">{selectedBooking.guideName}</span></p>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-8">
                      {/* Status: In Progress */}
                      {selectedBooking.status !== 'complete' ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-6 opacity-80 min-h-[400px]">
                          <div className="relative">
                            <div className="w-24 h-24 rounded-full border-2 border-fuchsia-500/30 border-t-fuchsia-500 animate-spin" />
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Sparkles className="w-8 h-8 text-fuchsia-400 animate-pulse" />
                            </div>
                          </div>
                          <div>
                            <h4 className="text-2xl font-heading font-bold text-white mb-2">Aligning Celestial Bodies</h4>
                            <p className="max-w-md text-gray-400 mx-auto leading-relaxed">
                              {selectedBooking.guideName} is currently calculating the planetary transits for {user.birthPlace}. 
                              We are mapping the exact position of the stars at the moment of your arrival.
                            </p>
                          </div>
                          <div className="flex gap-2 text-xs font-mono text-fuchsia-400 bg-fuchsia-900/10 px-4 py-2 rounded-full">
                             <Clock className="w-4 h-4" /> Estimated Wait: ~5 Seconds
                          </div>
                        </div>
                      ) : (
                        /* Status: Complete (Deep Dive Report) */
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                          
                          {/* 1. Guide Personal Note */}
                          <div className="bg-gradient-to-r from-[#1e1b4b] to-[#2e1065] border border-fuchsia-500/30 p-6 md:p-8 rounded-2xl relative overflow-hidden">
                             <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Sparkles className="w-32 h-32 text-white" />
                             </div>
                             <div className="relative z-10">
                                <h4 className="flex items-center gap-2 text-lg font-bold text-white mb-4 font-heading">
                                  <Sparkles className="w-5 h-5 text-fuchsia-400" />
                                  Oracle's Insight
                                </h4>
                                <p className="text-gray-200 leading-relaxed italic text-lg font-light">
                                  "Greetings, {user.name}. I have journeyed through your chart and the resonance is profound. 
                                  You were born under a {reportData?.sunElement} sun, suggesting a spirit driven by {reportData?.sunElement === 'Fire' ? 'passion' : reportData?.sunElement === 'Water' ? 'emotion' : reportData?.sunElement === 'Air' ? 'intellect' : 'structure'}. 
                                  Below is the detailed breakdown of your cosmic blueprint."
                                </p>
                                <div className="mt-4 text-right text-sm font-bold text-fuchsia-300">- {selectedBooking.guideName}</div>
                             </div>
                          </div>

                          {/* 2. The Big Three (Deep Dive Data) */}
                          {reportData && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              {[
                                { label: 'Sun Sign', sign: reportData.sun, element: reportData.sunElement, icon: Sun, desc: 'Your Identity & Ego', color: 'text-yellow-400' },
                                { label: 'Moon Sign', sign: reportData.moon, element: reportData.moonElement, icon: Moon, desc: 'Your Emotions & Soul', color: 'text-blue-300' },
                                { label: 'Rising Sign', sign: reportData.rising, element: reportData.risingElement, icon: ArrowRight, desc: 'Your Mask & Path', color: 'text-emerald-300' },
                              ].map((item, i) => (
                                <div key={i} className="bg-white/5 border border-white/5 p-6 rounded-xl hover:bg-white/10 transition-colors group">
                                  <div className="flex items-center justify-between mb-4">
                                    <div className={`p-3 rounded-lg bg-black/50 ${item.color}`}>
                                      <item.icon className="w-6 h-6" />
                                    </div>
                                    <span className={`text-xs font-bold uppercase tracking-widest ${getElementColor(item.element)}`}>
                                      {item.element}
                                    </span>
                                  </div>
                                  <h5 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{item.label}</h5>
                                  <div className="text-2xl font-heading font-bold text-white mb-2">{item.sign}</div>
                                  <p className="text-xs text-gray-400 leading-relaxed">
                                    {getSignDescription(item.sign, item.label.split(' ')[0] as any)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* 3. Detailed Elemental Analysis */}
                          <div className="bg-black/20 border border-white/10 p-6 md:p-8 rounded-2xl">
                            <h4 className="font-heading text-xl text-white mb-6 flex items-center gap-3">
                              <Layers className="w-5 h-5 text-indigo-400" />
                              Elemental Signature
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                               <div>
                                  <p className="text-gray-300 text-sm leading-7 mb-4">
                                    Your chart shows a dominant pull towards <strong>{reportData?.sunElement}</strong> energy. 
                                    This suggests that your primary mode of operating in the world is through 
                                    {reportData?.sunElement === 'Fire' ? ' intuition, action, and catalytic change.' : 
                                     reportData?.sunElement === 'Water' ? ' feeling, connection, and emotional depth.' :
                                     reportData?.sunElement === 'Air' ? ' intellect, communication, and social connection.' :
                                     ' sensation, stability, and practical application.'}
                                  </p>
                                  <p className="text-gray-300 text-sm leading-7">
                                    However, with your Moon in <strong>{reportData?.moon}</strong>, your emotional needs may sometimes conflict with your outward actions.
                                    Balancing these two forces is your life's core lesson.
                                  </p>
                               </div>
                               
                               <div className="space-y-4">
                                  {Object.entries(ELEMENTS).map(([el, signs]) => {
                                     const isDominant = el === reportData?.sunElement;
                                     return (
                                       <div key={el} className="relative">
                                         <div className="flex justify-between text-xs uppercase font-bold text-gray-400 mb-1">
                                           <span>{el}</span>
                                           <span>{isDominant ? '40%' : '20%'}</span>
                                         </div>
                                         <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                           <div 
                                             className={`h-full rounded-full ${isDominant ? 'bg-fuchsia-500' : 'bg-gray-600'}`} 
                                             style={{ width: isDominant ? '40%' : '20%' }}
                                           />
                                         </div>
                                       </div>
                                     )
                                  })}
                               </div>
                            </div>
                          </div>

                          {/* 4. Chat History */}
                          <div className="space-y-4 pt-8 border-t border-white/10">
                             <h4 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Post-Reading Communication</h4>
                             {selectedBooking.messages.length === 0 && (
                               <div className="text-sm text-gray-500 italic">No messages yet. Ask a question below regarding your deep dive.</div>
                             )}
                             {selectedBooking.messages.map((msg) => (
                                <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                  <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed shadow-lg ${
                                    msg.sender === 'user' 
                                      ? 'bg-fuchsia-600 text-white rounded-tr-none' 
                                      : 'bg-[#2e1065] text-gray-200 border border-fuchsia-500/20 rounded-tl-none'
                                  }`}>
                                    <p>{msg.text}</p>
                                    <p className={`text-[10px] mt-2 ${msg.sender === 'user' ? 'text-fuchsia-200' : 'text-gray-500'} text-right`}>
                                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                  </div>
                                </div>
                             ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Input Area */}
                    {selectedBooking.status === 'complete' && (
                      <div className="p-4 border-t border-white/5 bg-[#0c0a24] z-20">
                        <div className="flex gap-4 items-end max-w-4xl mx-auto">
                          <div className="flex-1 bg-black/50 border border-white/10 rounded-2xl focus-within:border-fuchsia-500 transition-colors p-2">
                            <textarea
                              value={messageInput}
                              onChange={(e) => setMessageInput(e.target.value)}
                              onKeyDown={(e) => {
                                 if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSend();
                                 }
                              }}
                              placeholder="Ask a follow-up question about your chart..."
                              className="w-full bg-transparent text-sm text-white focus:outline-none resize-none h-12 py-3 px-2"
                            />
                          </div>
                          <button 
                            onClick={handleSend}
                            disabled={!messageInput.trim()}
                            className="h-14 w-14 bg-white text-black rounded-xl hover:bg-fuchsia-300 disabled:opacity-50 disabled:hover:bg-white transition-colors flex items-center justify-center shadow-lg shadow-fuchsia-900/20"
                          >
                            <Send className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-600 p-8 text-center">
                    <Star className="w-12 h-12 text-gray-800 mb-4" />
                    <p className="text-sm uppercase tracking-widest mb-2">The Void Awaits</p>
                    <p className="text-xs text-gray-700">Select an alignment from the left to view your reading.</p>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Dashboard;
