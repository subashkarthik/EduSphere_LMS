
import React, { useState } from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { Library, Search, BookOpen, Clock, CheckCircle2, AlertCircle, Filter } from 'lucide-react';

interface LibraryViewProps {
  role: UserRole;
}

const MOCK_BOOKS = [
  { id: '1', title: 'Introduction to Algorithms', author: 'Thomas H. Cormen', isbn: '978-0262033848', status: 'available', category: 'Computer Science', edition: '3rd Edition' },
  { id: '2', title: 'Operating System Concepts', author: 'Abraham Silberschatz', isbn: '978-1119800361', status: 'issued', category: 'Computer Science', edition: '10th Edition', dueDate: '2024-10-25' },
  { id: '3', title: 'Computer Networks', author: 'Andrew S. Tanenbaum', isbn: '978-0132126953', status: 'available', category: 'Computer Science', edition: '5th Edition' },
  { id: '4', title: 'Artificial Intelligence: A Modern Approach', author: 'Stuart Russell', isbn: '978-0134610993', status: 'reserved', category: 'AI & ML', edition: '4th Edition' },
  { id: '5', title: 'Database System Concepts', author: 'Abraham Silberschatz', isbn: '978-0078022159', status: 'available', category: 'Database', edition: '7th Edition' },
  { id: '6', title: 'Design Patterns', author: 'Erich Gamma', isbn: '978-0201633612', status: 'available', category: 'Software Engineering', edition: '1st Edition' },
  { id: '7', title: 'Clean Code', author: 'Robert C. Martin', isbn: '978-0132350884', status: 'issued', category: 'Software Engineering', edition: '1st Edition', dueDate: '2024-10-20' },
  { id: '8', title: 'Deep Learning', author: 'Ian Goodfellow', isbn: '978-0262035613', status: 'available', category: 'AI & ML', edition: '1st Edition' },
];

const statusConfig: Record<string, { label: string; class: string; icon: React.ElementType }> = {
  available: { label: 'Available', class: 'bg-emerald-50 text-emerald-600', icon: CheckCircle2 },
  issued: { label: 'Issued', class: 'bg-amber-50 text-amber-600', icon: Clock },
  reserved: { label: 'Reserved', class: 'bg-rose-50 text-rose-600', icon: AlertCircle },
};

const LibraryView: React.FC<LibraryViewProps> = ({ role }) => {
  const theme = ROLE_THEMES[role] || ROLE_THEMES[UserRole.STUDENT];
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filtered = MOCK_BOOKS.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(search.toLowerCase()) || 
                          book.author.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filterStatus === 'all' || book.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: MOCK_BOOKS.length,
    available: MOCK_BOOKS.filter(b => b.status === 'available').length,
    issued: MOCK_BOOKS.filter(b => b.status === 'issued').length,
    reserved: MOCK_BOOKS.filter(b => b.status === 'reserved').length,
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 px-1">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Digital Library</h2>
          <p className="text-slate-500 text-sm font-medium">Institutional book catalog and resource management.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Books', value: stats.total, color: 'text-slate-800' },
          { label: 'Available', value: stats.available, color: 'text-emerald-600' },
          { label: 'Issued', value: stats.issued, color: 'text-amber-600' },
          { label: 'Reserved', value: stats.reserved, color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <p className={`text-2xl font-black mt-1 ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or author..."
            className="w-full pl-14 pr-6 py-4 bg-white border border-slate-100 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-100 transition-all font-medium shadow-sm"
          />
        </div>
        <div className="flex bg-white border border-slate-100 p-1.5 rounded-2xl shadow-sm">
          {['all', 'available', 'issued', 'reserved'].map(status => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filterStatus === status ? `${theme.primary} text-white shadow-sm` : 'text-slate-400 hover:text-slate-600'}`}
            >
              {status === 'all' ? 'All' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Book Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filtered.map(book => {
          const status = statusConfig[book.status];
          const StatusIcon = status.icon;
          return (
            <div key={book.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer">
              {/* Book Icon */}
              <div className={`w-full h-32 rounded-2xl ${theme.light} flex items-center justify-center mb-6 group-hover:scale-[1.02] transition-transform`}>
                <BookOpen size={40} className={`${theme.text} opacity-40`} />
              </div>
              
              <h3 className="font-black text-sm text-slate-900 tracking-tight mb-1 line-clamp-2 min-h-[2.5rem]">{book.title}</h3>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-4">{book.author}</p>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-[9px] text-slate-300 font-bold">{book.category}</span>
                <span className="text-[9px] text-slate-300 font-bold">{book.edition}</span>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${status.class}`}>
                  <StatusIcon size={12} />
                  <span className="text-[9px] font-black uppercase tracking-widest">{status.label}</span>
                </div>
                {book.status === 'issued' && (book as any).dueDate && (
                  <span className="text-[9px] text-amber-600 font-black">Due: {(book as any).dueDate}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20">
          <Library size={48} className="text-slate-200 mx-auto mb-4" />
          <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No books found</p>
          <p className="text-xs text-slate-300 mt-1">Try adjusting your search or filters.</p>
        </div>
      )}
    </div>
  );
};

export default LibraryView;
