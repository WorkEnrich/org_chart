import React, { useMemo, useCallback, useState, useEffect } from 'react';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  ConnectionMode,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Employee } from '../types/Employee';
import EmployeeNode from './EmployeeNode';

interface OrgChartProps {
  companyData: Employee | null;
}

const nodeTypes = {
  employee: EmployeeNode,
};

// ألوان مختلفة لكل مستوى
const getLevelBorderColor = (level: number): string => {
  const colors = [
    '#8b5cf6', // بنفسجي - المستوى 1
    '#3b82f6', // أزرق - المستوى 2
    '#10b981', // أخضر - المستوى 3
    '#f59e0b', // برتقالي - المستوى 4
    '#ef4444', // أحمر - المستوى 5
    '#ec4899', // وردي - المستوى 6
    '#6366f1', // نيلي - المستوى 7
    '#84cc16', // أخضر فاتح - المستوى 8
  ];
  return colors[(level - 1) % colors.length] || '#6b7280';
};

const OrgChart: React.FC<OrgChartProps> = ({ companyData }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();

  // Update expanded nodes when data changes
  useEffect(() => {
    if (companyData && companyData.firstNode) {
      if (companyData.expanded) {
        setExpandedNodes(new Set([companyData.jobTitleCode.toString()]));
      }
    }
  }, [companyData]);

  // Listen for external events
  useEffect(() => {
    const handleExpandNode = (event: CustomEvent) => {
      const { nodeId } = event.detail;
      setExpandedNodes(prev => new Set([...prev, nodeId]));
    };

    const handleCollapseNode = (event: CustomEvent) => {
      const { nodeId } = event.detail;
      setExpandedNodes(prev => {
        const newSet = new Set(prev);
        newSet.delete(nodeId);
        return newSet;
      });
    };

    const handleExpandAll = () => {
      const allIds = new Set<string>();
      const collectIds = (emp: Employee) => {
        allIds.add(emp.jobTitleCode.toString());
        if (emp.children) {
          emp.children.forEach((child) => {
            collectIds(child);
          });
        }
      };
      if (companyData) {
        collectIds(companyData);
      }
      setExpandedNodes(allIds);
    };

    const handleCollapseAll = () => {
      setExpandedNodes(new Set());
    };

    const handleFocusOnEmployee = (event: CustomEvent) => {
      const { jobTitleCode } = event.detail;
      const expandPath = (emp: Employee, targetCode: number, path: string[] = []): string[] | null => {
        const currentPath = [...path, emp.jobTitleCode.toString()];
        if (emp.jobTitleCode === targetCode) {
          return currentPath;
        }
        if (emp.children) {
          for (const child of emp.children) {
            const result = expandPath(child, targetCode, currentPath);
            if (result) return result;
          }
        }
        return null;
      };

      if (companyData) {
        const pathToEmployee = expandPath(companyData, jobTitleCode);
        if (pathToEmployee) {
          setExpandedNodes(new Set(pathToEmployee));
          setTimeout(() => {
            fitView({ 
              padding: 0.2, 
              includeHiddenNodes: false,
              duration: 800,
              maxZoom: 1.2
            });
          }, 100);
        }
      }
    };

    window.addEventListener('expandNode', handleExpandNode as EventListener);
    window.addEventListener('collapseNode', handleCollapseNode as EventListener);
    window.addEventListener('expandAll', handleExpandAll);
    window.addEventListener('collapseAll', handleCollapseAll);
    window.addEventListener('focusOnEmployee', handleFocusOnEmployee as EventListener);

    return () => {
      window.removeEventListener('expandNode', handleExpandNode as EventListener);
      window.removeEventListener('collapseNode', handleCollapseNode as EventListener);
      window.removeEventListener('expandAll', handleExpandAll);
      window.removeEventListener('collapseAll', handleCollapseAll);
      window.removeEventListener('focusOnEmployee', handleFocusOnEmployee as EventListener);
    };
  }, [companyData, fitView]);

  const toggleExpand = useCallback((jobTitleCode: number) => {
    const nodeId = jobTitleCode.toString();
    console.log('🔄 Toggling expand for node:', nodeId);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        console.log('❌ Collapsing node:', nodeId);
      } else {
        newSet.add(nodeId);
        console.log('✅ Expanding node:', nodeId);
        setTimeout(() => {
          fitView({ 
            padding: 0.2, 
            includeHiddenNodes: false,
            duration: 800,
            maxZoom: 0.8
          });
        }, 100);
      }
      console.log('📊 Expanded nodes:', Array.from(newSet));
      return newSet;
    });
  }, [fitView]);

  // Build nodes and edges with advanced positioning system
  const { nodes, edges } = useMemo(() => {
    if (!companyData) {
      console.log('⚠️ No company data provided');
      return { nodes: [], edges: [] };
    }
    
    console.log('🔄 Building org chart from company data');
    
    const allNodes: Node[] = [];
    const allEdges: Edge[] = [];
    const processedCodes = new Set<number>();
    
    // نظام متقدم لتجنب التداخل
    const occupiedSpaces = new Map<string, Set<string>>();
    
    const CARD_WIDTH = 280;
    const CARD_HEIGHT = 120;
    const MIN_HORIZONTAL_GAP = 100; // مسافة أفقية أدنى
    const MIN_VERTICAL_GAP = 200;   // مسافة عمودية أدنى
    const GROUP_SEPARATION = 150;   // مسافة بين المجموعات
    
    // دالة للتحقق من التداخل
    const isSpaceOccupied = (level: number, x: number, y: number): boolean => {
      const levelKey = level.toString();
      if (!occupiedSpaces.has(levelKey)) {
        occupiedSpaces.set(levelKey, new Set());
      }
      
      const levelSpaces = occupiedSpaces.get(levelKey)!;
      
      // التحقق من المنطقة المحيطة بالكارد
      for (let checkX = x - CARD_WIDTH/2 - MIN_HORIZONTAL_GAP/2; 
           checkX <= x + CARD_WIDTH/2 + MIN_HORIZONTAL_GAP/2; 
           checkX += 50) {
        for (let checkY = y - CARD_HEIGHT/2 - MIN_VERTICAL_GAP/2; 
             checkY <= y + CARD_HEIGHT/2 + MIN_VERTICAL_GAP/2; 
             checkY += 50) {
          const spaceKey = `${Math.round(checkX/50)}_${Math.round(checkY/50)}`;
          if (levelSpaces.has(spaceKey)) {
            return true;
          }
        }
      }
      return false;
    };
    
    // دالة لحجز المساحة
    const reserveSpace = (level: number, x: number, y: number): void => {
      const levelKey = level.toString();
      if (!occupiedSpaces.has(levelKey)) {
        occupiedSpaces.set(levelKey, new Set());
      }
      
      const levelSpaces = occupiedSpaces.get(levelKey)!;
      
      // حجز المنطقة المحيطة بالكارد
      for (let reserveX = x - CARD_WIDTH/2 - MIN_HORIZONTAL_GAP/2; 
           reserveX <= x + CARD_WIDTH/2 + MIN_HORIZONTAL_GAP/2; 
           reserveX += 50) {
        for (let reserveY = y - CARD_HEIGHT/2 - MIN_VERTICAL_GAP/2; 
             reserveY <= y + CARD_HEIGHT/2 + MIN_VERTICAL_GAP/2; 
             reserveY += 50) {
          const spaceKey = `${Math.round(reserveX/50)}_${Math.round(reserveY/50)}`;
          levelSpaces.add(spaceKey);
        }
      }
    };
    
    // دالة لإيجاد أفضل موضع بدون تداخل
    const findBestPosition = (level: number, preferredX: number, preferredY: number): { x: number, y: number } => {
      // جرب الموضع المفضل أولاً
      if (!isSpaceOccupied(level, preferredX, preferredY)) {
        return { x: preferredX, y: preferredY };
      }
      
      // ابحث عن أقرب موضع متاح
      const maxAttempts = 50;
      let bestX = preferredX;
      let bestY = preferredY;
      
      for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        const radius = attempt * (CARD_WIDTH + MIN_HORIZONTAL_GAP);
        
        // جرب مواضع مختلفة حول النقطة المفضلة
        const positions = [
          { x: preferredX + radius, y: preferredY },
          { x: preferredX - radius, y: preferredY },
          { x: preferredX, y: preferredY + MIN_VERTICAL_GAP },
          { x: preferredX, y: preferredY - MIN_VERTICAL_GAP },
          { x: preferredX + radius/2, y: preferredY + MIN_VERTICAL_GAP/2 },
          { x: preferredX - radius/2, y: preferredY + MIN_VERTICAL_GAP/2 },
          { x: preferredX + radius/2, y: preferredY - MIN_VERTICAL_GAP/2 },
          { x: preferredX - radius/2, y: preferredY - MIN_VERTICAL_GAP/2 },
        ];
        
        for (const pos of positions) {
          if (!isSpaceOccupied(level, pos.x, pos.y)) {
            return pos;
          }
        }
      }
      
      return { x: bestX, y: bestY };
    };
    
    // دالة معالجة الموظفين
    const processEmployee = (
      employee: Employee, 
      level: number, 
      parentX: number = 0, 
      siblingIndex: number = 0, 
      totalSiblings: number = 1, 
      isRoot: boolean = false,
      groupStartX: number = 0
    ) => {
      if (processedCodes.has(employee.jobTitleCode)) return;
      processedCodes.add(employee.jobTitleCode);

      const verticalSpacing = 300 + (level * 50); // مسافة عمودية متزايدة
      
      let preferredX = parentX;
      
      if (isRoot) {
        preferredX = 0;
      } else if (totalSiblings === 1) {
        // إذا كان وحيد، ضعه تحت والده مع إزاحة بسيطة لتجنب التداخل
        preferredX = parentX + (level % 2 === 0 ? 50 : -50);
      } else {
        // حساب المساحة المطلوبة للمجموعة
        const groupWidth = totalSiblings * (CARD_WIDTH + MIN_HORIZONTAL_GAP + GROUP_SEPARATION);
        const startX = parentX - groupWidth / 2;
        preferredX = startX + (siblingIndex * (CARD_WIDTH + MIN_HORIZONTAL_GAP + GROUP_SEPARATION)) + CARD_WIDTH/2;
      }
      
      const preferredY = (level - 1) * verticalSpacing;
      
      // إيجاد أفضل موضع بدون تداخل
      const { x, y } = findBestPosition(level, preferredX, preferredY);
      
      // حجز المساحة
      reserveSpace(level, x, y);

      const hasChildren = employee.children && employee.children.length > 0;
      const isExpanded = expandedNodes.has(employee.jobTitleCode.toString());

      console.log(`👤 Processing: ${employee.name} (Level ${level}) at (${x}, ${y}) - Children: ${hasChildren ? employee.children!.length : 0} - Expanded: ${isExpanded}`);

      // إنشاء العقدة مع لون المستوى
      allNodes.push({
        id: employee.jobTitleCode.toString(),
        type: 'employee',
        position: { x, y },
        data: {
          employee,
          hasChildren,
          isExpanded,
          onToggleExpand: () => toggleExpand(employee.jobTitleCode),
          levelBorderColor: getLevelBorderColor(level),
        },
        draggable: false,
        selectable: false,
      });

      // معالجة الأطفال إذا كانوا موسعين
      if (hasChildren && isExpanded && employee.children) {
        const childrenCount = employee.children.length;
        
        employee.children.forEach((child, index) => {
          // إنشاء الخط للطفل
          allEdges.push({
            id: `edge-${employee.jobTitleCode}-${child.jobTitleCode}`,
            source: employee.jobTitleCode.toString(),
            target: child.jobTitleCode.toString(),
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: getLevelBorderColor(level),
              strokeWidth: 2,
            },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: getLevelBorderColor(level),
            },
          });

          // معالجة الطفل بشكل تكراري
          processEmployee(
            child, 
            level + 1, 
            x, 
            index, 
            childrenCount, 
            false,
            x - (childrenCount * (CARD_WIDTH + MIN_HORIZONTAL_GAP + GROUP_SEPARATION)) / 2
          );
        });
      }
    };

    // بدء المعالجة من جذر البيانات
    processEmployee(companyData, 1, 0, 0, 1, true);

    console.log('📊 Generated nodes:', allNodes.length);
    console.log('🔗 Generated edges:', allEdges.length);

    return { nodes: allNodes, edges: allEdges };
  }, [companyData, expandedNodes, toggleExpand]);

  const [nodesState, setNodes, onNodesChange] = useNodesState([]);
  const [edgesState, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes(nodes);
    setEdges(edges);
  }, [nodes, edges, setNodes, setEdges]);

  return (
    <div className="w-full h-full bg-gray-50">
      <ReactFlow
        nodes={nodesState}
        edges={edgesState}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        connectionMode={ConnectionMode.Loose}
        nodesDraggable={true}
        nodesConnectable={false}
        elementsSelectable={true}
        panOnDrag={true}
        selectionOnDrag={true}
        panOnScroll={true}
        zoomOnScroll={true}
        zoomOnPinch={true}
        zoomOnDoubleClick={true}
        fitView
        fitViewOptions={{
          padding: 0.15,
          includeHiddenNodes: false,
          minZoom: 0.1,
          maxZoom: 1.5,
        }}
        minZoom={0.1}
        maxZoom={2}
        defaultViewport={{ x: 0, y: 0, zoom: 0.4 }}
      >
        <Background 
          color="#e2e8f0" 
          gap={25} 
          size={1}
          variant="dots"
        />
        <Controls 
          position="top-right"
          showInteractive={false}
          className="bg-white shadow-lg rounded-lg"
        />
      </ReactFlow>
    </div>
  );
};

export default OrgChart;