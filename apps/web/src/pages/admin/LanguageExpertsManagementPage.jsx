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

export default function LanguageExpertsManagementPage() {
  const { 
    data: districtsData, 
    languageExperts, 
    isLoadingExperts, 
    fetchLanguageExperts, 
    createLanguageExpert, 
    updateLanguageExpert, 
    deleteLanguageExpert 
  } = useAdminData();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    district: '',
    expert_name: '',
    expertise: '',
    expert_bio: ''
  });
  
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchLanguageExperts();
  }, [fetchLanguageExperts]);

  const filteredExperts = languageExperts.filter(expert => 
    (expert.district || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (expert.expert_name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenDialog = (expert = null) => {
    if (expert) {
      setSelectedExpert(expert);
      setFormData({
        district: expert.district || '',
        expert_name: expert.expert_name || '',
        expertise: expert.expertise || '',
        expert_bio: expert.expert_bio || ''
      });
      setPhotoPreview(expert.expert_photo ? pb.files.getUrl(expert, expert.expert_photo, { thumb: '100x100' }) : null);
    } else {
      setSelectedExpert(null);
      setFormData({ district: '', expert_name: '', expertise: '', expert_bio: '' });
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

    if (!formData.district || !formData.expert_name || !formData.expertise) {
      toast.error('Please fill in all required text fields');
      return;
    }

    const file = fileInputRef.current?.files?.[0];

    if (!selectedExpert && !file) {
      toast.error('Please select a photo');
      return;
    }

    setIsSubmitting(true);

    const payload = {
      district: formData.district,
      expert_name: formData.expert_name,
      expertise: formData.expertise,
      expert_photo: file,
      expert_bio: formData.expert_bio || ''
    };

    try {
      if (selectedExpert) {
        await updateLanguageExpert(selectedExpert.id, payload);
        toast.success('Language expert updated successfully');
      } else {
        await createLanguageExpert(payload);
        toast.success('Language expert created successfully');
      }
      
      setIsDialogOpen(false);
      setFormData({ district: '', expert_name: '', expertise: '', expert_bio: '' });
      setPhotoPreview(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      await fetchLanguageExperts();
    } catch (error) {
      console.error('Submit error caught in UI:', error);
      toast.error(error.message || 'Failed to create record');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedExpert) return;
    setIsSubmitting(true);
    try {
      await deleteLanguageExpert(selectedExpert.id);
      setIsDeleteDialogOpen(false);
      await fetchLanguageExperts();
    } catch (error) {
      toast.error(error.message || 'Failed to delete language expert');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Language Experts</h1>
          <p className="text-muted-foreground">Manage language experts and researchers</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" /> Add Expert
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
          {isLoadingExperts ? (
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
                    <TableHead className="hidden md:table-cell">Expertise</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredExperts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No language experts found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredExperts.map((expert) => (
                      <TableRow key={expert.id}>
                        <TableCell>
                          <div className="w-10 h-10 rounded-full bg-muted overflow-hidden flex items-center justify-center">
                            {expert.expert_photo ? (
                              <img 
                                src={pb.files.getUrl(expert, expert.expert_photo, { thumb: '100x100' })} 
                                alt={expert.expert_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="w-5 h-5 text-muted-foreground" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{expert.expert_name}</TableCell>
                        <TableCell>{expert.district}</TableCell>
                        <TableCell className="hidden md:table-cell text-muted-foreground">
                          {expert.expertise}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(expert)}>
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => { setSelectedExpert(expert); setIsDeleteDialogOpen(true); }}>
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
            <DialogTitle>{selectedExpert ? 'Edit Language Expert' : 'Add Language Expert'}</DialogTitle>
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
              <label className="text-sm font-medium">Expert Name <span className="text-destructive">*</span></label>
              <Input 
                required 
                value={formData.expert_name}
                onChange={(e) => setFormData({...formData, expert_name: e.target.value})}
                placeholder="e.g. Dr. Maya Chen"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Expertise <span className="text-destructive">*</span></label>
              <Input 
                required 
                value={formData.expertise}
                onChange={(e) => setFormData({...formData, expertise: e.target.value})}
                placeholder="e.g. Linguistik Austronesia"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Photo {selectedExpert ? '' : <span className="text-destructive">*</span>}</label>
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
                  required={!selectedExpert}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Biography</label>
              <Textarea 
                value={formData.expert_bio}
                onChange={(e) => setFormData({...formData, expert_bio: e.target.value})}
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
                {selectedExpert ? 'Save Changes' : 'Add Expert'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Delete Language Expert</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete <strong>{selectedExpert?.expert_name}</strong>? This action cannot be undone.</p>
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