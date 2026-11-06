import React, { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useInView } from "motion/react"
import LoginModal from '../components/LoginModal'
import { useDispatch, useSelector } from 'react-redux'
import {
    ArrowRight,
    ArrowUpRight,
    Check,
    ChevronDown,
    Code2,
    Coins,
    Gauge,
    Globe,
    Layers,
    Lock,
    Menu,
    Rocket,
    Sparkles,
    Star,
    Wand2,
    X,
    Zap,
} from "lucide-react"
import { serverUrl } from '../App'
import axios from 'axios'
import { setUserData } from '../redux/userSlice'
import { useNavigate } from 'react-router-dom'

const NAV_LINKS = [
    { label: "Features", href: "#features" },
    { label: "How it works", href: "#how" },
    { label: "Showcase", href: "#showcase" },
    { label: "FAQ", href: "#faq" },
]

const STATS = [
    { value: 25, suffix: "K+", label: "Websites generated" },
    { value: 1.2, suffix: "M+", label: "Lines of code shipped", decimals: 1 },
    { value: 8, suffix: "s", label: "Median build time" },
    { value: 4.9, suffix: "/5", label: "Average rating", decimals: 1 },
]

const STEPS = [
    {
        icon: Wand2,
        title: "Describe your idea",
        body: "Write a prompt in plain English. Tell GenWeb what your site is about, who it's for, and the vibe you want.",
    },
    {
        icon: Sparkles,
        title: "AI builds the site",
        body: "GenWeb generates a complete, multi-section page — copy, layout, animations and responsive styling included.",
    },
    {
        icon: Rocket,
        title: "Edit, publish, ship",
        body: "Refine anything in the built-in editor and publish to a live URL in a single click. No setup required.",
    },
]

const FEATURES = [
    {
        icon: Code2,
        title: "AI code generation",
        body: "Clean, semantic HTML, CSS and JavaScript you can actually read, edit and extend.",
        span: "md:col-span-2",
    },
    {
        icon: Zap,
        title: "Instant live preview",
        body: "Watch your site come together in real time in the editor.",
    },
    {
        icon: Layers,
        title: "Responsive by default",
        body: "Every layout ships mobile-first and scales cleanly to tablet and desktop.",
    },
    {
        icon: Gauge,
        title: "Performance tuned",
        body: "Lightweight output with no bloated dependencies, built to load fast anywhere.",
    },
    {
        icon: Globe,
        title: "Share in one click",
        body: "Publish to a live link instantly and share it with anyone, anywhere.",
    },
    {
        icon: Lock,
        title: "Secure & private",
        body: "Your projects stay private to your account, protected end to end.",
        span: "md:col-span-2",
    },
]

const SHOWCASE = [
    {
        title: "SaaS product launch",
        tag: "Landing page",
        img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20minimal%20dark%20SaaS%20startup%20landing%20page%20website%20mockup%20on%20laptop%20screen%20clean%20typography&image_size=landscape_4_3",
    },
    {
        title: "Creative studio portfolio",
        tag: "Portfolio",
        img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=minimal%20creative%20design%20studio%20portfolio%20website%20mockup%20on%20desktop%20monitor%20clean%20layout&image_size=landscape_4_3",
    },
    {
        title: "Online storefront",
        tag: "E-commerce",
        img: "https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20ecommerce%20online%20store%20website%20mockup%20on%20laptop%20clean%20product%20grid%20dark%20theme&image_size=landscape_4_3",
    },
]

const TESTIMONIALS = [
    {
        name: "Riya Sharma",
        role: "Founder, Lumen Labs",
        quote:
            "We shipped our marketing site in an afternoon. The generated code was clean enough that our engineers just kept building on it.",
    },
    {
        name: "Daniel Okafor",
        role: "Freelance designer",
        quote:
            "The output is genuinely production-ready. I hand clients a real website, not a drag-and-drop compromise.",
    },
    {
        name: "Mei Lin",
        role: "Product lead, Northbeam",
        quote:
            "Prompt to a responsive, animated page in seconds. It completely removed the blank-page problem for our team.",
    },
]

const FAQS = [
    {
        q: "Do I need any coding experience?",
        a: "None at all. Describe what you want in plain English and GenWeb generates the full site. If you do write code, you can open the built-in editor and refine every line.",
    },
    {
        q: "What technology does the generated output use?",
        a: "GenWeb produces standards-based HTML, CSS and JavaScript with responsive layouts and smooth animations — no proprietary lock-in and no runtime dependency you have to maintain.",
    },
    {
        q: "Can I edit the website after it's generated?",
        a: "Yes. Every project stays editable forever. Change copy, colors, sections and layout from the editor, or regenerate specific parts with a new prompt.",
    },
    {
        q: "Is there a free plan?",
        a: "Yes. The Free plan includes 100 credits so you can explore the full generation experience before upgrading.",
    },
    {
        q: "How do credits work?",
        a: "One generation uses credits based on its complexity. Credits never expire, and you can top up any time from the pricing page.",
    },
]

const PLAN_PREVIEW = [
    {
        name: "Free",
        price: "₹0",
        credits: 100,
        description: "Perfect to explore GenWeb.ai",
        features: ["AI website generation", "Responsive HTML output", "Basic animations"],
        popular: false,
    },
    {
        name: "Pro",
        price: "₹499",
        credits: 500,
        description: "For serious creators & freelancers",
        features: ["Everything in Free", "Faster generation", "Edit & regenerate"],
        popular: true,
    },
    {
        name: "Enterprise",
        price: "₹1499",
        credits: 1000,
        description: "For teams & power users",
        features: ["Unlimited iterations", "Highest priority", "Team collaboration"],
        popular: false,
    },
]

function CountUp({ to, suffix = "", decimals = 0, duration = 1.6 }) {
    const ref = useRef(null)
    const inView = useInView(ref, { once: true, amount: 0.4 })
    const [value, setValue] = useState(0)

    useEffect(() => {
        if (!inView) return
        let raf
        const start = performance.now()
        const tick = (now) => {
            const p = Math.min((now - start) / (duration * 1000), 1)
            const eased = 1 - Math.pow(1 - p, 3)
            setValue(to * eased)
            if (p < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
        return () => cancelAnimationFrame(raf)
    }, [inView, to, duration])

    return (
        <span ref={ref}>
            {value.toLocaleString(undefined, {
                minimumFractionDigits: decimals,
                maximumFractionDigits: decimals,
            })}
            {suffix}
        </span>
    )
}

function SectionLabel({ children }) {
    return (
        <span className='inline-block px-3 py-1 rounded-full border border-white/10 bg-white/5 font-mono text-[11px] tracking-widest uppercase text-zinc-400'>
            {children}
        </span>
    )
}

function Home() {

    const [openLogin, setOpenLogin] = useState(false)
    const { userData } = useSelector(state => state.user)
    const [openProfile, setOpenProfile] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [openFaq, setOpenFaq] = useState(0)
    const [websites, setWebsites] = useState(null)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleLogOut = async () => {
        try {
            await axios.get(`${serverUrl}/api/auth/logout`, { withCredentials: true })
            dispatch(setUserData(null))
            setOpenProfile(false)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsites = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/website/get-all`, { withCredentials: true })
                setWebsites(result.data || [])
            } catch (error) {
                console.log(error)
            }
        }
        handleGetAllWebsites()
    }, [userData])

    const primaryCta = () => (userData ? navigate("/dashboard") : setOpenLogin(true))

    return (
        <div className='relative min-h-screen bg-[#040404] text-white overflow-hidden'>

            {/* ---------------- NAVBAR ---------------- */}
            <motion.header
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/40 border-b border-white/10'
            >
                <div className='max-w-7xl mx-auto px-6 py-4 flex justify-between items-center'>
                    <div className='text-lg font-semibold cursor-pointer' onClick={() => navigate("/")}>
                        GenWeb<span className='text-indigo-400'>.ai</span>
                    </div>

                    <nav className='hidden md:flex items-center gap-8 text-sm text-zinc-400'>
                        {NAV_LINKS.map((l) => (
                            <a key={l.href} href={l.href} className='hover:text-white transition'>{l.label}</a>
                        ))}
                        <button className='hover:text-white transition' onClick={() => navigate("/pricing")}>Pricing</button>
                    </nav>

                    <div className='flex items-center gap-3'>
                        {userData && (
                            <div className='hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-sm cursor-pointer hover:bg-white/10 transition' onClick={() => navigate("/pricing")}>
                                <Coins size={14} className='text-yellow-400' />
                                <span className='text-zinc-300'>Credits</span>
                                <span>{userData.credits}</span>
                                <span className='font-semibold'>+</span>
                            </div>
                        )}

                        {!userData ? (
                            <button
                                className='px-4 py-2 rounded-lg border border-white/20 hover:bg-white/10 text-sm transition'
                                onClick={() => setOpenLogin(true)}
                            >
                                Get Started
                            </button>
                        ) : (
                            <div className='relative'>
                                <button className='flex items-center' onClick={() => setOpenProfile(!openProfile)}>
                                    <img src={userData?.avatar || `https://ui-avatars.com/api/?name=${userData.name}`} alt="" referrerPolicy='no-referrer' className='w-9 h-9 rounded-full border border-white/20 object-cover' />
                                </button>
                                <AnimatePresence>
                                    {openProfile && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                            className="absolute right-0 mt-3 w-60 z-50 rounded-xl bg-[#0b0b0b] border border-white/10 shadow-2xl overflow-hidden"
                                        >
                                            <div className='px-4 py-3 border-b border-white/10'>
                                                <p className='text-sm font-medium truncate'>{userData.name}</p>
                                                <p className='text-xs text-zinc-500 truncate'>{userData.email}</p>
                                            </div>

                                            <button className='md:hidden w-full px-4 py-3 flex items-center gap-2 text-sm border-b border-white/10 hover:bg-white/5'>
                                                <Coins size={14} className='text-yellow-400' />
                                                <span className='text-zinc-300'>Credits</span>
                                                <span>{userData.credits}</span>
                                                <span className='font-semibold'>+</span>
                                            </button>

                                            <button className='w-full px-4 py-3 text-left text-sm hover:bg-white/5' onClick={() => navigate("/dashboard")}>Dashboard</button>
                                            <button className='w-full px-4 py-3 text-left text-sm hover:bg-white/5' onClick={() => navigate("/pricing")}>Billing & credits</button>
                                            <button className='w-full px-4 py-3 text-left text-sm text-red-400 hover:bg-white/5' onClick={handleLogOut}>Logout</button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        <button className='md:hidden text-zinc-300' onClick={() => setOpenMenu(!openMenu)}>
                            {openMenu ? <X size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </div>

                <AnimatePresence>
                    {openMenu && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className='md:hidden overflow-hidden border-t border-white/10 bg-black/60'
                        >
                            <div className='px-6 py-4 flex flex-col gap-1'>
                                {NAV_LINKS.map((l) => (
                                    <a key={l.href} href={l.href} onClick={() => setOpenMenu(false)} className='py-3 text-sm text-zinc-300 hover:text-white transition border-b border-white/5'>{l.label}</a>
                                ))}
                                <button className='py-3 text-left text-sm text-zinc-300 hover:text-white transition' onClick={() => { setOpenMenu(false); navigate("/pricing") }}>Pricing</button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.header>

            {/* ---------------- HERO ---------------- */}
            <section className='relative pt-40 pb-24 px-6'>
                <div className='absolute inset-0 pointer-events-none'>
                    <div
                        className='absolute inset-0 opacity-[0.045]'
                        style={{
                            backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)',
                            backgroundSize: '64px 64px',
                            maskImage: 'radial-gradient(ellipse 70% 55% at 50% 0%, #000 40%, transparent 100%)',
                            WebkitMaskImage: 'radial-gradient(ellipse 70% 55% at 50% 0%, #000 40%, transparent 100%)',
                        }}
                    />
                    <div className='absolute -top-40 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-indigo-600/12 blur-[160px] rounded-full' />
                </div>

                <div className='relative max-w-4xl mx-auto text-center'>
                    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                        <SectionLabel>AI website builder</SectionLabel>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.05 }}
                        className="mt-6 text-5xl md:text-7xl font-bold tracking-tight leading-[1.05]"
                    >
                        Build stunning websites <br />
                        <span className='bg-linear-to-r from-indigo-400 via-purple-400 to-blue-400 bg-clip-text text-transparent'>with AI</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className='mt-8 max-w-2xl mx-auto text-zinc-400 text-lg leading-relaxed'
                    >
                        Describe your idea in plain English and GenWeb.ai generates a modern,
                        responsive, production-ready website — clean code, real animations and
                        a scalable structure you can build on.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.25 }}
                        className='mt-10 flex flex-col sm:flex-row items-center justify-center gap-4'
                    >
                        <button
                            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-[1.03] transition"
                            onClick={primaryCta}
                        >
                            {userData ? "Go to dashboard" : "Start building free"}
                            <ArrowRight size={18} className='group-hover:translate-x-0.5 transition' />
                        </button>
                        <a
                            href="#how"
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-white/15 text-zinc-200 hover:bg-white/5 transition font-medium"
                        >
                            See how it works
                        </a>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className='mt-6 font-mono text-xs tracking-wider text-zinc-500 uppercase'
                    >
                        No credit card required · 100 free credits
                    </motion.p>
                </div>

                {/* Browser mockup */}
                <motion.div
                    initial={{ opacity: 0, y: 60, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className='relative max-w-5xl mx-auto mt-20'
                >
                    <div className='rounded-2xl border border-white/10 bg-[#0b0b0b] shadow-[0_40px_120px_rgba(0,0,0,0.7)] overflow-hidden'>
                        <div className='flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/[0.02]'>
                            <span className='w-3 h-3 rounded-full bg-red-500/70' />
                            <span className='w-3 h-3 rounded-full bg-yellow-500/70' />
                            <span className='w-3 h-3 rounded-full bg-green-500/70' />
                            <span className='ml-4 flex-1 max-w-xs truncate rounded-md bg-white/5 border border-white/10 px-3 py-1 font-mono text-[11px] text-zinc-500'>genweb.ai/preview</span>
                        </div>
                        <div className='grid md:grid-cols-2'>
                            <div className='p-6 border-b md:border-b-0 md:border-r border-white/10'>
                                <p className='font-mono text-[11px] tracking-widest uppercase text-zinc-500 mb-3'>Prompt</p>
                                <p className='text-sm text-zinc-300 leading-relaxed'>
                                    A minimal landing page for a fintech startup with a hero, feature grid and pricing section.
                                    <motion.span
                                        animate={{ opacity: [1, 0, 1] }}
                                        transition={{ duration: 1, repeat: Infinity }}
                                        className='inline-block w-[2px] h-4 bg-indigo-400 ml-1 align-middle'
                                    />
                                </p>
                                <div className='mt-6 space-y-3'>
                                    {["Generate", "Live preview", "Publish"].map((s, i) => (
                                        <div key={s} className='flex items-center gap-3 text-sm text-zinc-400'>
                                            <span className='w-5 h-5 rounded-full bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center'>
                                                <Check size={12} className='text-indigo-400' />
                                            </span>
                                            <span>{s}</span>
                                            <span className='ml-auto font-mono text-[11px] text-zinc-600'>0{i + 1}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className='p-6 bg-white/[0.02]'>
                                <p className='font-mono text-[11px] tracking-widest uppercase text-zinc-500 mb-4'>Generated output</p>
                                <div className='space-y-3'>
                                    <div className='h-3 w-3/4 rounded bg-white/15' />
                                    <div className='h-2 w-full rounded bg-white/8' />
                                    <div className='h-2 w-5/6 rounded bg-white/8' />
                                    <div className='grid grid-cols-3 gap-3 pt-3'>
                                        {[0, 1, 2].map(i => (
                                            <div key={i} className='h-20 rounded-lg border border-white/10 bg-white/[0.03]' />
                                        ))}
                                    </div>
                                    <div className='h-9 w-32 rounded-lg bg-indigo-500/80 mt-2' />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </section>

            {/* ---------------- YOUR WEBSITES (logged in) ---------------- */}
            {userData && websites?.length > 0 && (
                <section className='max-w-7xl mx-auto px-6 pb-24'>
                    <div className='flex items-end justify-between mb-6'>
                        <h3 className='text-2xl font-semibold'>Your websites</h3>
                        <button className='text-sm text-zinc-400 hover:text-white transition' onClick={() => navigate("/dashboard")}>View all</button>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {websites.slice(0, 3).map((w) => (
                            <motion.div
                                key={w._id}
                                whileHover={{ y: -6 }}
                                onClick={() => navigate(`/editor/${w._id}`)}
                                className="cursor-pointer rounded-2xl bg-white/5 border border-white/10 overflow-hidden"
                            >
                                <div className='h-40 bg-black'>
                                    <iframe
                                        srcDoc={w.latestCode}
                                        title={w.title}
                                        className='w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white'
                                    />
                                </div>
                                <div className='p-4'>
                                    <h3 className='text-base font-semibold line-clamp-2'>{w.title}</h3>
                                    <p className='font-mono text-xs tracking-wider text-zinc-400'>Last updated {new Date(w.updatedAt).toLocaleDateString()}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </section>
            )}

            {/* ---------------- STATS ---------------- */}
            <section className='border-y border-white/10 bg-white/[0.02]'>
                <div className='max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10'>
                    {STATS.map((s, i) => (
                        <motion.div
                            key={s.label}
                            initial={{ opacity: 0, y: 24 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.4 }}
                            transition={{ delay: i * 0.08 }}
                            className='text-center md:text-left'
                        >
                            <p className='text-4xl md:text-5xl font-bold tracking-tight'>
                                <CountUp to={s.value} suffix={s.suffix} decimals={s.decimals || 0} />
                            </p>
                            <p className='mt-2 font-mono text-xs tracking-wider uppercase text-zinc-500'>{s.label}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- HOW IT WORKS ---------------- */}
            <section id='how' className='max-w-7xl mx-auto px-6 py-28 scroll-mt-24'>
                <div className='max-w-2xl'>
                    <SectionLabel>How it works</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Idea to live website in three steps</h2>
                    <p className='mt-5 text-zinc-400 text-lg'>No templates to wrestle with, no setup, no deployment pipeline. Just describe and ship.</p>
                </div>

                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {STEPS.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: i * 0.12 }}
                            className='relative rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition'
                        >
                            <span className='font-mono text-xs tracking-widest text-zinc-600'>STEP 0{i + 1}</span>
                            <div className='mt-6 w-11 h-11 rounded-xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center'>
                                <s.icon size={20} className='text-indigo-400' />
                            </div>
                            <h3 className='mt-5 text-xl font-semibold'>{s.title}</h3>
                            <p className='mt-3 text-sm text-zinc-400 leading-relaxed'>{s.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- FEATURES ---------------- */}
            <section id='features' className='max-w-7xl mx-auto px-6 py-28 border-t border-white/10 scroll-mt-24'>
                <div className='max-w-2xl'>
                    <SectionLabel>Features</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Everything you need to ship</h2>
                    <p className='mt-5 text-zinc-400 text-lg'>GenWeb.ai builds real websites — clean code, animations, responsiveness and a scalable structure.</p>
                </div>

                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {FEATURES.map((f, i) => (
                        <motion.div
                            key={f.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: (i % 3) * 0.1 }}
                            whileHover={{ y: -6 }}
                            className={`rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-white/20 transition ${f.span || ""}`}
                        >
                            <div className='w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center'>
                                <f.icon size={20} className='text-indigo-400' />
                            </div>
                            <h3 className='mt-5 text-lg font-semibold'>{f.title}</h3>
                            <p className='mt-2 text-sm text-zinc-400 leading-relaxed'>{f.body}</p>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- SHOWCASE ---------------- */}
            <section id='showcase' className='max-w-7xl mx-auto px-6 py-28 border-t border-white/10 scroll-mt-24'>
                <div className='max-w-2xl'>
                    <SectionLabel>Showcase</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Made with GenWeb.ai</h2>
                    <p className='mt-5 text-zinc-400 text-lg'>From SaaS launches to portfolios and storefronts — one prompt, a finished page.</p>
                </div>

                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {SHOWCASE.map((s, i) => (
                        <motion.div
                            key={s.title}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: i * 0.12 }}
                            whileHover={{ y: -6 }}
                            className='group rounded-2xl border border-white/10 bg-white/5 overflow-hidden hover:border-white/20 transition'
                        >
                            <div className='relative h-48 overflow-hidden bg-black'>
                                <img
                                    src={s.img}
                                    alt={s.title}
                                    loading='lazy'
                                    className='w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500'
                                />
                            </div>
                            <div className='p-6 flex items-center justify-between'>
                                <div>
                                    <h3 className='text-base font-semibold'>{s.title}</h3>
                                    <p className='mt-1 font-mono text-[11px] tracking-wider uppercase text-zinc-500'>{s.tag}</p>
                                </div>
                                <ArrowUpRight size={18} className='text-zinc-500 group-hover:text-white transition' />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- TESTIMONIALS ---------------- */}
            <section className='max-w-7xl mx-auto px-6 py-28 border-t border-white/10'>
                <div className='max-w-2xl'>
                    <SectionLabel>Testimonials</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Loved by builders</h2>
                </div>

                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {TESTIMONIALS.map((t, i) => (
                        <motion.div
                            key={t.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: i * 0.12 }}
                            className='rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col'
                        >
                            <div className='flex gap-1 mb-5'>
                                {[0, 1, 2, 3, 4].map(s => <Star key={s} size={14} className='fill-yellow-400 text-yellow-400' />)}
                            </div>
                            <p className='text-sm text-zinc-300 leading-relaxed flex-1'>"{t.quote}"</p>
                            <div className='mt-6 flex items-center gap-3 pt-6 border-t border-white/10'>
                                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}`} alt={t.name} className='w-9 h-9 rounded-full border border-white/10' />
                                <div>
                                    <p className='text-sm font-medium'>{t.name}</p>
                                    <p className='font-mono text-[11px] tracking-wider uppercase text-zinc-500'>{t.role}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- PRICING PREVIEW ---------------- */}
            <section id='pricing' className='max-w-7xl mx-auto px-6 py-28 border-t border-white/10 scroll-mt-24'>
                <div className='max-w-2xl'>
                    <SectionLabel>Pricing</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Simple, transparent pricing</h2>
                    <p className='mt-5 text-zinc-400 text-lg'>Buy credits once. Build anytime. No subscriptions, no surprises.</p>
                </div>

                <div className='mt-16 grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {PLAN_PREVIEW.map((p, i) => (
                        <motion.div
                            key={p.name}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, amount: 0.3 }}
                            transition={{ delay: i * 0.12 }}
                            whileHover={{ y: -8 }}
                            className={`relative rounded-2xl border p-8 backdrop-blur-xl transition ${p.popular ? "border-indigo-500/60 bg-linear-to-b from-indigo-500/15 to-transparent" : "border-white/10 bg-white/5 hover:border-white/20"}`}
                        >
                            {p.popular && (
                                <span className='absolute top-6 right-6 px-3 py-1 text-[11px] rounded-full bg-indigo-500 font-medium'>Most popular</span>
                            )}
                            <h3 className='text-lg font-semibold'>{p.name}</h3>
                            <p className='mt-1 text-sm text-zinc-400'>{p.description}</p>
                            <div className='mt-6 flex items-end gap-1'>
                                <span className='text-4xl font-bold tracking-tight'>{p.price}</span>
                                <span className='text-sm text-zinc-400 mb-1'>/one-time</span>
                            </div>
                            <div className='mt-4 flex items-center gap-2'>
                                <Coins size={16} className='text-yellow-400' />
                                <span className='text-sm font-medium'>{p.credits} credits</span>
                            </div>
                            <ul className='mt-8 space-y-3'>
                                {p.features.map(f => (
                                    <li key={f} className='flex items-center gap-2 text-sm text-zinc-300'>
                                        <Check size={16} className='text-green-400 shrink-0' />
                                        {f}
                                    </li>
                                ))}
                            </ul>
                            <button
                                onClick={() => userData ? navigate("/pricing") : setOpenLogin(true)}
                                className={`mt-8 w-full py-3 rounded-xl font-semibold transition ${p.popular ? "bg-indigo-500 hover:bg-indigo-600" : "bg-white/10 hover:bg-white/20"}`}
                            >
                                {p.name === "Free" ? "Get started" : p.name === "Pro" ? "Upgrade to Pro" : "Contact sales"}
                            </button>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* ---------------- FAQ ---------------- */}
            <section id='faq' className='max-w-3xl mx-auto px-6 py-28 border-t border-white/10 scroll-mt-24'>
                <div className='text-center'>
                    <SectionLabel>FAQ</SectionLabel>
                    <h2 className='mt-5 text-4xl md:text-5xl font-bold tracking-tight'>Questions, answered</h2>
                </div>

                <div className='mt-14 divide-y divide-white/10 border-y border-white/10'>
                    {FAQS.map((f, i) => (
                        <div key={f.q}>
                            <button
                                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                                className='w-full flex items-center justify-between gap-6 py-6 text-left'
                            >
                                <span className='text-base md:text-lg font-medium'>{f.q}</span>
                                <ChevronDown size={20} className={`shrink-0 text-zinc-500 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                            </button>
                            <AnimatePresence initial={false}>
                                {openFaq === i && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className='overflow-hidden'
                                    >
                                        <p className='pb-6 text-sm text-zinc-400 leading-relaxed max-w-2xl'>{f.a}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </section>

            {/* ---------------- FINAL CTA ---------------- */}
            <section className='max-w-7xl mx-auto px-6 pb-28'>
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    className='relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 px-8 py-16 md:py-20 text-center'
                >
                    <div className='absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-indigo-600/20 blur-[140px] rounded-full pointer-events-none' />
                    <div className='relative'>
                        <h2 className='text-3xl md:text-5xl font-bold tracking-tight'>Your next website is one prompt away</h2>
                        <p className='mt-5 max-w-xl mx-auto text-zinc-400'>Start free with 100 credits. Describe your idea and watch it become a real, live website.</p>
                        <button
                            onClick={primaryCta}
                            className='group mt-9 inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-white text-black font-semibold hover:scale-[1.03] transition'
                        >
                            {userData ? "Go to dashboard" : "Get started for free"}
                            <ArrowRight size={18} className='group-hover:translate-x-0.5 transition' />
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* ---------------- FOOTER ---------------- */}
            <footer className='border-t border-white/10'>
                <div className='max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10'>
                    <div className='col-span-2 md:col-span-1'>
                        <div className='text-lg font-semibold'>GenWeb<span className='text-indigo-400'>.ai</span></div>
                        <p className='mt-3 text-sm text-zinc-500 max-w-xs'>The AI website builder for people who want real, production-ready output.</p>
                    </div>

                    <div>
                        <p className='font-mono text-[11px] tracking-widest uppercase text-zinc-500 mb-4'>Product</p>
                        <ul className='space-y-3 text-sm text-zinc-400'>
                            <li><a href="#features" className='hover:text-white transition'>Features</a></li>
                            <li><a href="#showcase" className='hover:text-white transition'>Showcase</a></li>
                            <li><button className='hover:text-white transition' onClick={() => navigate("/pricing")}>Pricing</button></li>
                            <li><button className='hover:text-white transition' onClick={primaryCta}>Dashboard</button></li>
                        </ul>
                    </div>

                    <div>
                        <p className='font-mono text-[11px] tracking-widest uppercase text-zinc-500 mb-4'>Resources</p>
                        <ul className='space-y-3 text-sm text-zinc-400'>
                            <li><a href="#how" className='hover:text-white transition'>How it works</a></li>
                            <li><a href="#faq" className='hover:text-white transition'>FAQ</a></li>
                            <li><a href="#showcase" className='hover:text-white transition'>Templates</a></li>
                        </ul>
                    </div>

                    <div>
                        <p className='font-mono text-[11px] tracking-widest uppercase text-zinc-500 mb-4'>Legal</p>
                        <ul className='space-y-3 text-sm text-zinc-400'>
                            <li><span className='hover:text-white transition cursor-pointer'>Terms of service</span></li>
                            <li><span className='hover:text-white transition cursor-pointer'>Privacy policy</span></li>
                            <li><span className='hover:text-white transition cursor-pointer'>Contact</span></li>
                        </ul>
                    </div>
                </div>
                <div className='border-t border-white/10'>
                    <div className='max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3'>
                        <p className='font-mono text-xs tracking-wider text-zinc-500'>Created By <a href="https://aayushpanchal.in/" target="_blank" rel="noopener noreferrer" className='text-zinc-300 hover:text-white transition'>Aayush Panchal</a></p>
                        <p className='font-mono text-xs tracking-wider text-zinc-500'>&copy; {new Date().getFullYear()} GenWeb.ai — All rights reserved.</p>
                    </div>
                </div>
            </footer>

            {openLogin && <LoginModal open={openLogin} onClose={() => setOpenLogin(false)} />}
        </div>
    )
}

export default Home
