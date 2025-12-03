
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Calendar, MapPin, Clock, Mail, Lock, Smartphone, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: User) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLogin }) => {
  const [isSignup, setIsSignup] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetStatus, setResetStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const [rememberMe, setRememberMe] = useState(false);

  // Date Logic for constraints
  const today = new Date().toISOString().split('T')[0];
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 120);
  const minDateStr = minDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    password: '',
    birthDate: '',
    birthTime: '',
    birthPlace: '',
    name: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate backend user creation/retrieval
    const user: User = {
      email: formData.email,
      phone: formData.phone,
      birthDate: formData.birthDate,
      birthTime: formData.birthTime,
      birthPlace: formData.birthPlace,
      name: formData.name || 'Seeker'
    };
    
    // In a real app, 'rememberMe' would set a persistent token
    if (rememberMe) {
      console.log('User chose to be remembered');
    }

    onLogin(user);
    onClose();
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setResetStatus('sending');
    setTimeout(() => {
      setResetStatus('sent');
    }, 1500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const resetFlow = () => {
    setShowForgotPassword(false);
    setResetStatus('idle');
    setResetEmail('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md bg-[#1e1b4b] border border-fuchsia-500/30 overflow-hidden shadow-2xl relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-white/50 hover:text-white z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-8">
              {/* FORGOT PASSWORD VIEW */}
              {showForgotPassword ? (
                <div className="space-y-6">
                  {resetStatus === 'sent' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                         <CheckCircle2 className="w-8 h-8 text-green-400" />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">Link Sent</h3>
                      <p className="text-gray-300 text-sm mb-6">
                        A reset link has been teleported to <br/><span className="text-fuchsia-300 font-mono">{resetEmail}</span>
                      </p>
                      <button 
                        onClick={resetFlow} 
                        className="text-sm font-bold uppercase tracking-widest text-indigo-300 hover:text-white"
                      >
                        Return to Login
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-2">
                         <button onClick={() => setShowForgotPassword(false)} className="text-gray-400 hover:text-white">
                           <ArrowLeft className="w-5 h-5" />
                         </button>
                         <h2 className="font-heading text-2xl font-bold text-white">Reset Access</h2>
                      </div>
                      <p className="text-xs text-gray-400 mb-6">Enter your email to receive a secure link to reset your password.</p>
                      
                      <form onSubmit={handleForgotPassword} className="space-y-4">
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="email"
                            required
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="Your Email"
                            className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={resetStatus === 'sending'}
                          className="w-full py-3 bg-white text-black font-bold uppercase tracking-widest text-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                        >
                          {resetStatus === 'sending' ? 'Transmitting...' : 'Send Link'}
                        </button>
                      </form>
                    </>
                  )}
                </div>
              ) : (
                /* LOGIN / SIGNUP VIEW */
                <>
                  <div className="text-center mb-6">
                    <h2 className="font-heading text-2xl font-bold text-white mb-2">
                      {isSignup ? 'Enter the Void' : 'Welcome Back'}
                    </h2>
                    <p className="text-xs font-mono text-fuchsia-300 uppercase tracking-widest">
                      {isSignup ? 'Create your celestial profile' : 'Access your star path'}
                    </p>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    {!isSignup && (
                      <div className="space-y-4">
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="text"
                              name="email"
                              placeholder="Email or Phone"
                              required
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="password"
                              name="password"
                              placeholder="Password"
                              required
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                          
                          <div className="flex items-center justify-between text-xs">
                             <label className="flex items-center gap-2 cursor-pointer group">
                                <input 
                                  type="checkbox" 
                                  checked={rememberMe} 
                                  onChange={(e) => setRememberMe(e.target.checked)}
                                  className="appearance-none w-3 h-3 border border-gray-500 rounded-sm bg-transparent checked:bg-fuchsia-500 checked:border-fuchsia-500 transition-colors"
                                />
                                <span className="text-gray-400 group-hover:text-white transition-colors">Keep me logged in</span>
                             </label>
                             <button 
                               type="button" 
                               onClick={() => setShowForgotPassword(true)}
                               className="text-fuchsia-300 hover:text-white transition-colors"
                             >
                               Forgot Password?
                             </button>
                          </div>
                      </div>
                    )}

                    {isSignup && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="relative">
                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Phone"
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="password"
                            name="password"
                            placeholder="Create Password"
                            required
                            className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                            onChange={handleChange}
                          />
                        </div>

                        <div className="h-px bg-white/10 my-4" />
                        <p className="text-xs text-center text-gray-400 mb-2">Required for accurate readings</p>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="date"
                              name="birthDate"
                              required
                              max={today}
                              min={minDateStr}
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                          <div className="relative">
                            <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                            <input
                              type="time"
                              name="birthTime"
                              required
                              className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                              onChange={handleChange}
                            />
                          </div>
                        </div>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="text"
                            name="birthPlace"
                            placeholder="City of Birth (e.g. London, UK)"
                            required
                            className="w-full bg-black/30 border border-white/10 rounded-none p-3 pl-10 text-white placeholder-white/30 focus:border-fuchsia-500 outline-none transition-colors text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        
                        <div className="flex items-center gap-2 cursor-pointer group mt-2">
                            <input 
                              type="checkbox" 
                              checked={rememberMe} 
                              onChange={(e) => setRememberMe(e.target.checked)}
                              className="appearance-none w-3 h-3 border border-gray-500 rounded-sm bg-transparent checked:bg-fuchsia-500 checked:border-fuchsia-500 transition-colors"
                            />
                            <span className="text-xs text-gray-400 group-hover:text-white transition-colors">Keep me logged in</span>
                        </div>
                      </>
                    )}

                    <button
                      type="submit"
                      className="w-full py-3 bg-gradient-to-r from-fuchsia-600 to-indigo-600 text-white font-bold uppercase tracking-widest text-sm hover:opacity-90 transition-opacity mt-6"
                    >
                      {isSignup ? 'Register Soul' : 'Enter'}
                    </button>
                  </form>

                  <div className="mt-6 text-center">
                    <button
                      onClick={() => setIsSignup(!isSignup)}
                      className="text-xs text-gray-400 hover:text-white underline underline-offset-4"
                    >
                      {isSignup ? 'Already initiated? Login here' : 'New soul? Begin here'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
