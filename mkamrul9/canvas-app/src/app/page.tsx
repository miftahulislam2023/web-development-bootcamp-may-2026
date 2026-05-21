import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import prisma from "../lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogIn, Plus, LayoutDashboard, Sparkles, Layers, Zap, Infinity, ArrowRight, Share2, MousePointer2, User, Settings, CreditCard, Keyboard, HeartHandshake, ShieldCheck, Zap as FastIcon, Shapes, Type, ArrowUpRight } from "lucide-react";
import { v4 as uuidv4 } from "uuid";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import BoardGrid from "../components/dashboard/BoardGrid";

// ==========================================
// SHARED DISTINCT FOOTER
// ==========================================
const Footer = () => (
    // Distinct pure black background with a glowing top border to separate it from the main page
    <footer className="relative bg-black pt-20 pb-10 text-slate-300 z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50"></div>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[100px] bg-violet-600/20 blur-[80px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16 relative z-10">
            <div className="col-span-1 md:col-span-1">
                <div className="flex items-center gap-2 mb-6">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-1.5 rounded-lg"><Sparkles className="w-5 h-5 text-white" /></div>
                    <span className="font-extrabold text-2xl text-white tracking-tight">Kidraw</span>
                </div>
                <p className="text-sm text-slate-400 mb-6 leading-relaxed">The visual workspace for modern engineering teams. Map, wireframe, and collaborate in real-time on an infinite canvas.</p>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6 tracking-wide">PRODUCT</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li><Link href="/info/features" className="hover:text-violet-400 transition-colors">Features</Link></li>
                    <li><Link href="/info/templates" className="hover:text-violet-400 transition-colors">Templates</Link></li>
                    <li><Link href="/info/integrations" className="hover:text-violet-400 transition-colors">Integrations</Link></li>
                    <li><Link href="/info/changelog" className="hover:text-violet-400 transition-colors">Changelog</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6 tracking-wide">RESOURCES</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li><Link href="/info/help-center" className="hover:text-violet-400 transition-colors">Help Center</Link></li>
                    <li><Link href="/info/community" className="hover:text-violet-400 transition-colors">Community</Link></li>
                    <li><Link href="/info/blog" className="hover:text-violet-400 transition-colors">Blog</Link></li>
                    <li><Link href="/info/developers-api" className="hover:text-violet-400 transition-colors">Developers API</Link></li>
                </ul>
            </div>
            <div>
                <h4 className="text-white font-bold mb-6 tracking-wide">LEGAL</h4>
                <ul className="space-y-4 text-sm font-medium">
                    <li><Link href="/info/privacy-policy" className="hover:text-violet-400 transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/info/terms-of-service" className="hover:text-violet-400 transition-colors">Terms of Service</Link></li>
                    <li><Link href="/info/cookie-policy" className="hover:text-violet-400 transition-colors">Cookie Policy</Link></li>
                    <li><Link href="/info/security" className="hover:text-violet-400 transition-colors">Security</Link></li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-8 border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 font-medium">
            <p>© {new Date().getFullYear()} Kidraw Inc. All rights reserved.</p>
        </div>
    </footer>
);

// ==========================================
// MAIN PAGE COMPONENT WITH CONDITIONAL RENDERING
// ==========================================
export default async function DashboardOrLanding({ searchParams }: { searchParams: Promise<{ view?: string }> }) {
    const resolvedParams = await searchParams;
    const view = resolvedParams.view;
    const session = await getServerSession(authOptions);

    async function createNewBoard(formData: FormData) {
        // This function runs on the server when the form is submitted, allowing us to securely access the user's session and interact with the database without exposing any sensitive logic to the client.
        'use server';
        const currentSession = await getServerSession(authOptions);
        if (!currentSession?.user?.id) return;
        const title = formData.get('title') as string || "Untitled Whiteboard";
        const description = formData.get('description') as string;
        const newId = uuidv4();
        await prisma.board.create({ data: { id: newId, authorId: currentSession.user.id, title, description, layers: [], backgroundColor: "#ffffff" } });
        redirect(`/board/${newId}`);
    }

    // ==========================================
    // VIEW 1: THE ANIMATED SAAS LANDING PAGE
    // ==========================================
    if (!session?.user || view === 'landing') {
        return (
            <div className="min-h-screen bg-[#0B0F19] text-slate-50 selection:bg-fuchsia-500/30 overflow-x-hidden flex flex-col font-sans">

                <nav className="h-20 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl px-8 flex items-center justify-between fixed top-0 w-full z-50">
                    <div className="flex items-center gap-10">
                        <Link href="/" className="flex items-center gap-2 cursor-pointer hover:scale-[1.02] transition-transform">
                            <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-violet-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
                            <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-400">
                            <Link href="#how-it-works" className="hover:text-white transition-colors">How it Works</Link>
                            <Link href="#use-cases" className="hover:text-white transition-colors">Use Cases</Link>
                            <Link href="#testimonials" className="hover:text-white transition-colors">Wall of Love</Link>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {session?.user ? (
                            <Link href="/"><Button className="bg-white text-slate-950 hover:bg-slate-200 font-bold rounded-full px-6">Go to Dashboard</Button></Link>
                        ) : (
                            <>
                                <Link href="/api/auth/signin"><Button variant="ghost" className="text-slate-300 hover:text-white hover:bg-white/10 font-medium">Log in</Button></Link>
                                <Link href="/api/auth/signin"><Button className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 font-bold rounded-full px-6">Sign up free</Button></Link>
                            </>
                        )}
                    </div>
                </nav>

                {/* HERO SECTION WITH FLOATING MOCKUP */}
                <div className="relative pt-32 pb-32 overflow-hidden flex-1 mt-20">
                    {/* Animated Glows */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-tr from-violet-600 via-fuchsia-600 to-amber-500 blur-[150px] opacity-20 rounded-full animate-pulse"></div>
                    <div className="absolute inset-0 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:24px_24px] opacity-30"></div>

                    <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-fuchsia-300 mb-8 backdrop-blur-md shadow-lg shadow-fuchsia-500/10">
                            <Sparkles className="w-4 h-4" /> Kidraw v2.0 is now live
                        </div>
                        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8 leading-tight">
                            Where engineering teams <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-fuchsia-400 to-amber-400">
                                think out loud.
                            </span>
                        </h1>
                        <p className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            The ultimate visual workspace. Map complex architectures, wireframe user flows, and collaborate in real-time on an infinite, blazing-fast canvas.
                        </p>
                        <div className="flex justify-center mb-20">
                            <Link href="/api/auth/signin">
                                <Button size="lg" className="bg-white text-slate-950 hover:bg-slate-200 text-lg px-10 py-7 rounded-full shadow-[0_0_50px_rgba(217,70,239,0.3)] transition-all hover:scale-105 font-bold">
                                    Start Drawing Free <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>

                        {/* THE VISUAL SHOWCASE (3D Floating Canvas) */}
                        <div className="relative mx-auto w-full max-w-5xl hidden md:block" style={{ perspective: '1200px' }}>
                            <div className="relative rounded-2xl border border-white/10 bg-[#0F172A]/80 backdrop-blur-xl shadow-2xl overflow-hidden h-[500px] w-full transform rotate-x-[10deg] rotate-y-[-5deg] hover:rotate-x-0 hover:rotate-y-0 transition-transform duration-700 ease-out flex items-center justify-center">
                                {/* Simulated Canvas Background */}
                                <div className="absolute inset-0 bg-[radial-gradient(#ffffff20_1px,transparent_1px)] [background-size:20px_20px]"></div>

                                {/* Simulated Floating UI Tools */}
                                <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-2 flex gap-2">
                                    <div className="w-8 h-8 rounded bg-white/20 flex items-center justify-center"><MousePointer2 className="w-4 h-4 text-white" /></div>
                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><Shapes className="w-4 h-4 text-white" /></div>
                                    <div className="w-8 h-8 rounded bg-white/5 flex items-center justify-center"><Type className="w-4 h-4 text-white" /></div>
                                </div>

                                {/* Simulated Shapes */}
                                <div className="absolute top-[30%] left-[20%] w-48 h-32 bg-indigo-500/30 border-2 border-indigo-400 rounded-xl flex items-center justify-center backdrop-blur-sm shadow-lg shadow-indigo-500/20 animate-pulse">
                                    <span className="font-bold text-indigo-200">Database Layer</span>
                                </div>
                                <div className="absolute top-[40%] right-[25%] w-40 h-40 bg-fuchsia-500/30 border-2 border-fuchsia-400 rounded-full flex items-center justify-center backdrop-blur-sm shadow-lg shadow-fuchsia-500/20">
                                    <span className="font-bold text-fuchsia-200">Load Balancer</span>
                                </div>
                                {/* Simulated Arrow */}
                                <div className="absolute top-[40%] left-[45%] w-32 h-[2px] bg-white/50 rotate-12"></div>
                                <ArrowUpRight className="absolute top-[42%] left-[58%] w-6 h-6 text-white/50" />
                            </div>
                        </div>

                    </div>
                </div>

                {/* HOW TO USE SECTION (Dark Slate Tint) */}
                <div id="how-it-works" className="bg-[#0F172A] py-24 relative z-10 border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">How it works</h2>
                            <p className="text-slate-400 text-xl">Go from chaos to clarity in three simple steps.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                                <div className="w-14 h-14 bg-violet-500/20 border border-violet-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <LayoutDashboard className="w-6 h-6 text-violet-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">1. Initialize</h3>
                                <p className="text-slate-400 text-base leading-relaxed">Create a boundless canvas. Set your environment to dark mode, dotted grid, or solid colors to match your team's focus.</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                                <div className="w-14 h-14 bg-fuchsia-500/20 border border-fuchsia-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Layers className="w-6 h-6 text-fuchsia-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">2. Architect</h3>
                                <p className="text-slate-400 text-base leading-relaxed">Utilize our smart geometry, freehand pens, and image uploads to wireframe databases, UI flows, and logic trees instantly.</p>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-3xl backdrop-blur-md">
                                <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-2xl flex items-center justify-center mb-6">
                                    <Share2 className="w-6 h-6 text-emerald-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">3. Collaborate</h3>
                                <p className="text-slate-400 text-base leading-relaxed">Generate role-based share links. Let stakeholders view, or invite engineers to edit and drop sticky-note comments in real-time.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* WHO IS IT FOR SECTION (Midnight Base) */}
                <div id="use-cases" className="bg-[#0B0F19] max-w-6xl mx-auto px-6 py-24 relative z-10 w-full">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-4">Built for builders.</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                            <FastIcon className="w-10 h-10 text-amber-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Full-Stack Devs</h3>
                            <p className="text-slate-400 text-sm">Visualize complex Next.js, Prisma, and PostgreSQL data schemas before writing code.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                            <ShieldCheck className="w-10 h-10 text-emerald-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">System Architects</h3>
                            <p className="text-slate-400 text-sm">Design load balancers, microservices, and CI/CD pipelines on an infinite grid.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                            <HeartHandshake className="w-10 h-10 text-rose-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">Product Managers</h3>
                            <p className="text-slate-400 text-sm">Wireframe user journeys and gather contextual feedback via sticky-note comments.</p>
                        </div>
                        <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-8 backdrop-blur-md hover:-translate-y-2 transition-transform">
                            <Layers className="w-10 h-10 text-blue-400 mb-6" />
                            <h3 className="text-xl font-bold mb-3">UI/UX Designers</h3>
                            <p className="text-slate-400 text-sm">Rapidly prototype interface layouts and map out component hierarchies.</p>
                        </div>
                    </div>
                </div>

                {/* TESTIMONIALS SECTION (Deep Violet Tint) */}
                <div id="testimonials" className="bg-[#0D0B1A] py-24 relative z-10 border-t border-white/5">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-3xl md:text-5xl font-extrabold mb-12 text-center">Wall of Love</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-white/[0.03] border border-violet-500/20 p-10 rounded-3xl shadow-xl shadow-violet-900/20">
                                <p className="text-xl text-slate-300 italic mb-8">"Kidraw was instrumental when mapping out the real-time websocket infrastructure. The infinite canvas and smart geometry allowed us to see the entire system at a glance."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-violet-500/20 rounded-full flex items-center justify-center border border-violet-500/30 text-violet-300 font-bold text-xl">AL</div>
                                    <div><p className="font-bold text-white text-lg">Alex Larson</p><p className="text-slate-500">Engineering Lead</p></div>
                                </div>
                            </div>
                            <div className="bg-white/[0.03] border border-fuchsia-500/20 p-10 rounded-3xl shadow-xl shadow-fuchsia-900/20">
                                <p className="text-xl text-slate-300 italic mb-8">"Wireframing payment flow logic was effortless. The laser pointer tool made our virtual pitch meetings incredibly seamless and focused."</p>
                                <div className="flex items-center gap-4">
                                    <div className="w-14 h-14 bg-fuchsia-500/20 rounded-full flex items-center justify-center border border-fuchsia-500/30 text-fuchsia-300 font-bold text-xl">SM</div>
                                    <div><p className="font-bold text-white text-lg">Sarah Mitchell</p><p className="text-slate-500">Product Manager</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Footer />
            </div>
        );
    }

    // ==========================================
    // VIEW 2: THE LOGGED-IN DARK AURORA DASHBOARD
    // ==========================================
    const boards = await prisma.board.findMany({ where: { authorId: session.user.id }, orderBy: { updatedAt: 'desc' } });

    return (
        <div className="min-h-screen bg-[#05070B] text-slate-50 flex flex-col font-sans relative overflow-x-hidden">
            <div className="absolute top-0 right-0 w-[600px] h-[400px] bg-violet-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <nav className="h-16 border-b border-white/5 bg-[#0B0F19]/80 backdrop-blur-xl px-8 flex items-center justify-between sticky top-0 z-50">
                <Link href="/?view=landing" className="flex items-center gap-3 cursor-pointer hover:scale-[1.02] transition-transform">
                    <div className="bg-gradient-to-br from-violet-600 to-fuchsia-600 p-2 rounded-xl shadow-lg shadow-violet-500/20"><Sparkles className="w-5 h-5 text-white" /></div>
                    <span className="font-extrabold text-xl text-white tracking-tight">Kidraw</span>
                </Link>

                {/* DROPDOWN MENU WITH FIXED HOVER STYLES & REAL ROUTES */}
                <DropdownMenu>
                    <DropdownMenuTrigger className="outline-none">
                        <Avatar className="h-10 w-10 border-2 border-white/10 shadow-sm ring-2 ring-transparent hover:ring-violet-500 transition-all cursor-pointer">
                            <AvatarImage src={session.user.image || ""} />
                            <AvatarFallback className="bg-slate-800 text-violet-400 font-bold">{session.user.name?.charAt(0) || "U"}</AvatarFallback>
                        </Avatar>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-64 p-2 rounded-xl bg-slate-900 border-white/10 text-slate-50 shadow-2xl">
                        <DropdownMenuLabel className="font-normal pb-3">
                            <div className="flex flex-col space-y-1">
                                <p className="text-sm font-medium leading-none text-white">{session.user.name}</p>
                                <p className="text-xs leading-none text-slate-400">{session.user.email}</p>
                            </div>
                        </DropdownMenuLabel>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            <Link href="/?view=landing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Sparkles className="w-4 h-4 mr-2" /> View Landing Page</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator className="bg-white/10" />
                        <DropdownMenuGroup className="py-1">
                            {/* Note the focus classes used here to override Shadcn's default light-mode focus colors */}
                            <Link href="/info/profile">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><User className="w-4 h-4 mr-2" /> Profile</DropdownMenuItem>
                            </Link>
                            <Link href="/info/settings">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Settings className="w-4 h-4 mr-2" /> Settings</DropdownMenuItem>
                            </Link>
                            <Link href="/info/billing">
                                <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><CreditCard className="w-4 h-4 mr-2" /> Billing</DropdownMenuItem>
                            </Link>
                        </DropdownMenuGroup>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/info/keyboard-shortcuts">
                            <DropdownMenuItem className="cursor-pointer focus:bg-violet-600 focus:text-white rounded-md text-slate-300 transition-colors"><Keyboard className="w-4 h-4 mr-2" /> Keyboard Shortcuts <DropdownMenuShortcut className="text-inherit opacity-70">⌘K</DropdownMenuShortcut></DropdownMenuItem>
                        </Link>

                        <DropdownMenuSeparator className="bg-white/10" />
                        <Link href="/api/auth/signout">
                            <DropdownMenuItem className="cursor-pointer focus:bg-red-600 focus:text-white text-red-400 rounded-md transition-colors">
                                <LogIn className="w-4 h-4 mr-2 rotate-180" /> Log out
                            </DropdownMenuItem>
                        </Link>
                    </DropdownMenuContent>
                </DropdownMenu>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto p-8 relative z-10 mb-20">
                <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-12 mt-6 gap-6">
                    <div><h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My Workspaces</h1><p className="text-slate-400 text-lg">Manage your projects and collaborative sessions.</p></div>

                    <Dialog>
                        <DialogTrigger className="inline-flex items-center justify-center whitespace-nowrap bg-white text-slate-950 hover:bg-slate-200 rounded-full px-8 shadow-[0_0_30px_rgba(139,92,246,0.3)] transition-all hover:scale-105 h-12 font-bold text-sm">
                            <Plus className="w-5 h-5 mr-2" /> New Board
                        </DialogTrigger>
                        <DialogContent className="bg-[#0B0F19] border border-white/10 text-slate-50 sm:max-w-[450px] shadow-[0_0_100px_rgba(139,92,246,0.15)] rounded-2xl p-0 overflow-hidden">
                            <form action={createNewBoard}>
                                <DialogHeader className="px-6 pt-6 mb-2">
                                    <DialogTitle className="text-2xl font-bold">Create New Workspace</DialogTitle>
                                    <DialogDescription className="text-slate-400">Give your whiteboard a name and description to keep your team organized.</DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-5 px-6 py-4">
                                    <div className="grid gap-2">
                                        <label htmlFor="title" className="text-sm font-semibold text-slate-200">Workspace Title</label>
                                        <input id="title" name="title" required placeholder="e.g. System Architecture Diagram" className="flex h-12 w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all" />
                                    </div>
                                    <div className="grid gap-2">
                                        <label htmlFor="description" className="text-sm font-semibold text-slate-200">Description <span className="text-slate-500 font-normal">(Optional)</span></label>
                                        <textarea id="description" name="description" placeholder="Briefly describe the purpose of this board..." className="flex min-h-[100px] w-full rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none transition-all" />
                                    </div>
                                </div>
                                <DialogFooter className="px-6 py-4 border-t border-white/5 bg-[#0B0F19] sm:justify-center">
                                    <Button type="submit" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white hover:from-violet-500 hover:to-fuchsia-500 w-full rounded-xl h-12 font-bold shadow-lg">
                                        Initialize Workspace <ArrowRight className="w-4 h-4 ml-2" />
                                    </Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                {boards.length === 0 ? (
                    <div className="py-32 flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl bg-white/[0.01] backdrop-blur-sm">
                        <div className="bg-violet-500/10 p-5 rounded-2xl mb-6 border border-violet-500/20 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
                            <LayoutDashboard className="w-10 h-10 text-violet-400" />
                        </div>
                        <p className="text-slate-300 font-medium mb-2 text-xl">Your workspace is empty.</p>
                        <p className="text-slate-500 mb-8 max-w-sm text-center">Create a new board to start mapping out your ideas, wireframing, or collaborating with your team.</p>
                    </div>
                ) : (
                    <BoardGrid boards={boards} />
                )}
            </main>
            <Footer />
        </div>
    );
}