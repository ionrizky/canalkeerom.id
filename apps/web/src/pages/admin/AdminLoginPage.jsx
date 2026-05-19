import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Shield, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Footer from '@/components/Footer.jsx';

export default function AdminLoginPage() {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  // Redirect authenticated users away from the login page
  if (!isLoading && isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    
    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    if (!cleanUser || !cleanPass) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief network delay for better UX feedback
    await new Promise(resolve => setTimeout(resolve, 600));

    const result = await login(cleanUser, cleanPass);
    
    if (result.success) {
      toast.success('Login successful. Welcome back!');
      setUsernameInput('');
      setPasswordInput('');
      navigate('/admin/dashboard');
    } else {
      setError(result.message || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col w-full bg-background">
      <main className="flex-1 flex items-center justify-center p-6 py-20">
        <Card className="w-full max-w-md shadow-xl border-border">
          <CardHeader className="text-center pb-8 pt-8">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary">
              <Shield size={32} />
            </div>
            <CardTitle className="text-3xl font-bold text-foreground">Admin Portal</CardTitle>
            <p className="text-muted-foreground mt-2">Manage Portal Budaya Keerom</p>
          </CardHeader>
          <form onSubmit={handleLogin}>
            <CardContent className="space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md font-medium text-center">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Username</label>
                <Input 
                  type="text" 
                  placeholder="admin" 
                  value={usernameInput}
                  onChange={(e) => {
                    setUsernameInput(e.target.value);
                    if (error) setError('');
                  }}
                  className="bg-background text-foreground"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Password</label>
                <Input 
                  type="password" 
                  placeholder="••••••••" 
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (error) setError('');
                  }}
                  className="bg-background text-foreground"
                  disabled={isSubmitting}
                />
              </div>
            </CardContent>
            <CardFooter className="pb-8">
              <Button type="submit" className="w-full h-12 text-lg" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardFooter>
          </form>
        </Card>
      </main>
      <Footer />
    </div>
  );
}