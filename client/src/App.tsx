import { Switch, Route, Redirect } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import LoginPage from "@/pages/login";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <Switch>
      <Route path="/login" component={LoginPage} />
      <Route path="/callback" component={LoginPage} />
      <Route path="/user-dashboard">
        {user?.role === 'user' ? <UserDashboard /> : <Redirect to="/admin-dashboard" />}
      </Route>
      <Route path="/admin-dashboard">
        {user?.role === 'admin' ? <AdminDashboard /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/">
        <Redirect to={user?.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'} />
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthenticatedApp />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
