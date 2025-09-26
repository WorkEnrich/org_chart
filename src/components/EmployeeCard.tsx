import React from 'react';
import { Employee } from '../types/Employee';
import { getDepartmentColor } from '../utils/orgChartUtils';
import { ChevronDown, ChevronRight, Users } from 'lucide-react';

interface EmployeeCardProps {
  employee: Employee;
  isExpanded: boolean;
  onToggleExpand: () => void;
  hasChildren: boolean;
}

const EmployeeCard: React.FC<EmployeeCardProps> = ({
  employee,
  isExpanded,
  onToggleExpand,
  hasChildren
}) => {
  const { color, bgColor } = getDepartmentColor(employee.department);

  return (
    <div className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 ${bgColor} w-64 mx-auto group hover:-translate-y-1`}>
      <div className="p-4">
        {/* Avatar */}
        <div className="flex justify-center mb-3">
          <img
            src={employee.avatar}
            alt={employee.name}
            className="w-12 h-12 rounded-full object-cover border-3 border-white shadow-md"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=150`;
            }}
          />
        </div>

        {/* Employee Info */}
        <div className="text-center">
          <h3 className="text-base font-bold text-gray-900 mb-1 leading-tight">{employee.name}</h3>
          <p className={`text-xs font-medium ${color} mb-1 leading-tight`}>{employee.position}</p>
          {/* عرض كود المسمى الوظيفي */}
          {employee.jobTitleCode !== undefined && (
            <p className="text-[11px] text-gray-500 mb-3 leading-tight">كود الوظيفة: {employee.jobTitleCode}</p>
          )}

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={onToggleExpand}
              className={`flex items-center justify-center gap-1 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${color} ${bgColor.replace('50', '100')} hover:${bgColor.replace('50', '200')} border`}
            >
              <Users className="w-3 h-3" />
              {employee.children?.length || 0} Reports
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}
        </div>
      </div>

      {/* Level Indicator */}
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-600">{employee.level}</span>
      </div>
    </div>
  );
};

export default EmployeeCard;