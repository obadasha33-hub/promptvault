import json
import os

# Define Allowed Models and Categories
allowed_models = [
    'GPT-5.5 (Agentic)',
    'Claude 4.8 Opus',
    'Claude Fable 5',
    'Gemini 3.5 Pro',
    'Gemini 3.5 Flash',
    'Flux 1.1 Pro',
    'Midjourney v7',
    'Runway Gen-3',
    'Kling v3.0'
]

allowed_categories = [
    'Photo Editing',
    'Photo Generation',
    'Video Generation',
    'Vibe Widgets',
    'Agentic Loops',
    'Fullstack Dev',
    'Security Audit'
]

# ----------------- PHOTO EDITING DATA -----------------
subjects_editing = [
    ("cyberpunk character portrait", "بورتريه شخصية سيبرانية"),
    ("corporate executive headshot", "صورة رأس للمدير التنفيذي"),
    ("high-end skincare product bottle", "زجاجة منتج العناية بالبشرة الفاخر"),
    ("vintage 1920s fashion model", "عارضة أزياء كلاسيكية من العشرينات"),
    ("surreal floating portal landscape", "بوابة خيالية عائمة في مشهد طبيعي"),
    ("sleek electric sports car", "سيارة رياضية كهربائية أنيقة"),
    ("minimalist glass coffee cup", "فنجان قهوة زجاجي بسيط"),
    ("mechanical analog chronograph watch", "ساعة كرونوغراف ميكانيكية"),
    ("rustic wooden forest cabin", "كوخ خشبي ريفي في الغابة"),
    ("modern workspace desk setup", "مكتب عمل حديث")
]

techniques_editing = [
    ("Double Exposure Forest Silhouette Blend", "دمج خيال الغابة بالتعرض المزدوج"),
    ("Sci-Fi Holographic Scanner Grid Projector", "شبكة مسح هولوجرام خيال علمي"),
    ("Studio Rim Light Relighting Studio", "إعادة إضاءة حافة الاستوديو"),
    ("Vintage Film Monochrome Grain Injector", "إضافة حبيبات فيلم مونوكروم كلاسيكي"),
    ("Golden Hour Meadow Sunset Reflector", "عزل وإضاءة الغروب الذهبي"),
    ("Cybernetic Mechanical Neck-Plate Composite", "تركيب لوحة رقبة ميكانيكية سيبرانية"),
    ("Apparel Silk Emerald Green Swapper", "استبدال قماش الملابس بالحرير الزمردي"),
    ("Underwater Turquoise Glow Caustics Generator", "تأثير إضاءة مائية وأمواج تركوازية"),
    ("Split Toning Cinematic Teal & Orange Shader", "تدرج لوني سينمائي تيل وأورانج"),
    ("Frequency Separation Portrait Skin Retoucher", "تنعيم بشرة البورتريه بفصل الترددات")
]

specs_editing = [
    ("Ensure perfect edge blending with custom alpha masks to avoid artifacts.", "تأكيد الدمج المثالي للحواف مع أقنعة ألفا مخصصة لتجنب العيوب."),
    ("Match grain structure of a 35mm film camera across the final composited layers.", "مطابقة بنية حبيبات كاميرا فيلم 35 ملم عبر الطبقات المركبة النهائية."),
    ("Align light cast and ambient occlusion shadows with the secondary light source.", "محاذاة إسقاط الضوء وظلال الانسداد المحيطي مع مصدر الضوء الثانوي."),
    ("Preserve raw fabric/skin textures without introducing artificial plastic blur.", "الحفاظ على الملمس الخام للملابس أو البشرة دون إدخل تمويه بلاستيكي صناعي."),
    ("Calibrate contrast levels and HSL channel mappings for maximum dynamic range.", "معايرة مستويات التباين وتعيين قنوات HSL لأقصى نطاق ديناميكي."),
    ("Maintain strict structural boundary limits using advanced edge detection masks.", "الحفاظ على حدود هيكلية صارمة باستخدام أقنعة كشف الحواف المتقدمة."),
    ("Simulate chromatic aberration and camera lens flare for organic realism.", "محاكاة الانحراف اللوني وتوهج عدسة الكاميرا للواقعية العضوية."),
    ("Integrate volumetric light beams and atmospheric fog particles seamlessly.", "دمج حزم الضوء الحجمية وجزيئات الضباب الجوي بسلاسة."),
    ("Lock key facial proportions and details while adjusting secondary background plates.", "قفل نسب وتفاصيل الوجه الأساسية أثناء ضبط لوحات الخلفية الثانوية."),
    ("Output precise layer details, overlay percentages, and layer mask settings.", "إخراج تفاصيل الطبقة الدقيقة، ونسب التراكب، وإعدادات قناع الطبقة.")
]

# ----------------- PHOTO GENERATION DATA -----------------
locations_photo = [
    ("Cyberpunk street alleyway in Neo-Tokyo", "شارع سايبربانك في نيو طوكيو"),
    ("Orbital space station docking hangar", "حظيرة هبوط في محطة فضاء مدارية"),
    ("Futuristic bio-dome botanical garden", "حديقة نباتية داخل قبة حيوية مستقبلية"),
    ("Ancient underwater temple ruins", "أطلال معبد قديم غارق تحت الماء"),
    ("Cozy mountainside glass observatory", "مرصد فلكي زجاجي دافئ على جانب الجبل"),
    ("Vibrant retro-futuristic arcade hall", "صالة ألعاب ريترو مستقبلية نابضة بالحياة"),
    ("Floating mystical island in the clouds", "جزيرة عائمة غامضة في السحاب"),
    ("Subterranean glowing crystal cave", "كهف بلوري متوهج تحت الأرض"),
    ("Volcanic lava field research outpost", "موقع أبحاث في حقل حمم بركانية"),
    ("Bustling Asian night market in the rain", "سوق ليلي آسيوي صاخب تحت المطر")
]

styles_photo = [
    ("35mm vintage film with warm grain and shallow depth of field", "فيلم كلاسيكي 35 ملم بحبيبات دافئة وعمق بؤري ضحل"),
    ("Unreal Engine 5 render with hyper-detailed ray-traced reflections", "رندر محرك Unreal Engine 5 بانعكاسات تتبع الأشعة"),
    ("Minimalist macro studio photography with soft HSL color harmony", "تصوير ماكرو استوديو بسيط بتناسق لوني ناعم"),
    ("Dramatic chiaroscuro oil painting with textured brushstrokes", "لوحة زيتية دراماتيكية بضربات فرشاة بارزة وإضاءة متباينة"),
    ("Isometric low-poly voxel art with vibrant pastel clay shaders", "فن فوكسل متساوي القياس بألوان باستيل وشيدر صلصال"),
    ("Atmospheric tech-noir aesthetic with violet and cyan key lights", "جمالية تيك-نوار مع إضاءة بنفسجية وتركوازية"),
    ("Surrealist digital collage with floating geometric shapes", "كولاج رقمي سريالي مع أشكال هندسية عائمة"),
    ("Architectural blueprint sketch with watercolor washes", "مخطط معماري هندسي مع تلوين مائي خفيف"),
    ("Ethereal fantasy watercolor style with gold leaf accents", "رسم مائي خيالي أثيري مع لمسات من ورق الذهب"),
    ("National Geographic style documentary capture with natural light", "تصوير وثائقي بنمط ناشيونال جيوجرافيك وإضاءة طبيعية")
]

params_photo = [
    ("85mm f/1.2 lens, ISO 100, --ar 16:9 --style raw --s 750", "عدسة 85 ملم بفتحة 1.2، أيزو 100، نسبة 16:9، نمط خام، تنعيم 750"),
    ("50mm f/1.4 lens, moody rim light, --ar 4:3 --s 500 --v 6.0", "عدسة 50 ملم بفتحة 1.4، إضاءة حافة، نسبة 4:3، تنعيم 500، نسخة 6.0"),
    ("wide-angle 24mm lens, deep focus, --ar 21:9 --style raw", "عدسة واسعة الزاوية 24 ملم، تركيز عميق، نسبة 21:9، نمط خام"),
    ("macro lens, razor-sharp detail focus, --ar 1:1 --s 800", "عدسة ماكرو، تركيز حاد على التفاصيل، نسبة 1:1، تنعيم 800"),
    ("telephoto 135mm lens, compressed perspective, --ar 16:9 --v 7", "عدسة تقريب 135 ملم، منظور مضغوط، نسبة 16:9، نسخة 7"),
    ("35mm lens, street photography style, shutter 1/250s, --ar 3:2", "عدسة 35 ملم، نمط تصوير الشارع، سرعة غالق 1/250ث، نسبة 3:2"),
    ("anamorphic lens, horizontal flare, --ar 2.39:1 --style raw", "عدسة أنامورفيك، توهج أفقي، نسبة 2.39:1، نمط خام"),
    ("tilt-shift lens, miniature effect, --ar 16:9 --s 600", "عدسة إمالة وإزاحة، تأثير مصغر، نسبة 16:9، تنعيم 600"),
    ("studio softbox lighting, high contrast shadow, --ar 4:5 --s 900", "إضاءة استوديو ناعمة، ظلال عالية التباين، نسبة 4:5، تنعيم 900"),
    ("aerial perspective, golden hour light, --ar 16:9 --s 400", "منظور جوي، إضاءة الساعة الذهبية، نسبة 16:9، تنعيم 400")
]

details_photo = [
    ("soft glowing neon signs and volumetric steam rising", "لوحات نيون متوهجة وارتفاع بخار حجمي"),
    ("reflective wet asphalt and floating water droplets", "إسفلت رطب عاكس وقطرات ماء متطايرة"),
    ("intricate gold filigree patterns and holographic UI grids", "نقوش ذهبية معقدة وشبكات واجهة مستخدم هولوجرام"),
    ("misty pine trees and a rising crescent moon", "أشجار صنوبر ضبابية وهلال صاعد"),
    ("bioluminescent plants and soft floating spores", "نباتات مضيئة حيوياً وأبواغ عائمة ناعمة"),
    ("geometrical shadows cast by massive metallic beams", "ظلال هندسية تسقطها عوارض معدنية ضخمة"),
    ("ancient stone engravings covered in glowing green moss", "نقوش حجرية قديمة مغطاة بطحالب خضراء مضيئة"),
    ("sleek carbon fiber paneling and copper wiring", "ألواح ألياف كربون أنيقة وأسلاك نحاسية"),
    ("shimmering coral reefs with schools of exotic fish", "شعاب مرجانية لامعة مع أسراب أسماك غريبة"),
    ("rustic wooden details juxtaposed with sleek glass panels", "تفاصيل خشبية ريفية بجوار ألواح زجاجية أنيقة")
]

# ----------------- VIDEO GENERATION DATA -----------------
movements_video = [
    ("Dolly-in tracking shot following", "حركة دولي وتتبع لداخل المشهد يتبع"),
    ("Slow panning sweep over", "مسح أفقي بطيء فوق"),
    ("High-angle drone flyover of", "تحليق جوي مرتفع لطائرة مسيرة فوق"),
    ("First-person perspective walking through", "منظور الشخص الأول والمشي عبر"),
    ("Low-angle kinetic tracking behind", "تتبع حركي من زاوية منخفضة خلف"),
    ("Cinematic orbital rotation around", "دوران مداري سينمائي حول"),
    ("Macro slow-motion capture of", "لقطة ماكرو بطيئة الحركة لـ"),
    ("Smooth crane shot rising above", "حركة رافعة سلسة ترتفع فوق"),
    ("Whip pan transition matching", "حركة مسح سريع منتقلة تطابق"),
    ("Handheld documentary style zoom into", "لقطة زووم يدوي بنمط وثائقي في")
]

scenes_video = [
    ("a sleek electric motorcycle speeding down a wet neon-lit street.", "دراجة كهربائية سريعة في شارع نيون مبلل."),
    ("an ancient stone temple hidden inside a lush tropical jungle.", "معبد حجري قديم مخفي في غابة استوائية."),
    ("a massive robotic arm assembling a glowing holographic core.", "ذراع آلي يجمع نواة هولوجرام مضيئة."),
    ("a portal opening inside a dark library, releasing floating glowing books.", "بوابة سحرية تفتح داخل مكتبة مظلمة وتطلق كتباً مضيئة."),
    ("an astronaut walking on the surface of a ringed planet at sunrise.", "رائد فضاء يمشي على كوكب ذي حلقات وقت الشروق."),
    ("a cybernetic jellyfish floating through a bioluminescent deep sea trench.", "قنديل بحر سيبراني يطفو في خندق بحري عميق مضيء."),
    ("a vintage train crossing a massive stone bridge over a misty canyon.", "قطار كلاسيكي يعبر جسراً حجرياً فوق واد ضبابي."),
    ("an interactive glass building reflecting the sunset clouds as it shifts shape.", "مبنى زجاجي تفاعلي يعكس شفق الغروب أثناء تغير شكله."),
    ("a mechanical dragon breathing cyan fire in a desolate mountain valley.", "تنين ميكانيكي ينفث لهباً تركوازياً في واد جبلي."),
    ("a minimalist digital garden where flowers grow as glowing algorithms.", "حديقة رقمية تنمو فيها زهور على شكل خوارزميات مضيئة.")
]

specs_video = [
    ("Volumetric fog, cinematic light beams, moody film grain, 8k resolution.", "ضباب حجمي، أشعة ضوئية سينمائية، حبيبات فيلم، دقة 8K."),
    ("High-speed motion flow, wet asphalt reflections, dramatic shadow play.", "تدفق حركة سريع، انعكاسات أسفلت رطب، تلاعب ظلال دراماتيكي."),
    ("Soft golden hour sun rays, realistic fluid dynamics, gentle wind animations.", "أشعة شمس ذهبية ناعمة، ديناميكيات سوائل واقعية، تحركات رياح لطيفة."),
    ("Intense action flow, neon particles trail, sharp focus, slow-motion physics.", "تدفق حركة مكثف، تتبع جزيئات النيون، تركيز حاد، فيزياء حركة بطيئة."),
    ("Atmospheric depth, misty air, glowing cybernetic lines, deep contrast.", "عمق جوي، هواء ضبابي، خطوط سيبرانية متوهجة، تباين عميق."),
    ("Dynamic smoke simulation, dramatic lens flares, high-fidelity textures.", "محاكاة دخان ديناميكية، توهج عدسة دراماتيكي، تفاصيل خامات عالية الدقة."),
    ("Ethereal particle overlay, slow dreamlike camera movements, pastel grading.", "تراكب جزيئات أثيري، حركات كاميرا بطيئة وحالمة، تصحيح ألوان باستيل."),
    ("Chiaroscuro shadow cast, razor-sharp reflections, cinematic color grading.", "إسقاط ظلال دراماتيكي، انعكاسات حادة، تصحيح ألوان سينمائي."),
    ("Hyper-detailed fire simulation, shockwave physics, cinematic soundscapes.", "محاكاة نار مفصلة، فيزياء موجات صادمة، مشاهد صوتية سينمائية."),
    ("Bioluminescent caustics, floating micro-dust, smooth gimbal stabilization.", "إضاءة أعماق مائية مضيئة، غبار دقيق عائم، تثبيت سلس للكاميرا.")
]

# ----------------- VIBE WIDGETS DATA -----------------
widgets_types = [
    ("Audio Recorder with Live Waveform", "مسجل صوتي مع موجة تفاعلية حية"),
    ("Interactive Canvas Particle Constellation", "شبكة جزيئات Canvas تفاعلية ومتصلة"),
    ("Autonomous Cyber Pet Simulation", "محاكاة حيوان أليف ذكي سيبراني"),
    ("Markdown Interactive Notebook editor", "محرر ملاحظات ماركداون تفاعلي"),
    ("Dynamic SVG Gradient Creator & Exporter", "مولد ومصدر تدرجات ألوان SVG"),
    ("Real-time Logic Gate Circuit Simulator", "محاكي بوابات منطقية وتصميم دوائر"),
    ("Glassmorphic Pomodoro Timer with Sound Synth", "مؤقت إنتاجية بومودورو ذو مظهر زجاجي"),
    ("Interactive CSS Flexbox/Grid Playground", "ملعب تجربة بصرية لتنسيقات CSS Flexbox"),
    ("Reactive Audio Synthesizer Keyboard", "بيانو رقمي برمجياً يعتمد على Web Audio"),
    ("Terminal Command Line Emulator shell", "محاكي سطر أوامر (Terminal) تفاعلي")
]

impls_widgets = [
    ("Use React state hooks synced with localStorage for local persistence.", "استخدام خطافات حالة React المتزامنة مع التخزين المحلي للاستمرارية."),
    ("Render dynamic 60fps animations on HTML5 Canvas with requestAnimationFrame.", "رسم تحريكات ديناميكية بمعدل 60 إطاراً في الثانية على لوحة Canvas."),
    ("Style with premium dark aesthetics, glassmorphism, and neon border highlights.", "تصميم بمظهر داكن فاخر، وشفافية زجاجية، وحدود نيون متوهجة."),
    ("Incorporate browser Web Audio API for custom synthesized audio feedback.", "دمج واجهة Web Audio API البرمجية لتوليد تأثيرات صوتية برمجية مخصصة."),
    ("Implement responsive layouts optimized for touch and mouse interactions.", "تطوير تخطيطات متجاوبة محسنة للتفاعل باللمس أو الماوس."),
    ("Provide a settings control panel to configure colors, sizing, and speeds.", "توفير لوحة تحكم في الإعدادات لتخصيص الألوان، والأحجام، والسرعات."),
    ("Ensure strict WCAG accessibility, including keyboard navigation and aria tags.", "تأكيد توافق إمكانية الوصول WCAG بما في ذلك التنقل باللوحة وعلامات aria."),
    ("Handle complex React refs to manage media elements and canvas dimensions.", "التعامل مع مراجع React المعقدة لإدارة عناصر الوسائط وأبعاد اللوحة."),
    ("Use SVG paths with coordinate interpolation for organic motion paths.", "استخدام مسارات SVG مع استيفاء الإحداثيات لمسارات حركة عضوية."),
    ("Enforce strict error boundaries and fallback UI in case API limits occur.", "فرض حدود أخطاء صارمة وواجهة بديلة في حالة حدوث قيود في الواجهات.")
]

reqs_widgets = [
    ("Create a highly polished dashboard layout with collapsible panels.", "إنشاء تخطيط لوحة تحكم مصقولة جداً مع ألواح قابلة للطي."),
    ("Add interactive charts showing historical metrics using custom SVG rendering.", "إضافة مخططات تفاعلية تعرض المقاييس التاريخية باستخدام رسم SVG مخصص."),
    ("Implement a drag-and-drop builder for custom layouts and configurations.", "تطوير باني سحب وإفلات للتخطيطات والتكوينات المخصصة."),
    ("Feature real-time visual alerts and glowing status indicator nodes.", "تقديم تنبيهات بصرية فورية وعقد مؤشر حالة متوهجة."),
    ("Integrate custom color schemes like Cyberpunk Neon, Sleek Dark, and Ivory light.", "دمج مخططات ألوان مخصصة مثل نيون سايبربانك، والمظهر الداكن، والفاتح العاجي."),
    ("Include step-by-step tutorial overlays for first-time user guidance.", "تضمين تراكبات تعليمية خطوة بخطوة لإرشاد المستخدم لأول مرة."),
    ("Support exporting configurations as copyable JSON or downloadable files.", "دعم تصدير التكوينات كملفات JSON قابلة للنسخ أو للتنزيل."),
    ("Add rich micro-animations (e.g. spring transitions, hover scales) to all controls.", "إضافة تحريكات دقيقة غنية (مثل انتقالات الربيع ومقياس الحوم) لجميع عناصر التحكم."),
    ("Design a comprehensive sound synthesizer with presets for sine, square, and saw waves.", "تصميم سنثسيزر صوتي شامل مع إعدادات مسبقة للموجات الجيبية والتربيعية والمنشارية."),
    ("Include full testing assertions using React Testing Library guidelines.", "تضمين تأكيدات اختبار كاملة باستخدام إرشادات مكتبة اختبار React.")
]

# ----------------- AGENTIC LOOPS DATA -----------------
roles_agentic = [
    ("Self-Healing Code Architect", "وكيل مستقل لبنية كود ذاتية الإصلاح"),
    ("Multi-Agent Workflow Orchestrator", "وكيل مستقل لتنسيق وتوزيع سير العمل"),
    ("AST Vulnerability Scanner Agent", "وكيل مستقل لفحص الثغرات الأمنية في شجرة الكود"),
    ("Recursive Web Scraper & Summarizer", "وكيل مستقل للتنقيب والتلخيص التلقائي"),
    ("Automated DB Health check & repair loop", "وكيل مستقل لمراقبة وإصلاح أداء قاعدة البيانات"),
    ("CI/CD Build Log Diagnostics Expert", "وكيل مستقل لتشخيص أخطاء سجلات بناء CI/CD"),
    ("Semantic Context Vector Indexing controller", "وكيل مستقل لإدارة وتحديث فهارس سياق النواقل"),
    ("Automatic Test-Driven Development (TDD) Runner", "وكيل مستقل لتشغيل التطوير القائم على الاختبار"),
    ("Log Analytics and Anomalies Watchdog", "وكيل مستقل لمراقبة السجلات واكتشاف الشذوذ"),
    ("Autonomous Cloud Cost Optimization Agent", "وكيل مستقل لتحسين وتخفيض تكاليف السحاب")
]

constraints_agentic = [
    ("Maintain a JSON state schema tracking progress, logs, and errors.", "الحفاظ على مخطط حالة JSON لتتبع التقدم والسجلات والأخطاء."),
    ("Enforce a strict limit of 10 iteration loops to avoid runaway token usage.", "فرض حد صارم من 10 حلقات تكرارية لتجنب استهلاك التوكن العشوائي."),
    ("Trigger a safety halt if two consecutive loops yield zero progress.", "تفعيل إيقاف أمان إذا أسفرت حلقتان متتاليتان عن تقدم صفري."),
    ("Format final deliverables in structured JSON conforming to a schema.", "تنسيق المخرجات النهائية في هيكل JSON منظم متوافق مع المخطط."),
    ("Run a self-correction pass auditing outputs before final submission.", "تشغيل خطوة تصحيح ذاتي لتدقيق المخرجات قبل التقديم النهائي."),
    ("Handle raw data streams in chunks to prevent heap memory exhaustion.", "معالجة تدفقات البيانات الخام في أجزاء لمنع نفاد ذاكرة النظام."),
    ("Implement retry policies with exponential backoff on HTTP/API errors.", "تطبيق سياسات إعادة المحاولة مع تأخير أسي في أخطاء الشبكة والواجهات."),
    ("Lock critical session resources using distributed locking mechanisms.", "قفل موارد الجلسة الحرجة باستخدام آليات القفل الموزعة."),
    ("Log execution traces to an external logger with correlation IDs.", "تسجيل آثار التنفيذ إلى مسجل خارجي مع معرّفات الارتباط."),
    ("Abstract LLM calls behind a fallback handler switching between models.", "تجريد استدعاءات النموذج خلف معالج بديل يتنقل بين النماذج.")
]

tasks_agentic = [
    ("Analyze structural code complexities and fix functions exceeding threshold.", "تحليل تعقيدات الكود الهيكلية وإصلاح الدوال التي تتجاوز العتبة."),
    ("Coordinate task handoffs between a coding agent and a testing agent.", "تنسيق تسليم المهام بين وكيل البرمجة ووكيل الاختبار."),
    ("Parse abstract syntax trees (AST) to discover security vulnerabilities.", "تحليل أشجار القواعد المجردة (AST) لاكتشاف الثغرات الأمنية."),
    ("Extract nested URLs, fetch text contents, and summarize them by category.", "استخراج الروابط المتداخلة وجلب محتويات النصوص وتلخيصها حسب الفئة."),
    ("Audit slow database queries and automatically build appropriate indexes.", "تدقيق استعلامات قاعدة البيانات البطيئة وإنشاء الفهارس المناسبة تلقائياً."),
    ("Scan output logs for compile failures and suggest specific code patches.", "فحص سجلات المخرجات بحثاً عن فشل البناء واقتراح رقع كود محددة."),
    ("Generate semantic embeddings for new documents and update vector stores.", "توليد التضمينات الدلالية للمستندات الجديدة وتحديث مخازن المتجهات."),
    ("Write unit tests, run the test runner, and refactor code until all tests pass.", "كتابة اختبارات الوحدة، تشغيل أداة الاختبار، وإعادة هيكلة الكود حتى تنجح جميع الاختبارات."),
    ("Parse server access logs, detect traffic anomalies, and block suspicious IPs.", "تحليل سجلات الوصول إلى الخادم واكتشاف حركة المرور الشاذة وحظر عناوين IP المشبوهة."),
    ("Analyze cloud resource usage metrics and shut down idle virtual servers.", "تحليل مقاييس استخدام موارد السحاب وإغلاق الخوادم الافتراضية غير النشطة.")
]

# ----------------- FULLSTACK DEV DATA -----------------
features_fullstack = [
    ("Next.js Server Actions with Supabase Client", "ميزة إجراءات خادم Next.js مع Supabase"),
    ("Clerk Authentication Middleware with custom route shields", "وسيط حماية المسارات وربط Clerk Authentication"),
    ("Prisma Schema Migration pipeline with automated rollback", "ترحيل بيانات Prisma مع التراجع التلقائي للأخطاء"),
    ("Websocket chat handler with Redis Pub/Sub", "خادم دردشة فوري ويب سوكيت مع Redis Pub/Sub"),
    ("Secure File Uploader to Supabase Storage with type checks", "رفع ملفات آمن إلى Supabase Storage مع التحقق"),
    ("API rate-limiter middleware using Redis token buckets", "محدد معدل استدعاء API باستخدام سلال الرموز في Redis"),
    ("Tailwind CSS custom theme hook with system sync", "خطاف تخصيص سمات ومظهر التطبيق مع مزامنة النظام"),
    ("Dynamic forms validator using Zod and react-hook-form", "مكون التحقق من المدخلات بـ Zod وReact Hook Form"),
    ("Stripe Checkout Webhook verification and checkout handler", "معالج ويب-هوك Stripe للتحقق من عمليات الدفع"),
    ("Background Job Queue manager using BullMQ and Redis", "إدارة طوابير المهام في الخلفية بـ BullMQ وRedis")
]

archs_fullstack = [
    ("Implement rigorous error boundaries and loading skeleton states for async actions.", "تطبيق حدود أخطاء صارمة وحالات تحميل هيكلية للإجراءات غير المتزامنة."),
    ("Use proper caching strategies: cache tags, revalidatePath, and SWR headers.", "استخدام استراتيجيات ذاكرة التخزين المؤقت المناسبة: علامات الكاش وتحديث المسارات."),
    ("Secure database mutations by explicitly checking row ownership before update.", "تأمين تعديلات قاعدة البيانات من خلال التحقق الصريح من ملكية الصفوف قبل التحديث."),
    ("Ensure zero client-side warnings, optimizing bundle sizes and lazy-loading.", "تأكيد خلو جانب العميل من التحذيرات، وتحسين أحجام الحزم والتحميل الكسول."),
    ("Adhere strictly to SOLID design principles and hexagonal clean architecture.", "الالتزام الصارم بمبادئ تصميم SOLID والبنية النظيفة السداسية."),
    ("Inject dependencies via interfaces to allow mock testing implementation.", "حقن التبعيات عبر الواجهات للسماح بتطبيق اختبار محاكاة."),
    ("Verify JWT payloads on the server edge before accessing external services.", "التحقق من حمولات رموز JWT على حافة الخادم قبل الوصول للخدمات الخارجية."),
    ("Handle transactional database queries with auto-retry and isolation levels.", "معالجة استعلامات قاعدة البيانات المعاملاتية مع إعادة المحاولة التلقائية ومستويات العزل."),
    ("Write comprehensive unit tests with Vitest, covering happy paths and edge cases.", "كتابة اختبارات وحدة شاملة بـ Vitest تغطي المسار السعيد والحالات الحافة."),
    ("Enforce strict CORS configuration options and headers globally.", "فرض خيارات إعداد CORS وترويساتها الصارمة بشكل شامل عالمياً.")
]

# ----------------- SECURITY AUDIT DATA -----------------
targets_security = [
    ("Express API handler code", "معالجات واجهات Express API"),
    ("GraphQL resolver methods", "محللات GraphQL Resolvers"),
    ("Next.js Server Action files", "إجراءات خادم Next.js Server Actions"),
    ("Kubernetes RBAC configurations", "صلاحيات Kubernetes RBAC"),
    ("Docker multi-stage builds", "ملفات بناء Dockerfile متعددة المراحل"),
    ("Node.js package dependencies", "حزم مخرجات Node.js وملفات القفل"),
    ("JWT token verify functions", "معالجات ورموز JWT"),
    ("CORS header options", "خيارات ترويسات CORS"),
    ("SQL query builders", "منشئات استعلامات SQL"),
    ("OAuth 2.0 redirect flows", "مسارات توجيه OAuth 2.0")
]

vulns_security = [
    ("prototype pollution and AST injection vulnerabilities.", "ثغرات التلوث الكائني وحقن شجرة القواعد (AST)."),
    ("Server-Side Request Forgery (SSRF) and path traversals.", "ثغرات تزوير الطلبات عبر الخادم (SSRF) وتخطي المسارات."),
    ("SQL injections and unsafe dynamic query execution.", "ثغرات حقن استعلامات SQL والتشغيل غير الآمن للاستعلامات."),
    ("Broken authentication checks and missing validation guards.", "ثغرات كسر التحقق من الهوية وغياب حراس التحقق من المدخلات."),
    ("Dependency vulnerabilities, outdated packages, and lockfile tampering.", "ثغرات تبعيات المكتبات، الحزم القديمة، والتلاعب بملف القفل."),
    ("CORS misconfigurations and unsafe origin reflections.", "تكوينات CORS الخاطئة وانعكاس الأصول غير الآمنة."),
    ("Cross-Site Scripting (XSS) and unsafe innerHTML bindings.", "ثغرات حقن كود العميل (XSS) وربط innerHTML غير الآمن."),
    ("Insecure Direct Object References (IDOR) on critical endpoints.", "ثغرات الإشارة غير الآمنة للكائنات المباشرة (IDOR) في المسارات الحساسة."),
    ("XML External Entity (XXE) injection via parser defaults.", "ثغرات حقن الكيانات الخارجية لـ XML (XXE) عبر افتراضيات المحلل."),
    ("Cryptographic weaknesses and unsafe initialization vectors.", "نقاط الضعف التشفيرية وناقلات التهيئة غير الآمنة.")
]

reports_security = [
    ("Format audit findings in a clear Markdown table detailing sinks and fixes.", "تنسيق نتائج الفحص في جدول ماركداون واضح يوضح الثغرات والإصلاحات المقترحة."),
    ("Propose specific code patch diff blocks for each identified vulnerability.", "اقتراح كود رقعة برمجية محددة بصيغة diff لكل ثغرة مكتشفة."),
    ("Classify findings strictly using CVSS v3 score criteria and severity levels.", "تصنيف المكتشفات بدقة باستخدام معايير نقاط CVSS v3 ومستويات الخطورة."),
    ("Trace data flows from taint sources to unsafe execution sinks step-by-step.", "تتبع تدفق البيانات من مصادر التلوث إلى بالوعات التنفيذ غير الآمنة خطوة بخطوة."),
    ("Provide verification scripts (e.g. bash curls) to test the vulnerabilities.", "توفير سكربتات تحقق (مثل أوامر curl) لاختبار وجود الثغرات."),
    ("Draft a detailed remediation checklist prioritized by threat score.", "صياغة قائمة مرجعية مفصلة للإصلاح مرتبة حسب نقاط التهديد."),
    ("Identify dependencies impacted by security advisories and map their path.", "تحديد التبعيات المتأثرة بالتحذيرات الأمنية ورسم مسار تأثيرها."),
    ("Detail threat vectors and attacker access levels required to exploit.", "تفصيل ناقلات التهديد ومستويات وصول المهاجم المطلوبة للاستغلال."),
    ("Propose custom ESLint rules or static analysis configurations to prevent.", "اقتراح قواعد ESLint مخصصة أو إعدادات تحليل ثابتة لمنع حدوثها مجدداً."),
    ("Write a comprehensive postmortem report outlining preventive designs.", "كتابة تقرير شامل لم بعد الوفاة يحدد التصاميم الوقائية للحد من الخطورة.")
]


# ----------------- PROMPT GENERATOR LOOP -----------------
def generate_advanced_library():
    prompts = []

    # 1. PHOTO EDITING (100 prompts)
    for i in range(100):
        sub_en, sub_ar = subjects_editing[i % 10]
        tech_en, tech_ar = techniques_editing[(i // 10) % 10]
        spec_en, spec_ar = specs_editing[(i + 3) % 10]
        spec2_en, spec2_ar = specs_editing[(i + 7) % 10]

        model = ['Flux 1.1 Pro', 'Midjourney v7', 'Claude 4.8 Opus', 'Gemini 3.5 Pro'][i % 4]
        img_url = f"/uploads/edit_{i+1}.jpg"

        title = f"{tech_en} on {sub_en.replace('a ', '').replace('an ', '')[:40].title()}"
        title_ar = f"{tech_ar} على {sub_ar}"

        body = (
            f"SYSTEM_ROLE: Expert Creative Digital Retoucher & Composite Specialist.\n"
            f"MODEL_TARGET: {model}\n"
            f"INPUT_SUBJECT: {sub_en.capitalize()}.\n"
            f"COMPOSITE TECHNIQUE: {tech_en}.\n"
            f"EXECUTION GUIDELINES:\n"
            f"1. {spec_en}\n"
            f"2. {spec2_en}\n"
            f"3. Keep original grain structure consistent across all layer overlays.\n"
            f"4. Adjust shadow and highlights mapping to preserve natural light casting.\n"
            f"OUTPUT FORMAT: Provide a structured breakdown of layers, opacity levels, layer mask coordinates, and blend modes."
        )

        description = f"Advanced edit prompt to perform a {tech_en.lower()} overlay on a {sub_en.lower()}."
        description_ar = f"طريقة تعديل متقدمة لإجراء {tech_ar} على {sub_ar}."

        prompts.append({
            "id": f"curated-photo-edit-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Photo Editing",
            "image_url": img_url,
            "body": body
        })

    # 2. PHOTO GENERATION (100 prompts)
    for i in range(100):
        loc_en, loc_ar = locations_photo[i % 10]
        style_en, style_ar = styles_photo[(i // 10) % 10]
        param_en, param_ar = params_photo[(i + 2) % 10]
        det_en, det_ar = details_photo[(i + 5) % 10]

        model = ['Flux 1.1 Pro', 'Midjourney v7', 'Gemini 3.5 Flash'][i % 3]
        img_url = f"/uploads/edit_{(i % 90) + 1}.jpg"

        title = f"Cinematic {loc_en.split(' in ')[0].title()} - {style_en.split(' with ')[0].title()}"
        title_ar = f"توليد مشهد سينمائي: {loc_ar} - {style_ar}"

        body = (
            f"Act as a professional photography prompter and AI lighting director.\n"
            f"TARGET AI: {model}\n"
            f"SCENE ENVIRONMENT: {loc_en}.\n"
            f"ATMOSPHERIC HIGHLIGHTS: {det_en}.\n"
            f"VISUAL AESTHETIC: Render as a {style_en}.\n"
            f"CAMERA CONFIGURATION: {param_en}.\n"
            f"OBJECTIVE: Synthesize an extremely detailed, evocative, high-contrast representation of the scene."
        )

        description = f"Professional image generation prompt to render a {loc_en.lower()} in a {style_en.lower()}."
        description_ar = f"موجه توليد صور لتجسيد {loc_ar} بأسلوب {style_ar}."

        prompts.append({
            "id": f"curated-photo-gen-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Photo Generation",
            "image_url": img_url,
            "body": body
        })

    # 3. VIDEO GENERATION (100 prompts)
    for i in range(100):
        mov_en, mov_ar = movements_video[i % 10]
        scene_en, scene_ar = scenes_video[(i // 10) % 10]
        spec_en, spec_ar = specs_video[(i + 4) % 10]

        model = ['Runway Gen-3', 'Kling v3.0'][i % 2]

        title = f"Director Shot: {mov_en.split(' following')[0].split(' sweep')[0].split(' of')[0]} of {scene_en.split(' speeding')[0].split(' hidden')[0].split(' assembling')[0].split(' opening')[0].split(' walking')[0][:40]}"
        title_ar = f"حركة إخراجية: {mov_ar} {scene_ar}"

        body = (
            f"SYSTEM_ROLE: Expert Cinematographer and Director of Photography.\n"
            f"MODEL_TARGET: {model}\n"
            f"CAMERA MOVEMENT: {mov_en} {scene_en}\n"
            f"ATMOSPHERE SPECS: {spec_en}\n"
            f"TEMPORAL RULES: Enforce constant physical momentum, fluid transitions, zero sudden cuts, and logical gravity limits."
        )

        description = f"Director instructions to generate a video shot featuring a {mov_en.lower()} {scene_en.lower()}."
        description_ar = f"تعليمات حركة الكاميرا لتوليد لقطة فيديو {mov_ar} {scene_ar}."

        prompts.append({
            "id": f"curated-video-gen-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Video Generation",
            "body": body
        })

    # 4. VIBE WIDGETS (100 prompts)
    for i in range(100):
        widget_en, widget_ar = widgets_types[i % 10]
        impl_en, impl_ar = impls_widgets[(i // 10) % 10]
        req_en, req_ar = reqs_widgets[(i + 6) % 10]

        model = ['Claude 4.8 Opus', 'Claude Fable 5', 'Gemini 3.5 Pro'][i % 3]

        title = f"Interactive {widget_en.split(' with ')[0].split(' editor')[0]} UI Component"
        title_ar = f"مكون ويب تفاعلي: {widget_ar}"

        body = (
            f"SYSTEM_ROLE: Act as an expert frontend engineer with 15+ years of experience specializing in custom interactive components.\n"
            f"TASK: Develop a highly interactive, client-side React widget: '{widget_en}'.\n"
            f"TECHNICAL GUIDELINES:\n"
            f"- {impl_en}\n"
            f"- {req_en}\n"
            f"- Style the UI using premium glassmorphic dark mode styling and custom micro-animations.\n"
            f"- Code must be modular, fully typed, responsive, and completely functional inside a single file.\n"
            f"OUTPUT FORMAT: Provide complete code block with all React hooks, interfaces, and JSX markup."
        )

        description = f"Expert prompt to build a custom React {widget_en.lower()} incorporating {impl_en.lower()}."
        description_ar = f"طريقة برمجة مكون React تفاعلي لـ {widget_ar} مع إعداد {impl_ar}."

        prompts.append({
            "id": f"curated-vibe-widgets-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Vibe Widgets",
            "body": body
        })

    # 5. AGENTIC LOOPS (100 prompts)
    for i in range(100):
        role_en, role_ar = roles_agentic[i % 10]
        const_en, const_ar = constraints_agentic[(i // 10) % 10]
        task_en, task_ar = tasks_agentic[(i + 1) % 10]

        model = ['GPT-5.5 (Agentic)', 'Claude 4.8 Opus'][i % 2]

        title = f"Autonomous {role_en.replace(' Loop', '').replace(' Agent', '')}"
        title_ar = f"وكيل ذكي مستقل: {role_ar}"

        body = (
            f"SYSTEM_ROLE: You are an autonomous agent orchestrator acting as a '{role_en}'.\n"
            f"TASK: Setup a recursive execution loop to perform: {task_en}.\n"
            f"EXECUTION CONSTRAINTS:\n"
            f"1. {const_en}\n"
            f"2. Halt immediately if an unrecoverable failure sink is reached.\n"
            f"3. Include a self-healing audit pass before final completion.\n"
            f"OUTPUT: Structured execution logs, state transitions JSON, and final audited output."
        )

        description = f"Autonomous agent configuration to execute a recursive loop for {role_en.lower()}."
        description_ar = f"تكوين وكيل ذكي مستقل لتشغيل حلقة عمل للـ {role_ar}."

        prompts.append({
            "id": f"curated-agentic-loops-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Agentic Loops",
            "body": body
        })

    # 6. FULLSTACK DEV (100 prompts)
    for i in range(100):
        feat_en, feat_ar = features_fullstack[i % 10]
        arch_en, arch_ar = archs_fullstack[(i // 10) % 10]

        model = ['Claude 4.8 Opus', 'GPT-5.5 (Agentic)', 'Claude Fable 5'][i % 3]

        title = f"Secure {feat_en.split(' with ')[0].split(' using ')[0]} Module"
        title_ar = f"هندسة برمجية: {feat_ar}"

        body = (
            f"SYSTEM_ROLE: Act as an expert senior software architect designing a secure system component.\n"
            f"TASK: Write a clean, production-ready TypeScript implementation for: '{feat_en}'.\n"
            f"ARCHITECTURAL CRITERIA:\n"
            f"- {arch_en}\n"
            f"- Apply clean code, SOLID design principles, and comprehensive type annotations.\n"
            f"- Ensure robust error boundaries, logging mechanisms, and strict security validation checks.\n"
            f"OUTPUT FORMAT: Clean, copy-pasteable TypeScript code with exports and explanatory docstrings."
        )

        description = f"Architectural coding prompt to build a fullstack {feat_en.lower()} following SOLID design."
        description_ar = f"موجه تطوير ويب لبناء ميزة {feat_ar} مع تطبيق {arch_ar}."

        prompts.append({
            "id": f"curated-fullstack-dev-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Fullstack Dev",
            "body": body
        })

    # 7. SECURITY AUDIT (100 prompts)
    for i in range(100):
        target_en, target_ar = targets_security[i % 10]
        vuln_en, vuln_ar = vulns_security[(i // 10) % 10]
        rep_en, rep_ar = reports_security[(i + 9) % 10]

        model = ['Claude 4.8 Opus', 'Gemini 3.5 Pro'][i % 2]

        title = f"{target_en.replace(' code', '').title()} Security Vuln Scanner"
        title_ar = f"فحص وتأمين: {target_ar}"

        body = (
            f"SYSTEM_ROLE: You are an expert senior security auditor and penetration testing specialist.\n"
            f"TASK: Conduct an extensive static code analysis security review on: '{target_en}'.\n"
            f"VULNERABILITY FOCUS: Scan specifically for {vuln_en}\n"
            f"REPORTING CRITERIA:\n"
            f"- {rep_en}\n"
            f"- Trace inputs, locate execution sinks, and identify missing security validation guards.\n"
            f"OUTPUT FORMAT: Detailed vulnerability report including threat vectors, risk level, and suggested patches."
        )

        description = f"Extensive security review prompt targeting {target_en.lower()} for {vuln_en.lower()}"
        description_ar = f"موجه مراجعة أمان لفحص {target_ar} واكتشاف ثغرات {vuln_ar}"

        prompts.append({
            "id": f"curated-security-audit-{i+1}",
            "user_id": "system",
            "title": title[:100],
            "title_ar": title_ar[:100],
            "description": description,
            "description_ar": description_ar,
            "model": model,
            "category": "Security Audit",
            "body": body
        })

    return prompts

if __name__ == "__main__":
    prompts = generate_advanced_library()
    
    out_dir = r"C:\Users\LENOVO\Desktop\pompt vault\vibeprompt-hub\src\data"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "prompts.json")
    
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)
        
    print(f"Generated {len(prompts)} unique prompts successfully in {out_file}")
