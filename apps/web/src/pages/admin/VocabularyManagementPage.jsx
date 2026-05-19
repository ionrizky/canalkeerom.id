import React, { useState, useMemo } from 'react';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit2, Trash2, Search } from 'lucide-react';

export default function VocabularyManagementPage() {
  const { data, addVocabulary, updateVocabulary, deleteVocabulary } = useAdminData();
  const [search, setSearch] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [filterTribe, setFilterTribe] = useState('all');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContext, setEditingContext] = useState(null); // { districtId, tribeId, vocabId }
  const [formData, setFormData] = useState({ 
    districtId: '', tribeId: '', 
    indonesianWord: '', localWord: '', 
    exampleIndonesian: '', exampleLocal: '' 
  });

  const allVocab = useMemo(() => {
    return data.flatMap(d => 
      d.tribes.flatMap(t => 
        t.kamusKosakata.map(v => ({ 
          ...v, 
          districtId: d.id, districtName: d.name,
          tribeId: t.id, tribeName: t.namaSuku 
        }))
      )
    );
  }, [data]);
  
  const filteredData = useMemo(() => {
    return allVocab.filter(v => {
      const matchesSearch = v.indonesianWord.toLowerCase().includes(search.toLowerCase()) || 
                            v.localWord.toLowerCase().includes(search.toLowerCase());
      const matchesDistrict = filterDistrict === 'all' || v.districtId === filterDistrict;
      const matchesTribe = filterTribe === 'all' || v.tribeId === filterTribe;
      return matchesSearch && matchesDistrict && matchesTribe;
    }).slice(0, 100); // Limit to 100 for performance if dataset gets huge
  }, [allVocab, search, filterDistrict, filterTribe]);

  const activeDistrictTribes = useMemo(() => {
    if (!formData.districtId) return [];
    return data.find(d => d.id === formData.districtId)?.tribes || [];
  }, [data, formData.districtId]);

  const handleOpenModal = (vocab = null) => {
    if (vocab) {
      setEditingContext({ districtId: vocab.districtId, tribeId: vocab.tribeId, vocabId: vocab.id });
      setFormData({ 
        districtId: vocab.districtId, tribeId: vocab.tribeId, 
        indonesianWord: vocab.indonesianWord, localWord: vocab.localWord, 
        exampleIndonesian: vocab.exampleIndonesian || '', exampleLocal: vocab.exampleLocal || '' 
      });
    } else {
      setEditingContext(null);
      setFormData({ 
        districtId: data[0]?.id || '', tribeId: '', 
        indonesianWord: '', localWord: '', exampleIndonesian: '', exampleLocal: '' 
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (!formData.districtId || !formData.tribeId || !formData.indonesianWord || !formData.localWord) return;
    
    const vocabPayload = {
      indonesianWord: formData.indonesianWord,
      localWord: formData.localWord,
      exampleIndonesian: formData.exampleIndonesian,
      exampleLocal: formData.exampleLocal
    };

    if (editingContext) {
      // Simplification: if moving across districts/tribes, delete old and add new
      if (editingContext.districtId !== formData.districtId || editingContext.tribeId !== formData.tribeId) {
        deleteVocabulary(editingContext.districtId, editingContext.tribeId, editingContext.vocabId);
        addVocabulary(formData.districtId, formData.tribeId, vocabPayload);
      } else {
        updateVocabulary(editingContext.districtId, editingContext.tribeId, editingContext.vocabId, vocabPayload);
      }
    } else {
      addVocabulary(formData.districtId, formData.tribeId, vocabPayload);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (districtId, tribeId, vocabId) => {
    if (window.confirm('Are you sure you want to delete this word?')) {
      deleteVocabulary(districtId, tribeId, vocabId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Manage Vocabulary</h1>
        <Button onClick={() => handleOpenModal()} className="flex items-center gap-2">
          <Plus size={16} /> Add New Word
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="p-4 border-b border-border bg-muted/20 flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
              <Input 
                placeholder="Search Indonesian or Local words..." 
                className="pl-10 bg-background"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={filterDistrict} onValueChange={(val) => { setFilterDistrict(val); setFilterTribe('all'); }}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Districts</SelectItem>
                  {data.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Select value={filterTribe} onValueChange={setFilterTribe} disabled={filterDistrict === 'all'}>
                <SelectTrigger className="w-full sm:w-[180px] bg-background">
                  <SelectValue placeholder="All Tribes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Tribes</SelectItem>
                  {filterDistrict !== 'all' && data.find(d => d.id === filterDistrict)?.tribes.map(t => (
                    <SelectItem key={t.id} value={t.id}>{t.namaSuku}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Indonesian Word</TableHead>
                <TableHead>Local Word</TableHead>
                <TableHead>Tribe</TableHead>
                <TableHead>District</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map(vocab => (
                <TableRow key={vocab.id}>
                  <TableCell className="font-medium text-foreground">{vocab.indonesianWord}</TableCell>
                  <TableCell className="text-primary font-bold">{vocab.localWord}</TableCell>
                  <TableCell>{vocab.tribeName}</TableCell>
                  <TableCell>{vocab.districtName}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="outline" size="sm" onClick={() => handleOpenModal(vocab)}>
                      <Edit2 size={14} className="mr-1" /> Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(vocab.districtId, vocab.tribeId, vocab.id)}>
                      <Trash2 size={14} className="mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {filteredData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No vocabulary found matching your criteria.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingContext ? 'Edit Vocabulary Word' : 'Add New Vocabulary Word'}</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">District</label>
              <Select value={formData.districtId} onValueChange={(val) => setFormData({...formData, districtId: val, tribeId: ''})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select District" />
                </SelectTrigger>
                <SelectContent>
                  {data.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tribe</label>
              <Select value={formData.tribeId} onValueChange={(val) => setFormData({...formData, tribeId: val})} disabled={!formData.districtId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Tribe" />
                </SelectTrigger>
                <SelectContent>
                  {activeDistrictTribes.map(t => <SelectItem key={t.id} value={t.id}>{t.namaSuku}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Indonesian Word</label>
              <Input 
                value={formData.indonesianWord} 
                onChange={e => setFormData({ ...formData, indonesianWord: e.target.value })} 
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Local Word</label>
              <Input 
                value={formData.localWord} 
                onChange={e => setFormData({ ...formData, localWord: e.target.value })} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Example Usage (Indonesian) - Optional</label>
              <Input 
                value={formData.exampleIndonesian} 
                onChange={e => setFormData({ ...formData, exampleIndonesian: e.target.value })} 
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-medium">Example Usage (Local) - Optional</label>
              <Input 
                value={formData.exampleLocal} 
                onChange={e => setFormData({ ...formData, exampleLocal: e.target.value })} 
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Save Vocabulary</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}