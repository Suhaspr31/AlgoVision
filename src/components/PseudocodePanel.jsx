import React from 'react';
import { FileCode, ChevronRight } from 'lucide-react';

/**
 * PseudocodePanel Component
 * 
 * Displays algorithm pseudocode with active line highlighting
 */
const PseudocodePanel = ({ pseudocode, currentLine, title }) => {
  if (!pseudocode || pseudocode.length === 0) {
    return (
      <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-gray-400">
        <div className="flex items-center gap-2 mb-2">
          <FileCode size={16} />
          <span className="font-semibold text-gray-300">{title || 'Pseudocode'}</span>
        </div>
        <p className="text-gray-500">No pseudocode available</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <FileCode size={16} className="text-primary" />
          <span className="font-semibold text-gray-200">{title || 'Pseudocode'}</span>
        </div>
        {currentLine !== undefined && (
          <span className="text-xs text-primary">
            Line: {currentLine + 1}
          </span>
        )}
      </div>

      {/* Pseudocode Lines */}
      <div className="p-4 font-mono text-sm overflow-x-auto">
        {pseudocode.map((line, idx) => (
          <div 
            key={idx}
            className={`
              px-3 py-1.5 rounded transition-all duration-200
              ${currentLine === idx 
                ? 'bg-yellow-500/20 text-yellow-300 border-l-2 border-yellow-500' 
                : 'text-green-400 border-l-2 border-transparent hover:bg-slate-800'
              }
            `}
          >
            <span className="text-gray-500 mr-2 select-none">{idx + 1}.</span>
            {line}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PseudocodePanel;
