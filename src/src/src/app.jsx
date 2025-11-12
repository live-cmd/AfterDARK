import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Mail, ChevronDown, Filter, Star, Instagram, Facebook, Youtube, Moon, Sparkles, Zap, Crown } from 'lucide-react';

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [filter, setFilter] = useState('all');
  const [email, setEmail] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [stars, setStars] = useState([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Generate random stars for night sky effect
  useEffect(() => {
    const newStars = Array.from({ length: 100 }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      delay: Math.random() * 3
    }));
    setStars(newStars);
  }, []);

  const events = [
    {
      id: 1,
      title: "Comedy@Cool J's Presents Bill Monaghan",
      date: "Sat 15th November",
      time: "9:00 PM",
      type: "comedy",
      image: "🎭",
      description: "Everything changes AfterDARK. Comedy @Cool J's is Delaware's best and longest running comedy experience.",
      ticketsLeft: 12,
      featured: true
    },
    {
      id: 2,
      title: "Karaoke Night",
      date: "Fri 14th November",
      time: "8:00 PM",
      type: "karaoke",
      image: "🎤",
      description: "Sing your heart out! Full bar, great vibes, and your chance to be a star.",
      ticketsLeft: null,
      featured: false
    },
    {
      id: 3,
      title: "Major Open Mic Tuesday",
      date: "Tue 18th November",
      time: "7:30 PM",
      type: "openmic",
      image: "🎙️",
      description: "This ain't really Radio, but you can still showcase your skills! Sign-up starts at 7 PM.",
      ticketsLeft: null,
      featured: false
    },
    {
      id: 4,
      title: "Live Jazz Night",
      date: "Sat 22nd November",
      time: "10:00 PM",
      type: "music",
      image: "🎷",
      description: "Smooth sounds, smooth drinks. An intimate evening with Delaware's finest jazz musicians.",
      ticketsLeft: 8,
      featured: false
    }
  ];

  const reviews = [
    { name: "Sarah M.", text: "Best comedy club in Delaware! The atmosphere is electric and the drinks are great.", stars: 5 },
    { name: "Mike J.", text: "Had an amazing time at karaoke night. The staff was super friendly and welcoming.", stars: 5 },
    { name: "Lisa K.", text: "Cool J's is our go-to spot for date night. Never disappoints!", stars: 5 }
  ];

  const [currentReview, setCurrentReview] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const filteredEvents = filter === 'all' 
    ? events 
    : events.filter(event => event.type === filter);

  const handleEmailSubmit = () => {
    if (email && email.includes('@')) {
      setShowSuccess(true);
      setEmail('');
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      {/* Night Sky Background */}
      <div className="fixed inset-0 bg-gradient-to-b from-gray-900 via-black to-black">
        {/* Animated stars */}
        {stars.map((star, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              animation: `twinkle ${2 + star.delay}s ease-in-out infinite`,
              animationDelay: `${star.delay}s`
            }}
          />
        ))}
        
        {/* Moon with gold tint */}
        <div className="absolute top-20 right-20 w-32 h-32 rounded-full bg-gradient-to-br from-yellow-200 to-amber-400 opacity-20 blur-sm"></div>
        
        {/* City skyline silhouette */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent">
          <svg className="absolute bottom-0 w-full h-40" viewBox="0 0 1200 200" preserveAspectRatio="none">
            <path d="M0,200 L0,120 L100,120 L100,80 L150,80 L150,120 L200,120 L200,100 L250,100 L250,120 L300,120 L300,60 L350,60 L350,120 L450,120 L450,90 L500,90 L500,120 L600,120 L600,70 L650,70 L650,120 L750,120 L750,95 L800,95 L800,120 L900,120 L900,50 L950,50 L950,120 L1050,120 L1050,85 L1100,85 L1100,120 L1200,120 L1200,200 Z" 
                  fill="rgba(0,0,0,0.9)"/>
          </svg>
        </div>
        
        {/* Electric blue glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-15 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-cyan-400 rounded-full blur-3xl opacity-15 animate-pulse-slow" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-blue-600 rounded-full blur-3xl opacity-15 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Content wrapper */}
      <div className="relative z-10">
        {/* Sticky Navigation */}
        <nav className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-black/95 backdrop-blur-md shadow-lg shadow-blue-500/20 py-3 border-b border-blue-500/20' : 'bg-transparent py-6'
        }`}>
          <div className="container mx-auto px-4 flex justify-between items-center">
            <div className="text-2xl font-bold flex items-center gap-2">
              <Crown className="w-6 h-6 text-yellow-500" />
              <span className="text-white">Cool J's</span> <span className="upscale-text text-yellow-500">AFTERDARK</span>
            </div>
            <div className="hidden md:flex gap-8 items-center">
              <a href="#home" className="hover:text-yellow-500 transition cursor-pointer tracking-wide">HOME</a>
              <a href="#events" className="hover:text-blue-400 transition cursor-pointer tracking-wide">EVENTS</a>
              <a href="#gallery" className="hover:text-yellow-500 transition cursor-pointer tracking-wide">GALLERY</a>
              <a href="#contact" className="hover:text-blue-400 transition cursor-pointer tracking-wide">CONTACT</a>
              <button className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-2 rounded-full hover:shadow-lg hover:shadow-blue-500/50 transition border border-blue-400/30 font-semibold">
                Book Now
              </button>
            </div>
            <div className="flex gap-4 md:hidden">
              <Instagram className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
              <Facebook className="w-5 h-5 cursor-pointer hover:text-blue-400 transition" />
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <div className="pt-32 pb-20 px-4 relative">
          <div className="container mx-auto text-center relative z-10">
            <div className="flex justify-center mb-6">
              <Crown className="w-12 h-12 text-yellow-500 animate-pulse" />
            </div>
            <h1 className="text-7xl md:text-9xl font-black mb-6 upscale-text-large">
              AFTERDARK
            </h1>
            <div className="h-1 w-64 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6"></div>
            <p className="text-xl md:text-2xl mb-4 text-blue-300 tracking-wider">
              WHERE DELAWARE COMES ALIVE AFTER HOURS
            </p>
            <p className="text-lg text-yellow-400 mb-8 italic font-light tracking-wide">
              Elevated Entertainment • Premium Experience
            </p>
            <div className="flex gap-6 justify-center">
              <Instagram className="w-10 h-10 hover:text-blue-400 transition cursor-pointer hover:scale-110 transform" />
              <Facebook className="w-10 h-10 hover:text-blue-400 transition cursor-pointer hover:scale-110 transform" />
              <Youtube className="w-10 h-10 hover:text-yellow-500 transition cursor-pointer hover:scale-110 transform" />
            </div>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-8 h-8 text-blue-400" />
          </div>
        </div>

        {/* Event Filters */}
        <div id="events" className="container mx-auto px-4 mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {[
              { key: 'all', label: 'All Events', icon: Sparkles },
              { key: 'comedy', label: 'Comedy', icon: '😂' },
              { key: 'karaoke', label: 'Karaoke', icon: '🎤' },
              { key: 'openmic', label: 'Open Mic', icon: '🎙️' },
              { key: 'music', label: 'Live Music', icon: '🎵' }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-6 py-3 rounded-full transition-all flex items-center gap-2 border font-medium tracking-wide ${
                  filter === key
                    ? 'bg-gradient-to-r from-blue-600 to-cyan-500 shadow-lg shadow-blue-500/50 border-blue-400'
                    : 'bg-black/80 border-blue-500/30 hover:border-blue-400 hover:bg-blue-900/20'
                }`}
              >
                {typeof Icon === 'string' ? <span className="text-xl">{Icon}</span> : <Icon className="w-5 h-5" />}
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="container mx-auto px-4 mb-20">
          <h2 className="text-5xl font-bold text-center mb-4 upscale-text">
            TONIGHT'S ENTERTAINMENT
          </h2>
          <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-12"></div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {filteredEvents.map((event, index) => (
              <div
                key={event.id}
                className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-2xl overflow-hidden border border-blue-500/30 hover:border-yellow-500/50 hover:transform hover:scale-105 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/30"
                style={{
                  animation: `fadeInUp 0.6s ease-out ${index * 0.1}s backwards`
                }}
              >
                {event.featured && (
                  <div className="bg-gradient-to-r from-yellow-500 to-amber-600 text-black text-sm font-bold px-4 py-1 inline-flex items-center gap-2">
                    <Crown className="w-4 h-4" />
                    TONIGHT'S SPOTLIGHT
                  </div>
                )}
                <div className="p-6">
                  <div className="text-6xl mb-4">{event.image}</div>
                  <h3 className="text-2xl font-bold mb-3 text-blue-300 tracking-wide">{event.title}</h3>
                  <div className="flex items-center gap-4 mb-3 text-blue-400">
                    <span className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {event.time}
                    </span>
                  </div>
                  {event.ticketsLeft && (
                    <div className="bg-yellow-500/10 border border-yellow-500 rounded-lg px-3 py-2 mb-3 inline-block animate-pulse">
                      <span className="text-yellow-500 flex items-center gap-2 font-semibold">
                        <Zap className="w-4 h-4" />
                        Only {event.ticketsLeft} tickets left!
                      </span>
                    </div>
                  )}
                  <p className="text-gray-300 mb-4">{event.description}</p>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 py-3 rounded-lg font-bold hover:shadow-lg hover:shadow-blue-500/50 transition border border-blue-400/30 tracking-wide">
                    GET TICKETS NOW →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Social Proof / Reviews */}
        <div className="bg-black/70 py-16 mb-20 border-y border-blue-500/20">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-4 upscale-text">
              GUEST EXPERIENCES
            </h2>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-12"></div>
            <div className="max-w-2xl mx-auto bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-2xl p-8 relative border border-blue-500/30">
              <div className="flex justify-center mb-4">
                {[...Array(reviews[currentReview].stars)].map((_, i) => (
                  <Star key={i} className="w-6 h-6 fill-yellow-500 text-yellow-500" />
                ))}
              </div>
              <p className="text-xl text-center mb-4 italic text-blue-200">"{reviews[currentReview].text}"</p>
              <p className="text-center text-yellow-500 font-semibold tracking-wide">— {reviews[currentReview].name}</p>
              <div className="flex justify-center gap-2 mt-6">
                {reviews.map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === currentReview ? 'bg-yellow-500 w-8' : 'bg-blue-500/30'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="container mx-auto px-4 mb-20">
          <div className="bg-gradient-to-br from-gray-900 to-black backdrop-blur-md rounded-2xl p-12 text-center border-2 border-blue-500/50 shadow-xl shadow-blue-500/20">
            <Mail className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-4xl font-bold mb-4 upscale-text">
              JOIN THE <span className="text-yellow-500">VIP</span> LIST
            </h2>
            <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-6"></div>
            <p className="text-xl mb-8 text-blue-200 tracking-wide">
              Exclusive events • VIP access • Premium experiences
            </p>
            <div className="max-w-md mx-auto flex gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleEmailSubmit()}
                placeholder="your@email.com"
                className="flex-1 px-6 py-3 rounded-full bg-black/80 border-2 border-blue-500/50 focus:outline-none focus:border-yellow-500 transition text-white placeholder-blue-300/50"
              />
              <button
                onClick={handleEmailSubmit}
                className="bg-gradient-to-r from-blue-600 to-cyan-500 px-8 py-3 rounded-full font-bold hover:shadow-lg hover:shadow-blue-500/50 transition border border-blue-400/30"
              >
                Join
              </button>
            </div>
            {showSuccess && (
              <div className="mt-4 bg-yellow-500/20 border border-yellow-500 rounded-lg px-4 py-2 inline-block">
                <span className="text-yellow-400 font-semibold">✓ Welcome to the VIP list!</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="bg-black/90 border-t border-blue-500/20 py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Crown className="w-8 h-8 text-yellow-500" />
              <div className="text-3xl font-bold">
                <span className="text-white">Cool J's</span> <span className="upscale-text text-yellow-500">AFTERDARK</span>
              </div>
            </div>
            <div className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent mb-4"></div>
            <p className="text-blue-300 mb-6 tracking-wide">Delaware's Premier After-Hours Destination</p>
            <div className="flex justify-center gap-6 mb-6">
              <Instagram className="w-6 h-6 hover:text-blue-400 transition cursor-pointer" />
              <Facebook className="w-6 h-6 hover:text-blue-400 transition cursor-pointer" />
              <Youtube className="w-6 h-6 hover:text-yellow-500 transition cursor-pointer" />
            </div>
            <p className="text-sm text-gray-500">© 2024 Cool J's After Dark. All rights reserved.</p>
          </div>
        </footer>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Montserrat:wght@300;400;600;700&display=swap');
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes twinkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        
        .animate-pulse-slow {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        
        .upscale-text {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-shadow: 0 0 20px rgba(234, 179, 8, 0.3),
                       0 0 40px rgba(234, 179, 8, 0.2);
        }
        
        .upscale-text-large {
          font-family: 'Playfair Display', serif;
          font-weight: 900;
          letter-spacing: 0.15em;
          background: linear-gradient(135deg, #fbbf24 0%, #3b82f6 50%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          filter: drop-shadow(0 0 30px rgba(59, 130, 246, 0.4))
                  drop-shadow(0 0 60px rgba(251, 191, 36, 0.3));
        }
        
        body {
          font-family: 'Montserrat', sans-serif;
        }
      `}</style>
    </div>
  );
}
