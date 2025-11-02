import { supabase } from '@/lib/supabase';

export interface Device {
  id: string;
  nom: string;
  marque: string;
  type: string;
  image_url?: string;
}

export async function getDevices(): Promise<Device[]> {
  const { data, error } = await supabase
    .from('appareils')
    .select('id, nom, marque, type, image_url');

  if (error) {
    console.error('Error fetching devices:', error);
    throw error;
  }

  return data || [];
}

export async function getDeviceById(id: string): Promise<Device | null> {
  const { data, error } = await supabase
    .from('appareils')
    .select('id, nom, marque, type, image_url')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching device:', error);
    return null;
  }

  return data;
}

