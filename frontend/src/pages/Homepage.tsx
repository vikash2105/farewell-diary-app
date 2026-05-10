import { useNavigate } from 'react-router-dom';
import { BookOpen, Heart, Home, Menu, PenLine, User } from 'lucide-react';
import { authApi } from '../api';
import ThemeToggle from '../components/ThemeToggle';
import { useAuthStore } from '../stores/authStore';

import DonationSection from '../components/homepage/DonationSection';
import FeaturesSection from '../components/homepage/FeaturesSection';
import HeroSection from '../components/homepage/HeroSection';
import SupportersSection from '../components/homepage/SupportersSection';
import TestimonialsSection from '../components/homepage/TestimonialsSection';

export default function Homepage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    authApi.loginWithGoogle(`${window.location.origin}/dashboard`);
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="site-shell overflow-x-hidden pb-24 md:pb-0">
      <header className="sticky top-0 z-50 border-b border-border/60 bg-background/90 shadow-sm backdrop-blur-xl">
        <nav className="page-container flex h-16 items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
            aria-label="Go to homepage"
          >
            <Heart className="h-7 w-7 text-primary" fill="currentColor" />
            <span className="brand-script text-3xl font-bold text-primary">
              Farewell Diary
            </span>
          </button>

          <div className="hidden items-center gap-7 md:flex">
            <button
              onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-bold text-primary"
            >
              Memories
            </button>
            <button
              onClick={() => document.getElementById('testimonials')?.scrollIntoView({ behavior: 'smooth' })}
              className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
            >
              Letters
            </button>
            <button
              onClick={scrollToBottom}
              className="text-sm font-semibold text-muted-foreground transition hover:text-primary"
            >
              Support Us
            </button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={handleGetStarted}
              className="btn btn-primary hidden sm:inline-flex"
            >
              {isAuthenticated ? 'Dashboard' : 'Create Diary'}
            </button>
            <button className="btn btn-secondary h-11 w-11 px-0 md:hidden" aria-label="Open menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </nav>
      </header>

      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <SupportersSection />
      <DonationSection />

      <footer className="border-t border-border/60 bg-[hsl(var(--surface-container))] py-12 text-foreground">
        <div className="page-container">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <div className="mb-4 flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" fill="currentColor" />
                <span className="brand-script text-3xl font-bold text-primary">
                  Farewell Diary
                </span>
              </div>
              <p className="max-w-sm text-muted-foreground">
                A private, secure place to preserve the farewell messages that matter most.
              </p>
            </div>

            <div>
              <h3 className="mb-4 font-bold">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button onClick={handleGetStarted} className="transition-colors hover:text-primary">
                    Create Diary
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
                    className="transition-colors hover:text-primary"
                  >
                    How It Works
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
                    className="transition-colors hover:text-primary"
                  >
                    Privacy & Security
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="mb-4 font-bold">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <button onClick={scrollToBottom} className="transition-colors hover:text-primary">
                    Donate
                  </button>
                </li>
                <li>
                  <a href="mailto:support@farewelldiary.com" className="transition-colors hover:text-primary">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 border-t border-border/70 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2026 Farewell Diary. Preserving legacies with grace.</p>
            <p className="mt-2">
              Independently built and maintained. No ads, no tracking, just care.
            </p>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-0 z-50 w-full border-t border-border/60 bg-background/90 shadow-[0_-8px_24px_hsl(320_8%_10%/0.08)] backdrop-blur-xl md:hidden">
        <div className="grid h-20 grid-cols-4 px-4 text-xs font-bold text-muted-foreground">
          <button className="flex flex-col items-center justify-center gap-1 text-primary">
            <span className="rounded-full bg-primary/12 p-2">
              <Home className="h-5 w-5" />
            </span>
            Home
          </button>
          <button onClick={handleGetStarted} className="flex flex-col items-center justify-center gap-1">
            <PenLine className="h-5 w-5" />
            Write
          </button>
          <button
            onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
            className="flex flex-col items-center justify-center gap-1"
          >
            <BookOpen className="h-5 w-5" />
            Journal
          </button>
          <button onClick={handleGetStarted} className="flex flex-col items-center justify-center gap-1">
            <User className="h-5 w-5" />
            Profile
          </button>
        </div>
      </div>
    </div>
  );
}
