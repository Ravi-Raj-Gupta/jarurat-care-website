<!--
  src/routes/cms/+page.svelte
  HIDDEN CONTENT STUDIO — jarurat.care/cms
  Auth : Firebase (Google OAuth + Email/Password) — invite-only
  Data : localStorage + seed JSON — no Firestore
  RBAC : admin · author · reviewer_1 · reviewer_2

  FIXES:
  1. Role cards now always show first before any login form
  2. denied state properly reset; auth loading guards added
  3. resolveProfile only called after user explicitly attempts sign-in
  4. Redesigned auth UI — cleaner, more professional
-->
<script lang="ts">
import { onMount, onDestroy } from 'svelte';
import Nav          from '$lib/components/nav.svelte';
import seedArticles from '$lib/data/articles.json';
import type { SvelteComponent } from 'svelte';

import { initializeApp, getApps } from 'firebase/app';
import {
  getAuth, GoogleAuthProvider,
  signInWithPopup, signOut, onAuthStateChanged,
  signInWithEmailAndPassword, sendPasswordResetEmail,
  type User
} from 'firebase/auth';

import {
  ChevronLeft, ChevronDown, ChevronRight, X, Plus, Trash2, Eye, EyeOff,
  Star, Check, Image as ImageIcon, ArrowUp, ArrowDown, Lock,
  ShieldCheck, Pencil, BookOpen, Award, UserCog,
  BarChart2, FileText, Edit3, AlertCircle,
  LogOut, Download, Bell, GitMerge, Mail, KeyRound,
  RefreshCcw, Users, Clock, Send
} from 'lucide-svelte';

// ─── Firebase ───────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY             ?? '',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN         ?? '',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID          ?? '',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET      ?? '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID ?? '',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID              ?? '',
};
const fbApp = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const auth  = getAuth(fbApp);
const gProv = new GoogleAuthProvider();

// ─── Types ───────────────────────────────────────────────────────────────────
type Role     = 'admin' | 'author' | 'reviewer_1' | 'reviewer_2';
type Status   = 'draft' | 'submitted' | 'under_review_1' | 'changes_requested_1'
              | 'under_review_2' | 'changes_requested_2' | 'published' | 'rejected';
type AuthView = 'landing' | 'email' | 'forgot';
type RoleCard = 'admin' | 'author' | 'approver' | null;
type EditTab  = 'content' | 'seo' | 'citations' | 'settings';

interface UserProfile {
  uid: string; email: string; displayName: string; photoURL: string | null;
  role: Role; active: boolean; verified: boolean; verifiedType: string;
  credentials: string; speciality: string;
}
interface Reference {
  id: string; type: string; authors: string[]; year: number;
  title: string; journal: string; volume: string; issue: string;
  pages: string; doi: string; pmid: string; url: string;
}
interface ArticleDoc {
  id: string; slug: string; status: Status;
  title: string; seoTitle: string; metaDesc: string; ogImage: string;
  excerpt: string; content: string; thumbnail: string;
  category: string; tags: string[]; keywords: string[]; readTime: number;
  videoUrl: string; author: string; date: string;
  coAuthorInvites: string[];
  stage1Approvals: string[]; stage2Approvals: string[];
  references: Reference[];
  isFeatured: boolean; hidden: boolean;
}
interface Notif {
  id: string; type: string; message: string; read: boolean; ts: string;
}

// ─── Role definitions ────────────────────────────────────────────────────────
interface RoleDef {
  role: Role; label: string; caption: string; color: string; bg: string; border: string;
  Icon: typeof SvelteComponent; perms: string[];
}
const ROLES: RoleDef[] = [
  {
    role: 'admin', label: 'Admin', caption: 'Full system control',
    color: '#9B1C1C', bg: '#FEE2E2', border: '#FCA5A5', Icon: ShieldCheck,
    perms: ['Add & remove team members', 'Assign any role', 'Manage all articles', 'Override any workflow step'],
  },
  {
    role: 'author', label: 'Author', caption: 'Write & submit articles',
    color: '#065F46', bg: '#D1FAE5', border: '#6EE7B7', Icon: Pencil,
    perms: ['Create & edit drafts', 'Rich media & citations', 'Invite co-authors', 'Submit for peer review'],
  },
  {
    role: 'reviewer_1', label: 'Reviewer — Stage 1', caption: 'Initial peer review',
    color: '#0C4A6E', bg: '#E0F2FE', border: '#7DD3FC', Icon: BookOpen,
    perms: ['Review submitted articles', 'Approve or request changes', 'Leave inline annotations', '2 approvals advance to Stage 2'],
  },
  {
    role: 'reviewer_2', label: 'Reviewer — Stage 2', caption: 'Senior final approval',
    color: '#3730A3', bg: '#EDE9FE', border: '#C4B5FD', Icon: Award,
    perms: ['Final expert peer review', 'Approve or request changes', '2 approvals auto-publish', 'Highest editorial authority'],
  },
];
function getRoleDef(r: Role): RoleDef { return ROLES.find(d => d.role === r) ?? ROLES[1]; }

interface LandingCard {
  key: RoleCard; label: string; tagline: string; description: string;
  color: string; bg: string; border: string; accentBg: string; Icon: typeof SvelteComponent;
}
const LANDING_CARDS: LandingCard[] = [
  {
    key: 'admin',
    label: 'Admin',
    tagline: 'System Administrator',
    description: 'Full control over the Content Studio — manage team members, assign roles, and oversee the complete article lifecycle.',
    color: '#7F1D1D', bg: '#FFF5F5', border: '#FECACA', accentBg: '#FEE2E2', Icon: ShieldCheck,
  },
  {
    key: 'author',
    label: 'Author',
    tagline: 'Medical Writer & Contributor',
    description: 'Create and edit articles, add citations and rich media, invite co-authors, then submit for peer review.',
    color: '#064E3B', bg: '#F0FDF9', border: '#A7F3D0', accentBg: '#D1FAE5', Icon: Pencil,
  },
  {
    key: 'approver',
    label: 'Reviewer',
    tagline: 'Peer Reviewer & Editor',
    description: 'Review articles for medical accuracy. Approve, reject, or request revisions. Covers both Stage-1 and Stage-2 review.',
    color: '#1E3A8A', bg: '#EFF6FF', border: '#BFDBFE', accentBg: '#DBEAFE', Icon: Award,
  },
];

// ─── Storage ─────────────────────────────────────────────────────────────────
const LS_A = 'jarurat_cms_articles';
const LS_U = 'jarurat_cms_users';
const LS_N = 'jarurat_cms_notifs';

function loadArticles(): ArticleDoc[] {
  try { const r = localStorage.getItem(LS_A); return r ? JSON.parse(r) : (seedArticles as unknown as ArticleDoc[]); }
  catch { return seedArticles as unknown as ArticleDoc[]; }
}
function saveArticles(d: ArticleDoc[]) { localStorage.setItem(LS_A, JSON.stringify(d)); }
function loadUsers(): UserProfile[] {
  try { const r = localStorage.getItem(LS_U); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveUsers(d: UserProfile[]) { localStorage.setItem(LS_U, JSON.stringify(d)); }
function loadNotifs(): Notif[] {
  try { const r = localStorage.getItem(LS_N); return r ? JSON.parse(r) : []; } catch { return []; }
}
function saveNotifs(d: Notif[]) { localStorage.setItem(LS_N, JSON.stringify(d)); }

function addNotif(type: string, message: string) {
  const list = loadNotifs();
  list.unshift({ id: crypto.randomUUID(), type, message, read: false, ts: new Date().toISOString() });
  saveNotifs(list.slice(0, 60));
  notifs    = loadNotifs();
  unreadCnt = notifs.filter(n => !n.read).length;
}

// ─── Keyword extraction ───────────────────────────────────────────────────────
const STOPS = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with',
  'by','from','is','are','was','were','be','been','have','has','had','do','does','did',
  'will','would','could','should','this','that','these','those','not','only','also',
  'study','studies','research','results','patients','patient','clinical','treatment']);
function extractKW(html: string, n = 10) {
  const tokens = html.replace(/<[^>]+>/g,' ').toLowerCase().match(/\b[a-z]{3,}\b/g) ?? [];
  const freq = new Map<string,number>();
  for (const w of tokens) {
    if (STOPS.has(w)) continue;
    const k = w.replace(/ies$/,'y').replace(/s$/,'');
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  return [...freq.entries()].sort((a,b) => b[1]-a[1]).slice(0,n).map(([w,c]) => ({w,c}));
}
function fmtRef(ref: Reference, i: number): string {
  const au = ref.authors.length > 6 ? ref.authors.slice(0,6).join(', ')+', et al' : ref.authors.join(', ');
  let s = `${i}. ${au}. ${ref.title}.`;
  if (ref.journal) s += ` ${ref.journal}.`;
  if (ref.year)    s += ` ${ref.year}`;
  if (ref.volume)  s += `;${ref.volume}`;
  if (ref.issue)   s += `(${ref.issue})`;
  if (ref.pages)   s += `:${ref.pages}`;
  s += '.';
  if (ref.doi)  s += ` doi:${ref.doi}`;
  if (ref.pmid) s += ` PMID:${ref.pmid}`;
  return s.trim();
}

// ─── Auth state ───────────────────────────────────────────────────────────────
let fbUser:       User | null        = null;
let profile:      UserProfile | null = null;
let authLoading   = true;
let authErr       = '';
let authView: AuthView = 'landing';
let selectedCard: RoleCard = null;
let emailVal      = '';
let passVal       = '';
let showPass      = false;
let authBusy      = false;
let resetOk       = false;

$: unlocked  = !!(fbUser && profile && profile.active !== false);
$: isAdmin   = profile?.role === 'admin';
$: isAuthor  = profile?.role === 'author';
$: canWrite  = unlocked && (isAdmin || isAuthor);
$: canReview = unlocked && ['reviewer_1','reviewer_2','admin'].includes(profile?.role ?? '');
$: canUsers  = isAdmin;
// Safe non-null alias — only used inside {#if unlocked} / {#if fbUser && profile} blocks
$: p = profile as UserProfile;

// ─── CMS state ───────────────────────────────────────────────────────────────
let tab        = 'dash';
let exportOpen = false;

let articles:  ArticleDoc[]  = [];
let allUsers:  UserProfile[] = [];
let notifs:    Notif[]       = [];
let unreadCnt  = 0;

let srch   = '', sortBy = 'date', catF = 'All', statF = 'All';
let sel: Set<string> = new Set();
let pg  = 1;
const PP = 8;

let rQueue:    ArticleDoc[]    = [];
let rSelected: ArticleDoc | null = null;
let rAction: 'approved'|'changes_requested'|'rejected' = 'approved';
let rComment   = '';
let rInline: {anchor:string; comment:string}[] = [];
let rAnchor    = '';
let rNote      = '';
let rBusy      = false;
let rDone      = false;

let editing:     Partial<ArticleDoc> | null = null;
let editTab: EditTab = 'content';
let eSaving    = false;
let eSaved     = false;
let showRefDlg = false;
let newRef: Reference = {id:'',type:'doi',authors:[],year:new Date().getFullYear(),title:'',journal:'',volume:'',issue:'',pages:'',doi:'',pmid:'',url:''};
let refAuthors = '';
let coEmail    = '';
let bodyEl: HTMLTextAreaElement;

let focusUid: string | null = null;
$: focusUser = allUsers.find(u => u.uid === focusUid) ?? null;
let uSaving: Record<string,boolean> = {};
let uFlash:  Record<string,string>  = {};

let prevArt: ArticleDoc | null = null;

const CATS = ['News','Blogs','Stories','Wellness','Medical Research','Child Health','Mental Health'];

// ─── Reactive derivations ─────────────────────────────────────────────────────
$: filtered = [...articles].filter(a => {
  const q  = srch.toLowerCase();
  const mQ = a.title?.toLowerCase().includes(q) || (a.author??'').toLowerCase().includes(q);
  const mC = catF==='All' || a.category===catF;
  const mS = statF==='All' ? true
    : statF==='Published' ? a.status==='published'
    : statF==='Draft'     ? a.status==='draft'
    : statF==='Review'    ? (a.status.startsWith('under_review') || a.status==='submitted')
    : statF==='Featured'  ? a.isFeatured
    : statF==='Hidden'    ? a.hidden : true;
  return mQ && mC && mS;
}).sort((a,b) => {
  if (sortBy==='title')    return a.title.localeCompare(b.title);
  if (sortBy==='category') return a.category.localeCompare(b.category);
  return new Date(b.date??0).getTime() - new Date(a.date??0).getTime();
});
$: totalPg   = Math.ceil(filtered.length/PP) || 1;
$: pageItems = filtered.slice((pg-1)*PP, pg*PP);
$: stats = {
  total:    articles.length,
  pub:      articles.filter(a=>a.status==='published').length,
  draft:    articles.filter(a=>a.status==='draft').length,
  review:   articles.filter(a=>a.status?.includes('review')||a.status==='submitted').length,
  featured: articles.filter(a=>a.isFeatured).length,
};
$: liveKW = editing?.content
  ? extractKW(`${editing.title??''} ${editing.excerpt??''} ${editing.content}`, 10)
  : [];

// ─── Color helpers ────────────────────────────────────────────────────────────
const catCol = (c:string) => ({'News':'#065F46','Stories':'#9B1C1C','Wellness':'#14532D','Blogs':'#3730A3','Medical Research':'#713F12','Child Health':'#0C4A6E','Mental Health':'#4C1D95'}[c]??'#374151');
const catBg  = (c:string) => ({'News':'#D1FAE5','Stories':'#FEE2E2','Wellness':'#DCFCE7','Blogs':'#EDE9FE','Medical Research':'#FEF9C3','Child Health':'#E0F2FE','Mental Health':'#F3E8FF'}[c]??'#F1F5F9');
const sLabel = (s:Status) => ({'draft':'Draft','submitted':'Submitted','under_review_1':'Stage-1 Review','changes_requested_1':'Changes Needed','under_review_2':'Stage-2 Review','changes_requested_2':'Changes Needed','published':'Published','rejected':'Rejected'}[s]??s);
const sColor = (s:Status) => ({'draft':'#713F12','submitted':'#0C4A6E','under_review_1':'#065F46','changes_requested_1':'#9B1C1C','under_review_2':'#3730A3','changes_requested_2':'#9B1C1C','published':'#14532D','rejected':'#9B1C1C'}[s]??'#374151');
const sBg    = (s:Status) => ({'draft':'#FEF9C3','submitted':'#E0F2FE','under_review_1':'#D1FAE5','changes_requested_1':'#FEE2E2','under_review_2':'#EDE9FE','changes_requested_2':'#FEE2E2','published':'#DCFCE7','rejected':'#FEE2E2'}[s]??'#F1F5F9');

// ─── Template-safe event handlers ────────────────────────────────────────────
function onSelectAll(e: Event) {
  const v = (e.target as HTMLInputElement).checked;
  sel = v ? new Set(pageItems.map(a=>a.id)) : new Set();
}
function onToggleSel(id: string) {
  const s = new Set(sel);
  if (s.has(id)) { s.delete(id); } else { s.add(id); }
  sel = s;
}
function onTagsChange(e: Event) {
  editing = { ...editing, tags: (e.target as HTMLInputElement).value.split(',').map(t=>t.trim()).filter(Boolean) };
}
function onSetEditTab(t: string) { editTab = (t as EditTab) ?? 'content'; }
function onSetRAction(v: string) { rAction = (v as typeof rAction); }

function onDetailRole(role: string) {
  if (focusUid) updateUser(focusUid, 'role', role);
}
function onDetailSpeciality(e: Event) {
  if (focusUid) updateUser(focusUid, 'speciality', (e.target as HTMLInputElement).value);
}
function onDetailCredentials(e: Event) {
  if (focusUid) updateUser(focusUid, 'credentials', (e.target as HTMLInputElement).value);
}
function onDetailVerified(e: Event) {
  if (focusUid) updateUser(focusUid, 'verified', (e.target as HTMLInputElement).checked);
}
function onDetailToggleActive() {
  if (!focusUid || !focusUser) return;
  updateUser(focusUid, 'active', focusUser.active === false);
}

// ─── Authentication ───────────────────────────────────────────────────────────
// FIX: resolveProfile is now only called after explicit user action,
// not automatically when Firebase restores a session for an unknown user.
// For auto-restored sessions, we silently try to resolve; if denied,
// we sign out quietly and show role cards (not the denied screen).

async function signInGoogle() {
  authErr=''; authBusy=true;
  try {
    const r = await signInWithPopup(auth, gProv);
    const ok = resolveProfile(r.user);
    if (!ok) {
      // Not in allowlist — sign out silently, show denied message inline
      await signOut(auth);
      authErr = 'Your account has not been granted access. Please contact your administrator.';
    }
  }
  catch(e:unknown) { authErr = e instanceof Error ? e.message : 'Google sign-in failed.'; }
  authBusy=false;
}

async function signInEmail() {
  if (!emailVal||!passVal) { authErr='Please enter your email and password.'; return; }
  authErr=''; authBusy=true;
  try {
    const r = await signInWithEmailAndPassword(auth,emailVal,passVal);
    const ok = resolveProfile(r.user);
    if (!ok) {
      await signOut(auth);
      authErr = 'Your account has not been granted access. Please contact your administrator.';
    }
  }
  catch(e:unknown) { authErr = e instanceof Error ? e.message : 'Incorrect email or password.'; }
  authBusy=false;
}

async function doReset() {
  if (!emailVal) { authErr='Please enter your email address first.'; return; }
  authErr=''; authBusy=true;
  try { await sendPasswordResetEmail(auth,emailVal); resetOk=true; }
  catch(e:unknown) { authErr = e instanceof Error ? e.message : 'Reset failed. Please try again.'; }
  authBusy=false;
}

/** Returns true if profile resolved successfully, false if access denied. */
function resolveProfile(u: User): boolean {
  const users  = loadUsers();
  const found   = users.find(p => p.uid===u.uid);
  const byEmail = users.find(p => p.email===u.email && p.uid.startsWith('pending_'));

  if (found) {
    if (found.active===false) { return false; }
    found.displayName = u.displayName ?? found.displayName;
    found.photoURL    = u.photoURL    ?? found.photoURL;
    saveUsers(users); profile = found;
  } else if (byEmail) {
    byEmail.uid         = u.uid;
    byEmail.displayName = u.displayName ?? byEmail.displayName;
    byEmail.photoURL    = u.photoURL ?? null;
    saveUsers(users); profile = byEmail;
  } else if (users.length===0) {
    const p: UserProfile = {
      uid:u.uid, email:u.email??'', displayName:u.displayName??u.email?.split('@')[0]??'Admin',
      photoURL:u.photoURL??null, role:'admin', active:true,
      verified:true, verifiedType:'admin', credentials:'', speciality:'',
    };
    saveUsers([p]); profile=p;
    addNotif('welcome','You are the founding Admin. Add team members in Users & Roles.');
  } else {
    return false; // not in allowlist
  }
  allUsers = loadUsers();
  return true;
}

async function logout() {
  if (!confirm('Log out of the Content Studio?')) return;
  await signOut(auth);
  profile=null; tab='dash'; authView='landing'; selectedCard=null;
  emailVal=''; passVal=''; authErr='';
}

function defaultTab(role: Role): string {
  if (role === 'admin')  return 'dash';
  if (role === 'author') return 'dash';
  return 'review';
}

function selectCard(key: RoleCard) {
  selectedCard = key;
  authView = 'landing';
  authErr = '';
}

function backToCards() {
  selectedCard = null;
  authView = 'landing';
  authErr = '';
}

// ─── User management ─────────────────────────────────────────────────────────
function addUser() {
  const email   = prompt('New member email:')?.trim();
  if (!email) return;
  const display = prompt('Their display name:')?.trim();
  if (!display) return;
  const users = loadUsers();
  if (users.find(u=>u.email===email)) { alert('That email is already in the system.'); return; }
  users.push({
    uid:`pending_${crypto.randomUUID().slice(0,8)}`, email, displayName:display,
    photoURL:null, role:'author', active:true, verified:false, verifiedType:'', credentials:'', speciality:'',
  });
  saveUsers(users); allUsers=loadUsers();
  addNotif('user_added',`${display} (${email}) added as Author.`);
  alert(`${display} has been added. They can sign in with Google using ${email}.`);
}

function updateUser(uid: string, field: string, value: string|boolean) {
  uSaving[uid]=true;
  const users = loadUsers().map(u => u.uid===uid ? {...u,[field]:value} : u);
  saveUsers(users); allUsers=loadUsers();
  if (profile?.uid===uid) profile=allUsers.find(u=>u.uid===uid)??profile;
  if (focusUid===uid)     focusUser=allUsers.find(u=>u.uid===uid)??null;
  uFlash[uid]='✓ Saved'; uSaving[uid]=false;
  setTimeout(()=>{ uFlash={...uFlash,[uid]:''}; },2500);
}

// ─── Article operations ───────────────────────────────────────────────────────
function buildQueue() {
  if (!profile) { rQueue=[]; return; }
  if (profile.role==='admin')           rQueue=articles.filter(a=>['submitted','under_review_1','under_review_2'].includes(a.status));
  else if (profile.role==='reviewer_1') rQueue=articles.filter(a=>a.status==='submitted'||a.status==='under_review_1');
  else if (profile.role==='reviewer_2') rQueue=articles.filter(a=>a.status==='under_review_2');
  else rQueue=[];
}

function submitForReview(id: string) {
  if (!confirm('Submit for peer review? You cannot edit while under review.')) return;
  articles=articles.map(a=>a.id===id?{...a,status:'submitted' as Status}:a);
  saveArticles(articles); buildQueue();
  addNotif('submitted','Article submitted to Stage-1 review queue.');
}

function doReview() {
  if (!profile||!rSelected) return;
  if (!rComment.trim()) { alert('A review comment is required.'); return; }
  rBusy=true;
  const art=rSelected, stage:1|2=profile.role==='reviewer_1'?1:2;
  if (rAction==='rejected') {
    articles=articles.map(a=>a.id===art.id?{...a,status:'rejected' as Status}:a);
    addNotif('rejected',`"${art.title}" rejected at Stage ${stage}.`);
  } else if (rAction==='changes_requested') {
    const ns=(stage===1?'changes_requested_1':'changes_requested_2') as Status;
    articles=articles.map(a=>a.id===art.id?{...a,status:ns}:a);
    addNotif('changes',`Revisions requested on "${art.title}".`);
  } else {
    const field=stage===1?'stage1Approvals':'stage2Approvals';
    const cur=(stage===1?art.stage1Approvals:art.stage2Approvals)??[];
    const upd=cur.includes(profile.uid)?cur:[...cur,profile.uid];
    if (stage===1&&upd.length>=2) {
      articles=articles.map(a=>a.id===art.id?{...a,stage1Approvals:upd,status:'under_review_2' as Status}:a);
      addNotif('stage1_pass',`"${art.title}" passed Stage-1 → Stage-2 review.`);
    } else if (stage===2&&upd.length>=2) {
      articles=articles.map(a=>a.id===art.id?{...a,stage2Approvals:upd,status:'published' as Status,date:new Date().toISOString().slice(0,10)}:a);
      addNotif('published',`🎉 "${art.title}" is now LIVE on the journal!`);
    } else {
      articles=articles.map(a=>a.id===art.id?{...a,[field]:upd}:a);
      addNotif('approval',`${upd.length}/2 Stage-${stage} approvals recorded for "${art.title}".`);
    }
  }
  saveArticles(articles); buildQueue();
  rBusy=false; rDone=true;
  rSelected=null; rComment=''; rInline=[];
  setTimeout(()=>rDone=false,3000);
}

function deleteArt(id:string) {
  if (!confirm('Permanently delete this article?')) return;
  articles=articles.filter(a=>a.id!==id); saveArticles(articles);
}
function toggleFeat(id:string,cur:boolean) { articles=articles.map(a=>a.id===id?{...a,isFeatured:!cur}:a); saveArticles(articles); }
function toggleHide(id:string,cur:boolean) { articles=articles.map(a=>a.id===id?{...a,hidden:!cur}:a); saveArticles(articles); }
function moveArt(id:string,d:-1|1) {
  const idx=filtered.findIndex(a=>a.id===id), swp=filtered[idx+d];
  if (!swp) return;
  const tmp=articles.find(a=>a.id===id)?.date;
  articles=articles.map(a=>{
    if(a.id===id)    return{...a,date:articles.find(x=>x.id===swp.id)?.date??a.date};
    if(a.id===swp.id)return{...a,date:tmp??a.date};
    return a;
  }); saveArticles(articles);
}
function bulkDel() {
  if(!sel.size||!confirm(`Delete ${sel.size} article(s)?`))return;
  articles=articles.filter(a=>!sel.has(a.id)); saveArticles(articles); sel=new Set();
}
function bulkHide() {
  if(!sel.size)return;
  articles=articles.map(a=>sel.has(a.id)?{...a,hidden:true}:a); saveArticles(articles); sel=new Set();
}

// ─── Editor ───────────────────────────────────────────────────────────────────
function openEditor(art:ArticleDoc) {
  editing={...art,tags:Array.isArray(art.tags)?art.tags:[]}; editTab='content'; tab='editor';
}
function newArticle() {
  editing={
    title:'',excerpt:'',content:'',seoTitle:'',metaDesc:'',ogImage:'',thumbnail:'',
    category:'News',tags:[],keywords:[],readTime:5,videoUrl:'',references:[],
    coAuthorInvites:[],isFeatured:false,hidden:false,slug:'',status:'draft' as Status,
    author:profile?.displayName??'', date:new Date().toISOString().slice(0,10),
  }; editTab='content'; tab='editor';
}
function saveArt() {
  if(!profile||!editing)return;
  eSaving=true;
  const kw=extractKW(`${editing.title??''} ${editing.excerpt??''} ${editing.content??''}`,10).map(k=>k.w);
  if(editing.id){
    articles=articles.map(a=>a.id===editing!.id?{...a,...editing,keywords:kw} as ArticleDoc:a);
  } else {
    const slug=editing.slug?.trim()||(editing.title??'').toLowerCase().replace(/\s+/g,'-').replace(/[^a-z0-9-]/g,'');
    const art:ArticleDoc={
      ...(editing as ArticleDoc),id:crypto.randomUUID(),slug,keywords:kw,
      status:'draft',stage1Approvals:[],stage2Approvals:[],coAuthorInvites:[],
      references:editing.references??[],
      author:profile.displayName,date:new Date().toISOString().slice(0,10),
    };
    articles=[art,...articles]; editing={...editing,id:art.id};
  }
  saveArticles(articles); eSaving=false; eSaved=true;
  setTimeout(()=>eSaved=false,2500);
}
function submitArt() { if(!editing?.id)return; saveArt(); submitForReview(editing.id); tab='manage'; }
function insertTag(open:string,close='') {
  if(!bodyEl)return;
  const s=bodyEl.selectionStart,e=bodyEl.selectionEnd;
  const sel=(editing?.content??'').slice(s,e)||'text';
  editing={...editing,content:(editing?.content??'').slice(0,s)+open+sel+close+(editing?.content??'').slice(e)};
}
function addRef() {
  if(!editing)return;
  const ref:Reference={...newRef,id:crypto.randomUUID(),authors:refAuthors.split(';').map(a=>a.trim()).filter(Boolean)};
  editing={...editing,references:[...(editing.references??[]),ref]};
  insertTag(`<sup class="ref-cite"><a href="#ref-${editing.references?.length}">[${editing.references?.length}]</a></sup>`);
  showRefDlg=false;
  newRef={id:'',type:'doi',authors:[],year:new Date().getFullYear(),title:'',journal:'',volume:'',issue:'',pages:'',doi:'',pmid:'',url:''};
  refAuthors='';
}
function addInline() {
  if(!rAnchor||!rNote)return;
  rInline=[...rInline,{anchor:rAnchor,comment:rNote}]; rAnchor=''; rNote='';
}
function addCoAuthor() {
  if(!editing?.id||!coEmail)return;
  const upd=[...(editing.coAuthorInvites??[]),coEmail];
  editing={...editing,coAuthorInvites:upd};
  articles=articles.map(a=>a.id===editing!.id?{...a,coAuthorInvites:upd}:a);
  saveArticles(articles); coEmail='';
}

// ─── Exports ──────────────────────────────────────────────────────────────────
function expJSON(){ dl(new Blob([JSON.stringify(articles,null,2)],{type:'application/json'}),'articles.json'); exportOpen=false; }
function expText(){
  dl(new Blob([articles.map(a=>`TITLE: ${a.title}\nAUTHOR: ${a.author??''}\nCATEGORY: ${a.category}\nDATE: ${a.date??''}\n\n${(a.content??'').replace(/<[^>]+>/g,' ')}\n\n${'─'.repeat(60)}`).join('\n\n')],{type:'text/plain'}),'articles.txt');
  exportOpen=false;
}
function expPDF(){
  const w=window.open('','_blank');
  if(w){
    w.document.write(`<!DOCTYPE html><html><head><meta charset="utf-8"/><title>Jarurat Care Journal</title><style>body{font-family:Georgia,serif;max-width:800px;margin:40px auto;line-height:1.7;color:#0D2561}.h{font-size:1.3rem;font-weight:900;margin:.5rem 0}.m{font-size:.75rem;color:#666;margin-bottom:1rem}.art{margin-bottom:3rem}hr{border:none;border-top:1px solid #eee;margin:2rem 0}</style></head><body><h1 style="color:#0D2561">Jarurat Care Journal</h1>${articles.filter(a=>a.status==='published').map(a=>`<div class="art"><div class="m">${a.category} &middot; ${a.date??''} &middot; ${a.author??''}</div><div class="h">${a.title}</div><p>${a.excerpt??''}</p></div><hr/>`).join('')}</body></html>`);
    w.document.close(); w.focus(); setTimeout(()=>w.print(),400);
  }
  exportOpen=false;
}
function dl(blob:Blob,name:string){const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);}

function readAllNotifs() {
  const u=loadNotifs().map(n=>({...n,read:true})); saveNotifs(u); notifs=u; unreadCnt=0;
}

// ─── Lifecycle ────────────────────────────────────────────────────────────────
let unsubAuth: (()=>void)|null = null;
onMount(() => {
  articles=loadArticles(); allUsers=loadUsers(); notifs=loadNotifs();
  unreadCnt=notifs.filter(n=>!n.read).length;

  unsubAuth=onAuthStateChanged(auth, async u => {
    fbUser=u;
    if (u) {
      // Auto-restore session: try to resolve silently.
      // If not in allowlist, sign out without showing denied screen.
      const ok = resolveProfile(u);
      if (!ok) {
        await signOut(auth);
        fbUser = null;
        // Don't set denied=true — just let role cards show normally
      } else {
        buildQueue();
      }
    } else {
      profile=null;
    }
    authLoading=false;
  });
});
onDestroy(()=>{ unsubAuth?.(); });
</script>

<svelte:head>
  <title>Content Studio — Jarurat Care</title>
  <meta name="robots" content="noindex,nofollow,noarchive,nosnippet"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,700;9..40,900&display=swap" rel="stylesheet"/>
</svelte:head>

<Nav/>

<div style="background:#F4F8FF;min-height:100vh;font-family:'DM Sans',sans-serif;">

<!-- ═══ TOP NAV (logged in) ══════════════════════════════════════════════ -->
{#if unlocked}
<header class="sticky top-0 z-40 border-b border-[#DBEAFE]" style="background:rgba(244,248,255,0.97);backdrop-filter:blur(10px);">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
    <div class="flex items-center gap-2.5 flex-shrink-0">
      {#if fbUser?.photoURL}
        <img src={fbUser.photoURL} alt="" class="w-7 h-7 rounded-full border-2 border-[#DBEAFE]"/>
      {:else}
        <div class="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black text-white flex-shrink-0"
          style="background:{getRoleDef(p.role).color};">
          {profile?.displayName?.[0]?.toUpperCase()??'?'}
        </div>
      {/if}
      <span class="hidden sm:block text-xs font-semibold text-[#0D2561]">{profile?.displayName}</span>
      <span class="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
        style="background:{getRoleDef(p.role).bg};color:{getRoleDef(p.role).color};">
        {getRoleDef(p.role).label}
      </span>
    </div>
    <nav class="flex items-center overflow-x-auto" style="scrollbar-width:none;">
      {#each [
        {id:'dash',   lbl:'Dashboard', Icon:BarChart2, show:true},
        {id:'manage', lbl:'Articles',  Icon:FileText,  show:true},
        {id:'editor', lbl:'New',       Icon:Plus,      show:canWrite},
        {id:'review', lbl:'Review',    Icon:GitMerge,  show:canReview},
        {id:'users',  lbl:'Users',     Icon:Users,     show:canUsers},
        {id:'notifs', lbl:'',          Icon:Bell,      show:true},
      ].filter(t=>t.show) as t}
        <button on:click={()=>{tab=t.id;sel=new Set();exportOpen=false;}}
          class="relative flex items-center gap-1.5 px-3 py-1.5 mx-0.5 text-[11px] font-bold rounded-md transition-all whitespace-nowrap"
          style="{tab===t.id?'background:#1E40AF;color:#fff;':'color:#475569;'}">
          <svelte:component this={t.Icon} size={12}/>
          {#if t.lbl}<span>{t.lbl}</span>{/if}
          {#if t.id==='review'&&rQueue.length>0}
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center bg-red-600 text-white">{rQueue.length}</span>
          {/if}
          {#if t.id==='notifs'&&unreadCnt>0}
            <span class="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] font-black flex items-center justify-center bg-red-600 text-white">{unreadCnt}</span>
          {/if}
        </button>
      {/each}
    </nav>
    <div class="flex items-center gap-1.5 flex-shrink-0">
      <div class="relative">
        <button on:click={()=>exportOpen=!exportOpen}
          class="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-md border border-[#BFDBFE] text-[#1E40AF] hover:bg-[#DBEAFE] transition-colors">
          <Download size={11}/>Export<ChevronDown size={10}/>
        </button>
        {#if exportOpen}
          <div class="absolute right-0 top-full mt-1 z-50 bg-white rounded-xl border border-[#DBEAFE] shadow-xl w-40 py-1.5 overflow-hidden">
            <button on:click={expJSON}  class="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#F4F8FF] text-[#0D2561]">JSON</button>
            <button on:click={expText} class="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#F4F8FF] text-[#0D2561] border-t border-[#F0F7FF]">Plain Text</button>
            <button on:click={expPDF}  class="w-full text-left px-4 py-2.5 text-xs font-bold hover:bg-[#F4F8FF] text-[#0D2561] border-t border-[#F0F7FF]">PDF</button>
          </div>
          <div class="fixed inset-0 z-40" on:click={()=>exportOpen=false} role="presentation"/>
        {/if}
      </div>
      <button on:click={logout}
        class="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-md border border-[#FECDD3] text-[#9B1C1C] hover:bg-[#FEE2E2] transition-colors">
        <LogOut size={11}/>Out
      </button>
      <a href="/articles" class="flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold rounded-md text-[#475569] hover:bg-[#DBEAFE] transition-colors">
        <ChevronLeft size={11}/>Journal
      </a>
    </div>
  </div>
</header>
{/if}

<!-- ═══ PAGE CONTENT ══════════════════════════════════════════════════════ -->
<main class="max-w-7xl mx-auto px-4 sm:px-6 py-8">

<!-- ─── AUTH LOADING ──────────────────────────────────────────────────── -->
{#if authLoading}
  <div class="flex items-center justify-center py-32">
    <div class="text-center">
      <div class="w-10 h-10 rounded-full border-2 border-[#DBEAFE] border-t-[#1E40AF] animate-spin mx-auto mb-4"></div>
      <p class="text-sm font-medium text-[#94A3B8]">Checking session…</p>
    </div>
  </div>

<!-- ─── LOGGED IN → CMS TABS ───────────────────────────────────────────── -->
{:else if unlocked}

  <!-- ═══ DASHBOARD ═══════════════════════════════════════════════════════ -->
  {#if tab==='dash'}
    <div class="flex flex-col gap-6">
      <div class="rounded-2xl p-5 flex items-center gap-4 border-2"
        style="background:{getRoleDef(p.role).bg};border-color:{getRoleDef(p.role).border};">
        <div class="w-11 h-11 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
          <svelte:component this={getRoleDef(p.role).Icon} size={20} style="color:{getRoleDef(p.role).color};"/>
        </div>
        <div class="flex-1">
          <p class="font-black text-[#0D2561] text-lg leading-tight" style="font-family:'DM Serif Display',serif;">
            Welcome back, {profile?.displayName?.split(' ')[0]}
          </p>
          <p class="text-[11px] mt-0.5" style="color:{getRoleDef(p.role).color};">
            {getRoleDef(p.role).label} · {getRoleDef(p.role).caption}
          </p>
        </div>
        {#if canReview && rQueue.length>0}
          <button on:click={()=>tab='review'}
            class="flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl text-white flex-shrink-0" style="background:#9B1C1C;">
            <Clock size={12}/>{rQueue.length} pending
          </button>
        {/if}
      </div>
      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {#each [
          {lbl:'Total',    val:stats.total,    col:'#1E40AF',bg:'#DBEAFE'},
          {lbl:'Published',val:stats.pub,      col:'#065F46',bg:'#D1FAE5'},
          {lbl:'In Review',val:stats.review,   col:'#9B1C1C',bg:'#FEE2E2'},
          {lbl:'Featured', val:stats.featured, col:'#713F12',bg:'#FEF9C3'},
        ] as s}
          <div class="rounded-2xl border-2 p-4" style="background:{s.bg};border-color:{s.col}22;">
            <p class="text-3xl font-black mb-1" style="color:{s.col};font-family:'DM Serif Display',serif;">{s.val}</p>
            <p class="text-[10px] font-black uppercase tracking-wider" style="color:{s.col};">{s.lbl} Articles</p>
          </div>
        {/each}
      </div>
      {#if isAdmin}
        <div class="bg-white rounded-2xl border border-[#DBEAFE] p-5">
          <div class="flex items-center justify-between mb-4">
            <p class="font-black text-[#0D2561]">Team</p>
            <button on:click={addUser} class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg text-white" style="background:#1E40AF;">
              <Plus size={12}/>Add Member
            </button>
          </div>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {#each ROLES as rd}
              {@const n=allUsers.filter(u=>u.role===rd.role).length}
              <div class="rounded-xl p-3 text-center border-2" style="background:{rd.bg};border-color:{rd.border};">
                <p class="text-2xl font-black mb-0.5" style="color:{rd.color};font-family:'DM Serif Display',serif;">{n}</p>
                <p class="text-[10px] font-bold" style="color:{rd.color};">{rd.label}</p>
              </div>
            {/each}
          </div>
        </div>
      {/if}
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {#if canWrite}
          <button on:click={()=>{newArticle();}}
            class="bg-white rounded-2xl border border-[#DBEAFE] p-5 text-left hover:border-[#2563EB] hover:shadow-lg transition-all group">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#DBEAFE]">
              <Plus size={18} style="color:#1E40AF;"/>
            </div>
            <p class="font-black text-[#0D2561] mb-1">Write New Article</p>
            <p class="text-xs text-[#64748B] leading-relaxed">Create a draft, add rich media, citations, and submit for peer review.</p>
          </button>
        {/if}
        <button on:click={()=>tab='manage'}
          class="bg-white rounded-2xl border border-[#DBEAFE] p-5 text-left hover:border-[#2563EB] hover:shadow-lg transition-all">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#EDE9FE]">
            <FileText size={18} style="color:#3730A3;"/>
          </div>
          <p class="font-black text-[#0D2561] mb-1">All Articles</p>
          <p class="text-xs text-[#64748B] leading-relaxed">Search, filter, edit and manage every article in the system.</p>
        </button>
        {#if canReview}
          <button on:click={()=>tab='review'}
            class="bg-white rounded-2xl border border-[#DBEAFE] p-5 text-left hover:border-[#2563EB] hover:shadow-lg transition-all">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style="background:{rQueue.length?'#FEE2E2':'#E0F2FE'};">
              <GitMerge size={18} style="color:{rQueue.length?'#9B1C1C':'#0C4A6E'};"/>
            </div>
            <p class="font-black text-[#0D2561] mb-1">
              Review Queue{#if rQueue.length>0}<span class="text-[#9B1C1C]"> ({rQueue.length})</span>{/if}
            </p>
            <p class="text-xs text-[#64748B] leading-relaxed">Articles awaiting your expert review and approval decision.</p>
          </button>
        {/if}
        {#if canUsers}
          <button on:click={()=>tab='users'}
            class="bg-white rounded-2xl border border-[#DBEAFE] p-5 text-left hover:border-[#2563EB] hover:shadow-lg transition-all">
            <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-3 bg-[#FEE2E2]">
              <UserCog size={18} style="color:#9B1C1C;"/>
            </div>
            <p class="font-black text-[#0D2561] mb-1">Users & Roles</p>
            <p class="text-xs text-[#64748B] leading-relaxed">Add team members, assign roles, and manage access permissions.</p>
          </button>
        {/if}
      </div>
      {#if isAuthor}
        <div class="bg-white rounded-2xl border border-[#DBEAFE] p-5">
          <p class="font-black text-[#0D2561] mb-4">My Articles</p>
          {#each articles.filter(a=>a.author===profile?.displayName).slice(0,6) as art}
            <div class="flex items-center gap-4 py-3 border-b border-[#F0F7FF] last:border-0">
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-[#0D2561] truncate">{art.title}</p>
                <p class="text-[10px] text-[#94A3B8] mt-0.5">{art.date??''}</p>
              </div>
              <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full flex-shrink-0"
                style="background:{sBg(art.status)};color:{sColor(art.status)};">{sLabel(art.status)}</span>
              {#if art.status==='draft'||art.status.startsWith('changes')}
                <div class="flex items-center gap-2 flex-shrink-0">
                  <button on:click={()=>openEditor(art)} class="text-[10px] font-bold text-[#2563EB] hover:underline">Edit</button>
                  <button on:click={()=>submitForReview(art.id)} class="text-[10px] font-bold text-[#9B1C1C] hover:underline flex items-center gap-0.5"><Send size={9}/>Submit</button>
                </div>
              {/if}
            </div>
          {/each}
          {#if !articles.filter(a=>a.author===profile?.displayName).length}
            <p class="text-sm text-[#94A3B8] py-6 text-center">No articles yet. Click "Write New Article" to get started.</p>
          {/if}
        </div>
      {/if}
    </div>

  <!-- ═══ MANAGE ARTICLES ══════════════════════════════════════════════════ -->
  {:else if tab==='manage'}
    <div class="flex flex-col gap-4">
      <div class="bg-white rounded-2xl border border-[#DBEAFE] p-4">
        <div class="flex flex-wrap gap-3 items-center">
          <input type="text" bind:value={srch} placeholder="Search title or author…" class="jc-input flex-1 min-w-48"/>
          <select bind:value={catF}   class="jc-select"><option value="All">All Categories</option>{#each CATS as c}<option>{c}</option>{/each}</select>
          <select bind:value={sortBy} class="jc-select"><option value="date">Date ↓</option><option value="title">Title A–Z</option><option value="category">Category</option></select>
          <select bind:value={statF}  class="jc-select"><option value="All">All Status</option><option value="Published">Published</option><option value="Draft">Draft</option><option value="Review">In Review</option><option value="Featured">Featured</option><option value="Hidden">Hidden</option></select>
          <span class="text-xs font-bold text-[#64748B] ml-auto">{filtered.length} articles</span>
          {#if canWrite}
            <button on:click={newArticle} class="flex items-center gap-1.5 px-4 py-2.5 text-xs font-black rounded-xl text-white" style="background:#1E40AF;">
              <Plus size={12}/>New Article
            </button>
          {/if}
        </div>
        {#if sel.size>0}
          <div class="flex items-center gap-3 pt-3 mt-3 border-t border-[#F0F7FF]">
            <span class="text-xs font-bold text-[#0D2561]">{sel.size} selected</span>
            <button on:click={bulkDel}  class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#FECDD3] text-[#9B1C1C] hover:bg-[#FEE2E2]"><Trash2 size={11}/>Delete</button>
            <button on:click={bulkHide} class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E2E8F0] text-[#475569] hover:bg-[#F8FAFC]"><EyeOff size={11}/>Hide</button>
            <button on:click={()=>sel=new Set()} class="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg border border-[#E2E8F0] text-[#94A3B8] hover:bg-[#F8FAFC]"><X size={11}/>Clear</button>
          </div>
        {/if}
      </div>
      <div class="hidden md:grid rounded-xl px-5 py-3 text-[9px] font-black uppercase tracking-widest"
        style="background:#0D2561;color:#93C5FD;grid-template-columns:2rem 2.5rem 4.5rem 1fr 9rem 8rem 7rem 10rem;">
        <input type="checkbox" class="w-3.5 h-3.5 cursor-pointer accent-[#93C5FD]" on:change={onSelectAll}/>
        <span>#</span><span>Image</span><span>Title</span><span>Category</span><span>Status</span><span>Date</span><span>Actions</span>
      </div>
      {#each pageItems as art, i}
        <div class="bg-white rounded-xl border border-[#DBEAFE] hover:border-[#2563EB] hover:shadow-sm transition-all" class:opacity-40={art.hidden}>
          <div class="hidden md:grid items-center gap-3 px-5 py-3.5"
            style="grid-template-columns:2rem 2.5rem 4.5rem 1fr 9rem 8rem 7rem 10rem;">
            <input type="checkbox" class="w-3.5 h-3.5 cursor-pointer accent-[#1E40AF]" checked={sel.has(art.id)} on:change={()=>onToggleSel(art.id)}/>
            <div class="flex flex-col items-center gap-0.5">
              <span class="text-[9px] font-black text-[#94A3B8]">{String((pg-1)*PP+i+1).padStart(2,'0')}</span>
              <button on:click={()=>moveArt(art.id,-1)} class="w-5 h-4 flex items-center justify-center hover:bg-[#F0F7FF] text-[#BFDBFE] hover:text-[#1E40AF] rounded"><ArrowUp size={9}/></button>
              <button on:click={()=>moveArt(art.id, 1)} class="w-5 h-4 flex items-center justify-center hover:bg-[#F0F7FF] text-[#BFDBFE] hover:text-[#1E40AF] rounded"><ArrowDown size={9}/></button>
            </div>
            <div class="w-full h-10 rounded-md overflow-hidden border border-[#DBEAFE]" style="background:#F4F8FF;">
              {#if art.thumbnail}<img src={art.thumbnail} alt="" class="w-full h-full object-cover"/>{:else}<div class="w-full h-full flex items-center justify-center"><ImageIcon size={12} style="color:#94A3B8;"/></div>{/if}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-bold text-[#0D2561] truncate">{art.title}</p>
              <p class="text-[10px] text-[#94A3B8] mt-0.5">{art.author??''}</p>
              <div class="flex gap-1 mt-1 flex-wrap">
                {#each (art.tags??[]).slice(0,2) as tag}
                  <span class="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-[#F4F8FF] text-[#475569]">#{tag}</span>
                {/each}
              </div>
            </div>
            <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block" style="background:{catBg(art.category)};color:{catCol(art.category)};">{art.category}</span>
            <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block" style="background:{sBg(art.status)};color:{sColor(art.status)};">{sLabel(art.status)}</span>
            <p class="text-[11px] text-[#94A3B8]">{art.date??'—'}</p>
            <div class="flex items-center gap-0.5">
              <button title="Edit"    on:click={()=>openEditor(art)} class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#DBEAFE] text-[#2563EB]"><Edit3 size={13}/></button>
              <button title="Preview" on:click={()=>prevArt=art}    class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#475569]"><Eye size={13}/></button>
              <button title={art.isFeatured?'Unfeature':'Feature'} on:click={()=>toggleFeat(art.id,art.isFeatured)} class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FEF9C3]" style="color:{art.isFeatured?'#713F12':'#CBD5E1'};"><Star size={13}/></button>
              <button title={art.hidden?'Show':'Hide'}   on:click={()=>toggleHide(art.id,art.hidden)} class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#F8FAFC] text-[#94A3B8]">{#if art.hidden}<Eye size={13}/>{:else}<EyeOff size={13}/>{/if}</button>
              <button title="Delete"  on:click={()=>deleteArt(art.id)} class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#FEE2E2] text-[#9B1C1C]"><Trash2 size={13}/></button>
            </div>
          </div>
          <div class="md:hidden p-4 flex items-start gap-3">
            <div class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border border-[#DBEAFE]" style="background:#F4F8FF;">
              {#if art.thumbnail}<img src={art.thumbnail} alt="" class="w-full h-full object-cover"/>{:else}<div class="w-full h-full flex items-center justify-center"><ImageIcon size={14} style="color:#94A3B8;"/></div>{/if}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-sm font-bold text-[#0D2561] line-clamp-2">{art.title}</p>
              <p class="text-[10px] text-[#94A3B8] mt-0.5">{art.author??''} · {art.date??''}</p>
              <div class="flex gap-2 mt-2 flex-wrap">
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style="background:{catBg(art.category)};color:{catCol(art.category)};">{art.category}</span>
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style="background:{sBg(art.status)};color:{sColor(art.status)};">{sLabel(art.status)}</span>
              </div>
              <div class="flex gap-2 mt-2">
                <button on:click={()=>openEditor(art)} class="text-xs font-bold text-[#2563EB] hover:underline">Edit</button>
                <button on:click={()=>prevArt=art}     class="text-xs font-bold text-[#475569] hover:underline">Preview</button>
                <button on:click={()=>deleteArt(art.id)} class="text-xs font-bold text-[#9B1C1C] hover:underline">Delete</button>
              </div>
            </div>
          </div>
        </div>
      {/each}
      {#if filtered.length===0}
        <div class="bg-white rounded-2xl border border-dashed border-[#DBEAFE] py-16 text-center">
          <p class="font-black text-xl text-[#CBD5E1]" style="font-family:'DM Serif Display',serif;">No articles found</p>
        </div>
      {/if}
      {#if totalPg>1}
        <div class="flex items-center justify-between">
          <p class="text-xs text-[#94A3B8] font-bold">Showing {(pg-1)*PP+1}–{Math.min(pg*PP,filtered.length)} of {filtered.length}</p>
          <div class="flex items-center gap-1.5">
            <button on:click={()=>pg=Math.max(1,pg-1)} disabled={pg===1} class="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] disabled:opacity-30">← Prev</button>
            {#each Array.from({length:totalPg},(_,i)=>i+1) as p}
              {#if totalPg<=7||p===1||p===totalPg||Math.abs(p-pg)<=1}
                <button on:click={()=>pg=p} class="w-8 h-8 flex items-center justify-center text-xs font-bold rounded-lg {p===pg?'text-white':'border border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE]'}" style="{p===pg?'background:#1E40AF;':''}">
                  {p}
                </button>
              {:else if Math.abs(p-pg)===2}
                <span class="text-[#94A3B8] text-xs px-1">…</span>
              {/if}
            {/each}
            <button on:click={()=>pg=Math.min(totalPg,pg+1)} disabled={pg===totalPg} class="px-3 py-1.5 text-xs font-bold rounded-lg border border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] disabled:opacity-30">Next →</button>
          </div>
        </div>
      {/if}
    </div>

  <!-- ═══ ARTICLE EDITOR ════════════════════════════════════════════════════ -->
  {:else if tab==='editor'&&editing}
    <div class="max-w-4xl flex flex-col gap-5">
      <div class="flex items-start justify-between flex-wrap gap-3">
        <div>
          <button on:click={()=>tab='manage'} class="flex items-center gap-1 text-xs font-bold text-[#94A3B8] hover:text-[#1E40AF] mb-2"><ChevronLeft size={12}/>Back to Articles</button>
          <h2 class="text-2xl font-black text-[#0D2561]" style="font-family:'DM Serif Display',serif;">{editing.title||'New Article'}</h2>
          {#if editing.id}
            <span class="text-[9px] font-black uppercase px-2.5 py-1 rounded-full mt-1.5 inline-block" style="background:{sBg(editing.status??'draft')};color:{sColor(editing.status??'draft')};">{sLabel(editing.status??'draft')}</span>
          {/if}
        </div>
        <div class="flex items-center gap-2 flex-wrap">
          {#if eSaved}<span class="text-xs font-bold text-[#065F46] bg-[#D1FAE5] px-3 py-2 rounded-lg">✓ Saved</span>{/if}
          <button on:click={saveArt} disabled={eSaving} class="px-4 py-2 text-xs font-black rounded-xl border border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] disabled:opacity-50">{eSaving?'Saving…':'Save Draft'}</button>
          {#if editing.id&&(editing.status==='draft'||(editing.status??'').startsWith('changes'))}
            <button on:click={submitArt} class="px-4 py-2 text-xs font-black rounded-xl text-white flex items-center gap-1.5" style="background:#1E40AF;"><Send size={11}/>Submit for Review</button>
          {/if}
        </div>
      </div>
      <div class="flex gap-0 border-b-2 border-[#E2E8F0]">
        {#each [['content','Content'],['seo','SEO & Meta'],['citations','References'],['settings','Settings']] as [tid,tlbl]}
          <button on:click={()=>onSetEditTab(tid)} class="px-5 py-2.5 text-xs font-black uppercase tracking-wider border-b-2 -mb-px transition-all" style="{editTab===tid?'border-color:#1E40AF;color:#1E40AF;':'border-color:transparent;color:#94A3B8;'}">{tlbl}</button>
        {/each}
      </div>
      {#if editTab==='content'}
        <div class="flex flex-col gap-4">
          <div><span class="jc-label">Headline / Title</span><input bind:value={editing.title} class="jc-input text-xl" placeholder="Your article headline…"/></div>
          <div><span class="jc-label">Abstract / Excerpt</span><textarea bind:value={editing.excerpt} rows={3} class="jc-input resize-none" placeholder="A concise 2–3 sentence summary…"/></div>
          <div>
            <span class="jc-label">Cover Image URL</span>
            <div class="flex gap-3">
              <input bind:value={editing.thumbnail} class="jc-input flex-1" placeholder="https://…"/>
              {#if editing.thumbnail}<img src={editing.thumbnail} alt="" class="w-20 h-14 object-cover rounded-lg border border-[#DBEAFE] flex-shrink-0"/>{/if}
            </div>
          </div>
          <div>
            <span class="jc-label">Article Body (HTML)</span>
            <div class="rounded-t-xl border border-b-0 border-[#DBEAFE] flex flex-wrap gap-1 p-2.5" style="background:#F4F8FF;">
              {#each [['H1','<h1>','</h1>'],['H2','<h2>','</h2>'],['H3','<h3>','</h3>'],['Bold','<strong>','</strong>'],['Italic','<em>','</em>'],['UL','<ul>\n<li>','</li>\n</ul>'],['OL','<ol>\n<li>','</li>\n</ol>'],['Table','<table>\n<thead><tr><th>Col 1</th><th>Col 2</th></tr></thead>\n<tbody><tr><td>','</td><td></td></tr></tbody>\n</table>'],['Code','<pre><code>','</code></pre>'],['Quote','<blockquote>','</blockquote>'],['HR','<hr/>',''],['Image','<figure><img src="URL" alt="Description"/><figcaption>','Caption</figcaption></figure>'],['YouTube','<div class="video-embed"><iframe src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe></div>',''],['Video','<div class="video-embed"><video controls><source src="URL" type="video/mp4"/></video></div>',''],['Chart','<div class="chart-placeholder" data-title="Chart Title">Chart description</div>',''],] as [lbl,open,close]}
                <button on:click={()=>insertTag(open,close)} class="px-2 py-1 text-[10px] font-bold rounded-md border border-[#DBEAFE] text-[#475569] hover:bg-white hover:text-[#1E40AF] hover:border-[#BFDBFE] transition-colors">{lbl}</button>
              {/each}
              <button on:click={()=>showRefDlg=true} class="px-2 py-1 text-[10px] font-black rounded-md text-white transition-colors" style="background:#1E40AF;">Cite ¹</button>
            </div>
            <textarea bind:value={editing.content} bind:this={bodyEl} rows={22} class="jc-input font-mono rounded-t-none border-t-0 resize-y" style="font-size:.78rem;line-height:1.7;" placeholder="<h2>Introduction</h2>&#10;<p>Start writing your article here…</p>"/>
          </div>
          {#if liveKW.length>0}
            <div class="bg-white rounded-xl border border-[#DBEAFE] p-4">
              <p class="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] mb-2">Auto-extracted Keywords</p>
              <div class="flex flex-wrap gap-2">
                {#each liveKW as kw}
                  <span class="text-xs font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE] text-[#1E40AF]" style="background:#F4F8FF;">{kw.w} <span class="text-[#94A3B8]">×{kw.c}</span></span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      {:else if editTab==='seo'}
        <div class="flex flex-col gap-4 max-w-2xl">
          <div><span class="jc-label">SEO Title <span class="normal-case font-normal text-[#94A3B8]">(60 chars max)</span></span><input bind:value={editing.seoTitle} class="jc-input" maxlength={70}/><p class="text-[10px] mt-1 text-[#94A3B8]">{(editing.seoTitle??'').length}/60</p></div>
          <div><span class="jc-label">Meta Description <span class="normal-case font-normal text-[#94A3B8]">(160 chars max)</span></span><textarea bind:value={editing.metaDesc} rows={3} class="jc-input resize-none" maxlength={180}/><p class="text-[10px] mt-1 text-[#94A3B8]">{(editing.metaDesc??'').length}/160</p></div>
          <div><span class="jc-label">OpenGraph Image URL</span><input bind:value={editing.ogImage} class="jc-input" placeholder="https://…"/></div>
          <div><span class="jc-label">URL Slug</span><div class="flex"><span class="px-3 py-3 text-xs rounded-l-xl border border-r-0 border-[#DBEAFE] text-[#94A3B8] whitespace-nowrap" style="background:#F4F8FF;">/articles/</span><input bind:value={editing.slug} class="jc-input rounded-l-none flex-1"/></div></div>
          <div class="p-5 bg-white rounded-xl border border-[#DBEAFE]">
            <p class="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] mb-3">Google SERP Preview</p>
            <p class="text-blue-600 text-lg font-medium leading-tight">{editing.seoTitle||editing.title||'Article Title'}</p>
            <p class="text-green-700 text-xs mt-1">https://jarurat.care/articles/{editing.slug||'article-slug'}</p>
            <p class="text-sm text-[#475569] mt-1 leading-relaxed">{editing.metaDesc||editing.excerpt||'Meta description will appear here…'}</p>
          </div>
        </div>
      {:else if editTab==='citations'}
        <div class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <p class="font-black text-[#0D2561]">{editing.references?.length??0} References</p>
            <button on:click={()=>showRefDlg=true} class="flex items-center gap-1.5 px-4 py-2 text-xs font-black rounded-xl text-white" style="background:#1E40AF;"><Plus size={12}/>Add Reference</button>
          </div>
          {#if editing.references?.length}
            {#each editing.references as ref, i}
              <div class="bg-white rounded-xl border border-[#DBEAFE] p-4 flex items-start gap-4">
                <span class="text-xl font-black text-[#BFDBFE] flex-shrink-0 w-7" style="font-family:'DM Serif Display',serif;">{i+1}</span>
                <div class="flex-1 text-xs text-[#475569] leading-relaxed">{fmtRef(ref,i+1)}</div>
                <div class="flex gap-1.5 flex-shrink-0">
                  {#if ref.doi}<a href="https://doi.org/{ref.doi}" target="_blank" rel="noopener" class="text-[9px] font-black px-2 py-1 rounded-md text-white" style="background:#1E40AF;">DOI</a>{/if}
                  {#if ref.pmid}<a href="https://pubmed.ncbi.nlm.nih.gov/{ref.pmid}/" target="_blank" rel="noopener" class="text-[9px] font-black px-2 py-1 rounded-md" style="background:#E0F2FE;color:#0C4A6E;">PubMed</a>{/if}
                  <button on:click={()=>{editing={...editing,references:editing?.references?.filter(r=>r.id!==ref.id)};}} class="text-xs font-black text-[#9B1C1C] hover:text-red-700 px-1">✕</button>
                </div>
              </div>
            {/each}
            <div class="bg-white rounded-xl border border-dashed border-[#DBEAFE] p-5">
              <p class="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] mb-3">Auto-generated References Section</p>
              <ol class="flex flex-col gap-2 list-decimal list-inside">
                {#each editing.references as ref, i}<li class="text-xs text-[#475569] leading-relaxed">{fmtRef(ref,i+1)}</li>{/each}
              </ol>
            </div>
          {:else}
            <div class="bg-white rounded-xl border border-dashed border-[#DBEAFE] py-12 text-center">
              <p class="font-black text-[#CBD5E1]" style="font-family:'DM Serif Display',serif;">No references yet</p>
              <p class="text-xs text-[#94A3B8] mt-1">Use "Cite ¹" in the toolbar or click "Add Reference" above.</p>
            </div>
          {/if}
        </div>
      {:else if editTab==='settings'}
        <div class="flex flex-col gap-5 max-w-2xl">
          <div class="grid grid-cols-2 gap-4">
            <div><span class="jc-label">Category</span><select bind:value={editing.category} class="jc-input">{#each CATS as c}<option>{c}</option>{/each}</select></div>
            <div><span class="jc-label">Read Time (min)</span><input type="number" bind:value={editing.readTime} class="jc-input" min="1"/></div>
          </div>
          <div><span class="jc-label">Tags <span class="normal-case font-normal text-[#94A3B8]">(comma-separated)</span></span><input value={(editing.tags??[]).join(', ')} on:input={onTagsChange} class="jc-input" placeholder="diabetes, cardiology, india"/></div>
          <div><span class="jc-label">Author Name</span><input bind:value={editing.author} class="jc-input"/></div>
          <div><span class="jc-label">Video URL</span><input bind:value={editing.videoUrl} class="jc-input" placeholder="https://youtube.com/watch?v=…"/></div>
          <button on:click={()=>editing={...editing,isFeatured:!editing?.isFeatured}} class="flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all" style="{editing?.isFeatured?'background:#FEF9C3;border-color:#713F12;':'background:#F8FAFC;border-color:#E2E8F0;'}">
            <Star size={18} style="color:{editing?.isFeatured?'#713F12':'#94A3B8'};"/>
            <div>
              <p class="font-black text-sm text-[#0D2561]">{editing?.isFeatured?'★ Featured Article':'Mark as Featured'}</p>
              <p class="text-xs text-[#64748B] mt-0.5">Featured articles appear in the hero carousel.</p>
            </div>
          </button>
          {#if editing.id}
            <div class="bg-white rounded-2xl border border-[#DBEAFE] p-5">
              <p class="jc-label mb-3">Co-Author Invites</p>
              <div class="flex gap-3">
                <input type="email" bind:value={coEmail} class="jc-input flex-1" placeholder="colleague@hospital.com"/>
                <button on:click={addCoAuthor} class="px-4 py-2 text-xs font-black rounded-xl text-white whitespace-nowrap" style="background:#1E40AF;">Invite</button>
              </div>
              {#if editing.coAuthorInvites?.length}
                <div class="mt-3 flex flex-wrap gap-2">
                  {#each editing.coAuthorInvites as em}
                    <span class="text-xs font-bold px-3 py-1 rounded-full border border-[#DBEAFE] text-[#475569]" style="background:#F4F8FF;">⏳ {em}</span>
                  {/each}
                </div>
              {/if}
            </div>
          {/if}
        </div>
      {/if}
    </div>

  <!-- ═══ REVIEW QUEUE ══════════════════════════════════════════════════════ -->
  {:else if tab==='review'}
    <div class="flex flex-col gap-5">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 class="text-2xl font-black text-[#0D2561]" style="font-family:'DM Serif Display',serif;">Review Queue</h2>
          <p class="text-xs text-[#64748B] mt-1">
            {profile?.role==='reviewer_1'?'Stage 1 — Initial medical accuracy & completeness review (2 approvals required)'
            :profile?.role==='reviewer_2'?'Stage 2 — Senior expert final peer review (2 approvals required to publish)'
            :'Admin — All review stages'}
          </p>
        </div>
        {#if rDone}<div class="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold" style="background:#D1FAE5;color:#065F46;"><Check size={15}/>Review submitted.</div>{/if}
      </div>
      <div class="bg-white rounded-2xl border border-[#DBEAFE] p-4">
        <p class="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] mb-3">Review Pipeline</p>
        <div class="flex items-center gap-1 overflow-x-auto pb-1">
          {#each [{lbl:'Draft',col:'#713F12',bg:'#FEF9C3'},{lbl:'Submitted',col:'#0C4A6E',bg:'#E0F2FE'},{lbl:'Stage 1 (×2)',col:'#065F46',bg:'#D1FAE5'},{lbl:'Stage 2 (×2)',col:'#3730A3',bg:'#EDE9FE'},{lbl:'Published ✓',col:'#14532D',bg:'#DCFCE7'}] as step, si}
            <div class="flex items-center gap-1">
              <div class="flex-shrink-0 rounded-lg px-3 py-2 text-center" style="background:{step.bg};min-width:90px;">
                <p class="text-[10px] font-black whitespace-nowrap" style="color:{step.col};">{step.lbl}</p>
              </div>
              {#if si<4}<ChevronRight size={12} class="text-[#CBD5E1] flex-shrink-0"/>{/if}
            </div>
          {/each}
        </div>
      </div>
      <div class="flex gap-5 flex-wrap lg:flex-nowrap">
        <div class="w-full lg:w-72 flex-shrink-0 flex flex-col gap-2">
          <p class="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">{rQueue.length} article{rQueue.length===1?'':'s'} awaiting review</p>
          {#each rQueue as art}
            <button on:click={()=>{rSelected=art;rAction='approved';rComment='';rInline=[];}} class="bg-white rounded-xl border text-left p-4 hover:border-[#2563EB] hover:shadow-sm transition-all" style="{rSelected?.id===art.id?'border-color:#1E40AF;box-shadow:0 0 0 2px #DBEAFE;':'border-color:#DBEAFE;'}">
              <span class="text-[9px] font-black uppercase tracking-wider" style="color:{sColor(art.status)};">{sLabel(art.status)}</span>
              <p class="text-sm font-black text-[#0D2561] mt-1 leading-snug line-clamp-2" style="font-family:'DM Serif Display',serif;">{art.title}</p>
              <p class="text-[10px] text-[#94A3B8] mt-1">{art.author??''}</p>
              <div class="flex gap-3 mt-1.5 text-[9px] font-bold text-[#94A3B8]"><span>S1: {art.stage1Approvals?.length??0}/2</span><span>S2: {art.stage2Approvals?.length??0}/2</span></div>
            </button>
          {/each}
          {#if rQueue.length===0}
            <div class="bg-white rounded-xl border border-dashed border-[#DBEAFE] py-12 text-center"><Check size={20} class="mx-auto mb-2" style="color:#065F46;"/><p class="text-sm font-black text-[#CBD5E1]">Queue is clear</p></div>
          {/if}
        </div>
        {#if rSelected}
          <div class="flex-1 flex flex-col gap-4 min-w-0">
            <div class="bg-white rounded-2xl border border-[#DBEAFE] p-6 max-h-96 overflow-y-auto">
              <div class="flex items-center gap-2 mb-3 flex-wrap">
                <span class="text-[9px] font-black uppercase px-2 py-0.5 rounded-full" style="background:{catBg(rSelected.category)};color:{catCol(rSelected.category)};">{rSelected.category}</span>
                <span class="text-[10px] text-[#94A3B8]">{rSelected.author??''} · {rSelected.date??''}</span>
              </div>
              <h3 class="text-xl font-black text-[#0D2561] mb-2 leading-snug" style="font-family:'DM Serif Display',serif;">{rSelected.title}</h3>
              <p class="text-sm text-[#475569] mb-4 italic leading-relaxed">{rSelected.excerpt??''}</p>
              <!-- eslint-disable-next-line svelte/no-at-html-tags -->
              <div class="prose-cms text-sm text-[#475569] leading-relaxed">{@html rSelected.content??''}</div>
              {#if rSelected.references?.length}
                <div class="mt-5 pt-4 border-t border-[#F0F7FF]">
                  <p class="text-[9px] font-black uppercase tracking-widest text-[#94A3B8] mb-2">References</p>
                  <ol class="flex flex-col gap-1 list-decimal list-inside">
                    {#each rSelected.references as ref,i}<li class="text-xs text-[#475569]">{fmtRef(ref,i+1)}</li>{/each}
                  </ol>
                </div>
              {/if}
            </div>
            <div class="bg-white rounded-2xl border border-[#DBEAFE] p-6 flex flex-col gap-4">
              <p class="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Your Decision</p>
              <div class="grid grid-cols-3 gap-2">
                {#each [{v:'approved',lbl:'Approve',col:'#065F46',bg:'#D1FAE5'},{v:'changes_requested',lbl:'Request Changes',col:'#713F12',bg:'#FEF9C3'},{v:'rejected',lbl:'Reject',col:'#9B1C1C',bg:'#FEE2E2'}] as opt}
                  <button on:click={()=>onSetRAction(opt.v)} class="py-2.5 text-xs font-black uppercase tracking-wider rounded-xl border-2 transition-all" style="{rAction===opt.v?`background:${opt.bg};border-color:${opt.col};color:${opt.col};`:'background:#F8FAFC;border-color:#E2E8F0;color:#94A3B8;'}">{opt.lbl}</button>
                {/each}
              </div>
              <div>
                <span class="jc-label">Review Comment <span class="text-[#9B1C1C]">*</span></span>
                <textarea bind:value={rComment} rows={4} class="jc-input resize-none" placeholder="Provide your detailed medical assessment…"/>
              </div>
              <div>
                <p class="jc-label mb-2">Inline Annotations</p>
                {#each rInline as ic, i}
                  <div class="flex gap-3 items-start mb-2 p-3 rounded-xl border border-[#F0F7FF]" style="background:#F4F8FF;">
                    <div class="flex-1"><p class="text-[10px] font-bold text-[#94A3B8] mb-0.5">Quoted: <em class="text-[#0D2561] not-italic">"{ic.anchor}"</em></p><p class="text-xs text-[#475569]">{ic.comment}</p></div>
                    <button on:click={()=>rInline=rInline.filter((_,j)=>j!==i)} class="text-xs font-black text-[#9B1C1C]">✕</button>
                  </div>
                {/each}
                <div class="flex flex-col gap-2 mt-1">
                  <input bind:value={rAnchor} class="jc-input" placeholder="Paste the exact text passage to annotate…"/>
                  <div class="flex gap-3"><input bind:value={rNote} class="jc-input flex-1" placeholder="Your annotation or comment…"/><button on:click={addInline} class="px-3 py-2 text-xs font-black rounded-xl border border-[#DBEAFE] text-[#1E40AF] hover:bg-[#DBEAFE] whitespace-nowrap">+ Add</button></div>
                </div>
              </div>
              <button on:click={doReview} disabled={rBusy||!rComment.trim()} class="w-full py-3 font-black text-sm rounded-xl text-white disabled:opacity-50 transition-all" style="background:#1E40AF;">
                {rBusy?'Submitting…':`Submit ${rAction==='approved'?'Approval':rAction==='changes_requested'?'Change Request':'Rejection'}`}
              </button>
            </div>
          </div>
        {:else}
          <div class="flex-1 flex flex-col items-center justify-center bg-white rounded-2xl border border-dashed border-[#DBEAFE] min-h-64 gap-3">
            <GitMerge size={28} style="color:#BFDBFE;"/><p class="font-black text-[#CBD5E1]" style="font-family:'DM Serif Display',serif;">Select an article to review</p>
          </div>
        {/if}
      </div>
    </div>

  <!-- ═══ USERS & ROLES ═════════════════════════════════════════════════════ -->
  {:else if tab==='users'&&canUsers}
    <div class="flex flex-col gap-6">
      <div class="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 class="text-2xl font-black text-[#0D2561]" style="font-family:'DM Serif Display',serif;">Users & Role Management</h2>
          <p class="text-xs text-[#64748B] mt-1">Only invited users can access the Content Studio.</p>
        </div>
        <button on:click={addUser} class="flex items-center gap-2 px-4 py-2.5 text-xs font-black rounded-xl text-white" style="background:#1E40AF;"><Plus size={13}/>Add Team Member</button>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {#each ROLES as rd}
          {@const roleUsers=allUsers.filter(u=>u.role===rd.role)}
          <div class="rounded-2xl border-2 p-4" style="background:{rd.bg};border-color:{rd.border};">
            <div class="flex items-center justify-between mb-3">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center"><svelte:component this={rd.Icon} size={14} style="color:{rd.color};"/></div>
                <p class="text-[11px] font-black uppercase tracking-wider" style="color:{rd.color};">{rd.label}</p>
              </div>
              <span class="text-2xl font-black" style="color:{rd.color};font-family:'DM Serif Display',serif;">{roleUsers.length}</span>
            </div>
            <p class="text-[10px] text-[#475569] mb-3 leading-relaxed">{rd.caption}</p>
            {#each roleUsers.slice(0,3) as u}
              <button on:click={()=>focusUid=focusUid===u.uid?null:u.uid} class="w-full flex items-center gap-2 p-1.5 rounded-lg text-left hover:bg-white/60 transition-colors mb-0.5">
                {#if u.photoURL}<img src={u.photoURL} alt="" class="w-6 h-6 rounded-full flex-shrink-0"/>{:else}<div class="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0" style="background:{rd.color};">{u.displayName?.[0]?.toUpperCase()??'?'}</div>{/if}
                <span class="text-[10px] font-bold truncate" style="color:{rd.color};">{u.displayName}</span>
                {#if focusUid===u.uid}<ChevronDown size={10} style="color:{rd.color};flex-shrink:0;"/>{/if}
              </button>
            {/each}
            {#if roleUsers.length>3}<p class="text-[9px] text-[#94A3B8] mt-1 pl-1">+{roleUsers.length-3} more</p>{/if}
          </div>
        {/each}
      </div>
      {#if focusUser}
        <div class="bg-white rounded-2xl border-2 border-[#DBEAFE] p-6">
          <div class="flex items-start justify-between mb-5">
            <div class="flex items-center gap-3">
              {#if focusUser.photoURL}<img src={focusUser.photoURL} alt="" class="w-12 h-12 rounded-full border-2 border-[#DBEAFE]"/>{:else}<div class="w-12 h-12 rounded-full flex items-center justify-center font-black text-lg text-white" style="background:{getRoleDef(focusUser.role).color};">{focusUser.displayName?.[0]?.toUpperCase()??'?'}</div>{/if}
              <div>
                <p class="font-black text-[#0D2561] text-base">{focusUser.displayName}</p>
                <p class="text-xs text-[#94A3B8]">{focusUser.email}</p>
                {#if uFlash[focusUser.uid]}<p class="text-[10px] font-bold mt-0.5" style="color:{uFlash[focusUser.uid].startsWith('✓')?'#065F46':'#9B1C1C'};">{uFlash[focusUser.uid]}</p>{/if}
              </div>
            </div>
            <button on:click={()=>focusUid=null} class="text-[#94A3B8] hover:text-[#0D2561] p-1"><X size={16}/></button>
          </div>
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
            <div>
              <p class="jc-label mb-2">Assign Role</p>
              <div class="flex flex-col gap-2">
                {#each ROLES as rd}
                  <button on:click={()=>onDetailRole(rd.role)} class="flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition-all" style="{focusUser.role===rd.role?`background:${rd.bg};border-color:${rd.color};`:'background:#F8FAFC;border-color:#E2E8F0;'}">
                    <svelte:component this={rd.Icon} size={13} style="color:{focusUser.role===rd.role?rd.color:'#94A3B8'};"/>
                    <div class="flex-1"><p class="text-[11px] font-black" style="color:{focusUser.role===rd.role?rd.color:'#475569'};">{rd.label}</p><p class="text-[9px] text-[#94A3B8]">{rd.caption}</p></div>
                    {#if focusUser.role===rd.role}<Check size={11} style="color:{rd.color};"/>{/if}
                  </button>
                {/each}
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div><span class="jc-label">Speciality</span><input value={focusUser.speciality??''} on:blur={onDetailSpeciality} class="jc-input" placeholder="e.g. Oncology, Cardiology"/></div>
              <div><span class="jc-label">Credentials</span><input value={focusUser.credentials??''} on:blur={onDetailCredentials} class="jc-input" placeholder="e.g. MD, AIIMS Delhi"/></div>
              <div class="flex items-center gap-3 p-3 rounded-xl border border-[#DBEAFE]" style="background:#F4F8FF;">
                <input type="checkbox" checked={focusUser.verified} on:change={onDetailVerified} class="w-4 h-4 accent-[#1E40AF] cursor-pointer"/>
                <div><p class="text-xs font-bold text-[#0D2561]">Verified Badge</p><p class="text-[10px] text-[#94A3B8]">Displayed on their published articles</p></div>
              </div>
            </div>
            <div class="flex flex-col gap-3">
              <div class="p-4 rounded-xl border border-[#DBEAFE]" style="background:#F4F8FF;">
                <p class="text-[10px] font-black uppercase tracking-wider text-[#94A3B8] mb-2">Account Status</p>
                <div class="flex items-center gap-2"><div class="w-2.5 h-2.5 rounded-full" style="background:{focusUser.active!==false?'#065F46':'#9B1C1C'};"></div><span class="text-sm font-bold" style="color:{focusUser.active!==false?'#065F46':'#9B1C1C'};">{focusUser.active!==false?'Active':'Deactivated'}</span></div>
                <p class="text-[10px] text-[#94A3B8] mt-1">{focusUser.active!==false?'User can sign in and access the CMS.':'User is blocked from signing in.'}</p>
              </div>
              <button on:click={onDetailToggleActive} class="px-4 py-2.5 text-xs font-black rounded-xl border-2 transition-all" style="{focusUser.active!==false?'border-color:#FECDD3;color:#9B1C1C;background:#FFF1F2;':'border-color:#D1FAE5;color:#065F46;background:#F0FFF4;'}">{focusUser.active!==false?'Deactivate User':'Reactivate User'}</button>
            </div>
          </div>
        </div>
      {/if}
      <div class="bg-white rounded-2xl border border-[#DBEAFE] overflow-hidden">
        <div class="hidden md:grid px-5 py-3 text-[9px] font-black uppercase tracking-widest" style="background:#0D2561;color:#93C5FD;grid-template-columns:3rem 1fr 12rem 8rem 7rem;">
          <span>#</span><span>User</span><span>Role</span><span>Status</span><span>Action</span>
        </div>
        {#each allUsers as u, i}
          <div class="grid items-center px-5 py-3.5 gap-4 border-b border-[#F0F7FF] last:border-0 hover:bg-[#F4F8FF] transition-colors" style="grid-template-columns:3rem 1fr 12rem 8rem 7rem;">
            <span class="text-xs font-black text-[#CBD5E1]">{i+1}</span>
            <div class="flex items-center gap-2 min-w-0">
              {#if u.photoURL}<img src={u.photoURL} alt="" class="w-7 h-7 rounded-full flex-shrink-0"/>{:else}<div class="w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black text-white flex-shrink-0" style="background:{getRoleDef(u.role).color};">{u.displayName?.[0]?.toUpperCase()??'?'}</div>{/if}
              <div class="min-w-0"><p class="text-xs font-bold text-[#0D2561] truncate">{u.displayName}</p><p class="text-[10px] text-[#94A3B8] truncate">{u.email}</p></div>
            </div>
            <span class="text-[9px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full inline-block" style="background:{getRoleDef(u.role).bg};color:{getRoleDef(u.role).color};">{getRoleDef(u.role).label}</span>
            <div class="flex items-center gap-1.5"><div class="w-2 h-2 rounded-full" style="background:{u.active!==false?'#065F46':'#9B1C1C'};"></div><span class="text-[10px] font-bold" style="color:{u.active!==false?'#065F46':'#9B1C1C'};">{u.active!==false?'Active':'Inactive'}</span></div>
            <button on:click={()=>focusUid=focusUid===u.uid?null:u.uid} class="text-[10px] font-bold text-[#2563EB] hover:underline">{focusUid===u.uid?'Close':'Manage'}</button>
          </div>
        {/each}
        {#if allUsers.length===0}<p class="p-8 text-center text-sm text-[#94A3B8]">No users yet. Click "Add Team Member" to invite your first staff member.</p>{/if}
      </div>
    </div>

  <!-- ═══ NOTIFICATIONS ═════════════════════════════════════════════════════ -->
  {:else if tab==='notifs'}
    <div class="max-w-2xl flex flex-col gap-3">
      <div class="flex items-center justify-between">
        <h2 class="text-2xl font-black text-[#0D2561]" style="font-family:'DM Serif Display',serif;">Notifications</h2>
        {#if unreadCnt>0}<button on:click={readAllNotifs} class="text-xs font-bold text-[#2563EB] hover:underline">Mark all read</button>{/if}
      </div>
      {#each notifs as n}
        <div class="bg-white rounded-xl border p-4 flex items-start gap-3" style="{n.read?'border-color:#F0F7FF;':'border-color:#BFDBFE;border-left:3px solid #1E40AF;'}">
          <div class="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style="background:{n.type.includes('publish')||n.type.includes('pass')?'#D1FAE5':n.type.includes('reject')?'#FEE2E2':'#DBEAFE'};"><Bell size={13} style="color:{n.type.includes('publish')||n.type.includes('pass')?'#065F46':n.type.includes('reject')?'#9B1C1C':'#1E40AF'};"/></div>
          <div class="flex-1 min-w-0"><p class="text-sm font-bold text-[#0D2561] leading-snug">{n.message}</p><p class="text-[10px] text-[#94A3B8] mt-0.5">{n.ts?new Date(n.ts).toLocaleString():'Just now'}</p></div>
          {#if !n.read}<div class="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style="background:#1E40AF;"></div>{/if}
        </div>
      {/each}
      {#if notifs.length===0}
        <div class="bg-white rounded-xl border border-dashed border-[#DBEAFE] py-16 text-center"><Bell size={24} class="mx-auto mb-2" style="color:#CBD5E1;"/><p class="font-black text-[#CBD5E1]" style="font-family:'DM Serif Display',serif;">No notifications yet</p></div>
      {/if}
    </div>
  {/if}

<!-- ─── NOT LOGGED IN → AUTH SCREEN ──────────────────────────────────────── -->
{:else}
  <!-- ══════════════════════════════════════════════════════════════════════
       REDESIGNED AUTH / LANDING PAGE
       Step 1: Choose your role (always shows first)
       Step 2: Sign in for that role
       ══════════════════════════════════════════════════════════════════════ -->
  <div class="min-h-[80vh] flex flex-col">

    <!-- Header -->
    <div class="text-center pt-10 pb-8">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-5 border"
        style="background:#EFF6FF;border-color:#BFDBFE;color:#1E40AF;">
        <Lock size={9}/>Invite-only access
      </div>
      <h1 class="text-3xl sm:text-4xl font-black text-[#0D2561] leading-tight mb-3"
        style="font-family:'DM Serif Display',serif;">
        Content Studio
      </h1>
      <p class="text-sm text-[#64748B] max-w-md mx-auto leading-relaxed">
        Jarurat Care's peer-reviewed publishing platform.
        {#if !selectedCard}Select your role to continue.{:else}Sign in to access your workspace.{/if}
      </p>
    </div>

    <!-- Step indicator -->
    <div class="flex items-center justify-center gap-2 mb-8">
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
          style="background:{!selectedCard?'#1E40AF':'#065F46'};color:white;">
          {!selectedCard?'1':'✓'}
        </div>
        <span class="text-xs font-bold" style="color:{!selectedCard?'#1E40AF':'#065F46'};">Choose Role</span>
      </div>
      <div class="w-8 h-px" style="background:{selectedCard?'#1E40AF':'#CBD5E1'};"></div>
      <div class="flex items-center gap-2">
        <div class="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black"
          style="background:{selectedCard?'#1E40AF':'#E2E8F0'};color:{selectedCard?'white':'#94A3B8'};">2</div>
        <span class="text-xs font-bold" style="color:{selectedCard?'#1E40AF':'#94A3B8'};">Sign In</span>
      </div>
    </div>

    {#if !selectedCard}
      <!-- ── STEP 1: Role Cards ─────────────────────────────────────────── -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto w-full">
        {#each LANDING_CARDS as card}
          <button
            on:click={() => selectCard(card.key)}
            class="group rounded-2xl p-6 border-2 text-left transition-all duration-200 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2"
            style="background:{card.bg};border-color:{card.border};--tw-ring-color:{card.border};">

            <!-- Icon -->
            <div class="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
              style="background:{card.accentBg};">
              <svelte:component this={card.Icon} size={22} style="color:{card.color};"/>
            </div>

            <!-- Text -->
            <p class="text-base font-black mb-0.5" style="color:{card.color};">{card.label}</p>
            <p class="text-[11px] font-semibold mb-3" style="color:{card.color}99;">{card.tagline}</p>
            <p class="text-xs leading-relaxed mb-5" style="color:#475569;">{card.description}</p>

            <!-- CTA -->
            <div class="flex items-center gap-1.5 text-xs font-black transition-all duration-150 group-hover:gap-2.5"
              style="color:{card.color};">
              Sign in as {card.label}
              <span class="inline-flex items-center justify-center w-5 h-5 rounded-full transition-all duration-150 group-hover:translate-x-0.5"
                style="background:{card.accentBg};">
                <ChevronRight size={11}/>
              </span>
            </div>
          </button>
        {/each}
      </div>
      <p class="text-center text-[11px] text-[#94A3B8] mt-6">
        Don't have access? Contact your system administrator.
      </p>

    {:else}
      <!-- ── STEP 2: Sign-in form ───────────────────────────────────────── -->
      {@const card = LANDING_CARDS.find(c => c.key === selectedCard)}
      {#if card}
        <div class="max-w-sm mx-auto w-full">

          <!-- Back button -->
          <button on:click={backToCards}
            class="flex items-center gap-1.5 text-xs font-bold mb-5 px-3 py-1.5 rounded-lg border transition-colors"
            style="color:#64748B;border-color:#E2E8F0;background:white;">
            <ChevronLeft size={13}/>Back to roles
          </button>

          <div class="bg-white rounded-2xl shadow-sm border-2 overflow-hidden" style="border-color:{card.border};">

            <!-- Card header -->
            <div class="px-6 py-5 flex items-center gap-3 border-b" style="background:{card.bg};border-color:{card.border};">
              <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                style="background:{card.accentBg};">
                <svelte:component this={card.Icon} size={18} style="color:{card.color};"/>
              </div>
              <div>
                <p class="font-black text-sm" style="color:{card.color};">{card.label}</p>
                <p class="text-[10px] font-medium" style="color:{card.color}88;">{card.tagline}</p>
              </div>
            </div>

            <div class="p-6">

              <!-- Already signed in -->
              {#if fbUser && profile}
                <div class="text-center">
                  <div class="flex items-center gap-3 p-4 rounded-xl mb-5 border" style="background:{card.bg};border-color:{card.border};">
                    {#if fbUser.photoURL}
                      <img src={fbUser.photoURL} alt="" class="w-10 h-10 rounded-full flex-shrink-0 border-2" style="border-color:{card.border};"/>
                    {:else}
                      <div class="w-10 h-10 rounded-full flex items-center justify-center font-black text-white flex-shrink-0" style="background:{card.color};">
                        {profile.displayName?.[0]?.toUpperCase()??'?'}
                      </div>
                    {/if}
                    <div class="text-left">
                      <p class="text-sm font-black text-[#0D2561]">{profile.displayName}</p>
                      <p class="text-[10px] font-semibold" style="color:{getRoleDef(p.role).color};">
                        {getRoleDef(p.role).label}
                      </p>
                    </div>
                  </div>
                  <button on:click={() => { tab = defaultTab(p.role); }}
                    class="w-full py-3 font-black text-sm rounded-xl text-white mb-3 transition-opacity hover:opacity-90"
                    style="background:{card.color};">
                    Enter Studio →
                  </button>
                  <button on:click={() => signOut(auth)} class="text-xs font-semibold text-[#94A3B8] hover:text-[#475569]">
                    Use a different account
                  </button>
                </div>

              {:else}
                <!-- Error message -->
                {#if authErr}
                  <div class="flex items-start gap-2.5 text-xs rounded-xl p-3.5 mb-4 border" style="background:#FFF5F5;border-color:#FECACA;color:#9B1C1C;">
                    <AlertCircle size={14} class="flex-shrink-0 mt-0.5"/><span>{authErr}</span>
                  </div>
                {/if}

                {#if authView === 'landing'}
                  <!-- Google sign-in -->
                  <button on:click={signInGoogle} disabled={authBusy}
                    class="w-full flex items-center justify-center gap-3 py-3 rounded-xl border-2 font-bold text-sm hover:bg-slate-50 disabled:opacity-50 mb-4 transition-colors"
                    style="border-color:#E2E8F0;color:#1e293b;">
                    {#if authBusy}
                      <span class="w-4 h-4 rounded-full border-2 border-slate-300 border-t-slate-600 animate-spin"></span>
                      Signing in…
                    {:else}
                      <svg width="18" height="18" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                      </svg>
                      Continue with Google
                    {/if}
                  </button>

                  <div class="flex items-center gap-3 mb-4">
                    <div class="flex-1 h-px bg-slate-100"></div>
                    <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">or</span>
                    <div class="flex-1 h-px bg-slate-100"></div>
                  </div>

                  <button on:click={() => { authView = 'email'; authErr = ''; }}
                    class="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold border hover:bg-slate-50 transition-colors"
                    style="border-color:#E2E8F0;color:#1E40AF;">
                    <Mail size={14}/>Sign in with Email
                  </button>

                  <p class="text-[10px] text-[#94A3B8] text-center mt-4 leading-relaxed">
                    {selectedCard === 'author'
                      ? 'New to the platform? The first sign-in creates a founding admin account.'
                      : 'Access requires an invitation from the system admin.'}
                  </p>

                {:else if authView === 'email'}
                  <button on:click={() => { authView = 'landing'; authErr = ''; }}
                    class="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 mb-4 transition-colors">
                    <ChevronLeft size={12}/>Back
                  </button>
                  <div class="flex flex-col gap-3.5">
                    <div>
                      <label class="jc-label" for="email-input">Email address</label>
                      <input id="email-input" type="email" bind:value={emailVal} class="jc-input"
                        placeholder="you@hospital.com"
                        on:keydown={e => e.key === 'Enter' && signInEmail()}/>
                    </div>
                    <div>
                      <label class="jc-label" for="pass-input">Password</label>
                      <div class="relative">
                        {#if showPass}
                          <input id="pass-input" type="text" bind:value={passVal} class="jc-input pr-10"
                            placeholder="••••••••"
                            on:keydown={e => e.key === 'Enter' && signInEmail()}/>
                        {:else}
                          <input id="pass-input" type="password" bind:value={passVal} class="jc-input pr-10"
                            placeholder="••••••••"
                            on:keydown={e => e.key === 'Enter' && signInEmail()}/>
                        {/if}
                        <button type="button" on:click={()=>showPass=!showPass}
                          class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                          {#if showPass}<EyeOff size={15}/>{:else}<Eye size={15}/>{/if}
                        </button>
                      </div>
                    </div>
                    <button on:click={signInEmail} disabled={authBusy}
                      class="w-full py-3 font-black text-sm rounded-xl text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                      style="background:{card.color};">
                      {#if authBusy}
                        <span class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>Signing in…
                      {:else}
                        <KeyRound size={13}/>Sign In
                      {/if}
                    </button>
                    <button on:click={() => { authView = 'forgot'; authErr = ''; resetOk = false; }}
                      class="text-xs font-semibold text-[#2563EB] hover:underline text-center transition-colors">
                      Forgot your password?
                    </button>
                  </div>

                {:else if authView === 'forgot'}
                  <button on:click={() => { authView = 'email'; authErr = ''; resetOk = false; }}
                    class="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-600 mb-4 transition-colors">
                    <ChevronLeft size={12}/>Back
                  </button>
                  <p class="font-black text-[#0D2561] mb-1" style="font-family:'DM Serif Display',serif;">Reset Password</p>
                  <p class="text-xs text-slate-500 mb-4">Enter your email and we'll send a reset link.</p>
                  {#if resetOk}
                    <div class="flex items-center gap-2.5 text-xs rounded-xl p-4 border" style="background:#F0FDF4;border-color:#BBF7D0;color:#065F46;">
                      <Check size={14}/>Reset email sent — check your inbox.
                    </div>
                  {:else}
                    <div class="flex flex-col gap-3">
                      <div>
                        <label class="jc-label" for="reset-email">Email address</label>
                        <input id="reset-email" type="email" bind:value={emailVal} class="jc-input"
                          placeholder="you@hospital.com"
                          on:keydown={e => e.key === 'Enter' && doReset()}/>
                      </div>
                      <button on:click={doReset} disabled={authBusy}
                        class="w-full py-3 font-black text-sm rounded-xl text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-opacity hover:opacity-90"
                        style="background:{card.color};">
                        {#if authBusy}
                          <span class="w-4 h-4 rounded-full border-2 border-white/40 border-t-white animate-spin"></span>Sending…
                        {:else}
                          <RefreshCcw size={13}/>Send Reset Link
                        {/if}
                      </button>
                    </div>
                  {/if}
                {/if}
              {/if}
            </div>
          </div>

          <!-- Security note -->
          <p class="text-center text-[10px] text-slate-400 mt-4 flex items-center justify-center gap-1.5">
            <Lock size={9}/>Secure, invite-only access
          </p>
        </div>
      {/if}
    {/if}
  </div>
{/if}

</main>

<!-- ═══ ADD REFERENCE DIALOG ══════════════════════════════════════════════ -->
{#if showRefDlg&&editing}
  <div class="fixed inset-0 z-[500] flex items-end sm:items-center justify-center p-4 sm:p-6"
    style="background:rgba(13,37,97,0.55);backdrop-filter:blur(4px);">
    <div class="bg-white rounded-2xl border border-[#DBEAFE] shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between p-5 border-b border-[#F0F7FF]">
        <h3 class="font-black text-[#0D2561]" style="font-family:'DM Serif Display',serif;">Add Reference</h3>
        <button on:click={()=>showRefDlg=false} class="text-[#94A3B8] hover:text-[#0D2561] p-1"><X size={16}/></button>
      </div>
      <div class="p-5 flex flex-col gap-3">
        <div class="grid grid-cols-2 gap-3">
          <div><span class="jc-label">Type</span><select bind:value={newRef.type} class="jc-input"><option value="doi">DOI / Journal Article</option><option value="pubmed">PubMed</option><option value="book">Book / Chapter</option><option value="website">Website / URL</option></select></div>
          <div><span class="jc-label">Year</span><input type="number" bind:value={newRef.year} class="jc-input"/></div>
        </div>
        <div><span class="jc-label">Authors <span class="normal-case font-normal text-[#94A3B8]">(Smith J; Patel R)</span></span><input bind:value={refAuthors} class="jc-input" placeholder="Smith J; Patel R"/></div>
        <div><span class="jc-label">Title</span><input bind:value={newRef.title} class="jc-input" placeholder="Full article or book title"/></div>
        <div class="grid grid-cols-2 gap-3">
          <div><span class="jc-label">Journal / Publisher</span><input bind:value={newRef.journal} class="jc-input"/></div>
          <div><span class="jc-label">Volume</span><input bind:value={newRef.volume} class="jc-input"/></div>
          <div><span class="jc-label">Issue</span><input bind:value={newRef.issue} class="jc-input"/></div>
          <div><span class="jc-label">Pages</span><input bind:value={newRef.pages} class="jc-input" placeholder="123–130"/></div>
          <div><span class="jc-label">DOI</span><input bind:value={newRef.doi} class="jc-input" placeholder="10.xxxx/…"/></div>
          <div><span class="jc-label">PubMed ID</span><input bind:value={newRef.pmid} class="jc-input" placeholder="12345678"/></div>
        </div>
        {#if newRef.title||refAuthors}
          <div class="p-3 rounded-xl border border-[#DBEAFE] text-xs text-[#475569] leading-relaxed" style="background:#F4F8FF;">
            <p class="font-bold text-[#0D2561] mb-1">Vancouver Preview</p>
            {fmtRef({...newRef,authors:refAuthors.split(';').map(a=>a.trim()).filter(Boolean)},(editing?.references?.length??0)+1)}
          </div>
        {/if}
        <button on:click={addRef} class="w-full py-3 font-black text-sm rounded-xl text-white mt-1" style="background:#1E40AF;">Insert Reference</button>
      </div>
    </div>
  </div>
{/if}

<!-- ═══ ARTICLE PREVIEW MODAL ═════════════════════════════════════════════ -->
{#if prevArt}
  <div class="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-4 sm:p-6"
    style="background:rgba(13,37,97,0.6);backdrop-filter:blur(4px);"
    on:click|self={()=>prevArt=null} role="presentation">
    <div class="w-full max-w-xl max-h-[88vh] overflow-y-auto bg-white rounded-2xl border border-[#DBEAFE] shadow-2xl">
      <div class="sticky top-0 flex items-center justify-between p-4 border-b border-[#F0F7FF] bg-white rounded-t-2xl z-10">
        <p class="text-[10px] font-black uppercase tracking-widest text-[#94A3B8]">Article Preview</p>
        <button on:click={()=>prevArt=null} class="text-[#94A3B8] hover:text-[#0D2561] p-1"><X size={16}/></button>
      </div>
      {#if prevArt.thumbnail}<img src={prevArt.thumbnail} alt="" class="w-full h-48 object-cover"/>{/if}
      <div class="p-6">
        <div class="flex items-center gap-2 mb-3 flex-wrap">
          <span class="text-[9px] font-black uppercase px-2.5 py-1 rounded-full" style="background:{catBg(prevArt.category)};color:{catCol(prevArt.category)};">{prevArt.category}</span>
          <span class="text-[9px] font-black uppercase px-2.5 py-1 rounded-full" style="background:{sBg(prevArt.status)};color:{sColor(prevArt.status)};">{sLabel(prevArt.status)}</span>
        </div>
        <h3 class="text-xl font-black text-[#0D2561] mb-2 leading-snug" style="font-family:'DM Serif Display',serif;">{prevArt.title}</h3>
        <p class="text-sm text-[#475569] mb-4 leading-relaxed">{prevArt.excerpt??''}</p>
        {#if prevArt.keywords?.length}
          <div class="flex flex-wrap gap-1.5 mb-4">
            {#each prevArt.keywords.slice(0,8) as kw}
              <span class="text-[9px] font-bold px-2.5 py-0.5 rounded-full border border-[#DBEAFE] text-[#475569]" style="background:#F4F8FF;">#{kw}</span>
            {/each}
          </div>
        {/if}
        <div class="flex gap-4 text-xs font-bold text-[#94A3B8] border-t border-[#F0F7FF] pt-3 flex-wrap">
          <span>{prevArt.author??''}</span>
          {#if prevArt.readTime}<span>{prevArt.readTime} min read</span>{/if}
          {#if (prevArt.stage1Approvals?.length??0)>=2&&(prevArt.stage2Approvals?.length??0)>=2}
            <span class="flex items-center gap-1" style="color:#065F46;"><Award size={11}/>Peer Reviewed</span>
          {/if}
        </div>
      </div>
    </div>
  </div>
{/if}

</div>

<style>
  :global(body) { font-family:'DM Sans',sans-serif; background:#F4F8FF; }
  :global(*) { box-sizing:border-box; }

  :global(.jc-label) {
    display:block; font-size:.6rem; font-weight:900;
    text-transform:uppercase; letter-spacing:.12em;
    color:#475569; margin-bottom:.4rem;
  }
  :global(.jc-input) {
    width:100%; padding:.7rem .9rem; font-size:.875rem;
    border:1.5px solid #DBEAFE; border-radius:.75rem;
    outline:none; background:#fff; color:#0D2561;
    font-family:'DM Sans',sans-serif; transition:border-color .15s, box-shadow .15s;
  }
  :global(.jc-input:focus) { border-color:#2563EB; box-shadow:0 0 0 3px #DBEAFE; }
  :global(textarea.jc-input) { resize:vertical; }
  :global(select.jc-input) { cursor:pointer; }
  :global(.jc-select) {
    padding:.6rem .75rem; font-size:.75rem; font-weight:700;
    border:1.5px solid #DBEAFE; border-radius:.75rem;
    background:#F4F8FF; color:#0D2561; outline:none; cursor:pointer;
    transition:border-color .15s;
  }
  :global(.jc-select:focus) { border-color:#2563EB; }

  /* Spinner animation */
  @keyframes spin { to { transform: rotate(360deg); } }
  :global(.animate-spin) { animation: spin 0.75s linear infinite; }

  /* Article body styles — review panel */
  :global(.prose-cms h1) { font-family:'DM Serif Display',serif; font-size:1.75rem; font-weight:900; color:#0D2561; margin:2rem 0 .75rem; }
  :global(.prose-cms h2) { font-family:'DM Serif Display',serif; font-size:1.35rem; font-weight:900; color:#0D2561; margin:1.75rem 0 .6rem; }
  :global(.prose-cms h3) { font-family:'DM Serif Display',serif; font-size:1.1rem;  font-weight:900; color:#0D2561; margin:1.5rem 0 .5rem; }
  :global(.prose-cms p)  { color:#475569; line-height:1.8; margin-bottom:.9rem; }
  :global(.prose-cms ul, .prose-cms ol) { margin:.5rem 0 1rem 1.5rem; color:#475569; }
  :global(.prose-cms li) { margin-bottom:.3rem; }
  :global(.prose-cms blockquote) { border-left:3px solid #1E40AF; padding:.75rem 1.25rem; margin:1.5rem 0; background:#F4F8FF; font-style:italic; border-radius:0 .75rem .75rem 0; }
  :global(.prose-cms table) { width:100%; border-collapse:collapse; margin-bottom:1.25rem; font-size:.85rem; }
  :global(.prose-cms th) { background:#0D2561; color:#fff; padding:.5rem .75rem; text-align:left; font-size:.75rem; font-weight:900; text-transform:uppercase; }
  :global(.prose-cms td) { padding:.5rem .75rem; border-bottom:1px solid #DBEAFE; }
  :global(.prose-cms pre) { background:#0D2561; color:#93C5FD; padding:1rem 1.25rem; border-radius:.75rem; overflow-x:auto; font-size:.78rem; margin-bottom:1rem; }
  :global(.prose-cms code) { background:#F4F8FF; color:#1E40AF; padding:.1rem .3rem; border-radius:.3rem; font-size:.85em; }
  :global(.prose-cms .video-embed) { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin:1.25rem 0; border-radius:.75rem; }
  :global(.prose-cms .video-embed iframe, .prose-cms .video-embed video) { position:absolute; top:0; left:0; width:100%; height:100%; }
  :global(.prose-cms .chart-placeholder) { background:#F4F8FF; border:1.5px dashed #DBEAFE; border-radius:.75rem; padding:2rem; text-align:center; color:#94A3B8; font-size:.875rem; margin-bottom:1rem; }
  :global(.prose-cms figure img) { width:100%; border-radius:.75rem; }
  :global(.prose-cms figcaption) { text-align:center; font-size:.75rem; color:#94A3B8; margin-top:.4rem; }
  :global(.ref-cite) { font-size:.7rem; vertical-align:super; color:#1E40AF; }

  :global(.article-body h1) { font-family:'DM Serif Display',serif; font-size:2rem; font-weight:900; color:#0D2561; margin:2.5rem 0 1rem; }
  :global(.article-body h2) { font-family:'DM Serif Display',serif; font-size:1.6rem; font-weight:900; color:#0D2561; margin:2rem 0 .75rem; }
  :global(.article-body h3) { font-family:'DM Serif Display',serif; font-size:1.2rem; font-weight:900; color:#0D2561; margin:1.75rem 0 .6rem; }
  :global(.article-body p)  { font-size:1.05rem; line-height:1.85; color:#475569; margin-bottom:1.5rem; }
  :global(.article-body ul, .article-body ol) { margin:0 0 1.5rem 1.5rem; color:#475569; }
  :global(.article-body li) { margin-bottom:.5rem; font-size:1rem; line-height:1.7; }
  :global(.article-body blockquote) { border-left:3px solid #1E40AF; padding:1rem 1.5rem; margin:2rem 0; background:#F4F8FF; font-style:italic; font-family:'DM Serif Display',serif; border-radius:0 1rem 1rem 0; }
  :global(.article-body table) { width:100%; border-collapse:collapse; margin-bottom:1.5rem; font-size:.9rem; }
  :global(.article-body th) { background:#0D2561; color:#fff; padding:.75rem 1rem; text-align:left; font-size:.8rem; font-weight:900; text-transform:uppercase; }
  :global(.article-body td) { padding:.65rem 1rem; border-bottom:1px solid #DBEAFE; }
  :global(.article-body pre) { background:#0D2561; color:#93C5FD; padding:1.25rem; border-radius:.75rem; overflow-x:auto; font-size:.85rem; margin-bottom:1.5rem; }
  :global(.article-body code) { background:#F4F8FF; color:#1E40AF; padding:.15rem .4rem; border-radius:.35rem; font-size:.85em; }
  :global(.article-body .video-embed) { position:relative; padding-bottom:56.25%; height:0; overflow:hidden; margin:1.5rem 0; border-radius:.75rem; }
  :global(.article-body .video-embed iframe, .article-body .video-embed video) { position:absolute; top:0; left:0; width:100%; height:100%; }
  :global(.article-body .chart-placeholder) { background:#F4F8FF; border:1.5px dashed #DBEAFE; border-radius:.75rem; padding:2rem; text-align:center; color:#94A3B8; margin-bottom:1.5rem; }
  :global(.article-body figure img) { width:100%; border-radius:.75rem; }
  :global(.article-body figcaption) { text-align:center; font-size:.8rem; color:#94A3B8; margin-top:.5rem; }
</style>