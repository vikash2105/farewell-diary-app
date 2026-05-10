import { useEffect, useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Heart } from 'lucide-react';
import { dummyDonations } from '../../data/dummyData';

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
    const fetchDonations = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/public/donations`);
        const data = await response.json();

        setDonations(data.success && data.data?.length > 0 ? data.data : dummyDonations);
      } catch (error) {
        console.error('Error fetching donations:', error);
        setDonations(dummyDonations);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDonations();
  }, []);

  if (isLoading) return null;

  return (
    <section className="py-20">
      <div className="page-container">
        <div className="mb-12 text-center">
          <span className="section-kicker mb-5">Our Supporters</span>
          <h2 className="brand-script text-5xl font-bold text-primary">
            Kept free by kind people.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            These supporters help keep Farewell Diary ad-free and accessible.
          </p>
        </div>

        {donations.length === 0 ? (
          <div className="sanctuary-card mx-auto max-w-xl p-10 text-center">
            <Heart className="mx-auto mb-4 h-14 w-14 text-primary/50" />
            <p className="text-muted-foreground">Be the first to support this project.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {donations.slice(0, 6).map((donation) => (
              <article key={donation.id} className="sanctuary-card p-6">
                <div className="mb-4 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-bold text-primary">{donation.displayName}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(donation.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-extrabold text-primary">
                    {donation.amount}
                  </span>
                </div>

                {donation.message && (
                  <p className="border-l-2 border-primary/30 pl-4 text-sm italic leading-6 text-muted-foreground">
                    &quot;{donation.message}&quot;
                  </p>
                )}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
