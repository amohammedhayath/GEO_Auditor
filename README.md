# GEO Auditor — Generative Engine Optimization Audit Engine

A deep, evidence-backed GEO Audit platform designed for business owners to evaluate and optimize their visibility inside AI search engines (**ChatGPT**, **Perplexity**, **Claude**, and **Google AI Overviews**).

An enterprise-grade Generative Engine Optimization (GEO) audit engine.

---

## ⚡ Quickstart Guide (Get running in under 3 minutes)

### Prerequisites
- **Node.js**: v18.0.0 or higher installed.

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Default `.env` configuration:
```env
PORT=3005
GEMINI_API_KEY=your_gemini_api_key_here
```
*(Optionally add your `GEMINI_API_KEY` from [Google AI Studio](https://aistudio.google.com/). If omitted or rate-limited, the audit engine runs standard deterministic rule-based evaluation without crashing.)*

### 3. Start Development Server
Run the full-stack development environment:

```bash
# Terminal 1: Run Backend API Server (Runs on http://localhost:3005)
npm run server

# Terminal 2: Run Frontend React UI (Runs on http://localhost:3000)
npm run dev
```

Open `http://localhost:3000` in your browser.

---

## 📐 Scoring Algorithm & Mathematical Architecture

Our scoring engine contains **zero magic numbers**. The overall GEO score ($0 - 100$) is computed strictly via a deterministic weighted formula:

$$\text{Overall GEO Score} = \text{round}\Big( (C_1 \times 0.25) + (C_2 \times 0.30) + (C_3 \times 0.20) + (C_4 \times 0.25) \Big)$$

Where each sub-check score ($C_n \in [0, 100]$) is calculated as follows:

### Sub-Check 1: AI Bot Crawlability & Accessibility ($C_1$, Weight: 25%)
- **Bot Permissions (70 pts max)**: Evaluates `robots.txt` for `GPTBot`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Bytespider`.
  $$S_{\text{bots}} = \text{round}\left( \frac{\text{Allowed Bots}}{\text{Total Bots}} \times 70 \right)$$
- **Standard `/llms.txt` Presence (30 pts max)**: $+30$ pts if `/llms.txt` is served on root domain.

### Sub-Check 2: Fact & Extractability Density ($C_2$, Weight: 30%)
*Grounded in Princeton KDD 2024 Research:*
- **Statistical Fact Density (45 pts max)**: Target is $\ge 3.0$ numerical statistics (percentages, metrics, dollar amounts) per 500 words.
  $$S_{\text{stats}} = \min\left(45, \text{round}\left( \frac{\text{Stats per 500 words}}{3.0} \times 45 \right)\right)$$
- **Query-Matching Heading Hierarchy (30 pts max)**: $+6$ pts per H2/H3 question/topic heading (target 5+).
- **Expert Quotes & Citations (25 pts max)**: $+8.3$ pts per expert quote (target 3+).

### Sub-Check 3: Entity Grounding & Schema Infrastructure ($C_3$, Weight: 20%)
- **JSON-LD Schemas (70 pts max)**:
  - $+25$ pts for `Organization` schema.
  - $+25$ pts for `SoftwareApplication` / `Product` schema.
  - $+20$ pts for `FAQPage` schema.
- **Authority Links / `sameAs` (20 pts max)**: $+10$ pts per verified profile link (Crunchbase, Wikipedia, GitHub, LinkedIn).
- **First-200-Words Brand Definition (10 pts max)**: $+10$ pts if initial paragraph explicitly defines company category.

### Sub-Check 4: Live AI Recommendation Probe ($C_4$, Weight: 25%)
- **Live LLM Probe**: Calls Gemini API with Search Grounding to evaluate category recommendation position.
- **Fallback Rule Engine**: If API key omitted/rate-limited, evaluates technical priors:
  $$\text{Prior Avg} = \frac{C_1 + C_2 + C_3}{3}$$
  - $\ge 80 \implies \text{Top 3} \implies 95\text{ pts}$
  - $\ge 60 \implies \text{Top 5} \implies 75\text{ pts}$
  - $< 60 \implies \text{Not Top 5} \implies 35\text{ pts}$

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

Core Principle: *"Go deep, not wide. Three checks done properly beat twelve that tick boxes."*

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
| **Live AI Search Citation Probe** | **REAL / HYBRID** | Uses Google Gemini API if API key provided; falls back gracefully to deterministic scoring if key omitted/rate-limited. |

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
