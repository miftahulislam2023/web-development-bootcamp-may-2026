// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";

// export default function Navbar() {
//   const [isScrolled, setIsScrolled] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => setIsScrolled(window.scrollY > 20);
//     window.addEventListener("scroll", handleScroll);
//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   return (
//     <nav
//       className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
//         isScrolled
//           ? "bg-[#0F1419]/90 backdrop-blur-md border-b border-[#334155]"
//           : "bg-transparent"
//       }`}
//     >
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16">
//           {/* Logo */}
//           <Link href="/" className="flex items-center gap-2 group">
//             <div className="w-8 h-8 rounded-lg bg-linear-to-br from-[#8B5CF6] via-[#06B6D4] to-[#10B981] flex items-center justify-center shadow-lg shadow-[#06B6D4]/20">
//               <span className="text-white font-bold text-sm">L</span>
//             </div>
//             <span className="text-xl font-bold bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] bg-clip-text text-transparent">
//               LiveChat
//             </span>
//           </Link>

//           {/* Desktop nav links */}
//           <div className="hidden md:flex items-center gap-8">
//             {["Features", "About", "Contact"].map((item) => (
//               <Link
//                 key={item}
//                 href={`#${item.toLowerCase()}`}
//                 className="text-[#94A3B8] hover:text-[#F1F5F9] text-sm font-medium transition-colors duration-200"
//               >
//                 {item}
//               </Link>
//             ))}
//           </div>

//           {/* Desktop CTAs */}
//           <div className="hidden md:flex items-center gap-3">
//             <Link
//               href="/login"
//               className="text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] transition-colors duration-200 px-4 py-2"
//             >
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               className="text-sm font-semibold px-4 py-2 rounded-lg bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] text-white hover:opacity-90 transition-opacity duration-200 shadow-lg shadow-[#06B6D4]/20"
//             >
//               Get Started →
//             </Link>
//           </div>

//           {/* Mobile hamburger */}
//           <button
//             className="md:hidden flex flex-col gap-1.5 p-2"
//             onClick={() => setMenuOpen(!menuOpen)}
//             aria-label="Toggle menu"
//           >
//             <span className={`block w-5 h-0.5 bg-[#F1F5F9] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
//             <span className={`block w-5 h-0.5 bg-[#F1F5F9] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
//             <span className={`block w-5 h-0.5 bg-[#F1F5F9] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
//           </button>
//         </div>
//       </div>

//       {/* Mobile menu overlay */}
//       {menuOpen && (
//         <div className="md:hidden bg-[#0F1419]/95 backdrop-blur-md border-t border-[#334155] px-4 py-6 flex flex-col gap-6">
//           {["Features", "About", "Contact"].map((item) => (
//             <>
//               <Link
//                 key={item}
//                 href={`#${item.toLowerCase()}`}
//                 onClick={() => setMenuOpen(false)}
//                 className="text-[#94A3B8] hover:text-[#F1F5F9] text-base font-medium transition-colors"
//               >
//                 {item}
//               </Link>
//             </>
//           ))}
//           <div className="flex flex-col gap-3 pt-2 border-t border-[#334155]">
//             <Link
//               href="/login"
//               onClick={() => setMenuOpen(false)}
//               className="text-center text-sm font-medium text-[#94A3B8] hover:text-[#F1F5F9] py-2 transition-colors"
//             >
//               Login
//             </Link>
//             <Link
//               href="/signup"
//               onClick={() => setMenuOpen(false)}
//               className="text-center text-sm font-semibold px-4 py-3 rounded-lg bg-linear-to-r from-[#8B5CF6] via-[#06B6D4] to-[#10B981] text-white"
//             >
//               Get Started →
//             </Link>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }
