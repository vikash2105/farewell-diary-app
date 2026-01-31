import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { authApi } from '../../api';

const quotes = [
  "Because Some Goodbyes Deserve to be Remembered",
  "A Private Space for the Words That Matter Most",
  "Preserve the Memories That Define Us",
  "Every Farewell Tells a Story Worth Keeping",
];

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateDiary = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      authApi.loginWithGoogle();
    }
  };

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-secondary-50 opacity-60" />
      
      <div className="relative max-w-5xl mx-auto text-center">
        {/* Rotating quote with fade animation */}
        <h1 className="text-5xl md:text-7xl font-bold mb-8 animate-fade-in">
          <span className="bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 bg-clip-text text-transparent">
            {quotes[0]}
          </span>
        </h1>

        <p className="text-xl md:text-2xl text-secondary-700 mb-6 max-w-3xl mx-auto animate-slide-up">
          Create a private, encrypted space where friends and loved ones can write 
          heartfelt farewell messages that only you can see.
        </p>

        <p className="text-lg text-secondary-600 mb-12 animate-slide-up">
          Beautiful. Private. Forever Yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
          <button
            onClick={handleCreateDiary}
            className="btn btn-primary text-lg px-8 py-4 shadow-2xl hover:shadow-primary-500/50 hover:scale-105 transition-all duration-300"
          >
            Create Your Diary
          </button>
          
          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight / 2, behavior: 'smooth' })}
            className="btn bg-white text-primary-600 border-2 border-primary-200 hover:border-primary-400 text-lg px-8 py-4"
          >
            Learn More
          </button>
        </div>
      </div>

      {/* Floating elements for visual interest */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary-200 rounded-full opacity-20 animate-float" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary-200 rounded-full opacity-20 animate-float" style={{ animationDelay: '1s' }} />
    </section>
  );
}
