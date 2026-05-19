
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { MapPin, ArrowLeft, BookOpen, AlertCircle, FileImage as ImageIcon, GraduationCap } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';
import { Skeleton } from '@/components/ui/skeleton';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function TribalLeaderDetailPage() {
  // Task 3: Use useParams to safely extract the ID
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [leader, setLeader] = useState(null);
  const [experts, setExperts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      // Task 3: Debug logs for verification
      console.log('TribalLeaderDetailPage ID from params:', id);
      
      if (!id) {
        setError('ID Tokoh Adat tidak valid.');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      
      try {
        // Fetch the tribal leader dynamically
        const leaderRecord = await pb.collection('tribal_leaders').getOne(id, {
          $autoCancel: false
        });
        
        console.log('Fetched Leader Response:', leaderRecord);
        setLeader(leaderRecord);

        // Fetch related language experts dynamically based on the leader's district
        try {
          const expertsRes = await pb.collection('language_experts').getList(1, 6, {
            filter: `district = "${leaderRecord.district}"`,
            $autoCancel: false
          });
          setExperts(expertsRes.items);
        } catch (expertErr) {
          console.error('Failed to fetch experts:', expertErr);
          setExperts([]);
        }

      } catch (err) {
        console.error('Failed to fetch tribal leader detail:', err);
        setError('Tokoh adat tidak ditemukan atau terjadi kesalahan server.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const photoUrl = leader?.leader_photo 
    ? pb.files.getUrl(leader, leader.leader_photo) 
    : null;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Helmet>
        <title>{leader ? `${leader.leader_name} - Profil Tokoh Adat` : 'Memuat Profil...'} | Portal Budaya Keerom</title>
        {leader && <meta name="description" content={leader.leader_bio?.substring(0, 150) || `Profil ${leader.leader_name} dari Distrik ${leader.district}`} />}
      </Helmet>
      
      <Header />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-28">
        <button 
          onClick={() => navigate('/')} 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-medium mb-8 group"
        >
          <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" /> 
          Kembali ke Beranda
        </button>

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-4">
              <Skeleton className="w-full aspect-[3/4] rounded-2xl" />
            </div>
            <div className="lg:col-span-8 space-y-6">
              <Skeleton className="h-8 w-32 rounded-full" />
              <Skeleton className="h-12 w-3/4" />
              <div className="space-y-3 pt-6">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </div>
        ) : error ? (
          <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-12 text-center flex flex-col items-center">
            <AlertCircle size={48} className="mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2 text-foreground">Profil Tidak Ditemukan</h1>
            <p className="mb-6 text-muted-foreground max-w-md text-balance">{error}</p>
            <button 
              onClick={() => navigate('/')}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2.5 rounded-xl font-medium transition-colors"
            >
              Kembali ke Beranda
            </button>
          </div>
        ) : leader ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Column: Photo & Quick Info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl overflow-hidden shadow-lg border border-border bg-muted aspect-[3/4] relative group">
                {photoUrl ? (
                  <img 
                    src={photoUrl} 
                    alt={`Foto ${leader.leader_name}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground">
                    <ImageIcon size={64} className="mb-4 opacity-40" />
                    <span className="font-medium text-sm tracking-wide uppercase">Belum ada foto</span>
                  </div>
                )}
                <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-2xl pointer-events-none"></div>
              </div>
              
              <div className="bg-card p-6 rounded-2xl border border-border papua-border">
                <h3 className="font-semibold text-lg mb-4 text-secondary">Informasi Area</h3>
                <div className="flex items-center gap-4 text-foreground">
                  <div className="bg-primary/10 p-3.5 rounded-2xl text-primary">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold mb-1">Wilayah Distrik</p>
                    {/* Task 4: Completely dynamic district display */}
                    <p className="font-bold text-xl">{leader.district}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Content */}
            <div className="lg:col-span-8">
              <div className="mb-12">
                <div className="inline-block px-4 py-1.5 bg-accent/20 text-accent-foreground border border-accent/30 text-sm font-bold uppercase tracking-wider rounded-full mb-6">
                  Tokoh Adat & Kepala Suku
                </div>
                {/* Task 4: Completely dynamic leader name */}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-8 leading-tight">
                  {leader.leader_name}
                </h1>
                
                <div className="prose prose-lg max-w-none text-foreground/90 prose-p:leading-relaxed">
                  {leader.leader_bio ? (
                    <div dangerouslySetInnerHTML={{ __html: `<p>${leader.leader_bio.replace(/\n/g, '<br/>')}</p>` }} />
                  ) : (
                    <p className="text-muted-foreground italic bg-muted/30 p-6 rounded-xl border border-border/50">
                      Biografi lengkap untuk {leader.leader_name} sedang dalam proses dokumentasi dan penyusunan oleh tim peneliti.
                    </p>
                  )}
                </div>
              </div>

              {/* Language Resources Section */}
              <div className="mt-16 bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="bg-secondary/5 border-b border-border p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="bg-secondary text-secondary-foreground p-3 rounded-xl shrink-0">
                    <BookOpen size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">Referensi Bahasa & Budaya</h2>
                    <p className="text-muted-foreground mt-1">Sumber daya linguistik dan pakar terkait di Distrik {leader.district}</p>
                  </div>
                </div>
                
                <div className="p-6 sm:p-8">
                  {experts.length > 0 ? (
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 text-foreground">
                        <GraduationCap className="text-primary" size={20} />
                        Pakar Bahasa Terkait di Wilayah Ini
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {experts.map((expert) => (
                          <div key={expert.id} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-background hover:border-primary/40 transition-colors">
                            <div className="w-12 h-12 rounded-full overflow-hidden bg-muted shrink-0">
                              {expert.expert_photo ? (
                                <img 
                                  src={pb.files.getUrl(expert, expert.expert_photo, { thumb: '100x100' })} 
                                  alt={expert.expert_name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-secondary text-secondary-foreground font-bold">
                                  {expert.expert_name.charAt(0)}
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-foreground">{expert.expert_name}</p>
                              <p className="text-sm text-muted-foreground">{expert.expertise}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 bg-muted/20 rounded-xl border border-dashed border-border">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground/60">
                        <BookOpen size={24} />
                      </div>
                      <h3 className="text-xl font-semibold mb-2 text-foreground">Kosakata sedang dalam penyusunan</h3>
                      <p className="text-muted-foreground max-w-lg mx-auto text-balance">
                        Data kosakata bahasa ibu dan dokumentasi tradisi lisan dari wilayah ini sedang dalam tahap verifikasi oleh tim peneliti sebelum dipublikasikan.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <Footer />
    </div>
  );
}
