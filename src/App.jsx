import { useState } from 'react'

const INDUSTRIES = {
  'All Industries': { openRate: 21.33, ctr: 2.62, ctor: 12.28, unsubRate: 0.26, bounceRate: 0.40 },
  'Advertising & Marketing': { openRate: 20.50, ctr: 2.40, ctor: 11.70, unsubRate: 0.30, bounceRate: 0.45 },
  'Agriculture & Food': { openRate: 23.31, ctr: 2.94, ctor: 12.61, unsubRate: 0.28, bounceRate: 0.37 },
  'Architecture & Construction': { openRate: 22.51, ctr: 2.51, ctor: 11.15, unsubRate: 0.32, bounceRate: 0.48 },
  'Arts & Entertainment': { openRate: 21.47, ctr: 2.43, ctor: 11.32, unsubRate: 0.29, bounceRate: 0.39 },
  'Beauty & Personal Care': { openRate: 18.48, ctr: 1.96, ctor: 10.60, unsubRate: 0.31, bounceRate: 0.42 },
  'Business & Finance': { openRate: 21.56, ctr: 2.72, ctor: 12.62, unsubRate: 0.20, bounceRate: 0.43 },
  'Consulting': { openRate: 20.13, ctr: 2.49, ctor: 12.37, unsubRate: 0.27, bounceRate: 0.50 },
  'E-Commerce': { openRate: 15.68, ctr: 2.01, ctor: 12.82, unsubRate: 0.27, bounceRate: 0.31 },
  'Education': { openRate: 28.50, ctr: 4.30, ctor: 15.09, unsubRate: 0.21, bounceRate: 0.51 },
  'Health & Fitness': { openRate: 21.48, ctr: 2.69, ctor: 12.52, unsubRate: 0.40, bounceRate: 0.43 },
  'Legal': { openRate: 22.00, ctr: 2.81, ctor: 12.77, unsubRate: 0.22, bounceRate: 0.48 },
  'Manufacturing': { openRate: 19.82, ctr: 2.18, ctor: 10.99, unsubRate: 0.31, bounceRate: 0.72 },
  'Media & Publishing': { openRate: 22.15, ctr: 4.62, ctor: 20.86, unsubRate: 0.12, bounceRate: 0.27 },
  'Nonprofit': { openRate: 26.60, ctr: 2.77, ctor: 10.41, unsubRate: 0.17, bounceRate: 0.40 },
  'Real Estate': { openRate: 19.17, ctr: 1.77, ctor: 9.23, unsubRate: 0.27, bounceRate: 0.38 },
  'Restaurants & Food': { openRate: 18.50, ctr: 2.03, ctor: 10.97, unsubRate: 0.37, bounceRate: 0.32 },
  'Retail': { openRate: 17.10, ctr: 2.24, ctor: 13.10, unsubRate: 0.25, bounceRate: 0.34 },
  'SaaS / Software': { openRate: 21.29, ctr: 2.45, ctor: 11.51, unsubRate: 0.23, bounceRate: 0.65 },
  'Travel & Hospitality': { openRate: 20.44, ctr: 2.25, ctor: 11.01, unsubRate: 0.24, bounceRate: 0.38 },
}

function getStatus(value, benchmark, metric) {
  const inverse = ['unsubRate', 'bounceRate']
  if (inverse.includes(metric)) {
    if (value <= benchmark * 0.7) return 'excellent'
    if (value <= benchmark) return 'good'
    if (value <= benchmark * 1.5) return 'below'
    return 'poor'
  }
  if (value >= benchmark * 1.3) return 'excellent'
  if (value >= benchmark * 0.9) return 'good'
  if (value >= benchmark * 0.6) return 'below'
  return 'poor'
}

function getStatusColor(status) {
  return status === 'excellent' ? 'text-turtle' : status === 'good' ? 'text-azure' : status === 'below' ? 'text-tangerine' : 'text-coral'
}

function getStatusBg(status) {
  return status === 'excellent' ? 'bg-turtle/10 border-turtle/20' : status === 'good' ? 'bg-azure/10 border-azure/20' : status === 'below' ? 'bg-tangerine/10 border-tangerine/20' : 'bg-coral/10 border-coral/20'
}

function getStatusLabel(status) {
  return status === 'excellent' ? 'Excellent' : status === 'good' ? 'Good' : status === 'below' ? 'Below Average' : 'Needs Attention'
}

function getRecommendation(metric, status) {
  const recs = {
    openRate: {
      excellent: 'Your open rate is outstanding. Keep refining subject lines and maintain sender reputation.',
      good: 'Solid open rate. A/B test subject lines and send times to push higher.',
      below: 'Try more compelling subject lines, segment your audience, or clean your list of inactive subscribers.',
      poor: 'Major issue. Clean your email list, check sender reputation, verify SPF/DKIM/DMARC, and audit subject lines for spam triggers.',
    },
    ctr: {
      excellent: 'Excellent click engagement. Your content and CTAs are resonating well.',
      good: 'Good CTR. Try more prominent CTAs, better button design, or more relevant content.',
      below: 'Improve CTA visibility, use buttons instead of text links, and ensure content matches the subject line promise.',
      poor: 'Low CTR suggests content isn\'t matching expectations. Redesign emails with a single clear CTA and more engaging content.',
    },
    ctor: {
      excellent: 'People who open your emails love the content. Keep it up!',
      good: 'Decent engagement from openers. Test different layouts and CTA placements.',
      below: 'Openers aren\'t clicking. Content may not match the subject line promise. Review your email layout and CTA clarity.',
      poor: 'Serious disconnect between subject line promise and email content. Audit your email design and messaging.',
    },
    unsubRate: {
      excellent: 'Very low unsubscribe rate. Your audience values your emails.',
      good: 'Normal unsubscribe rate. This is healthy for list hygiene.',
      below: 'Higher than average. Review email frequency and content relevance. Consider preference center.',
      poor: 'High unsubscribe rate signals content or frequency problems. Survey subscribers, reduce frequency, and improve targeting.',
    },
    bounceRate: {
      excellent: 'Clean list with very few bounces. Great list hygiene.',
      good: 'Normal bounce rate. Keep cleaning your list regularly.',
      below: 'Remove invalid addresses and implement double opt-in for new subscribers.',
      poor: 'High bounces damage sender reputation. Immediately clean your list and verify all email addresses.',
    },
  }
  return recs[metric]?.[status] || ''
}

export default function App() {
  const [industry, setIndustry] = useState('All Industries')
  const [metrics, setMetrics] = useState({
    openRate: '',
    ctr: '',
    ctor: '',
    unsubRate: '',
    bounceRate: '',
    listSize: '',
    emailsSent: '',
  })

  const update = (key, value) => setMetrics(prev => ({ ...prev, [key]: value }))

  const fillTestData = () => {
    setIndustry('E-Commerce')
    setMetrics({
      openRate: '22.0',
      ctr: '2.8',
      ctor: '',
      unsubRate: '0.18',
      bounceRate: '0.35',
      listSize: '10000',
      emailsSent: '9800',
    })
  }

  const benchmark = INDUSTRIES[industry]

  const hasInput = Object.values(metrics).some(v => v !== '')

  const computedCTOR = metrics.openRate && metrics.ctr
    ? ((parseFloat(metrics.ctr) / parseFloat(metrics.openRate)) * 100).toFixed(2)
    : ''

  const metricConfigs = [
    { key: 'openRate', label: 'Open Rate', unit: '%', benchKey: 'openRate', desc: 'Percentage of delivered emails that were opened', formula: '(Opens / Delivered) × 100' },
    { key: 'ctr', label: 'Click-Through Rate (CTR)', unit: '%', benchKey: 'ctr', desc: 'Percentage of delivered emails with at least one click', formula: '(Clicks / Delivered) × 100' },
    { key: 'ctor', label: 'Click-to-Open Rate (CTOR)', unit: '%', benchKey: 'ctor', desc: 'Percentage of openers who clicked', formula: '(Clicks / Opens) × 100', computed: computedCTOR },
    { key: 'unsubRate', label: 'Unsubscribe Rate', unit: '%', benchKey: 'unsubRate', desc: 'Percentage who unsubscribed', formula: '(Unsubscribes / Delivered) × 100' },
    { key: 'bounceRate', label: 'Bounce Rate', unit: '%', benchKey: 'bounceRate', desc: 'Percentage of emails that bounced', formula: '(Bounces / Sent) × 100' },
  ]

  return (
    <div className="min-h-screen bg-abyss bg-glow bg-grid">
      <div className="max-w-4xl mx-auto px-4 py-12 animate-fadeIn">
        <nav className="mb-8 text-sm text-galactic">
          <a href="https://seo-tools-tau.vercel.app/" className="text-azure hover:text-white transition-colors">Free Tools</a>
          <span className="mx-2 text-metal">/</span>
          <a href="https://seo-tools-tau.vercel.app/email-marketing/" className="text-azure hover:text-white transition-colors">Email Marketing</a>
          <span className="mx-2 text-metal">/</span>
          <span className="text-cloudy">Email Metrics Calculator</span>
        </nav>

        <div className="text-center mb-10">
          <div className="inline-flex items-center px-4 py-2 border border-turtle text-turtle rounded-full text-sm font-medium mb-6">Free Tool</div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Email Metrics Calculator</h1>
          <p className="text-cloudy text-lg max-w-2xl mx-auto">Enter your email campaign metrics and benchmark them against {Object.keys(INDUSTRIES).length} industry averages — with actionable recommendations.</p>
        </div>

        <div className="flex justify-end mb-4">
          <button
            type="button"
            onClick={fillTestData}
            className="px-3 py-1.5 text-xs font-mono bg-prince/20 text-prince border border-prince/30 rounded hover:bg-prince/30 transition-colors focus:outline-none focus:ring-2 focus:ring-prince focus:ring-offset-2 focus:ring-offset-abyss"
          >
            Fill Test Data
          </button>
        </div>

        {/* Industry Selector */}
        <div className="card-gradient border border-metal/20 rounded-2xl p-5 mb-6">
          <label className="text-sm font-medium text-cloudy block mb-2">Select Your Industry</label>
          <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full bg-midnight border border-metal/30 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-azure transition-colors">
            {Object.keys(INDUSTRIES).map(ind => <option key={ind} value={ind}>{ind}</option>)}
          </select>
        </div>

        {/* Metrics Input */}
        <div className="card-gradient border border-metal/20 rounded-2xl p-5 mb-6">
          <h2 className="text-lg font-semibold text-white mb-4">Your Campaign Metrics</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              ['openRate', 'Open Rate (%)', '21.3'],
              ['ctr', 'CTR (%)', '2.6'],
              ['unsubRate', 'Unsubscribe Rate (%)', '0.25'],
              ['bounceRate', 'Bounce Rate (%)', '0.4'],
              ['listSize', 'List Size', '5000'],
              ['emailsSent', 'Emails Sent', '4800'],
            ].map(([key, label, placeholder]) => (
              <div key={key}>
                <label className="text-xs text-galactic block mb-1">{label}</label>
                <input type="number" step="any" value={metrics[key]} onChange={(e) => update(key, e.target.value)} placeholder={placeholder} className="w-full bg-midnight border border-metal/30 rounded-lg px-3 py-2.5 text-white placeholder-galactic focus:outline-none focus:border-azure transition-colors" />
              </div>
            ))}
          </div>
          {computedCTOR && (
            <p className="text-sm text-galactic mt-3">Calculated CTOR: <span className="text-azure font-medium">{computedCTOR}%</span> (CTR ÷ Open Rate × 100)</p>
          )}
        </div>

        {/* Benchmark Results */}
        {hasInput && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-white">Benchmark Results — {industry}</h2>
            {metricConfigs.map(({ key, label, unit, benchKey, desc, formula, computed }) => {
              const userVal = key === 'ctor' && computed ? parseFloat(computed) : parseFloat(metrics[key])
              if (isNaN(userVal)) return null
              const benchVal = benchmark[benchKey]
              const status = getStatus(userVal, benchVal, benchKey)
              const diff = userVal - benchVal
              const diffSign = diff >= 0 ? '+' : ''
              const inverse = ['unsubRate', 'bounceRate'].includes(benchKey)

              return (
                <div key={key} className="card-gradient border border-metal/20 rounded-2xl p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div>
                      <h3 className="font-semibold text-white">{label}</h3>
                      <p className="text-xs text-galactic">{desc}</p>
                    </div>
                    <span className={`text-xs px-3 py-1 rounded-full border font-medium ${getStatusBg(status)} ${getStatusColor(status)}`}>{getStatusLabel(status)}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="bg-midnight/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-galactic mb-1">Your Value</p>
                      <p className="text-xl font-bold text-white">{userVal}{unit}</p>
                    </div>
                    <div className="bg-midnight/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-galactic mb-1">Industry Avg</p>
                      <p className="text-xl font-bold text-cloudy">{benchVal}{unit}</p>
                    </div>
                    <div className="bg-midnight/50 rounded-lg p-3 text-center">
                      <p className="text-xs text-galactic mb-1">Difference</p>
                      <p className={`text-xl font-bold ${(inverse ? diff <= 0 : diff >= 0) ? 'text-turtle' : 'text-coral'}`}>{diffSign}{diff.toFixed(2)}{unit}</p>
                    </div>
                  </div>

                  {/* Visual bar */}
                  <div className="relative mb-3">
                    <div className="h-3 bg-metal/20 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${getStatusColor(status).replace('text-', 'bg-')}`} style={{ width: `${Math.min(100, inverse ? Math.max(5, (1 - userVal / (benchVal * 3)) * 100) : (userVal / (benchVal * 2)) * 100)}%` }} />
                    </div>
                    <div className="absolute top-0 h-3 w-0.5 bg-white/50 rounded" style={{ left: `${Math.min(95, inverse ? (1 - benchVal / (benchVal * 3)) * 100 : (benchVal / (benchVal * 2)) * 100)}%` }} title="Industry average" />
                  </div>
                  <p className="text-xs text-galactic mb-3">Formula: {formula}</p>

                  <div className="p-3 rounded-lg bg-midnight/30 border border-metal/10">
                    <p className="text-sm text-cloudy">{getRecommendation(benchKey, status)}</p>
                  </div>
                </div>
              )
            })}

            {/* Revenue impact */}
            {metrics.listSize && metrics.openRate && metrics.ctr && (
              <div className="card-gradient border border-metal/20 rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-3">Potential Impact</h3>
                <div className="grid sm:grid-cols-3 gap-4 text-sm">
                  <div className="bg-midnight/50 rounded-lg p-3">
                    <p className="text-xs text-galactic mb-1">Est. Opens per Send</p>
                    <p className="text-lg font-bold text-azure">{Math.round(parseFloat(metrics.listSize) * (parseFloat(metrics.openRate) / 100)).toLocaleString()}</p>
                  </div>
                  <div className="bg-midnight/50 rounded-lg p-3">
                    <p className="text-xs text-galactic mb-1">Est. Clicks per Send</p>
                    <p className="text-lg font-bold text-turtle">{Math.round(parseFloat(metrics.listSize) * (parseFloat(metrics.ctr) / 100)).toLocaleString()}</p>
                  </div>
                  <div className="bg-midnight/50 rounded-lg p-3">
                    <p className="text-xs text-galactic mb-1">If CTR improves by 0.5%</p>
                    <p className="text-lg font-bold text-prince">+{Math.round(parseFloat(metrics.listSize) * 0.005).toLocaleString()} clicks</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!hasInput && (
          <div className="card-gradient border border-metal/20 rounded-2xl p-12 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12 text-galactic mx-auto mb-4"><path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" /></svg>
            <p className="text-galactic text-lg">Enter your campaign metrics above to see benchmarks</p>
            <p className="text-metal text-sm mt-2">Select your industry for the most relevant comparisons</p>
          </div>
        )}
      </div>

      <footer className="border-t border-metal/30 mt-16">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-sm text-galactic">
          Free marketing tools by <a href="https://www.dreamhost.com" target="_blank" rel="noopener" className="text-azure hover:text-white transition-colors">DreamHost</a>
        </div>
      </footer>
    </div>
  )
}
