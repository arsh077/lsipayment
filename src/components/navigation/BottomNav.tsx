import React from 'react';
import { LayoutDashboard, Briefcase, Users, Upload, FileBarChart } from 'lucide-react';
import { cn } from '../../lib/utils';

export type TabType = 'dashboard' | 'main-sales' | 'employee-sales' | 'import' | 'reports';

interface BottomNavProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'main-sales', label: 'Main', icon: Briefcase },
    { id: 'employee-sales', label: 'Staff', icon: Users },
    { id: 'import', label: 'Import', icon: Upload },
    { id: 'reports', label: 'Reports', icon: FileBarChart },
  ] as const;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 pb-safe md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                isActive ? "text-primary" : "text-gray-400 hover:text-gray-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "drop-shadow-[0_0_8px_rgba(59,130,246,0.3)]")} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

