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

export const buildOrgTree = (companyData: Employee): Employee[] => {
  if (!companyData) {
    console.log('⚠️ No company data provided to buildOrgTree');
    return [];
  }
  
  console.log('🏗️ Building org tree from company data');
  return [companyData];
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

export const getDepartmentColor = (level: string): { color: string; bgColor: string; borderColor: string } => {
  return getLevelColor(level);
};