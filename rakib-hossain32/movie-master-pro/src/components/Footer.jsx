import React from "react";
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Sparkles,
  ArrowRight,
  Mail,
  ShieldCheck,
  MapPin,
  Phone,
} from "lucide-react";
import { Link } from "react-router";

export default function Footer() {
  return (
    <footer className="relative pt-24 bg-base-200 text-base-content overflow-hidden border-t border-base-content/5">
      {/* --- Cinematic Background Mesh --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-5" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* --- Middle Section: Links Grid --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
          {/* Brand Info (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-primary to-red-700 flex items-center justify-center text-white shadow-lg shadow-primary/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xl font-black tracking-tighter">
                  MovieMaster
                </span>
                <span className="block text-[10px] font-bold tracking-[0.3em] text-primary uppercase">
                  Pro Edition
                </span>
              </div>
            </Link>
            <p className="text-base-content/70 leading-relaxed pr-4">
              The ultimate destination for cinephiles. Discover, track, and
              organize your movie journey with cutting-edge tools and a global
              community.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="p-2 rounded-lg bg-base-100 hover:bg-primary hover:text-white transition-all duration-300 border border-base-content/5"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Links (8 Cols split into 3 lists) */}
          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-primary">Product</h4>
            <ul className="space-y-4">
              <li>
                <Link
                  to="/features"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Features
                </Link>
              </li>
              <li>
                <Link
                  to="/pricing"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Pricing
                </Link>
              </li>
              <li>
                <Link
                  to="/all-movies"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Browse Movies
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="font-bold text-lg mb-6 text-primary">Company</h4>
            <ul className="space-y-4">
              <li>
                {/* <Link
                  to="/about"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  About Us
                </Link> */}
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                {/* <Link
                  to="/careers"
                  className="text-base-content/70 hover:text-primary transition-colors"
                >
                  Careers
                </Link> */}
              </li>
            </ul>
          </div>

          <div className="lg:col-span-4">
            <h4 className="font-bold text-lg mb-6 text-primary">
              Contact & Legal
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-base-content/70">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>123 Cinema Street, Hollywood Blvd, Los Angeles, CA</span>
              </li>
              <li className="flex items-center gap-3 text-base-content/70">
                <Phone className="w-5 h-5 text-primary" />
                <span>+1 (555) 123-4567</span>
              </li>
              <div className="pt-4 flex flex-wrap gap-4 text-sm font-medium">
                <Link
                  to="/privacy"
                  className="hover:text-primary underline decoration-primary/30"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/terms"
                  className="hover:text-primary underline decoration-primary/30"
                >
                  Terms of Service
                </Link>
              </div>
            </ul>
          </div>
        </div>

        {/* --- Bottom Section --- */}
        <div className="border-t border-base-content/10 py-8 flex flex-col md:flex-row items-center justify-center gap-4">
          <p className="text-sm text-base-content/50 ">
            © {new Date().getFullYear()} Movie Master Pro. All rights reserved.
          </p>
          {/* <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            {/* <span className="text-xs font-bold text-green-500 uppercase tracking-wider">
              System Operational
            </span> 
          </div> */}
        </div>
      </div>
    </footer>
  );
}
