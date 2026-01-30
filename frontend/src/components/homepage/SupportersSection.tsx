import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Donation {
  id: string;
  displayName: string;
  amount: string;
  message: string | null;
  createdAt: string;
}

export default function SupportersSection() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonations();
  }, []);

const fetchDonations = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/api/public/donations`);
    const data = await response.json();
    
    if (data.success) {
      setDonations(data.data);
    }
  } catch (error) {
    console.error('Error fetching donations:', error);
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) {
    return null;
  }

  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Our Supporters</h2>
          <p className="text-secondary-600 max-w-2xl mx-auto">
            These amazing people help keep Farewell Diary ad-free and accessible to everyone
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="text-center py-12 card">
            <Heart className="w-16 h-16 text-primary-300 mx-auto mb-4" />
            <p className="text-secondary-600">
              Be the first to support this project!
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => (
              <div
                key={donation.id}
                className="card p-6 hover:shadow-lg transition-shadow border-l-4 border-primary-500"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-semibold text-lg text-primary-700">
                      {donation.displayName}
                    </p>
                    <p className="text-sm text-secondary-500">
                      {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <span className="font-bold text-primary-600 text-xl">
                    {donation.amount}
                  </span>
                </div>
                
                {donation.message && (
                  <p className="text-secondary-700 text-sm italic border-l-2 border-secondary-200 pl-3">
                    "{donation.message}"
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
