import { useAuth } from "@/hooks/use-auth";
import { usePendingRequests } from "@/hooks/use-s3";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Shield, 
  TrendingUp, 
  Database, 
  Users, 
  Clock, 
  BarChart3, 
  Settings, 
  LogOut, 
  User 
} from "lucide-react";
import { Link, useLocation } from "wouter";

export function AdminSidebar() {
  const { user, logout } = useAuth();
  const { data: pendingRequests } = usePendingRequests();
  const [location] = useLocation();

  const menuItems = [
    { icon: TrendingUp, label: "Overview", path: "/admin-dashboard" },
    { icon: Database, label: "All Buckets", path: "/admin/buckets" },
    { icon: Users, label: "User Management", path: "/admin/users" },
    { 
      icon: Clock, 
      label: "Access Requests", 
      path: "/admin/requests",
      badge: pendingRequests?.length || 0
    },
    { icon: BarChart3, label: "Analytics", path: "/admin/analytics" },
    { icon: Settings, label: "Settings", path: "/admin/settings" },
  ];

  return (
    <aside className="w-64 bg-white shadow-sm border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
            <Shield className="text-white h-5 w-5" />
          </div>
          <div className="ml-3">
            <h2 className="text-lg font-semibold text-gray-900">S3 Manager</h2>
            <p className="text-sm text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.path || 
              (item.path === "/admin-dashboard" && location === "/");
            
            return (
              <li key={item.path}>
                <Link href={item.path}>
                  <a className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive 
                      ? "text-red-600 bg-red-50" 
                      : "text-gray-700 hover:bg-gray-100"
                  }`}>
                    <Icon className="h-4 w-4 mr-3" />
                    {item.label}
                    {item.badge && item.badge > 0 && (
                      <Badge 
                        variant="destructive" 
                        className="ml-auto text-xs px-2 py-1"
                      >
                        {item.badge}
                      </Badge>
                    )}
                  </a>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <div className="bg-gray-100 rounded-lg p-3">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <Shield className="text-white h-3 w-3" />
            </div>
            <div className="ml-3 flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user?.username || "Admin"}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user?.email || "admin@company.com"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            className="w-full mt-3 text-xs text-gray-600 hover:text-gray-800"
          >
            <LogOut className="h-3 w-3 mr-1" />
            Sign Out
          </Button>
        </div>
      </div>
    </aside>
  );
}
