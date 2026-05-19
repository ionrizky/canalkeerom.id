import React, { useEffect, useState, useRef } from 'react';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Search, Edit2, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

export default function TribalLeadersManagementPage() {
  const { 
    data: districtsData, 
    tribalLeaders, 
    isLoadingLeaders, 
    fetchTribalLeaders, 
    createTribalLeader, 
    updateTribalLeader, 
    deleteTribalLeader 
  } = useAdminData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    district: '',
    leader_name: '',
    leader_bio: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchTribalLeaders();
  }, [fetchTribalLeaders]);

  const filteredLeaders = tribalLeaders.filter(leader => 
    (leader.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (leader.leader_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (leader = null) => {
    if (leader) {
      setSelectedLeader(leader);
      setFormData({
        district: leader.district || '',
        leader_name: leader.leader_name || '',
        leader_bio: leader.leader_bio || ''
      });
      setPhotoPreview(leader.leader_photo ? pb.files.getUrl(leader, leader.leader_photo, { thumb: '100x100' }) : null);
    } else {
      setSelectedLeader(null);
      setFormData({ district: '', leader_name: '', leader_bio: '' });
      setPhotoPreview(null);
    }
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    
    setIsDialogOpen(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.district || !formData.leader_name) {
      toast.error('Please fill in all required text fields');
      return;
    }

    const file = fileInputRef.current?.files?.[0];

    if (!selectedLeader && !file) {
      toast.error('Please select a photo');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      district: formData.district,
      leader_name: formData.leader_name,
      leader_photo: file,
      leader_bio: formData.leader_bio || ''
    };

    try {
      if (selectedLeader) {
        await updateTribalLeader(selectedLeader.id, payload);
        toast.success('Tribal leader updated successfully');
      } else {
        await createTribalLeader(payload);
        toast.success('Tribal leader created successfully');
      }
      
      setIsDialogOpen(false);
      setFormData({ district: '', leader_name: '', leader_bio: '' });
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await fetchTribalLeaders();
    } catch (error) {
      console.error('Submit error caught in UI:', error);
      toast.error(error.message || 'Failed to save record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedLeader) return;
    setIsSubmitting(true);
    try {
      await deleteTribalLeader(selectedLeader.id);
      setIsDeleteDialogOpen(false);
      await fetchTribalLeaders();
    } catch (error) {
      toast.error(error.message || 'Failed to delete tribal leader');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Tribal Leaders</h1>
          <p className="text-muted-foreground">Manage tribal leaders across districts</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Leader
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <Search className="w-5 h-5 text-muted-foreground" />
            <Input 
              placeholder="Search by district or name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoadingLeaders ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Photo</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead className="hidden md:table-cell">Bio</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLeaders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No tribal leaders found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredLeaders.map((leader) => (
                      <TableRow key={leader.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                            {leader.leader_photo ? (
                              <img 
                                src={pb.files.getUrl(leader, leader.leader_photo, { thumb: '100x100' })} 
                                alt={leader.leader_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{leader.leader_name}</TableCell>
                        <TableCell>{leader.district}</TableCell>
                        <TableCell className="hidden md:table-cell max-w-xs truncate text-muted-foreground">
                          {leader.leader_bio || '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(leader)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { setSelectedLeader(leader); setIsDeleteDialogOpen(true); }}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{selectedLeader ? 'Edit Tribal Leader' : 'Add Tribal Leader'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">District <span className="text-destructive">*</span></label>
              <Select 
                value={formData.district} 
                onValueChange={(val) => setFormData({...formData, district: val})}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select district" />
                </SelectTrigger>
                <SelectContent>
                  {districtsData.map(d => (
                    <SelectItem key={d.id} value={d.name}>{d.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Leader Name <span className="text-destructive">*</span></label>
              <Input 
                required 
                value={formData.leader_name}
                onChange={(e) => setFormData({...formData, leader_name: e.target.value})}
                placeholder="e.g. Ondoafi Markus"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photo {selectedLeader ? '' : <span className="text-destructive">*</span>}</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-muted overflow-hidden flex items-center justify-center shrink-0 border">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>
                <Input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/jpeg,image/png"
                  onChange={handlePhotoChange}
                  className="flex-1"
                  required={!selectedLeader}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Biography</label>
              <Textarea 
                value={formData.leader_bio}
                onChange={(e) => setFormData({...formData, leader_bio: e.target.value})}
                placeholder="Brief biography..."
                rows={4}
              />
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {selectedLeader ? 'Save Changes' : 'Add Leader'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Tribal Leader</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedLeader?.leader_name}</strong>? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}