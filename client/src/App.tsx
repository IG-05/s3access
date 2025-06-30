import { Switch, Route, Redirect, useLocation } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import LoginPage from "@/pages/login";
import CallbackPage from "@/pages/callback";
import UserDashboard from "@/pages/user-dashboard";
import AdminDashboard from "@/pages/admin-dashboard";
import AdminBuckets from "@/pages/admin-buckets";
import AdminUsers from "@/pages/admin-users";
import AdminRequests from "@/pages/admin-requests";
import AdminAnalytics from "@/pages/admin-analytics";
import AdminSettings from "@/pages/admin-settings";
import UserAccessRequests from "@/pages/user-access-requests";
import UserProfile from "@/pages/user-profile";
import BucketExplorerPage from "@/pages/bucket-explorer";
import NotFound from "@/pages/not-found";

function AuthenticatedApp() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [location] = useLocation();

  // Allow callback route to process without authentication check
  if (location === '/callback') {
    return <CallbackPage />;
  }

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
      <Route path="/callback" component={CallbackPage} />
      <Route path="/user-dashboard">
        {user?.role === 'user' ? <UserDashboard /> : <Redirect to="/admin-dashboard" />}
      </Route>
      <Route path="/admin-dashboard">
        {user?.role === 'admin' ? <AdminDashboard /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/access-requests">
        {user?.role === 'user' ? <UserAccessRequests /> : <Redirect to="/admin-dashboard" />}
      </Route>
      <Route path="/profile">
        {user?.role === 'user' ? <UserProfile /> : <Redirect to="/admin-dashboard" />}
      </Route>
      <Route path="/admin/buckets">
        {user?.role === 'admin' ? <AdminBuckets /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/admin/users">
        {user?.role === 'admin' ? <AdminUsers /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/admin/requests">
        {user?.role === 'admin' ? <AdminRequests /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/admin/analytics">
        {user?.role === 'admin' ? <AdminAnalytics /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/admin/settings">
        {user?.role === 'admin' ? <AdminSettings /> : <Redirect to="/user-dashboard" />}
      </Route>
      <Route path="/bucket/:bucketName">
        <BucketExplorerPage />
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
