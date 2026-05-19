import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import pb from '@/lib/pocketbaseClient.js';

const AdminDataContext = createContext(null);

const DISTRICTS = ['Arso', 'Arso Barat', 'Arso Timur', 'Mannem', 'Waris', 'Senggi', 'Web', 'Yaffi', 'Skanto', 'Towe', 'Kaisenar'];
const BASE_VOCAB = [
  { in: 'Satu', exIn: 'Satu orang', exLoc: 'Mung nda' },
  { in: 'Dua', exIn: 'Dua hari', exLoc: 'Neng ra' },
  { in: 'Makan', exIn: 'Makan sagu', exLoc: 'Nan fi' },
  { in: 'Minum', exIn: 'Minum air', exLoc: 'Nan tii' },
  { in: 'Rumah', exIn: 'Rumah adat', exLoc: 'Nggam ate' },
];

const generateInitialState = () => {
  return DISTRICTS.map((districtName, dIdx) => {
    const tribes = Array.from({ length: 2 }).map((_, tIdx) => {
      const tribeName = `Suku ${districtName.split(' ')[0]}${tIdx === 0 ? 'ya' : 'wi'}`;
      const vocabulary = BASE_VOCAB.map((v, vIdx) => {
        const localWord = `${tIdx === 0 ? 'M' : 'K'}${v.exLoc.split(' ')[0].toLowerCase()}${dIdx % 2 === 0 ? 'a' : 'o'}`;
        return {
          id: `v-${dIdx}-${tIdx}-${vIdx}`,
          indonesianWord: v.in,
          localWord: localWord.charAt(0).toUpperCase() + localWord.slice(1),
          exampleIndonesian: v.exIn,
          exampleLocal: v.exLoc.replace(v.exLoc.split(' ')[0], localWord)
        };
      });

      return {
        id: `tribe-${dIdx}-${tIdx}`,
        namaSuku: tribeName,
        namaKepalaSuku: `Ondoafi ${['Markus', 'Yohanes', 'Petrus', 'Simon'][dIdx % 4]}`,
        profilSuku: `${tribeName} adalah salah satu suku asli yang mendiami wilayah ${districtName}, Kabupaten Keerom.`,
        kamusKosakata: vocabulary
      };
    });

    return { id: `district-${dIdx}`, name: districtName, tribes };
  });
};

// Helper to format detailed PocketBase errors
const formatPbError = (error) => {
  let detailedMessage = error.message || 'Unknown error occurred';
  if (error.response?.data) {
    const fieldErrors = Object.entries(error.response.data)
      .map(([field, err]) => `${field}: ${err.message}`)
      .join(', ');
    if (fieldErrors) {
      detailedMessage += ` (${fieldErrors})`;
    }
  } else if (error.response?.message) {
    detailedMessage += ` - ${error.response.message}`;
  }
  return detailedMessage;
};

export const AdminDataProvider = ({ children }) => {
  // Local Storage Data (Legacy)
  const [data, setData] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // PocketBase Data
  const [tribalLeaders, setTribalLeaders] = useState([]);
  const [languageExperts, setLanguageExperts] = useState([]);
  const [isLoadingLeaders, setIsLoadingLeaders] = useState(false);
  const [isLoadingExperts, setIsLoadingExperts] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('keeromCultureData');
    if (saved) {
      try {
        setData(JSON.parse(saved));
      } catch (e) {
        setData(generateInitialState());
      }
    } else {
      setData(generateInitialState());
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('keeromCultureData', JSON.stringify(data));
    }
  }, [data, isLoaded]);

  // --- Legacy Local Storage Actions ---
  const addDistrict = (district) => {
    setData(prev => [...prev, { id: `dist-${Date.now()}`, tribes: [], ...district }]);
    toast.success('District added successfully');
  };
  
  const updateDistrict = (id, updates) => {
    setData(prev => prev.map(d => d.id === id ? { ...d, ...updates } : d));
    toast.success('District updated');
  };
  
  const deleteDistrict = (id) => {
    setData(prev => prev.filter(d => d.id !== id));
    toast.success('District deleted');
  };

  const addTribe = (districtId, tribe) => {
    setData(prev => prev.map(d => d.id === districtId ? { ...d, tribes: [...d.tribes, { id: `trb-${Date.now()}`, kamusKosakata: [], ...tribe }] } : d));
    toast.success('Tribe added successfully');
  };

  const updateTribe = (districtId, tribeId, updates) => {
    setData(prev => prev.map(d => d.id === districtId ? {
      ...d, tribes: d.tribes.map(t => t.id === tribeId ? { ...t, ...updates } : t)
    } : d));
    toast.success('Tribe updated');
  };

  const deleteTribe = (districtId, tribeId) => {
    setData(prev => prev.map(d => d.id === districtId ? {
      ...d, tribes: d.tribes.filter(t => t.id !== tribeId)
    } : d));
    toast.success('Tribe deleted');
  };

  const addVocabulary = (districtId, tribeId, vocab) => {
    setData(prev => prev.map(d => d.id === districtId ? {
      ...d, tribes: d.tribes.map(t => t.id === tribeId ? {
        ...t, kamusKosakata: [...t.kamusKosakata, { id: `voc-${Date.now()}`, ...vocab }]
      } : t)
    } : d));
    toast.success('Vocabulary added');
  };

  const updateVocabulary = (districtId, tribeId, vocabId, updates) => {
    setData(prev => prev.map(d => d.id === districtId ? {
      ...d, tribes: d.tribes.map(t => t.id === tribeId ? {
        ...t, kamusKosakata: t.kamusKosakata.map(v => v.id === vocabId ? { ...v, ...updates } : v)
      } : t)
    } : d));
    toast.success('Vocabulary updated');
  };

  const deleteVocabulary = (districtId, tribeId, vocabId) => {
    setData(prev => prev.map(d => d.id === districtId ? {
      ...d, tribes: d.tribes.map(t => t.id === tribeId ? {
        ...t, kamusKosakata: t.kamusKosakata.filter(v => v.id !== vocabId)
      } : t)
    } : d));
    toast.success('Vocabulary deleted');
  };

  const resetData = () => {
    setData(generateInitialState());
    toast.success('All data has been reset to defaults');
  };

  const importData = (jsonData) => {
    try {
      const parsed = JSON.parse(jsonData);
      if (Array.isArray(parsed)) {
        setData(parsed);
        toast.success('Data imported successfully');
      } else {
        toast.error('Invalid JSON format');
      }
    } catch (e) {
      toast.error('Failed to parse JSON file');
    }
  };

  // --- PocketBase Actions: Tribal Leaders ---
  const fetchTribalLeaders = useCallback(async () => {
    setIsLoadingLeaders(true);
    try {
      const records = await pb.collection('tribal_leaders').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setTribalLeaders(records);
    } catch (error) {
      console.error('Error fetching tribal leaders:', error);
      toast.error('Failed to load tribal leaders');
    } finally {
      setIsLoadingLeaders(false);
    }
  }, []);

  const createTribalLeader = async ({ district, leader_name, leader_photo, leader_bio }) => {
    const formData = new FormData();
    
    formData.append('district', district);
    formData.append('leader_name', leader_name);
    
    if (leader_bio) {
      formData.append('leader_bio', leader_bio);
    }
    
    if (leader_photo instanceof File) {
      formData.append('leader_photo', leader_photo);
    }

    try {
      const record = await pb.collection('tribal_leaders').create(formData, { $autoCancel: false });
      setTribalLeaders(prev => [record, ...prev]);
      return record;
    } catch (error) {
      console.error('PocketBase error in createTribalLeader:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to create tribal leader: ${detailedMessage}`);
    }
  };

  const updateTribalLeader = async (id, data) => {
    try {
      const formData = new FormData();
      if (data.district) formData.append('district', data.district);
      if (data.leader_name) formData.append('leader_name', data.leader_name);
      if (data.leader_bio !== undefined && data.leader_bio !== null) formData.append('leader_bio', data.leader_bio);

      if (data.leader_photo instanceof File) {
        formData.append('leader_photo', data.leader_photo);
      }

      const record = await pb.collection('tribal_leaders').update(id, formData, { $autoCancel: false });
      setTribalLeaders(prev => prev.map(item => item.id === id ? record : item));
      return record;
    } catch (error) {
      console.error('Error updating tribal leader:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to update tribal leader: ${detailedMessage}`);
    }
  };

  const deleteTribalLeader = async (id) => {
    try {
      await pb.collection('tribal_leaders').delete(id, { $autoCancel: false });
      setTribalLeaders(prev => prev.filter(item => item.id !== id));
      toast.success('Tribal leader deleted successfully');
    } catch (error) {
      console.error('Error deleting tribal leader:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to delete tribal leader: ${detailedMessage}`);
    }
  };

  // --- PocketBase Actions: Language Experts ---
  const fetchLanguageExperts = useCallback(async () => {
    setIsLoadingExperts(true);
    try {
      const records = await pb.collection('language_experts').getFullList({
        sort: '-created',
        $autoCancel: false
      });
      setLanguageExperts(records);
    } catch (error) {
      console.error('Error fetching language experts:', error);
      toast.error('Failed to load language experts');
    } finally {
      setIsLoadingExperts(false);
    }
  }, []);

  const createLanguageExpert = async ({ district, expert_name, expert_photo, expertise, expert_bio }) => {
    const formData = new FormData();
    
    formData.append('district', district);
    formData.append('expert_name', expert_name);
    formData.append('expertise', expertise);
    
    if (expert_bio) {
      formData.append('expert_bio', expert_bio);
    }
    
    if (expert_photo instanceof File) {
      formData.append('expert_photo', expert_photo);
    }

    try {
      const record = await pb.collection('language_experts').create(formData, { $autoCancel: false });
      setLanguageExperts(prev => [record, ...prev]);
      return record;
    } catch (error) {
      console.error('PocketBase error in createLanguageExpert:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to create language expert: ${detailedMessage}`);
    }
  };

  const updateLanguageExpert = async (id, data) => {
    try {
      const formData = new FormData();
      if (data.district) formData.append('district', data.district);
      if (data.expert_name) formData.append('expert_name', data.expert_name);
      if (data.expertise) formData.append('expertise', data.expertise);
      if (data.expert_bio !== undefined && data.expert_bio !== null) formData.append('expert_bio', data.expert_bio);

      if (data.expert_photo instanceof File) {
        formData.append('expert_photo', data.expert_photo);
      }

      const record = await pb.collection('language_experts').update(id, formData, { $autoCancel: false });
      setLanguageExperts(prev => prev.map(item => item.id === id ? record : item));
      return record;
    } catch (error) {
      console.error('Error updating language expert:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to update language expert: ${detailedMessage}`);
    }
  };

  const deleteLanguageExpert = async (id) => {
    try {
      await pb.collection('language_experts').delete(id, { $autoCancel: false });
      setLanguageExperts(prev => prev.filter(item => item.id !== id));
      toast.success('Language expert deleted successfully');
    } catch (error) {
      console.error('Error deleting language expert:', error);
      const detailedMessage = formatPbError(error);
      throw new Error(`Failed to delete language expert: ${detailedMessage}`);
    }
  };

  return (
    <AdminDataContext.Provider value={{ 
      data, addDistrict, updateDistrict, deleteDistrict, 
      addTribe, updateTribe, deleteTribe, 
      addVocabulary, updateVocabulary, deleteVocabulary,
      resetData, importData,
      // New PB state and actions
      tribalLeaders, isLoadingLeaders, fetchTribalLeaders, createTribalLeader, updateTribalLeader, deleteTribalLeader,
      languageExperts, isLoadingExperts, fetchLanguageExperts, createLanguageExpert, updateLanguageExpert, deleteLanguageExpert
    }}>
      {children}
    </AdminDataContext.Provider>
  );
};

export const useAdminData = () => {
  const context = useContext(AdminDataContext);
  if (!context) throw new Error('useAdminData must be used within an AdminDataProvider');
  return context;
};