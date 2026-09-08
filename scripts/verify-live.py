#!/usr/bin/env python3
"""
Verify the SEO/AEO/GEO acceptance criteria against a running site.

    python3 scripts/verify-live.py                      # checks https://www.heilc.com
    python3 scripts/verify-live.py http://localhost:3000

Exits 0 if everything passes, 1 otherwise. No dependencies beyond the stdlib.

This is the check that could not be run from the Claude Code session that wrote
it: www.heilc.com is blocked by that environment's egress policy, so every
result there came from a local production build instead.
"""

import html as H
import json
import re
import sys
import urllib.error
import urllib.request

BASE = (sys.argv[1] if len(sys.argv) > 1 else "https://www.heilc.com").rstrip("/")
UA = {"User-Agent": "heilc-verify/1.0 (+acceptance-criteria check)"}

passes, failures = [], []


def record(label, ok, detail=""):
    (passes if ok else failures).append(label)
    print(f"  [{'PASS' if ok else 'FAIL'}] {label}{(' — ' + detail) if detail else ''}")


def fetch(path):
    req = urllib.request.Request(BASE + path, headers=UA)
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.getcode(), r.read().decode("utf-8", "replace")


def status(path):
    try:
        return fetch(path)[0]
    except urllib.error.HTTPError as e:
        return e.code
    except Exception:
        return 0


def visible_text(doc):
    """Strip tags and script/style bodies, collapse whitespace."""
    doc = re.sub(r"<(script|style)\b.*?</\1>", " ", doc, flags=re.S | re.I)
    return re.sub(r"\s+", " ", H.unescape(re.sub(r"<[^>]+>", " ", doc)))


def ld_nodes(doc):
    """Every JSON-LD node on the page, flattened."""
    out = []

    def walk(n):
        if isinstance(n, dict):
            out.append(n)
            for v in n.values():
                walk(v)
        elif isinstance(n, list):
            for v in n:
                walk(v)

    for block in re.findall(
        r'<script type="application/ld\+json"[^>]*>(.*?)</script>', doc, re.S
    ):
        try:
            walk(json.loads(block))
        except json.JSONDecodeError as e:
            record("JSON-LD parses", False, str(e))
    return out


print(f"Verifying {BASE}\n")

try:
    code, home = fetch("/")
except Exception as e:
    print(f"  [FAIL] cannot reach {BASE} — {e}")
    sys.exit(1)

record("homepage returns 200", code == 200, f"got {code}")

# ---------------------------------------------------------------- 1. absolute URLs
print("\n1. Canonical origin (no localhost leak)")
for pat, label in [
    (r'<meta property="og:url" content="([^"]*)"', "og:url"),
    (r'<meta property="og:image" content="([^"]*)"', "og:image"),
    (r'<meta name="twitter:image" content="([^"]*)"', "twitter:image"),
    (r'<link rel="canonical" href="([^"]*)"', "canonical"),
]:
    m = re.search(pat, home)
    val = m.group(1) if m else None
    record(f"{label} is absolute production URL", bool(val) and val.startswith("https://"), val or "MISSING")
record("no 'localhost' anywhere in homepage HTML", "localhost" not in home)

m = re.search(r'<meta name="twitter:card" content="([^"]*)"', home)
record("twitter:card = summary_large_image", bool(m) and m.group(1) == "summary_large_image",
       m.group(1) if m else "MISSING")

# ---------------------------------------------------------------- 2. H1
print("\n2. Heading structure")
h1s = re.findall(r"<h1\b[^>]*>(.*?)</h1>", home, re.S)
record("exactly one <h1>", len(h1s) == 1, f"found {len(h1s)}")
if h1s:
    text = visible_text(h1s[0]).strip()
    record("H1 is a single short statement", 0 < len(text.split()) <= 14, f'"{text}"')

levels = [int(x) for x in re.findall(r"<h([1-6])\b", home.split("<body", 1)[-1])]
skips = [f"h{a}->h{b}" for a, b in zip(levels, levels[1:]) if b > a + 1]
record("no skipped heading levels", not skips, ", ".join(skips))

# ---------------------------------------------------------------- 3. routes
print("\n3. Routes reachable")
routes = [
    "/services", "/services/artificial-intelligence-solutions",
    "/case-studies", "/case-studies/generisk-ai", "/case-studies/cinegenome",
    "/case-studies/resumeai", "/about", "/faq", "/contact", "/insights",
    "/insights/how-rag-pipelines-work-for-enterprise-search",
    "/sitemap.xml", "/robots.txt", "/opengraph-image",
]
for r in routes:
    c = status(r)
    record(f"{r}", c == 200, f"got {c}")

# ---------------------------------------------------------------- 4. FAQ in HTML
print("\n4. FAQ answers in server-rendered HTML (no JS)")
try:
    _, faq = fetch("/faq")
    answers = [
        q["acceptedAnswer"]["text"]
        for n in ld_nodes(faq)
        if n.get("@type") == "FAQPage"
        for q in n.get("mainEntity", [])
    ]
    record("FAQPage schema present with questions", bool(answers), f"{len(answers)} questions")
    for doc, name in ((faq, "/faq"), (home, "/")):
        body = visible_text(doc)
        missing = [a for a in answers if re.sub(r"\s+", " ", a) not in body]
        record(f"{name}: all answers verbatim in HTML",
               bool(answers) and not missing,
               f"{len(answers) - len(missing)}/{len(answers)}")
except Exception as e:
    record("/faq fetch", False, str(e))

# ---------------------------------------------------------------- 5. testimonial
print("\n5. Testimonial attributed or removed")
record("no anonymous 'Forward-Thinking Business' quote", "Forward-Thinking Business" not in home)
record("no unattributed blockquote", "<blockquote" not in home)

# ---------------------------------------------------------------- 6. schema
print("\n6. JSON-LD present and valid")
nodes = ld_nodes(home)
types = {n["@type"] for n in nodes if isinstance(n.get("@type"), str)}
for t in ["Organization", "ProfessionalService", "FAQPage", "Service", "Person", "WebSite"]:
    record(f"{t} present", t in types)

required = {
    "Organization": ["name", "url"],
    "ProfessionalService": ["name", "address"],
    "Service": ["name", "provider"],
    "FAQPage": ["mainEntity"],
    "Person": ["name"],
}
bad = [
    f"{n['@type']} missing {k}"
    for n in nodes
    if isinstance(n.get("@type"), str)
    for k in required.get(n["@type"], [])
    if k not in n
]
record("no missing required schema properties", not bad, "; ".join(bad[:3]))

banned = sorted({k for n in nodes for k in n if k in
                 {"aggregateRating", "reviewCount", "ratingValue"}})
record("no unverifiable rating/review markup", not banned, ", ".join(banned))

org = next((n for n in nodes if n.get("@type") == "Organization"), {})
same_as = org.get("sameAs") or []
record("Organization sameAs links profiles", len(same_as) >= 3, f"{len(same_as)} links")

# ---------------------------------------------------------------- 7. sitemap/robots
print("\n7. Sitemap and robots")
try:
    _, sm = fetch("/sitemap.xml")
    locs = re.findall(r"<loc>([^<]+)</loc>", sm)
    record("sitemap lists all routes", len(locs) >= 20, f"{len(locs)} URLs")
    record("sitemap URLs are absolute production URLs",
           all(u.startswith("https://") for u in locs) and not any("localhost" in u for u in locs))
    _, rb = fetch("/robots.txt")
    record("robots.txt references sitemap", "sitemap.xml" in rb.lower())
    record("robots.txt allows crawling", "Allow: /" in rb)
except Exception as e:
    record("sitemap/robots fetch", False, str(e))

# ---------------------------------------------------------------- summary
print(f"\n{'=' * 60}")
print(f"{len(passes)} passed, {len(failures)} failed")
if failures:
    print("\nFailures:")
    for f in failures:
        print(f"  - {f}")
sys.exit(1 if failures else 0)
