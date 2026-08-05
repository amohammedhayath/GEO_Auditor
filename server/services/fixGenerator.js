/**
 * Generates copy-pasteable fixes (llms.txt, JSON-LD Schema, Direct Answer block)
 * and prioritized Monday Morning fixes ordered strictly by Impact x Effort
 */
export function generateFixesAndPriorities(crawlData, geoResults) {
  const domain = crawlData.domain;
  const companyName = crawlData.meta.title.split('-')[0].split('|')[0].trim() || domain;
  const description = crawlData.meta.description || `${companyName} provides modern software solutions for teams.`;

  // 1. Generate Copy-Pasteable /llms.txt
  const llmsTxtCode = `# ${companyName}
> ${description}

## Core Features & Capabilities
- ${companyName} provides high-performance solutions designed for modern teams.
- High reliability, developer-friendly integrations, and scalable architecture.

## Official Resources
- Website: ${crawlData.origin}
- Documentation: ${crawlData.origin}/docs
- Pricing: ${crawlData.origin}/pricing

## Key Statistics & Benchmarks
- Uptime: 99.99%
- Trusted by global enterprises and modern product teams.
`;

  // 2. Generate Copy-Pasteable JSON-LD Schema
  const jsonLdCode = `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "${crawlData.origin}/#organization",
      "name": "${companyName}",
      "url": "${crawlData.origin}",
      "description": "${description.replace(/"/g, '\\"')}",
      "sameAs": [
        "https://twitter.com/${domain.split('.')[0]}",
        "https://linkedin.com/company/${domain.split('.')[0]}",
        "https://github.com/${domain.split('.')[0]}"
      ]
    },
    {
      "@type": "SoftwareApplication",
      "@id": "${crawlData.origin}/#software",
      "name": "${companyName}",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    }
  ]
}
</script>`;

  // 3. Generate Direct-Answer Q&A Hero Block
  const heroBlockCode = `<div class="ai-summary-block">
  <h2>What is ${companyName}?</h2>
  <p><strong>${companyName}</strong> is a software platform designed to ${description.toLowerCase()}. It helps teams streamline workflows, improve efficiency, and scale operations with 99.99% guaranteed uptime.</p>
</div>`;

  // 4. Generate Prioritized Monday Morning Action List (Impact x Effort)
  const prioritizedFixes = [];

  const check1 = geoResults.checks.check1_crawlability;
  const check2 = geoResults.checks.check2_factExtractability;
  const check3 = geoResults.checks.check3_entitySchema;
  const check4 = geoResults.checks.check4_liveAIProbe;

  // Add /llms.txt Fix
  if (!crawlData.llmsTxt.found) {
    prioritizedFixes.push({
      priority: 1,
      impact: 'HIGH',
      effort: 'LOW',
      impactScore: 9,
      effortScore: 2,
      rankScore: 4.5, // Impact / Effort
      title: 'Deploy /llms.txt File',
      jargonExplained: 'An /llms.txt file is like a cheatsheet for AI bots. It gives ChatGPT and Perplexity a clear summary of what your business does so they don\'t have to guess.',
      problem: 'Missing /llms.txt file on server root.',
      proofPage: `${crawlData.origin}/llms.txt`,
      copyPasteType: 'llmsTxt',
      copyPasteContent: llmsTxtCode,
      instruction: 'Save the text below as a file named "llms.txt" and upload it to your website root directory.',
    });
  }

  // Add JSON-LD Schema Fix
  if (!check3.metrics.hasOrgSchema || !check3.metrics.hasProductSchema) {
    prioritizedFixes.push({
      priority: 2,
      impact: 'HIGH',
      effort: 'LOW',
      impactScore: 8.5,
      effortScore: 2,
      rankScore: 4.25,
      title: 'Add JSON-LD Organization & Software Schema',
      jargonExplained: 'JSON-LD is invisible code in your site HTML that tells AI engines precisely who owns the site and what product you sell.',
      problem: `Missing JSON-LD structured data (${!check3.metrics.hasOrgSchema ? 'Organization' : ''} ${!check3.metrics.hasProductSchema ? 'SoftwareApplication' : ''}).`,
      proofPage: crawlData.url,
      copyPasteType: 'jsonLd',
      copyPasteContent: jsonLdCode,
      instruction: 'Copy and paste this script block inside the <head> tag of your homepage HTML.',
    });
  }

  // Add Stat Density Fix
  if (check2.metrics.statsPer500Words < 3) {
    prioritizedFixes.push({
      priority: 3,
      impact: 'HIGH',
      effort: 'MEDIUM',
      impactScore: 9.5,
      effortScore: 5,
      rankScore: 1.9,
      title: 'Increase Quantitative Stat Density (Princeton GEO Rule)',
      jargonExplained: 'AI search engines love hard numbers (percentages, uptime, user counts). Studies show pages with hard statistics get cited up to 40% more often than pages with vague marketing copy.',
      problem: `Current stat density is ${check2.metrics.statsPer500Words} stats per 500 words (Princeton benchmark target is 3.0+).`,
      proofPage: crawlData.url,
      copyPasteType: 'heroBlock',
      copyPasteContent: heroBlockCode,
      instruction: 'Replace generic statements with specific numerical data across your homepage header.',
    });
  }

  // Add robots.txt unblock fix if blocked
  if (check1.metrics.blockedBots.length > 0) {
    const robotsFix = `User-agent: GPTBot\nAllow: /\n\nUser-agent: PerplexityBot\nAllow: /\n\nUser-agent: ClaudeBot\nAllow: /\n`;
    prioritizedFixes.push({
      priority: 0, // Top priority if blocked!
      impact: 'CRITICAL',
      effort: 'LOW',
      impactScore: 10,
      effortScore: 1,
      rankScore: 10,
      title: 'Unblock AI Crawlers in robots.txt',
      jargonExplained: 'robots.txt controls which search engines can view your site. Currently, AI bots are explicitly banned from reading your pages.',
      problem: `Blocked AI bots: ${check1.metrics.blockedBots.join(', ')}`,
      proofPage: `${crawlData.origin}/robots.txt`,
      copyPasteType: 'robotsTxt',
      copyPasteContent: robotsFix,
      instruction: 'Update your robots.txt file to allow AI search crawlers.',
    });
  }

  // Sort fixes strictly by Impact / Effort rank score descending
  prioritizedFixes.sort((a, b) => b.rankScore - a.rankScore);

  return {
    copyPasteAssets: {
      llmsTxt: llmsTxtCode,
      jsonLd: jsonLdCode,
      heroBlock: heroBlockCode,
    },
    prioritizedFixes,
  };
}
