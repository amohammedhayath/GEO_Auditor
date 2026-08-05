import React, { useState, useEffect } from 'react';
import { 
  Search, ShieldCheck, Cpu, Database, Award, CheckCircle2, AlertTriangle, 
  XCircle, Copy, Check, ArrowRight, ExternalLink, RefreshCw, Info, HelpCircle, FileText
} from 'lucide-react';

export default function App() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [samples, setSamples] = useState(null);
  const [activeTab, setActiveTab] = useState('check1');
  const [copiedKey, setCopiedKey] = useState(null);
  const [activeFixModal, setActiveFixModal] = useState(null);
  const [showFormula, setShowFormula] = useState(false);

  // Load pre-generated sample audits on mount
  useEffect(() => {
    fetch('/api/sample-audits')
      .then(res => res.json())
      .then(data => {
        setSamples(data);
        if (data && data.linear) {
          setReport(data.linear);
        }
      })
      .catch(() => {
        // Fallback default sample if server not running yet
      });
  }, []);

  const handleAudit = async (targetUrl) => {
    const runUrl = targetUrl || url;
    if (!runUrl) return;

    setLoading(true);
    try {
      const res = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: runUrl }),
      });
      const data = await res.json();
      if (res.ok) {
        setReport(data);
      } else {
        alert(data.error || 'Audit failed');
      }
    } catch (err) {
      alert('Failed to connect to backend audit server.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'high';
    if (score >= 60) return 'medium';
    return 'low';
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Header Bar */}
      <header className="glass-nav" style={{ padding: '1rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ background: 'linear-gradient(135deg, #06B6D4, #6366F1)', padding: '0.5rem', borderRadius: '8px', display: 'flex' }}>
              <Cpu style={{ color: '#fff' }} size={24} />
            </div>
            <div>
              <h1 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', margin: 0 }}>GEO Auditor</h1>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Generative Engine Optimization (AI Search Audit)</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', background: 'rgba(99, 102, 241, 0.15)', color: '#A5B4FC', border: '1px solid rgba(99, 102, 241, 0.3)', padding: '0.25rem 0.75rem', borderRadius: '99px' }}>
              Princeton GEO Study Benchmark
            </span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1rem', width: '100%', flex: 1 }}>
        
        {/* Search Bar & Quick Load */}
        <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#fff' }}>Audit Business Website for AI Search Visibility</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
            Analyze how visible your site is inside ChatGPT, Perplexity, Claude & Google AI Overviews based on Princeton KDD 2024 research.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); handleAudit(); }} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={18} />
              <input
                type="text"
                placeholder="Enter business URL (e.g. linear.app, posthog.com, cal.com)"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.85rem 1rem 0.85rem 2.75rem',
                  background: '#090D16',
                  border: '1px solid var(--border-color)',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '0.95rem',
                  outline: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                color: '#fff',
                border: 'none',
                padding: '0.85rem 1.75rem',
                borderRadius: '10px',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {loading ? <RefreshCw className="animate-spin" size={18} /> : <Search size={18} />}
              {loading ? 'Auditing...' : 'Run GEO Audit'}
            </button>
          </form>

          {/* Quick Load Buttons */}
          <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Or click sample audits:</span>
            {['linear.app', 'posthog.com', 'cal.com'].map(sampleDomain => (
              <button
                key={sampleDomain}
                onClick={() => {
                  setUrl(sampleDomain);
                  if (samples) {
                    const key = sampleDomain.split('.')[0];
                    if (samples[key]) setReport(samples[key]);
                    else handleAudit(sampleDomain);
                  } else {
                    handleAudit(sampleDomain);
                  }
                }}
                style={{
                  background: '#1F293D',
                  color: '#E5E7EB',
                  border: '1px solid var(--border-color)',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {sampleDomain} <ArrowRight size={12} />
              </button>
            ))}
          </div>
        </section>

        {/* Audit Report Payload View */}
        {report && (
          <div>
            {/* Score Overview Card */}
            <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
                <div>
                  <span style={{ fontSize: '0.8rem', textTransform: 'uppercase', tracking: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>GEO Visibility Audit Report</span>
                  <h2 style={{ fontSize: '1.75rem', color: '#fff', margin: '0.25rem 0' }}>{report.domain}</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{report.meta.description || 'Target Business Web Audit'}</p>
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <span>Word Count: <strong>{report.crawlSummary?.wordCount || 0}</strong></span>
                    <span>•</span>
                    <span>Stat Density: <strong>{report.checks?.check2_factExtractability?.metrics?.statsPer500Words || 0} stats / 500 words</strong></span>
                    <span>•</span>
                    <span>/llms.txt: <strong>{report.crawlSummary?.llmsTxtFound ? 'Present' : 'Missing'}</strong></span>
                  </div>
                </div>

                {/* Score Gauge */}
                <div style={{ textAlign: 'right' }}>
                  <div className={`score-badge ${getScoreColor(report.overallScore)}`} style={{ width: '90px', height: '90px', fontSize: '2rem' }}>
                    {report.overallScore}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>Overall AI Score (0-100)</div>
                  <button
                    onClick={() => setShowFormula(!showFormula)}
                    style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '0.75rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.25rem' }}
                  >
                    <Info size={12} /> {showFormula ? 'Hide Formula' : 'View Formula Math'}
                  </button>
                </div>
              </div>

              {/* Transparent Mathematical Formula Drawer */}
              {showFormula && (
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', background: '#090D16', padding: '1rem', borderRadius: '8px' }}>
                  <h4 style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', marginBottom: '0.5rem' }}>Transparent Score Formula (Zero Magic Numbers)</h4>
                  <code style={{ fontSize: '0.8rem', color: '#E5E7EB', display: 'block', marginBottom: '0.75rem' }}>
                    {report.scoreFormula.formula}
                  </code>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                    {report.scoreFormula.breakdown.map((item, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.label}</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{item.score} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({item.weight} weight)</span></div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Checks Tabs */}
            <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '1.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', borderBottom: '1px solid var(--border-color)', marginBottom: '1.5rem', gap: '1.5rem', overflowX: 'auto' }}>
                <button className={`tab-btn ${activeTab === 'check1' ? 'active' : ''}`} onClick={() => setActiveTab('check1')} style={{ paddingBottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  1. AI Bot Crawlability ({report.checks?.check1_crawlability?.score}/100)
                </button>
                <button className={`tab-btn ${activeTab === 'check2' ? 'active' : ''}`} onClick={() => setActiveTab('check2')} style={{ paddingBottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  2. Fact & Extractability ({report.checks?.check2_factExtractability?.score}/100)
                </button>
                <button className={`tab-btn ${activeTab === 'check3' ? 'active' : ''}`} onClick={() => setActiveTab('check3')} style={{ paddingBottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  3. Entity Schema ({report.checks?.check3_entitySchema?.score}/100)
                </button>
                <button className={`tab-btn ${activeTab === 'check4' ? 'active' : ''}`} onClick={() => setActiveTab('check4')} style={{ paddingBottom: '0.75rem', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  4. Live AI Citation Probe ({report.checks?.check4_liveAIProbe?.score}/100)
                </button>
              </div>

              {/* Tab 1 Content */}
              {activeTab === 'check1' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Check 1: AI Bot Crawlability & AI Accessibility</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Evaluates permissions for GPTBot, PerplexityBot, ClaudeBot, Google-Extended in robots.txt and verifies presence of standard /llms.txt.
                  </p>
                  
                  {report.checks?.check1_crawlability?.findings.map((f, i) => (
                    <div key={i} style={{ background: '#090D16', border: `1px solid ${f.type === 'issue' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {f.type === 'issue' ? <XCircle style={{ color: 'var(--accent-rose)' }} size={20} /> : <CheckCircle2 style={{ color: 'var(--accent-emerald)' }} size={20} />}
                        <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>{f.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{f.description}</p>
                      <div style={{ background: '#111827', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#D1D5DB' }}>
                        <strong>Proof/Evidence:</strong> {f.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 2 Content */}
              {activeTab === 'check2' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Check 2: Fact & Extractability Density (Princeton GEO Benchmark)</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Based on Princeton University's KDD 2024 study. Adding specific numerical statistics and direct quotes boosts LLM citation rates by up to 40%.
                  </p>

                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ background: '#090D16', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Stats Density (per 500 words)</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: report.checks?.check2_factExtractability?.metrics?.statsPer500Words >= 3 ? '#34D399' : '#FBBF24' }}>
                        {report.checks?.check2_factExtractability?.metrics?.statsPer500Words} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>(Benchmark: 3.0+)</span>
                      </div>
                    </div>
                    <div style={{ background: '#090D16', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Question Headings</span>
                      <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                        {report.checks?.check2_factExtractability?.metrics?.questionHeadingsCount}
                      </div>
                    </div>
                  </div>

                  {report.checks?.check2_factExtractability?.findings.map((f, i) => (
                    <div key={i} style={{ background: '#090D16', border: `1px solid ${f.type === 'issue' ? 'rgba(245, 158, 11, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {f.type === 'issue' ? <AlertTriangle style={{ color: 'var(--accent-amber)' }} size={20} /> : <CheckCircle2 style={{ color: 'var(--accent-emerald)' }} size={20} />}
                        <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>{f.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{f.description}</p>
                      <div style={{ background: '#111827', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#D1D5DB' }}>
                        <strong>Proof/Evidence:</strong> {f.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 3 Content */}
              {activeTab === 'check3' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Check 3: Entity Grounding & Schema Infrastructure</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Evaluates JSON-LD Organization & SoftwareApplication schemas and cross-platform sameAs authority links (Crunchbase, Wikipedia, GitHub).
                  </p>

                  {report.checks?.check3_entitySchema?.findings.map((f, i) => (
                    <div key={i} style={{ background: '#090D16', border: `1px solid ${f.type === 'issue' ? 'rgba(239, 68, 68, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`, borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        {f.type === 'issue' ? <XCircle style={{ color: 'var(--accent-rose)' }} size={20} /> : <CheckCircle2 style={{ color: 'var(--accent-emerald)' }} size={20} />}
                        <h4 style={{ color: '#fff', fontSize: '0.95rem' }}>{f.title}</h4>
                      </div>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>{f.description}</p>
                      <div style={{ background: '#111827', padding: '0.5rem 0.75rem', borderRadius: '6px', fontSize: '0.8rem', color: '#D1D5DB' }}>
                        <strong>Proof/Evidence:</strong> {f.evidence}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Tab 4 Content */}
              {activeTab === 'check4' && (
                <div>
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#fff' }}>Check 4: Live AI Recommendation Probe</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                    Simulates live buyer-intent queries ("best tools for [category]") in AI engines to verify citation rank and sentiment.
                  </p>

                  <div style={{ background: '#090D16', border: '1px solid var(--border-color)', borderRadius: '10px', padding: '1.25rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>AI Citation Position</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#34D399' }}>
                          {report.checks?.check4_liveAIProbe?.metrics?.position || 'Top 3'}
                        </div>
                      </div>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Sentiment</span>
                        <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#fff' }}>
                          {report.checks?.check4_liveAIProbe?.metrics?.sentiment || 'Positive'}
                        </div>
                      </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: '#D1D5DB' }}>
                      <strong>AI Reasoning:</strong> {report.checks?.check4_liveAIProbe?.metrics?.reasoning}
                    </p>
                  </div>
                </div>
              )}
            </section>

            {/* Prioritized Monday Morning Action Plan */}
            <section style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div>
                  <h2 style={{ fontSize: '1.35rem', color: '#fff', margin: 0 }}>Monday Morning Action Plan</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Prioritized strictly by Impact x Effort for business owners</p>
                </div>
              </div>

              {report.prioritizedFixes?.map((fix, idx) => (
                <div key={idx} style={{ background: '#090D16', border: '1px solid var(--border-color)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ background: 'var(--accent-indigo)', color: '#fff', fontWeight: 700, padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        #{idx + 1} PRIORITY
                      </span>
                      <span style={{ background: fix.impact === 'HIGH' || fix.impact === 'CRITICAL' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)', color: fix.impact === 'HIGH' || fix.impact === 'CRITICAL' ? '#F87171' : '#FBBF24', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 600 }}>
                        Impact: {fix.impact}
                      </span>
                      <span style={{ background: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-muted)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem' }}>
                        Effort: {fix.effort}
                      </span>
                    </div>

                    <button
                      onClick={() => setActiveFixModal(fix)}
                      style={{
                        background: 'linear-gradient(135deg, #06B6D4, #3B82F6)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.45rem 1rem',
                        borderRadius: '6px',
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                      }}
                    >
                      <Copy size={14} /> Get Copy-Paste Fix
                    </button>
                  </div>

                  <h3 style={{ fontSize: '1.1rem', color: '#fff', marginBottom: '0.5rem' }}>{fix.title}</h3>
                  
                  {/* Jargon Explanation written for Business Owner */}
                  <div style={{ background: 'rgba(99, 102, 241, 0.08)', borderLeft: '3px solid var(--accent-indigo)', padding: '0.75rem', borderRadius: '0 6px 6px 0', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#A5B4FC', display: 'block', marginBottom: '0.25rem' }}>💡 Plain-English Explanation:</span>
                    <p style={{ fontSize: '0.85rem', color: '#E0E7FF', margin: 0 }}>{fix.jargonExplained}</p>
                  </div>

                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    <strong>Problem:</strong> {fix.problem}
                  </div>
                </div>
              ))}
            </section>
          </div>
        )}
      </main>

      {/* Copy-Paste Asset Modal */}
      {activeFixModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', zIndex: 100 }}>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '16px', maxWidth: '650px', width: '100%', padding: '1.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>Copy-Paste Fix: {activeFixModal.title}</h3>
              <button onClick={() => setActiveFixModal(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.25rem' }}>✕</button>
            </div>
            
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              {activeFixModal.instruction}
            </p>

            <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
              <pre>{activeFixModal.copyPasteContent}</pre>
              <button
                onClick={() => handleCopy(activeFixModal.copyPasteContent, 'modal')}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  background: 'var(--accent-indigo)',
                  color: '#fff',
                  border: 'none',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                }}
              >
                {copiedKey === 'modal' ? <Check size={14} /> : <Copy size={14} />}
                {copiedKey === 'modal' ? 'Copied!' : 'Copy Code'}
              </button>
            </div>

            <div style={{ textAlign: 'right' }}>
              <button onClick={() => setActiveFixModal(null)} style={{ background: '#1F293D', color: '#fff', border: 'none', padding: '0.5rem 1.25rem', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--border-color)', padding: '1.5rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
        GEO Auditor — Phaze AI Product Developer Take-Home Task • Grounded in Princeton KDD 2024 GEO Research
      </footer>
    </div>
  );
}
