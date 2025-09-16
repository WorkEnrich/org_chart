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
import { getLevelColor, getCardBorderColor } from '../utils/orgChartUtils';

interface OrgChartProps {
  chartData: any;
  chartType: 'orgChart' | 'companyChart';
}

const nodeTypes = {
  employee: EmployeeNode,
};

const OrgChart: React.FC<OrgChartProps> = ({ chartData, chartType }) => {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const { fitView } = useReactFlow();

  // Helper function to generate unique ID for items based on their position in hierarchy
  const generateItemId = useCallback((item: any, parentId: string = '', index: number = 0): string => {
    // Use name + position in hierarchy to create unique ID
    const baseName = item.name || `item-${index}`;
    return parentId ? `${parentId}-${baseName}-${index}` : `root-${baseName}-${index}`;
  }, []);

  // Update expanded nodes when data changes
  useEffect(() => {
    if (chartData) {
      const rootItems = Array.isArray(chartData) ? chartData : [chartData];
      const expandedIds = new Set<string>();
      
      rootItems.forEach((item, index) => {
        if (item.firstNode && item.expanded) {
          const id = generateItemId(item, '', index);
          expandedIds.add(id);
        }
      });
      
      if (expandedIds.size > 0) {
        setExpandedNodes(expandedIds);
      }
    }
  }, [chartData, chartType]);

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
      const collectIds = (item: any, parentId: string = '', index: number = 0) => {
        const id = generateItemId(item, parentId, index);
        allIds.add(id);
        if (item.children) {
          item.children.forEach((child: any, childIndex: number) => collectIds(child, id, childIndex));
        }
      };
      
      if (chartData) {
        if (Array.isArray(chartData)) {
          chartData.forEach((item, index) => collectIds(item, '', index));
        } else {
          collectIds(chartData, '', 0);
        }
      }
      setExpandedNodes(allIds);
    };

    const handleCollapseAll = () => {
      setExpandedNodes(new Set());
    };

    const handleFocusOnEmployee = (event: CustomEvent) => {
      const { identifier } = event.detail;
      // Expand path to item
      const expandPath = (item: any, targetId: string | number, path: string[] = [], parentId: string = '', index: number = 0): string[] | null => {
        const currentId = generateItemId(item, parentId, index);
        const currentPath = [...path, currentId];
        
        // Check if this is the target item by name or original identifiers
        if (item.name === identifier.toString() || 
            (item.job_title_code && item.job_title_code === identifier) ||
            (item.id && item.id === identifier) ||
            (item.code && item.code === identifier)) {
          return currentPath;
        }
        if (item.children) {
          for (let i = 0; i < item.children.length; i++) {
            const child = item.children[i];
            const result = expandPath(child, targetId, currentPath, currentId, i);
            if (result) return result;
          }
        }
        return null;
      };

      if (chartData) {
        let pathToItem: string[] | null = null;
        
        if (Array.isArray(chartData)) {
          for (let i = 0; i < chartData.length; i++) {
            pathToItem = expandPath(chartData[i], identifier, [], '', i);
            if (pathToItem) break;
          }
        } else {
          pathToItem = expandPath(chartData, identifier, [], '', 0);
        }
        
        if (pathToItem) {
          setExpandedNodes(new Set(pathToItem));
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
  }, [chartData, chartType, fitView, generateItemId]);

  const toggleExpand = useCallback((nodeId: string) => {
    console.log('🔄 Toggling expand for node:', nodeId);
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
        console.log('❌ Collapsing node:', nodeId);
      } else {
        newSet.add(nodeId);
        console.log('✅ Expanding node:', nodeId);
      }
      console.log('📊 Expanded nodes:', Array.from(newSet));
      return newSet;
    });
  }, [fitView]);

  // Build nodes and edges
  const { nodes, edges } = useMemo(() => {
    if (!chartData) {
      console.log('⚠️ No chart data provided');
      return { nodes: [], edges: [] };
    }
    
    console.log(`🔄 Building ${chartType} chart from data`);
    
    const allNodes: Node[] = [];
    const allEdges: Edge[] = [];
    const processedIds = new Set<string>();
    
    // Helper function to get item color based on chart type
    const getItemColor = (item: any, type: 'orgChart' | 'companyChart') => {
      if (type === 'orgChart') {
        let code = 0;
        if (item.job_title_code) {
          code = typeof item.job_title_code === 'string' ? item.job_title_code.hashCode() : item.job_title_code;
        } else if (item.name) {
          code = typeof item.name === 'string' ? item.name.hashCode() : 0;
        } else {
          code = Math.random() * 1000;
        }
        return getCardBorderColor(Math.abs(code), item.level || item.job_level || 'Staff');
      } else {
        let id = 0;
        if (item.id) {
          id = typeof item.id === 'string' ? item.id.hashCode() : item.id;
        } else if (item.name) {
          id = typeof item.name === 'string' ? item.name.hashCode() : 0;
        } else {
          id = Math.random() * 1000;
        }
        return getCardBorderColor(Math.abs(id), item.type || 'company');
      }
    };

    // Helper function to get unique color for each item
    const getUniqueItemColor = (item: any, type: 'orgChart' | 'companyChart', siblingIndex: number, level: number, parentId: string = '') => {
      // إنشاء seed فريد لكل كارد بناءً على عدة عوامل
      let seed = 0;
      
      // استخدام اسم العنصر
      if (item.name) {
        seed += typeof item.name === 'string' ? item.name.hashCode() : 0;
      }
      
      // إضافة موقع العنصر في الهيكل
      seed += siblingIndex * 1000;
      seed += level * 100;
      
      // إضافة معرف الأب لضمان التفرد
      if (parentId) {
        seed += parentId.hashCode();
      }
      
      // إضافة عوامل إضافية للتفرد
      if (type === 'orgChart') {
        if (item.job_title_code) {
          seed += typeof item.job_title_code === 'string' ? item.job_title_code.hashCode() : item.job_title_code;
        }
        if (item.position) {
          seed += item.position.hashCode();
        }
      } else {
        if (item.id) {
          seed += typeof item.id === 'string' ? item.id.hashCode() : item.id;
        }
        if (item.code) {
          seed += item.code.hashCode();
        }
      }
      
      const itemLevel = type === 'orgChart' ? (item.level || item.job_level || 'Staff') : (item.type || 'company');
      return getCardBorderColor(Math.abs(seed), itemLevel);
    };

    // Find root items - items that are at the top level or marked as firstNode
    const rootItems = Array.isArray(chartData) ? chartData : [chartData];
    console.log('🌳 Found root items:', rootItems.length);
    
    // Function to recursively process items
    const processItem = (item: any, level: number, parentX: number = 0, siblingIndex: number = 0, totalSiblings: number = 1, isRoot: boolean = false, parentId: string = '', isInExpandedBranch: boolean = false) => {
      // Generate unique ID based on hierarchy position
      const itemId = generateItemId(item, parentId, siblingIndex);
      
      if (processedIds.has(itemId)) return;
      processedIds.add(itemId);

      const isExpanded = expandedNodes.has(itemId);
      
      // مسافات ثابتة للتخطيط الهرمي
      const horizontalSpacing = 350; // مسافة ثابتة بين العقد أفقياً
      const verticalSpacing = 180;   // مسافة ثابتة بين المستويات عمودياً
      
      // Calculate position
      let x = parentX;
      if (isRoot && level === 1) {
        // ترتيب العقد الجذرية جنباً إلى جنب
        const totalRootWidth = Math.max((totalSiblings - 1) * horizontalSpacing, 0);
        const startX = -totalRootWidth / 2;
        x = startX + (siblingIndex * horizontalSpacing);
      } else if (level > 1) {
        // حساب المواضع للمستويات الفرعية
        const totalWidth = Math.max((totalSiblings - 1) * horizontalSpacing, horizontalSpacing * 1.2);
        const startX = parentX - totalWidth / 2;
        x = startX + (siblingIndex * horizontalSpacing);
      }
      
      const y = (level - 1) * verticalSpacing;

      const hasChildren = item.children && item.children.length > 0;

      // Get unique color for this item - تمرير parentId للمزيد من التفرد
      const itemColors = getUniqueItemColor(item, chartType, siblingIndex, level, parentId);

      console.log(`👤 Processing: ${item.name} (Level ${level}) - Children: ${hasChildren ? item.children!.length : 0} - Expanded: ${isExpanded}`);

      // Create node
      allNodes.push({
        id: itemId,
        type: 'employee',
        position: { x, y },
        data: {
          item,
          chartType,
          itemColors,
          hasChildren,
          isExpanded,
          onToggleExpand: () => toggleExpand(itemId),
        },
        draggable: false,
        selectable: false,
      });

      // Process children if expanded
      if (hasChildren && isExpanded && item.children) {
        item.children.forEach((child: any, index: number) => {
          const childId = generateItemId(child, itemId, index);
          
          // Create edge to child (parent -> child relationship)
          allEdges.push({
            id: `edge-${itemId}-${childId}`,
            source: itemId,
            target: childId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: itemColors.borderColor,
              strokeWidth: 4,
              strokeDasharray: '0',
            },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: itemColors.borderColor,
            },
          });

          // Process child recursively
          processItem(child, level + 1, x, index, item.children!.length, false, itemId, false);
        });
      }
    };

    // Process all root items side by side
    rootItems.forEach((item, index) => {
      processItem(item, 1, 0, index, rootItems.length, true, '', false);
    });

    console.log('📊 Generated nodes:', allNodes.length);
    console.log('🔗 Generated edges:', allEdges.length);

    return { nodes: allNodes, edges: allEdges };
  }, [chartData, chartType, expandedNodes, toggleExpand, generateItemId]);

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
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background 
          color="#e2e8f0" 
          gap={20} 
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