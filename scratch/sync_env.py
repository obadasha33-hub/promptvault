import os
import subprocess
import sys

env_file = r"C:\Users\LENOVO\Desktop\pompt vault\vibeprompt-hub\.env.local"

if not os.path.exists(env_file):
    print("Env file not found!")
    sys.exit(1)

with open(env_file, "r", encoding="utf-8") as f:
    lines = f.readlines()

for line in lines:
    line = line.strip()
    if not line or line.startswith("#") or "=" not in line:
        continue
    name, val = line.split("=", 1)
    name = name.strip()
    val = val.strip()
    if not name or not val:
        continue
    
    if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
        val = val[1:-1]
        
    for env in ["production", "preview", "development"]:
        print(f"Adding {name} to {env}...")
        p = subprocess.Popen(
            ["vercel", "env", "add", name, env, "--scope", "obadasha33-hubs-projects", "--yes"],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            shell=True
        )
        stdout, stderr = p.communicate(input=val)
        print("STDOUT:", stdout)
        print("STDERR:", stderr)
        if p.returncode != 0:
            print(f"Warning: return code {p.returncode} for {name} to {env}")
