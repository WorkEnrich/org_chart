import { Employee } from '../types/Employee';

export const searchEmployees = (employees: Employee[], searchTerm: string, selectedLevel?: string): Employee[] => {
  let filtered = employees;
  
  // Apply search filter
  if (searchTerm.trim()) {
    const term = searchTerm.toLowerCase();
    filtered = filtered.filter(emp => 
      emp.name.toLowerCase().includes(term) ||
      emp.position.toLowerCase().includes(term) ||
      emp.level.toLowerCase().includes(term) ||
      emp.jobTitleCode.toString().includes(term)
    );
  }
  
  // Apply level filter
  if (selectedLevel) {
    filtered = filtered.filter(emp => emp.level === selectedLevel);
  }
  
  return filtered;
};

export const buildOrgTree = (chartData: any, chartType: 'orgChart' | 'companyChart'): any[] => {
  if (!chartData) {
    console.log('⚠️ No chart data provided to buildOrgTree');
    return [];
  }
  
  console.log(`🏗️ Building ${chartType} tree from data`);
  
  if (Array.isArray(chartData)) {
    return chartData;
  } else {
    return [chartData];
  }
};

export const getLevelColor = (level: string): { color: string; bgColor: string; borderColor: string } => {
  const colors = {
    'Executive': { color: 'text-purple-700', bgColor: 'bg-purple-50 border-purple-400', borderColor: '#a855f7' },
    'Senior Management': { color: 'text-blue-700', bgColor: 'bg-blue-50 border-blue-400', borderColor: '#3b82f6' },
    'Middle Management': { color: 'text-green-700', bgColor: 'bg-green-50 border-green-400', borderColor: '#10b981' },
    'Junior Management': { color: 'text-orange-700', bgColor: 'bg-orange-50 border-orange-400', borderColor: '#f59e0b' },
    'Senior Staff': { color: 'text-red-700', bgColor: 'bg-red-50 border-red-400', borderColor: '#ef4444' },
    'Staff': { color: 'text-pink-700', bgColor: 'bg-pink-50 border-pink-400', borderColor: '#ec4899' },
    'Entry Level': { color: 'text-indigo-700', bgColor: 'bg-indigo-50 border-indigo-400', borderColor: '#6366f1' }
  };
  
  return colors[level as keyof typeof colors] || { color: 'text-gray-700', bgColor: 'bg-gray-50 border-gray-400', borderColor: '#6b7280' };
};

// دالة للحصول على لون مختلف لكل كارد في نفس المستوى
export const getCardBorderColor = (jobTitleCode: number, level: string): { color: string; bgColor: string; borderColor: string } => {
  // مجموعة ألوان كبيرة ومتنوعة لضمان اختلاف كل كارد
  const allColors = [
    // مجموعة البنفسجي والأرجواني
    { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: '#a855f7' },
    { color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: '#8b5cf6' },
    { color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: '#6366f1' },
    { color: 'text-fuchsia-700', bgColor: 'bg-fuchsia-50', borderColor: '#d946ef' },
    { color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: '#ec4899' },
    { color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: '#f43f5e' },
    
    // مجموعة الأزرق والسماوي
    { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: '#3b82f6' },
    { color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: '#0ea5e9' },
    { color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: '#06b6d4' },
    { color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: '#14b8a6' },
    { color: 'text-slate-700', bgColor: 'bg-slate-50', borderColor: '#64748b' },
    { color: 'text-zinc-700', bgColor: 'bg-zinc-50', borderColor: '#71717a' },
    
    // مجموعة الأخضر والطبيعي
    { color: 'text-green-700', bgColor: 'bg-green-50', borderColor: '#10b981' },
    { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: '#059669' },
    { color: 'text-lime-700', bgColor: 'bg-lime-50', borderColor: '#65a30d' },
    { color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: '#eab308' },
    { color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: '#f59e0b' },
    { color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: '#ea580c' },
    
    // مجموعة الأحمر والدافئ
    { color: 'text-red-700', bgColor: 'bg-red-50', borderColor: '#ef4444' },
    { color: 'text-orange-600', bgColor: 'bg-orange-50', borderColor: '#f97316' },
    { color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: '#d97706' },
    { color: 'text-yellow-600', bgColor: 'bg-yellow-50', borderColor: '#ca8a04' },
    
    // ألوان إضافية للتنوع
    { color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: '#6b7280' },
    { color: 'text-stone-700', bgColor: 'bg-stone-50', borderColor: '#78716c' },
    { color: 'text-neutral-700', bgColor: 'bg-neutral-50', borderColor: '#737373' },
    { color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: '#059669' },
    { color: 'text-teal-600', bgColor: 'bg-teal-50', borderColor: '#0d9488' },
    { color: 'text-cyan-600', bgColor: 'bg-cyan-50', borderColor: '#0891b2' },
    { color: 'text-sky-600', bgColor: 'bg-sky-50', borderColor: '#0284c7' },
    { color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: '#2563eb' },
    { color: 'text-indigo-600', bgColor: 'bg-indigo-50', borderColor: '#4f46e5' },
    { color: 'text-violet-600', bgColor: 'bg-violet-50', borderColor: '#7c3aed' },
    { color: 'text-purple-600', bgColor: 'bg-purple-50', borderColor: '#9333ea' },
    { color: 'text-fuchsia-600', bgColor: 'bg-fuchsia-50', borderColor: '#c026d3' },
    { color: 'text-pink-600', bgColor: 'bg-pink-50', borderColor: '#db2777' },
    { color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: '#e11d48' }
  ];

  // استخدام jobTitleCode لاختيار لون فريد لكل كارد
  const colorIndex = Math.abs(jobTitleCode) % allColors.length;
  return allColors[colorIndex];
};
export const getDepartmentColor = (level: string): { color: string; bgColor: string; borderColor: string } => {
  return getLevelColor(level);
};