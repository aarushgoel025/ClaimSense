import React, { useState } from 'react';
import { UploadCloud, FileText, FileDown } from 'lucide-react';

export default function UploadSection({ onAnalyze, error }) {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'text'
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'upload' && !file) return;
    if (activeTab === 'text' && !text.trim()) return;

    const formData = new FormData();
    if (activeTab === 'upload') {
      formData.append('file', file);
    } else {
      formData.append('text', text);
    }

    onAnalyze(formData);
  };

  const fillSampleData = () => {
    setActiveTab('text');
    setText("Dear Policyholder, We refer to your claim submitted for hospitalization dated 18 February 2026 at MotherCare Hospital under Policy No. 55890321. We regret to inform you that your claim has been rejected based on Clause 3.4 – Maternity Benefit Waiting Period. Expenses related to maternity are covered only after completion of 36 months of continuous coverage. Accordingly, the claim falls within the waiting period and is not admissible.");
  };

  return (
    <div className="card-featured relative overflow-hidden group">
      {/* Decorative gradient blur inside the card */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-electric-blue/5 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"></div>

      <div className="flex border-b border-border-default mb-8">
        <button
          className={`flex-1 flex items-center justify-center gap-3 py-4 font-bold text-lg transition-all border-b-2 ${
            activeTab === 'upload' ? 'border-electric-blue text-electric-blue bg-arctic-bg/50' : 'border-transparent text-text-muted hover:text-navy-deep hover:bg-arctic-bg/30'
          }`}
          onClick={() => setActiveTab('upload')}
        >
          <UploadCloud size={22} className={activeTab === 'upload' ? 'animate-bounce-slow' : ''} />
          Upload Document
        </button>
        <button
          className={`flex-1 flex items-center justify-center gap-3 py-4 font-bold text-lg transition-all border-b-2 ${
            activeTab === 'text' ? 'border-electric-blue text-electric-blue bg-arctic-bg/50' : 'border-transparent text-text-muted hover:text-navy-deep hover:bg-arctic-bg/30'
          }`}
          onClick={() => setActiveTab('text')}
        >
          <FileText size={22} />
          Paste Text
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8 flex flex-col items-center relative z-10">
        {activeTab === 'upload' ? (
          <div
            className={`w-full relative p-12 lg:p-16 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-300 ${
              isDragging ? 'bg-arctic-card-subtle border-electric-blue scale-[1.02]' 
                         : file ? 'bg-arctic-bg border-electric-blue' 
                                : 'bg-arctic-bg border-border-default hover:border-electric-blue/50 hover:bg-arctic-card-subtle'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleFileChange} 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500 ${file ? 'bg-electric-blue/10 scale-110' : 'bg-white shadow-sm'}`}>
              <FileDown size={36} className={`transition-colors duration-500 ${file ? 'text-electric-blue' : 'text-text-muted'}`} />
            </div>
            
            <h3 className="text-2xl font-display font-bold text-navy-deep mb-2">
              {file ? file.name : 'Drop your Rejection Letter here'}
            </h3>
            <p className="text-text-muted">
              {file ? 'File ready for analysis.' : 'Supported Formats: PDF only'}
            </p>
          </div>
        ) : (
          <div className="w-full">
            <textarea
              className="w-full h-64 p-6 bg-arctic-bg border border-border-default rounded-xl focus:ring-4 focus:ring-electric-blue/20 focus:border-electric-blue text-navy-deep outline-none resize-none transition-all duration-300 font-sans text-lg placeholder:text-text-muted/60"
              placeholder="Paste the exact contents of your health insurance rejection letter here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            ></textarea>
            <div className="flex justify-end mt-4">
              <button 
                type="button" 
                onClick={fillSampleData}
                className="text-sm font-bold text-electric-blue hover:text-navy-deep flex items-center gap-2 transition-colors"
                title="Loads the Maternity Waiting Period rejection sample"
              >
                <span>✨</span> Load Sample Maternity Rejection
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="w-full p-4 bg-danger-red/10 border border-danger-red/20 rounded-lg text-danger-red text-center font-bold animate-fade-in shadow-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={activeTab === 'upload' ? !file : !text.trim()}
          className={`w-full sm:w-2/3 md:w-1/2 text-lg py-4 font-bold rounded-sm flex items-center justify-center gap-3 transition-colors duration-300 ${(activeTab === 'upload' && !file) || (activeTab === 'text' && !text.trim()) ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-neon-orange hover:bg-neon-orange-dark text-white shadow-lg'}`}
        >
           Initiate Clinical Analysis &rarr;
        </button>
      </form>
    </div>
  );
}
