import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Employee } from '../types/Employee';
import { getCardBorderColor } from '../utils/orgChartUtils';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';

interface EmployeeNodeData {
  item: any;
  chartType: 'orgChart' | 'companyChart';
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const EmployeeNode: React.FC<NodeProps<EmployeeNodeData>> = ({ data }) => {
  const { item, chartType, hasChildren, isExpanded, onToggleExpand } = data;
  
  // Get colors based on chart type
  const getItemColors = () => {
    if (chartType === 'orgChart') {
      let code;
      if (item.job_title_code) {
        code = typeof item.job_title_code === 'string' ? item.job_title_code.hashCode() : item.job_title_code;
      } else {
        code = typeof item.name === 'string' ? item.name.hashCode() : 0;
      }
      return getCardBorderColor(Math.abs(code), item.level || item.job_level || 'Staff');
    } else {
      let id;
      if (item.id) {
        id = typeof item.id === 'string' ? item.id.hashCode() : item.id;
      } else {
        id = typeof item.name === 'string' ? item.name.hashCode() : 0;
      }
      return getCardBorderColor(Math.abs(id), item.type || 'company');
    }
  };
  
  const levelColors = getItemColors();

  // Get display information based on chart type
  const getDisplayInfo = () => {
    if (chartType === 'orgChart') {
      return {
        name: item.name,
        position: item.position,
        code: item.job_title_code,
        level: item.level || item.job_level
      };
    } else {
      return {
        name: item.name,
        position: item.type === 'company' ? `${item.number_employees} employees` : 
                 item.type === 'branch' ? `Location: ${item.location}` :
                 item.type === 'department' ? 'Department' :
                 item.type === 'section' ? 'Section' :
                 item.type === 'job_title' ? `Level: ${item.level}` : item.type,
        code: item.code || item.id,
        level: item.type
      };
    }
  };
  
  const displayInfo = getDisplayInfo();

  const handleExpandClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    e.nativeEvent.stopImmediatePropagation();
    console.log('🖱️ Expand button clicked for:', displayInfo.name, 'Has children:', hasChildren, 'Current expanded:', isExpanded);
    
    if (onToggleExpand && hasChildren) {
      console.log('🔄 Calling toggle function for:', displayInfo.code);
      onToggleExpand();
    }
  };

  return (
    <div 
      className={`relative bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border-2 ${levelColors.bgColor} w-64 group hover:-translate-y-1`}
      style={{ borderColor: levelColors.borderColor }}
      onMouseDown={(e) => {
        // Only stop propagation if clicking on the expand button area
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
          e.stopPropagation();
        }
      }}
      onClick={(e) => {
        // Only stop propagation if clicking on the expand button area
        const target = e.target as HTMLElement;
        if (target.closest('button')) {
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
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{displayInfo.name}</h3>
          <p className={`text-sm font-medium ${levelColors.color} leading-tight`}>{displayInfo.position}</p>
          <p className="text-xs text-gray-500">Code: {displayInfo.code}</p>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <div className="pt-2">
            <button
              onClick={handleExpandClick}
              onMouseDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onMouseUp={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onPointerDown={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
              }}
              onPointerUp={(e) => {
                e.stopPropagation();
                e.preventDefault();
                e.nativeEvent.stopImmediatePropagation();
              }}
              style={{ pointerEvents: 'auto', zIndex: 1000 }}
              className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 mx-auto ${
                isExpanded 
                  ? `bg-green-100 text-green-700 border border-green-300 hover:bg-green-200` 
                  : `${levelColors.color} ${levelColors.bgColor.replace('50', '100')} hover:${levelColors.bgColor.replace('50', '200')} border`
              }`}
            >
              <Users className="w-3 h-3" />
              {item.children?.length || 0} {chartType === 'orgChart' ? 'Reports' : 'Items'}
              {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            </div>
          )}
        </div>
      </div>

      {/* Level Badge */}
      <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center">
        <span className="text-xs font-bold text-gray-600">{displayInfo.code}</span>
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

// Helper function to generate hash code from string
declare global {
  interface String {
    hashCode(): number;
  }
}

String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const char = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
};

export default EmployeeNode;