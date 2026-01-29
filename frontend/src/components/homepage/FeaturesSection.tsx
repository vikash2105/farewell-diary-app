import { Shield, Users, BookOpen, Heart, Lock, Link2 } from 'lucide-react';

const features = [
  {
    icon: Shield,
    title: "Completely Private",
    description: "End-to-end encryption ensures your notes are eyes-only. Contributors can write but never read."
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "Military-grade encryption, secure authentication, and privacy-first architecture."
  },
  {
    icon: Users,
    title: "Easy Sharing",
    description: "Share a unique link with friends. They login securely and write their farewell."
  },
  {
    icon: Link2,
    title: "No Downloads Needed",
    description: "Everything works in your browser. Access from anywhere, anytime."
  },
  {
    icon: BookOpen,
    title: "Beautiful Presentation",
    description: "Choose from handwriting, serif, or cursive fonts for emotional expression."
  },
  {
    icon: Heart,
    title: "Forever Yours",
    description: "Keep these precious memories safe and accessible whenever you need them."
  },
];

export default function FeaturesSection() {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Farewell Diary?</h2>
          <p className="text-xl text-secondary-600 max-w-2xl mx-auto">
            A secure, private platform designed with care for your most precious memories
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card p-6 hover:shadow-xl transition-all hover:-translate-y-1 duration-300"
            >
              <div className="w-14 h-14 bg-primary-100 rounded-xl flex items-center justify-center mb-4">
                <feature.icon className="w-7 h-7 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
              <p className="text-secondary-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
