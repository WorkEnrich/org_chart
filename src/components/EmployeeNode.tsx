import React from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Employee } from '../types/Employee';
import { getCardBorderColor } from '../utils/orgChartUtils';
import { Users, ChevronDown, ChevronRight } from 'lucide-react';

interface EmployeeNodeData {
  item: any;
  chartType: 'orgChart' | 'companyChart';
  itemColors?: { color: string; bgColor: string; borderColor: string };
  hasChildren?: boolean;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const EmployeeNode: React.FC<NodeProps<EmployeeNodeData>> = ({ data }) => {
  const { item, chartType, itemColors, hasChildren, isExpanded, onToggleExpand } = data;
  
  // Get colors based on chart type
  const getItemColors = () => {
    if (itemColors) {
      return itemColors;
    }
    
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
      className={`relative bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 ${levelColors.bgColor} w-60 group hover:-translate-y-1 hover:scale-105`}
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
        className="w-3 h-3 !border-2 !border-white !bg-opacity-80"
        style={{ backgroundColor: levelColors.borderColor }}
        style={{ top: -6 }}
      />

      <div className="p-4">
        {/* Employee Info - Centered Layout */}
        <div className="text-center space-y-2">
          <h3 className="text-base font-bold text-gray-900 leading-tight">{displayInfo.name}</h3>
          <p className={`text-xs font-medium ${levelColors.color} leading-tight`}>{displayInfo.position}</p>
          <p className="text-xs text-gray-500 font-mono">Code: {displayInfo.code}</p>

          {/* Expand/Collapse Button */}
          {hasChildren && (
            <div className="pt-1">
              <button
                onClick={handleExpandClick}
                onMouseDown={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 mx-auto border relative z-10 hover:scale-105"
                style={{
                  backgroundColor: isExpanded ? '#dcfce7' : 
                    levelColors.bgColor.includes('purple') ? '#f3e8ff' :
                    levelColors.bgColor.includes('blue') ? '#dbeafe' :
                    levelColors.bgColor.includes('green') ? '#dcfce7' :
                    levelColors.bgColor.includes('orange') ? '#fed7aa' :
                    levelColors.bgColor.includes('red') ? '#fecaca' :
                    levelColors.bgColor.includes('pink') ? '#fce7f3' :
                    levelColors.bgColor.includes('indigo') ? '#e0e7ff' : '#f3f4f6',
                  color: isExpanded ? '#15803d' : levelColors.borderColor,
                  borderColor: levelColors.borderColor,
                  pointerEvents: 'auto'
                }}
              >
                <Users className="w-4 h-4" />
                {item.children?.length || 0} {chartType === 'orgChart' ? 'Reports' : 'Items'}
                {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Handle - only show if has children and is expanded */}
      {hasChildren && isExpanded && (
        <Handle
          type="source"
          position={Position.Bottom}
          className="w-3 h-3 !border-2 !border-white !bg-opacity-80"
          style={{ backgroundColor: levelColors.borderColor, bottom: -6 }}
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