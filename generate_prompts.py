import json
import os
import random

# Allowed models and categories based on validation rules
models = [
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

categories = [
    'Photo Editing',
    'Photo Generation',
    'Video Generation',
    'Vibe Widgets',
    'Agentic Loops',
    'Fullstack Dev',
    'Security Audit'
]

# Curated base keywords and components to build rich, unique, high-quality prompts
actions_editing = [
    "Inpaint & blend", "Outpaint canvas", "Replace background", "Retouch portrait", 
    "Color grade", "Relight scene", "Restore vintage photo", "Double exposure blend", 
    "Remove object & fill", "Enhance details", "Adjust shadows", "Match color palette", 
    "Inject atmospheric fog", "Add volumetric light", "Remove watermark", "Correct lens distortion",
    "Apply cyberpunk aesthetic", "Soften background bokeh", "Match reflections", "Super-resolve details"
]

subjects_editing = [
    "a high-end glass water bottle on a marble table", "a cybernetic warrior standing in the rain",
    "a vintage leather armchair in an empty library", "a futuristic sports car on a wet neon street",
    "a close-up portrait of a woman under studio neon lighting", "a rustic wooden cabin in a snowy pine forest",
    "a floating holographic device in a laboratory", "a bustling street food market in Tokyo at night",
    "an astronaut walking through a Martian desert", "a minimalist architectural kitchen space",
    "a mechanical wristwatch laying on a velvet cloth", "a steam rising coffee mug near a window",
    "a sleek drone hovering over a misty river", "a digital artwork of a fantasy forest portal",
    "a golden retriever puppy playing in autumn leaves", "a modern workspace with dual monitors and keyboards"
]

methods_editing = [
    "Verify the shadow falloffs align with the new light source coming from the left-side panel.",
    "Enforce edge feathering to prevent pixelation borders between the original and inpainted region.",
    "Preserve original fabric textures while altering the color palette to deep emerald green.",
    "Ensure correct scale matching when importing the secondary asset into the composite background.",
    "Apply cinematic anamorphic lens effects, matching the grain patterns of a 35mm film camera.",
    "Adjust reflections on glossy surfaces to represent the new neon-blue ambient atmosphere.",
    "Align the depth of field blur values, keeping the main subject sharp and blurring background clutter.",
    "Integrate the holographic glow with volumetric dust particles floating near the light beams."
]

subjects_photo = [
    "A cyberpunk street alley", "An orbital space station hangar", "A futuristic bio-dome garden",
    "A majestic fantasy castle", "A minimalist Scandinavian library", "An ancient underwater temple ruins",
    "A high-tech robotics workshop", "A busy retro-futuristic arcade", "A floating island in the clouds",
    "A subterranean crystal cave", "A cozy mountainside glass observatory", "A sleek corporate headquarters",
    "A volcanic lava field research outpost", "A vibrant coral reef habitat", "A bustling neon night market"
]

styles_photo = [
    "captured on 35mm film with warm vintage grain, cinematic shadows, shallow depth of field, raw style",
    "render in unreal engine 5, hyper-detailed textures, volumetric lighting, ray-traced reflections",
    "isometric voxel art style, clean low-poly models, vibrant pastel colors, soft clay-like shaders",
    "oil painting style, thick impasto brushstrokes, dramatic chiaroscuro lighting, rich deep color palette",
    "minimalist macro photography, clean white background, sharp focus on details, elegant HSL coloring",
    "surrealist digital collage, floating geometric shapes, double exposure effect, dreamlike atmosphere",
    "moody tech-noir aesthetic, deep violet and amber key lights, wet pavement reflections, high contrast",
    "architectural design sketch, clean blueprint lines, subtle watercolor shading, technical annotations"
]

camera_params = [
    "85mm f/1.2 lens, ISO 100, 1/120s shutter, cinematic lighting --ar 16:9 --style raw --s 750",
    "50mm f/1.4 lens, moody rim light, atmospheric haze --ar 4:3 --s 500 --v 6.0",
    "wide-angle 24mm lens, deep depth of field, dramatic shadows --ar 21:9 --style raw",
    "macro lens, extreme close-up, razor-sharp focus on details --ar 1:1 --s 800",
    "telephoto lens, compressed perspective, golden hour light --ar 16:9 --v 7 --style raw"
]

video_actions = [
    "Dolly-in tracking shot following", "Slow panning sweep over", "High-angle drone flyover of",
    "First-person perspective walking through", "Low-angle kinetic tracking behind",
    "Cinematic orbital rotation around", "Macro slow-motion capture of", "Smooth crane shot rising above"
]

video_scenes = [
    "a sleek electric motorcycle speeding down a wet neon-lit street in a futuristic city.",
    "an ancient stone temple hidden inside a lush tropical jungle with cascading waterfalls.",
    "a massive robotic arm assembling a glowing holographic core in an automated factory.",
    "a portal opening inside a dark library, releasing floating glowing books and mystical energy.",
    "a astronaut walking on the surface of a ringed planet, looking back at a rising star.",
    "a cybernetic jellyfish floating through a bioluminescent deep sea trench.",
    "a vintage train crossing a massive stone bridge over a misty canyon at sunrise.",
    "an interactive glass architectural building reflecting the sunset clouds as it dynamically shifts shape."
]

video_quality = [
    "Volumetric fog, cinematic light beams, moody film grain, 8k resolution, photorealistic rendering.",
    "High-speed motion flow, wet asphalt reflections, dramatic shadow play, cinematic color grading.",
    "Soft golden hour sun rays, realistic water splash dynamics, gentle wind animations, movie trailer style.",
    "Intense action flow, neon particles trail, sharp focus, slow-motion physics, high-fidelity details.",
    "Atmospheric depth, misty air, glowing cybernetic lines, deep contrast, slow dreamlike camera movements."
]

widget_types = [
    "Audio Recorder with Live Waveform", "Interactive Canvas Particle Constellation", 
    "Autonomous Cyber Pet Simulation", "Markdown Interactive Notebook", "Dynamic SVG Gradient Creator",
    "Real-time Logic Gate Simulator", "Glassmorphic Pomodoro Timer with Sound Synth",
    "Interactive CSS Flexbox/Grid Playground", "Reactive Audio Synthesizer Keyboard",
    "Terminal Command Line Emulator shell", "Voxel Model Viewer & Editor",
    "Interactive SVG Path Plotter and Exporter", "Client-side JWT Decoder and Debugger",
    "Physics-based Ragdoll Canvas Playground", "Dynamic Color Palette Generator with contrast testing"
]

widget_specs = [
    "Use custom React hooks to manage local state, including saving options to localStorage.",
    "Render custom animations on an HTML5 Canvas using requestAnimationFrame for 60fps performance.",
    "Style the user interface using Tailwind classes, featuring glassmorphic (backdrop-blur-md) and neon borders.",
    "Incorporate synthesized sound feedback using the browser's Web Audio API so no audio assets are loaded.",
    "Ensure the component is highly responsive, adapting layouts for mobile touch gestures and desktop cursors.",
    "Provide a settings control panel at the top-right corner to toggle parameters, color schemes, and configurations."
]

agent_roles = [
    "Self-Healing Code Architect", "Multi-Agent Workflow Orchestrator", "AST Vulnerability Scanner Agent",
    "Recursive Web Scraper & Summarizer", "Automated DB Health check & repair loop",
    "CI/CD Build Log Diagnostics Expert", "Semantic Context Vector Indexing controller",
    "Automatic Test-Driven Development (TDD) Runner"
]

agent_states = [
    "Maintain a JSON state schema containing 'current_step', 'logs', 'error_count', 'resolved_issues'.",
    "Implement a strict execution limit of 10 iteration loops to avoid runaway token usage.",
    "If two consecutive loops yield identical output with zero progress, trigger a loop-protection halt.",
    "Format final deliverables in structured JSON conforming to a Pydantic-compatible data schema.",
    "Include a self-correction pass where the agent audits its own outputs before final presentation."
]

dev_features = [
    "Next.js Server Actions with Supabase Client", "Clerk Authentication Middleware with custom route shields",
    "Prisma Schema Migration pipeline with automated rollback", "Websocket chat handler with Redis Pub/Sub",
    "Secure File Uploader to Supabase Storage with type check", "API rate-limiter middleware using Redis token buckets",
    "Tailwind CSS custom theme hook with system sync", "Dynamic forms validator using Zod and react-hook-form"
]

dev_practices = [
    "Implement rigorous error boundaries and loading skeleton states for all async actions.",
    "Use proper caching strategies: cache tags, revalidatePath, and stale-while-revalidate headers.",
    "Secure database mutations by explicitly checking row ownership before completing updates.",
    "Ensure zero client-side warnings, optimizing bundle sizes and lazy-loading heavy interactive modules."
]

security_targets = [
    "Express API handler code", "GraphQL resolver methods", "Next.js Server Action files",
    "Kubernetes RBAC configurations", "Docker multi-stage builds", "Node.js package dependencies",
    "JWT token verify functions", "CORS header options", "SQL query builders"
]

security_vulns = [
    "prototype pollution and AST injection vulnerabilities.", "Server-Side Request Forgery (SSRF) and path traversals.",
    "SQL injections and unsafe dynamic query execution.", "Broken authentication checks and missing validation guards.",
    "Dependency vulnerabilities, outdated packages, and lockfile tampering.", "CORS misconfigurations and unsafe origin reflections."
]

def generate_all_prompts():
    all_prompts = []
    
    # 1. Photo Editing (100 prompts)
    for i in range(100):
        action = random.choice(actions_editing)
        subject = random.choice(subjects_editing)
        method = random.choice(methods_editing)
        method2 = random.choice(methods_editing)
        while method2 == method:
            method2 = random.choice(methods_editing)
            
        model = random.choice(['Flux 1.1 Pro', 'Gemini 3.5 Pro', 'Claude 4.8 Opus'])
        
        body = (
            f"SYSTEM_ROLE: Professional Image Editor and Composite Expert.\n"
            f"TASK: Prepare detailed instructions to edit: {subject}.\n"
            f"EDITS REQUIRED:\n"
            f"1. {action}.\n"
            f"2. {method}\n"
            f"3. {method2}\n"
            f"4. Match lighting temperature, color grain structure, and edge blend masks.\n"
            f"OUTPUT FORMAT: Clear layer-by-layer instructions specifying masks, color grading coordinates, and blend modes."
        )
        
        all_prompts.append({
            "id": f"curated-photo-edit-{i+1}",
            "user_id": "system",
            "title": f"{action} on {subject.replace('a ', '').replace('an ', '')[:40].title()}",
            "model": model,
            "category": "Photo Editing",
            "body": body
        })

    # 2. Photo Generation (100 prompts)
    for i in range(100):
        subject = random.choice(subjects_photo)
        style = random.choice(styles_photo)
        cam = random.choice(camera_params)
        
        # Add some details
        details = [
            "soft glowing neon signs in the background",
            "volumetric steam rising from storm drains",
            "wet rainy pavement reflecting colorful lights",
            "minimalist layout with premium typography",
            "hyper-realistic skin pores and hair strands",
            "dynamic perspective showing scale and depth",
            "subtle color harmony using dark slate and electric blue"
        ]
        detail1 = random.choice(details)
        detail2 = random.choice(details)
        while detail2 == detail1:
            detail2 = random.choice(details)
            
        body = (
            f"PROMPT: {subject}, {detail1}, {detail2}. "
            f"Style: {style}. Camera parameters: {cam}."
        )
        
        model = random.choice(['Flux 1.1 Pro', 'Midjourney v7'])
        
        all_prompts.append({
            "id": f"curated-photo-gen-{i+1}",
            "user_id": "system",
            "title": f"Cinematic {subject} - {model.split()[0]} Setup",
            "model": model,
            "category": "Photo Generation",
            "body": body
        })

    # 3. Video Generation (100 prompts)
    for i in range(100):
        action = random.choice(video_actions)
        scene = random.choice(video_scenes)
        quality = random.choice(video_quality)
        
        body = (
            f"DIRECTOR INSTRUCTIONS:\n"
            f"Camera movement: {action} {scene}\n"
            f"Visual atmosphere: {quality}\n"
            f"Pacing: Smooth continuous motion, zero sudden cuts, realistic physical momentum."
        )
        
        model = random.choice(['Runway Gen-3', 'Kling v3.0'])
        
        all_prompts.append({
            "id": f"curated-video-gen-{i+1}",
            "user_id": "system",
            "title": f"Cinematic Video Shot: {action.split()[0]} Scene",
            "model": model,
            "category": "Video Generation",
            "body": body
        })

    # 4. Vibe Widgets (100 prompts)
    for i in range(100):
        widget = random.choice(widget_types)
        spec1 = random.choice(widget_specs)
        spec2 = random.choice(widget_specs)
        while spec2 == spec1:
            spec2 = random.choice(widget_specs)
            
        body = (
            f"SYSTEM_ROLE: Expert React UI Designer.\n"
            f"TASK: Develop a highly interactive, client-side React widget: '{widget}'.\n"
            f"REQUIREMENTS:\n"
            f"1. {spec1}\n"
            f"2. {spec2}\n"
            f"3. Style using premium dark aesthetics and glassmorphic panels.\n"
            f"4. Code must be complete, modular, and performant."
        )
        
        model = random.choice(['Claude 4.8 Opus', 'Claude Fable 5', 'Gemini 3.5 Pro'])
        
        all_prompts.append({
            "id": f"curated-vibe-widgets-{i+1}",
            "user_id": "system",
            "title": f"Interactive {widget.split(' with ')[0].split(' and ')[0]} Component",
            "model": model,
            "category": "Vibe Widgets",
            "body": body
        })

    # 5. Agentic Loops (100 prompts)
    for i in range(100):
        role = random.choice(agent_roles)
        state1 = random.choice(agent_states)
        state2 = random.choice(agent_states)
        while state2 == state1:
            state2 = random.choice(agent_states)
            
        body = (
            f"SYSTEM_ROLE: {role} Orchestration Module.\n"
            f"TASK: Configure a recursive, multi-step execution loop.\n"
            f"CONSTRAINTS:\n"
            f"1. {state1}\n"
            f"2. {state2}\n"
            f"3. Return structured schema response detailing current actions and success rate."
        )
        
        model = random.choice(['GPT-5.5 (Agentic)', 'Claude 4.8 Opus'])
        
        all_prompts.append({
            "id": f"curated-agentic-loops-{i+1}",
            "user_id": "system",
            "title": f"Autonomous {role.replace(' Agent', '').replace(' Expert', '')}",
            "model": model,
            "category": "Agentic Loops",
            "body": body
        })

    # 6. Fullstack Dev (100 prompts)
    for i in range(100):
        feature = random.choice(dev_features)
        practice1 = random.choice(dev_practices)
        practice2 = random.choice(dev_practices)
        while practice2 == practice1:
            practice2 = random.choice(dev_practices)
            
        body = (
            f"SYSTEM_ROLE: Senior Software Architect.\n"
            f"TASK: Write a clean TypeScript implementation for: '{feature}'.\n"
            f"CRITERIA:\n"
            f"1. {practice1}\n"
            f"2. {practice2}\n"
            f"3. Output complete code with proper types, imports, and error handling."
        )
        
        model = random.choice(['Claude 4.8 Opus', 'GPT-5.5 (Agentic)', 'Claude Fable 5'])
        
        all_prompts.append({
            "id": f"curated-fullstack-dev-{i+1}",
            "user_id": "system",
            "title": f"Secure {feature.split(' with ')[0].split(' using ')[0]} Module",
            "model": model,
            "category": "Fullstack Dev",
            "body": body
        })

    # 7. Security Audit (100 prompts)
    for i in range(100):
        target = random.choice(security_targets)
        vuln = random.choice(security_vulns)
        
        body = (
            f"SYSTEM_ROLE: Senior Security Auditor & Pentester.\n"
            f"TASK: Audit the following: '{target}'.\n"
            f"SCOPE:\n"
            f"1. Scan specifically for: {vuln}\n"
            f"2. Trace inputs, identify vulnerability sinks, and propose fix patches.\n"
            f"3. Format audit findings in a clear Markdown table."
        )
        
        model = random.choice(['Claude 4.8 Opus', 'Gemini 3.5 Pro'])
        
        all_prompts.append({
            "id": f"curated-security-audit-{i+1}",
            "user_id": "system",
            "title": f"{target.replace(' files', '').replace(' code', '').title()} Vuln Scanner",
            "model": model,
            "category": "Security Audit",
            "body": body
        })

    return all_prompts

if __name__ == '__main__':
    prompts = generate_all_prompts()
    
    # Save output to workspace
    out_dir = r"src/data"
    os.makedirs(out_dir, exist_ok=True)
    out_file = os.path.join(out_dir, "prompts.json")
    
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(prompts, f, indent=2, ensure_ascii=False)
        
    print(f"Successfully generated {len(prompts)} prompts and saved to {out_file}")
