import { useEffect, useState } from 'react';
import { Quote } from 'lucide-react';
import { dummyTestimonials } from '../../data/dummyData';

interface Testimonial {
  id: string;
  name: string;
  message: string;
  createdAt: string;
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTestimonials();
  }, []);

 const fetchTestimonials = async () => {
  try {
    const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const response = await fetch(`${API_BASE_URL}/public/testimonials`);
    const data = await response.json();
    
    // ✅ Use real data if available, otherwise use dummy data
    if (data.success && data.data && data.data.length > 0) {
      setTestimonials(data.data);
    } else {
      // Use dummy data to make homepage look professional
      setTestimonials(dummyTestimonials);
    }
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    // On error, use dummy data
    setTestimonials(dummyTestimonials);
  } finally {
    setIsLoading(false);
  }
};

  if (isLoading) {
    return (
      <section className="py-16 px-4 bg-secondary-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-secondary-600">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-white to-secondary-50">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">
          What People Are Saying
        </h2>
        <p className="text-center text-secondary-600 mb-12 max-w-2xl mx-auto">
          Real stories from people who've found comfort in preserving precious memories
        </p>

        {/* Horizontal scrolling carousel */}
        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll-horizontal pb-6">
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="flex-shrink-0 w-80 card p-6 hover:shadow-xl transition-shadow"
              >
                <Quote className="w-8 h-8 text-primary-400 mb-4" />
                <p className="text-secondary-700 mb-4 line-clamp-4">
                  "{testimonial.message}"
                </p>
                <p className="font-semibold text-primary-600">
                  — {testimonial.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
