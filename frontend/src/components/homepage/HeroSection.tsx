import { ArrowRight, BookHeart, Feather, LockKeyhole } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../api';
import { useAuthStore } from '../../stores/authStore';

export default function HeroSection() {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  const handleCreateDiary = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
      return;
    }

    authApi.loginWithGoogle(`${window.location.origin}/dashboard`);
  };

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="page-container">
        <div className="relative mx-auto max-w-5xl text-center">
          <BookHeart className="absolute right-4 top-0 -z-10 h-32 w-32 rotate-12 text-primary/10 md:h-44 md:w-44" />

          <span className="section-kicker mb-7">Private legacy space</span>
          <h1 className="brand-script mx-auto max-w-4xl text-balance text-5xl font-bold leading-tight text-primary md:text-7xl">
            Because Some Goodbyes Deserve to be Remembered.
          </h1>
          <p className="brand-script mx-auto mt-7 max-w-2xl text-3xl font-semibold text-muted-foreground md:text-4xl">
            Create a private, encrypted space.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            Preserve your life story, invite loved ones to write final words, and keep every
            message in a calm digital sanctuary built for privacy and dignity.
          </p>

          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <button onClick={handleCreateDiary} className="btn btn-primary px-8 py-4 text-base">
              <Feather className="h-5 w-5" />
              Create Your Diary
            </button>
            <button
              onClick={() => document.getElementById('memories')?.scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary px-8 py-4 text-base"
            >
              Learn More
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl gap-4 md:grid-cols-3">
          {[
            ['Encrypted by design', 'Only the diary owner can read submitted notes.'],
            ['One link to share', 'Invite family and friends without complicated setup.'],
            ['Built for reflection', 'Writing and reading stay focused, calm, and human.'],
          ].map(([title, copy]) => (
            <div key={title} className="glass-panel rounded-xl p-5 text-left">
              <LockKeyhole className="mb-4 h-6 w-6 text-primary" />
              <h2 className="font-bold text-foreground">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{copy}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
