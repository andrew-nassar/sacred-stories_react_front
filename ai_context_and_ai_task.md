# Sacred Stories - AI Context & AI Task

مرحباً! هذا الملف تم إنشاؤه ليكون دليلاً مرجعياً متبادلاً لتسجيل وفهم بنية المشروع وتتبع المهام المطلوبة.

---

## 📖 AI Context (سياق المشروع)

### 🌟 نظرة عامة (Overview)
مشروع **Sacred Stories (قصص مقدسة)** هو تطبيق ويب (ملاذ رقمي) مصمم لعرض وسرد قصص القديسين والشهداء المسيحيين، مع التركيز على التصميم البسيط والعمق التاريخي والتفاعل الحيوي باستخدام الذكاء الاصطناعي (Gemini API).

### 🛠️ المكونات التقنية (Tech Stack)
1. **Frontend**:
   - **React 19** + **Vite**
   - **TailwindCSS v4** (باستخدام `@tailwindcss/vite` الجديد)
   - **Framer Motion** (`motion/react`) للحركة والأنيميشن الانسيابي.
   - **Lucide React** للأيقونات.
   
2. **Backend**:
   - **Express.js** يعمل كخادم محلي وخادم إنتاج (Production Server).
   - **tsx** لتشغيل ملفات TypeScript للـ Backend مباشرة (`npm run dev`).
   
3. **AI Integration**:
   - مكتبة **`@google/genai`** (الإصدار الجديد 2.4.0) لاستدعاء نموذج **Gemini 3.5 Flash** من جهة الخادم (Server-Side).

---

### 📂 بنية المجلدات والملفات الرئيسية (Directory Structure)

* 📄 [package.json](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/package.json): يحتوي على الاعتمادات والنصوص البرمجية وتشغيل المشروع.
* 📄 [server.ts](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/server.ts): خادم Express الذي يحتوي على إعدادات الـ Vite Middleware ومسارات الـ API المدعومة بـ Gemini:
  * `/api/search-archives`: البحث الذكي وتوليد تفاصيل القديسين الجدد في شكل JSON متناسق.
  * `/api/archivist-chat`: المحادثة التفاعلية مع "الأرشيفي المقدس" (Sacred Archivist).
  * `/api/generate-reflection`: توليد صلوات وتأملات مخصصة بناءً على مشاعر أو ظروف المستخدم اليومية.
* 📂 **`src/`**: يحتوي على كود الواجهة الأمامية:
  * 📄 [src/App.tsx](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/App.tsx): المكون الأساسي للتحكم بالصفحات وعرض المحتوى المكتبي والهاتفي.
  * 📄 [src/data.ts](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/data.ts): البيانات الثابتة للقديسين والخط الزمني والكنائس كنسخة احتياطية (Fallback) في حال عدم اتصال الـ API.
  * 📂 **`src/features/sacred-stories/`**:
    * 📂 **`store/`**: يحتوي على [sacredStore.tsx](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/features/sacred-stories/store/sacredStore.tsx) لإدارة الحالة العامة (اللغة `en`/`ar` والسمة `light`/`dark` والتبويب الحالي). ويحتوي أيضاً على ملف الترجمات [translations.ts](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/features/sacred-stories/store/translations.ts).
    * 📂 **`adapters/`**: يحتوي على [archivesAdapter.ts](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/features/sacred-stories/adapters/archivesAdapter.ts) للربط بين الـ Frontend ومسارات الـ Express Backend أو أي API خارجي.
    * 📂 **`components/`**: المكونات الرسومية مثل:
      * `SaintsExplorer.tsx`: استكشاف القديسين والبحث وتوليد قديسين جدد عبر الذكاء الاصطناعي.
      * `LiturgyPlayer.tsx`: مشغل الصوت للتراتيل والصلوات المحيطية.
      * `SaintDetailsPage.tsx`: صفحة عرض تفاصيل القديس وقراءة سيرته والتأمل.
      * `ChurchesSection.tsx`: استكشاف الكنائس والأماكن المقدسة.
      * `TimelineSection.tsx`: الخط الزمني التاريخي للشهداء والقديسين.

---

### 🌐 الترجمة واللغات (Localization)
التطبيق يدعم اللغتين **العربية (ar)** و **الإنجليزية (en)** بشكل كامل عن طريق تبديل النصوص في [translations.ts](file:///c:/Users/andre/Downloads/المهرجان/sacred-stories/src/features/sacred-stories/store/translations.ts) وتغيير اتجاه الصفحة `dir="rtl"` تلقائياً عند اختيار اللغة العربية.

---

## 📝 AI Task (قائمة المهام وتتبع العمل)

> [!NOTE]
> قم بتعديل هذا الجدول أو إضافة المهام أدناه عندما ترغب في أن أقوم بتنفيذ مهمة جديدة أو تعديل على المشروع.

| الحالة | المهمة المطلوبة | الملفات المعنية | ملاحظات وتفاصيل |
| :---: | :--- | :--- | :--- |
| ⏳ | بانتظار تحديد مهمتك الأولى | - | يرجى كتابة المهمة التي تريد مني تنفيذها وسأقوم بالبدء فوراً! |

---

### كيف تبدأ؟
أرسل لي المهمة التي ترغب بتنفيذها الآن، مثل:
- تعديل في التصميم أو إضافة تأثيرات بصرية جديدة.
- إضافة ميزة جديدة أو تحسين استجابة الذكاء الاصطناعي.
- تعديل على النصوص أو الترجمات العربية/الإنجليزية.
