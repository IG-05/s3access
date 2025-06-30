import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Database, Clock, User, LogOut, Cloud } from "lucide-react";
import { Link, useLocation } from "wouter";

export function Sidebar() {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const menuItems = [
    { icon: Database, label: "My Buckets", path: "/user-dashboard" },
    { icon: Clock, label: "Access Requests", path: "/access-requests" },
    { icon: User, label: "Profile", path: "/profile" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 shadow-sm border-r border-gray-200 dark:border-gray-700 min-h-screen">
      <div className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <Cloud className="text-white h-5 w-5" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">S3 Manager</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">User Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || 
              (item.path === "/user-dashboard" && location === "/");
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "text-primary bg-primary/10 dark:bg-primary/20" 
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}>
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="text-white h-4 w-4" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {user?.username || "User"}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {user?.email || "user@company.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="w-full mt-3 text-xs text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
