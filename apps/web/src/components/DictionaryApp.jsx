import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MapPin, ChevronLeft, BookOpen, Award, Layers, Users } from 'lucide-react';
import { dictionaryData, categories } from '@/data/dictionaryData.js';

export default function DictionaryApp() {
  const [currentDistrict, setCurrentDistrict] = useState(null);
  const [currentTribe, setCurrentTribe] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Navigate backwards
  const handleBackToDistricts = () => {
    setCurrentDistrict(null);
    setCurrentTribe(null);
    setSearchTerm('');
  };

  const handleBackToTribes = () => {
    setCurrentTribe(null);
    setSearchTerm('');
  };

  // Filter vocabulary for the selected tribe
  const filteredVocabulary = useMemo(() => {
    if (!currentTribe) return [];
    
    return currentTribe.vocabulary.filter(item => {
      const matchSearch = item.indonesianWord.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          item.localWord.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCategory = selectedCategory === 'All' || item.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [currentTribe, searchTerm, selectedCategory]);


  // ==========================================
  // STEP 1: RENDER DISTRICT SELECTION
  // ==========================================
  if (!currentDistrict) {
    return (
      <div className="space-y-12 pb-20">
        <header className="relative py-24 px-4 bg-slate-950 text-white text-center shadow-xl">
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1683366343182-fe8bac8718ea?auto=format&fit=crop&q=80&w=1200')" }} />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent" />
          
          <div className="relative z-10">
            <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary-foreground border border-primary/30 text-[10px] sm:text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6">
              Provinsi Papua
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight text-white text-balance">
              Kamus Bahasa Daerah
            </h1>
            <p className="text-lg text-slate-300 font-medium px-6 max-w-2xl mx-auto text-balance leading-relaxed">
              Jelajahi kekayaan linguistik dari 11 distrik. Pilih distrik di bawah ini untuk melihat daftar suku dan kosakata lokal mereka.
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <Layers className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">Pilih Distrik</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dictionaryData.map((district) => (
              <Card 
                key={district.id} 
                className="group cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary overflow-hidden bg-card flex flex-col h-full" 
                onClick={() => setCurrentDistrict(district)}
              >
                <CardHeader className="p-6">
                  <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                    <MapPin size={24} />
                  </div>
                  <CardTitle className="text-xl font-bold text-card-foreground mb-2">
                    {district.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {district.description}
                  </p>
                </CardHeader>
                <CardContent className="mt-auto pt-0">
                  <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                    <Users size={16} />
                    <span>{district.tribes.length} Suku Terdaftar</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 2: RENDER TRIBE SELECTION
  // ==========================================
  if (!currentTribe) {
    return (
      <div className="space-y-12 pb-20">
        <header className="relative py-24 px-4 bg-slate-950 text-white text-center shadow-xl">
          <div className="absolute inset-0 z-0 bg-cover bg-center opacity-40" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1505564386-27d26fd07796?auto=format&fit=crop&q=80&w=1200')" }} />
          <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-slate-900/40" />
          
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center">
            <Button 
              variant="outline" 
              onClick={handleBackToDistricts} 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 font-bold uppercase tracking-widest text-[11px] backdrop-blur-md mb-8"
            >
              <ChevronLeft size={16} className="mr-1"/> Kembali ke Daftar Distrik
            </Button>
            
            <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight text-white text-balance text-shadow-hero">
              {currentDistrict.name}
            </h1>
            <p className="text-lg text-slate-300 font-medium px-6 max-w-2xl mx-auto text-balance">
              {currentDistrict.description}
            </p>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-2 mb-8">
            <Users className="text-primary" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">Suku di {currentDistrict.name}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {currentDistrict.tribes.map((tribe) => (
              <Card 
                key={tribe.id} 
                className="group cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 border-2 hover:border-primary overflow-hidden shadow-lg bg-card flex flex-col h-full" 
                onClick={() => setCurrentTribe(tribe)}
              >
                <div 
                  className="h-48 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                  style={{ backgroundImage: `url('${tribe.backgroundImage}')` }}
                />
                <CardHeader className="text-center p-6 bg-card relative z-10 flex-1 flex flex-col justify-center">
                  <CardTitle className="kampung-card-text text-card-foreground">
                    <MapPin className="text-destructive" size={20} /> {tribe.name}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2 font-medium">
                    {tribe.vocabulary.length} Kosakata Tersedia
                  </p>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // STEP 3: RENDER VOCABULARY LIST
  // ==========================================
  return (
    <div className="space-y-6 bg-slate-50 min-h-screen pb-20">
      {/* Tribe Header */}
      <div className="relative py-24 text-center overflow-hidden shadow-2xl bg-slate-950">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-60 transition-transform duration-1000 scale-105" 
          style={{ backgroundImage: `url('${currentTribe.backgroundImage}')` }}
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-slate-900/80" />
        
        <div className="relative z-10 space-y-6 px-4 flex flex-col items-center max-w-5xl mx-auto">
          <div className="flex flex-wrap justify-center gap-4 mb-4 w-full">
            <Button 
              variant="outline" 
              onClick={handleBackToTribes} 
              className="bg-white/10 text-white border-white/30 hover:bg-white/20 hover:text-white font-bold uppercase tracking-widest text-[11px] backdrop-blur-md transition-all"
            >
              <ChevronLeft size={16} className="mr-1"/> Suku Lainnya
            </Button>
            
            <div className="hidden md:flex px-4 py-2 bg-white/10 border border-white/30 backdrop-blur-md rounded-md text-sm text-white font-medium items-center">
              {currentDistrict.name} <ChevronLeft size={14} className="mx-2 rotate-180 opacity-50"/> {currentTribe.name}
            </div>
          </div>
          
          <h1 className="kampung-header-title text-shadow-hero text-balance">
            {currentTribe.name}
          </h1>
          
          <p className="kampung-header-subtitle text-shadow-sm">
            Kamus Bahasa Daerah
          </p>
        </div>
      </div>

      {/* Translator & Contributor Section */}
      <div className="max-w-6xl mx-auto px-4 translator-section z-20 relative">
        <div className="translator-card">
          <div className="translator-avatar-wrapper">
            <Award size={28} />
          </div>
          <div className="translator-info">
            <span className="translator-badge">
              {currentTribe.translator.role}
            </span>
            <h3 className="translator-name">
              {currentTribe.translator.name}
            </h3>
            <p className="translator-desc">
              {currentTribe.translator.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 space-y-8 mt-8">
        {/* Controls Section */}
        <div className="bg-card p-4 rounded-2xl shadow-sm border flex flex-col md:flex-row gap-4 items-center sticky top-4 z-30">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
            <Input 
              placeholder={`Cari kosakata di ${currentTribe.name}...`} 
              className="pl-12 h-12 text-base bg-muted border-transparent focus-visible:ring-primary" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-[200px] h-12 bg-muted border-transparent">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">Semua Kategori</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Section */}
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <BookOpen size={20} className="text-primary" />
            Kosakata {currentTribe.name}
          </h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {filteredVocabulary.length} Kata
          </Badge>
        </div>

        {filteredVocabulary.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVocabulary.map((item, index) => (
              <Card key={`${item.indonesianWord}-${index}`} className="border-t-4 border-t-primary shadow-sm hover:shadow-md transition-all bg-card flex flex-col h-full">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <Badge variant="outline" className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {item.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl font-bold text-card-foreground text-balance">
                    {item.indonesianWord}
                  </CardTitle>
                  <div className="text-xl text-primary font-extrabold mt-1">
                    {item.localWord}
                  </div>
                </CardHeader>
                <CardContent className="pt-3 border-t mt-auto space-y-3 text-sm bg-muted/30 rounded-b-xl">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider block mb-1">Contoh (ID)</span>
                    <p className="text-foreground italic">"{item.exampleIndonesian}"</p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary/70 uppercase tracking-wider block mb-1">Contoh (Lokal)</span>
                    <p className="text-foreground font-medium italic">"{item.exampleLocal}"</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 px-4 bg-card rounded-2xl border-2 border-dashed">
            <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4 opacity-50" />
            <h3 className="text-lg font-bold text-card-foreground mb-1">Kosakata tidak ditemukan</h3>
            <p className="text-muted-foreground">Coba gunakan kata kunci atau kategori lain.</p>
            <Button 
              variant="outline" 
              className="mt-6"
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
            >
              Reset Pencarian
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}