import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Employee } from '../types/Employee';
import { getLevelColor } from '../utils/orgChartUtils';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';

interface EmployeeNodeData {
  employee: Employee;
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
  levelBorderColor?: string;
}

const EmployeeNode: React.FC<NodeProps<EmployeeNodeData>> = ({ data }) => {
  const { employee, hasChildren, isExpanded, onToggleExpand, levelBorderColor } = data;
  const levelColors = getLevelColor(employee.level);
  
  // استخدام لون المستوى المخصص إذا كان متوفراً
  const borderColor = levelBorderColor || levelColors.borderColor;

  const handleExpandClick = (e: React.MouseEvent) => {
    // منع جميع أنواع التضارب مع أحداث الماوس
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    
    console.log('🖱️ Expand button clicked for:', employee.name, 'Has children:', hasChildren, 'Current expanded:', isExpanded);
    
    if (onToggleExpand && hasChildren) {
      console.log('🔄 Calling toggle function for:', employee.jobTitleCode);
      onToggleExpand();
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // منع النقر على الكارد من التأثير على الزر
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
  };
  return (
    <div 
      className="relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 w-64 group hover:-translate-y-1"
      style={{ 
        borderColor: borderColor,
        backgroundColor: 'white'
      }}
      onClick={handleCardClick}
      onMouseDown={(e) => {
        // منع السحب إذا كان النقر على الزر
        if ((e.target as HTMLElement).closest('button')) {
          e.stopPropagation();
        }
      }}
    >
      {/* Top Handle */}
      <Handle
        type="target"
        position={Position.Top}
        className="w-3 h-3 !bg-blue-500 !border-2 !border-white"
        style={{ top: -6 }}
      />

      <div className="p-5">
        {/* Employee Info - Centered Layout */}
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{employee.name}</h3>
          <p className={`text-sm font-medium ${levelColors.color} leading-tight`}>{employee.position}</p>
          <p className="text-xs text-gray-500">Code: {employee.jobTitleCode}</p>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <div className="pt-2">
            <button
              onClick={handleExpandClick}
              className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 mx-auto ${
                isExpanded 
                  ? `bg-green-100 text-green-700 border border-green-300 hover:bg-green-200` 
                  : `text-gray-700 bg-gray-100 hover:bg-gray-200 border border-gray-300`
              }`}
              style={!isExpanded ? { 
                borderColor: borderColor,
                color: borderColor
              } : {}}
            >
              <Users className="w-3 h-3" />
              {employee.children?.length || 0} Reports
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            </div>
          )}
        </div>
      </div>

      {/* Level Badge */}
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-600">{employee.jobTitleCode}</span>
      </div>

      {/* Bottom Handle - only show if has children and is expanded */}
      {hasChildren && isExpanded && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !bg-green-500 !border-2 !border-white"
          style={{ bottom: -6 }}
        />
      )}
    </div>
  );
};

export default EmployeeNode;