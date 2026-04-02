import React from 'react';
import jsPDF from 'jspdf';
import { Download, Copy, FileSignature } from 'lucide-react';

export default function AppealLetter({ letter, isChallengeable }) {
  if (!isChallengeable) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(letter);
    alert('Letter copied to clipboard!');
  };

  const handleDownloadPDF = () => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    const margin = 40;
    const pageWidth = doc.internal.pageSize.getWidth();
    const textAreaWidth = pageWidth - margin * 2;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);

    const splitText = doc.splitTextToSize(letter, textAreaWidth);
    
    doc.text(splitText, margin, margin + 20);
    doc.save("Appeal_Letter_ClaimSense.pdf");
  };

  return (
    <div className="card border p-0 overflow-hidden flex flex-col h-full bg-white shadow-card-elevated hover:shadow-card-hover transition-all">
      {/* Header */}
      <div className="bg-arctic-secondary px-6 py-5 flex justify-between items-center border-b border-border-default">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-electric-blue/10 rounded-lg text-electric-blue">
            <FileSignature size={24} />
          </div>
          <h3 className="font-display font-bold text-lg text-navy-deep">Your Formal Appeal Draft</h3>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleCopy}
            className="p-2 rounded-lg text-text-muted hover:text-electric-blue hover:bg-white transition-colors border border-transparent hover:border-border-default shadow-sm"
            title="Copy to clipboard"
          >
            <Copy size={20} />
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-electric-blue hover:bg-blue-700 font-bold rounded-lg transition-colors text-white shadow-sm flex justify-center items-center gap-2"
          >
            <Download size={18} /> <span>PDF</span>
          </button>
        </div>
      </div>
      
      {/* Letter Content */}
      <div className="flex-grow bg-[#FAFCFF] p-6 lg:p-8 overflow-y-auto" style={{ maxHeight: '600px' }}>
        <div className="bg-white border rounded-lg border-border-default shadow-sm p-8 font-serif text-sm md:text-base leading-relaxed text-navy-deep min-h-full whitespace-pre-wrap">
          {letter}
        </div>
      </div>
    </div>
  );
}
