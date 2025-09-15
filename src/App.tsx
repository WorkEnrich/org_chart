import React, { useState, useMemo, useEffect } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { Employee } from './types/Employee';
import { buildOrgTree } from './utils/orgChartUtils';
import OrgChart from './components/OrgChart';

// Global interface for external communication
declare global {
  interface Window {
    OrgChartAPI: {
      init: (companyData: Employee) => void;
      updateCompanyData: (companyData: Employee) => void;
      expandNode: (nodeId: string) => void;
      collapseNode: (nodeId: string) => void;
      expandAll: () => void;
      collapseAll: () => void;
      searchEmployee: (searchTerm: string) => void;
      filterByLevel: (level: string) => void;
      resetFilters: () => void;
      getStats: () => any;
      focusOnEmployee: (jobTitleCode: number) => void;
      clearChart: () => void;
    };
  }
}

function App() {
  // البدء بحالة فارغة - لا بيانات افتراضية
  const [companyData, setCompanyData] = useState<Employee | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

  const filteredData = useMemo(() => {
    if (!companyData) return null;
    
    // For now, return the original data
    // TODO: Implement filtering logic for hierarchical data
    return companyData;
  }, [companyData, searchTerm, selectedLevel]);

  const getAllEmployees = (data: Employee | null): Employee[] => {
    if (!data) return [];
    
    const employees: Employee[] = [];
    const traverse = (emp: Employee) => {
      employees.push(emp);
      if (emp.children) {
        emp.children.forEach(traverse);
      }
    };
    traverse(data);
    return employees;
  };

  const allEmployees = useMemo(() => {
    return getAllEmployees(companyData);
  }, [companyData]);

  const getLevels = (data: Employee | null): string[] => {
    if (!data) return [];
    
    const levels = new Set<string>();
    const traverse = (emp: Employee) => {
      levels.add(emp.level);
      if (emp.children) {
        emp.children.forEach(traverse);
      }
    };
    traverse(data);
    return Array.from(levels);
  };

  const orgTree = useMemo(() => {
    if (!filteredData) return [];
    return buildOrgTree(filteredData);
  }, [filteredData]);

  // Initialize the API when component mounts
  useEffect(() => {
    console.log('🚀 Setting up OrgChart API (New Data Structure)...');
    
    // Create the global API object
    window.OrgChartAPI = {
      // Initialize with company data
      init: (data: Employee) => {
        console.log('🚀 OrgChart.init() called with company data:', data);
        
        if (!data || typeof data !== 'object') {
          console.error('❌ Invalid company data provided to init()');
          alert('❌ خطأ: البيانات المرسلة غير صحيحة');
          return;
        }
        
        console.log('📊 Company data:', data);
        setCompanyData(data);
        setSearchTerm('');
        setSelectedLevel('');
        setIsInitialized(true);
        
        const employeeCount = getAllEmployees(data).length;
        console.log('✅ Chart initialized successfully with', employeeCount, 'employees');
        
        // إرسال إشعار للمطورين
        window.dispatchEvent(new CustomEvent('OrgChartInitialized', { 
          detail: { 
            employeeCount,
            levels: getLevels(data),
            success: true
          }
        }));
      },

      // Update company data
      updateCompanyData: (data: Employee) => {
        console.log('🔄 Updating company data:', data);
        if (!data || typeof data !== 'object') {
          console.error('❌ Invalid company data provided to updateCompanyData()');
          return;
        }
        setCompanyData(data);
        setIsInitialized(true);
        
        const employeeCount = getAllEmployees(data).length;
        console.log('✅ Company data updated successfully');
        
        window.dispatchEvent(new CustomEvent('OrgChartUpdated', { 
          detail: { employeeCount }
        }));
      },

      // Clear chart completely
      clearChart: () => {
        console.log('🗑️ Clearing chart...');
        setCompanyData(null);
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
          totalEmployees: allEmployees.length,
          levels: getLevels(companyData),
          filteredCount: allEmployees.length,
          isInitialized,
          hasFilters: !!(searchTerm || selectedLevel)
        };
        console.log('📊 Stats:', stats);
        return stats;
      },

      // Focus on specific employee
      focusOnEmployee: (jobTitleCode: number) => {
        console.log('🎯 Focusing on employee with code:', jobTitleCode);
        window.dispatchEvent(new CustomEvent('focusOnEmployee', { detail: { jobTitleCode } }));
      }
    };

    // Notify that the API is ready
    console.log('✅ OrgChart API is ready (New Data Structure - Waiting for data...)');
    window.dispatchEvent(new CustomEvent('OrgChartReady'));

    // Cleanup
    return () => {
      delete window.OrgChartAPI;
    };
  }, [allEmployees, isInitialized, searchTerm, selectedLevel, companyData]);

  // Debug logging
  useEffect(() => {
    console.log('🔍 App State Debug:');
    console.log('- Initialized:', isInitialized);
    console.log('- Company data:', companyData ? 'Available' : 'None');
    console.log('- All employees count:', allEmployees.length);
    console.log('- Search term:', searchTerm);
    console.log('- Selected level:', selectedLevel);
  }, [companyData, allEmployees, searchTerm, selectedLevel, isInitialized]);

  // Show waiting state if not initialized
  if (!isInitialized || !companyData) {
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
        <OrgChart companyData={filteredData} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;