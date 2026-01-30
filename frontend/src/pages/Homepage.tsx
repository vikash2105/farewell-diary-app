import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/client';

// Sections
import HeroSection from '../components/homepage/HeroSection';
import FeaturesSection from '../components/homepage/FeaturesSection';
import TestimonialsSection from '../components/homepage/TestimonialsSection';
import SupportersSection from '../components/homepage/SupportersSection';
import DonationSection from '../components/homepage/DonationSection';

export default function Homepage() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      authApi.loginWithGoogle();
    }
  };

  const scrollToBottom = () => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-secondary-50 to-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-secondary-200 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
            <span className="text-2xl font-bold text-primary-600">
              Farewell Diary
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={scrollToBottom}
              className="hidden md:block text-secondary-600 hover:text-primary-600 transition-colors"
            >
              Support Us
            </button>

            <button
              onClick={handleGetStarted}
              className="btn btn-primary"
            >
              {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>
        </nav>
      </header>

      {/* Sections */}
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <SupportersSection />
      <DonationSection />

      {/* Footer */}
      <footer className="py-12 px-4 bg-secondary-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Heart className="w-6 h-6 text-primary-400" fill="currentColor" />
                <span className="text-xl font-bold">Farewell Diary</span>
              </div>
              <p className="text-secondary-400">
                A private, secure place to preserve the farewell messages that matter most.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2 text-secondary-400">
                <li>
                  <button
                    onClick={handleGetStarted}
                    className="hover:text-white transition-colors"
                  >
                    Create Diary
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    How It Works
                  </button>
                </li>
                <li>
                  <button className="hover:text-white transition-colors">
                    Privacy & Security
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-secondary-400">
                <li>
                  <button
                    onClick={scrollToBottom}
                    className="hover:text-white transition-colors"
                  >
                    Donate
                  </button>
                </li>
                <li>
                  <a
                    href="mailto:support@farewelldiary.com"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-secondary-700 pt-8 text-center text-secondary-400">
            <p>&copy; 2026 Farewell Diary. Made with ❤️ for preserving precious memories.</p>
            <p className="text-sm mt-2">
              Independently built and maintained. No ads, no tracking, just care.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
