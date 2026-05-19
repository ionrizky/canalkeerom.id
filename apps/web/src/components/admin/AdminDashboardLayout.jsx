
import React, { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext.jsx';
import { LayoutDashboard, MapPin, Users, BookOpen, Settings, LogOut, Menu, X, Crown, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Footer from '@/components/Footer.jsx';

export default function AdminDashboardLayout() {
  const { adminName, logout } = useAdminAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/admin/overview', icon: LayoutDashboard },
    { name: 'Districts', path: '/admin/districts', icon: MapPin },
    { name: 'Tribes', path: '/admin/tribes', icon: Users },
    { name: 'Vocabulary', path: '/admin/vocabulary', icon: BookOpen },
    { name: 'Tribal Leaders', path: '/admin/tribal-leaders', icon: Crown },
    { name: 'Language Experts', path: '/admin/language-experts', icon: GraduationCap },
    { name: 'Settings', path: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex-1 flex flex-col md:flex-row font-sans bg-[hsl(var(--admin-content))] w-full">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[hsl(var(--admin-sidebar))] text-[hsl(var(--admin-sidebar-foreground))] z-50 shrink-0">
        <span className="font-bold text-lg">Admin Portal</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed md:sticky top-0 left-0 h-screen w-64 bg-[hsl(var(--admin-sidebar))] text-[hsl(var(--admin-sidebar-foreground))] flex flex-col z-40 transition-transform duration-300 shrink-0
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="p-6 hidden md:block">
          <span className="font-bold text-2xl tracking-tight text-accent">Admin Portal</span>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors ${
                  isActive 
                    ? 'bg-primary text-primary-foreground' 
                    : 'text-[hsl(var(--admin-sidebar-foreground))]/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/10 shrink-0">
          <div className="flex items-center gap-3 px-4 py-3 text-sm">
            <div className="w-8 h-8 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              {adminName.charAt(0)}
            </div>
            <div className="flex-1 truncate">
              <p className="font-bold">{adminName}</p>
              <p className="text-xs text-white/50 truncate">Administrator</p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            className="w-full mt-2 text-white/70 hover:text-white hover:bg-white/10 border-none justify-start px-4" 
            onClick={logout}
          >
            <LogOut size={18} className="mr-2" /> Logout
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="hidden md:flex h-16 items-center justify-end px-8 bg-[hsl(var(--admin-card))] border-b border-border shadow-sm shrink-0">
          <div className="text-sm font-medium text-muted-foreground">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto flex flex-col">
          <div className="p-4 md:p-8 max-w-6xl mx-auto w-full flex-1">
            <Outlet />
          </div>
          <div className="mt-auto shrink-0">
            <Footer />
          </div>
        </main>
      </div>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsMobileMenuOpen(false)} 
        />
      )}
    </div>
  );
}
