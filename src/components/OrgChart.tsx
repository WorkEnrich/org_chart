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
import { getLevelColor } from '../utils/orgChartUtils';

interface OrgChartProps {
  companyData: Employee | null;
}

const nodeTypes = {
  employee: EmployeeNode,
};

const OrgChart: React.FC<OrgChartProps> = ({ companyData }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();

  // Update expanded nodes when data changes
  useEffect(() => {
    if (companyData && companyData.firstNode) {
      // Start with root expanded if it has firstNode flag
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
          allIds.add(emp.id);
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
      // Expand path to employee
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
        // Zoom out when expanding to show new content
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

  // Build nodes and edges
  const { nodes, edges } = useMemo(() => {
    if (!companyData) {
      console.log('⚠️ No company data provided');
      return { nodes: [], edges: [] };
    }
    
    console.log('🔄 Building org chart from company data');
    
    const allNodes: Node[] = [];
    const allEdges: Edge[] = [];
    const processedCodes = new Set<number>();
    const usedPositions = new Set<string>(); // تتبع المواضع المستخدمة
    const levelCounts = new Map<number, number>(); // عدد العقد في كل مستوى
    
    // Function to recursively process employees
    const processEmployee = (employee: Employee, level: number, parentX: number = 0, siblingIndex: number = 0, totalSiblings: number = 1, isRoot: boolean = false, parentWidth: number = 0) => {
      if (processedCodes.has(employee.jobTitleCode)) return;
      processedCodes.add(employee.jobTitleCode);

      const cardWidth = 280;            // عرض الكارد
      const minSpacing = 50;             // الحد الأدنى للمسافة بين الكاردات
      const verticalSpacing = 350;      // مسافة عمودية
      
      // حساب المساحة المطلوبة للأطفال
      const calculateRequiredWidth = (childrenCount: number) => {
        if (childrenCount <= 1) return cardWidth;
        
        const totalCardsWidth = childrenCount * cardWidth;
        const totalSpacing = (childrenCount - 1) * minSpacing;
        const requiredWidth = totalCardsWidth + totalSpacing;
        
        // إضافة هامش إضافي إذا كان العدد كبير
        const extraMargin = childrenCount > 3 ? (childrenCount - 3) * 30 : 0;
        return requiredWidth + extraMargin;
      };
      
      // حساب المسافة الديناميكية بناءً على عدد الأطفال
      const calculateDynamicSpacing = (childrenCount: number, availableWidth: number) => {
        if (childrenCount <= 1) return minSpacing;
        
        const requiredWidth = calculateRequiredWidth(childrenCount);
        
        // إذا كانت المساحة المطلوبة أكبر من المتاحة، نوزع بالتساوي
        if (requiredWidth > availableWidth) {
          const maxPossibleSpacing = Math.max(
            minSpacing,
            (availableWidth - (childrenCount * cardWidth)) / (childrenCount - 1)
          );
          return Math.max(minSpacing, maxPossibleSpacing);
        }
        
        // إذا كانت المساحة كافية، نستخدم مسافة مريحة
        return Math.max(minSpacing, (requiredWidth - (childrenCount * cardWidth)) / (childrenCount - 1));
      };
      
      // Calculate position
      let x = parentX;
      
      if (isRoot) {
        // الجذر في المنتصف
        x = 0;
      } else if (level > 1) {
        if (totalSiblings === 1) {
          // إذا كان وحيد، ضعه تحت والده مباشرة مع إزاحة بسيطة لتجنب التداخل
          x = parentX;
        } else {
          // حساب المسافة الديناميكية
          const availableWidth = window.innerWidth * 0.8; // 80% من عرض الشاشة
          const dynamicSpacing = calculateDynamicSpacing(totalSiblings, availableWidth);
          const requiredSpacing = cardWidth + dynamicSpacing;
          
          const totalWidth = (totalSiblings - 1) * requiredSpacing;
          const startX = parentX - totalWidth / 2;
          x = startX + (siblingIndex * requiredSpacing);
          
          // تعديل إضافي للمستويات العميقة
          if (level > 3) {
            const levelMultiplier = Math.pow(1.2, level - 3);
            x = parentX + ((siblingIndex - (totalSiblings - 1) / 2) * requiredSpacing * levelMultiplier);
          }
        }
      }
      
      // نظام تجنب التداخل المحسن
      const gridSize = 30; // حجم الشبكة للتحقق من التداخل
      const positionKey = `${level}-${Math.round(x / gridSize)}`;
      let attempts = 0;
      const maxAttempts = 20;
      
      while (usedPositions.has(positionKey) && attempts < maxAttempts) {
        // إزاحة تدريجية بناءً على عدد المحاولات
        const offsetDirection = attempts % 2 === 0 ? 1 : -1;
        const offsetAmount = Math.ceil(attempts / 2) * (cardWidth + minSpacing);
        x += offsetDirection * offsetAmount;
        
        const newPositionKey = `${level}-${Math.round(x / gridSize)}`;
        if (!usedPositions.has(newPositionKey)) {
          break;
        }
        attempts++;
      }
      
      // حجز المساحة المطلوبة للكارد
      for (let i = -2; i <= 2; i++) {
        usedPositions.add(`${level}-${Math.round((x + i * gridSize) / gridSize)}`);
      }
      
      const y = (level - 1) * verticalSpacing;

      const hasChildren = employee.children && employee.children.length > 0;
      const isExpanded = expandedNodes.has(employee.jobTitleCode.toString());

      console.log(`👤 Processing: ${employee.name} (Level ${level}) - Children: ${hasChildren ? employee.children!.length : 0} - Expanded: ${isExpanded}`);

      // Create node
      allNodes.push({
        id: employee.jobTitleCode.toString(),
        type: 'employee',
        position: { x, y },
        data: {
          employee,
          hasChildren,
          isExpanded,
          onToggleExpand: () => toggleExpand(employee.jobTitleCode),
        },
        draggable: false,
        selectable: false,
      });

      // Process children if expanded
      if (hasChildren && isExpanded && employee.children) {
        // حساب العرض الإجمالي المطلوب للأطفال
        const childrenCount = employee.children.length;
        const availableWidth = window.innerWidth * 0.9; // 90% من عرض الشاشة للأطفال
        const dynamicSpacing = calculateDynamicSpacing(childrenCount, availableWidth);
        
        employee.children.forEach((child, index) => {
          // Create edge to child
          allEdges.push({
            id: `edge-${employee.jobTitleCode}-${child.jobTitleCode}`,
            source: employee.jobTitleCode.toString(),
            target: child.jobTitleCode.toString(),
            type: 'step',
            animated: false,
            style: {
              stroke: getLevelColor(employee.level).borderColor,
              strokeWidth: 3,
              strokeDasharray: '0'
            },
            markerEnd: {
              type: 'arrowclosed',
              width: 15,
              height: 15,
              color: getLevelColor(employee.level).borderColor,
            },
            sourceHandle: 'bottom',
            targetHandle: 'top',
          });

          // Process child recursively
          processEmployee(child, level + 1, x, index, employee.children!.length, false, availableWidth);
        });
      }
    };

    // Start processing from company data root
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