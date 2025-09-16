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
  // مجموعة ألوان متنوعة لكل مستوى
  const colorPalettes = {
    'Executive': [
      { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: '#a855f7' },
      { color: 'text-violet-700', bgColor: 'bg-violet-50', borderColor: '#8b5cf6' },
      { color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: '#6366f1' }
    ],
    'Senior Management': [
      { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: '#3b82f6' },
      { color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: '#0ea5e9' },
      { color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: '#06b6d4' },
      { color: 'text-teal-700', bgColor: 'bg-teal-50', borderColor: '#14b8a6' }
    ],
    'Middle Management': [
      { color: 'text-green-700', bgColor: 'bg-green-50', borderColor: '#10b981' },
      { color: 'text-emerald-700', bgColor: 'bg-emerald-50', borderColor: '#059669' },
      { color: 'text-lime-700', bgColor: 'bg-lime-50', borderColor: '#65a30d' },
      { color: 'text-yellow-700', bgColor: 'bg-yellow-50', borderColor: '#eab308' }
    ],
    'Junior Management': [
      { color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: '#f59e0b' },
      { color: 'text-amber-700', bgColor: 'bg-amber-50', borderColor: '#f59e0b' },
      { color: 'text-red-700', bgColor: 'bg-red-50', borderColor: '#ef4444' },
      { color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: '#f43f5e' }
    ],
    'Senior Staff': [
      { color: 'text-red-700', bgColor: 'bg-red-50', borderColor: '#ef4444' },
      { color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: '#ec4899' },
      { color: 'text-fuchsia-700', bgColor: 'bg-fuchsia-50', borderColor: '#d946ef' },
      { color: 'text-purple-700', bgColor: 'bg-purple-50', borderColor: '#a855f7' }
    ],
    'Staff': [
      { color: 'text-pink-700', bgColor: 'bg-pink-50', borderColor: '#ec4899' },
      { color: 'text-rose-700', bgColor: 'bg-rose-50', borderColor: '#f43f5e' },
      { color: 'text-red-700', bgColor: 'bg-red-50', borderColor: '#ef4444' },
      { color: 'text-orange-700', bgColor: 'bg-orange-50', borderColor: '#f59e0b' }
    ],
    'Entry Level': [
      { color: 'text-indigo-700', bgColor: 'bg-indigo-50', borderColor: '#6366f1' },
      { color: 'text-blue-700', bgColor: 'bg-blue-50', borderColor: '#3b82f6' },
      { color: 'text-sky-700', bgColor: 'bg-sky-50', borderColor: '#0ea5e9' },
      { color: 'text-cyan-700', bgColor: 'bg-cyan-50', borderColor: '#06b6d4' }
    ]
  };

  const palette = colorPalettes[level as keyof typeof colorPalettes] || [
    { color: 'text-gray-700', bgColor: 'bg-gray-50', borderColor: '#6b7280' }
  ];

  // استخدام jobTitleCode لاختيار لون مختلف لكل كارد
  const colorIndex = jobTitleCode % palette.length;
  return palette[colorIndex];
};
export const getDepartmentColor = (level: string): { color: string; bgColor: string; borderColor: string } => {
  return getLevelColor(level);
};