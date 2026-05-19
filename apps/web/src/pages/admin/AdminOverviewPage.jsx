import React from 'react';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { MapPin, Users, BookOpen, Activity } from 'lucide-react';

export default function AdminOverviewPage() {
  const { data } = useAdminData();

  const totalDistricts = data.length;
  const totalTribes = data.reduce((acc, d) => acc + d.tribes.length, 0);
  const totalVocab = data.reduce((acc, d) => acc + d.tribes.reduce((sum, t) => sum + t.kamusKosakata.length, 0), 0);

  const stats = [
    { title: 'Total Districts', value: totalDistricts, icon: MapPin, color: 'text-blue-600', bg: 'bg-blue-100' },
    { title: 'Total Tribes', value: totalTribes, icon: Users, color: 'text-green-600', bg: 'bg-green-100' },
    { title: 'Total Vocabulary', value: totalVocab, icon: BookOpen, color: 'text-amber-600', bg: 'bg-amber-100' },
    { title: 'System Status', value: 'Online', icon: Activity, color: 'text-purple-600', bg: 'bg-purple-100' }
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="border-border shadow-sm">
            <CardContent className="p-6 flex items-center gap-4">
              <div className={`p-4 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity Log</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <p className="flex-1 text-foreground">Admin logged into the system</p>
                <span className="text-muted-foreground">Just now</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                <p className="flex-1 text-foreground">System backup completed automatically</p>
                <span className="text-muted-foreground">2 hours ago</span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-2 h-2 rounded-full bg-primary"></div>
                <p className="flex-1 text-foreground">Data successfully synced with local storage</p>
                <span className="text-muted-foreground">Today</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}