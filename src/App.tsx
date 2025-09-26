import React, { useState, useMemo, useEffect } from "react";
import { ReactFlowProvider } from "reactflow";
import { buildOrgTree } from "./utils/orgChartUtils";
import OrgChart from "./components/OrgChart";

// Define external API interface
declare global {
  interface Window {
    OrgChartAPI: any;
  }
}

function App() {
  const [chartData, setChartData] = useState<any>(null);
  const [chartType, setChartType] = useState<"orgChart" | "companyChart">(
    "orgChart"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);

  // helpers
  const getAllItems = (data: any): any[] => {
    if (!data) return [];
    const items: any[] = [];
    const traverse = (item: any) => {
      items.push(item);
      if (item.children) item.children.forEach(traverse);
    };
    Array.isArray(data) ? data.forEach(traverse) : traverse(data);
    return items;
  };

  const allItems = useMemo(() => getAllItems(chartData), [chartData]);

  const getLevels = (data: any): string[] => {
    if (!data) return [];
    const levels = new Set<string>();
    const traverse = (item: any) => {
      if (item.level) levels.add(item.level);
      if (item.job_level) levels.add(item.job_level);
      if (item.children) item.children.forEach(traverse);
    };
    Array.isArray(data) ? data.forEach(traverse) : traverse(data);
    return Array.from(levels);
  };

  const orgTree = useMemo(
    () => (chartData ? buildOrgTree(chartData, chartType) : []),
    [chartData, chartType]
  );

  // Setup API
  useEffect(() => {
    console.log("🚀 Setting up Chart API...");

    window.OrgChartAPI = {
      setData: (data: any, type: "orgChart" | "companyChart" = "orgChart") => {
        setChartData(data);
        setChartType(type);
        setSearchTerm("");
        setSelectedLevel("");
        setIsInitialized(true);
      },
      updateData: (data: any, type: "orgChart" | "companyChart" = "orgChart") => {
        setChartData(data);
        setChartType(type);
        setIsInitialized(true);
      },
      clearChart: () => {
        setChartData(null);
        setSearchTerm("");
        setSelectedLevel("");
        setIsInitialized(false);
      },
      expandNode: (nodeId: string) => {
        window.dispatchEvent(new CustomEvent("expandNode", { detail: { nodeId } }));
      },
      collapseNode: (nodeId: string) => {
        window.dispatchEvent(new CustomEvent("collapseNode", { detail: { nodeId } }));
      },
      expandAll: () => window.dispatchEvent(new Event("expandAll")),
      collapseAll: () => window.dispatchEvent(new Event("collapseAll")),
      searchEmployee: (term: string) => setSearchTerm(term),
      filterByLevel: (level: string) => setSelectedLevel(level),
      resetFilters: () => {
        setSearchTerm("");
        setSelectedLevel("");
      },
      getStats: () => ({
        totalItems: allItems.length,
        chartType,
        levels: getLevels(chartData),
        isInitialized,
      }),
      focusOnEmployee: (identifier: string | number) => {
        window.dispatchEvent(
          new CustomEvent("focusOnEmployee", { detail: { identifier } })
        );
      },
    };

    // ✅ Listen for postMessage from parent
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://dev-client.talentdot.org" &&
        event.origin !== "https://orgchart.talentdot.org") {
        console.warn("❌ Blocked message from unknown origin:", event.origin);
        return;
      }

      console.log("📩 Message received:", event.data);

      const { action, payload, chartType } = event.data;
      if (window.OrgChartAPI[action]) {
        window.OrgChartAPI[action](payload, chartType);
      } else {
        console.warn("⚠️ Unknown action:", action);
      }
    };

    window.addEventListener("message", handleMessage);

    console.log("✅ Chart API ready. Waiting for data...");
    return () => {
      delete window.OrgChartAPI;
      window.removeEventListener("message", handleMessage);
    };
  }, [allItems, chartData, chartType, isInitialized]);

  if (!isInitialized || !chartData) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-xl font-bold text-gray-700">No data to preview</h2>
      </div>
    );
  }

  return (
    <ReactFlowProvider>
      <div className="w-full h-screen bg-gray-50">
        <OrgChart chartData={orgTree} chartType={chartType} />
      </div>
    </ReactFlowProvider>
  );
}

export default App;