
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ChevronRight, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient.js';

export default function TribalLeaderCard({ leader }) {
  // Ensure we safely pull the photo URL if it exists
  const photoUrl = leader.leader_photo 
    ? pb.files.getUrl(leader, leader.leader_photo, { thumb: '300x300' })
    : null;

  return (
    <div className="leader-card papua-border">
      <div className="leader-image-wrapper">
        {photoUrl ? (
          <img 
            src={photoUrl} 
            alt={`Foto ${leader.leader_name}`} 
            className="leader-image"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted/50">
            <ImageIcon size={48} className="mb-2 opacity-50" />
            <span className="text-sm font-medium">Belum ada foto</span>
          </div>
        )}
      </div>
      
      <div className="leader-content">
        <div className="leader-district">
          <MapPin size={16} /> Distrik {leader.district}
        </div>
        
        <h3 className="leader-title">
          {leader.leader_name}
        </h3>
        
        <p className="leader-bio-excerpt">
          {leader.leader_bio || 'Belum ada informasi biografi yang ditambahkan untuk tokoh ini.'}
        </p>
        
        <div className="mt-auto pt-4">
          {/* Ensure routing matches App.jsx configuration */}
          <Link 
            to={`/tribal-leader/${leader.id}`}
            className="flex items-center justify-between w-full bg-secondary hover:bg-secondary/90 text-secondary-foreground py-3 px-6 rounded-xl font-medium transition-colors"
          >
            Lihat Profil Lengkap & Kamus
            <ChevronRight size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}
