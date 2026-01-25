import { useNavigate } from 'react-router-dom';
import { Heart, BookOpen, Shield, Users } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { authApi } from '../api/client';

export default function Landing() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      authApi.loginWithGoogle();
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="py-6 px-4">
        <nav className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Heart className="w-8 h-8 text-primary-600" fill="currentColor" />
            <span className="text-2xl font-bold text-primary-600">Farewell Diary</span>
          </div>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
          </button>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent animate-fade-in">
            A Private Place for Farewell Notes
          </h1>
          <p className="text-xl text-secondary-600 mb-8 max-w-2xl mx-auto animate-slide-up">
            Create your personal diary and invite friends to write heartfelt farewell messages. 
            All notes are private and visible only to you.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary text-lg px-8 py-4 shadow-xl hover:shadow-2xl"
          >
            Create Your Diary Now
          </button>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">Why Farewell Diary?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <FeatureCard
              icon={<Shield className="w-12 h-12 text-primary-600" />}
              title="Completely Private"
              description="Your notes are encrypted and only visible to you. Friends can write but not read."
            />
            <FeatureCard
              icon={<Users className="w-12 h-12 text-primary-600" />}
              title="Easy Sharing"
              description="Get a unique link to share with friends. They login with Google and write their farewell."
            />
            <FeatureCard
              icon={<BookOpen className="w-12 h-12 text-primary-600" />}
              title="Beautiful Notes"
              description="Choose from handwriting, serif, or cursive fonts for emotional expression."
            />
            <FeatureCard
              icon={<Heart className="w-12 h-12 text-primary-600" />}
              title="Forever Yours"
              description="Keep these precious memories safe and accessible whenever you need them."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center card p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to start?</h2>
          <p className="text-secondary-600 mb-8">
            Create your farewell diary in seconds. It's free and always will be.
          </p>
          <button
            onClick={handleGetStarted}
            className="btn btn-primary text-lg px-8 py-4"
          >
            Create Your Diary
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-secondary-200">
        <div className="max-w-7xl mx-auto text-center text-secondary-600">
          <p>&copy; 2026 Farewell Diary. Made with ❤️ for preserving memories.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="card p-6 text-center hover:shadow-xl transition-shadow">
      <div className="flex justify-center mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-secondary-600">{description}</p>
    </div>
  );
}
