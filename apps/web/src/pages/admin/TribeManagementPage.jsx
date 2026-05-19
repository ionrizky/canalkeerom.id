import React, { useState } from 'react';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function TribeManagementPage() {
  const { data, addTribe, updateTribe, deleteTribe } = useAdminData();
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContext, setEditingContext] = useState(null); // { districtId, tribeId }
  const [formData, setFormData] = useState({ districtId: '', namaSuku: '', namaKepalaSuku: '', profilSuku: '' });

  const allTribes = data.flatMap(d => d.tribes.map(t => ({ ...t, districtId: d.id, districtName: d.name })));
  
  const filteredData = allTribes.filter(t => {
    const matchesSearch = t.namaSuku.toLowerCase().includes(search.toLowerCase());
    const matchesDistrict = filterDistrict === 'all' || t.districtId === filterDistrict;
    return matchesSearch && matchesDistrict;
  });

  const handleOpenModal = (tribe = null) => {
    if (tribe) {
      setEditingContext({ districtId: tribe.districtId, tribeId: tribe.id });
      setFormData({ 
        districtId: tribe.districtId, 
        namaSuku: tribe.namaSuku, 
        namaKepalaSuku: tribe.namaKepalaSuku, 
        profilSuku: tribe.profilSuku 
      });
    } else {
      setEditingContext(null);
      setFormData({ districtId: data[0]?.id || '', namaSuku: '', namaKepalaSuku: '', profilSuku: '' });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.districtId || !formData.namaSuku.trim()) return;
    
    if (editingContext) {
      // If district changed, we need to move it (delete then add), else just update
      if (editingContext.districtId !== formData.districtId) {
        deleteTribe(editingContext.districtId, editingContext.tribeId);
        addTribe(formData.districtId, { ...formData });
      } else {
        updateTribe(editingContext.districtId, editingContext.tribeId, formData);
      }
    } else {
      addTribe(formData.districtId, formData);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (districtId, tribeId) => {
    if (window.confirm('Are you sure you want to delete this tribe? All vocabulary will be lost.')) {
      deleteTribe(districtId, tribeId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Tribes</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={16} /> Add New Tribe
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-muted/20 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search tribes..." 
                className="pl-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={filterDistrict} onValueChange={setFilterDistrict}>
              <SelectTrigger className="w-full sm:w-[200px] bg-background">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Districts</SelectItem>
                {data.map(d => (
                  <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tribe Name</TableHead>
                <TableHead>District</TableHead>
                <TableHead>Chief</TableHead>
                <TableHead>Vocab Count</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(tribe => (
                <TableRow key={tribe.id}>
                  <TableCell className="font-medium text-foreground">{tribe.namaSuku}</TableCell>
                  <TableCell>{tribe.districtName}</TableCell>
                  <TableCell>{tribe.namaKepalaSuku}</TableCell>
                  <TableCell>{tribe.kamusKosakata?.length || 0}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(tribe)}>
                      <Edit2 size={14} className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(tribe.districtId, tribe.id)}>
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No tribes found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingContext ? 'Edit Tribe' : 'Add New Tribe'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={formData.districtId} onValueChange={(val) => setFormData({...formData, districtId: val})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {data.map(d => (
                    <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tribe Name</label>
              <Input 
                value={formData.namaSuku} 
                onChange={e => setFormData({ ...formData, namaSuku: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Chief Name (Ondoafi)</label>
              <Input 
                value={formData.namaKepalaSuku} 
                onChange={e => setFormData({ ...formData, namaKepalaSuku: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tribe Profile / Description</label>
              <Textarea 
                value={formData.profilSuku} 
                onChange={e => setFormData({ ...formData, profilSuku: e.target.value })} 
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Tribe</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}