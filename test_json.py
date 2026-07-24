import re
raw_json = """Here is the JSON:
[
  {
    "date": "2026-06-20",
    "topic": "Math",
    "tasks": ["Study"]
  }
]
Hope it helps!"""
match = re.search(r'\[\s*\{.*\}\s*\]', raw_json, re.DOTALL)
if match:
    print('MATCHED:', match.group(0))
else:
    print('NO MATCH')
