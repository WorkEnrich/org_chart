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

  // Update expanded nodes when data changes
  useEffect(() => {
    if (chartData) {
      const rootItems = Array.isArray(chartData) ? chartData : [chartData];
      const expandedIds = new Set<string>();
      
      rootItems.forEach(item => {
        if (item.firstNode && item.expanded) {
          const id = getItemId(item, chartType);
          expandedIds.add(id);
        }
      });
      
      if (expandedIds.size > 0) {
        setExpandedNodes(expandedIds);
      }
    }
  }, [chartData, chartType]);

  // Helper function to get item ID based on chart type
  const getItemId = (item: any, type: 'orgChart' | 'companyChart'): string => {
    if (type === 'orgChart') {
      return item.job_title_code || item.id || item.name;
    } else {
      return item.id?.toString() || item.code || item.name;
    }
  };

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
      const collectIds = (item: any) => {
        const id = getItemId(item, chartType);
        allIds.add(id);
        if (item.children) {
          item.children.forEach(collectIds);
        }
      };
      
      if (chartData) {
        if (Array.isArray(chartData)) {
          chartData.forEach(collectIds);
        } else {
          collectIds(chartData);
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
      const expandPath = (item: any, targetId: string | number, path: string[] = []): string[] | null => {
        const currentId = getItemId(item, chartType);
        const currentPath = [...path, currentId];
        
        if (currentId === identifier.toString() || 
            (chartType === 'orgChart' && item.job_title_code === identifier) ||
            (chartType === 'companyChart' && item.id === identifier)) {
          return currentPath;
        }
        if (item.children) {
          for (const child of item.children) {
            const result = expandPath(child, targetId, currentPath);
            if (result) return result;
          }
        }
        return null;
      };

      if (chartData) {
        let pathToItem: string[] | null = null;
        
        if (Array.isArray(chartData)) {
          for (const item of chartData) {
            pathToItem = expandPath(item, identifier);
            if (pathToItem) break;
          }
        } else {
          pathToItem = expandPath(chartData, identifier);
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
  }, [chartData, chartType, fitView]);

  const toggleExpand = useCallback((item: any) => {
    const nodeId = getItemId(item, chartType);
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
  }, [fitView, chartType]);

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
    
    // Find all root items (items without parents)
    const findRootItems = (data: any): any[] => {
      if (Array.isArray(data)) {
        return data.filter(item => item.firstNode || !hasParent(item, data));
      } else {
        return [data];
      }
    };
    
    // Check if an item has a parent in the data
    const hasParent = (item: any, allData: any[]): boolean => {
      const itemId = getItemId(item, chartType);
      return allData.some(otherItem => 
        otherItem.children && 
        otherItem.children.some((child: any) => getItemId(child, chartType) === itemId)
      );
    };
    
    const rootItems = findRootItems(chartData);
    console.log('🌳 Found root items:', rootItems.length);
    
    // Function to recursively process items
    const processItem = (item: any, level: number, parentX: number = 0, siblingIndex: number = 0, totalSiblings: number = 1, isRoot: boolean = false) => {
      const itemId = getItemId(item, chartType);
      if (processedIds.has(itemId)) return;
      processedIds.add(itemId);

      const horizontalSpacing = 450; // زيادة المسافة الأفقية
      const verticalSpacing = 350;   // زيادة المسافة العمودية
      
      // Calculate position
      let x = parentX;
      if (isRoot && level === 1) {
        // For root items, arrange them side by side
        const totalRootWidth = Math.max((totalSiblings - 1) * horizontalSpacing, 0);
        const startX = -totalRootWidth / 2;
        x = startX + (siblingIndex * horizontalSpacing);
      } else if (level > 1) {
        // حساب أفضل للمواضع لتجنب التداخل
        const totalWidth = Math.max((totalSiblings - 1) * horizontalSpacing, horizontalSpacing);
        const startX = parentX - totalWidth / 2;
        x = startX + (siblingIndex * horizontalSpacing);
        
        // تجنب التداخل مع العقد الموجودة
        const existingPositions = allNodes.filter(n => Math.abs(n.position.y - ((level - 1) * verticalSpacing)) < 50);
        while (existingPositions.some(n => Math.abs(n.position.x - x) < 300)) {
          x += horizontalSpacing * 0.3;
        }
      }
      
      const y = (level - 1) * verticalSpacing;

      const hasChildren = item.children && item.children.length > 0;
      const isExpanded = expandedNodes.has(itemId);

      console.log(`👤 Processing: ${item.name} (Level ${level}) - Children: ${hasChildren ? item.children!.length : 0} - Expanded: ${isExpanded}`);

      // Create node
      allNodes.push({
        id: itemId,
        type: 'employee',
        position: { x, y },
        data: {
          item,
          chartType,
          hasChildren,
          isExpanded,
          onToggleExpand: () => toggleExpand(item),
        },
        draggable: false,
        selectable: false,
      });

      // Process children if expanded
      if (hasChildren && isExpanded && item.children) {
        item.children.forEach((child: any, index: number) => {
          // Get current item's border color for the connection line
          const currentCardColors = getItemColor(item, chartType);
          
          // Create edge to child
          const childId = getItemId(child, chartType);
          allEdges.push({
            id: `edge-${itemId}-${childId}`,
            source: itemId,
            target: childId,
            type: 'smoothstep',
            animated: false,
            style: {
              stroke: currentCardColors.borderColor,
              strokeWidth: 4,
              strokeDasharray: '0',
            },
            markerEnd: {
              type: 'arrowclosed',
              width: 20,
              height: 20,
              color: currentCardColors.borderColor,
            },
          });

          // Process child recursively
          processItem(child, level + 1, x, index, item.children!.length, false);
        });
      }
    };

    // Process all root items side by side
    rootItems.forEach((item, index) => {
      processItem(item, 1, 0, index, rootItems.length, true);
    });

    console.log('📊 Generated nodes:', allNodes.length);
    console.log('🔗 Generated edges:', allEdges.length);

    return { nodes: allNodes, edges: allEdges };
  }, [chartData, chartType, expandedNodes, toggleExpand]);

  // Helper function to get item color based on chart type
  const getItemColor = (item: any, type: 'orgChart' | 'companyChart') => {
    if (type === 'orgChart') {
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