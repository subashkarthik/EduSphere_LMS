
import React from 'react';
import { UserRole } from '../types';
import { ROLE_THEMES } from '../constants';
import { Download } from 'lucide-react';
import { useApi } from '../hooks';
import { examsApi } from '../services/api';
import { FullPageLoader } from '../components/LoadingSkeleton';

interface ModuleProps {
  id: string;
  role: UserRole;
}

const ExamsModule: React.FC<ModuleProps> = ({ role }) => {
  const theme = ROLE_THEMES[role];
  const isStudent = role === UserRole.STUDENT;

  const { data: transcripts, loading } = useApi(
    () => isStudent ? examsApi.transcripts() : Promise.resolve([]),
    [
      { semester: 'Semester 7', courses: [
        { course_name: 'Theory of Computation', grade: 'A+', credits: 4 },
        { course_name: 'Microprocessors', grade: 'A', credits: 4 },
        { course_name: 'Data Structures', grade: 'S', credits: 4 }
      ], sgpa: 9.0 }
    ],
    [role]
  );

  const { data: schedules } = useApi(
    () => examsApi.schedules(),
    [],
    [role]
  );

  if (loading) return <FullPageLoader />;

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="px-1">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Academic Transcripts</h2>
          <p className="text-slate-500 text-sm font-medium">Semester-wise grading and evaluations.</p>
        </div>
        {isStudent && transcripts && transcripts.length > 0 && (
          <div className={`${theme.primary} text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-indigo-500/20`}>
            GPA: {transcripts[0]?.sgpa || 'N/A'}
          </div>
        )}
      </div>

      {/* Upcoming Exams */}
      {schedules && schedules.length > 0 && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 p-6 rounded-[2rem]">
          <h3 className="font-black text-amber-800 text-sm uppercase tracking-widest mb-4">Upcoming Exams</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(schedules as any[]).slice(0, 3).map((exam: any, i: number) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-amber-100 shadow-sm">
                <p className="font-black text-sm text-slate-800">{exam.title}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{exam.course_name} • {exam.exam_type}</p>
                <p className="text-[10px] text-amber-600 font-black uppercase mt-2">{new Date(exam.exam_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(transcripts || []).map((sem: any) => (
          <div key={sem.semester} className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all cursor-pointer group active:scale-[0.98]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-black text-slate-800 uppercase tracking-widest text-[10px]">{sem.semester}</h3>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                <Download size={20}/>
              </div>
            </div>
            <div className="space-y-5">
              {sem.courses.map((course: any) => (
                <div key={course.course_name} className="flex justify-between items-center pb-3 border-b border-slate-50 last:border-0 last:pb-0">
                  <p className="text-[11px] font-bold text-slate-600 uppercase tracking-tight pr-4">{course.course_name}</p>
                  <span className={`text-xs font-black ${theme.text}`}>{course.grade}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">SGPA</span>
              <span className="text-lg font-black text-indigo-600">{sem.sgpa}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamsModule;
