import { useState } from 'react';
import { DollarSign, Heart, Send } from 'lucide-react';
import { toast } from 'sonner';

export default function DonationSection() {
  const [amount, setAmount] = useState('10');
  const [customAmount, setCustomAmount] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [displayName, setDisplayName] = useState('');

  const presetAmounts = ['5', '10', '25', '50', '100'];

  const handleDonate = async () => {
    const finalAmount = amount === 'custom' ? customAmount : amount;

    if (!finalAmount || parseFloat(finalAmount) <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!isAnonymous && !displayName.trim()) {
      toast.error('Please enter your name or choose anonymous');
      return;
    }

    toast.info('Payment integration coming soon.', {
      description: 'This donation form is ready for Stripe or Razorpay integration.',
    });
  };

  return (
    <section className="donate-section py-20">
      <div className="page-container grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:items-start">
        <div className="lg:sticky lg:top-24">
          <span className="section-kicker mb-5">Donation form</span>
          <h2 className="brand-script text-5xl font-bold text-primary">
            Help keep the sanctuary open.
          </h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
            Every contribution supports a quieter, safer web experience for people
            preserving memories, notes, and final words.
          </p>
        </div>

        <div className="sanctuary-card relative overflow-hidden p-6 md:p-10">
          <Heart className="absolute -right-8 -top-8 h-36 w-36 text-primary/5" fill="currentColor" />
          <div className="relative space-y-6">
            <div>
              <label className="mb-3 block text-sm font-bold text-muted-foreground">
                Choose Amount
              </label>
              <div className="grid grid-cols-3 gap-3 md:grid-cols-5">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`rounded-full border px-4 py-3 font-extrabold transition ${
                      amount === preset
                        ? 'border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                        : 'border-border bg-background/60 text-foreground hover:border-primary/50'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>

              <div className="mt-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAmount('custom')}
                  className={`rounded-full border px-5 py-3 font-extrabold transition ${
                    amount === 'custom'
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background/60 text-foreground hover:border-primary/50'
                  }`}
                >
                  Custom
                </button>
                {amount === 'custom' && (
                  <div className="relative flex-1">
                    <DollarSign className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(event) => setCustomAmount(event.target.value)}
                      placeholder="Enter amount"
                      className="input pl-11"
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                placeholder="Name"
                disabled={isAnonymous}
                className="input"
              />
              <input type="email" placeholder="Email" className="input" />
            </div>

            <label className="flex items-center gap-3 text-sm font-semibold text-muted-foreground">
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
              />
              Donate anonymously
            </label>

            <textarea
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Leave a message of support..."
              maxLength={200}
              rows={4}
              className="textarea"
            />

            <button onClick={handleDonate} className="btn btn-primary w-full py-4 text-base">
              <Send className="h-5 w-5" />
              Donate ${amount === 'custom' ? customAmount || '0' : amount}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
