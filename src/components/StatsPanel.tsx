import React from 'react';
import { Employee } from '../types/Employee';
import { Users, Building2, TrendingUp, Award } from 'lucide-react';

interface StatsPanelProps {
  employees: Employee[];
}

const StatsPanel: React.FC<StatsPanelProps> = ({ employees }) => {
  const departmentCounts = employees.reduce((acc, emp) => {
    acc[emp.department] = (acc[emp.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const levelCounts = employees.reduce((acc, emp) => {
    acc[emp.level] = (acc[emp.level] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const totalEmployees = employees.length;
  const totalDepartments = Object.keys(departmentCounts).length;
  const avgLevel = employees.reduce((sum, emp) => sum + emp.level, 0) / totalEmployees;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
        <TrendingUp className="w-6 h-6 text-blue-600" />
        Organization Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">Total Employees</span>
          </div>
          <span className="text-2xl font-bold text-blue-900">{totalEmployees}</span>
        </div>

        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="flex items-center gap-2 mb-2">
            <Building2 className="w-5 h-5 text-green-600" />
            <span className="text-sm font-medium text-green-700">Departments</span>
          </div>
          <span className="text-2xl font-bold text-green-900">{totalDepartments}</span>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-medium text-purple-700">Avg Level</span>
          </div>
          <span className="text-2xl font-bold text-purple-900">{avgLevel.toFixed(1)}</span>
        </div>

        <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-orange-600" />
            <span className="text-sm font-medium text-orange-700">Largest Dept</span>
          </div>
          <span className="text-2xl font-bold text-orange-900">
            {Math.max(...Object.values(departmentCounts))}
          </span>
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Department Distribution</h3>
          <div className="space-y-2">
            {Object.entries(departmentCounts)
              .sort(([,a], [,b]) => b - a)
              .map(([dept, count]) => (
                <div key={dept} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">{dept}</span>
                  <span className="text-gray-900 font-bold">{count}</span>
                </div>
              ))}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Level Distribution</h3>
          <div className="space-y-2">
            {Object.entries(levelCounts)
              .sort(([a], [b]) => parseInt(a) - parseInt(b))
              .map(([level, count]) => (
                <div key={level} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                  <span className="font-medium text-gray-700">Level {level}</span>
                  <span className="text-gray-900 font-bold">{count}</span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPanel;