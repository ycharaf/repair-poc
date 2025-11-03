import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { DeviceCard } from '@/features/devices/DeviceCard';

interface Device {
  id: string;
  nom: string;
  marque: string;
  type: string;
  image_url?: string;
}

export default function DevicesPage() {
  const navigate = useNavigate();
  const [devices, setDevices] = useState<Device[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDevices();
  }, []);

  async function fetchDevices() {
    try {
      const { data, error } = await supabase
        .from('appareils')
        .select('id, nom, marque, type, image_url')
        .order('marque', { ascending: true });

      if (error) {
        console.error('Error fetching devices:', error);
        setDevices([]);
      } else {
        setDevices(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setDevices([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl text-gray-600">Chargement des appareils...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Sélectionnez votre appareil</h1>
          <p className="text-gray-600 mb-8">
            Choisissez l'appareil que vous souhaitez faire réparer
          </p>

          {devices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">Aucun appareil disponible pour le moment</p>
              <p className="text-sm text-gray-500">Veuillez vérifier votre configuration Supabase</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <DeviceCard
                  key={device.id}
                  id={device.id}
                  nom={device.nom}
                  marque={device.marque}
                  type={device.type}
                  image_url={device.image_url}
                  onSelect={(id) => navigate(`/estimation/${id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
