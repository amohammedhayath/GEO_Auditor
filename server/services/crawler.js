import axios from 'axios';
import * as cheerio from 'cheerio';
import { URL } from 'url';

/**
 * Normalizes user input URL into a valid URL object
 */
export function normalizeUrl(inputUrl) {
  let target = inputUrl.trim();
  if (!target.startsWith('http://') && !target.startsWith('https://')) {
    target = 'https://' + target;
  }
  try {
    const parsed = new URL(target);
    return parsed;
  } catch (err) {
    throw new Error(`Invalid URL format: ${inputUrl}`);
  }
}

/**
 * Scrapes website HTML, robots.txt, and /llms.txt
 */
export async function crawlWebsite(targetUrl) {
  const parsedUrl = normalizeUrl(targetUrl);
  const origin = parsedUrl.origin;
  const href = parsedUrl.href;

  const result = {
    url: href,
    domain: parsedUrl.hostname,
    origin,
    html: '',
    status: 200,
    robotsTxt: {
      found: false,
      raw: '',
      aiBotStatus: {
        GPTBot: { allowed: true, explicitMention: false },
        PerplexityBot: { allowed: true, explicitMention: false },
        ClaudeBot: { allowed: true, explicitMention: false },
        'Google-Extended': { allowed: true, explicitMention: false },
        Bytespider: { allowed: true, explicitMention: false },
      },
    },
    llmsTxt: {
      found: false,
      content: '',
      url: `${origin}/llms.txt`,
    },
    meta: {
      title: '',
      description: '',
      canonical: '',
    },
    headings: {
      h1: [],
      h2: [],
      h3: [],
    },
    jsonLd: [],
    bodyText: '',
    first200Words: '',
    wordCount: 0,
    statsCount: 0,
    citationsCount: 0,
    externalLinks: [],
    sameAsLinks: [],
    error: null,
  };

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache',
  };

  // 1. Fetch robots.txt
  try {
    const robotsRes = await axios.get(`${origin}/robots.txt`, { headers, timeout: 5000, validateStatus: () => true });
    if (robotsRes.status === 200 && typeof robotsRes.data === 'string') {
      result.robotsTxt.found = true;
      result.robotsTxt.raw = robotsRes.data;
      parseRobotsTxt(robotsRes.data, result.robotsTxt.aiBotStatus);
    }
  } catch (e) {
    // Ignore robots fetch errors
  }

  // 2. Fetch /llms.txt
  try {
    const llmsRes = await axios.get(`${origin}/llms.txt`, { headers, timeout: 5000, validateStatus: () => true });
    if (llmsRes.status === 200 && typeof llmsRes.data === 'string' && llmsRes.data.length > 20) {
      result.llmsTxt.found = true;
      result.llmsTxt.content = llmsRes.data.slice(0, 3000);
    }
  } catch (e) {
    // Ignore llms.txt errors
  }

  // 3. Fetch Main Target HTML
  try {
    const htmlRes = await axios.get(href, { headers, timeout: 10000, maxRedirects: 5 });
    result.html = htmlRes.data;
    result.status = htmlRes.status;

    // Parse HTML with cheerio
    const $ = cheerio.load(result.html);

    // Remove script, style, svg, noscript tags from text extraction
    $('script, style, svg, noscript, iframe').each((_, el) => {
      if ($(el).attr('type') !== 'application/ld+json') {
        $(el).remove();
      }
    });

    result.meta.title = $('title').text().trim() || $('meta[property="og:title"]').attr('content') || '';
    result.meta.description = $('meta[name="description"]').attr('content') || $('meta[property="og:description"]').attr('content') || '';
    result.meta.canonical = $('link[rel="canonical"]').attr('href') || '';

    // Headings
    $('h1').each((_, el) => result.headings.h1.push($(el).text().trim()));
    $('h2').each((_, el) => result.headings.h2.push($(el).text().trim()));
    $('h3').each((_, el) => result.headings.h3.push($(el).text().trim()));

    // JSON-LD Schemas
    $('script[type="application/ld+json"]').each((_, el) => {
      try {
        const json = JSON.parse($(el).html());
        result.jsonLd.push(json);
      } catch (e) {
        // Ignore JSON parse error in inline script
      }
    });

    // Extract text content
    const text = $('body').text().replace(/\s+/g, ' ').trim();
    result.bodyText = text;

    const words = text.split(/\s+/).filter(w => w.length > 0);
    result.wordCount = words.length;
    result.first200Words = words.slice(0, 200).join(' ');

    // Extract external links & sameAs platforms (Wikipedia, Crunchbase, Twitter, LinkedIn, GitHub)
    const sameAsDomains = ['wikipedia.org', 'crunchbase.com', 'linkedin.com', 'twitter.com', 'x.com', 'github.com', 'youtube.com'];
    $('a[href]').each((_, el) => {
      const link = $(el).attr('href');
      if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
        result.externalLinks.push(link);
        if (sameAsDomains.some(domain => link.toLowerCase().includes(domain))) {
          result.sameAsLinks.push(link);
        }
      }
    });

  } catch (err) {
    result.error = err.message;
  }

  return result;
}

/**
 * Parses robots.txt rules for AI bots
 */
function parseRobotsTxt(robotsText, aiBotStatus) {
  const lines = robotsText.split('\n');
  let currentAgent = '*';

  for (const line of lines) {
    const cleanLine = line.split('#')[0].trim();
    if (!cleanLine) continue;

    const [key, ...valParts] = cleanLine.split(':');
    const val = valParts.join(':').trim();

    if (key.toLowerCase() === 'user-agent') {
      currentAgent = val;
    } else if (key.toLowerCase() === 'disallow') {
      for (const botName of Object.keys(aiBotStatus)) {
        if (currentAgent.toLowerCase() === botName.toLowerCase() || currentAgent === '*') {
          if (val === '/' || val === '/*') {
            aiBotStatus[botName].allowed = false;
            if (currentAgent.toLowerCase() === botName.toLowerCase()) {
              aiBotStatus[botName].explicitMention = true;
            }
          }
        }
      }
    } else if (key.toLowerCase() === 'allow') {
      for (const botName of Object.keys(aiBotStatus)) {
        if (currentAgent.toLowerCase() === botName.toLowerCase()) {
          aiBotStatus[botName].allowed = true;
          aiBotStatus[botName].explicitMention = true;
        }
      }
    }
  }
}
