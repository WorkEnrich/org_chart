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
  const [isInitialized, setIsInitialized] = useState(false);

  const orgTree = useMemo(
    () => (chartData ? buildOrgTree(chartData, chartType) : []),
    [chartData, chartType]
  );

  useEffect(() => {
    console.log("🚀 Setting up Chart API (setData only)...");

    // Define only setData
    window.OrgChartAPI = {
      setData: (data: any, type: "orgChart" | "companyChart" = "orgChart") => {
        console.log("📩 setData called:", data);
        setChartData(data);
        setChartType(type);
        setIsInitialized(true);
      }
    };

    // ✅ Listen for postMessage from parent
    const handleMessage = (event: MessageEvent) => {

      console.log("📩 Message received:", event.data);

      const { action, payload, chartType } = event.data;
      if (action === "setData") {
        window.OrgChartAPI.setData(payload, chartType);
      } else {
        console.warn("⚠️ Unknown action:", action);
      }
    };

    window.addEventListener("message", handleMessage);

    console.log("✅ Chart API ready (setData only). Waiting for data...");
    return () => {
      delete window.OrgChartAPI;
      window.removeEventListener("message", handleMessage);
    };
  }, [chartData, chartType, isInitialized]);

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

