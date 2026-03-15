import { useState, useEffect, useRef } from 'react';
import {
    Gift, Copy, Share2, Users, CheckCircle, IndianRupee,
    Send, Search, ChevronLeft, ChevronRight, Link2,
    MessageCircle, Twitter, Zap, Star, Trophy, ArrowRight
} from 'lucide-react';
import axios from 'axios';
import { useTranslation } from '../hooks/useTranslation';

/* ---------- helpers ---------- */
const BASE_URL = 'https://otras.app/signup?ref=';

function generateCode(user) {
    if (!user) return 'REF000000';
    return user.referralCode || 'REF000000';
}

const PAGE_SIZE = 4;

/* ---------- Confetti ---------- */
function Confetti({ active }) {
    const ref = useRef(null);
    useEffect(() => {
        if (!active || !ref.current) return;
        const canvas = ref.current;
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        const pieces = Array.from({ length: 120 }, () => ({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: Math.random() * 8 + 3,
            c: `hsl(${Math.random() * 360},80%,60%)`,
            s: Math.random() * 3 + 1,
            dx: (Math.random() - 0.5) * 2,
        }));
        let raf;
        let frame = 0;
        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, 2 * Math.PI);
                ctx.fillStyle = p.c;
                ctx.fill();
                p.y += p.s;
                p.x += p.dx;
                if (p.y > canvas.height) { p.y = -10; p.x = Math.random() * canvas.width; }
            });
            frame++;
            if (frame < 200) raf = requestAnimationFrame(draw);
            else ctx.clearRect(0, 0, canvas.width, canvas.height);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, [active]);
    if (!active) return null;
    return (
        <canvas
            ref={ref}
            style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999 }}
        />
    );
}

export default function ReferEarn({ user }) {
    const { t } = useTranslation();
    const code = generateCode(user);
    const referralLink = `${BASE_URL}${code}`;

    const [copied, setCopied]         = useState(false);
    const [confetti, setConfetti]     = useState(false);
    const [search, setSearch]         = useState('');
    const [page, setPage]             = useState(1);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteSent, setInviteSent] = useState(false);

    const [statsData, setStatsData]   = useState({
        totalReferrals: 0,
        creditsEarned: 0,
        availableCredits: user?.credits || 0,
        referralsList: []
    });

    useEffect(() => {
        if (!user?.id) return;
        
        axios.get(`http://localhost:4000/users/${user.id}`).then(res => {
            if (res.data?.credits !== undefined) {
                setStatsData(prev => ({ ...prev, availableCredits: res.data.credits }));
            }
        }).catch(err => console.error(err));

        axios.get(`http://localhost:4000/referrals/stats/${user.id}`).then(res => {
            const data = res.data; // { totalReferrals, creditsEarned, availableCredits, referrals, ... }
            
            setStatsData(prev => ({
                ...prev,
                totalReferrals: data.totalReferrals ?? 0,
                creditsEarned: data.creditsEarned ?? 0,
                availableCredits: data.availableCredits ?? prev.availableCredits,
                referralsList: (data.referrals || []).map(r => ({
                    id: r.id,
                    name: r.refereeOtrId,
                    date: r.createdAt,
                    status: r.status,
                    reward: r.creditsEarned || 0
                }))
            }));
        }).catch(err => console.error(err));
    }, [user?.id]);

    const filtered = statsData.referralsList.filter(r =>
        r.name.toLowerCase().includes(search.toLowerCase())
    );
    const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
    const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

    const copyCode = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const copyLink = () => {
        navigator.clipboard.writeText(referralLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const share = (platform) => {
        const msg = encodeURIComponent(`Join OTRAS with my referral link and get rewards! ${referralLink}`);
        const urls = {
            whatsapp: `https://wa.me/?text=${msg}`,
            telegram: `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${msg}`,
            twitter:  `https://twitter.com/intent/tweet?text=${msg}`,
        };
        window.open(urls[platform], '_blank');
    };

    const sendInvite = () => {
        if (!inviteEmail) return;
        setInviteSent(true);
        setConfetti(true);
        setInviteEmail('');
        setTimeout(() => { setInviteSent(false); setConfetti(false); }, 4000);
    };

    const steps = [
        {
            icon: Share2,
            color: '#2f6ce5',
            bg: '#eaf1ff',
            title: t('shareRefLink'),
            desc: t('shareRefLinkDesc'),
        },
        {
            icon: Users,
            color: '#10b6c8',
            bg: '#e0f9fb',
            title: t('friendJoins'),
            desc: t('friendJoinsDesc'),
        },
        {
            icon: Trophy,
            color: '#f59e0b',
            bg: '#fef9ee',
            title: t('earnCredits'),
            desc: t('earnCreditsDesc'),
        },
    ];

    const stats = [
        { label: t('totalReferrals'),      value: statsData.totalReferrals,   icon: Users,        color: '#2f6ce5', bg: '#eaf1ff' },
        { label: t('totalCreditsEarned'), value: statsData.creditsEarned,    icon: CheckCircle,  color: '#22c55e', bg: '#e7f9ee' },
        { label: t('availableCredits'),    value: statsData.availableCredits, icon: Trophy,       color: '#f59e0b', bg: '#fef9ee' },
    ];

    return (
        <div style={{ maxWidth: 900, margin: '0 auto', padding: '8px 0 40px' }}>
            <Confetti active={confetti} />

            {/* ---------- Header ---------- */}
            <div style={{ marginBottom: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg,var(--color-primary),#10b6c8)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <Gift size={22} color="#fff" />
                    </div>
                    <h1 className="page-title" style={{ margin: 0 }}>{t("referEarnTitle")}</h1>
                </div>
                <p className="text-subtle">
                    {t("referEarnDesc")}
                </p>
            </div>

            {/* ---------- Referral Code Card ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                    <Star size={16} color="var(--color-primary)" />
                    <span className="card-title">{t("yourReferralCode")}</span>
                </div>

                {/* Code display */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    background: 'var(--bg-light)', border: '2px dashed var(--color-primary)',
                    borderRadius: 'var(--radius-lg)', padding: '14px 20px', marginBottom: 20,
                }}>
                    <span style={{
                        fontFamily: 'monospace', fontSize: 26, fontWeight: 800,
                        letterSpacing: 6, color: 'var(--color-primary)', flex: 1,
                    }}>{code}</span>
                    <button
                        className="btn-primary"
                        onClick={copyCode}
                        style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}
                    >
                        <Copy size={14} />
                        {copied ? t('copied') : t('copyCode')}
                    </button>
                </div>

                {/* Referral link */}
                <div style={{ marginBottom: 20 }}>
                    <label className="label" style={{ display: 'block', marginBottom: 6 }}>{t("referralLink")}</label>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <input
                            readOnly
                            value={referralLink}
                            className="input"
                            style={{ flex: 1, background: 'var(--bg-light)', cursor: 'default' }}
                        />
                        <button className="btn-secondary" onClick={copyLink} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Link2 size={14} /> {t("copy")}
                        </button>
                    </div>
                </div>

                {/* Share buttons */}
                <div>
                    <label className="label" style={{ display: 'block', marginBottom: 10 }}>{t("shareVia")}</label>
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {[
                            { key: 'whatsapp', label: 'WhatsApp',  icon: MessageCircle, color: '#25D366', bg: '#e8fdf0' },
                            { key: 'telegram', label: 'Telegram',  icon: Send,          color: '#0088cc', bg: '#e8f5fd' },
                            { key: 'twitter',  label: 'Twitter/X', icon: Twitter,       color: '#1da1f2', bg: '#e8f4ff' },
                        ].map(({ key, label, icon: Icon, color, bg }) => (
                            <button
                                key={key}
                                onClick={() => share(key)}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: 7,
                                    background: bg, color: color,
                                    border: `1px solid ${color}33`,
                                    borderRadius: 'var(--radius-lg)',
                                    padding: '9px 16px',
                                    fontSize: 'var(--text-sm)', fontWeight: 600,
                                    cursor: 'pointer', transition: 'var(--transition-fast)',
                                }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = ''}
                            >
                                <Icon size={15} /> {label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* ---------- Stats ---------- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 16, marginBottom: 24 }}>
                {stats.map(({ label, value, icon: Icon, color, bg }) => (
                    <div key={label} className="app-card hover-lift" style={{ padding: '22px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-lg)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <Icon size={22} color={color} />
                        </div>
                        <div>
                            <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 800, color: 'var(--text-main)', lineHeight: 1.1 }}>{value}</div>
                            <div className="label" style={{ marginTop: 2 }}>{label.toUpperCase()}</div>
                        </div>
                    </div>
                ))}
            </div>

            {/* ---------- How It Works ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <h2 className="section-title" style={{ marginBottom: 20 }}>{t("howItWorks")}</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: 16 }}>
                    {steps.map(({ icon: Icon, color, bg, title, desc }, idx) => (
                        <div key={idx} style={{
                            background: bg, borderRadius: 'var(--radius-lg)', padding: 22,
                            position: 'relative', border: `1px solid ${color}22`,
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                    background: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                }}>
                                    <Icon size={17} color="#fff" />
                                </div>
                                <span style={{
                                    fontSize: 11, fontWeight: 800, color: color,
                                    background: 'white', borderRadius: 999, padding: '2px 10px',
                                    border: `1px solid ${color}33`,
                                }}>STEP {idx + 1}</span>
                            </div>
                            <div style={{ fontSize: 'var(--text-md)', fontWeight: 700, color: 'var(--text-main)', marginBottom: 6 }}>{title}</div>
                            <div style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{desc}</div>
                            {idx < steps.length - 1 && (
                                <div style={{
                                    display: 'none', /* shown on desktop via grid context */
                                }} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* ---------- Referral List ---------- */}
            <div className="app-card" style={{ padding: 28, marginBottom: 24 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 18 }}>
                    <h2 className="section-title" style={{ margin: 0 }}>{t("referralHistory")}</h2>
                    <div style={{ position: 'relative' }}>
                        <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input
                            className="input"
                            placeholder={t("searchNamePlaceholder")}
                            value={search}
                            onChange={e => { setSearch(e.target.value); setPage(1); }}
                            style={{ paddingLeft: 32, width: 200 }}
                        />
                    </div>
                </div>

                {/* Table */}
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
                        <thead>
                            <tr style={{ borderBottom: '2px solid var(--border-light)' }}>
                                {[t('friendOtrId'), t('signupDate'), t('status'), t('creditsEarned')].map(h => (
                                    <th key={h} style={{ textAlign: 'left', padding: '10px 12px', color: 'var(--text-muted)', fontWeight: 700, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em' }}>{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {paginated.length === 0 ? (
                                <tr><td colSpan={4} style={{ textAlign: 'center', padding: 32, color: 'var(--text-muted)' }}>{t("noReferralsFound")}.</td></tr>
                            ) : paginated.map((r, i) => (
                                <tr
                                    key={r.id}
                                    style={{
                                        borderBottom: '1px solid var(--border-light)',
                                        background: i % 2 === 0 ? 'transparent' : 'var(--bg-light)',
                                        transition: 'var(--transition-fast)',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-primary-light)'}
                                    onMouseLeave={e => e.currentTarget.style.background = i % 2 === 0 ? 'transparent' : 'var(--bg-light)'}
                                >
                                    <td style={{ padding: '12px 12px', fontWeight: 600, color: 'var(--text-main)' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 32, height: 32, borderRadius: '50%',
                                                background: 'linear-gradient(135deg,var(--color-primary),#10b6c8)',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                color: '#fff', fontSize: 12, fontWeight: 700, flexShrink: 0,
                                            }}>{r.name[0]}</div>
                                            {r.name}
                                        </div>
                                    </td>
                                    <td style={{ padding: '12px 12px', color: 'var(--text-secondary)' }}>
                                        {new Date(r.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td style={{ padding: '12px 12px' }}>
                                        <span style={{
                                            padding: '4px 12px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                                            background: r.status === 'Qualified Referral' ? '#e7f9ee' : r.status === 'Preparing' ? '#eaf1ff' : '#fff8e1',
                                            color: r.status === 'Qualified Referral' ? '#22c55e' : r.status === 'Preparing' ? '#2f6ce5' : '#f59e0b',
                                            border: `1px solid ${r.status === 'Qualified Referral' ? '#22c55e33' : r.status === 'Preparing' ? '#2f6ce533' : '#f59e0b33'}`,
                                        }}>
                                            {r.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '12px 12px', fontWeight: 700, color: r.reward > 0 ? '#22c55e' : 'var(--text-muted)' }}>
                                        {r.reward > 0 ? `+${r.reward} Credits` : '—'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 8, marginTop: 16 }}>
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            style={{ padding: '6px 10px', opacity: page === 1 ? 0.4 : 1 }}
                        >
                            <ChevronLeft size={14} />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                            <button
                                key={n}
                                onClick={() => setPage(n)}
                                style={{
                                    width: 32, height: 32, borderRadius: 'var(--radius-md)',
                                    background: n === page ? 'var(--color-primary)' : 'transparent',
                                    color: n === page ? '#fff' : 'var(--text-secondary)',
                                    border: `1px solid ${n === page ? 'var(--color-primary)' : 'var(--border-light)'}`,
                                    fontWeight: 600, fontSize: 'var(--text-sm)', cursor: 'pointer',
                                }}
                            >{n}</button>
                        ))}
                        <button
                            className="btn-secondary"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page === totalPages}
                            style={{ padding: '6px 10px', opacity: page === totalPages ? 0.4 : 1 }}
                        >
                            <ChevronRight size={14} />
                        </button>
                    </div>
                )}
            </div>

            {/* ---------- Bottom Row: Reward Rules + Invite ---------- */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16 }}>

                {/* Reward Rules */}
                <div className="app-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
                        <Zap size={16} color="var(--color-primary)" />
                        <h2 className="section-title" style={{ margin: 0 }}>{t("rewardRules")}</h2>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {[
                            { icon: '🏆', text: t('rule1') },
                            { icon: '🔗', text: t('rule2') },
                            { icon: '🎟️', text: t('rule3') },
                            { icon: '♾️', text: t('rule4') },
                            { icon: '📚', text: t('rule5') },
                        ].map(({ icon, text }, i) => (
                            <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                                <span style={{ fontSize: 18, lineHeight: 1.3, flexShrink: 0 }}>{icon}</span>
                                <span style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                                    {text.split('**').map((s, j) => j % 2 === 1
                                        ? <strong key={j} style={{ color: 'var(--text-main)' }}>{s}</strong>
                                        : s
                                    )}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Invite by Email */}
                <div className="app-card" style={{ padding: 28 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                        <Send size={16} color="var(--color-primary)" />
                        <h2 className="section-title" style={{ margin: 0 }}>{t("inviteFriend")}</h2>
                    </div>
                    <p className="text-subtle" style={{ marginBottom: 20 }}>
                        {t("inviteFriendDesc")}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        <input
                            type="email"
                            className="input"
                            placeholder="friend@example.com"
                            value={inviteEmail}
                            onChange={e => setInviteEmail(e.target.value)}
                            style={{ width: '100%' }}
                            onKeyDown={e => e.key === 'Enter' && sendInvite()}
                        />
                        <button
                            className="btn-primary"
                            onClick={sendInvite}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, width: '100%' }}
                        >
                            <Send size={14} />
                            {t("sendInvite")}
                        </button>
                        {inviteSent && (
                            <div style={{
                                display: 'flex', alignItems: 'center', gap: 8,
                                background: '#e7f9ee', color: '#16a34a',
                                borderRadius: 'var(--radius-md)', padding: '10px 14px',
                                fontSize: 'var(--text-sm)', fontWeight: 600,
                            }}>
                                <CheckCircle size={16} /> {t("inviteSentSuccess")}
                            </div>
                        )}
                    </div>

                    {/* Progress bar */}
                    <div style={{ marginTop: 24 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                            <span className="label">{t("availableCreditsUpperCase")}</span>
                            <span className="label" style={{color:"var(--color-primary)"}}>{statsData.availableCredits} {t("creditsReady")}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-fill" style={{ width: `100%`, transition: 'width 0.6s ease', background: 'var(--color-primary)' }} />
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 6 }}>
                            {t("gatherPointsDesc")}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
