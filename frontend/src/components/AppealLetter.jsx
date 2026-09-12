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

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const marginLeft = 45;
    const marginRight = 45;
    const marginTop = 55;
    const marginBottom = 48;
    const usableWidth = pageWidth - marginLeft - marginRight;
    const maxY = pageHeight - marginBottom;

    const fontSize = 10.5;
    const lineHeight = 15;
    const paragraphGap = 6;

    let cursorY = marginTop;

    const paragraphs = letter.split(/\r?\n/);

    paragraphs.forEach((rawPara) => {
      const trimmed = rawPara.trim();
      if (!trimmed) {
        if (cursorY > marginTop) {
          cursorY += paragraphGap * 1.2;
          if (cursorY > maxY) {
            doc.addPage();
            cursorY = marginTop;
          }
        }
        return;
      }

      const isShortHeader =
        (trimmed.startsWith('**') && trimmed.endsWith('**') && trimmed.length < 80) ||
        trimmed.startsWith('To,') ||
        trimmed.startsWith('The Grievance Officer') ||
        trimmed.startsWith('The Insurance Company') ||
        trimmed.startsWith('Subject:') ||
        trimmed.startsWith('**Subject') ||
        trimmed.startsWith('Reference:') ||
        trimmed.startsWith('**Reference') ||
        trimmed.startsWith('LEGAL BASIS') ||
        trimmed.startsWith('**LEGAL BASIS') ||
        trimmed.startsWith('DEMAND FOR REDRESSAL') ||
        trimmed.startsWith('**DEMAND FOR REDRESSAL') ||
        trimmed.startsWith('Enclosures') ||
        trimmed.startsWith('**Enclosures') ||
        trimmed.startsWith('Dear Sir/Madam');

      const cleanPara = trimmed.replace(/\*\*/g, '');

      doc.setFont('helvetica', isShortHeader ? 'bold' : 'normal');
      doc.setFontSize(fontSize);
      doc.setTextColor(30, 35, 45);

      const lines = doc.splitTextToSize(cleanPara, usableWidth);

      lines.forEach((line) => {
        if (cursorY + lineHeight > maxY) {
          doc.addPage();
          cursorY = marginTop;
        }
        doc.text(line, marginLeft, cursorY);
        cursorY += lineHeight;
      });

      cursorY += paragraphGap;
    });

    // Add running header & footer to each page
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);

      // Running top header line
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(130, 135, 145);
      doc.text('ClaimSense — Insurance Grievance Appeal Draft', marginLeft, 32);

      doc.setDrawColor(225, 230, 235);
      doc.setLineWidth(0.5);
      doc.line(marginLeft, 37, pageWidth - marginRight, 37);

      // Running bottom footer line
      doc.line(marginLeft, pageHeight - 35, pageWidth - marginRight, pageHeight - 35);

      // Running footer text
      doc.text('Confidential — Prepared for Insurance Grievance Redressal', marginLeft, pageHeight - 22);
      const pageNumStr = `Page ${i} of ${totalPages}`;
      const pageNumWidth = doc.getTextWidth(pageNumStr);
      doc.text(pageNumStr, pageWidth - marginRight - pageNumWidth, pageHeight - 22);
    }

    doc.save('Appeal_Letter_ClaimSense.pdf');
  };

  return (
    <div className="card border p-0 overflow-hidden flex flex-col bg-arctic-card shadow-card-elevated hover:shadow-card-hover transition-all">
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
            className="p-2 rounded-lg text-text-muted hover:text-electric-blue hover:bg-arctic-card transition-colors border border-transparent hover:border-border-default shadow-sm"
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
      <div className="flex-grow bg-arctic-bg p-6 lg:p-8 overflow-y-auto" style={{ maxHeight: '400px' }}>
        <div className="bg-arctic-card border rounded-lg border-border-default shadow-sm p-6 lg:p-8 font-serif text-sm md:text-base leading-relaxed text-navy-deep whitespace-pre-wrap">
          {letter}
        </div>
      </div>
    </div>
  );
}
