import React, { useState, useMemo, useRef } from 'react';
import { MapPin, ChevronRight, X, Map as MapIcon, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAdminData } from '@/contexts/AdminDataContext.jsx';
import { Search } from 'lucide-react';

const MAP_TILE_COLORS = ['bg-[#2d5016] text-white', 'bg-[#6b4423] text-white', 'bg-[#d4af37] text-[#2b1d0f]', 'bg-[#3b6222] text-white', 'bg-[#8b5a2b] text-white', 'bg-[#e8c361] text-[#2b1d0f]', 'bg-[#1a330e] text-white', 'bg-[#4a2e16] text-white', 'bg-[#b59228] text-[#2b1d0f]', 'bg-[#4c7330] text-white', 'bg-[#7a5536] text-white'];

export default function PortalBudayaKeerom() {
  const { data } = useAdminData();
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [selectedTribe, setSelectedTribe] = useState(null);
  const [vocabSearch, setVocabSearch] = useState('');
  
  const contentRef = useRef(null);

  const activeDistrictData = useMemo(() => {
    if (!selectedDistrict) return null;
    return data.find(d => d.name === selectedDistrict);
  }, [data, selectedDistrict]);

  const activeTribes = useMemo(() => {
    if (!activeDistrictData) return [];
    return activeDistrictData.tribes.map(t => ({
      ...t,
      districtName: activeDistrictData.name
    }));
  }, [activeDistrictData]);

  const modalVocabulary = useMemo(() => {
    if (!selectedTribe) return [];
    if (!vocabSearch) return selectedTribe.kamusKosakata;
    return selectedTribe.kamusKosakata.filter(v => v.indonesianWord.toLowerCase().includes(vocabSearch.toLowerCase()) || v.localWord.toLowerCase().includes(vocabSearch.toLowerCase()));
  }, [selectedTribe, vocabSearch]);

  const handleSelectDistrict = districtName => {
    setSelectedDistrict(districtName);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleBackToMap = () => {
    setSelectedDistrict(null);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }, 100);
  };

  const handleOpenTribe = tribe => {
    setSelectedTribe(tribe);
    setVocabSearch('');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      <main className="flex-1 pb-24">
        {/* Hero Section */}
        <section className="relative pt-32 pb-24 px-6 overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-accent to-transparent"></div>
          <div className="max-w-7xl mx-auto relative z-10 flex flex-col items-center text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance text-accent">
              Portal Bahasa (Ibu) Keerom
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl text-primary-foreground/90 leading-relaxed text-balance">
              Eksplorasi kekayaan bahasa dan tradisi lisan dari berbagai suku asli di wilayah Kabupaten Keerom, Papua.
            </p>
          </div>
        </section>

        {/* Main Content Area */}
        <div ref={contentRef} className="pt-16 max-w-7xl mx-auto px-6 scroll-mt-20">
          <AnimatePresence mode="wait">
            {!selectedDistrict ? (
              <motion.section key="map-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-24">
                
                {/* Map Section */}
                <div>
                  <div className="text-center max-w-2xl mx-auto mb-12">
                    <MapIcon className="mx-auto text-accent mb-4" size={48} />
                    <h2 className="text-3xl font-bold text-foreground mb-4">Peta Wilayah Distrik</h2>
                    <p className="text-muted-foreground">Pilih area distrik pada peta visual di bawah ini untuk melihat daftar suku dan kosakata yang mendiami wilayah tersebut.</p>
                  </div>

                  <div className="bg-card p-4 sm:p-8 rounded-[2rem] shadow-lg border border-border papua-border">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                      {data.map((district, index) => {
                        const colorClass = MAP_TILE_COLORS[index % MAP_TILE_COLORS.length];
                        const isLarge = index === 0 || index === 4 || index === 7;
                        return (
                          <div key={district.id} onClick={() => handleSelectDistrict(district.name)} className={`map-tile map-tile-animate ${colorClass} ${isLarge ? 'md:col-span-2 md:row-span-2 aspect-video md:aspect-auto' : 'aspect-square sm:aspect-[4/3]'}`}>
                            <span className="font-bold text-lg sm:text-xl md:text-2xl font-serif tracking-wide text-balance drop-shadow-md">
                              {district.name}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

              </motion.section>
            ) : (
              <motion.section key="tribe-view" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }} className="space-y-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 bg-card p-6 rounded-2xl border border-border shadow-sm mb-8">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-wider text-sm mb-2">
                      <MapPin size={18} /> Distrik Terpilih
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-secondary">
                      {activeDistrictData.name}
                    </h2>
                  </div>
                  
                  <button onClick={handleBackToMap} className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-3 rounded-xl font-medium transition-all shadow-sm hover:shadow-md">
                    <ArrowLeft size={18} /> Kembali ke Peta Utama
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {activeTribes.map(tribe => (
                    <div key={tribe.id} className="bg-card rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 papua-border flex flex-col h-full group">
                      <div className="p-8 flex-1 flex flex-col">
                        <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2 flex items-center gap-2">
                          <MapPin size={16} /> Wilayah {tribe.districtName}
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-primary transition-colors">
                          {tribe.namaSuku}
                        </h3>
                        <p className="text-muted-foreground line-clamp-3 mb-8">
                          {tribe.profilSuku}
                        </p>
                        
                        <button onClick={() => handleOpenTribe(tribe)} className="mt-auto flex items-center justify-between w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 px-6 rounded-xl font-medium transition-colors">
                          Lihat Profil Suku
                          <ChevronRight size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {activeTribes.length === 0 && (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                      Belum ada suku yang terdaftar di distrik ini.
                    </div>
                  )}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>

      {/* Tribe Details Modal */}
      <AnimatePresence>
        {selectedTribe && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedTribe(null)} className="absolute inset-0 bg-foreground/60 backdrop-blur-sm" />
            
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-4xl max-h-[90vh] bg-card rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-border">
              <div className="bg-primary text-primary-foreground p-6 sm:p-8 flex-shrink-0 relative">
                <button onClick={() => setSelectedTribe(null)} className="absolute top-6 right-6 p-2 bg-primary-foreground/10 hover:bg-primary-foreground/20 rounded-full transition-colors">
                  <X size={20} />
                </button>
                <div className="inline-block px-3 py-1 bg-accent text-accent-foreground text-xs font-bold uppercase tracking-wider rounded-full mb-4 shadow-sm">
                  Profil Suku
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-balance">{selectedTribe.namaSuku}</h2>
                <div className="flex items-center gap-2 text-primary-foreground/90 font-medium">
                  <MapPin size={18} />
                  <span>Kepala Suku: {selectedTribe.namaKepalaSuku}</span>
                </div>
              </div>

              <div className="overflow-y-auto p-6 sm:p-8 flex-1">
                <div className="mb-10 bg-muted/30 p-6 rounded-xl border border-border">
                  <h3 className="text-xl font-bold text-secondary mb-4 flex items-center gap-2">
                    <MapPin size={20} className="text-primary" />
                    Tentang Suku
                  </h3>
                  <p className="text-foreground leading-relaxed">
                    {selectedTribe.profilSuku}
                  </p>
                </div>

                <div>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h3 className="text-xl font-bold text-secondary flex items-center gap-2">
                      <Search size={20} className="text-primary" /> 
                      Kamus Bahasa Lokal
                    </h3>
                    
                    <div className="relative w-full sm:w-72">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                      <input type="text" placeholder="Cari kosakata..." value={vocabSearch} onChange={e => setVocabSearch(e.target.value)} className="w-full bg-background border border-border rounded-full py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground shadow-sm" />
                    </div>
                  </div>

                  {modalVocabulary.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {modalVocabulary.map(v => (
                        <div key={v.id} className="bg-background border border-border rounded-xl p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-md transition-all group">
                          <div className="flex justify-between items-start mb-3">
                            <span className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">{v.indonesianWord}</span>
                            <span className="font-black text-xl text-primary drop-shadow-sm">{v.localWord}</span>
                          </div>
                          {(v.exampleIndonesian || v.exampleLocal) && (
                            <div className="mt-2 pt-3 border-t border-border/60 text-sm">
                              {v.exampleIndonesian && <p className="text-muted-foreground italic mb-1">"{v.exampleIndonesian}"</p>}
                              {v.exampleLocal && <p className="text-secondary font-medium italic">"{v.exampleLocal}"</p>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-16 bg-background rounded-xl border-2 border-dashed border-border">
                      <Search className="mx-auto h-10 w-10 text-muted-foreground mb-4 opacity-40" />
                      <p className="text-muted-foreground font-medium text-lg">Kata tidak ditemukan.</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}