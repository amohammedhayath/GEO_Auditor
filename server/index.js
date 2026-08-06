import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { crawlWebsite } from './services/crawler.js';
import { analyzeGEO } from './services/geoAnalyzer.js';
import { generateFixesAndPriorities } from './services/fixGenerator.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3005;

app.use(cors());
app.use(express.json());

// In-memory cache for live runs
const auditCache = new Map();

/**
 * POST /api/audit
 * Runs a complete deep GEO audit for any target business URL
 */
app.post('/api/audit', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Please provide a valid website URL.' });
    }

    const cacheKey = url.toLowerCase().trim();
    if (auditCache.has(cacheKey)) {
      return res.json(auditCache.get(cacheKey));
    }

    console.log(`[GEO Audit] Starting audit for: ${url}`);
    
    // Step 1: Crawl & Scrape
    const crawlData = await crawlWebsite(url);
    if (crawlData.error && !crawlData.html) {
      return res.status(400).json({ error: `Failed to crawl target site: ${crawlData.error}` });
    }

    // Step 2: Analyze 4 Deep GEO Checks
    const geoResults = await analyzeGEO(crawlData);

    // Step 3: Generate Copy-Paste Fixes & Impact x Effort Prioritized List
    const fixData = generateFixesAndPriorities(crawlData, geoResults);

    const fullReport = {
      timestamp: new Date().toISOString(),
      url: crawlData.url,
      domain: crawlData.domain,
      meta: crawlData.meta,
      overallScore: geoResults.overallScore,
      scoreFormula: geoResults.scoreFormula,
      checks: geoResults.checks,
      copyPasteAssets: fixData.copyPasteAssets,
      prioritizedFixes: fixData.prioritizedFixes,
      crawlSummary: {
        wordCount: crawlData.wordCount,
        statsCount: geoResults.checks.check2_factExtractability.metrics.statsCount,
        robotsTxtFound: crawlData.robotsTxt.found,
        llmsTxtFound: crawlData.llmsTxt.found,
        schemasFound: geoResults.checks.check3_entitySchema.metrics.schemasFound,
      },
    };

    auditCache.set(cacheKey, fullReport);
    return res.json(fullReport);

  } catch (err) {
    console.error('[GEO Audit Error]', err);
    return res.status(500).json({ error: `Internal Audit Error: ${err.message}` });
  }
});

/**
 * GET /api/sample-audits
 * Serves pre-calculated audit reports for 3 real-world businesses (Linear, PostHog, Cal.com)
 */
app.get('/api/sample-audits', (req, res) => {
  try {
    const auditsDir = path.join(__dirname, '../audits');
    const samples = {};

    const files = ['linear.json', 'posthog.json', 'calcom.json'];
    files.forEach(file => {
      const filePath = path.join(auditsDir, file);
      if (fs.existsSync(filePath)) {
        const key = file.replace('.json', '');
        samples[key] = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      }
    });

    return res.json(samples);
  } catch (err) {
    return res.status(500).json({ error: 'Failed to load sample audits.' });
  }
});

// Serve static client build files in production (Render / Railway / Heroku)
const clientDistPath = path.join(__dirname, '../client/dist');
const rootDistPath = path.join(__dirname, '../dist');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else if (fs.existsSync(rootDistPath)) {
  app.use(express.static(rootDistPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(rootDistPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 GEO Auditor Server running on http://localhost:${PORT}`);
});
