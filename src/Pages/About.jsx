import React, { useEffect } from "react";
import Navbar from "./Navbar"; // Assuming you have this component
import { FaLeaf, FaBolt, FaHeart, FaUsers } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

// Placeholder images from Unsplash matching your theme
const team1 = "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&auto=format&fit=crop&q=60";
const team2 = "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=60";
const team3 = "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=60";
const farmImg = "https://i.pinimg.com/1200x/df/d8/de/dfd8de92c0379702e4df753fd1bfe4b6.jpg";

export default function About() {
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-[#F0FDF4] text-[#14532D] overflow-x-hidden selection:bg-[#22C55E] selection:text-white">
      <Navbar />

      {/* --- HERO SECTION --- */}
      <section className="pt-32 pb-20 max-w-7xl mx-auto px-6 text-center">
        <div className="fade-up">
          <span className="bg-[#22C55E]/20 text-[#14532D] px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wider">
            Our Story
          </span>
          <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight">
            Redefining freshness, <br />
            <span className="text-[#16A34A]">one delivery at a time.</span>
          </h1>
          <p className="mt-6 text-[#14532D]/80 max-w-2xl mx-auto text-xl leading-relaxed">
            UniMart started with a simple mission: to bridge the gap between local farmers 
            and your kitchen table, without compromising on speed or quality.
          </p>
        </div>
      </section>

      {/* --- MISSION & VISION (Split Layout) --- */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Image Side with Decorative Blobs */}
          <div className="relative fade-up">
            <div className="absolute top-10 -left-10 w-32 h-32 bg-[#22C55E]/30 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#16A34A]/20 rounded-full blur-3xl"></div>
            
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white transform hover:scale-[1.02] transition duration-500">
              <img src={farmImg} alt="Fresh Farm" className="w-full h-[500px] object-contain"  />
              
              {/* Floating Badge */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur-xl p-4 rounded-xl shadow-lg flex items-center gap-4 animate-floating">
                <div className="bg-[#ECFDF3] p-3 rounded-full text-[#16A34A]">
                   <MdVerified size={28} />
                </div>
                <div>
                  <div className="font-bold text-lg">100% Organic</div>
                  <div className="text-sm text-[#14532D]/70">Certified Suppliers</div>
                </div>
              </div>
            </div>
          </div>

          {/* Text Side */}
          <div className="fade-up delay-200">
            <h2 className="text-4xl font-bold mb-6 leading-snug">
              We deliver more than just groceries. We deliver <span className="text-[#16A34A]">trust.</span>
            </h2>
            <p className="text-lg text-[#14532D]/70 mb-6 leading-relaxed">
              In a world of instant gratification, quality often takes a backseat. Not at UniMart. 
              We built a hyper-local logistics network that ensures vegetables harvested at dawn 
              reach your doorstep by breakfast.
            </p>
            <p className="text-lg text-[#14532D]/70 mb-8 leading-relaxed">
              By cutting out middlemen, we ensure farmers get fair prices and you get produce 
              that hasn't spent weeks in cold storage.
            </p>

            <div className="grid grid-cols-2 gap-6">
               <div className="border-l-4 border-[#16A34A] pl-4">
                 <div className="text-3xl font-bold text-[#14532D]">10k+</div>
                 <div className="text-sm text-[#14532D]/60">Happy Families</div>
               </div>
               <div className="border-l-4 border-[#16A34A] pl-4">
                 <div className="text-3xl font-bold text-[#14532D]">30min</div>
                 <div className="text-sm text-[#14532D]/60">Avg. Delivery</div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- VALUES GRID --- */}
      <section className="py-20 bg-[#ECFDF3]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">What drives us?</h2>
            <p className="mt-3 text-lg text-[#14532D]/70">Our core values that shape every delivery.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                icon: FaBolt,
                title: "Lightning Fast",
                desc: "Time is precious. We optimize every route to ensure your order arrives in minutes, not hours."
              },
              {
                icon: FaLeaf,
                title: "Sustainability First",
                desc: "We use electric vehicles for 80% of our fleet and plastic-free packaging for fresh produce."
              },
              {
                icon: FaHeart,
                title: "Customer Obsession",
                desc: "From the moment you click 'Order' to the knock on your door, your experience is our priority."
              }
            ].map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-2 transition duration-300 fade-up" style={{ animationDelay: `${i * 100}ms` }}>
                <div className="w-16 h-16 bg-[#F0FDF4] rounded-full flex items-center justify-center text-[#16A34A] text-2xl mb-6">
                  <item.icon />
                </div>
                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                <p className="text-[#14532D]/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TEAM SECTION --- */}
      <section className="py-20 max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Meet the Visionaries</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { name: "Pankaj Kumar", role: "CEO & Co-Founder", img: team1 },
            { name: "Tanvi Leader", role: "Head of Operations", img: team2 },
            { name: "Hardik", role: "Chief Technology Officer", img: team3 },
          ].map((member, i) => (
            <div key={i} className="group text-center fade-up" style={{ animationDelay: `${i * 150}ms` }}>
              <div className="relative mb-6 inline-block">
                <div className="absolute inset-0 bg-[#16A34A] rounded-full blur opacity-0 group-hover:opacity-30 transition duration-500"></div>
                <img 
                  src={member.img} 
                  alt={member.name} 
                  className="w-48 h-48 rounded-full object-cover border-4 border-[#F0FDF4] shadow-xl relative z-10 group-hover:scale-105 transition duration-300" 
                />
              </div>
              <h3 className="text-2xl font-bold">{member.name}</h3>
              <p className="text-[#16A34A] font-medium mt-1">{member.role}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- CTA / FOOTER PREVIEW --- */}
      <section className="py-20 bg-[#16A34A] text-white text-center relative overflow-hidden">
         {/* Decorative Circles */}
         <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
         <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>

         <div className="relative z-10 max-w-3xl mx-auto px-6">
           <h2 className="text-4xl lg:text-5xl font-extrabold mb-6">Ready to experience the future of grocery?</h2>
           <p className="text-lg text-white/90 mb-8">Join thousands of happy customers in your city today.</p>
           <button className="bg-white text-[#16A34A] px-10 py-4 rounded-xl text-xl font-bold shadow-lg hover:bg-gray-100 transition hover:scale-105">
             Start Shopping
           </button>
         </div>
      </section>

      {/* Reuse your Footer logic or import the Footer component here */}
      <style>{`
        @keyframes floating {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-floating { animation: floating 3s ease-in-out infinite; }
        
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .fade-up { animation: fadeUp 0.8s ease forwards; }
        .delay-200 { animation-delay: 0.2s; }
      `}</style>
    </div>
  );
}