import React, { useRef } from 'react';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Upload, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
  const { data, importData, resetData } = useAdminData();
  const fileInputRef = useRef(null);

  const handleExportData = () => {
    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `keerom-culture-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Data exported successfully');
  };

  const handleImportData = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (window.confirm('Importing data will replace all current data. Proceed?')) {
      const reader = new FileReader();
      reader.onload = (event) => {
        importData(event.target.result);
      };
      reader.readAsText(file);
    }
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will factory reset all data. This action cannot be undone. Proceed?')) {
      resetData();
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">System Settings</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Data Backup & Restore</CardTitle>
            <CardDescription>Export your data as a JSON file or import a previous backup.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-foreground mb-2">Export Data</h3>
              <Button onClick={handleExportData} className="w-full sm:w-auto" variant="outline">
                <Download className="mr-2" size={16} /> Download Backup
              </Button>
            </div>
            
            <div className="pt-4 border-t border-border">
              <h3 className="text-sm font-medium text-foreground mb-2">Import Data</h3>
              <input 
                type="file" 
                accept=".json" 
                className="hidden" 
                ref={fileInputRef} 
                onChange={handleImportData} 
              />
              <Button onClick={() => fileInputRef.current?.click()} className="w-full sm:w-auto" variant="outline">
                <Upload className="mr-2" size={16} /> Select JSON File
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-destructive/30">
          <CardHeader>
            <CardTitle className="text-destructive flex items-center gap-2">
              <AlertTriangle size={20} /> Danger Zone
            </CardTitle>
            <CardDescription>Irreversible destructive actions for the application state.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/20">
              <h3 className="text-base font-bold text-destructive mb-2">Factory Reset</h3>
              <p className="text-sm text-destructive/80 mb-4">
                This will delete all custom districts, tribes, and vocabulary, and reset the application to its original seed data.
              </p>
              <Button variant="destructive" onClick={handleResetData}>
                Reset All Data
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}