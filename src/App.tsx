import React, { useState, useMemo, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Employee } from './types/Employee';
import { buildOrgTree } from './utils/orgChartUtils';
import OrgChart from './components/OrgChart';

// Global interface for external communication
declare global {
  interface Window {
    OrgChartAPI: {
      init: (data: any, chartType: 'orgChart' | 'companyChart') => void;
      updateData: (data: any, chartType: 'orgChart' | 'companyChart') => void;
      expandNode: (nodeId: string) => void;
      collapseNode: (nodeId: string) => void;
      expandAll: () => void;
      collapseAll: () => void;
      searchEmployee: (searchTerm: string) => void;
      filterByLevel: (level: string) => void;
      resetFilters: () => void;
      getStats: () => any;
      focusOnEmployee: (identifier: string | number) => void;
      clearChart: () => void;
    };
  }
}

function App() {
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<'orgChart' | 'companyChart'>('orgChart');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const filteredData = useMemo(() => {
    if (!chartData) return null;
    
    return chartData;
  }, [chartData, searchTerm, selectedLevel]);

  const getAllItems = (data: any): any[] => {
    if (!data) return [];
    
    const items: any[] = [];
    const traverse = (item: any) => {
      items.push(item);
      if (item.children) {
        item.children.forEach(traverse);
      }
    };
    
    if (Array.isArray(data)) {
      data.forEach(traverse);
    } else {
      traverse(data);
    }
    return items;
  };

  const allItems = useMemo(() => {
    return getAllItems(chartData);
  }, [chartData]);

  const getLevels = (data: any): string[] => {
    if (!data) return [];
    
    const levels = new Set<string>();
    const traverse = (item: any) => {
      if (item.level) levels.add(item.level);
      if (item.job_level) levels.add(item.job_level);
      if (item.children) {
        item.children.forEach(traverse);
      }
    };
    
    if (Array.isArray(data)) {
      data.forEach(traverse);
    } else {
      traverse(data);
    }
    return Array.from(levels);
  };

  const orgTree = useMemo(() => {
    if (!filteredData) return [];
    return buildOrgTree(filteredData, chartType);
  }, [filteredData, chartType]);

  // Initialize the API when component mounts
  useEffect(() => {
    console.log('🚀 Setting up Chart API (Multi-Type Support)...');
    
    // Create the global API object
    window.OrgChartAPI = {
      // Initialize with data and chart type
      init: (data: any, type: 'orgChart' | 'companyChart' = 'orgChart') => {
        console.log(`🚀 Chart.init() called with ${type} data:`, data);
        
        if (!data || typeof data !== 'object') {
          console.error('❌ Invalid data provided to init()');
          alert('❌ خطأ: البيانات المرسلة غير صحيحة');
          return;
        }
        
        console.log(`📊 ${type} data:`, data);
        setChartData(data);
        setChartType(type);
        setSearchTerm('');
        setSelectedLevel('');
        setIsInitialized(true);
        
        const itemCount = getAllItems(data).length;
        console.log(`✅ ${type} initialized successfully with`, itemCount, 'items');
        
        window.dispatchEvent(new CustomEvent('OrgChartInitialized', { 
          detail: { 
            itemCount,
            chartType: type,
            levels: getLevels(data),
            success: true
          }
        }));
      },

      // Update data
      updateData: (data: any, type: 'orgChart' | 'companyChart' = 'orgChart') => {
        console.log(`🔄 Updating ${type} data:`, data);
        if (!data || typeof data !== 'object') {
          console.error('❌ Invalid data provided to updateData()');
          return;
        }
        setChartData(data);
        setChartType(type);
        setIsInitialized(true);
        
        const itemCount = getAllItems(data).length;
        console.log(`✅ ${type} data updated successfully`);
        
        window.dispatchEvent(new CustomEvent('OrgChartUpdated', { 
          detail: { itemCount, chartType: type }
        }));
      },

      // Clear chart completely
      clearChart: () => {
        console.log('🗑️ Clearing chart...');
        setChartData(null);
        setSearchTerm('');
        setSelectedLevel('');
        setIsInitialized(false);
        console.log('✅ Chart cleared');
        
        window.dispatchEvent(new CustomEvent('OrgChartCleared'));
      },

      // Expand specific node
      expandNode: (nodeId: string) => {
        console.log('📈 Expanding node:', nodeId);
        window.dispatchEvent(new CustomEvent('expandNode', { detail: { nodeId } }));
      },

      // Collapse specific node
      collapseNode: (nodeId: string) => {
        console.log('📉 Collapsing node:', nodeId);
        window.dispatchEvent(new CustomEvent('collapseNode', { detail: { nodeId } }));
      },

      // Expand all nodes
      expandAll: () => {
        console.log('📈 Expanding all nodes');
        window.dispatchEvent(new CustomEvent('expandAll'));
      },

      // Collapse all nodes
      collapseAll: () => {
        console.log('📉 Collapsing all nodes');
        window.dispatchEvent(new CustomEvent('collapseAll'));
      },

      // Search for employee
      searchEmployee: (searchTerm: string) => {
        console.log('🔍 Searching for:', searchTerm);
        setSearchTerm(searchTerm);
        
        window.dispatchEvent(new CustomEvent('OrgChartSearched', { 
          detail: { searchTerm, resultCount: allEmployees.length }
        }));
      },

      // Filter by level
      filterByLevel: (level: string) => {
        console.log('🏢 Filtering by level:', level);
        setSelectedLevel(level);
        
        window.dispatchEvent(new CustomEvent('OrgChartFiltered', { 
          detail: { level, resultCount: allEmployees.length }
        }));
      },

      // Reset all filters
      resetFilters: () => {
        console.log('🔄 Resetting filters');
        setSearchTerm('');
        setSelectedLevel('');
        
        window.dispatchEvent(new CustomEvent('OrgChartFiltersReset'));
      },

      // Get statistics
      getStats: () => {
        const stats = {
          totalItems: allItems.length,
          chartType,
          levels: getLevels(chartData),
          filteredCount: allItems.length,
          isInitialized,
          hasFilters: !!(searchTerm || selectedLevel)
        };
        console.log('📊 Stats:', stats);
        return stats;
      },

      // Focus on specific item
      focusOnEmployee: (identifier: string | number) => {
        console.log('🎯 Focusing on item with identifier:', identifier);
        window.dispatchEvent(new CustomEvent('focusOnEmployee', { detail: { identifier } }));
      }
    };

    // Notify that the API is ready
    console.log('✅ Chart API is ready (Multi-Type Support - Waiting for data...)');
    window.dispatchEvent(new CustomEvent('OrgChartReady'));

    // Cleanup
    return () => {
      delete window.OrgChartAPI;
    };
  }, [allItems, isInitialized, searchTerm, selectedLevel, chartData, chartType]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 App State Debug:');
    console.log('- Initialized:', isInitialized);
    console.log('- Chart data:', chartData ? 'Available' : 'None');
    console.log('- Chart type:', chartType);
    console.log('- All items count:', allItems.length);
    console.log('- Search term:', searchTerm);
    console.log('- Selected level:', selectedLevel);
  }, [chartData, allItems, searchTerm, selectedLevel, isInitialized, chartType]);

  // Show waiting state if not initialized
  if (!isInitialized || !chartData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto p-8">
          {/* Icon Container */}
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center shadow-sm">
            <svg className="w-10 h-10 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-900 mb-3">No data to preview</h2>
          
          {/* Subtitle */}
          
          {/* Status Indicator */}
        </div>
      </div>
    );
  }

  // Show the chart
  return (
    <ReactFlowProvider>
      <div className="w-full h-screen bg-gray-50">
        <OrgChart chartData={filteredData} chartType={chartType} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;