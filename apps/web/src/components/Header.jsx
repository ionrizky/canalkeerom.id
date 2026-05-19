import React from 'react';
import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 cursor-pointer group">
          <div className="w-8 h-8 rounded bg-primary group-hover:bg-primary/90 text-primary-foreground flex items-center justify-center font-bold transition-colors">
            K
          </div>
          <span className="font-bold text-foreground text-lg tracking-tight group-hover:text-primary transition-colors">
            KeeromCulture
          </span>
        </Link>
        
        <Link 
          to="/admin/login"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors p-2 rounded-md hover:bg-muted"
        >
          <Settings size={16} /> 
          <span className="hidden sm:inline">Admin Portal</span>
        </Link>
      </div>
    </header>
  );
}