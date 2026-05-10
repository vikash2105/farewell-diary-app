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
    const fetchTestimonials = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        const response = await fetch(`${API_BASE_URL}/public/testimonials`);
        const data = await response.json();

        setTestimonials(data.success && data.data?.length > 0 ? data.data : dummyTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
        setTestimonials(dummyTestimonials);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (isLoading) {
    return (
      <section id="testimonials" className="py-16">
        <div className="page-container text-center">
          <p className="text-muted-foreground">Loading testimonials...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="py-20">
      <div className="page-container">
        <div className="mb-12 max-w-2xl">
          <span className="section-kicker mb-5">Letters</span>
          <h2 className="brand-script text-5xl font-bold text-primary">
            What people are saying.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Real stories from people who found comfort in preserving precious memories.
          </p>
        </div>

        <div className="relative overflow-hidden">
          <div className="flex gap-6 animate-scroll-horizontal pb-6">
            {testimonials.concat(testimonials).map((testimonial, index) => (
              <div
                key={`${testimonial.id}-${index}`}
                className="glass-panel w-80 flex-shrink-0 rounded-xl p-6 transition-transform hover:-translate-y-1"
              >
                <Quote className="mb-4 h-8 w-8 text-primary/50" />
                <p className="mb-5 line-clamp-4 text-foreground">
                  &quot;{testimonial.message}&quot;
                </p>
                <p className="font-bold text-primary">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
