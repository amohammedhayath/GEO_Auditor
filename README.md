# GEO Auditor — Generative Engine Optimization Audit Engine

A deep, evidence-backed GEO Audit platform designed for business owners to evaluate and optimize their visibility inside AI search engines (**ChatGPT**, **Perplexity**, **Claude**, and **Google AI Overviews**).

Built for the **Phaze AI — Product Developer Take-Home Task**.

---

## ⚡ Quickstart Guide (Get running in under 3 minutes)

### Prerequisites
- **Node.js**: v18.0.0 or higher installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment (Optional)
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
*(Optionally add your `GEMINI_API_KEY`. If omitted, the audit engine runs standard deterministic rule-based evaluation without crashing.)*

### 3. Start Development Server
Run the full-stack development environment (Frontend on `http://localhost:3000`, Backend on `http://localhost:3001`):

```bash
# Terminal 1: Run Backend API Server
npm run server

# Terminal 2: Run Frontend React UI
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 🔬 The Science & Research Behind The Tool

Most SEO tools test superficial, 10-year-old Google ranking factors (meta title character count, H1 tag count, standard backlinks). **AI Search works on fundamentally different mechanics.**

Our GEO Auditor is directly grounded in the benchmark research paper:  
> **"GEO: Generative Engine Optimization"**  
> *Aggarwal et al. (Princeton University, Georgia Tech, Allen Institute for AI, IIT Delhi — presented at KDD 2024)*

### Key Findings Implemented:
1. **Quantitative Fact & Statistics Addition**: Princeton researchers proved that adding specific numerical statistics boosts LLM citation rates by **up to 40%**.
2. **Authoritative Evidence & Quotes**: LLMs favor content containing verifiable quotes and authoritative domain references over vague marketing fluff.
3. **AI Crawlability & Standard Formats**: AI engines scan `/robots.txt` for specific user-agents (`GPTBot`, `PerplexityBot`, `ClaudeBot`) and rely on open standards like `/llms.txt`.

---

## 🛡️ Defending What We Built vs. What We Cut

Per Phaze AI's rule: *"Go deep, not wide. Three checks done properly beat twelve that tick boxes."*

### What We Chose to Build (The 4 Deep Checks):

1. **Check 1: AI Bot Crawlability & AI Accessibility (Weight: 25%)**
   - *Why it's in:* If `GPTBot` or `PerplexityBot` are disallowed in `robots.txt`, or if your site lacks `/llms.txt`, you are completely invisible to AI search regardless of how good your site is.
2. **Check 2: Fact & Extractability Density — Princeton Benchmark (Weight: 30%)**
   - *Why it's in:* Measures numerical statistics count per 500 words and question-heading hierarchy. This directly correlates with AI citation probability.
3. **Check 3: Entity Grounding & Schema Infrastructure (Weight: 20%)**
   - *Why it's in:* LLMs ground brand entities using JSON-LD (`Organization`, `SoftwareApplication`) and cross-verify authority links (`sameAs` profiles on Crunchbase, Wikipedia, GitHub).
4. **Check 4: Live AI Recommendation & Search Citation Probe (Weight: 25%)**
   - *Why it's in:* Simulates real buyer-intent prompts ("What are the best tools for X?") to give business owners true proof of whether they are cited today.

### What We Cut & Why:

| Feature Cut | Rationale / Defense |
| :--- | :--- |
| **Traditional Meta Tag Character Counts** | AI models read full page context; strict 60-character title limits are irrelevant for LLMs. |
| **PageSpeed / Lighthouse Performance** | Page load speed matters for Google indexing, but has 0 direct bearing on whether an LLM cites extracted knowledge. |
| **Backlink Quantity Counter** | LLMs care about *entity authority verification* (`sameAs` links to Crunchbase/Wikipedia), not 5,000 low-quality SEO directory backlinks. |
| **User Sign-Up & Payment Auth** | Explicitly excluded per task instructions to eliminate friction. |

---

## 💯 Real vs. Mocked Matrix

| Feature | Status | Explanation |
| :--- | :--- | :--- |
| **HTML Scraper & Parser** | **100% REAL** | Uses `cheerio` & `axios` to crawl live web pages, extract DOM nodes, headings, JSON-LD, and text. |
| **Robots.txt AI Bot Auditor** | **100% REAL** | Fetches live `domain.com/robots.txt` and parses rules for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`. |
| **Standard /llms.txt Probe** | **100% REAL** | Probes live server root for `/llms.txt` file presence and content length. |
| **Princeton Stat Density Engine** | **100% REAL** | Regex & NLP text density evaluation measuring stats per 500 words against KDD 2024 benchmarks. |
| **JSON-LD AST Validator** | **100% REAL** | Extracts and parses script blocks for `Organization` & `SoftwareApplication` schemas. |
| **Copy-Paste Fix Generators** | **100% REAL** | Generates valid `/llms.txt` text, `<script type="application/ld+json">` code, and Q&A blocks tailored to the domain. |
| **Live AI Search Citation Probe** | **REAL / HYBRID** | Uses Google Gemini API with Search Grounding if API key provided; falls back gracefully to rule-based citation scoring if key omitted. |

---

## 📊 3 Real Audit Reports Included

Full real audit reports are stored in the `/audits` directory:

1. **Linear** (`audits/linear.json` & pre-loaded in UI) — Overall Score: **84/100**
2. **PostHog** (`audits/posthog.json` & pre-loaded in UI) — Overall Score: **92/100**
3. **Cal.com** (`audits/calcom.json` & pre-loaded in UI) — Overall Score: **76/100**

---

## 🔮 What We'd Build Next With Another Week

1. **Multi-Page Sub-Page Crawler**: Crawl product landing pages and documentation trees (`/docs`, `/pricing`) to generate comprehensive `/llms-full.txt` files.
2. **Competitor Citation Heatmap**: Matrix comparing exact citation positions across ChatGPT, Perplexity, Claude, and Gemini side-by-side.
3. **Automated Pull Request Integration**: GitHub bot that automatically opens a PR to add `/llms.txt` and `JSON-LD` schemas directly into the target company's repo.
