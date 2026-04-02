import React, { useState } from 'react';
import UploadSection from './components/UploadSection';
import ResultsCard from './components/ResultsCard';
import AppealLetter from './components/AppealLetter';

function App() {
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState('');
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('claimsense_history');
    return saved ? JSON.parse(saved) : [];
  });

  const handleAnalyze = async (formData) => {
    setIsLoading(true);
    setAnalysisResult(null);
    setError(null);
    setLoadingStep('📄 Reading your rejection letter...');

    try {
      setTimeout(() => setLoadingStep('⚖️ Checking IRDAI precedents...'), 1500);

      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const response = await fetch(`${apiUrl}/analyze`, {
        method: 'POST',
        body: formData,
      });

      setTimeout(() => setLoadingStep('✍️ Drafting your AI appeal...'), 3500);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || 'Failed to analyze the document.');
      }

      const data = await response.json();
      setAnalysisResult(data);
      
      // Update history
      const newHistory = [data, ...history.filter(h => h.rejection_reason !== data.rejection_reason)].slice(0, 3);
      setHistory(newHistory);
      localStorage.setItem('claimsense_history', JSON.stringify(newHistory));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
      setLoadingStep('');
    }
  };

  const handleReset = () => {
    setAnalysisResult(null);
    setError(null);
    setIsLoading(false);
  };

  const scrollToSection = (id) => {
    if (analysisResult || isLoading) {
      handleReset();
      setTimeout(() => {
        if (id === 'top') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      if (id === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(id);
        element?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <div className="min-h-screen bg-arctic-bg font-sans text-text-muted flex flex-col">
      {/* Dark Hero Container */}
      <div className="bg-navy-deep relative overflow-hidden">
        {/* Giant Watermark Text */}
        <div className="absolute -right-20 top-1/2 -translate-y-1/2 text-[400px] font-display font-extrabold text-white/[0.03] select-none pointer-events-none leading-none z-0">
          CS
        </div>

        {/* Navbar */}
        <header className="relative z-50">
          <div className="max-w-7xl mx-auto px-6 h-28 flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => scrollToSection('top')}>
              <div className="w-10 h-10 rounded-lg border border-neon-orange/20 flex items-center justify-center text-neon-orange font-display font-bold text-2xl">C</div>
              <h1 className="text-3xl font-display font-light text-white tracking-tight">
                Claim<span className="font-bold text-neon-orange">Sense</span>
              </h1>
            </div>
            <nav className="hidden md:flex items-center gap-10">
              <button
                onClick={() => scrollToSection('about')}
                className="text-white/80 font-medium hover:text-white transition-colors"
              >
                About
              </button>
              <button
                onClick={() => scrollToSection('how')}
                className="text-white/80 font-medium hover:text-white transition-colors"
              >
                How it Works
              </button>

              <button
                className="bg-neon-orange hover:bg-neon-orange-dark text-white font-bold py-3 px-8 rounded-full shadow-[0_0_15px_rgba(255,94,0,0.5)] hover:shadow-[0_0_25px_rgba(255,94,0,0.7)] transition-all duration-300"
                onClick={() => scrollToSection('top')}
              >
                Upload Letter
              </button>
            </nav>
          </div>
        </header>

        <main className="flex-grow flex flex-col relative z-10">
          {!analysisResult && !isLoading && (
            <>
              {/* Hero Section */}
              <section className="pt-24 pb-48 px-6 relative z-10 text-left max-w-7xl mx-auto w-full space-y-8">
                <h1 className="text-5xl md:text-7xl font-display font-extrabold text-white leading-tight max-w-4xl">
                  Actionable Insights, Optimal <span className="relative inline-block border-b-4 border-clara-orange pb-2">Claims Outcomes</span>
                </h1>
                <p className="text-xl md:text-2xl text-white/80 max-w-3xl leading-relaxed font-light">
                  ClaimSense puts the <span className="font-bold text-white">AI in claims</span>! ClaimSense is the health insurance Claims Intelligence Platform driving the reversal of hyper-technical, wrongful claim rejections through precision legal precedents.
                </p>
                <div className="pt-4">
                  <button
                    className="bg-neon-orange hover:bg-neon-orange-dark text-white font-bold py-4 px-10 text-lg rounded-full shadow-[0_0_15px_rgba(255,94,0,0.5)] hover:shadow-[0_0_25px_rgba(255,94,0,0.7)] transition-all duration-300"
                    onClick={() => document.getElementById('upload-zone').scrollIntoView({ behavior: 'smooth' })}
                  >
                    Start Analysis &rarr;
                  </button>
                </div>
              </section>
            </>
          )}
        </main>

      </div>


      <main className="flex-grow flex flex-col relative">
        {!analysisResult && !isLoading && (
          <>
            {/* Upload Section (Overlapping the dark hero via negative margin) */}
            <section id="upload-zone" className="px-6 -mt-32 relative z-20 pb-12">
              <div className="max-w-3xl mx-auto shadow-2xl rounded-xl">
                <UploadSection onAnalyze={handleAnalyze} error={error} />
              </div>
            </section>

            {/* Recent Reports History */}
            {history.length > 0 && (
              <section className="px-6 pb-24 relative z-10">
                <div className="max-w-5xl mx-auto">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-8 rounded-lg bg-neon-orange/10 flex items-center justify-center text-neon-orange font-bold">⏱</div>
                    <h2 className="text-2xl font-display font-bold text-navy-deep">Recent Analysis Reports</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {history.map((report, idx) => (
                      <div 
                        key={idx} 
                        onClick={() => setAnalysisResult(report)}
                        className="bg-white p-6 rounded-xl border border-border-default hover:border-neon-orange/50 hover:shadow-card-hover transition-all cursor-pointer group relative overflow-hidden"
                      >
                        <div className="absolute top-0 right-0 w-2 h-full bg-neon-orange/10 group-hover:bg-neon-orange/30 transition-colors"></div>
                        <div className="flex justify-between items-start mb-4">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded ${report.is_challengeable ? 'bg-success-green/10 text-success-green' : 'bg-danger-red/10 text-danger-red'}`}>
                            {report.is_challengeable ? 'Challengeable' : 'Valid'}
                          </span>
                          <span className={`font-bold text-lg ${
                            (report.success_probability || 0) > 70 ? 'text-success-green' :
                            (report.success_probability || 0) >= 40 ? 'text-amber-500' :
                            'text-danger-red'
                          }`}>
                            {report.success_probability || 0}%
                          </span>
                        </div>
                        <h4 className="text-navy-deep font-bold mb-2 line-clamp-1">{report.rejection_reason}</h4>
                        <p className="text-text-muted text-sm line-clamp-2 leading-relaxed">
                          {report.plain_explanation}
                        </p>
                        <div className="mt-4 flex items-center text-neon-orange text-xs font-bold gap-1 group-hover:gap-2 transition-all">
                          View Analysis report <span>&rarr;</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* About Section */}
            <section id="about" className="bg-arctic-secondary py-24 px-6 border-b border-border-default">
              <div className="max-w-4xl mx-auto text-center">
                <h2 className="text-4xl font-display font-bold text-navy-deep mb-8 inline-block border-b-4 border-neon-orange pb-2">
                  About ClaimSense
                </h2>
                <div className="space-y-6">
                  <p className="text-lg text-navy-mid leading-relaxed">
                    Health‑insurance claim rejections are rampant in India, and many policy‑holders receive
                    denial letters that are written in dense legal jargon. Most users lack the expertise
                    to understand whether the insurer’s reasoning is valid or challengeable.
                  </p>
                  <p className="text-lg text-navy-mid leading-relaxed">
                    ClaimSense solves this problem by extracting the text from the denial letter,
                    cross‑referencing it with IRDAI regulations and real Ombudsman precedents,
                    and automatically drafting a professional appeal letter. The platform empowers
                    users to fight wrongful rejections quickly, confidently, and at zero cost.
                  </p>
                </div>
              </div>
            </section>


            {/* How It Works (Arctic Secondary) */}
            <section id="how" className="bg-arctic-secondary py-24 px-6 border-y border-border-default">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 space-y-4">
                  <h2 className="text-3xl font-display font-bold text-navy-deep">The Clinical Architecture of Resolution</h2>
                  <p className="text-navy-mid max-w-2xl mx-auto">Six steps to fight back against hyper-technical denials.</p>
                </div>
                <div className="grid md:grid-cols-3 gap-8">
                  {[
                    { step: '1', title: 'Upload Denial Letter', desc: 'Securely upload your PDF or image rejection letter received from your insurer.' },
                    { step: '2', title: 'Extraction of Text ', desc: 'If the user uploads PDF, the text will be extracted at the backend and if user pastes the text, then it is used directly' },
                    { step: '3', title: 'AI Legal Analysis & Classification', desc: 'The extracted text is sent to Gemini AI where a highly specific prompt is injected to AI to act as an "experienced Indian health insurance and ombudsman expret". Then Gemini reads the complex insurer language, identifies specific clauses and classifies the rejection into one of the predefined categories.' },
                    { step: '4', title: 'Injecting and Matching Legal Precedents', desc: 'The system opens our predefined database of Indian insurance judgments and look up for the specific category of rejection and attaches the legal citations to the analysis.' },
                    { step: '5', title: 'Drafing the Appeal Letter', desc: 'The backend feeds Gemini with the facts of rejection and specific Ombudsman precedent that it pulled off from database. Then Gemini then drafts a highly professional, aggressive, and legally-backed Grievance Appeal Letter referencing those exact laws, maximizing the chances the insurer will reverse their decision.  ' },
                    { step: '6', title: 'The Resolution Dashboard', desc: 'The Analysis Dashboard appears where you can see a green "Challangeable" or red "Valid Rejection" tag, and gives explanation for the same in plain English. If the rejection is "CHALLENGEABLE", an Appeal Letter is drafted that is ready to be downloaded' }
                  ].map((s, i) => (
                    <div key={i} className="card hover:shadow-card-hover transition-shadow bg-white transform hover:-translate-y-1 duration-300">
                      <div className="w-12 h-12 rounded-xl bg-arctic-card-subtle text-electric-blue flex items-center justify-center font-display font-bold text-xl mb-6 border border-border-default">
                        {s.step}
                      </div>
                      <h3 className="text-xl font-bold text-navy-deep mb-3">{s.title}</h3>
                      <p className="text-text-muted leading-relaxed">{s.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="absolute inset-0 z-50 bg-arctic-bg/80 backdrop-blur-sm flex flex-col items-center justify-center min-h-[60vh]">
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-electric-blue/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-electric-blue border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-2xl font-display font-bold text-navy-deep animate-pulse">{loadingStep}</p>
            <p className="text-text-muted mt-2">Connecting to Precedents DB...</p>
          </div>
        )}

        {/* Analysis Dashboard */}
        {analysisResult && !isLoading && (
          <div className="container mx-auto px-6 py-12 max-w-6xl animate-fade-in relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
              <div>
                <button onClick={handleReset} className="text-text-muted hover:text-electric-blue font-semibold mb-2 flex items-center gap-2 transition-colors">
                  ← Back to Uploads
                </button>
                <h2 className="text-4xl font-display font-extrabold text-navy-deep">Claim Analysis Report</h2>
              </div>
            </div>

            <div className="grid lg:grid-cols-[1fr_400px] gap-8">
              <div className="space-y-8">
                <ResultsCard result={analysisResult} />
              </div>
              <div className="space-y-8">
                <AppealLetter letter={analysisResult.appeal_letter} isChallengeable={analysisResult.is_challengeable} />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-border-default py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-text-muted text-sm font-medium">
            ClaimSense © 2026. Built with precision for Indian Health Insurance consumers.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
