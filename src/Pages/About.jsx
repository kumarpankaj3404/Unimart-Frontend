import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "./Navbar";
import Background3D from "../Components/Background3D";
import { FaLeaf, FaBolt, FaHeart, FaUserTie } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Link } from "react-router-dom";
import { link } from "framer-motion/client";
import { FaGithub, FaLinkedin } from "react-icons/fa";

const farmImg = "https://i.pinimg.com/1200x/df/d8/de/dfd8de92c0379702e4df753fd1bfe4b6.jpg";

export default function About() {

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative min-h-screen text-[#14532D] dark:text-green-100 overflow-x-hidden selection:bg-[#22C55E] selection:text-white transition-colors duration-300">
      <Helmet>
        <title>About UniMart - Our Mission & Story</title>
        <meta name="description" content="Learn about UniMart's mission to deliver fresh groceries directly from farmers to your kitchen. Discover our story, values, and commitment to quality." />
        <meta name="keywords" content="about UniMart, grocery delivery company, fresh produce, local farmers, mission" />
        <meta property="og:title" content="About UniMart" />
        <meta property="og:description" content="Bridging the gap between local farmers and your kitchen table." />
        <meta name="robots" content="index, follow" />
      </Helmet>
      <Background3D />
      <Navbar />

      {/* Hero Section */}
      <section className="pt-36 pb-20 max-w-7xl mx-auto px-6 text-center">
        <div className="fade-up">
          <span className="inline-block bg-white/40 dark:bg-white/5 backdrop-blur-md border border-white/20 dark:border-white/10 text-[#14532D] dark:text-green-300 px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wider shadow-sm">
            Our Story
          </span>
          <h1 className="mt-8 text-5xl lg:text-7xl font-extrabold leading-tight drop-shadow-sm">
            Redefining freshness, <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-[#16A34A] to-emerald-400">
              one delivery at a time.
            </span>
          </h1>
          <p className="mt-6 text-[#14532D]/90 dark:text-green-100/80 max-w-2xl mx-auto text-xl leading-relaxed font-medium">
            UniMart started with a simple mission: to bridge the gap between local farmers
            and your kitchen table, without compromising on speed or quality.
          </p>
        </div>
      </section>

      {/* Trust Section - Glass Container */}
      <section className="py-20 bg-white/30 dark:bg-slate-900/30 backdrop-blur-lg border-y border-white/20 dark:border-white/5">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          <div className="relative fade-up">
            {/* Background Glows */}
            <div className="absolute top-10 -left-10 w-32 h-32 bg-[#22C55E]/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#16A34A]/20 rounded-full blur-3xl"></div>

            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/30 dark:border-white/10 transform hover:scale-[1.02] transition duration-500">
              <img src={farmImg} alt="Fresh Farm" className="w-full h-[500px] object-cover" />

              {/* Floating Glass Badge */}
              <div className="absolute bottom-8 left-8 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl p-4 rounded-2xl shadow-lg border border-white/40 dark:border-white/10 flex items-center gap-4 animate-floating">
                <div className="bg-[#ECFDF3] dark:bg-slate-800 p-3 rounded-full text-[#16A34A]">
                  <MdVerified size={28} />
                </div>
                <div>
                  <div className="font-bold text-lg text-[#14532D] dark:text-green-100">100% Organic</div>
                  <div className="text-sm text-[#14532D]/70 dark:text-green-100/70">Certified Suppliers</div>
                </div>
              </div>
            </div>
          </div>

          <div className="fade-up delay-200">
            <h2 className="text-4xl font-bold mb-6 leading-snug drop-shadow-sm">
              We deliver more than just groceries. We deliver <span className="text-[#16A34A]">trust.</span>
            </h2>
            <p className="text-lg text-[#14532D]/80 dark:text-green-100/80 mb-8 leading-relaxed font-medium">
              In a world of instant gratification, quality often takes a backseat. Not at UniMart.
              We built a hyper-local logistics network that ensures vegetables harvested at dawn
              reach your doorstep by breakfast.
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div className="border-l-4 border-[#16A34A] pl-6 py-1 bg-white/20 dark:bg-white/5 rounded-r-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-[#14532D] dark:text-green-100">10k+</div>
                <div className="text-sm text-[#14532D]/70 dark:text-green-100/70 font-semibold">Happy Families</div>
              </div>
              <div className="border-l-4 border-[#16A34A] pl-6 py-1 bg-white/20 dark:bg-white/5 rounded-r-xl backdrop-blur-sm">
                <div className="text-3xl font-bold text-[#14532D] dark:text-green-100">30min</div>
                <div className="text-sm text-[#14532D]/70 dark:text-green-100/70 font-semibold">Avg. Delivery</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#14532D] dark:text-green-100 drop-shadow-sm">What drives us?</h2>
          <p className="mt-3 text-lg text-[#14532D]/80 dark:text-green-100/80 font-medium">Our core values that shape every delivery.</p>
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
            <div key={i} className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-md border border-white/30 dark:border-white/10 p-8 rounded-3xl shadow-lg hover:bg-white/50 dark:hover:bg-slate-900/50 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 fade-up" style={{ animationDelay: `${i * 100}ms` }}>
              <div className="w-16 h-16 bg-white/60 dark:bg-slate-800/60 rounded-2xl flex items-center justify-center text-[#16A34A] text-2xl mb-6 shadow-sm border border-white/20">
                <item.icon />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-[#14532D] dark:text-green-100">{item.title}</h3>
              <p className="text-[#14532D]/80 dark:text-green-100/70 leading-relaxed font-medium">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 max-w-7xl mx-auto px-6 border-t border-white/20 dark:border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#14532D] dark:text-green-100 drop-shadow-sm">Our Members</h2>
          <p className="mt-3 text-lg text-[#14532D]/80 dark:text-green-100/80 font-medium">The minds behind the mission.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { name: "Pankaj Kumar", github:"https://github.com/kumarpankaj3404", linkedin:"https://www.linkedin.com/in/pankaj-kumar-513a10298/"},
            { name: "Tanvi Leader" ,github:"https://github.com/TanviGanotra30", linkedin:"https://www.linkedin.com/in/tanvi-ganotra/"},
            { name: "Hardik", github:"https://github.com/hsaini04", linkedin:"https://www.linkedin.com/in/hardik371/"},
          ].map((member, i) => (
            <div
              key={i}
              className="group bg-white/30 dark:bg-slate-900/30 backdrop-blur-md p-8 rounded-3xl border border-white/30 dark:border-white/10 shadow-sm hover:shadow-xl hover:bg-white/40 dark:hover:bg-slate-900/50 transition-all duration-300 text-center fade-up cursor-default"
              style={{ animationDelay: `${i * 150}ms` }}
            >
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-[#F0FDF4] to-white dark:from-slate-800 dark:to-slate-700 text-[#16A34A] mb-6 shadow-md group-hover:scale-110 transition-transform duration-300 border border-white/20">
                <FaUserTie size={32} />
              </div>
              <h3 className="text-2xl font-bold text-[#14532D] dark:text-green-100 group-hover:text-[#16A34A] transition-colors">
                {member.name}
              </h3>
              <div className="flex justify-center space-x-4 mt-2">
                <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-[#14532D] dark:text-green-100 hover:text-[#16A34A] transition-colors">
                  <FaGithub size={24} />
                </a>
                <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#14532D] dark:text-green-100 hover:text-[#16A34A] transition-colors">
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section - Glass Gradient */}
      <section className="py-20 relative overflow-hidden mt-10">
        <div className="absolute inset-0 bg-[#16A34A]/90 dark:bg-[#16A34A]/80 backdrop-blur-xl z-0"></div>

        {/* Decorative background blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 z-0"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-black/10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 z-0"></div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-6 text-white drop-shadow-md">
            Ready to experience the future of grocery?
          </h2>
          <p className="text-lg text-white/90 mb-10 font-medium">
            Join thousands of happy customers in your city today.
          </p>
          <Link to="/items">
            <button className="bg-white text-[#16A34A] px-12 py-5 rounded-2xl text-xl font-bold shadow-2xl hover:bg-gray-50 transition-all hover:scale-105 active:scale-95">
              Start Shopping
            </button>
          </Link>
        </div>
      </section>

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