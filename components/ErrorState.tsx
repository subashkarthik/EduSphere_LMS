
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ 
  message = 'Failed to load data. Please try again.',
  onRetry 
}) => (
  <div className="flex flex-col items-center justify-center p-10 md:p-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
    <div className="w-16 h-16 md:w-20 md:h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
      <AlertTriangle className="text-rose-500" size={28} />
    </div>
    <h2 className="text-xl md:text-2xl font-black text-slate-800 uppercase tracking-tight">Connection Error</h2>
    <p className="text-slate-500 mt-2 max-w-md font-medium text-sm md:text-base">{message}</p>
    {onRetry && (
      <button 
        onClick={onRetry}
        className="mt-6 px-8 py-3 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-slate-800 active:scale-95 transition-all shadow-lg"
      >
        <RefreshCw size={16} /> Retry
      </button>
    )}
  </div>
);

export default ErrorState;
