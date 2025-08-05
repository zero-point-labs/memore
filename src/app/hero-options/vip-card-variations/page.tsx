'use client';


import { motion } from 'framer-motion';
import { User, Crown, Sparkles, Star, Diamond, Zap, Calendar, MapPin, Gift, Music, Ticket, Wine, Heart, Shield } from 'lucide-react';

// Variation 1: Premium Member Details
function GlassPremiumCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-[420px] h-[320px] bg-white/5 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-pink-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Crown className="w-6 h-6 text-yellow-400/80" />
            <h3 className="text-xl font-bold text-white/90">MEMORA PREMIUM</h3>
          </div>
          <span className="text-xs text-white/50 font-mono">EST. 2024</span>
        </div>

        <div className="flex gap-4 mb-5">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center">
            <User className="w-10 h-10 text-white/70" />
          </div>
          <div className="flex-1">
            <h4 className="text-white/90 font-semibold text-lg">ALEXANDRA STONE</h4>
            <p className="text-white/60 text-sm">Member ID: VIP-2024-0847</p>
            <div className="flex gap-2 mt-2">
              <span className="text-xs px-2 py-0.5 bg-green-500/20 text-green-400 rounded-full">VERIFIED</span>
              <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-400 rounded-full">FOUNDING MEMBER</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <p className="text-xs text-white/50">Member Since</p>
            <p className="text-sm text-white/80 font-medium">July 15, 2024</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <p className="text-xs text-white/50">Events Attended</p>
            <p className="text-sm text-white/80 font-medium">47 Exclusive</p>
          </div>
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-white/40">Lifetime Benefits Include:</p>
            <div className="flex gap-1">
              <Shield className="w-4 h-4 text-white/40" />
              <Diamond className="w-4 h-4 text-white/40" />
              <Star className="w-4 h-4 text-white/40" />
            </div>
          </div>
          <div className="flex gap-2 text-[10px] text-white/60">
            <span>• VIP Access</span>
            <span>• Private Events</span>
            <span>• Concierge Service</span>
            <span>• Priority Booking</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 2: Event Access Card
function GlassEventCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-[400px] h-[300px] bg-white/8 backdrop-blur-lg rounded-2xl border border-white/25 overflow-hidden shadow-2xl"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-purple-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-cyan-400/80" />
            <h3 className="text-lg font-bold text-white/90">EVENT ACCESS PASS</h3>
          </div>
          <Diamond className="w-5 h-5 text-white/60" />
        </div>

        <div className="flex gap-4 mb-4">
          <div className="w-18 h-18 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center">
            <Music className="w-8 h-8 text-white/70" />
          </div>
          <div className="flex-1">
            <h4 className="text-white/90 font-semibold">MICHAEL CHEN</h4>
            <p className="text-white/60 text-sm">VIP Guest • Table 12</p>
            <div className="flex items-center gap-2 mt-2">
              <MapPin className="w-3 h-3 text-white/50" />
              <span className="text-xs text-white/60">Memora Beach Club, Miami</span>
            </div>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-white/50">Next Event</p>
                <p className="text-sm text-white/80 font-medium">Summer Solstice Party</p>
              </div>
              <Calendar className="w-4 h-4 text-white/40" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-white/50">Time</p>
              <p className="text-sm text-white/80 font-medium">9PM</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-white/50">Guests</p>
              <p className="text-sm text-white/80 font-medium">+3</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
              <p className="text-xs text-white/50">Floor</p>
              <p className="text-sm text-white/80 font-medium">VIP</p>
            </div>
          </div>
        </div>

        <div className="mt-auto flex justify-between items-center">
          <div className="flex gap-3">
            <Wine className="w-4 h-4 text-white/40" />
            <Gift className="w-4 h-4 text-white/40" />
            <Sparkles className="w-4 h-4 text-white/40" />
          </div>
          <p className="text-xs text-white/40 font-mono">SCAN FOR ENTRY</p>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 3: Lifestyle Benefits Card
function GlassLifestyleCard() {
  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="relative w-[380px] h-[340px] bg-white/7 backdrop-blur-xl rounded-2xl border border-white/15 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/10 via-transparent to-orange-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-400/80" />
            <h3 className="text-lg font-bold text-white/90">LIFESTYLE MEMBER</h3>
          </div>
          <p className="text-xs text-white/50 font-mono">ELITE</p>
        </div>

        <div className="mb-4">
          <h4 className="text-white/90 font-semibold text-lg mb-1">SOPHIA MARTINEZ</h4>
          <p className="text-white/60 text-sm">Wellness Ambassador</p>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 text-yellow-400/70 fill-yellow-400/50" />
              ))}
            </div>
            <span className="text-xs text-white/50">Platinum Status</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
            <p className="text-xs text-white/50 mb-1">Monthly Benefits Used</p>
            <div className="flex justify-between items-center">
              <p className="text-sm text-white/80 font-medium">18 of 25 Perks</p>
              <div className="w-20 h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-gradient-to-r from-pink-400/60 to-orange-400/60" />
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Spa Credits</p>
              <p className="text-sm text-white/80 font-medium">$500</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Dining Points</p>
              <p className="text-sm text-white/80 font-medium">2,450</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Travel Miles</p>
              <p className="text-sm text-white/80 font-medium">15K</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Event Tickets</p>
              <p className="text-sm text-white/80 font-medium">8</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <p className="text-xs text-white/40">Next reward unlocks at 20 perks</p>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 4: Membership Tiers Card
function GlassTiersCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.03 }}
      className="relative w-[440px] h-[280px] bg-white/6 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-bl from-yellow-500/10 via-transparent to-green-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">MEMBERSHIP STATUS</h3>
          <Crown className="w-5 h-5 text-yellow-400/80" />
        </div>

        <div className="mb-4">
          <h4 className="text-white/90 font-semibold">JAMES WELLINGTON</h4>
          <p className="text-white/60 text-sm">Account #VIP-2024-1138</p>
        </div>

        <div className="space-y-2 flex-1">
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-white/50">Current Tier</span>
              <span className="text-xs text-yellow-400/80 font-medium">GOLD</span>
            </div>
            <div className="flex gap-1">
              <div className="flex-1 h-2 bg-green-500/40 rounded-full" />
              <div className="flex-1 h-2 bg-blue-500/40 rounded-full" />
              <div className="flex-1 h-2 bg-yellow-500/60 rounded-full" />
              <div className="flex-1 h-2 bg-white/10 rounded-full" />
            </div>
            <div className="flex justify-between mt-1">
              <span className="text-[10px] text-white/30">Silver</span>
              <span className="text-[10px] text-white/30">Blue</span>
              <span className="text-[10px] text-yellow-400/60">Gold</span>
              <span className="text-[10px] text-white/30">Platinum</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Points to Next Tier</p>
              <p className="text-sm text-white/80 font-medium">2,850 / 5,000</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <p className="text-xs text-white/50">Annual Spend</p>
              <p className="text-sm text-white/80 font-medium">$24,500</p>
            </div>
          </div>

          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-2 mt-3">
            <p className="text-xs text-yellow-400/80">🎉 You&apos;re 57% to Platinum Status!</p>
          </div>
        </div>

        <div className="mt-auto flex gap-4 text-xs text-white/40">
          <span>• Gold Lounge Access</span>
          <span>• 2x Points</span>
          <span>• Priority Service</span>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 5: Digital Access Card
function GlassDigitalCard() {
  return (
    <motion.div 
      whileHover={{ rotateY: 5, rotateX: -5 }}
      className="relative w-[400px] h-[320px] bg-white/4 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/30"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-purple-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">DIGITAL VIP ACCESS</h3>
          <Zap className="w-5 h-5 text-blue-400/80" />
        </div>

        <div className="mb-4">
          <h4 className="text-white/90 font-semibold text-lg">EMMA DAVIS</h4>
          <p className="text-white/60 text-sm">Tech Innovator • Early Adopter</p>
          <div className="flex items-center gap-2 mt-2">
            <Shield className="w-4 h-4 text-green-400/70" />
            <span className="text-xs text-green-400/70">Blockchain Verified</span>
          </div>
        </div>

        <div className="space-y-3 flex-1">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-white/50">Digital Wallet</p>
              <p className="text-sm text-white/80 font-mono">0x7f9...3d2</p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-white/50">NFT Collection</p>
              <p className="text-sm text-white/80 font-medium">12 Exclusive</p>
            </div>
          </div>
          
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
            <div className="flex justify-between items-center mb-2">
              <p className="text-xs text-white/50">Access Privileges</p>
              <p className="text-xs text-blue-400/70">UNLIMITED</p>
            </div>
            <div className="grid grid-cols-4 gap-1">
              <div className="h-1 bg-blue-400/60 rounded-full" />
              <div className="h-1 bg-blue-400/60 rounded-full" />
              <div className="h-1 bg-blue-400/60 rounded-full" />
              <div className="h-1 bg-blue-400/60 rounded-full" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded-full">Metaverse</span>
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded-full">AR Events</span>
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded-full">Digital Art</span>
            <span className="text-xs px-2 py-1 bg-white/5 text-white/70 rounded-full">Web3</span>
          </div>
        </div>

        <div className="mt-auto">
          <div className="h-12 bg-white/5 backdrop-blur-sm rounded-lg flex items-center justify-center">
            <div className="flex gap-1">
              {[...Array(15)].map((_, i) => (
                <div key={i} className="w-1 h-6 bg-white/40" style={{ height: `${Math.random() * 24 + 8}px` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 6: Compact Statistics Card
function GlassCompactCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="relative w-[360px] h-[240px] bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/30"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-blue-500/10" />
      
      <div className="relative z-10 p-5 h-full flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-green-400/80" />
            <h3 className="text-base font-bold text-white/90">VIP ANALYTICS</h3>
          </div>
          <span className="text-xs text-white/60 font-mono">LIVE</span>
        </div>

        <div className="mb-3">
          <h4 className="text-white/90 font-medium">RACHEL KIM</h4>
          <p className="text-white/50 text-sm">Power User</p>
        </div>

        <div className="grid grid-cols-3 gap-2 flex-1">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <p className="text-[10px] text-white/50">Check-ins</p>
            <p className="text-lg text-white/80 font-bold">142</p>
            <p className="text-[10px] text-green-400/60">+12%</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <p className="text-[10px] text-white/50">Referrals</p>
            <p className="text-lg text-white/80 font-bold">28</p>
            <p className="text-[10px] text-blue-400/60">Top 5%</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2">
            <p className="text-[10px] text-white/50">Rewards</p>
            <p className="text-lg text-white/80 font-bold">$2.4K</p>
            <p className="text-[10px] text-yellow-400/60">Earned</p>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t border-white/10 flex justify-between items-center">
          <p className="text-xs text-white/40">Updated 2 min ago</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-green-400/60 rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-green-400/60 rounded-full animate-pulse delay-75" />
            <div className="w-2 h-2 bg-green-400/60 rounded-full animate-pulse delay-150" />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 7: Experience Timeline Card
function GlassTimelineCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-[420px] h-[360px] bg-white/3 backdrop-blur-2xl rounded-2xl border border-white/25 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-violet-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">JOURNEY TIMELINE</h3>
          <Calendar className="w-5 h-5 text-indigo-400/80" />
        </div>

        <div className="mb-4">
          <h4 className="text-white/90 font-semibold">DAVID THOMPSON</h4>
          <p className="text-white/60 text-sm">Experience Collector • 3 Years</p>
        </div>

        <div className="space-y-3 flex-1 overflow-y-auto">
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-indigo-400/80 rounded-full" />
              <div className="w-[1px] h-full bg-white/20" />
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-white/50">July 2024</p>
              <p className="text-sm text-white/80 font-medium">Sunset Beach Party</p>
              <p className="text-xs text-white/60">Met 12 new connections</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-purple-400/80 rounded-full" />
              <div className="w-[1px] h-full bg-white/20" />
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-white/50">June 2024</p>
              <p className="text-sm text-white/80 font-medium">VIP Wine Tasting</p>
              <p className="text-xs text-white/60">Exclusive Napa Valley Tour</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className="w-3 h-3 bg-violet-400/80 rounded-full" />
              <div className="w-[1px] h-full bg-white/20" />
            </div>
            <div className="flex-1 bg-white/5 backdrop-blur-sm rounded-lg p-3">
              <p className="text-xs text-white/50">May 2024</p>
              <p className="text-sm text-white/80 font-medium">Art Gallery Opening</p>
              <p className="text-xs text-white/60">Private Collection Viewing</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10">
          <div className="flex justify-between items-center">
            <p className="text-xs text-white/40">Total Experiences: 89</p>
            <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded-full">VIEW ALL</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 8: Social Connection Card
function GlassSocialCard() {
  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="relative w-[400px] h-[340px] bg-white/8 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/20"
    >
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-transparent to-amber-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">SOCIAL ELITE</h3>
          <Heart className="w-5 h-5 text-rose-400/80" />
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <User className="w-8 h-8 text-white/70" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-rose-400/80 rounded-full flex items-center justify-center">
                <span className="text-[10px] text-white font-bold">99+</span>
              </div>
            </div>
            <div>
              <h4 className="text-white/90 font-semibold">OLIVIA RODRIGUEZ</h4>
              <p className="text-white/60 text-sm">Influencer • Trendsetter</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-xs text-white/50">Followers</p>
            <p className="text-lg text-white/80 font-bold">15.2K</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-xs text-white/50">Connections</p>
            <p className="text-lg text-white/80 font-bold">847</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-2 text-center">
            <p className="text-xs text-white/50">Events</p>
            <p className="text-lg text-white/80 font-bold">234</p>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3 mb-3">
          <p className="text-xs text-white/50 mb-2">Recent Connections</p>
          <div className="flex -space-x-2">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-8 h-8 bg-gradient-to-br from-rose-400/40 to-amber-400/40 rounded-full border-2 border-black/20" />
            ))}
            <div className="w-8 h-8 bg-white/10 rounded-full border-2 border-black/20 flex items-center justify-center">
              <span className="text-[10px] text-white/60">+42</span>
            </div>
          </div>
        </div>

        <div className="mt-auto flex gap-2">
          <span className="text-xs px-3 py-1 bg-rose-500/20 text-rose-400 rounded-full">Top Networker</span>
          <span className="text-xs px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full">Event Host</span>
          <span className="text-xs px-3 py-1 bg-white/10 text-white/70 rounded-full">Verified</span>
        </div>
      </div>
    </motion.div>
  );
}

// Variation 9: Rewards & Achievements Card
function GlassRewardsCard() {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      className="relative w-[440px] h-[320px] bg-white/9 backdrop-blur-2xl rounded-2xl border border-white/35 overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/10" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-white/90">REWARDS CENTER</h3>
          <Gift className="w-5 h-5 text-emerald-400/80" />
        </div>

        <div className="mb-4">
          <h4 className="text-white/90 font-semibold">NATHAN PARKER</h4>
          <p className="text-white/60 text-sm">Diamond Collector • Level 42</p>
          <div className="mt-2 flex items-center gap-2">
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-gradient-to-r from-emerald-400/60 to-teal-400/60" />
            </div>
            <span className="text-xs text-white/50">80%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/50">Points Balance</p>
              <Sparkles className="w-3 h-3 text-yellow-400/60" />
            </div>
            <p className="text-xl text-white/80 font-bold">48,750</p>
            <p className="text-xs text-emerald-400/60">+2,300 this month</p>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center justify-between mb-1">
              <p className="text-xs text-white/50">Achievements</p>
              <Star className="w-3 h-3 text-yellow-400/60" />
            </div>
            <p className="text-xl text-white/80 font-bold">127</p>
            <p className="text-xs text-teal-400/60">3 new unlocked</p>
          </div>
        </div>

        <div className="flex-1">
          <p className="text-xs text-white/50 mb-2">Latest Rewards</p>
          <div className="space-y-2">
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Diamond className="w-4 h-4 text-purple-400/70" />
                <span className="text-xs text-white/70">Exclusive NFT Drop</span>
              </div>
              <span className="text-xs text-white/40">Claimed</span>
            </div>
            <div className="flex items-center justify-between bg-white/5 backdrop-blur-sm rounded-lg p-2">
              <div className="flex items-center gap-2">
                <Wine className="w-4 h-4 text-red-400/70" />
                <span className="text-xs text-white/70">Wine Club Access</span>
              </div>
              <span className="text-xs text-emerald-400/60">Available</span>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-3 border-t border-white/10">
          <p className="text-xs text-white/40 text-center">Next milestone: Platinum Status at 50,000 points</p>
        </div>
      </div>
    </motion.div>
  );
}

export default function VIPCardVariations() {

  const variations = [
    { name: "Premium Member Details", component: <GlassPremiumCard /> },
    { name: "Event Access Pass", component: <GlassEventCard /> },
    { name: "Lifestyle Benefits", component: <GlassLifestyleCard /> },
    { name: "Membership Tiers", component: <GlassTiersCard /> },
    { name: "Digital Access", component: <GlassDigitalCard /> },
    { name: "Compact Statistics", component: <GlassCompactCard /> },
    { name: "Experience Timeline", component: <GlassTimelineCard /> },
    { name: "Social Connection", component: <GlassSocialCard /> },
    { name: "Rewards & Achievements", component: <GlassRewardsCard /> },
  ];

  return (
    <div className="min-h-screen bg-black p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-2">Glassmorphism VIP Card Variations</h1>
        <p className="text-gray-400 mb-12">All cards feature glassmorphism design with transparent backgrounds and blur effects. Hover to see interactions.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {variations.map((variation, index) => (
            <div 
              key={index}
              className="flex flex-col items-center"
            >
              <h3 className="text-xl font-semibold text-white mb-4">{variation.name}</h3>
              <div className="flex items-center justify-center">
                {variation.component}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}