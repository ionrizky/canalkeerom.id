// Base vocabulary template (30 words)
const baseVocab = [
  { in: 'Halo', mn: 'Mbola', exIn: 'Halo, apa kabar?', exMn: 'Mbola, narate?', category: 'Greetings' },
  { in: 'Terima kasih', mn: 'Wah', exIn: 'Terima kasih banyak.', exMn: 'Wah bera.', category: 'Greetings' },
  { in: 'Selamat pagi', mn: 'Mbola ra', exIn: 'Selamat pagi semua.', exMn: 'Mbola ra weng.', category: 'Greetings' },
  { in: 'Tolong', mn: 'Fia', exIn: 'Tolong bantu saya.', exMn: 'Fia nda.', category: 'Greetings' },
  
  { in: 'Ayah', mn: 'Ate', exIn: 'Ayah pergi ke kebun.', exMn: 'Ate mee wambong.', category: 'Family' },
  { in: 'Ibu', mn: 'Eme', exIn: 'Ibu sedang masak.', exMn: 'Eme nan fia.', category: 'Family' },
  { in: 'Anak', mn: 'Tae', exIn: 'Anak itu bermain.', exMn: 'Tae di bera.', category: 'Family' },
  { in: 'Nenek', mn: 'Meme', exIn: 'Nenek bercerita.', exMn: 'Meme weng.', category: 'Family' },
  
  { in: 'Pohon', mn: 'Ti', exIn: 'Pohon itu besar.', exMn: 'Ti di bera.', category: 'Nature/Animals' },
  { in: 'Air', mn: 'Tii', exIn: 'Air sungai jernih.', exMn: 'Tii bera.', category: 'Nature/Animals' },
  { in: 'Burung', mn: 'Awi', exIn: 'Burung terbang tinggi.', exMn: 'Awi mee.', category: 'Nature/Animals' },
  { in: 'Babi', mn: 'Faf', exIn: 'Babi hutan lari.', exMn: 'Faf mee.', category: 'Nature/Animals' },
  
  { in: 'Sagu', mn: 'Fi', exIn: 'Makan papeda sagu.', exMn: 'Nan fi.', category: 'Food' },
  { in: 'Ikan', mn: 'Jik', exIn: 'Bakar ikan segar.', exMn: 'Fia jik.', category: 'Food' },
  { in: 'Pisang', mn: 'Kwi', exIn: 'Pisang ini manis.', exMn: 'Kwi di bera.', category: 'Food' },
  
  { in: 'Makan', mn: 'Nan', exIn: 'Mari kita makan.', exMn: 'Mai nan.', category: 'Daily activities' },
  { in: 'Tidur', mn: 'Nuk', exIn: 'Waktunya tidur.', exMn: 'Nuk bera.', category: 'Daily activities' },
  { in: 'Jalan', mn: 'Mee', exIn: 'Jalan ke hutan.', exMn: 'Mee wambong.', category: 'Daily activities' },
  { in: 'Kerja', mn: 'Fia', exIn: 'Kerja di kebun.', exMn: 'Fia wambong.', category: 'Daily activities' },
  
  { in: 'Satu', mn: 'Mung', exIn: 'Satu ekor burung.', exMn: 'Mung awi.', category: 'Numbers' },
  { in: 'Dua', mn: 'Neng', exIn: 'Dua buah pisang.', exMn: 'Neng kwi.', category: 'Numbers' },
  { in: 'Tiga', mn: 'Neng mung', exIn: 'Tiga orang anak.', exMn: 'Neng mung tae.', category: 'Numbers' },
  
  { in: 'Merah', mn: 'Krak', exIn: 'Kain warna merah.', exMn: 'Krak bera.', category: 'Colors' },
  { in: 'Hitam', mn: 'Guk', exIn: 'Batu hitam.', exMn: 'Guk bera.', category: 'Colors' },
  { in: 'Putih', mn: 'Pik', exIn: 'Awan putih.', exMn: 'Pik bera.', category: 'Colors' },
  
  { in: 'Senang', mn: 'Er', exIn: 'Hati saya senang.', exMn: 'Nda er.', category: 'Emotions' },
  { in: 'Marah', mn: 'Grak', exIn: 'Dia sedang marah.', exMn: 'Di grak.', category: 'Emotions' },
  
  { in: 'Kepala', mn: 'Nggok', exIn: 'Kepala saya sakit.', exMn: 'Nggok nda.', category: 'Body parts' },
  { in: 'Tangan', mn: 'Teng', exIn: 'Cuci tanganmu.', exMn: 'Tii teng.', category: 'Body parts' },
  
  { in: 'Parang', mn: 'Kaf', exIn: 'Bawa parang ke kebun.', exMn: 'Kaf mee wambong.', category: 'Tools' },
  { in: 'Noken', mn: 'Nggam', exIn: 'Isi noken dengan sagu.', exMn: 'Nggam fi.', category: 'Tools' }
];

export const categories = [
  'Greetings', 'Family', 'Nature/Animals', 'Food', 'Daily activities', 
  'Numbers', 'Colors', 'Emotions', 'Body parts', 'Tools'
];

const backgroundImages = [
  'https://images.unsplash.com/photo-1701779664625-bae9a15220f7?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1505564386-27d26fd07796?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552957147-41398dee2d4a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1683366343182-fe8bac8718ea?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1678380601766-32d249ad08d5?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1664377505814-e929c0281133?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1533218178582-faf245e00dbd?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1466398263247-f7b01f67169d?auto=format&fit=crop&q=80&w=1200'
];

const translatorNames = [
  'Marthinus Wenda', 'Yohanes Kogoya', 'Markus Tabuni', 'Simon Gire', 
  'Daniel Wonda', 'Habel Yoku', 'Paulus Kogoya', 'Yakob Waimbo', 'Petrus Yanengga'
];

const districtNames = [
  'Distrik Arso Timur', 'Distrik Arso', 'Distrik Arso Barat', 
  'Distrik Mannem', 'Distrik Senggi', 'Distrik Web', 
  'Distrik Towe', 'Distrik Yaffi', 'Distrik Waris', 
  'Distrik Kesenar', 'Distrik Skanto'
];

// Generator function for dynamic tribe naming
const generateTribesForDistrict = (districtName, districtIndex) => {
  const numTribes = 3 + (districtIndex % 3); // Alternates 3, 4, 5 tribes per district
  const tribes = [];
  
  for (let i = 0; i < numTribes; i++) {
    const tribeIndex = (districtIndex * 5) + i;
    const isSkofro = districtIndex === 0 && i === 0; // Special case for existing data matching
    const tribeName = isSkofro ? 'Suku Skofro' : `Suku ${String.fromCharCode(65 + (tribeIndex % 26))}${['wi', 'ku', 'ya', 're', 'ko'][tribeIndex % 5]}`;
    
    // Create slight dialect variations based on tribe index
    const suffix = i === 0 ? '' : i % 2 === 0 ? 'a' : 'o';
    const prefix = i > 2 ? 'W' : '';
    
    const vocabulary = baseVocab.map((word) => {
      let dialectMn = word.mn;
      if (i !== 0) {
        dialectMn = `${prefix}${word.mn.toLowerCase()}${suffix}`;
        dialectMn = dialectMn.charAt(0).toUpperCase() + dialectMn.slice(1);
      }
      return {
        indonesianWord: word.in,
        localWord: dialectMn,
        exampleIndonesian: word.exIn,
        exampleLocal: word.exMn.replace(word.mn, dialectMn).replace(word.mn.toLowerCase(), dialectMn.toLowerCase()),
        category: word.category
      };
    });

    tribes.push({
      id: tribeName.toLowerCase().replace(/\s+/g, '-'),
      name: tribeName,
      backgroundImage: backgroundImages[tribeIndex % backgroundImages.length],
      translator: {
        name: translatorNames[tribeIndex % translatorNames.length],
        role: i === 0 ? 'Kepala Adat' : 'Pakar Bahasa Lokal',
        description: `Penjaga warisan budaya dan bahasa lisan untuk ${tribeName} di ${districtName}. Bertanggung jawab memverifikasi makna dan konteks kata.`
      },
      vocabulary
    });
  }
  return tribes;
};

// Generate the 11 districts
export const dictionaryData = districtNames.map((name, index) => ({
  id: name.toLowerCase().replace(/\s+/g, '-'),
  name,
  description: `Pusat kebudayaan dan keragaman bahasa dari ${3 + (index % 3)} suku asli yang mendiami wilayah ini.`,
  tribes: generateTribesForDistrict(name, index)
}));