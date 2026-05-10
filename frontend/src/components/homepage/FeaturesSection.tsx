const features = [
  {
    title: 'Completely Private',
    image: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80',
    description: 'Contributors can write, but the diary stays private to its owner.',
    rotate: '-rotate-2',
  },
  {
    title: 'From Heart',
    image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=900&q=80',
    description: 'A focused writing experience for messages that need room to breathe.',
    rotate: 'rotate-1 translate-y-4',
  },
  {
    title: 'Legacy Vault',
    image: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=900&q=80',
    description: 'A lasting archive for memories, letters, and final words.',
    rotate: '-rotate-1 md:-translate-y-3',
  },
  {
    title: 'Peace of Mind',
    image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80',
    description: 'A gentle product surface for emotionally meaningful moments.',
    rotate: 'rotate-2 translate-y-2',
  },
];

export default function FeaturesSection() {
  return (
    <section id="memories" className="py-20">
      <div className="page-container">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="section-kicker mb-5">Why Farewell Diary?</span>
          <h2 className="brand-script text-5xl font-bold text-primary">
            A sanctuary for the words people keep.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Industrial-ready does not have to feel cold. The app keeps workflows clear,
            responsive, and polished while preserving the emotional warmth of a diary.
          </p>
        </div>

        <div className="grid gap-7 md:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className={`group relative ${feature.rotate} transition-transform duration-300 hover:rotate-0 hover:translate-y-0`}
            >
              <div className="sanctuary-card relative flex aspect-[4/5] flex-col rounded-xl p-4 pb-8">
                <div className="polaroid-tape" />
                <div className="mb-5 min-h-0 flex-1 overflow-hidden rounded-lg border border-border/60 bg-[hsl(var(--surface-strong))]">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="brand-script text-center text-3xl font-bold text-primary">
                  {feature.title}
                </h3>
                <p className="mt-2 text-center text-sm leading-6 text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
