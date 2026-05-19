
import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function ProfileCard({ name, photo, bio, expertise, district }) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-border/50 bg-card">
      <CardContent className="p-6 flex flex-col items-center text-center h-full">
        <div className="relative mb-6">
          <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-muted flex items-center justify-center shadow-inner ring-4 ring-background">
            {photo ? (
              <img 
                src={photo} 
                alt={name} 
                className="w-full h-full object-cover"
                loading="lazy"
              />
            ) : (
              <User className="w-12 h-12 text-muted-foreground/50" />
            )}
          </div>
          {district && (
            <Badge className="absolute -bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap shadow-sm bg-primary text-primary-foreground">
              {district}
            </Badge>
          )}
        </div>
        
        <h3 className="text-xl font-bold text-foreground mb-1 mt-2">{name}</h3>
        
        {expertise && (
          <p className="text-sm font-medium text-accent mb-3">{expertise}</p>
        )}
        
        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-4 mt-2">
          {bio}
        </p>
      </CardContent>
    </Card>
  );
}
