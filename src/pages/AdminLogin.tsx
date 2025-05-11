import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import AdminLoginForm from '@/components/AdminLoginForm';
import { useAdminAuth } from '@/hooks/use-admin-auth';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminLogin = () => {
  const { isAuthenticated, isLoading, adminUser } = useAdminAuth();
  const navigate = useNavigate();
  const [redirectAttempted, setRedirectAttempted] = useState(false);

  // Redirect to admin dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate('/admin/dashboard');
      setRedirectAttempted(true);
    }
  }, [isAuthenticated, isLoading, navigate, adminUser]);

  // Handle manual redirect
  const handleManualRedirect = () => {
    window.location.href = '/#/admin/dashboard';
  };

  return (
    <Layout
      title="Admin Login | NBKRIST Student Portal"
      description="Secure login for NBKRIST Student Portal administrators."
      keywords="nbkr admin, nbkrist admin login, nbkr student portal admin"
      ogImage="https://nbkrstudenthub.me/NBKRIST_logo.png"
    >
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold text-center mb-8">Admin Login</h1>

          {isAuthenticated && (
            <Alert className="mb-4 bg-green-50 border-green-200 text-green-800">
              <AlertDescription>
                You are already logged in!
                <Button
                  variant="link"
                  className="text-green-800 font-medium p-0 ml-1"
                  onClick={handleManualRedirect}
                >
                  Go to Dashboard
                </Button>
              </AlertDescription>
            </Alert>
          )}



          <AdminLoginForm onLoginSuccess={handleManualRedirect} />

          {isAuthenticated && (
            <div className="mt-4 text-center">
              <Button
                onClick={handleManualRedirect}
                className="bg-green-600 hover:bg-green-700"
              >
                Go to Admin Dashboard
              </Button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default AdminLogin;
