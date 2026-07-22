import React, { useEffect } from "react";
import { 
  X, Mail, Lock, ShieldCheck, Key, ArrowLeft, CheckCircle2, 
  XCircle, Send, Sparkles, BookOpen, User, Settings, AlertTriangle, HelpCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useAuthLogic, AuthScreenType } from "../logic/useAuthLogic";
import { useSacredStore } from "../../../shared/store/sacredStore";

export default function ArchivistLogin() {
  const { language } = useSacredStore();
  const isAr = language === "ar";

  const {
    screen,
    setScreen,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errorMessage,
    setErrorMessage,
    isLoading,
    passwordStrength,
    handlePasswordChange,
    loginRole,
    setLoginRole,
    session,
    handleLogin,
    handleRegister,
    handleSendVerification,
    handleLogout,
    resetForm,
    setCurrentTab
  } = useAuthLogic();

  // Clear errors when screen changes
  useEffect(() => {
    resetForm();
  }, [screen]);

  // If user is already logged in, show a beautiful Dashboard controller/gateway
  if (session?.isLoggedIn) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg glass-panel rounded-2xl border border-gold-accent/25 p-8 text-center bg-gradient-to-b from-canvas via-black/80 to-black shadow-2xl relative overflow-hidden"
        >
          {/* Ambient light pulse */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full border border-gold-accent/20 flex items-center justify-center mx-auto mb-6 bg-gold-accent/5">
            <ShieldCheck className="w-8 h-8 text-gold-accent animate-pulse" />
          </div>

          <span className="font-mono text-[10px] uppercase tracking-widest text-gold-accent/80 bg-gold-accent/5 px-3 py-1 rounded-full border border-gold-accent/10">
            {session.role === "admin" 
              ? (isAr ? "وصول مشرف (مطور)" : "Guardian Access (Admin)") 
              : (isAr ? "وصول مستخدم (باحث)" : "Devotee Access (User)")
            }
          </span>

          <h2 className="font-serif text-3xl md:text-4xl font-bold text-white mt-4 mb-2 tracking-wide">
            {isAr ? "تم إثبات الهوية" : "Sanctum Activated"}
          </h2>
          <p className="text-white/60 text-sm font-sans max-w-md mx-auto mb-8 leading-relaxed">
            {isAr 
              ? `مرحباً بك، ${session.email}. لقد تم منحك الصلاحيات الكاملة للأرشيف والقصص المقدسة.` 
              : `Welcome back, ${session.email}. You are currently connected to the sacred databases of witnesses.`
            }
          </p>

          <div className="bg-white/[0.02] border border-white/5 rounded-xl p-4 mb-8 text-left text-xs space-y-2 font-mono">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">{isAr ? "البريد الإلكتروني:" : "Archivist Identity:"}</span>
              <span className="text-white font-medium">{session.email}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-white/40">{isAr ? "الدور والمسار الحالي:" : "Current Active Path:"}</span>
              <span className="text-gold-accent font-bold uppercase tracking-wider">
                {session.role === "admin" ? (isAr ? "مشرف" : "ADMIN") : (isAr ? "مستخدم" : "USER")}
              </span>
            </div>
            <div className="flex justify-between pt-1">
              <span className="text-white/40">{isAr ? "حالة الاتصال المباشر:" : "Remote Link Status:"}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                ONLINE (NGROK)
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={() => setCurrentTab("saints")}
              className="py-3 px-6 rounded-lg bg-gold-accent text-canvas font-mono text-xs tracking-wider uppercase font-bold hover:bg-white hover:text-canvas transition-all duration-300 transform active:scale-95 shadow-lg shadow-gold-accent/10 cursor-pointer"
            >
              {isAr ? "فتح الأرشيف التفاعلي" : "Open Sacred Chronicles"}
            </button>
            <button
              onClick={handleLogout}
              className="py-3 px-6 rounded-lg border border-burgundy-accent/40 text-burgundy-accent hover:bg-burgundy-accent/10 font-mono text-xs tracking-wider uppercase transition-all duration-300 transform active:scale-95 cursor-pointer"
            >
              {isAr ? "تسجيل الخروج" : "Terminate Connection"}
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[90vh] py-12 flex flex-col items-center justify-center relative overflow-hidden bg-canvas">
      {/* Dynamic background light glows */}
      <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-gold-accent/[0.015] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[35rem] h-[35rem] bg-burgundy-accent/[0.01] rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">
        {/* VIEW 1: LOGIN (Screenshot 9) */}
        {screen === "login" && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-gold-accent animate-pulse" />
                <span className="font-serif text-2xl font-semibold text-gold-accent tracking-wide">
                  Sacred Stories
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
                {isAr ? "تسجيل دخول أمين الأرشيف" : "Archivist Login"}
              </h1>
              <p className="text-white/50 text-xs mt-1.5 font-sans uppercase tracking-wider">
                {isAr ? "ادخل إلى محراب الأرواح الوفية والذكريات" : "Enter the sanctuary of memory."}
              </p>
            </div>

            {/* Main Login Frame */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              <form onSubmit={handleLogin} className="space-y-5">
                
                {/* ROLE PATHWAYS TOGGLE SELECTOR */}
                <div>
                  <label className="block font-mono text-[9px] text-gold-accent/80 uppercase tracking-widest mb-2 text-center border-b border-white/5 pb-1.5">
                    {isAr ? "اختر مسار تسجيل الدخول" : "Select Active Connection Pathway"}
                  </label>
                  <div className="grid grid-cols-2 gap-2 bg-black/50 p-1 rounded-lg border border-white/5">
                    <button
                      type="button"
                      onClick={() => setLoginRole("user")}
                      className={`py-2 text-[10px] uppercase font-mono tracking-wider rounded transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
                        loginRole === "user" 
                          ? "bg-gold-accent/15 text-gold-accent font-bold border border-gold-accent/35" 
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <User className="w-3 h-3" />
                      {isAr ? "مستخدم (باحث)" : "Pilgrim (User)"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setLoginRole("admin")}
                      className={`py-2 text-[10px] uppercase font-mono tracking-wider rounded transition-all duration-300 flex items-center justify-center gap-1 cursor-pointer ${
                        loginRole === "admin" 
                          ? "bg-amber-500/15 text-amber-300 font-bold border border-amber-500/35" 
                          : "text-white/40 hover:text-white"
                      }`}
                    >
                      <Settings className="w-3 h-3" />
                      {isAr ? "مشرف (مطور)" : "Guardian (Admin)"}
                    </button>
                  </div>
                </div>

                {/* Identity Email Field */}
                <div>
                  <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">
                    {isAr ? "البريد الإلكتروني للأرشيف" : "Identity (Email)"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="archivist@sacredstories.com"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Secret Key Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest">
                      {isAr ? "مفتاح السر" : "Secret Key"}
                    </label>
                    <button
                      type="button"
                      onClick={() => setScreen("request_reset")}
                      className="font-mono text-[9px] text-gold-accent hover:text-amber-200 uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {isAr ? "نسيت كلمة المرور؟" : "Forgot Password?"}
                    </button>
                  </div>
                  <div className="relative">
                    <Key className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-burgundy-accent/10 border border-burgundy-accent/30 rounded text-center text-rose-300 font-mono text-[10px]">
                    {errorMessage}
                  </div>
                )}

                {/* Initiate Access Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-gold-accent/15 cursor-pointer flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isAr ? "تهيئة الوصول" : "Initiate Access"}</span>
                      <span className="text-[10px] font-mono opacity-85">→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Navigation Options Below Card */}
              <div className="mt-6 pt-5 border-t border-white/5 text-center space-y-2.5">
                <div className="text-[11px] text-white/45">
                  {isAr ? "أول مرة هنا؟" : "First time here?"}{" "}
                  <button
                    onClick={() => setScreen("register")}
                    className="text-gold-accent hover:text-white font-mono font-semibold uppercase tracking-wider transition-colors underline decoration-gold-accent/30 underline-offset-4 cursor-pointer"
                  >
                    {isAr ? "إنشاء حساب" : "Create Account"}
                  </button>
                </div>
                <div>
                  <button
                    onClick={() => setScreen("verification_failed")}
                    className="font-mono text-[9px] text-white/30 hover:text-white/50 uppercase tracking-widest transition-colors cursor-pointer block mx-auto"
                  >
                    {isAr ? "إعادة إرسال بريد التأكيد الإلكتروني" : "Resend Verification Email"}
                  </button>
                </div>
              </div>
            </div>

            {/* Back button link */}
            <button
              onClick={() => setCurrentTab("home")}
              className="mt-6 flex items-center gap-1.5 font-mono text-[10px] text-white/40 hover:text-gold-accent transition-all uppercase tracking-widest mx-auto cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isAr ? "العودة إلى السجلات المقدسة" : "Return to Chronicles"}</span>
            </button>
          </motion.div>
        )}

        {/* VIEW 2: REGISTER (Screenshot 7) */}
        {screen === "register" && (
          <motion.div
            key="register"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-gold-accent animate-pulse" />
                <span className="font-serif text-2xl font-semibold text-gold-accent tracking-wide">
                  Sacred Stories
                </span>
              </div>
              <p className="text-white/60 text-sm font-serif max-w-xs mx-auto leading-relaxed">
                {isAr 
                  ? "انضم إلى محرابنا الجماعي لإحياء الذكرى وتخليد إرث الشهود والقديسين المعاصرين."
                  : "Join our collective sanctuary of remembrance and honor the legacy of modern witnesses."
                }
              </p>
            </div>

            {/* Main Register Frame */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              <form onSubmit={handleRegister} className="space-y-4">
                
                {/* Email input */}
                <div>
                  <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">
                    {isAr ? "البريد الإلكتروني للقداسة" : "Sacred Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="archivist@sacredstories.com"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Password input */}
                <div>
                  <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">
                    {isAr ? "كلمة مرور الوصي" : "Guardian Password"}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => handlePasswordChange(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                  {/* Password Strength indicator (as shown in Screenshot 7) */}
                  <div className="mt-1.5 flex items-center justify-between font-mono text-[8px] text-white/30 uppercase tracking-widest">
                    <span>{isAr ? "قوة كلمة المرور:" : "Strength:"}</span>
                    <span className={`font-bold ${
                      passwordStrength === "WEAK" ? "text-rose-400" :
                      passwordStrength === "MEDIUM" ? "text-amber-400" :
                      passwordStrength === "STRONG" ? "text-emerald-400" : "text-white/30"
                    }`}>
                      {passwordStrength === "NOT SET" ? (isAr ? "غير محدد" : "NOT SET") : 
                       passwordStrength === "WEAK" ? (isAr ? "ضعيف" : "WEAK") :
                       passwordStrength === "MEDIUM" ? (isAr ? "متوسط" : "MEDIUM") : (isAr ? "قوي جداً" : "STRONG")}
                    </span>
                  </div>
                </div>

                {/* Confirm password input */}
                <div>
                  <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">
                    {isAr ? "أعد إدخال مفتاح المحمية" : "Re-enter Sanctum Key"}
                  </label>
                  <div className="relative">
                    <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-burgundy-accent/10 border border-burgundy-accent/30 rounded text-center text-rose-300 font-mono text-[10px]">
                    {errorMessage}
                  </div>
                )}

                {/* Create Account button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-gold-accent/15 cursor-pointer flex items-center justify-center gap-2 mt-2"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <User className="w-4 h-4" />
                      <span>{isAr ? "إنشاء حساب" : "Create Account"}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Already has account options */}
              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <span className="text-[11px] text-white/45">
                  {isAr ? "هل تملك حساباً بالفعل؟" : "Already an archivist?"}{" "}
                  <button
                    onClick={() => setScreen("login")}
                    className="text-gold-accent hover:text-white font-mono font-semibold uppercase tracking-wider transition-colors underline decoration-gold-accent/30 underline-offset-4 cursor-pointer"
                  >
                    {isAr ? "تسجيل دخول" : "Back to Login"}
                  </button>
                </span>
              </div>
            </div>

            {/* License details */}
            <p className="mt-6 text-[8px] md:text-[9px] font-mono uppercase tracking-widest text-center text-white/35 leading-relaxed max-w-sm mx-auto">
              {isAr 
                ? "من خلال إنشاء حساب، فإنك توافق على الحفاظ على التاريخ وشروط التكريس وميثاق الخصوصية المقدس لدينا."
                : "By creating an account, you agree to the preservation of history and our terms of devotion and privacy covenant."
              }
            </p>
          </motion.div>
        )}

        {/* VIEW 3: VERIFICATION PENDING (Screenshot 8) */}
        {screen === "verification_pending" && (
          <motion.div
            key="pending"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            {/* Icon Card */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 text-center bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              {/* Mail Envelope graphic with circular pulsing container */}
              <div className="w-24 h-24 rounded-full border border-gold-accent/15 flex items-center justify-center mx-auto mb-6 bg-gradient-to-b from-gold-accent/[0.03] to-transparent relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 3 }}
                  className="absolute inset-2 rounded-full border border-gold-accent/5"
                />
                <Mail className="w-10 h-10 text-gold-accent animate-pulse" />
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide mb-3">
                {isAr ? "التأكيد معلق" : "Verification Pending"}
              </h2>
              
              <p className="text-white/60 text-xs md:text-sm font-sans mb-8 leading-relaxed max-w-xs mx-auto">
                {isAr 
                  ? "لقد أرسلنا رابط بوابة معقد ومقدس إلى عنوان بريدك الإلكتروني المسجل. يرجى اتباع الرابط لتفعيل وصولك كأمين أرشيف."
                  : "We have sent a sanctified gateway link to your registered email address. Please follow the link to activate your archivist access."
                }
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    // Simulates opening email provider or triggers transition to verified screen for demo
                    setScreen("email_verified");
                  }}
                  className="w-full py-3 rounded-lg bg-gold-accent text-canvas hover:bg-white font-mono text-xs tracking-wider uppercase font-bold transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isAr ? "افتح تطبيق البريد الإلكتروني" : "Open Email App"}</span>
                </button>

                <button
                  onClick={() => {
                    // Show failed screen to simulate bad tokens
                    setScreen("verification_failed");
                  }}
                  className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 font-mono text-xs tracking-wider uppercase transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                >
                  {isAr ? "إعادة إرسال رمز التحقق" : "Resend Verification"}
                </button>
              </div>

              <button
                onClick={() => setScreen("login")}
                className="mt-6 font-mono text-[9px] text-white/40 hover:text-gold-accent uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isAr ? "العودة لتسجيل الدخول" : "Back to Login"}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 4: COMMUNION RESTORED (Screenshot 2 & 5) */}
        {screen === "email_verified" && (
          <motion.div
            key="verified"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 text-center bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              {/* Check Circle animated */}
              <div className="w-16 h-16 rounded-full border border-emerald-500/20 flex items-center justify-center mx-auto mb-6 bg-emerald-500/5">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide mb-1">
                {isAr ? "استعادة الشراكة والمحبة" : "Communion Restored"}
              </h2>
              <span className="font-mono text-[10px] text-gold-accent block tracking-wider mb-4 uppercase">
                {isAr ? "تم تأكيد البريد الإلكتروني" : "Email Verified"}
              </span>

              <div className="space-y-4 max-w-xs mx-auto mb-8 font-sans text-xs md:text-sm text-white/60 leading-relaxed">
                <p>
                  {isAr 
                    ? "حساب أمين الأرشيف الخاص بك نشط الآن. السجلات والقصص المقدسة مفتوحة ومتاحة لك بالكامل."
                    : "Your archivist account is now active. The sacred chronicles and archives are open to you."
                  }
                </p>
                {isAr ? (
                  <p className="text-white/40 border-t border-white/5 pt-3">
                    حسابك الآن نشط. الأرشيف والقصص المقدسة مفتوحة لك.
                  </p>
                ) : null}
              </div>

              {/* Dynamic pathway destination depends on user or admin role */}
              <button
                onClick={() => {
                  // Direct to main app but set local session so we are active
                  const finalRole = loginRole || "user";
                  setScreen("login"); // triggers redraw as active logged-in user in store
                }}
                className="w-full py-3.5 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
              >
                <span>{isAr ? "ادخل المحراب الأرثوذكسي" : "Enter the Sanctuary"}</span>
                <span className="text-[10px] font-mono">→</span>
              </button>

              <div className="mt-4 font-mono text-[9px] text-white/30 uppercase tracking-wider">
                {isAr ? "جاري التحويل تلقائياً..." : "Redirecting in 3 seconds..."}
              </div>
            </div>
          </motion.div>
        )}

        {/* VIEW 5: VERIFICATION FAILED (Screenshot 3 & 6) */}
        {screen === "verification_failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 text-center bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              {/* X Circle Error graphic */}
              <div className="w-16 h-16 rounded-full border border-burgundy-accent/20 flex items-center justify-center mx-auto mb-6 bg-burgundy-accent/5">
                <XCircle className="w-8 h-8 text-burgundy-accent" />
              </div>

              <h2 className="font-serif text-2xl md:text-3xl font-bold text-white tracking-wide mb-1">
                {isAr ? "فشل التأكيد" : "Verification Failed"}
              </h2>

              <p className="text-rose-300/80 text-xs md:text-sm font-sans mb-8 leading-relaxed max-w-xs mx-auto pt-2 border-t border-white/5">
                {isAr 
                  ? "رابط التأكيد انتهت صلاحيته أو غير صالح. تملي البروتوكولات الأمنية أن تظل رموز المرور صالحة لمدة 24 ساعة فقط."
                  : "The verification link has expired or is invalid. Security protocols require links to be used within 24 hours."
                }
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => setScreen("verification_pending")}
                  className="w-full py-3 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono text-xs tracking-wider uppercase font-bold transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                >
                  {isAr ? "طلب رابط جديد" : "Resend Verification Link"}
                </button>

                <button
                  onClick={() => {
                    // Contact Support simulated
                    alert(isAr ? "يرجى مراسلة الدعم على support@sacredstories.com" : "Please email support@sacredstories.com for manual verification.");
                  }}
                  className="w-full py-3 rounded-lg bg-white/5 border border-white/10 text-white/80 hover:bg-white/10 font-mono text-xs tracking-wider uppercase transition-all duration-300 transform active:scale-[0.98] cursor-pointer"
                >
                  {isAr ? "اتصل بالدعم" : "Contact Archivist Support"}
                </button>
              </div>

              <button
                onClick={() => setScreen("login")}
                className="mt-6 font-mono text-[9px] text-white/40 hover:text-gold-accent uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{isAr ? "العودة لتسجيل الدخول" : "Back to Login"}</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* VIEW 6: SEND VERIFICATION LINK (Screenshot 1) */}
        {screen === "request_reset" && (
          <motion.div
            key="request_reset"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md px-4"
          >
            {/* Header Brand */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BookOpen className="w-6 h-6 text-gold-accent" />
                <span className="font-serif text-2xl font-semibold text-gold-accent">
                  Sacred Stories
                </span>
              </div>
              <h1 className="font-serif text-3xl font-bold text-white tracking-tight">
                {isAr ? "العودة للأرشيف" : "Return to the Archive"}
              </h1>
              <p className="text-white/50 text-xs mt-1.5 font-sans uppercase tracking-wider">
                {isAr ? "تأكد من وجودك للوصول لسجلات الأبرار" : "Verify your presence to access the chronicles of the devoted."}
              </p>
            </div>

            {/* Form Box */}
            <div className="glass-panel border border-white/10 rounded-2xl p-6 md:p-8 bg-gradient-to-b from-canvas to-black/85 shadow-2xl relative">
              <form onSubmit={handleSendVerification} className="space-y-5">
                <div>
                  <label className="block font-mono text-[9px] text-white/50 uppercase tracking-widest mb-1.5">
                    {isAr ? "عنوان البريد الإلكتروني للرسل" : "Apostle Email Address"}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 w-4 h-4" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-black/40 border border-white/10 rounded-lg pl-10 pr-4 py-3 text-white placeholder-white/20 font-sans text-xs focus:outline-none focus:border-gold-accent/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 bg-burgundy-accent/10 border border-burgundy-accent/30 rounded text-center text-rose-300 font-mono text-[10px]">
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-lg bg-gold-accent hover:bg-white text-canvas font-mono text-xs tracking-widest uppercase font-bold transition-all duration-300 transform active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {isLoading ? (
                    <span className="w-4 h-4 border-2 border-canvas border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{isAr ? "إرسال رابط التحقق" : "Send Verification"}</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </form>

              {/* Footer back buttons */}
              <div className="mt-6 pt-5 border-t border-white/5 text-center">
                <button
                  onClick={() => setScreen("login")}
                  className="font-mono text-[9px] text-white/40 hover:text-gold-accent uppercase tracking-widest transition-all cursor-pointer inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{isAr ? "العودة لتسجيل الدخول" : "Back to Sign In"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Static bottom layout footer helper (as shown in Screenshot 4) */}
      <footer className="mt-12 text-center text-white/30 font-mono text-[8px] md:text-[9px] uppercase tracking-widest space-y-2">
        <div className="flex justify-center gap-6">
          <a href="#privacy" className="hover:text-gold-accent transition-colors">{isAr ? "سياسة الخصوصية" : "Privacy Policy"}</a>
          <a href="#terms" className="hover:text-gold-accent transition-colors">{isAr ? "شروط الخدمة" : "Terms of Service"}</a>
          <a href="#support" className="hover:text-gold-accent transition-colors">{isAr ? "الاتصال بالدعم" : "Contact Support"}</a>
        </div>
        <div>
          © {new Date().getFullYear()} Sacred Stories. {isAr ? "جميع الحقوق محفوظة." : "All rights reserved."}
        </div>
      </footer>
    </div>
  );
}
