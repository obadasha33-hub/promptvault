'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useAuth, useUser, Show, SignInButton, UserButton } from '@clerk/nextjs';
import { ALLOWED_MODELS, ALLOWED_CATEGORIES } from '@/lib/validation';
import { getSupabaseClient } from '@/lib/supabase';
import { 
  Search, 
  Terminal, 
  Layers, 
  ShieldAlert, 
  Database, 
  Cpu, 
  Sparkles, 
  Copy, 
  Check, 
  Plus, 
  Trash2, 
  BookOpen, 
  Sliders, 
  HelpCircle,
  Sun,
  Moon,
  Laptop,
  Image,
  Video,
  Music,
  Mic,
  Smile,
  LayoutGrid,
  Heart,
  Star,
  RefreshCw,
  X,
  Play,
  Square,
  ChevronDown,
  ChevronUp,
  Loader2,
  Bookmark,
  ExternalLink,
  Code,
  Volume2,
  VolumeX,
  ArrowRight,
  ArrowLeft,
  Palette,
  Download,
  Upload,
  Paintbrush,
  Settings
} from 'lucide-react';

interface PromptRecord {
  id: string;
  user_id: string;
  title: string;
  title_ar?: string;
  description?: string;
  description_ar?: string;
  model: string;
  category: string;
  body: string;
  likes_count: number;
  created_at: string;
  image_url?: string;
  profiles?: {
    first_name: string;
    last_name: string;
    image_url: string;
    tier: string;
  };
}

const TRANSLATIONS = {
  en: {
    explorer: "Explorer",
    savedBlueprints: "Saved Blueprints",
    compilerLogs: "Compiler Logs",
    systemExplorer: "Explorer",
    workspace: "Saved Blueprints",
    admin: "Compiler Logs",
    appearance: "Appearance",
    accessTerminal: "Access Terminal",
    secureId: "SECURE_ID",
    heroTitle: "Redefine prompt structures for advanced reasoning models",
    heroSubtitle: "Command next-gen engines: GPT-5.5 Agentic planning, Claude 4.8 structural audits, Flux 1.1 photographic specs, and Kling v3.0 directorial multi-shots.",
    initiateSession: "Initiate Session Console",
    deployedIntegrations: "DEPLOYED CORE INTEGRATIONS",
    spaceClearance: "SPACE_CLEARANCE_PROTOCOL // CORE_ONLINE",
    authMessage: "Authorized credentials are synced to the workspace registry automatically.",
    terminalLogText: "System: Awaiting identity signature. Telemetry pipeline online.",
    explorerTitle: "System Blueprints Curation",
    explorerSubtitle: "Curated from high-stakes developers, formatted for next-gen reasoning models.",
    searchPlaceholder: "Search title, prompt instructions...",
    categoryFilter: "Category Filter",
    engineTarget: "AI Engine Target",
    all: "All",
    compilingLedgers: "COMPILING SYSTEM LEDGERS...",
    zeroEntries: "ZERO COMPILATION ENTRIES MATCHING ACTIVE FILTER",
    ledgerSortMatrix: "Ledger Sort Matrix:",
    workspaceSortMatrix: "Workspace Sort Matrix:",
    dateStamp: "DATE_STAMP",
    titleAz: "TITLE_AZ",
    titleZa: "TITLE_ZA",
    aiEngine: "AI_ENGINE",
    payloadSize: "PAYLOAD_SIZE",
    listView: "List View",
    postView: "Post View",
    grabBlueprint: "Grab Blueprint",
    copied: "COPIED",
    executeSandbox: "Execute Sandbox Compiler",
    bookmarkToWorkspace: "Bookmark to Workspace",
    savedWorkspace: "Saved Workspace Blueprint",
    workspaceTitle: "Saved Blueprints Workspace",
    workspaceSubtitle: "Manage, filter, export, and compile your local blueprint repository.",
    importJson: "Import JSON",
    exportJson: "Export JSON",
    clearAll: "Clear All",
    sessionProfile: "SESSION PROFILE",
    databaseIntegrity: "DATABASE INTEGRITY",
    secureRls: "✓ SECURE RLS",
    workspaceVolume: "WORKSPACE VOLUME",
    savedItems: "SAVED ITEMS",
    categoriesRatio: "CATEGORIES RATIO",
    telemetryLatency: "TELEMETRY LATENCY",
    latencyActive: "CACHE PIPELINE SYNC ACTIVE",
    searchSavedPlaceholder: "Search saved titles or instructions...",
    categoryLabel: "Category:",
    engineLabel: "Engine:",
    allCategories: "ALL CATEGORIES",
    allEngines: "ALL ENGINES",
    zeroSaved: "ZERO SAVED BLUEPRINTS MATCHED CURRENT SEARCH QUERY FILTERS",
    localRepoEmpty: "Local Repository Empty",
    localRepoDesc: "Your saved prompts workspace is empty. Discover curated blueprints inside the explorer console or insert your custom prompts into the database ledger.",
    launchSystemExplorer: "Launch System Explorer",
    promptLedger: "prompt_ledger.db",
    activeScripts: "ACTIVE SCRIPTS",
    titleEngineHeader: "Title / Engine",
    categoryHeader: "Category",
    actionsHeader: "Actions",
    systemSeed: "system_seed",
    editPhoto: "EDIT_PHOTO",
    addPhoto: "ADD_PHOTO",
    delete: "DELETE",
    compilerInsert: "compiler_insert.sh",
    titleLabel: "Title",
    imageUrlLabel: "Image URL (Optional)",
    modelEngine: "Model Engine",
    blueprintInstructions: "Blueprint Core Instructions",
    addLedgerBtn: "Add to database ledger",
    addingLedgerBtn: "Compiling and inserting...",
    successPublish: "Prompt added to database ledger successfully!",
    themeSelector: "Theme Selector",
    scanlines: "INTERFACE SCANLINES",
    enabled: "ENABLED",
    disabled: "DISABLED",
    themeDesc: "* Interactive display changes are persistent across app reboots.",
    adminPrivileges: "ADMIN PRIVILEGES",
    dropHere: "DROP",
    notificationBookmarked: "BOOKMARKED PROMPT",
    notificationImported: "BLUEPRINT IMPORTED"
  },
  ar: {
    explorer: "المستكشف",
    savedBlueprints: "النماذج المحفوظة",
    compilerLogs: "سجلات المجمع",
    systemExplorer: "المستكشف",
    workspace: "النماذج المحفوظة",
    admin: "سجلات المجمع",
    appearance: "المظهر",
    accessTerminal: "دخول الجهاز الطرفي",
    secureId: "المعرف_الآمن",
    heroTitle: "إعادة تعريف هياكل النماذج لنماذج التفكير المتقدمة",
    heroSubtitle: "قم بقيادة محركات الجيل القادم: تخطيط وكلاء GPT-5.5، تدقيق هياكل Claude 4.8، مواصفات تصوير Flux 1.1، ولقطات Kling v3.0 المتعددة الإخراجية.",
    initiateSession: "بدء تشغيل وحدة التحكم",
    deployedIntegrations: "تكاملات النظام الأساسية النشطة",
    spaceClearance: "بروتوكول تصريح الفضاء // النظام متصل",
    authMessage: "يتم مزامنة بيانات الاعتماد المصرح بها إلى سجل مساحة العمل تلقائيًا.",
    terminalLogText: "النظام: في انتظار توقيع الهوية. خط القياس عن بعد نشط.",
    explorerTitle: "تنظيم النماذج المنهجية",
    explorerSubtitle: "منسقة من قبل مطورين ذوي خبرة عالية، ومصممة لنماذج التفكير من الجيل القادم.",
    searchPlaceholder: "البحث عن العنوان، إرشادات النموذج...",
    categoryFilter: "تصفية الفئات",
    engineTarget: "محرك الذكاء الاصطناعي المستهدف",
    all: "الكل",
    compilingLedgers: "جاري تجميع دفاتر حسابات النظام...",
    zeroEntries: "لا توجد مدخلات مطابقة للتصفية النشطة",
    ledgerSortMatrix: "مصفوفة ترتيب الدفتر:",
    workspaceSortMatrix: "مصفوفة ترتيب مساحة العمل:",
    dateStamp: "طابع_التاريخ",
    titleAz: "العنوان_أبجدي",
    titleZa: "العنوان_عكسي",
    aiEngine: "محرك_الذكاء",
    payloadSize: "حجم_البيانات",
    listView: "عرض القائمة",
    postView: "عرض المنشورات",
    grabBlueprint: "نسخ النموذج",
    copied: "تم النسخ",
    executeSandbox: "تشغيل مجمع البيئة التجريبية",
    bookmarkToWorkspace: "حفظ في مساحة العمل",
    savedWorkspace: "نموذج مساحة العمل المحفوظ",
    workspaceTitle: "مساحة عمل النماذج المحفوظة",
    workspaceSubtitle: "إدارة وتصفية وتصدير وتجميع مستودع النماذج المحلي الخاص بك.",
    importJson: "استيراد JSON",
    exportJson: "تصدير JSON",
    clearAll: "مسح الكل",
    sessionProfile: "ملف الجلسة",
    databaseIntegrity: "سلامة قاعدة البيانات",
    secureRls: "✓ أمن RLS نشط",
    workspaceVolume: "حجم مساحة العمل",
    savedItems: "العناصر المحفوظة",
    categoriesRatio: "نسب الفئات",
    telemetryLatency: "زمن استجابة القياس",
    latencyActive: "مزامنة البيانات نشطة",
    searchSavedPlaceholder: "البحث عن العناوين أو الإرشادات المحفوظة...",
    categoryLabel: "الفئة:",
    engineLabel: "المحرك:",
    allCategories: "جميع الفئات",
    allEngines: "جميع المحركات",
    zeroSaved: "لا توجد نماذج محفوظة تطابق معايير البحث الحالية",
    localRepoEmpty: "المستودع المحلي فارغ",
    localRepoDesc: "مساحة عمل النماذج المحفوظة الخاصة بك فارغة. اكتشف النماذج المنسقة داخل مستكشف النظام أو أضف نماذجك المخصصة.",
    launchSystemExplorer: "تشغيل مستكشف النظام",
    promptLedger: "سجل_النماذج.db",
    activeScripts: "النماذج النشطة",
    titleEngineHeader: "العنوان / المحرك",
    categoryHeader: "الفئة",
    actionsHeader: "الإجراءات",
    systemSeed: "بذرة_النظام",
    editPhoto: "تعديل_الصورة",
    addPhoto: "إضافة_الصورة",
    delete: "حذف",
    compilerInsert: "إدخال_المجمع.sh",
    titleLabel: "العنوان",
    imageUrlLabel: "رابط الصورة (اختياري)",
    modelEngine: "محرك النموذج",
    blueprintInstructions: "إرشادات النموذج الأساسية",
    addLedgerBtn: "إضافة إلى سجل قاعدة البيانات",
    addingLedgerBtn: "جاري التجميع والإدخال...",
    successPublish: "تم إضافة النموذج إلى سجل قاعدة البيانات بنجاح!",
    themeSelector: "محدد السمات",
    scanlines: "خطوط المسح للواجهة",
    enabled: "مفعل",
    disabled: "معطل",
    themeDesc: "* التغييرات في الواجهة التفاعلية مستمرة بعد إعادة تشغيل التطبيق.",
    adminPrivileges: "امتيازات المسؤول",
    dropHere: "إفلات",
    notificationBookmarked: "تم حفظ النموذج",
    notificationImported: "تم استيراد النموذج"
  }
};

import curatedPromptsRaw from '@/data/prompts.json';
const CURATED_PROMPTS = curatedPromptsRaw as Omit<PromptRecord, 'likes_count' | 'created_at'>[];

const getCategoryTranslation = (cat: string, currentLang: 'en' | 'ar') => {
  if (currentLang === 'ar') {
    switch (cat) {
      case 'Photo Editing': return 'تعديل الصور';
      case 'Photo Generation': return 'توليد الصور';
      case 'Video Generation': return 'توليد الفيديو';
      case 'Vibe Widgets': return 'أدوات التفاعل';
      case 'Agentic Loops': return 'الحلقات الوكيلية';
      case 'Fullstack Dev': return 'تطوير الويب المتكامل';
      case 'Security Audit': return 'التدقيق الأمني';
      default: return cat;
    }
  }
  return cat;
};


// Slides for Scroll-pinned Parallax Exploration Gallery
const EXPLORATION_SLIDES = [
  {
    title: "Multimodal Generation Studio",
    title_ar: "استوديو التوليد متعدد الوسائط",
    subtitle: "Flux 1.1 Pro & Midjourney v7 integration",
    subtitle_ar: "تكامل محركات Flux 1.1 Pro و Midjourney v7",
    description: "Design photographic blueprints with custom lenses, focal values, and HSL lighting specifications to command flagship render engines.",
    description_ar: "تصميم مخططات تصويرية بعدسات مخصصة، وقيم بؤرية، ومواصفات إشاءة HSL للتحكم في محركات الرندر الرائدة.",
    bgClass: "from-[#11192e] to-[#0d1527]",
    icon: Image
  },
  {
    title: "Cinematic Directorial Directives",
    title_ar: "توجيهات الإخراج السينمائي",
    subtitle: "Runway Gen-3 & Kling v3.0 sequencing",
    subtitle_ar: "تكامل Runway Gen-3 و Kling v3.0",
    description: "Write structural frame timeline scripts with dolly zooms, crane movements, and multi-shot continuity arrays to generate fluid cinematic clips.",
    description_ar: "كتابة نصوص خط زمن إطاري هيكلي مع زوم دولي، وحركات رافعة، وتسلسلات لقطات متعددة لتوليد لقطات سينمائية سلسة.",
    bgClass: "from-[#0d142b] to-[#050c20]",
    icon: Video
  },
  {
    title: "Vibe Widget Scaffolder",
    title_ar: "منشئ أدوات التفاعل",
    subtitle: "Claude Fable 5 code compilation",
    subtitle_ar: "تجميع أكواد Claude Fable 5",
    description: "Build interactive glassmorphic buttons, audio analyzers, constellation particle fields, and virtual pets with self-contained assets.",
    description_ar: "بناء أزرار زجاجية تفاعلية، ومحللات صوتية، وحقول جزيئات الكوكبة، وحيوانات أليفة افتراضية بأصول برمجية ذاتية الاحتواء.",
    bgClass: "from-[#080d24] to-[#010619]",
    icon: Code
  },
  {
    title: "Autonomous Agentic Loops",
    title_ar: "حلقات الوكلاء المستقلة",
    subtitle: "GPT-5.5 self-correcting logic",
    subtitle_ar: "منطق التصحيح الذاتي GPT-5.5",
    description: "Construct persistent JSON state loops with cycle protection counters, checkpoint thresholds, and schema validator guards.",
    description_ar: "بناء حلقات حالة JSON مستمرة مع عدادات حماية من الحلقات المفرغة، وحدود نقاط التفتيش، وحراس التحقق من المخطط.",
    bgClass: "from-[#0f142c] to-[#0b1022]",
    icon: Cpu
  }
];

const PromptVisualizer = ({ prompt }: { prompt: { title: string; category: string; body: string; image_url?: string } }) => {
  const titleLower = prompt.title.toLowerCase();
  const category = prompt.category;

  let content: React.ReactNode = null;

  if (prompt.image_url) {
    const isVideo = /\.(mp4|webm|mov|ogg)$/i.test(prompt.image_url);
    content = (
      <div className="w-full h-24 bg-black/45 overflow-hidden relative flex items-center justify-center">
        {isVideo ? (
          <video
            src={prompt.image_url}
            className="w-full h-full object-cover opacity-80"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <img
            src={prompt.image_url}
            alt={prompt.title}
            className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
        )}
      </div>
    );
  } else if (category === 'Vibe Widgets' || titleLower.includes('audio') || titleLower.includes('music') || titleLower.includes('waveform') || titleLower.includes('equalizer') || titleLower.includes('sound')) {
    // 1. Audio / Equalizer Expressive Prompts
    content = (
      <div className="w-full h-16 bg-black/45 overflow-hidden relative flex items-center justify-center bg-gradient-to-r from-indigo-900/10 to-purple-900/10">
        <div className="flex items-end gap-1 h-6">
          <span className="w-1 bg-neon-cyan rounded-t animate-[bounce_1.2s_infinite] delay-100" style={{ height: '30%', animationDuration: '1.2s' }}></span>
          <span className="w-1 bg-neon-blue rounded-t animate-[bounce_0.8s_infinite] delay-300" style={{ height: '60%', animationDuration: '0.8s' }}></span>
          <span className="w-1 bg-neon-cyan rounded-t animate-[bounce_1.4s_infinite] delay-200" style={{ height: '40%', animationDuration: '1.4s' }}></span>
          <span className="w-1 bg-indigo-500 rounded-t animate-[bounce_1.0s_infinite] delay-500" style={{ height: '70%', animationDuration: '1.0s' }}></span>
          <span className="w-1 bg-neon-blue rounded-t animate-[bounce_0.9s_infinite] delay-400" style={{ height: '50%', animationDuration: '0.9s' }}></span>
        </div>
      </div>
    );
  } else if (category === 'Agentic Loops' || titleLower.includes('loop') || titleLower.includes('agent') || titleLower.includes('orbit') || titleLower.includes('particle') || titleLower.includes('spin')) {
    // 2. Loop / Orbit / Agentic Expressive Prompts
    content = (
      <div className="w-full h-16 bg-black/45 overflow-hidden relative flex items-center justify-center bg-gradient-to-tr from-cyan-950/10 to-transparent">
        <svg viewBox="0 0 100 40" className="w-full h-6 text-neon-cyan">
          <circle cx="50" cy="20" r="10" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" className="animate-[spin_15s_linear_infinite]" />
          <circle cx="50" cy="20" r="6" fill="none" stroke="#4E85BF" strokeWidth="1.5" />
          <circle cx="50" cy="20" r="2" fill="#ffffff" className="animate-ping" style={{ animationDuration: '3s' }} />
        </svg>
      </div>
    );
  } else if (category === 'Fullstack Dev' || titleLower.includes('code') || titleLower.includes('react') || titleLower.includes('dev') || titleLower.includes('web') || titleLower.includes('app')) {
    // 3. Code / Web / Dev Expressive Prompts
    content = (
      <div className="w-full h-16 bg-black/45 overflow-hidden relative flex items-center justify-center bg-gradient-to-r from-emerald-950/10 to-neon-cyan/5">
        <svg viewBox="0 0 100 40" className="w-full h-5 text-neon-cyan">
          <text x="25" y="25" fill="#89AACC" className="font-mono text-xs font-bold select-none">&lt;</text>
          <text x="35" y="25" fill="#ffffff" className="font-mono text-xs font-bold select-none">/</text>
          <text x="45" y="25" fill="#4E85BF" className="font-mono text-xs font-bold select-none">code</text>
          <text x="70" y="25" fill="#89AACC" className="font-mono text-xs font-bold select-none">&gt;</text>
        </svg>
      </div>
    );
  } else if (category === 'Security Audit' || titleLower.includes('security') || titleLower.includes('audit') || titleLower.includes('protect') || titleLower.includes('shield') || titleLower.includes('safe') || titleLower.includes('lock')) {
    // 4. Security Expressive Prompts
    content = (
      <div className="w-full h-16 bg-black/45 overflow-hidden relative flex items-center justify-center bg-gradient-to-r from-red-950/5 to-slate-900/10">
        <svg viewBox="0 0 100 40" className="w-full h-6 text-neon-cyan">
          <path d="M50,8 L65,12 L65,20 C65,27 58,32 50,34 C42,32 35,27 35,20 L35,12 Z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          <circle cx="50" cy="20" r="3" fill="#4E85BF" className="animate-pulse" />
        </svg>
      </div>
    );
  }

  if (!content) return null;

  return (
    <div className="-mx-6 -mt-6 mb-4 select-none pointer-events-none border-b border-white/5">
      {content}
    </div>
  );
};

const PromptListRow = ({
  p,
  index,
  isExpanded,
  onToggleExpand,
  isSaved,
  onToggleSave,
  onOpenDrawer,
  onCopy,
  copiedId,
  t,
  lang
}: {
  p: PromptRecord;
  index: number;
  isExpanded: boolean;
  onToggleExpand: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDrawer: () => void;
  onCopy: () => void;
  copiedId: string | null;
  t: (key: any) => string;
  lang: 'en' | 'ar';
}) => {
  // Accent colors based on category
  let accentColor = 'bg-slate-500';
  let glowColor = 'shadow-[0_0_8px_rgba(148,163,184,0.5)]';
  
  if (p.category === 'Photo Editing' || p.category === 'Photo Generation') {
    accentColor = 'bg-neon-cyan';
    glowColor = 'shadow-[0_0_8px_var(--border-glow)]';
  } else if (p.category === 'Video Generation') {
    accentColor = 'bg-neon-blue';
    glowColor = 'shadow-[0_0_8px_var(--border-glow)]';
  } else if (p.category === 'Vibe Widgets') {
    accentColor = 'bg-purple-500';
    glowColor = 'shadow-[0_0_8px_rgba(168,85,247,0.6)]';
  } else if (p.category === 'Agentic Loops') {
    accentColor = 'bg-pink-500';
    glowColor = 'shadow-[0_0_8px_rgba(236,72,153,0.6)]';
  } else if (p.category === 'Fullstack Dev') {
    accentColor = 'bg-emerald-500';
    glowColor = 'shadow-[0_0_8px_rgba(16,185,129,0.6)]';
  } else if (p.category === 'Security Audit') {
    accentColor = 'bg-red-500';
    glowColor = 'shadow-[0_0_8px_rgba(239,68,68,0.6)]';
  }

  return (
    <div 
      className={`border rounded-xl bg-panel/75 hover:bg-panel/95 transition-all duration-300 overflow-hidden ${
        isExpanded ? 'border-neon-cyan/40 shadow-[0_0_20px_var(--border-glow)]' : 'border-white/5 hover:border-white/15'
      }`}
    >
      {/* Row Header */}
      <div 
        onClick={onToggleExpand}
        className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer select-none group relative"
      >
        {/* Left Glowing Accent Border */}
        <div className={`absolute left-0 top-0 bottom-0 w-1 ${accentColor} opacity-70 group-hover:opacity-100 transition-opacity`} />

        {/* Row Left Content */}
        <div className="flex items-center gap-3 pl-2 flex-grow min-w-0">
          {/* Glowing Blinking LED */}
          <span className={`w-2 h-2 rounded-full shrink-0 ${accentColor} ${glowColor} animate-pulse`} />
          
          {/* Index tag */}
          <span className="text-[9px] font-mono text-slate-500 shrink-0 select-none uppercase">
            #{index + 1}
          </span>

          {/* Title with prompt symbol */}
          <div className="min-w-0 flex-grow">
            <h4 className="font-bold text-[#dfe2f1] text-xs sm:text-sm font-mono tracking-wide truncate flex items-center gap-1 group-hover:text-white transition-colors">
              <span className="text-neon-cyan opacity-0 group-hover:opacity-100 transition-all transform -translate-x-1 group-hover:translate-x-0 font-bold">&gt;</span>
              {lang === 'ar' ? p.title_ar || p.title : p.title}
            </h4>
            {p.description && (
              <p className="text-[10px] text-slate-400 font-sans mt-0.5 max-w-xl truncate text-left">
                {lang === 'ar' ? p.description_ar || p.description : p.description}
              </p>
            )}
          </div>

          {/* Model Engine Tag */}
          <span className="hidden sm:inline-block px-2 py-0.5 rounded text-[8px] font-mono shrink-0 uppercase bg-white/5 text-slate-300 border border-white/5">
            {p.model}
          </span>
        </div>

        {/* Row Right Content */}
        <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0 font-mono text-[10px]">
          {/* Mobile Model Engine Tag */}
          <span className="sm:hidden px-2 py-0.5 rounded text-[8px] font-mono shrink-0 uppercase bg-white/5 text-slate-300 border border-white/5">
            {p.model}
          </span>

          {/* Category Tag */}
          <span className="hidden md:inline-block text-slate-400 uppercase tracking-wider text-[9px] truncate max-w-[120px]">
            {p.category}
          </span>

          {/* Actions Desk */}
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            {/* Save Action */}
            <button 
              onClick={onToggleSave}
              className={`p-1.5 rounded hover:bg-white/5 transition-all ${isSaved ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
              title={isSaved ? t('savedWorkspace') : t('bookmarkToWorkspace')}
            >
              {isSaved ? <Star className="w-3.5 h-3.5 fill-white text-white" /> : <Star className="w-3.5 h-3.5" />}
            </button>
            
            {/* Sandbox Action */}
            <button 
              onClick={onOpenDrawer}
              className="p-1.5 rounded hover:bg-white/5 text-neon-cyan hover:text-neon-blue transition-all"
              title={t('executeSandbox')}
            >
              <Terminal className="w-3.5 h-3.5" />
            </button>

            {/* Copy Action */}
            <button 
              onClick={onCopy}
              className="p-1.5 rounded hover:bg-white/5 text-slate-300 hover:text-white transition-all flex items-center gap-1 font-mono text-[9px]"
              title={t('grabBlueprint')}
            >
              {copiedId === p.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>

          {/* Expand/Collapse Chevron Indicator */}
          <span className="text-slate-500 group-hover:text-white transition-colors">
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </span>
        </div>
      </div>

      {/* Row Expanded Panel */}
      {isExpanded && (
        <div className="border-t border-white/5 bg-black/20 p-5 space-y-4 animate-slideDown">
          {/* Main Visualizer or Details Block */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Visual Header inside the accordion if easy to express or has image */}
            <div className="lg:col-span-4 rounded-lg overflow-hidden border border-white/5 flex flex-col justify-between bg-panel/30 min-h-[140px]">
              <div className="p-3 border-b border-white/5 flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase select-none">
                <span>// visual_module.io</span>
                <span className="px-1.5 py-0.25 rounded bg-neon-cyan/10 text-neon-cyan">
                  {p.category.split(' ')[0]}
                </span>
              </div>
              <div className="flex-grow flex items-center justify-center p-3 relative">
                {p.image_url ? (
                  /\.(mp4|webm|mov|ogg)$/i.test(p.image_url) ? (
                    <video
                      src={p.image_url}
                      className="w-full max-h-28 object-cover rounded border border-white/10"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img
                      src={p.image_url}
                      alt={p.title}
                      className="w-full max-h-28 object-cover rounded border border-white/10"
                      loading="lazy"
                      onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                    />
                  )
                ) : (
                  <PromptVisualizer prompt={p} />
                )}
                {/* Fallback if visualizer/image is null */}
                {!p.image_url && !['Vibe Widgets', 'Agentic Loops', 'Fullstack Dev', 'Security Audit'].includes(p.category) && (
                  <div className="text-center font-mono text-[9px] text-slate-500 uppercase select-none">
                    // STATIC_BLUEPRINT_SCHEMA
                  </div>
                )}
              </div>
            </div>

            {/* Monospace Code Preview Box */}
            <div className="lg:col-span-8 flex flex-col space-y-2">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400 uppercase select-none">
                <span>// instructions_payload</span>
                <span>LENGTH: {p.body.length} CHARS</span>
              </div>
              <div className="bg-black/50 border border-white/5 p-4 rounded-lg font-mono text-[10px] text-slate-300 max-h-52 overflow-y-auto custom-scrollbar select-text flex-grow relative">
                <pre className="whitespace-pre-wrap leading-relaxed">{p.body}</pre>
                
                {/* Quick copy overlay button */}
                <button
                  onClick={onCopy}
                  className="absolute right-3 top-3 px-2 py-1 rounded bg-black/60 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white transition-all text-[8px]"
                >
                  {copiedId === p.id ? 'COPIED' : 'COPY'}
                </button>
              </div>
            </div>
          </div>

          {/* Prompt Meta details bottom deck */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pt-3 border-t border-white/5 text-[9px] font-mono text-slate-500">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span>TARGET ENGINE: <span className="text-neon-cyan">{p.model}</span></span>
              <span>•</span>
              <span>CATEGORY: <span className="text-slate-300">{p.category}</span></span>
              <span>•</span>
              <span>TIMESTAMP: <span className="text-slate-400">{new Date(p.created_at).toLocaleString()}</span></span>
            </div>
            {p.profiles && (
              <div className="flex items-center gap-1.5">
                <span>COMPILED BY:</span>
                <span className="text-slate-300 font-bold uppercase">{p.profiles.first_name || 'System'} {p.profiles.last_name || 'Seed'}</span>
                <span className={`px-1 rounded text-[7px] ${p.profiles.tier === 'admin' ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                  {p.profiles.tier}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const PromptPostCard = ({
  p,
  index,
  isSaved,
  onToggleSave,
  onOpenDrawer,
  onCopy,
  copiedId,
  isAdmin,
  onEditPhoto,
  onDragStart,
  onDragEnd,
  t,
  lang
}: {
  p: PromptRecord;
  index: number;
  isSaved: boolean;
  onToggleSave: () => void;
  onOpenDrawer: () => void;
  onCopy: () => void;
  copiedId: string | null;
  isAdmin: boolean;
  onEditPhoto: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  t: (key: any) => string;
  lang: 'en' | 'ar';
}) => {
  // Color configuration
  let accentBorder = 'border-white/5';
  let badgeBg = 'bg-slate-500/10 text-slate-400 border-slate-500/20';
  let glowColor = 'shadow-[0_0_12px_rgba(255,255,255,0.03)]';
  
  if (p.category === 'Photo Editing' || p.category === 'Photo Generation') {
    accentBorder = 'border-neon-cyan/20 hover:border-neon-cyan/40';
    badgeBg = 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/20';
    glowColor = 'shadow-[0_0_12px_var(--border-glow)]';
  } else if (p.category === 'Video Generation') {
    accentBorder = 'border-neon-blue/20 hover:border-neon-blue/40';
    badgeBg = 'bg-neon-blue/10 text-neon-blue border-neon-blue/20';
    glowColor = 'shadow-[0_0_12px_var(--border-glow)]';
  } else if (p.category === 'Vibe Widgets') {
    accentBorder = 'border-purple-500/20 hover:border-purple-500/40';
    badgeBg = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
    glowColor = 'shadow-[0_0_12px_rgba(168,85,247,0.1)]';
  } else if (p.category === 'Agentic Loops') {
    accentBorder = 'border-pink-500/20 hover:border-pink-500/40';
    badgeBg = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
    glowColor = 'shadow-[0_0_12px_rgba(236,72,153,0.1)]';
  } else if (p.category === 'Fullstack Dev') {
    accentBorder = 'border-emerald-500/20 hover:border-emerald-500/40';
    badgeBg = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    glowColor = 'shadow-[0_0_12px_rgba(16,185,129,0.1)]';
  } else if (p.category === 'Security Audit') {
    accentBorder = 'border-red-500/20 hover:border-red-500/40';
    badgeBg = 'bg-red-500/10 text-red-400 border-red-500/20';
    glowColor = 'shadow-[0_0_12px_rgba(239,68,68,0.1)]';
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      className={`relative group flex flex-col justify-between rounded-2xl bg-panel/40 border transition-all duration-500 overflow-hidden spotlight-card ${accentBorder} ${glowColor} hover:-translate-y-1.5 hover:shadow-2xl hover:bg-panel/75`}
    >
      {/* Photo / Animated Visualizer Header */}
      <div className="h-44 w-full relative overflow-hidden bg-black/30 border-b border-white/5 shrink-0 select-none">
        {p.image_url ? (
          /\.(mp4|webm|mov|ogg)$/i.test(p.image_url) ? (
            <video
              src={p.image_url}
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              autoPlay
              loop
              muted
              playsInline
            />
          ) : (
            <img 
              src={p.image_url} 
              alt={p.title} 
              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              loading="lazy"
              onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
            />
          )
        ) : (
          <div className="w-full h-full flex items-center justify-center transform scale-90 origin-center transition-transform duration-500 group-hover:scale-100">
            <PromptVisualizer prompt={p} />
          </div>
        )}

        {/* Ambient Dark Overlay at Bottom of Image */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent opacity-80" />

        {/* Categories / Engine Floating Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex justify-between items-center z-10">
          <span className={`px-2 py-0.75 rounded text-[8px] font-mono font-bold tracking-widest uppercase border ${badgeBg}`}>
            {getCategoryTranslation(p.category, lang)}
          </span>
          <span className="px-2 py-0.75 rounded text-[8px] font-mono uppercase bg-black/60 text-slate-300 border border-white/10 backdrop-blur-md">
            {p.model}
          </span>
        </div>

        {/* Admin configure overlay trigger */}
        {isAdmin && !p.id.startsWith('curated-') && (
          <button
            onClick={(e) => { e.stopPropagation(); onEditPhoto(); }}
            className="absolute bottom-3 right-3 p-2 bg-black/75 hover:bg-white text-slate-400 hover:text-black rounded-lg border border-white/10 backdrop-blur-md transition-all active:scale-90 z-20"
            title="Configure Blueprint Image"
          >
            <Palette className="w-3.5 h-3.5 text-neon-cyan group-hover:text-black" />
          </button>
        )}
      </div>

      {/* Card Info Content */}
      <div className="p-5 flex-grow flex flex-col justify-between gap-4 relative z-10">
        <div className="space-y-2">
          {/* Index indicator */}
          <span className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">// LEDGER INDEX_#{index + 1}</span>
          
          <h4 className="font-bold text-[#dfe2f1] group-hover:text-white transition-colors text-sm sm:text-base font-mono leading-tight tracking-wide min-h-[40px] line-clamp-2">
            {lang === 'ar' ? p.title_ar || p.title : p.title}
          </h4>
          {p.description && (
            <p className="text-[11px] text-slate-400 font-sans mt-1 line-clamp-2 text-left">
              {lang === 'ar' ? p.description_ar || p.description : p.description}
            </p>
          )}
          
          {/* Faded Monospace Preview Box */}
          <div className="bg-black/25 border border-white/[0.03] p-3 rounded-lg font-mono text-[9px] text-slate-400 select-text max-h-24 overflow-hidden relative">
            <pre className="whitespace-pre-wrap leading-relaxed line-clamp-3">{p.body}</pre>
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-background to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Action Button Deck */}
        <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
          {/* Prominent GRAB / DRAG Prompt button */}
          <button
            draggable="true"
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
            onClick={onCopy}
            className="flex-grow flex items-center justify-center gap-2 py-2 px-3 border border-neon-cyan/30 hover:border-neon-cyan/60 hover:bg-neon-cyan/10 text-white font-mono text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all active:scale-95 cursor-grab active:cursor-grabbing group/btn shadow-[0_2px_8px_rgba(0,0,0,0.2)]"
            title={t('grabBlueprint')}
          >
            <div className="flex items-center gap-1">
              <span className="text-slate-400 group-hover:text-white select-none mr-0.5">⋮⋮</span>
              {copiedId === p.id ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">[{t('copied')}]</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-neon-cyan group-hover:scale-110 transition-transform" />
                  <span>{t('grabBlueprint')}</span>
                </>
              )}
            </div>
          </button>

          {/* Quick Sandbox trigger */}
          <button
            onClick={onOpenDrawer}
            className="p-2 border border-white/5 hover:border-white/15 bg-black/20 hover:bg-black/50 rounded-lg text-neon-cyan hover:text-neon-blue transition-all"
            title={t('executeSandbox')}
          >
            <Terminal className="w-4 h-4" />
          </button>

          {/* Bookmark / Save trigger */}
          <button
            onClick={onToggleSave}
            className={`p-2 border border-white/5 hover:border-white/15 bg-black/20 hover:bg-black/50 rounded-lg transition-all ${isSaved ? 'text-white' : 'text-slate-400 hover:text-slate-200'}`}
            title={isSaved ? t('savedWorkspace') : t('bookmarkToWorkspace')}
          >
            {isSaved ? <Star className="w-4 h-4 fill-white text-white" /> : <Star className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};

// Interactive Star Dust Particle Canvas inspired by Antigravity space theme
function StarDustCanvas({ theme }: { theme: 'neon' | 'cyberpunk' | 'terminal' | 'alabaster' }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      color: string;
      life: number;
      maxLife: number;
    }

    const particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, active: false };

    const getParticleColor = () => {
      if (theme === 'cyberpunk') {
        const colors = ['#ff007f', '#ffea00', '#bd00ff', '#ff00aa'];
        return colors[Math.floor(Math.random() * colors.length)];
      } else if (theme === 'terminal') {
        const colors = ['#00ff66', '#ffb000', '#33ff33', '#11aa11'];
        return colors[Math.floor(Math.random() * colors.length)];
      } else if (theme === 'alabaster') {
        const colors = ['#2563eb', '#1d4ed8', '#94a3b8', '#3b82f6'];
        return colors[Math.floor(Math.random() * colors.length)];
      } else {
        const colors = ['#c084fc', '#60a5fa', '#f472b6', '#ffffff', '#a78bfa'];
        return colors[Math.floor(Math.random() * colors.length)];
      }
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;

      if (Math.random() < 0.35) {
        particles.push({
          x: e.clientX,
          y: e.clientY,
          vx: (Math.random() - 0.5) * 1.6,
          vy: (Math.random() - 0.5) * 1.6,
          size: Math.random() * 2.2 + 0.6,
          alpha: 1,
          color: getParticleColor(),
          life: 0,
          maxLife: Math.random() * 90 + 50,
        });
      }
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    for (let i = 0; i < 70; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.6 + 0.4,
        alpha: Math.random() * 0.6 + 0.1,
        color: theme === 'alabaster' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.6)',
        life: 0,
        maxLife: Math.random() * 250 + 100,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.life++;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            const pullForce = (180 - dist) / 2200;
            p.vx += (dx / dist) * pullForce;
            p.vy += (dy / dist) * pullForce;
          }
        }

        const lifeRatio = 1 - p.life / p.maxLife;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha * lifeRatio);
        ctx.fill();

        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 75) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = Math.max(0, (75 - dist) / 750 * lifeRatio);
            ctx.lineWidth = 0.55;
            ctx.stroke();
          }
        }

        if (p.life >= p.maxLife) {
          particles[idx] = {
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.3,
            vy: (Math.random() - 0.5) * 0.3,
            size: Math.random() * 1.5 + 0.4,
            alpha: Math.random() * 0.5 + 0.1,
            color: theme === 'alabaster' ? 'rgba(0, 0, 0, 0.15)' : 'rgba(255, 255, 255, 0.4)',
            life: 0,
            maxLife: Math.random() * 250 + 100,
          };
        }
      });

      ctx.globalAlpha = 1.0;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
}

export default function Home() {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();

  // Navigation & Tab state
  const [activeTab, setActiveTab] = useState<'explore' | 'workspace' | 'admin'>('explore');



  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedModel, setSelectedModel] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'title_asc' | 'title_desc' | 'model' | 'length'>('date');

  // Data & Cache States
  const [prompts, setPrompts] = useState<PromptRecord[]>([]);
  const [savedPrompts, setSavedPrompts] = useState<Record<string, boolean>>({});
  const [loadingData, setLoadingData] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Form States
  const [formTitle, setFormTitle] = useState('');
  const [formModel, setFormModel] = useState<string>(ALLOWED_MODELS[0]);
  const [formCategory, setFormCategory] = useState<string>(ALLOWED_CATEGORIES[0]);
  const [formBody, setFormBody] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string[]>>({});
  const [publishing, setPublishing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  // Sandbox Widget state
  const [sandboxActiveWidget, setSandboxActiveWidget] = useState<'particles' | 'companion' | 'visualizer'>('particles');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [jwtError, setJwtError] = useState(false);

  // UX improvements state variables
  const [theme, setTheme] = useState<'neon' | 'cyberpunk' | 'terminal' | 'alabaster'>('neon');
  const [expandedPrompt, setExpandedPrompt] = useState<PromptRecord | null>(null);
  const [expandedPromptIds, setExpandedPromptIds] = useState<Record<string, boolean>>({});

  // View mode, admin management, drag & drop, and notification states
  const [viewMode, setViewMode] = useState<'list' | 'post'>('post');
  const [isAdmin, setIsAdmin] = useState(false);
  const [draggedPromptId, setDraggedPromptId] = useState<string | null>(null);
  const [photoEditPrompt, setPhotoEditPrompt] = useState<PromptRecord | null>(null);
  const [photoEditUrl, setPhotoEditUrl] = useState('');
  const [notifications, setNotifications] = useState<{ id: string; text: string }[]>([]);
  const [lang, setLang] = useState<'en' | 'ar'>('en');

  // Load language from storage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('vibeprompt_lang');
    if (savedLang === 'en' || savedLang === 'ar') {
      setLang(savedLang as any);
    }
  }, []);

  const changeLang = (newLang: 'en' | 'ar') => {
    setLang(newLang);
    localStorage.setItem('vibeprompt_lang', newLang);
    playBeep(640, 0.05, 'triangle');
  };

  const t = (key: keyof typeof TRANSLATIONS['en']) => {
    return TRANSLATIONS[lang][key] || TRANSLATIONS['en'][key] || '';
  };

  const addNotification = (text: string) => {
    const id = Math.random().toString();
    setNotifications(prev => [...prev, { id, text }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3500);
  };

  const togglePromptExpand = (id: string) => {
    setExpandedPromptIds(prev => ({ ...prev, [id]: !prev[id] }));
    playBeep(600, 0.05, 'sine');
  };

  const [customVariables, setCustomVariables] = useState<Record<string, string>>({});
  const [sandboxConsole, setSandboxConsole] = useState<string>('');
  const [sandboxExecuting, setSandboxExecuting] = useState<boolean>(false);
  const [showThemeToolbox, setShowThemeToolbox] = useState(false);
  const [savedSearchQuery, setSavedSearchQuery] = useState('');
  const [savedSelectedCategory, setSavedSelectedCategory] = useState('All');
  const [savedSelectedModel, setSavedSelectedModel] = useState('All');
  const [snippetTab, setSnippetTab] = useState<'ts' | 'py' | 'curl'>('ts');
  const [scanlinesActive, setScanlinesActive] = useState(true);

  const toolboxRef = useRef<HTMLDivElement>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  // Close toolbox when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (toolboxRef.current && !toolboxRef.current.contains(event.target as Node)) {
        setShowThemeToolbox(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Load and apply theme on boot
  useEffect(() => {
    const savedTheme = localStorage.getItem('vibeprompt_theme') as any;
    if (savedTheme && ['neon', 'cyberpunk', 'terminal', 'alabaster'].includes(savedTheme)) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }, []);



  // Particles Widget State
  const particlesCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [particleSpeed, setParticleSpeed] = useState<number>(2);
  const [particleCount, setParticleCount] = useState<number>(60);
  const particlesArrayRef = useRef<any[]>([]);

  // Companion Widget State
  const [petXp, setPetXp] = useState<number>(0);
  const [petExpression, setPetExpression] = useState<'happy' | 'idle' | 'dizzy' | 'excited'>('idle');
  const [petSpeech, setPetSpeech] = useState<string>("Click on me to hear some tech-witty wisdom!");
  const speechTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Audio Visualizer states & refs
  const visualizerCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [visualizerMode, setVisualizerMode] = useState<'bars' | 'wave' | 'circle'>('bars');
  const [isMicConnected, setIsMicConnected] = useState<boolean>(false);
  const [isAnalyzerActive, setIsAnalyzerActive] = useState<boolean>(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameIdRef = useRef<number | null>(null);

  const startAudioAnalyzer = async () => {
    try {
      playBeep(880, 0.1, 'sine');
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      streamRef.current = stream;
      
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const audioContext = new AudioCtx();
      audioContextRef.current = audioContext;
      
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;
      
      const source = audioContext.createMediaStreamSource(stream);
      micSourceRef.current = source;
      source.connect(analyser);
      
      setIsMicConnected(true);
      setIsAnalyzerActive(true);
      addNotification('[AUDIO] MICROPHONE ACCESS CONNECTED');
    } catch (err) {
      console.warn("Microphone access denied. Using mock ambient waves visualizer.", err);
      setIsMicConnected(false);
      setIsAnalyzerActive(true);
      addNotification('[AUDIO] MICROPHONE ACCESS DENIED - SIMULATING AMBIENT INPUT');
    }
  };

  const stopAudioAnalyzer = () => {
    playBeep(440, 0.1, 'sine');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    micSourceRef.current = null;
    setIsMicConnected(false);
    setIsAnalyzerActive(false);
  };

  // Cinematic Hero Video State
  const [isPlayingHeroVideo, setIsPlayingHeroVideo] = useState(true);
  const [heroVideoVolume, setHeroVideoVolume] = useState(false); // muted by default
  const heroVideoCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const heroVideoFrameRef = useRef<number | null>(null);

  // Parallax Gallery Active Slide state
  const [activeSlide, setActiveSlide] = useState(0);



  // Sync Bookmarks from local storage
  useEffect(() => {
    const saved = localStorage.getItem('vibeprompt_bookmarks');
    if (saved) {
      try {
        setSavedPrompts(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const saveBookmarkLocally = (id: string, isSaved: boolean) => {
    setSavedPrompts(prev => {
      const updated = { ...prev, [id]: isSaved };
      localStorage.setItem('vibeprompt_bookmarks', JSON.stringify(updated));
      return updated;
    });
  };

  // Check user admin status from profile tier or URL override
  useEffect(() => {
    async function checkAdminStatus() {
      if (!isSignedIn || !user) {
        setIsAdmin(false);
        return;
      }

      // Check URL-based admin activation (e.g. ?sys_admin=true)
      const params = new URLSearchParams(window.location.search);
      if (params.get('sys_admin') === 'true') {
        // Silently strip the param from URL for security
        params.delete('sys_admin');
        const cleanUrl = params.toString()
          ? `${window.location.pathname}?${params.toString()}`
          : window.location.pathname;
        window.history.replaceState({}, '', cleanUrl);
        setIsAdmin(true);
        return;
      }

      // Check database profile tier
      try {
        const token = await getToken({ template: 'supabase' });
        const supabase = getSupabaseClient(token);
        const { data, error } = await supabase
          .from('profiles')
          .select('tier')
          .eq('id', user.id)
          .single();
        if (data && data.tier === 'admin') {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } catch (err) {
        console.warn('RLS profile check failed, using local user data fallback.', err);
        setIsAdmin(false);
      }
    }
    checkAdminStatus();
  }, [isSignedIn, user]);

  const elevateToAdmin = async () => {
    if (!isSignedIn || !user) {
      alert("Please login first to elevate your profile.");
      return;
    }
    try {
      const token = await getToken({ template: 'supabase' });
      const supabase = getSupabaseClient(token);
      const { data, error } = await supabase
        .from('profiles')
        .update({ tier: 'admin' })
        .eq('id', user.id)
        .select()
        .single();
      
      if (error) {
        alert(`Failed to elevate profile: ${error.message}`);
      } else {
        setIsAdmin(true);
        addNotification(`[SYSTEM] SECURITY OVERRIDE // TIER ELEVATED TO ADMIN`);
        playBeep(880, 0.15, 'sine');
      }
    } catch (err) {
      console.error(err);
      alert("Failed to connect to database for elevation.");
    }
  };

  const handleDragStart = (e: React.DragEvent, promptId: string, promptBody: string) => {
    e.dataTransfer.setData('text/plain', promptBody);
    e.dataTransfer.setData('promptId', promptId);
    e.dataTransfer.effectAllowed = 'copy';
    setDraggedPromptId(promptId);
    playBeep(440, 0.05, 'triangle');
  };

  const handleDragEnd = () => {
    setDraggedPromptId(null);
  };

  // Fetch prompts from live database
  useEffect(() => {
    async function fetchPrompts() {
      if (!isSignedIn) {
        setPrompts(getFilteredStaticPrompts());
        setLoadingData(false);
        return;
      }
      setLoadingData(true);
      setJwtError(false);
      try {
        const queryParams = new URLSearchParams();
        if (selectedModel && selectedModel !== 'All') {
          queryParams.append('model', selectedModel);
        }
        if (selectedCategory && selectedCategory !== 'All') {
          queryParams.append('category', selectedCategory);
        }
        if (searchQuery) {
          queryParams.append('search', searchQuery);
        }

        let token: string | null = null;
        try {
          token = await getToken({ template: 'supabase' });
        } catch (authErr) {
          console.warn('Supabase JWT template is missing or Clerk config unlinked.', authErr);
          setJwtError(true);
        }

        const res = await fetch(`/api/prompts?${queryParams.toString()}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        if (res.ok) {
          const data = await res.json();
          const filteredCurated = getFilteredStaticPrompts();
          setPrompts([...filteredCurated, ...data]);
        } else {
          setPrompts(getFilteredStaticPrompts());
        }
      } catch (err) {
        console.error('Error fetching prompts, using static fallback stubs:', err);
        setPrompts(getFilteredStaticPrompts());
      } finally {
        setLoadingData(false);
      }
    }

    fetchPrompts();
  }, [refreshTrigger, selectedModel, selectedCategory, searchQuery, isSignedIn]);

  const getFilteredStaticPrompts = (): PromptRecord[] => {
    return CURATED_PROMPTS.filter(p => {
      const matchesSearch = searchQuery === '' || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.title_ar && p.title_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description_ar && p.description_ar.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.body.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesModel = selectedModel === 'All' || p.model === selectedModel;
      
      return matchesSearch && matchesCategory && matchesModel;
    }).map(p => ({
      ...p,
      likes_count: 0,
      created_at: new Date().toISOString()
    }));
  };

  const sortPrompts = (list: PromptRecord[]) => {
    const sorted = [...list];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
    } else if (sortBy === 'title_asc') {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'title_desc') {
      sorted.sort((a, b) => b.title.localeCompare(a.title));
    } else if (sortBy === 'model') {
      sorted.sort((a, b) => a.model.localeCompare(b.model));
    } else if (sortBy === 'length') {
      sorted.sort((a, b) => b.body.length - a.body.length);
    }
    return sorted;
  };

  // Sound generator
  const playBeep = (freq = 440, duration = 0.1, type: OscillatorType = 'sine') => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn("AudioContext failed to trigger", e);
    }
  };

  // 2. Cinematic HLS Hero Video Simulator (Generates beautiful futuristic mathematical code shapes)
  useEffect(() => {
    const canvas = heroVideoCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = 1200);
    let height = (canvas.height = 500);
    let frame = 0;

    const drawVideo = () => {
      if (!ctx || !canvas) return;
      ctx.fillStyle = '#060811';
      ctx.fillRect(0, 0, width, height);

      // Render camera HUD lines
      ctx.strokeStyle = 'rgba(137, 170, 204, 0.25)';
      ctx.lineWidth = 1;

      // Outer brackets
      const padding = 30;
      ctx.beginPath();
      // Top Left
      ctx.moveTo(padding + 20, padding);
      ctx.lineTo(padding, padding);
      ctx.lineTo(padding, padding + 20);
      // Top Right
      ctx.moveTo(width - padding - 20, padding);
      ctx.lineTo(width - padding, padding);
      ctx.lineTo(width - padding, padding + 20);
      // Bottom Left
      ctx.moveTo(padding + 20, height - padding);
      ctx.lineTo(padding, height - padding);
      ctx.lineTo(padding, height - padding - 20);
      // Bottom Right
      ctx.moveTo(width - padding - 20, height - padding);
      ctx.lineTo(width - padding, height - padding);
      ctx.lineTo(width - padding, height - padding - 20);
      ctx.stroke();

      // Draw active cinematic waveforms
      if (isPlayingHeroVideo) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(137, 170, 204, 0.45)';
        ctx.lineWidth = 1.5;
        for (let i = 0; i < width - 100; i += 5) {
          const x = i + 50;
          const y = height / 2 + Math.sin(i * 0.007 + frame * 0.05) * 55 * Math.sin(frame * 0.01) + Math.cos(i * 0.02 - frame * 0.02) * 15;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Secondary color wave representing HLS stream
        ctx.beginPath();
        ctx.strokeStyle = 'rgba(78, 133, 191, 0.35)';
        for (let i = 0; i < width - 100; i += 8) {
          const x = i + 50;
          const y = height / 2 + Math.cos(i * 0.005 - frame * 0.03) * 45 * Math.sin(frame * 0.015) + Math.sin(i * 0.03 + frame * 0.04) * 10;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
      }

      // Draw Center crosshair
      ctx.strokeStyle = 'rgba(137, 170, 204, 0.2)';
      ctx.beginPath();
      ctx.moveTo(width / 2 - 10, height / 2);
      ctx.lineTo(width / 2 + 10, height / 2);
      ctx.moveTo(width / 2, height / 2 - 10);
      ctx.lineTo(width / 2, height / 2 + 10);
      ctx.stroke();

      // Top HUD: Record time, HLS status, Resolution
      ctx.fillStyle = '#89AACC';
      ctx.font = '10px monospace';
      ctx.fillText('REC HLS STREAM // LIVE', padding + 15, padding + 15);
      
      const secondsCode = Math.floor(frame / 60) % 60;
      const minutesCode = Math.floor(frame / 3600) % 60;
      ctx.fillText(`00:${minutesCode.toString().padStart(2, '0')}:${secondsCode.toString().padStart(2, '0')}:24`, width - padding - 105, padding + 15);

      ctx.fillText('1080P // 24 FPS', padding + 15, height - padding - 10);
      ctx.fillText('ASPECT RATIO 2.39:1', width - padding - 130, height - padding - 10);

      // Pulse red recording circle
      if (Math.floor(frame / 30) % 2 === 0 && isPlayingHeroVideo) {
        ctx.beginPath();
        ctx.arc(padding + 160, padding + 11, 4, 0, Math.PI * 2);
        ctx.fillStyle = '#ef4444';
        ctx.fill();
      }

      frame++;
      heroVideoFrameRef.current = requestAnimationFrame(drawVideo);
    };

    drawVideo();
    return () => {
      if (heroVideoFrameRef.current) cancelAnimationFrame(heroVideoFrameRef.current);
    };
  }, [isPlayingHeroVideo]);

  // Audio synthesizer loop simulation for video soundtrack
  useEffect(() => {
    let videoAudioInterval: NodeJS.Timeout | null = null;
    if (isPlayingHeroVideo && heroVideoVolume) {
      videoAudioInterval = setInterval(() => {
        // low frequency ambient synth hums
        playBeep(110, 0.8, 'sine');
        // soft high frequency telemetry sounds
        if (Math.random() > 0.6) {
          setTimeout(() => playBeep(880, 0.08, 'sine'), 100);
        }
      }, 1200);
    }

    return () => {
      if (videoAudioInterval) clearInterval(videoAudioInterval);
    };
  }, [isPlayingHeroVideo, heroVideoVolume]);



  // 4. Particle Field Background Effect
  useEffect(() => {
    const canvas = particlesCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = 300;
    };
    window.addEventListener('resize', handleResize);

    const initParticles = () => {
      const arr = [];
      for (let i = 0; i < particleCount; i++) {
        arr.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 1.5,
          vy: (Math.random() - 0.5) * 1.5,
          radius: Math.random() * 2 + 0.8
        });
      }
      particlesArrayRef.current = arr;
    };
    initParticles();

    let loopId: number;
    let mouse = { x: -999, y: -999 };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -999;
      mouse.y = -999;
    };

    const handleMouseClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      playBeep(720, 0.08, 'sine');
      for (let i = 0; i < 15; i++) {
        particlesArrayRef.current.push({
          x: clickX,
          y: clickY,
          vx: (Math.random() - 0.5) * 4.5,
          vy: (Math.random() - 0.5) * 4.5,
          radius: Math.random() * 1.5 + 0.5
        });
      }
      if (particlesArrayRef.current.length > 150) {
        particlesArrayRef.current.splice(0, particlesArrayRef.current.length - 150);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', handleMouseClick);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const arr = particlesArrayRef.current;
      for (let i = 0; i < arr.length; i++) {
        for (let j = i + 1; j < arr.length; j++) {
          const dx = arr[i].x - arr[j].x;
          const dy = arr[i].y - arr[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 75) {
            ctx.beginPath();
            ctx.strokeStyle = `rgba(137, 170, 204, ${(1 - dist/75) * 0.15})`;
            ctx.lineWidth = 0.5;
            ctx.moveTo(arr[i].x, arr[i].y);
            ctx.lineTo(arr[j].x, arr[j].y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#89AACC';
        ctx.fill();

        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        if (mouse.x !== -999) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 100) {
            p.x += dx * 0.01;
            p.y += dy * 0.01;
          }
        }
      }

      loopId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (canvas) {
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
        canvas.removeEventListener('click', handleMouseClick);
      }
      cancelAnimationFrame(loopId);
    };
  }, []);

  // Audio spectrum rendering logic
  useEffect(() => {
    if (sandboxActiveWidget !== 'visualizer' || !isAnalyzerActive) {
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
        animationFrameIdRef.current = null;
      }
      return;
    }

    const canvas = visualizerCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = canvas.parentElement?.clientWidth || 600);
    let height = (canvas.height = 300);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || 600;
      height = 300;
    };
    window.addEventListener('resize', handleResize);

    const bufferLength = analyserRef.current ? analyserRef.current.frequencyBinCount : 128;
    const dataArray = new Uint8Array(bufferLength);
    
    let simTime = 0;

    const draw = () => {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, width, height);

      if (analyserRef.current) {
        if (visualizerMode === 'wave') {
          analyserRef.current.getByteTimeDomainData(dataArray);
        } else {
          analyserRef.current.getByteFrequencyData(dataArray);
        }
      } else {
        simTime += 0.04;
        for (let i = 0; i < bufferLength; i++) {
          let val = 0;
          if (visualizerMode === 'wave') {
            val = 128 + Math.sin(simTime + i * 0.15) * 40 + Math.cos(simTime * 0.5 + i * 0.05) * 20;
          } else {
            const baseFreq = Math.sin(simTime + i * 0.08) * 80 + 100;
            const highFreq = Math.cos(simTime * 2 + i * 0.3) * 30;
            val = Math.max(0, baseFreq + highFreq - (i * 1.5));
          }
          dataArray[i] = val;
        }
      }

      const activeColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-cyan').trim() || '#89AACC';

      if (visualizerMode === 'bars') {
        const barWidth = (width / bufferLength) * 1.6;
        let barHeight;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          barHeight = (dataArray[i] / 255) * height * 0.85;

          const grad = ctx.createLinearGradient(0, height, 0, height - barHeight);
          grad.addColorStop(0, 'rgba(15, 20, 38, 0.1)');
          grad.addColorStop(1, activeColor);

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth - 2, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          ctx.fillStyle = '#ffffff';
          ctx.shadowBlur = 10;
          ctx.shadowColor = activeColor;
          ctx.fillRect(x, height - barHeight - 2, barWidth - 2, 2);
          ctx.shadowBlur = 0;

          x += barWidth;
        }
      } else if (visualizerMode === 'wave') {
        ctx.lineWidth = 3;
        ctx.strokeStyle = activeColor;
        ctx.shadowBlur = 15;
        ctx.shadowColor = activeColor;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.beginPath();

        const sliceWidth = width / bufferLength;
        let x = 0;

        for (let i = 0; i < bufferLength; i++) {
          const v = dataArray[i] / 128.0;
          const y = (v * height) / 2;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }

          x += sliceWidth;
        }

        ctx.lineTo(width, height / 2);
        ctx.stroke();
        ctx.shadowBlur = 0;
      } else if (visualizerMode === 'circle') {
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.25;
        
        ctx.shadowBlur = 12;
        ctx.shadowColor = activeColor;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.strokeStyle = activeColor;
        ctx.lineWidth = 2.5;
        ctx.beginPath();

        for (let i = 0; i < bufferLength; i++) {
          const angle = (i / bufferLength) * Math.PI * 2;
          const amplitude = (dataArray[i] / 255.0) * 45;
          const r = radius + amplitude;
          const x = centerX + Math.cos(angle) * r;
          const y = centerY + Math.sin(angle) * r;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      animationFrameIdRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameIdRef.current) {
        cancelAnimationFrame(animationFrameIdRef.current);
      }
    };
  }, [sandboxActiveWidget, isAnalyzerActive, visualizerMode]);

  // 5. Interactive Virtual Pet Actions
  const feedPet = () => {
    playBeep(523.25, 0.1, 'sine'); // C5
    playBeep(659.25, 0.15, 'sine'); // E5
    setPetExpression('excited');
    setPetXp(prev => {
      const next = prev + 20;
      return next >= 100 ? 0 : next;
    });
    setPetSpeech("Yum! That prompt instruction logic is optimized. EXP leveled up!");
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setPetExpression('idle'), 2000);
  };

  const pokePet = () => {
    playBeep(200, 0.2, 'sawtooth');
    setPetExpression('dizzy');
    setPetSpeech("Ouch! Brain buffer registers a stack overflow...");
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setPetExpression('idle'), 2500);
  };

  const askWisdom = () => {
    const wisdomList = [
      "Flux 1.1 Pro works best with photographic directives specifying lenses and apertures.",
      "Kling v3.0 supports sequential narrative shots, anchor your characters early.",
      "GPT-5.5 has robust self-correcting logic. Write strict error loops.",
      "Vibe coding is all about intent boundaries. Stay precise.",
      "Check your Clerk signing key if your RLS inserts throw permission errors."
    ];
    const rand = wisdomList[Math.floor(Math.random() * wisdomList.length)];
    setPetSpeech(rand);
    setPetExpression('happy');
    playBeep(784, 0.08, 'sine');
    if (speechTimeoutRef.current) clearTimeout(speechTimeoutRef.current);
    speechTimeoutRef.current = setTimeout(() => setPetExpression('idle'), 3000);
  };

  // Submit new prompt
  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    setPublishing(true);
    setFormErrors({});
    setSuccessMsg('');

    try {
      let token: string | null = null;
      try {
        token = await getToken({ template: 'supabase' });
      } catch (authErr) {
        setJwtError(true);
      }

      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          title: formTitle,
          model: formModel,
          category: formCategory,
          body: formBody,
          image_url: formImageUrl || undefined,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        if (result.details) {
          setFormErrors(result.details);
        } else {
          setFormErrors({ general: [result.error || 'Failed to publish prompt'] });
        }
      } else {
        setSuccessMsg('Prompt added to database ledger successfully!');
        setFormTitle('');
        setFormBody('');
        setFormImageUrl('');
        setRefreshTrigger(prev => prev + 1);
        playBeep(750, 0.25, 'sine');
      }
    } catch (err) {
      console.error(err);
      setFormErrors({ general: ['Failed to sync with API. Cache execution active.'] });
    } finally {
      setPublishing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (id.startsWith('curated-')) return;
    if (!confirm('Confirm deletion of this script from database?')) return;

    try {
      const token = await getToken({ template: 'supabase' });
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'DELETE',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      if (res.ok) {
        setPrompts(prev => prev.filter(p => p.id !== id));
        setRefreshTrigger(prev => prev + 1);
        playBeep(280, 0.15, 'sawtooth');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdatePhoto = async (id: string, currentUrl?: string) => {
    if (id.startsWith('curated-')) {
      alert('System seed prompts are read-only.');
      return;
    }
    const newUrl = window.prompt('Enter Image URL for this prompt (leave blank to remove):', currentUrl || '');
    if (newUrl === null) return; // User cancelled

    try {
      const token = await getToken({ template: 'supabase' });
      const res = await fetch(`/api/prompts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ image_url: newUrl.trim() }),
      });

      if (res.ok) {
        const updated = await res.json();
        setPrompts(prev => prev.map(p => p.id === id ? { ...p, image_url: updated.image_url } : p));
        setRefreshTrigger(prev => prev + 1);
        playBeep(880, 0.15, 'sine');
      } else {
        const err = await res.json();
        alert(`Error updating photo: ${err.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to connect to API to update photo.');
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    playBeep(900, 0.05, 'sine');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const changeTheme = (newTheme: 'neon' | 'cyberpunk' | 'terminal' | 'alabaster') => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('vibeprompt_theme', newTheme);
    playBeep(700, 0.06, 'sine');
  };

  const exportSavedPrompts = () => {
    const savedList = prompts.filter(p => savedPrompts[p.id]);
    if (savedList.length === 0) {
      alert("No saved blueprints to export.");
      return;
    }
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(savedList, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `vibeprompt_saved_blueprints_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    playBeep(880, 0.15, 'sine');
  };

  const importSavedPrompts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          const newBookmarks = { ...savedPrompts };
          imported.forEach((p: any) => {
            if (p && p.id) {
              newBookmarks[p.id] = true;
            }
          });
          setSavedPrompts(newBookmarks);
          localStorage.setItem('vibeprompt_bookmarks', JSON.stringify(newBookmarks));
          setPrompts(prev => {
            const existingIds = new Set(prev.map(item => item.id));
            const newPrompts = [...prev];
            imported.forEach((p: any) => {
              if (p && p.id && !existingIds.has(p.id)) {
                newPrompts.push(p);
              }
            });
            return newPrompts;
          });
          playBeep(650, 0.2, 'sine');
          alert(`Successfully imported ${imported.length} blueprint records into workspace!`);
        } else {
          alert("Invalid file format. Must be a JSON array of prompts.");
        }
      } catch (err) {
        alert("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
  };

  const clearSavedWorkspace = () => {
    if (!confirm("Are you sure you want to clear your saved workspace? This will remove all bookmarked items.")) return;
    setSavedPrompts({});
    localStorage.removeItem('vibeprompt_bookmarks');
    playBeep(220, 0.3, 'sawtooth');
  };

  const openPromptDrawer = (p: PromptRecord) => {
    setExpandedPrompt(p);
    const body = p.body;
    const matches = Array.from(new Set(Array.from(body.matchAll(/\[([A-Za-z0-9_ \-\/]+)\]/g), m => m[1])));
    const initialVars: Record<string, string> = {};
    matches.forEach(v => {
      initialVars[v] = '';
    });
    setCustomVariables(initialVars);
    setSandboxConsole('');
    setSandboxExecuting(false);
    setSnippetTab('ts');
    playBeep(620, 0.06, 'triangle');
  };

  const getCustomizedBody = () => {
    if (!expandedPrompt) return '';
    let body = expandedPrompt.body;
    Object.entries(customVariables).forEach(([key, val]) => {
      if (val.trim() !== '') {
        body = body.replaceAll(`[${key}]`, val);
      }
    });
    return body;
  };

  const getTypeScriptSnippet = () => {
    if (!expandedPrompt) return '';
    const promptText = getCustomizedBody().replace(/`/g, '\\`');
    return `import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';

const { text } = await generateText({
  model: openai('gpt-4o'), // targets ${expandedPrompt.model}
  prompt: \`${promptText}\`,
});`;
  };

  const getPythonSnippet = () => {
    if (!expandedPrompt) return '';
    const promptText = getCustomizedBody().replace(/'{3}/g, "\\'\\'\\'");
    return `from google import genai

client = genai.Client()
response = client.models.generate_content(
    model='gemini-2.5-flash',
    contents='''${promptText}'''
)
print(response.text)`;
  };

  const getCurlSnippet = () => {
    if (!expandedPrompt) return '';
    const promptJson = JSON.stringify(getCustomizedBody());
    return `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $API_KEY" \\
  -d '{
    "model": "gpt-4o",
    "messages": [{"role": "user", "content": ${promptJson}}]
  }'`;
  };

  const runSandboxSimulation = () => {
    if (!expandedPrompt || sandboxExecuting) return;
    setSandboxExecuting(true);
    setSandboxConsole('');
    playBeep(440, 0.1, 'sine');
    setTimeout(() => {
      playBeep(880, 0.1, 'sine');
    }, 150);

    const targetModel = expandedPrompt.model;
    const category = expandedPrompt.category;
    const title = expandedPrompt.title;
    
    let responseText = '';
    if (category === 'Fullstack Dev') {
      responseText = `// Compiling ${title} utilizing ${targetModel}...\n` +
        `// Target origin: https://semicolon-dingo-grueling.ngrok-free.dev\n\n` +
        `import React from 'react';\n` +
        `import { auth } from '@clerk/nextjs/server';\n\n` +
        `export default async function SecureEndpoint() {\n` +
        `  const { userId } = await auth();\n` +
        `  if (!userId) throw new Error('Unauthenticated');\n\n` +
        `  // Model executed instructions securely\n` +
        `  console.log('Secure channel established for', userId);\n` +
        `  return (\n` +
        `    <div className="p-4 border border-emerald-500/30 rounded-xl bg-emerald-950/20">\n` +
        `      <span className="text-emerald-400 font-mono">✓ Handshake Secure</span>\n` +
        `    </div>\n` +
        `  );\n` +
        `}`;
    } else if (category === 'Security Audit') {
      responseText = `[AUDIT REPORT LOG] : Executed ${targetModel} AST parsing.\n` +
        `===============================================================\n` +
        `Target Component: ${title}\n` +
        `Vulnerability Vectors Identified: 0\n` +
        `Critical Alert Levels: Clear\n\n` +
        `SUMMARY REMEDIATION SUGGESTIONS:\n` +
        `- Ensure strict validation of inbound JSON inputs via Zod schema checks.\n` +
        `- Verify that JWT validation templates match Clerk session credentials.\n` +
        `- Audit packages using standard lockfile hash matching on dev instances.`;
    } else if (category === 'Photo Generation' || category === 'Photo Editing') {
      responseText = `[FLUX/MIDJOURNEY RENDER ENGINE INSTRUCTIONS]\n` +
        `Prompt seed matching: ${Math.floor(Math.random() * 999999999)}\n` +
        `Model: ${targetModel}\n` +
        `Aperture mapping: F/1.2 | Lens distortion: 0.0%\n\n` +
        `RENDER LOGS:\n` +
        `- Pre-calculating bounding boxes for lighting highlights...\n` +
        `- Compositing soft shadows to align with the ambient source...\n` +
        `- Render completed successfully in 238ms. File saved to public/assets.`;
    } else if (category === 'Video Generation') {
      responseText = `[RUNWAY TIMELINE COMPILER]\n` +
        `Compiling scene timeline sequences via ${targetModel}...\n` +
        `FPS: 60 | Duration: 6.0 seconds | Motion Weight: 8.5\n\n` +
        `Sequence Actions:\n` +
        `- [0.0s - 2.0s]: Slow camera tracking forward, lighting matches local time.\n` +
        `- [2.0s - 4.0s]: Subdued pan rotating 15 degrees around the focal point.\n` +
        `- [4.0s - 6.0s]: Smooth fade to ambient shadows, maintaining depth bounds.`;
    } else {
      responseText = `// Simulated Sandbox Console Executing via ${targetModel}\n` +
        `// Target action: '${title}'\n\n` +
        `Successfully compiled execution parameters.\n` +
        `No errors returned in standard sandbox interface.\n\n` +
        `Output matches instructions constraints: 100% compliant.`;
    }

    let currentLength = 0;
    const interval = setInterval(() => {
      if (currentLength >= responseText.length) {
        clearInterval(interval);
        setSandboxExecuting(false);
      } else {
        currentLength += Math.min(5, responseText.length - currentLength);
        setSandboxConsole(responseText.substring(0, currentLength));
      }
    }, 15);
  };

  const toggleSavePrompt = (id: string) => {
    const isSaved = savedPrompts[id];
    saveBookmarkLocally(id, !isSaved);
    playBeep(isSaved ? 320 : 840, 0.08, 'sine');
  };

  const nextSlide = () => {
    playBeep(600, 0.05);
    setActiveSlide(prev => (prev + 1) % EXPLORATION_SLIDES.length);
  };

  const prevSlide = () => {
    playBeep(600, 0.05);
    setActiveSlide(prev => (prev - 1 + EXPLORATION_SLIDES.length) % EXPLORATION_SLIDES.length);
  };

  // Bento Alternating Layout column classes
  const getBentoClasses = (index: number) => {
    const patterns = [
      'md:col-span-2 md:row-span-1', // Wide
      'md:col-span-1 md:row-span-2', // Tall
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-2 md:row-span-2', // Large
      'md:col-span-1 md:row-span-1', // Regular
      'md:col-span-1 md:row-span-1', // Regular
    ];
    return patterns[index % patterns.length];
  };

  // Filter saved prompts list based on search/category/model state
  const allSavedPrompts = prompts.filter(p => savedPrompts[p.id]);
  const totalSavedCount = allSavedPrompts.length;

  const filteredSavedList = allSavedPrompts.filter(p => {
    const matchesSearch = savedSearchQuery === '' || 
      p.title.toLowerCase().includes(savedSearchQuery.toLowerCase()) ||
      p.body.toLowerCase().includes(savedSearchQuery.toLowerCase());
    
    const matchesCategory = savedSelectedCategory === 'All' || p.category === savedSelectedCategory;
    const matchesModel = savedSelectedModel === 'All' || p.model === savedSelectedModel;
    
    return matchesSearch && matchesCategory && matchesModel;
  });

  // Calculate statistics for the saved list
  const savedCategoryCounts = allSavedPrompts.reduce((acc, p) => {
    acc[p.category] = (acc[p.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const savedModelCounts = allSavedPrompts.reduce((acc, p) => {
    acc[p.model] = (acc[p.model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div 
      dir={lang === 'ar' ? 'rtl' : 'ltr'} 
      className="min-h-screen flex flex-col font-sans transition-colors duration-500 overflow-x-hidden bg-background text-[#dfe2f1]"
    >
      
      {/* Global Telemetry Scanline Overlay */}
      {scanlinesActive && (
        <div className="fixed inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.1)+50%)] bg-[size:100%_4px] z-[9999] opacity-35" />
      )}

      {/* Interactive Stardust particle canvas backdrop */}
      <StarDustCanvas theme={theme} />
      
      {/* CSS Animation imports and Custom Rules */}
      <style jsx global>{`
        .font-instrument {
          font-family: 'Instrument Serif', Georgia, serif;
          font-style: italic;
        }

        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .animate-marquee {
          display: flex;
          width: 200%;
          animation: marquee 24s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        .gradient-accent-text {
          background: linear-gradient(135deg, #89AACC 0%, #4E85BF 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gradient-accent-bg {
          background: linear-gradient(135deg, #89AACC 0%, #4E85BF 100%);
        }

        .gradient-accent-border {
          border-image: linear-gradient(to right, #89AACC, #4E85BF) 1;
        }

        @keyframes custom-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-orbit-1 {
          transform-origin: 50px 50px;
          animation: custom-spin 12s linear infinite;
        }

        .animate-orbit-2 {
          transform-origin: 50px 50px;
          animation: custom-spin 8s linear infinite reverse;
        }

        @keyframes split-slide {
          0%, 100% { transform: translateX(-15px); }
          50% { transform: translateX(15px); }
        }
        .animate-split {
          animation: split-slide 4s ease-in-out infinite;
        }

        @keyframes timeline-play {
          0% { transform: translateX(-10px); opacity: 0.8; }
          90% { transform: translateX(50px); opacity: 0.8; }
          91%, 100% { transform: translateX(50px); opacity: 0; }
        }
        .animate-timeline-play {
          animation: timeline-play 3s linear infinite;
        }

        @keyframes shield-scan {
          0%, 100% { transform: translateY(0px); opacity: 0.8; }
          50% { transform: translateY(20px); opacity: 0.8; }
        }
        .animate-shield-scan {
          animation: shield-scan 2.5s ease-in-out infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>



      {/* Global Header */}
      <header className="fixed top-4 left-4 right-4 md:left-6 md:right-6 rounded-2xl border border-white/5 bg-panel/75 backdrop-blur-xl px-6 md:px-10 h-16 z-50 flex justify-between items-center transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 group cursor-pointer select-none" onClick={() => playBeep(520, 0.05, 'triangle')}>
            {/* Creative 3D Isometric SVG Logo */}
            <div className="relative shrink-0 flex items-center justify-center">
              <svg 
                viewBox="0 0 100 100" 
                className="w-8 h-8 md:w-9 md:h-9 transition-all duration-700 ease-out hover:scale-110 cursor-pointer"
              >
                <defs>
                  <linearGradient id="cubeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#89AACC" />
                    <stop offset="100%" stopColor="#4E85BF" />
                  </linearGradient>
                  <linearGradient id="glowGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#89AACC" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#4E85BF" stopOpacity="0" />
                  </linearGradient>
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="3" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                
                {/* Inner Pulsing Orb */}
                <circle 
                  cx="50" 
                  cy="50" 
                  r="9" 
                  fill="url(#cubeGradient)" 
                  className="animate-pulse" 
                />
                
                {/* Rotating Orbiting Ring 1 */}
                <ellipse 
                  cx="50" 
                  cy="50" 
                  rx="32" 
                  ry="12" 
                  fill="none" 
                  stroke="url(#cubeGradient)" 
                  strokeWidth="1.5" 
                  strokeDasharray="4 8"
                  transform="rotate(30 50 50)"
                  className="animate-orbit-1"
                />

                {/* Rotating Orbiting Ring 2 */}
                <ellipse 
                  cx="50" 
                  cy="50" 
                  rx="32" 
                  ry="12" 
                  fill="none" 
                  stroke="#4E85BF" 
                  strokeWidth="1.5" 
                  strokeDasharray="12 6"
                  transform="rotate(-45 50 50)"
                  className="animate-orbit-2"
                />

                {/* Isometric Cube Wireframe */}
                <polygon 
                  points="50,22 74,34 50,46 26,34" 
                  fill="none" 
                  stroke="url(#cubeGradient)" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <polygon 
                  points="26,34 50,46 50,74 26,62" 
                  fill="none" 
                  stroke="url(#cubeGradient)" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                <polygon 
                  points="50,46 74,34 74,62 50,74" 
                  fill="none" 
                  stroke="url(#cubeGradient)" 
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />
                
                {/* Center Node Points */}
                <circle cx="50" cy="22" r="2.5" fill="#89AACC" />
                <circle cx="74" cy="34" r="2.5" fill="#4E85BF" />
                <circle cx="26" cy="34" r="2.5" fill="#4E85BF" />
                <circle cx="50" cy="74" r="2.5" fill="#89AACC" />
                <circle cx="50" cy="46" r="3" fill="#ffffff" filter="url(#neonGlow)" />
              </svg>
              {/* Outer Orbiting ring glow */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-neon-cyan to-neon-blue opacity-10 blur-[4px] pointer-events-none"></div>
            </div>
            {/* Text logo */}
            <div className="flex flex-col">
              <span className="text-xs font-black font-mono tracking-widest text-white leading-none uppercase">
                VIBE<span className="text-neon-cyan">PROMPT</span>
              </span>
              <span className="text-[7px] font-bold font-mono tracking-widest text-neon-blue uppercase mt-0.5">
                CONSOLE // v2.6
              </span>
            </div>
          </div>
          <Show when="signed-in">
            <nav className="hidden md:flex items-center gap-6 text-xs font-mono">
              <button 
                onClick={() => setActiveTab('explore')}
                className={`pb-1 transition-all uppercase tracking-wider ${activeTab === 'explore' ? 'text-white border-b border-neon-cyan' : 'text-slate-400 hover:text-white'}`}
              >
                // {t('explorer')}
              </button>
              <button 
                onClick={() => { setActiveTab('workspace'); playBeep(520, 0.05); }}
                onDragOver={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.add('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30');
                }}
                onDragLeave={(e) => {
                  e.currentTarget.classList.remove('bg-neon-cyan/10', 'text-white');
                  e.currentTarget.classList.remove('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30');
                }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('bg-emerald-500/10', 'text-emerald-400', 'border-emerald-500/30');
                  const promptId = e.dataTransfer.getData('promptId');
                  if (promptId) {
                    saveBookmarkLocally(promptId, true);
                    addNotification(`[WORKSPACE] BOOKMARKED PROMPT #${promptId.substring(0, 4).toUpperCase()}`);
                    playBeep(880, 0.15, 'sine');
                  }
                }}
                className={`pb-1 px-2 border border-transparent transition-all uppercase tracking-wider relative flex items-center gap-1.5 ${
                  activeTab === 'workspace' ? 'text-white border-b border-neon-cyan' : 'text-slate-400 hover:text-white'
                } ${draggedPromptId ? 'border-dashed border-emerald-500/50 animate-pulse text-emerald-400' : ''}`}
              >
                <span>// {t('savedBlueprints')}</span>
                {draggedPromptId && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-emerald-500 text-black font-extrabold font-mono text-[7px] px-1.5 py-0.5 rounded tracking-widest animate-bounce z-50">
                    [DROP]
                  </span>
                )}
              </button>
              {isAdmin && (
                <button 
                  onClick={() => setActiveTab('admin')}
                  className={`pb-1 transition-all uppercase tracking-wider ${activeTab === 'admin' ? 'text-white border-b border-neon-cyan' : 'text-slate-400 hover:text-white'}`}
                >
                  // {t('compilerLogs')}
                </button>
              )}
            </nav>
          </Show>
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          {/* Appearance Settings / Theme Toolbox */}
          <div className="relative" ref={toolboxRef}>
            <button
              onClick={() => { setShowThemeToolbox(!showThemeToolbox); playBeep(600, 0.08, 'triangle'); }}
              className={`p-2 rounded-lg border border-white/5 bg-black/40 text-slate-400 hover:text-white hover:border-white/10 transition-all flex items-center gap-2 cursor-pointer ${showThemeToolbox ? 'border-neon-cyan text-neon-cyan' : ''}`}
              title="Interface Appearance Options"
            >
              <Palette className="w-4 h-4 text-neon-cyan" />
              <span className="hidden sm:inline font-mono text-[10px] tracking-wider uppercase">Appearance</span>
            </button>
            
            {showThemeToolbox && (
              <div className="fixed left-1/2 top-20 -translate-x-1/2 sm:absolute sm:left-auto sm:right-0 sm:top-12 sm:translate-x-0 mt-1 w-[calc(100vw-2rem)] sm:w-80 max-w-[340px] sm:max-w-none bg-panel border border-white/10 rounded-xl p-5 shadow-2xl z-[999] transition-all duration-300 animate-fadeIn font-mono text-xs text-slate-300 space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-2 mb-2">
                  <span className="font-bold text-[10px] tracking-widest text-neon-cyan uppercase">// Theme Selector</span>
                  <button 
                    onClick={() => { setShowThemeToolbox(false); playBeep(500, 0.05); }}
                    className="text-slate-400 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                
                {/* Visual Options Grid */}
                <div className="space-y-2">
                  {[
                    { id: 'neon', name: 'NEBULA', bg: '#000000', fg: '#ffffff', primary: '#c084fc', secondary: '#60a5fa', desc: 'High-contrast space console with floating stardust particles.' },
                    { id: 'cyberpunk', name: 'CYBERPUNK', bg: '#0f051d', fg: '#f8f0ff', primary: '#ff007f', secondary: '#ffea00', desc: 'Dynamic synthetic interface with saturated pink & gold.' },
                    { id: 'terminal', name: 'TERMINAL', bg: '#000000', fg: '#00ff66', primary: '#ffb000', secondary: '#00ff66', desc: 'Monospaced carbon console with matrix phosphorus decay.' },
                    { id: 'alabaster', name: 'ALABASTER', bg: '#f4f6fa', fg: '#1e2433', primary: '#4b6b94', secondary: '#2c3e50', desc: 'Polarized light mode, high-density paper-white layout.' }
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => changeTheme(t.id as any)}
                      className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 cursor-pointer ${theme === t.id ? 'border-neon-cyan bg-white/[0.04]' : 'border-white/5 bg-black/25 hover:bg-white/[0.02]'}`}
                    >
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-[10px] tracking-wider uppercase ${theme === t.id ? 'text-neon-cyan' : 'text-slate-300'}`}>
                            {t.name}
                          </span>
                          {/* Mini Palette Indicator */}
                          <div className="flex items-center gap-0.5 border border-white/10 rounded overflow-hidden">
                            <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: t.bg }}></span>
                            <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: t.fg }}></span>
                            <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: t.primary }}></span>
                            <span className="w-2.5 h-2.5 inline-block" style={{ backgroundColor: t.secondary }}></span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-400 leading-snug">
                          {t.desc}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 border-t border-white/5 pt-3">
                  <span>INTERFACE SCANLINES</span>
                  <button 
                    onClick={() => { setScanlinesActive(!scanlinesActive); playBeep(650, 0.05); }}
                    className={`px-2.5 py-0.5 rounded text-[8px] uppercase font-bold tracking-wider transition-all border cursor-pointer ${scanlinesActive ? 'bg-white/10 border-white/10 text-white' : 'border-white/5 text-slate-500 hover:text-slate-400'}`}
                  >
                    {scanlinesActive ? 'ENABLED' : 'DISABLED'}
                  </button>
                </div>
                  
                  <div className="text-[9px] text-slate-500 leading-normal font-sans">
                    * Interactive display changes are persistent across app reboots.
                  </div>
                </div>
            )}
          </div>

          {/* Language Toggle */}
          <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-black/35 font-mono text-[9px] h-7">
            <button
              onClick={() => changeLang('en')}
              className={`px-2.5 h-full uppercase transition-all hover:bg-white/5 cursor-pointer ${
                lang === 'en' ? 'text-neon-cyan bg-white/[0.08] font-bold' : 'text-slate-500'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => changeLang('ar')}
              className={`px-2.5 h-full uppercase transition-all hover:bg-white/5 cursor-pointer ${
                lang === 'ar' ? 'text-neon-cyan bg-white/[0.08] font-bold' : 'text-slate-500'
              }`}
            >
              AR
            </button>
          </div>

          <Show when="signed-out">
            <SignInButton mode="redirect">
              <button className="px-4 py-1.5 text-[10px] font-bold font-mono tracking-widest uppercase rounded border border-neon-cyan/20 text-neon-cyan bg-neon-cyan/5 hover:bg-neon-cyan/15 transition-all cursor-pointer">
                {t('accessTerminal')}
              </button>
            </SignInButton>
          </Show>

          <Show when="signed-in">
            <div className="flex items-center gap-3">
              <span className="hidden lg:inline font-mono text-[9px] text-slate-400 bg-black/35 border border-white/5 px-2 py-0.5 rounded">
                {t('secureId')} // {user?.firstName?.toUpperCase() ?? 'DEV'}
              </span>
              <UserButton />
            </div>
          </Show>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-28 md:pb-20 px-4 sm:px-12 flex-grow max-w-[1400px] w-full mx-auto z-10 relative">
        
        {/* Connection status diagnostics banner */}
        {jwtError && (
          <div className="mb-8 p-4 bg-red-950/20 border border-red-500/20 rounded-xl flex gap-3 items-start animate-pulse">
            <ShieldAlert className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="text-xs space-y-1 font-mono">
              <h4 className="font-bold text-red-200 uppercase">Clerk JWT Template Warning</h4>
              <p className="text-red-300/80">
                Database client template is unlinked. Gracefully executing in static curation mode.
              </p>
            </div>
          </div>
        )}

        {/* LOGGED OUT: Beautiful Interactive Landing Page */}
        <Show when="signed-out">
          <section className="space-y-24 py-8 relative">
            {/* Ambient Background Spotlight Glows */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-neon-cyan/5 rounded-full blur-[140px] pointer-events-none -z-10" />
            <div className="absolute top-40 left-1/4 w-[400px] h-[400px] bg-neon-blue/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            
            {/* Cinematic Hero Section */}
            <div className="text-center max-w-4xl mx-auto space-y-8 relative">
              <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-4 py-1 rounded-full text-[9px] font-mono tracking-widest text-neon-cyan uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                Prompt Console for Modern AI Flagships // June 2026 Edition
              </div>

              {/* Instrument Serif display type */}
              <h1 className="text-5xl sm:text-8xl tracking-tight leading-[1.05] text-[#dfe2f1]">
                {lang === 'ar' ? (
                  <>
                    إعادة تعريف هياكل النماذج <br />
                    <span className="font-instrument text-neon-cyan">
                      لنماذج التفكير المتقدمة
                    </span>
                  </>
                ) : (
                  <>
                    Redefine prompt structures <br />
                    <span className="font-instrument text-neon-cyan">
                      for advanced reasoning models
                    </span>
                  </>
                )}
              </h1>
              
              <p className="text-slate-400 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-mono">
                {t('heroSubtitle')}
              </p>

              {/* Space Authorization Terminal Card */}
              <div className="max-w-xl w-full mx-auto p-6 rounded-2xl glass-panel-glow text-left space-y-4 relative overflow-hidden mt-8 border border-neon-cyan/25 shadow-[0_0_30px_rgba(76,215,246,0.08)]">
                {/* Scanner layout lines */}
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-neon-cyan/40 to-transparent animate-pulse" />
                <div className="flex justify-between items-center border-b border-white/5 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-neon-cyan animate-ping" />
                    <span className="font-mono text-[9px] text-neon-cyan uppercase tracking-widest leading-none">
                      {t('spaceClearance')}
                    </span>
                  </div>
                  <span className="font-mono text-[8px] text-slate-500">// SYS_SECURE_AUTH</span>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-1 text-center sm:text-left">
                    <p className="font-mono text-[10px] text-slate-300 leading-normal">
                      {t('terminalLogText')}
                    </p>
                    <p className="text-[8px] font-mono text-slate-500">
                      {t('authMessage')}
                    </p>
                  </div>
                  
                  <SignInButton mode="redirect">
                    <button className="px-6 py-3 shrink-0 text-xs font-black tracking-widest uppercase rounded-xl shadow-lg cursor-pointer hover:scale-105 active:scale-95 transition-all gradient-accent-bg text-black hover:shadow-[0_0_20px_rgba(76,215,246,0.3)]">
                      {t('initiateSession')}
                    </button>
                  </SignInButton>
                </div>
              </div>

              {/* Provider Integration Ledger */}
              <div className="pt-2 max-w-2xl mx-auto space-y-3">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">// {t('deployedIntegrations')}</span>
                <div className="flex flex-wrap justify-center gap-2">
                    {[
                      { name: 'OpenAI GPT-5.5', color: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' },
                      { name: 'Anthropic Claude 4.8', color: 'border-orange-500/20 text-orange-400 bg-orange-500/5' },
                      { name: 'Google Gemini 3.5', color: 'border-blue-500/20 text-blue-400 bg-blue-500/5' },
                      { name: 'Black Forest Flux 1.1', color: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/5' },
                      { name: 'Midjourney v7', color: 'border-amber-500/20 text-amber-400 bg-amber-500/5' },
                      { name: 'Runway Gen-3', color: 'border-purple-500/20 text-purple-400 bg-purple-500/5' },
                    ].map((provider) => (
                      <div 
                        key={provider.name}
                        className={`px-3 py-1.5 rounded-lg border text-[9px] font-mono font-bold tracking-wider uppercase transition-all hover:border-white/20 select-none ${provider.color}`}
                      >
                        {provider.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            {/* Cinematic HLS Hero Video Simulator */}
            <div className="max-w-5xl mx-auto bg-black/80 border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="p-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center px-6 font-mono text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-neon-cyan"></span>
                  <span>HLS_STREAM_LOADER // VIDEO_FEED_01.M3U8</span>
                </div>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => { setIsPlayingHeroVideo(!isPlayingHeroVideo); playBeep(500, 0.05); }}
                    className="hover:text-white transition-all flex items-center gap-1"
                  >
                    {isPlayingHeroVideo ? 'PAUSE' : 'PLAY'}
                  </button>
                  <button 
                    onClick={() => { setHeroVideoVolume(!heroVideoVolume); playBeep(500, 0.05); }}
                    className="hover:text-white transition-all flex items-center gap-1"
                  >
                    {heroVideoVolume ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
                    <span>{heroVideoVolume ? 'UNMUTED' : 'MUTED'}</span>
                  </button>
                </div>
              </div>

              <div className="relative aspect-[2.39/1] w-full bg-input-custom flex items-center justify-center overflow-hidden">
                <canvas ref={heroVideoCanvasRef} className="absolute inset-0 w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none"></div>
                
                {/* Visual scanlines overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)+50%,rgba(0,0,0,0.25)+50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[size:100%_4px,6px_100%] pointer-events-none opacity-40"></div>

                <div className="absolute bottom-6 left-6 font-mono text-[10px] text-slate-400 space-y-0.5">
                  <p>SYS_STATUS: COMPILED_STREAM_ONLINE</p>
                  <p>BANDWIDTH: 14.8 MB/S</p>
                </div>
              </div>
            </div>

            {/* Scroll-pinned Parallax Exploration Gallery */}
            <div className="max-w-5xl mx-auto py-12 space-y-6">
              <div className="flex justify-between items-center border-b border-white/5 pb-4">
                <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neon-cyan" /> Exploration Gallery
                </h3>
                <div className="flex gap-2">
                  <button 
                    onClick={prevSlide}
                    className="p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-neon-cyan"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={nextSlide}
                    className="p-2 rounded bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-neon-cyan"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Slider wrapper with parallax layers */}
              <div className="relative overflow-hidden rounded-2xl border border-white/5 min-h-[320px] bg-input-custom flex items-center p-8 md:p-12">
                {/* Parallax Background Layer */}
                <div className="absolute inset-0 opacity-15 pointer-events-none transition-transform duration-700 ease-out"
                     style={{ transform: `scale(1.15) translate(${-activeSlide * 10}px, 0)` }}>
                  <div className="w-full h-full bg-gradient-to-r from-blue-900/40 via-purple-900/30 to-black"></div>
                </div>

                <div className="relative z-10 max-w-xl space-y-4">
                  <div className="inline-flex items-center gap-2 text-[10px] font-mono text-neon-cyan uppercase">
                    {React.createElement(EXPLORATION_SLIDES[activeSlide].icon, { className: "w-4 h-4" })}
                    <span>{lang === 'ar' ? EXPLORATION_SLIDES[activeSlide].subtitle_ar : EXPLORATION_SLIDES[activeSlide].subtitle}</span>
                  </div>
                  <h2 className="text-3xl font-extrabold text-[#dfe2f1] font-mono">{lang === 'ar' ? EXPLORATION_SLIDES[activeSlide].title_ar : EXPLORATION_SLIDES[activeSlide].title}</h2>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans">{lang === 'ar' ? EXPLORATION_SLIDES[activeSlide].description_ar : EXPLORATION_SLIDES[activeSlide].description}</p>
                </div>
              </div>
            </div>

            {/* Alternating Bento Works Grid */}
            <div className="space-y-6">
              <h3 className="font-mono text-xs text-slate-500 uppercase tracking-widest flex items-center gap-2">
                <LayoutGrid className="w-4 h-4 text-neon-cyan" /> Alternating Bento Works Grid
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
                {CURATED_PROMPTS.slice(0, 6).map((p, i) => (
                  <div 
                    key={p.id} 
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                      e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                    }}
                    className={`p-6 rounded-xl flex flex-col justify-between border border-white/5 bg-panel/80 hover:border-neon-cyan/40 hover:shadow-[0_0_20px_var(--border-glow)] overflow-hidden transition-all duration-300 spotlight-card ${getBentoClasses(i)}`}
                  >
                    <PromptVisualizer prompt={p} />
                    <div className="space-y-3 overflow-hidden">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-[#dfe2f1] text-xs font-mono leading-snug">
                          {lang === 'ar' ? p.title_ar || p.title : p.title}
                        </h4>
                        <span className="px-2 py-0.5 rounded text-[8px] font-mono shrink-0 uppercase bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20">
                          {p.model}
                        </span>
                      </div>
                      {p.description && (
                        <p className="text-[10px] text-slate-400 font-sans line-clamp-2 text-left">
                          {lang === 'ar' ? p.description_ar || p.description : p.description}
                        </p>
                      )}
                      <div className="bg-black/40 border border-white/5 p-3 rounded font-mono text-[9px] text-slate-400 max-h-36 overflow-y-auto custom-scrollbar select-text">
                        <pre className="whitespace-pre-wrap">{p.body}</pre>
                      </div>
                    </div>
                    
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center text-[10px]">
                      <span className="text-slate-400 uppercase tracking-wider font-mono text-[9px]">{t('categoryLabel')} {getCategoryTranslation(p.category, lang)}</span>
                      <button 
                        onClick={() => copyToClipboard(p.body, p.id)}
                        className="flex items-center gap-1 font-mono hover:underline text-neon-cyan"
                      >
                        {copiedId === p.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        {copiedId === p.id ? 'COPIED' : 'COPY'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive Sandbox Widget Builder */}
            <div className="max-w-4xl mx-auto bg-black/60 border border-white/5 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="p-4 border-b border-white/5 bg-white/[0.01] flex justify-between items-center px-6">
                <div className="flex items-center gap-2">
                  <Code className="w-4 h-4 text-neon-cyan" />
                  <span className="font-mono text-[10px] text-slate-400 uppercase">Interactive Widget Simulator</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setSandboxActiveWidget('particles'); playBeep(640, 0.08, 'sine'); }}
                    className={`px-3 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${sandboxActiveWidget === 'particles' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Reactive Canvas
                  </button>
                  <button 
                    onClick={() => { setSandboxActiveWidget('companion'); playBeep(780, 0.08, 'sine'); }}
                    className={`px-3 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${sandboxActiveWidget === 'companion' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Interactive Pet
                  </button>
                  <button 
                    onClick={() => { setSandboxActiveWidget('visualizer'); playBeep(900, 0.08, 'sine'); }}
                    className={`px-3 py-1 rounded text-[10px] font-mono transition-all cursor-pointer ${sandboxActiveWidget === 'visualizer' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'}`}
                  >
                    Audio Analyzer
                  </button>
                </div>
              </div>

              <div className="p-8 min-h-[340px] flex items-center justify-center relative overflow-hidden bg-input-custom">

                {/* Particles Interactive Canvas Sandbox */}
                {sandboxActiveWidget === 'particles' && (
                  <div className="w-full h-full absolute inset-0 bg-input-custom">
                    <canvas ref={particlesCanvasRef} className="w-full h-full block cursor-crosshair" />
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-black/80 border border-white/15 px-4 py-3 rounded-lg flex flex-wrap justify-between items-center gap-3 z-20">
                      <span className="font-mono text-[9px] text-neon-cyan">// MOVE CURSOR & CLICK TO EMIT NEON DUST</span>
                      <div className="flex items-center gap-4 text-[10px] font-mono">
                        <label className="text-slate-400">Speed:</label>
                        <input 
                          type="range" 
                          min="1" 
                          max="5" 
                          value={particleSpeed}
                          onChange={(e) => { setParticleSpeed(Number(e.target.value)); playBeep(400 + Number(e.target.value)*50, 0.05); }}
                          className="w-16 accent-neon-cyan"
                        />
                        <button 
                          onClick={() => { setParticleCount(prev => prev === 60 ? 120 : 60); playBeep(600, 0.08, 'triangle'); }}
                          className="px-2 py-0.5 rounded border border-white/10 hover:bg-white/5"
                        >
                          Density: {particleCount === 60 ? 'Low' : 'High'}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Interactive Virtual Companion Sandbox */}
                {sandboxActiveWidget === 'companion' && (
                  <div className="w-full max-w-sm p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md space-y-6 text-center relative z-10 shadow-xl">
                    <h3 className="font-mono text-xs uppercase tracking-widest text-slate-300">Interactive Cyber Pet overlay</h3>
                    
                    <div className="flex flex-col items-center gap-4">
                      {/* CSS Interactive Animated Pet Creature */}
                      <div 
                        onClick={pokePet}
                        className={`w-20 h-20 rounded-full bg-gradient-to-tr from-neon-cyan to-neon-blue shadow-2xl relative cursor-pointer flex items-center justify-center transition-all duration-300 hover:scale-105 active:scale-95 ${
                          petExpression === 'dizzy' ? 'animate-spin' : 'animate-bounce'
                        }`}
                      >
                        {/* Eyes */}
                        <div className="flex gap-4 justify-center items-center w-full">
                          {petExpression === 'dizzy' ? (
                            <>
                              <span className="font-mono text-black font-bold text-lg">x</span>
                              <span className="font-mono text-black font-bold text-lg">x</span>
                            </>
                          ) : petExpression === 'excited' ? (
                            <>
                              <span className="font-mono text-black font-bold text-lg">^</span>
                              <span className="font-mono text-black font-bold text-lg">^</span>
                            </>
                          ) : (
                            <>
                              <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                              <span className="w-2.5 h-2.5 rounded-full bg-black"></span>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Dialog speech bubble */}
                      <div className="bg-black/40 border border-white/15 p-3 rounded-lg text-xs font-mono text-neon-cyan leading-relaxed max-w-xs min-h-[50px] flex items-center justify-center">
                        "{petSpeech}"
                      </div>

                      {/* Level XP Bar */}
                      <div className="w-full space-y-1.5">
                        <div className="flex justify-between text-[9px] font-mono text-slate-400">
                          <span>EXP LEVEL PROGRESS</span>
                          <span>{petXp}%</span>
                        </div>
                        <div className="w-full bg-black/40 h-2.5 rounded-full overflow-hidden border border-white/5">
                          <div className="bg-gradient-to-r from-neon-cyan to-neon-blue h-full transition-all duration-300" style={{ width: `${petXp}%` }}></div>
                        </div>
                      </div>

                      {/* Control buttons */}
                      <div className="flex gap-3 justify-center text-xs font-mono">
                        <button 
                          onClick={feedPet}
                          className="px-4 py-1.5 rounded-lg bg-neon-blue hover:bg-neon-cyan text-white font-bold transition-all"
                        >
                          Feed Pet
                        </button>
                        <button 
                          onClick={askWisdom}
                          className="px-4 py-1.5 rounded-lg bg-indigo-900/60 hover:bg-indigo-800 text-white font-bold transition-all"
                        >
                          Ask Wisdom
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Audio Visualizer Sandbox Widget */}
                {sandboxActiveWidget === 'visualizer' && (
                  <div className="w-full h-full absolute inset-0 bg-input-custom">
                    <canvas ref={visualizerCanvasRef} className="w-full h-full block" />
                    
                    <div className="absolute bottom-4 left-4 right-4 bg-black/85 border border-white/15 px-4 py-3 rounded-lg flex flex-wrap justify-between items-center gap-3 z-20">
                      <div className="flex items-center gap-2">
                        {isAnalyzerActive ? (
                          <button
                            onClick={stopAudioAnalyzer}
                            className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded bg-red-950/60 border border-red-500/30 text-red-400 hover:bg-red-900 transition-all cursor-pointer"
                          >
                            Disable Audio
                          </button>
                        ) : (
                          <button
                            onClick={startAudioAnalyzer}
                            className="px-3 py-1 text-[10px] font-mono font-bold uppercase rounded bg-neon-cyan/20 border border-neon-cyan/30 text-white hover:bg-neon-cyan/30 transition-all cursor-pointer animate-pulse"
                          >
                            Enable Audio Analyzer
                          </button>
                        )}
                        <span className="font-mono text-[9px] text-slate-400 hidden sm:inline">
                          {isMicConnected ? '// LIVE AUDIO STREAM' : '// SIMULATING SINE WAVES'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[10px] font-mono">
                        <label className="text-slate-400">Mode:</label>
                        {['bars', 'wave', 'circle'].map((mode) => (
                          <button
                            key={mode}
                            onClick={() => { setVisualizerMode(mode as 'bars' | 'wave' | 'circle'); playBeep(700, 0.05); }}
                            className={`px-2 py-0.5 rounded uppercase border transition-all cursor-pointer ${visualizerMode === mode ? 'bg-white/10 text-white font-bold border-white/20' : 'text-slate-400 hover:text-white border-transparent'}`}
                          >
                            {mode}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </section>
        </Show>

        {/* LOGGED IN INTERFACE CONSOLE */}
        <Show when="signed-in">
          {/* TAB 1: Explore and search Prompts Library */}
          {activeTab === 'explore' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-6 border-b border-white/5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
                    {t('explorerTitle')} <span className="text-xs font-mono text-slate-500 font-normal">// explorer.sh</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-mono">{t('explorerSubtitle')}</p>
                </div>

                <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input 
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('searchPlaceholder')}
                      className="bg-black/60 border border-white/10 text-xs rounded-lg pl-10 pr-4 py-2.5 w-full sm:w-64 focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/20 focus:shadow-[0_0_15px_var(--border-glow)] text-white font-mono transition-all duration-300"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Filters sidebar */}
                <aside className="lg:col-span-3 rounded-xl p-6 h-fit space-y-6 backdrop-blur-md bg-panel/50 border border-white/5">
                  <div>
                    <h3 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-neon-cyan" /> {t('categoryFilter')}
                    </h3>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {['All', ...ALLOWED_CATEGORIES].map((c) => (
                        <button
                          key={c}
                          onClick={() => { setSelectedCategory(c); playBeep(580, 0.05); }}
                          className={`px-3 py-2 text-left rounded-lg text-xs font-mono border transition-all uppercase ${selectedCategory === c ? 'bg-neon-cyan/15 text-white font-bold border-neon-cyan/30 shadow-[0_0_12px_var(--border-glow)]' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                          {c === 'All' ? t('all') : getCategoryTranslation(c, lang)}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-mono text-[9px] text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-neon-cyan" /> {t('engineTarget')}
                    </h3>
                    <div className="flex flex-wrap lg:flex-col gap-1.5">
                      {['All', ...ALLOWED_MODELS].map((m) => (
                        <button
                          key={m}
                          onClick={() => { setSelectedModel(m); playBeep(640, 0.05); }}
                          className={`px-3 py-2 text-left rounded-lg text-xs font-mono border transition-all ${selectedModel === m ? 'bg-neon-cyan/15 text-white font-bold border-neon-cyan/30 shadow-[0_0_12px_var(--border-glow)]' : 'border-transparent text-slate-400 hover:bg-white/5 hover:text-white'}`}
                        >
                        {m === 'All' ? t('all') : m}
                        </button>
                      ))}
                    </div>
                  </div>
                </aside>

                {/* Main Prompts Grid */}
                <div className="lg:col-span-9 space-y-6">
                  {/* Creative Sorting Dashboard Deck */}
                  <div className="bg-panel/40 border border-white/5 rounded-xl p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs font-mono">
                    <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                      <div className="flex items-center gap-2 text-slate-400 select-none">
                        <Sliders className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
                        <span className="text-[10px] uppercase tracking-wider font-bold">// {t('ledgerSortMatrix')}</span>
                      </div>

                      {/* View Mode Toggle */}
                      <div className="flex border border-white/5 bg-black/35 rounded-lg p-0.5 select-none text-[9px] shrink-0">
                        <button
                          onClick={() => { setViewMode('list'); playBeep(620, 0.05); }}
                          className={`px-2.5 py-1 rounded transition-all uppercase font-bold tracking-wider cursor-pointer ${viewMode === 'list' ? 'bg-neon-cyan/15 text-white border border-neon-cyan/30' : 'text-slate-500 hover:text-slate-400 border border-transparent'}`}
                        >
                          {t('listView')}
                        </button>
                        <button
                          onClick={() => { setViewMode('post'); playBeep(650, 0.05); }}
                          className={`px-2.5 py-1 rounded transition-all uppercase font-bold tracking-wider cursor-pointer ${viewMode === 'post' ? 'bg-neon-cyan/15 text-white border border-neon-cyan/30' : 'text-slate-500 hover:text-slate-400 border border-transparent'}`}
                        >
                          {t('postView')}
                        </button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                      {[
                        { id: 'date', labelKey: 'dateStamp', num: '01' },
                        { id: 'title_asc', labelKey: 'titleAz', num: '02' },
                        { id: 'title_desc', labelKey: 'titleZa', num: '03' },
                        { id: 'model', labelKey: 'aiEngine', num: '04' },
                        { id: 'length', labelKey: 'payloadSize', num: '05' },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSortBy(opt.id as any);
                            playBeep(650 - (['date', 'title_asc', 'title_desc', 'model', 'length'].indexOf(opt.id) * 30), 0.05, 'triangle');
                          }}
                          className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:border-white/20 active:scale-95 ${
                            sortBy === opt.id 
                              ? 'bg-gradient-to-r from-neon-cyan/15 to-neon-blue/15 border-neon-cyan/50 text-white font-bold shadow-[0_0_12px_var(--border-glow)]' 
                              : 'bg-black/35 border-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span className={`text-[7px] font-bold ${sortBy === opt.id ? 'text-neon-cyan' : 'text-slate-600'}`}>
                            [{opt.num}]
                          </span>
                          <span>{t(opt.labelKey as any)}</span>
                          {sortBy === opt.id && (
                            <span className="w-1 h-2 bg-neon-cyan animate-[blink_0.8s_infinite] inline-block shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {loadingData ? (
                    <div className="text-center py-24 text-slate-500 font-mono text-xs animate-pulse flex items-center justify-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-neon-cyan" />
                      // {t('compilingLedgers')}
                    </div>
                  ) : prompts.length === 0 ? (
                    <div className="text-center py-20 bg-black/40 border border-white/5 rounded-xl text-slate-500 font-mono text-xs">
                      // {t('zeroEntries')}
                    </div>
                  ) : (
                    <>
                      {viewMode === 'list' ? (
                        <div className="space-y-4">
                          {sortPrompts(prompts).map((p, index) => (
                            <PromptListRow
                              key={p.id}
                              p={p}
                              index={index}
                              isExpanded={!!expandedPromptIds[p.id]}
                              onToggleExpand={() => togglePromptExpand(p.id)}
                              isSaved={!!savedPrompts[p.id]}
                              onToggleSave={() => toggleSavePrompt(p.id)}
                              onOpenDrawer={() => openPromptDrawer(p)}
                              onCopy={() => copyToClipboard(p.body, p.id)}
                              copiedId={copiedId}
                              t={t}
                              lang={lang}
                            />
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                          {sortPrompts(prompts).map((p, index) => (
                            <PromptPostCard
                              key={p.id}
                              p={p}
                              index={index}
                              isSaved={!!savedPrompts[p.id]}
                              onToggleSave={() => toggleSavePrompt(p.id)}
                              onOpenDrawer={() => openPromptDrawer(p)}
                              onCopy={() => copyToClipboard(p.body, p.id)}
                              copiedId={copiedId}
                              isAdmin={isAdmin}
                              onEditPhoto={() => setPhotoEditPrompt(p)}
                              onDragStart={(e) => handleDragStart(e, p.id, p.body)}
                              onDragEnd={handleDragEnd}
                              t={t}
                              lang={lang}
                            />
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Bookmarked Templates Workspace */}
          {activeTab === 'workspace' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 pb-6 border-b border-white/5">
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-tight uppercase flex items-center gap-2">
                    {t('workspaceTitle')} <span className="text-xs font-mono text-slate-500 font-normal">// workspace.db</span>
                  </h2>
                  <p className="text-slate-400 text-xs font-mono">{t('workspaceSubtitle')}</p>
                </div>
                
                {/* Bulk Actions Button Deck */}
                <div className="flex flex-wrap items-center gap-2">
                  {/* Hidden Input for JSON Import */}
                  <input 
                    type="file" 
                    ref={importFileRef}
                    onChange={importSavedPrompts}
                    accept=".json"
                    className="hidden" 
                  />
                  <button 
                    onClick={() => importFileRef.current?.click()}
                    className="px-3 py-2 bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title={t('importJson')}
                  >
                    <Upload className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>{t('importJson')}</span>
                  </button>
                  <button 
                    onClick={exportSavedPrompts}
                    className="px-3 py-2 bg-black/40 border border-white/10 hover:border-white/20 text-slate-300 hover:text-white rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title={t('exportJson')}
                  >
                    <Download className="w-3.5 h-3.5 text-neon-cyan" />
                    <span>{t('exportJson')}</span>
                  </button>
                  <button 
                    onClick={clearSavedWorkspace}
                    className="px-3 py-2 bg-red-950/20 border border-red-500/20 hover:border-red-500/40 text-red-400 hover:text-red-300 rounded-lg text-[10px] font-mono font-bold tracking-wider uppercase transition-all flex items-center gap-1.5 cursor-pointer"
                    title={t('clearAll')}
                  >
                    <Trash2 className="w-3.5 h-3.5 text-red-400" />
                    <span>{t('clearAll')}</span>
                  </button>
                </div>
              </div>

              {/* Stats Bento Deck */}
              {totalSavedCount > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                  
                  {/* Profile Diagnostic Card */}
                  <div className="md:col-span-3 bg-panel/60 border border-white/5 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">// {t('sessionProfile')}</span>
                      <p className="text-xs font-bold text-white font-mono truncate">{user?.id}</p>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex justify-between items-center text-[10px] font-mono">
                      <span className="text-slate-400">{t('databaseIntegrity')}</span>
                      <span className="text-emerald-400">✓ {t('secureRls')}</span>
                    </div>
                  </div>

                  {/* Summary Blueprints Dial */}
                  <div className="md:col-span-3 bg-panel/60 border border-white/5 rounded-xl p-5 space-y-2 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">// {t('workspaceVolume')}</span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-3xl font-extrabold text-white">{totalSavedCount}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{t('savedItems')}</span>
                      </div>
                    </div>
                    
                    {/* Ring progress widget representation */}
                    <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90">
                        <circle cx="18" cy="18" r="16" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="3" />
                        <circle 
                          cx="18" 
                          cy="18" 
                          r="16" 
                          fill="none" 
                          stroke="url(#cubeGradient)" 
                          strokeWidth="3" 
                          strokeDasharray="100"
                          strokeDashoffset={100 - Math.min(100, (filteredSavedList.length / (totalSavedCount || 1)) * 100)}
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="absolute text-[8px] font-mono text-white font-bold">
                        {Math.floor((filteredSavedList.length / (totalSavedCount || 1)) * 100)}%
                      </span>
                    </div>
                  </div>

                  {/* Category Spread bar graph */}
                  <div className="md:col-span-3 bg-panel/60 border border-white/5 rounded-xl p-5 space-y-2.5">
                    <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">// {t('categoriesRatio')}</span>
                    <div className="space-y-1.5 mt-2">
                      {ALLOWED_CATEGORIES.map(cat => {
                        const count = allSavedPrompts.filter(p => p.category === cat).length;
                        const pct = totalSavedCount > 0 ? Math.round((count / totalSavedCount) * 100) : 0;
                        if (count === 0) return null;
                        return (
                          <div key={cat} className="flex items-center gap-2 text-[9px] font-mono">
                            <span className="w-20 text-slate-400 truncate uppercase">{cat.split(' ')[0]}</span>
                            <div className="flex-grow bg-black/40 h-2 rounded-full overflow-hidden">
                              <div className="bg-gradient-to-r from-neon-cyan to-neon-blue h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                            </div>
                            <span className="text-slate-500 w-8 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Telemetry & Filters Card */}
                  <div className="md:col-span-3 bg-panel/60 border border-white/5 rounded-xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider block">// {t('telemetryLatency')}</span>
                      <span className="text-[10px] text-emerald-400 font-mono">{t('latencyActive')}</span>
                    </div>
                    {/* Model Filter */}
                    <div className="flex items-center gap-2 border-t border-white/5 pt-2">
                      <span className="font-mono text-[9px] text-slate-400 uppercase tracking-wider">{t('engineLabel')}</span>
                      <select
                        value={savedSelectedModel}
                        onChange={(e) => { setSavedSelectedModel(e.target.value); playBeep(640, 0.05); }}
                        className="bg-black/60 border border-white/10 text-[10px] rounded px-2.5 py-1.5 text-white font-mono focus:outline-none focus:border-white/30 cursor-pointer"
                      >
                        <option value="All">{t('allEngines')}</option>
                        {ALLOWED_MODELS.map(m => (
                          <option key={m} value={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Saved Blueprints List Stack */}
              {totalSavedCount > 0 && (
                <div className="bg-panel/40 border border-white/5 rounded-xl p-4 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 text-xs font-mono mb-4">
                  <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                    <div className="flex items-center gap-2 text-slate-400 select-none">
                      <Sliders className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
                      <span className="text-[10px] uppercase tracking-wider font-bold">// {t('workspaceSortMatrix')}</span>
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex border border-white/5 bg-black/35 rounded-lg p-0.5 select-none text-[9px] shrink-0">
                      <button
                        onClick={() => { setViewMode('list'); playBeep(620, 0.05); }}
                        className={`px-2.5 py-1 rounded transition-all uppercase font-bold tracking-wider cursor-pointer ${viewMode === 'list' ? 'bg-neon-cyan/15 text-white border border-neon-cyan/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
                      >
                        {t('listView')}
                      </button>
                      <button
                        onClick={() => { setViewMode('post'); playBeep(650, 0.05); }}
                        className={`px-2.5 py-1 rounded transition-all uppercase font-bold tracking-wider cursor-pointer ${viewMode === 'post' ? 'bg-neon-cyan/15 text-white border border-neon-cyan/30' : 'text-slate-400 hover:text-slate-200 border border-transparent'}`}
                      >
                        {t('postView')}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                    {[
                      { id: 'date', labelKey: 'dateStamp', num: '01' },
                      { id: 'title_asc', labelKey: 'titleAz', num: '02' },
                      { id: 'title_desc', labelKey: 'titleZa', num: '03' },
                      { id: 'model', labelKey: 'aiEngine', num: '04' },
                      { id: 'length', labelKey: 'payloadSize', num: '05' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => {
                          setSortBy(opt.id as any);
                          playBeep(650 - (['date', 'title_asc', 'title_desc', 'model', 'length'].indexOf(opt.id) * 30), 0.05, 'triangle');
                        }}
                        className={`px-3 py-1.5 rounded-lg border font-mono text-[9px] uppercase tracking-wider transition-all duration-300 flex items-center gap-1.5 cursor-pointer hover:border-white/20 active:scale-95 ${
                          sortBy === opt.id 
                            ? 'bg-gradient-to-r from-neon-cyan/15 to-neon-blue/15 border-neon-cyan/50 text-white font-bold shadow-[0_0_12px_var(--border-glow)]' 
                            : 'bg-black/35 border-white/5 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className={`text-[7px] font-bold ${sortBy === opt.id ? 'text-neon-cyan' : 'text-slate-600'}`}>
                          [{opt.num}]
                        </span>
                        <span>{t(opt.labelKey as any)}</span>
                        {sortBy === opt.id && (
                          <span className="w-1 h-2 bg-neon-cyan animate-[blink_0.8s_infinite] inline-block shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2">
                {viewMode === 'list' ? (
                  <div className="space-y-4">
                    {sortPrompts(filteredSavedList).map((p, index) => (
                      <PromptListRow
                        key={p.id}
                        p={p}
                        index={index}
                        isExpanded={!!expandedPromptIds[p.id]}
                        onToggleExpand={() => togglePromptExpand(p.id)}
                        isSaved={true}
                        onToggleSave={() => toggleSavePrompt(p.id)}
                        onOpenDrawer={() => openPromptDrawer(p)}
                        onCopy={() => copyToClipboard(p.body, p.id)}
                        copiedId={copiedId}
                        t={t}
                        lang={lang}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {sortPrompts(filteredSavedList).map((p, index) => (
                      <PromptPostCard
                        key={p.id}
                        p={p}
                        index={index}
                        isSaved={true}
                        onToggleSave={() => toggleSavePrompt(p.id)}
                        onOpenDrawer={() => openPromptDrawer(p)}
                        onCopy={() => copyToClipboard(p.body, p.id)}
                        copiedId={copiedId}
                        isAdmin={isAdmin}
                        onEditPhoto={() => setPhotoEditPrompt(p)}
                        onDragStart={(e) => handleDragStart(e, p.id, p.body)}
                        onDragEnd={handleDragEnd}
                        t={t}
                        lang={lang}
                      />
                    ))}
                  </div>
                )}
              </div>

                  {/* Empty state: No bookmarks matching search queries */}
                  {totalSavedCount > 0 && filteredSavedList.length === 0 && (
                    <div className="col-span-full py-16 text-center bg-panel/30 border border-white/5 border-dashed rounded-xl font-mono text-xs text-slate-500">
                      // {t('zeroSaved')}
                    </div>
                  )}

                  {/* Absolute Empty State: No bookmarks saved at all */}
                  {totalSavedCount === 0 && (
                    <div className="col-span-full py-20 text-center bg-panel/30 border border-white/5 border-dashed rounded-xl flex flex-col items-center justify-center gap-6 p-8">
                      {/* Beautiful Empty State SVG Illustration */}
                      <svg viewBox="0 0 100 100" className="w-20 h-20 text-neon-cyan/20" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <path d="M20,30 L20,75 C20,77.7 22.2,80 25,80 L75,80 C77.8,80 80,77.7 80,75 L80,30" strokeDasharray="3 3" />
                        <path d="M20,30 L38,30 L45,40 L80,40 L80,25 C80,22.2 77.8,20 75,20 L25,20 C22.2,20 20,22.2 20,25 L20,30 Z" />
                        <circle cx="50" cy="55" r="8" strokeDasharray="2 2" />
                        <line x1="56" y1="61" x2="65" y2="70" strokeLinecap="round" />
                      </svg>
                      <div className="space-y-1.5 max-w-sm mx-auto">
                        <h4 className="font-bold text-white font-mono text-xs uppercase tracking-widest">// {t('localRepoEmpty')}</h4>
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                          {t('localRepoDesc')}
                        </p>
                      </div>
                      <button
                        onClick={() => { setActiveTab('explore'); playBeep(520, 0.08, 'triangle'); }}
                        className="px-5 py-2.5 bg-neon-blue hover:bg-neon-cyan text-black font-mono font-black text-[10px] tracking-widest uppercase rounded-lg shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer"
                      >
                        {t('launchSystemExplorer')}
                      </button>
                    </div>
                  )}
            </div>
          )}

          {/* TAB 3: Admin log and insertion compiler */}
          {activeTab === 'admin' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fadeIn">
              
              <section className="lg:col-span-7 rounded-xl p-6 flex flex-col h-[700px] overflow-hidden bg-panel/50 border border-white/5">
                <div className="pb-4 mb-4 border-b border-white/10 flex justify-between items-center">
                  <h3 className="font-bold text-sm text-[#dfe2f1] uppercase font-mono">
                    // prompt_ledger.db
                  </h3>
                  <span className="px-2.5 py-0.5 rounded text-[10px] font-mono uppercase bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/30">
                    ACTIVE SCRIPTS: {prompts.length}
                  </span>
                </div>
                
                <div className="flex-grow overflow-y-auto custom-scrollbar">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="sticky top-0 bg-background text-slate-400 border-b border-white/10 z-10">
                      <tr>
                        <th className="py-3 px-4 uppercase text-[10px]">Title / Engine</th>
                        <th className="py-3 px-4 uppercase text-[10px]">Category</th>
                        <th className="py-3 px-4 text-right uppercase text-[10px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {prompts.map((p) => (
                        <tr key={p.id} className="hover:bg-white/5 transition-colors">
                          <td className="py-3 px-4">
                            <div className="font-bold text-[#dfe2f1] text-[11px]">{lang === 'ar' ? p.title_ar || p.title : p.title}</div>
                            <div className="text-[9px] text-slate-400 font-normal">{p.model}</div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="bg-black/50 border border-white/5 px-2 py-0.5 rounded text-[9px] uppercase text-slate-300">
                              {getCategoryTranslation(p.category, lang)}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {p.id.startsWith('curated-') ? (
                              <span className="text-[9px] text-slate-500 italic font-mono uppercase">// system_seed</span>
                            ) : (
                              <>
                                <button 
                                  onClick={() => handleUpdatePhoto(p.id, p.image_url)}
                                  className="text-neon-cyan hover:text-neon-blue px-2 py-1 rounded transition-all active:scale-95 text-[9px] mr-2"
                                >
                                  {p.image_url ? '[EDIT_PHOTO]' : '[ADD_PHOTO]'}
                                </button>
                                <button 
                                  onClick={() => handleDelete(p.id)}
                                  className="text-red-400 hover:text-red-300 px-2 py-1 rounded transition-all active:scale-95 text-[9px]"
                                >
                                  [DELETE]
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <section className="lg:col-span-5 rounded-xl p-8 flex flex-col h-[700px] bg-panel/50 border border-white/5">
                <h3 className="font-bold text-sm text-[#dfe2f1] mb-6 uppercase font-mono">
                  // compiler_insert.sh
                </h3>
                
                <form onSubmit={handlePublish} className="flex-grow flex flex-col justify-between gap-4 relative z-10">
                  <div className="space-y-4 flex-grow overflow-y-auto pr-1">
                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-mono">// Title</label>
                      <input 
                        type="text" 
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="e.g. Glass Waveform Audio Recorder"
                        className="w-full bg-black/40 border border-white/10 focus:border-white/35 rounded p-3 text-xs text-white outline-none transition-all font-mono"
                        required
                      />
                      {formErrors.title && (
                        <span className="text-xs text-red-400 mt-1 block font-mono">{formErrors.title[0]}</span>
                      )}
                    </div>

                    <div>
                      <label className="block text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-mono">// Image URL (Optional)</label>
                      <input 
                        type="url" 
                        value={formImageUrl}
                        onChange={(e) => setFormImageUrl(e.target.value)}
                        placeholder="e.g. https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe"
                        className="w-full bg-black/40 border border-white/10 focus:border-white/35 rounded p-3 text-xs text-white outline-none transition-all font-mono"
                      />
                      {formErrors.image_url && (
                        <span className="text-xs text-red-400 mt-1 block font-mono">{formErrors.image_url[0]}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-mono">// Model Engine</label>
                        <select 
                          value={formModel}
                          onChange={(e) => setFormModel(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-white/35 rounded p-3 text-xs text-white outline-none transition-all cursor-pointer font-mono"
                        >
                          {ALLOWED_MODELS.map(m => (
                            <option key={m} value={m} className="bg-panel text-[#dfe2f1]">{m}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-mono">// Category</label>
                        <select 
                          value={formCategory}
                          onChange={(e) => setFormCategory(e.target.value)}
                          className="w-full bg-black/40 border border-white/10 focus:border-white/35 rounded p-3 text-xs text-white outline-none transition-all cursor-pointer font-mono"
                        >
                          {ALLOWED_CATEGORIES.map(c => (
                            <option key={c} value={c} className="bg-panel text-[#dfe2f1]">{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="flex-grow flex flex-col min-h-[200px]">
                      <label className="block text-[9px] uppercase tracking-widest text-slate-400 mb-2 font-mono">// Blueprint Core Instructions</label>
                      <textarea 
                        value={formBody}
                        onChange={(e) => setFormBody(e.target.value)}
                        placeholder="SYSTEM_ROLE: Act as an expert react developer..."
                        className="w-full flex-grow bg-black/60 border border-white/10 focus:border-white/35 rounded p-4 text-xs font-mono text-neon-cyan leading-relaxed resize-none outline-none transition-all"
                        required
                      />
                      {formErrors.body && (
                        <span className="text-xs text-red-400 mt-1 block font-mono">{formErrors.body[0]}</span>
                      )}
                    </div>
                  </div>

                  {successMsg && (
                    <div className="bg-emerald-500/10 border border-emerald-500/20 p-3 rounded text-xs text-emerald-400 font-mono">
                      {successMsg}
                    </div>
                  )}

                  {formErrors.general && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3 rounded text-xs text-red-400 font-mono">
                      {formErrors.general[0]}
                    </div>
                  )}

                  <button 
                    type="submit"
                    disabled={publishing}
                    className="w-full py-3.5 rounded shadow-lg font-mono tracking-wider text-xs gradient-accent-bg text-black font-bold cursor-pointer"
                  >
                    {publishing ? 'COMPILING SCRIPT...' : 'EXECUTE_INSERT'}
                  </button>
                </form>
              </section>
            </div>
          )}
        </Show>

      </main>

      {/* Sliding Detail Drawer Panel */}
      {expandedPrompt && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-end transition-opacity duration-300 animate-fadeIn">
          {/* Drawer Overlay */}
          <div 
            className="absolute inset-0 cursor-pointer" 
            onClick={() => { setExpandedPrompt(null); playBeep(500, 0.05); }}
          />
          
          {/* Drawer Container */}
          <div className="w-full max-w-2xl bg-background border-l border-white/10 h-full p-8 shadow-2xl overflow-y-auto relative z-10 custom-scrollbar flex flex-col justify-between text-slate-300">
            
            {/* Drawer Header & Content */}
            <div className="space-y-6">
              <div className="flex justify-between items-start gap-4 pb-4 border-b border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-neon-cyan tracking-widest uppercase">
                    {getCategoryTranslation(expandedPrompt.category, lang)} // {expandedPrompt.model}
                  </span>
                  <h3 className="text-xl font-bold text-white tracking-tight leading-tight">
                    {lang === 'ar' ? expandedPrompt.title_ar || expandedPrompt.title : expandedPrompt.title}
                  </h3>
                  {expandedPrompt.description && (
                    <p className="text-xs text-slate-400 font-sans mt-2 text-left">
                      {lang === 'ar' ? expandedPrompt.description_ar || expandedPrompt.description : expandedPrompt.description}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => { setExpandedPrompt(null); playBeep(500, 0.05); }}
                  className="p-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {expandedPrompt.image_url && (
                <div className="w-full h-48 rounded-xl overflow-hidden border border-white/10 relative bg-black/40">
                  {/\.(mp4|webm|mov|ogg)$/i.test(expandedPrompt.image_url) ? (
                    <video
                      src={expandedPrompt.image_url}
                      className="w-full h-full object-cover opacity-90"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <img 
                      src={expandedPrompt.image_url} 
                      alt={expandedPrompt.title}
                      className="w-full h-full object-cover opacity-90"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  )}
                </div>
              )}
              
              {/* Dynamic Variable Customizer */}
              {Object.keys(customVariables).length > 0 && (
                <div className="bg-white/5 border border-white/5 p-5 rounded-xl space-y-4">
                  <h4 className="text-xs font-mono text-white tracking-wider flex items-center gap-1.5 uppercase">
                    <Sliders className="w-3.5 h-3.5 text-neon-cyan" /> Prompt Variables Editor
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.keys(customVariables).map((v) => (
                      <div key={v} className="space-y-1">
                        <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                          {v}
                        </label>
                        <input 
                          type="text"
                          placeholder={`Insert ${v.toLowerCase()}...`}
                          value={customVariables[v]}
                          onChange={(e) => {
                            setCustomVariables(prev => ({ ...prev, [v]: e.target.value }));
                          }}
                          className="bg-black/45 border border-white/10 text-xs rounded pl-3 pr-3 py-1.5 w-full focus:outline-none focus:border-white/30 text-white font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Prompt Preview */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="text-xs font-mono text-white uppercase tracking-wider">
                    Prompt Instructions Body
                  </h4>
                  <button 
                    onClick={() => copyToClipboard(getCustomizedBody(), expandedPrompt.id)}
                    className="flex items-center gap-1.5 text-xs font-mono text-neon-cyan hover:underline"
                  >
                    {copiedId === expandedPrompt.id ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copiedId === expandedPrompt.id ? 'COPIED' : 'COPY CUSTOMIZED PROMPT'}
                  </button>
                </div>
                <div className="bg-black/60 border border-white/5 p-5 rounded-xl font-mono text-[11px] text-slate-300 max-h-64 overflow-y-auto custom-scrollbar select-text leading-relaxed">
                  <pre className="whitespace-pre-wrap">{getCustomizedBody()}</pre>
                </div>
              </div>

              {/* Code Snippet Export Tabs */}
              <div className="space-y-3 pt-2">
                <div className="flex justify-between items-center border-b border-white/5">
                  <h4 className="text-xs font-mono text-white uppercase tracking-wider pb-1">
                    Integration Snippets
                  </h4>
                  <div className="flex gap-2">
                    {(['ts', 'py', 'curl'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => { setSnippetTab(tab); playBeep(650, 0.04); }}
                        className={`text-[10px] font-mono uppercase px-2.5 py-1 border-t border-x border-transparent rounded-t-lg tracking-wider ${snippetTab === tab ? 'bg-white/5 text-white font-bold border-white/10' : 'text-slate-400 hover:text-white'}`}
                      >
                        {tab === 'ts' ? 'Vercel AI (TS)' : tab === 'py' ? 'Python SDK' : 'cURL'}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="bg-black/45 border border-white/5 p-4 rounded-xl font-mono text-[10px] text-slate-300 overflow-x-auto relative">
                  <button 
                    onClick={() => {
                      let code = '';
                      if (snippetTab === 'ts') code = getTypeScriptSnippet();
                      else if (snippetTab === 'py') code = getPythonSnippet();
                      else code = getCurlSnippet();
                      copyToClipboard(code, 'snippet');
                    }}
                    className="absolute right-3 top-3 p-1 rounded hover:bg-white/5 text-neon-cyan border border-white/5 bg-black/40"
                  >
                    {copiedId === 'snippet' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                  <pre className="whitespace-pre">
                    {snippetTab === 'ts' && getTypeScriptSnippet()}
                    {snippetTab === 'py' && getPythonSnippet()}
                    {snippetTab === 'curl' && getCurlSnippet()}
                  </pre>
                </div>
              </div>
            </div>

            {/* Interactive Mock Sandbox Simulator */}
            <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="text-xs font-mono text-white uppercase tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-4 h-4 text-neon-cyan" /> Sandbox Compilation Console
                </h4>
                <button
                  onClick={runSandboxSimulation}
                  disabled={sandboxExecuting}
                  className="px-4 py-1.5 rounded bg-neon-blue hover:bg-neon-cyan disabled:opacity-50 text-black font-bold font-mono text-[10px] uppercase tracking-wider transition-all"
                >
                  {sandboxExecuting ? 'COMPILING...' : 'TEST RUN PROMPT'}
                </button>
              </div>
              
              <div className="bg-input-custom border border-white/15 rounded-xl p-5 min-h-[140px] max-h-[180px] overflow-y-auto custom-scrollbar font-mono text-[10px] text-emerald-400 select-text leading-relaxed relative">
                {sandboxConsole ? (
                  <pre className="whitespace-pre-wrap">{sandboxConsole}</pre>
                ) : (
                  <div className="text-slate-500 italic py-8 text-center flex flex-col items-center gap-2 justify-center">
                    <span>// CLICK 'TEST RUN PROMPT' TO START PIPELINE SIMULATOR</span>
                  </div>
                )}
                {sandboxExecuting && (
                  <span className="inline-block w-1.5 h-3 bg-emerald-400 animate-pulse ml-0.5"></span>
                )}
              </div>
            </div>
            
          </div>
        </div>
      )}

      {/* Floating Responsive Bottom Navigation Dock for Mobile Devices */}
      <Show when="signed-in">
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-50 md:hidden flex items-center justify-around w-[calc(100%-2rem)] max-w-sm h-12 bg-panel/90 border border-white/10 backdrop-blur-xl rounded-full px-4 shadow-2xl transition-all duration-300">
          <button 
            onClick={() => { setActiveTab('explore'); playBeep(520, 0.05, 'triangle'); }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-mono tracking-wider transition-all uppercase w-20 cursor-pointer ${activeTab === 'explore' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Search className="w-4 h-4 text-neon-cyan" />
            <span>{t('explorer')}</span>
          </button>
          <button 
            onClick={() => { setActiveTab('workspace'); playBeep(520, 0.05, 'triangle'); }}
            className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-mono tracking-wider transition-all uppercase w-20 cursor-pointer ${activeTab === 'workspace' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
          >
            <Bookmark className="w-4 h-4 text-neon-cyan" />
            <span>{t('savedBlueprints')}</span>
          </button>
          {isAdmin && (
            <button 
              onClick={() => { setActiveTab('admin'); playBeep(520, 0.05, 'triangle'); }}
              className={`flex flex-col items-center justify-center gap-0.5 text-[9px] font-mono tracking-wider transition-all uppercase w-20 cursor-pointer ${activeTab === 'admin' ? 'text-white font-bold' : 'text-slate-400 hover:text-white'}`}
            >
              <Terminal className="w-4 h-4 text-neon-cyan" />
              <span>{t('compilerLogs')}</span>
            </button>
          )}
        </div>
      </Show>

      {/* MARQUEE CONTACT FOOTER WITH LOCKED GRADIENT */}
      <footer className="w-full overflow-hidden border-t border-white/5 bg-input-custom py-4 select-none relative z-40">
        <div className="animate-marquee whitespace-nowrap flex gap-12 font-mono text-[10px] tracking-widest text-slate-400">
          <span className="flex items-center gap-2">
            VIBEPROMPT CONSOLE <span className="gradient-accent-text font-black">//</span> HELLO@VIBEPROMPT.SH
          </span>
          <span className="flex items-center gap-2">
            LOCKED ACCENT: <span className="gradient-accent-text font-bold">#89AACC → #4E85BF</span>
          </span>
          <span className="flex items-center gap-2">
            STABLE COMPILER BUILD: <span className="text-neon-cyan font-bold">v2.6.4-STABLE</span>
          </span>
          <span className="flex items-center gap-2">
            DATABASE ENFORCEMENT: <span className="text-neon-blue font-bold">RLS ACTIVE</span>
          </span>
          {/* Repeating identical list so scroll loop is seamless */}
          <span className="flex items-center gap-2">
            VIBEPROMPT CONSOLE <span className="gradient-accent-text font-black">//</span> HELLO@VIBEPROMPT.SH
          </span>
          <span className="flex items-center gap-2">
            LOCKED ACCENT: <span className="gradient-accent-text font-bold">#89AACC → #4E85BF</span>
          </span>
          <span className="flex items-center gap-2">
            STABLE COMPILER BUILD: <span className="text-neon-cyan font-bold">v2.6.4-STABLE</span>
          </span>
          <span className="flex items-center gap-2">
            DATABASE ENFORCEMENT: <span className="text-neon-blue font-bold">RLS ACTIVE</span>
          </span>
        </div>
      </footer>

      {/* Admin Photo Compiler Modal Dialog */}
      {photoEditPrompt && (
        <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-[9999] flex items-center justify-center p-4 font-mono select-none">
          <div className="w-full max-w-md bg-panel border border-white/10 rounded-xl p-6 shadow-2xl space-y-5 animate-fadeIn">
            <div className="flex justify-between items-center border-b border-white/5 pb-3">
              <h3 className="font-bold text-xs text-neon-cyan uppercase tracking-widest flex items-center gap-2">
                <Image className="w-4 h-4 text-neon-cyan" /> // image_compiler.sh
              </h3>
              <button 
                onClick={() => { setPhotoEditPrompt(null); playBeep(500, 0.05); }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              <span className="text-[9px] text-slate-500 block uppercase">PROMPT OBJECT:</span>
              <p className="text-xs font-bold text-white truncate">{photoEditPrompt.title}</p>
            </div>

            <div className="space-y-2">
              <label className="text-[9px] text-slate-400 block uppercase">// Media Ledger URL</label>
              <input 
                type="url"
                value={photoEditUrl}
                onChange={(e) => setPhotoEditUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-... or /uploads/..."
                className="w-full bg-black/60 border border-white/10 focus:border-white/30 rounded p-3 text-xs text-white outline-none font-mono"
              />
            </div>

            {/* Direct Internal Upload Zone */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 block uppercase">// Upload Local Media (Internal Storage)</span>
              <div className="flex gap-2">
                <input 
                  type="file"
                  id="admin-media-upload"
                  accept="image/*,video/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    
                    try {
                      addNotification(`[STORAGE] UPLOADING FILE: ${file.name.substring(0, 15)}...`);
                      const token = await getToken({ template: 'supabase' });
                      const res = await fetch('/api/upload', {
                        method: 'POST',
                        headers: {
                          ...(token ? { Authorization: `Bearer ${token}` } : {}),
                        },
                        body: formData
                      });
                      
                      if (res.ok) {
                        const data = await res.json();
                        setPhotoEditUrl(data.url);
                        addNotification(`[STORAGE] UPLOAD COMPLETE: ${data.url}`);
                        playBeep(880, 0.1, 'sine');
                      } else {
                        const err = await res.json();
                        alert(`Upload failed: ${err.error || 'Unknown error'}`);
                      }
                    } catch (err: any) {
                      console.error(err);
                      alert('Upload failed: connection error');
                    }
                  }}
                  className="hidden"
                />
                <label 
                  htmlFor="admin-media-upload"
                  className="w-full text-center py-2.5 px-4 bg-white/5 border border-white/10 hover:bg-white/10 text-slate-300 hover:text-white rounded-lg text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Upload className="w-3.5 h-3.5 text-neon-cyan" />
                  <span>Choose Image / Video</span>
                </label>
              </div>
            </div>

            {/* Preset Curated URLs grid */}
            <div className="space-y-2">
              <span className="text-[9px] text-slate-400 block uppercase">// Preset Themes</span>
              <div className="grid grid-cols-2 gap-2 text-[9px]">
                {[
                  { name: 'Neon Cyberpunk', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Terminal Code', url: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=600&q=80' },
                  { name: 'AI Brain', url: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=600&q=80' },
                  { name: 'Tech Interface', url: 'https://images.unsplash.com/photo-1581092921461-eab62e97a780?auto=format&fit=crop&w=600&q=80' }
                ].map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => {
                      setPhotoEditUrl(preset.url);
                      playBeep(600, 0.05);
                    }}
                    className="px-2 py-1.5 border border-white/5 bg-black/40 hover:bg-white/5 rounded text-left truncate text-slate-300 hover:text-white"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Preview block */}
            <div className="border border-white/5 rounded bg-black/50 h-28 overflow-hidden relative flex items-center justify-center">
              {photoEditUrl.trim() ? (
                /\.(mp4|webm|mov|ogg)$/i.test(photoEditUrl) ? (
                  <video
                    src={photoEditUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                  />
                ) : (
                  <img 
                    src={photoEditUrl} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }}
                  />
                )
              ) : (
                <span className="text-[9px] text-slate-500 uppercase">// LIVE_PREVIEW_EMPTY</span>
              )}
            </div>

            <div className="flex gap-3 justify-end text-xs pt-2">
              <button
                onClick={() => { setPhotoEditPrompt(null); playBeep(500, 0.05); }}
                className="px-4 py-2 border border-white/10 rounded text-slate-300 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!photoEditPrompt) return;
                  try {
                    const token = await getToken({ template: 'supabase' });
                    const res = await fetch(`/api/prompts/${photoEditPrompt.id}`, {
                      method: 'PATCH',
                      headers: {
                        'Content-Type': 'application/json',
                        ...(token ? { Authorization: `Bearer ${token}` } : {}),
                      },
                      body: JSON.stringify({ image_url: photoEditUrl.trim() }),
                    });

                    if (res.ok) {
                      const updated = await res.json();
                      setPrompts(prev => prev.map(p => p.id === photoEditPrompt.id ? { ...p, image_url: updated.image_url } : p));
                      setPhotoEditPrompt(null);
                      addNotification(`[LEDGER] PHOTO SET FOR #${photoEditPrompt.id.substring(0, 4).toUpperCase()}`);
                      playBeep(880, 0.15, 'sine');
                    } else {
                      const err = await res.json();
                      alert(`Error saving photo: ${err.error || 'Unknown error'}`);
                    }
                  } catch (err) {
                    console.error(err);
                    alert('Connection failed.');
                  }
                }}
                className="px-4 py-2 bg-neon-blue text-black font-bold font-mono uppercase tracking-wider rounded hover:bg-neon-cyan transition-all"
              >
                {/\.(mp4|webm|mov|ogg)$/i.test(photoEditUrl) ? 'Save Video' : 'Save Photo'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating System Notifications HUD */}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-2 pointer-events-none">
        {notifications.map((n) => (
          <div 
            key={n.id} 
            className="px-4 py-3 bg-black/90 border border-white/10 text-[10px] font-mono text-slate-300 rounded-lg shadow-2xl flex items-center gap-2.5 animate-slideUp pointer-events-auto border-l-2 border-l-neon-cyan"
          >
            <Terminal className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span>{n.text}</span>
          </div>
        ))}
      </div>

    </div>
  );
}
