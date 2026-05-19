import React from 'react';
import { Mail, Globe, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 px-4 border-t-8 border-blue-600">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Kolom 1: Tentang Projek */}
          <div className="space-y-4">
            <h3 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
              <ShieldCheck className="text-blue-500" /> Digitalisasi Kampung di Keerom
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Program pelestarian bahasa daerah melalui teknologi digital untuk 11 Distrik, Kabupaten Keerom, Papua.
            </p>
          </div>

          {/* Kolom 2: Wilayah Layanan */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">Cakupan Wilayah</h3>
            <ul className="grid grid-cols-2 gap-2 text-xs text-slate-400 font-medium">
              <li>• Arso</li>
              <li>• Arso Barat</li>
              <li>• Arso Timur</li>
              <li>• Skanto</li>
              <li>• Mannem</li>
              <li>• Waris</li>
              <li>• Senggi</li>
              <li>• Web</li>
              <li>• Yaffi</li>
              <li>• Kaisenar</li>
              <li>• Towe</li>


            </ul>
          </div>

          {/* Kolom 3: Kontak Pengembang */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-[0.2em] text-blue-500">Kontak Pengembang</h3>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin size={16} className="text-slate-500" />
                <span>PT.Tristan Digital Teknologi Keerom, Papua</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe size={16} className="text-slate-500" />
                <span>wenz.my,id</span>
              </div>
            </div>
          </div>
        </div>

        {/* Garis Pembatas */}
        <div className="border-t border-slate-800 pt-8 mt-8 text-center">
          <p className="text-[10px] font-bold tracking-[0.5em] text-blue-500 uppercase mb-3">Powered By</p>
          <h2 className="text-2xl font-black tracking-[0.25em] uppercase mb-2">
            PT. TRISTAN <span className="text-blue-600">DIGITAL</span> TEKNOLOGI
          </h2>
          <div className="h-1 w-20 bg-blue-600 mx-auto mb-6"></div>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} Hak Cipta Dilindungi • Dikembangkan untuk Masyarakat Keerom
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;