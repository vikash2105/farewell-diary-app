import { useState } from 'react';
import { Heart, DollarSign } from 'lucide-react';
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

    if (!isAnonymous && !displayName) {
      toast.error('Please enter your name or choose anonymous');
      return;
    }

    // Here you would integrate with Stripe/Razorpay
    // For now, we'll just show a toast
    toast.info('Payment integration coming soon!', {
      description: 'This feature will be available in the next update.',
    });

    // Example of what the integration would look like:
    /*
    try {
      // 1. Create payment intent with Stripe/Razorpay
      const paymentIntent = await createPaymentIntent({
        amount: parseFloat(finalAmount),
      });

      // 2. After successful payment, record donation
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/public/donations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: isAnonymous ? 'Anonymous' : displayName,
          amount: `$${finalAmount}`,
          message: message || null,
          isAnonymous,
          paymentProvider: 'stripe',
          transactionId: paymentIntent.id,
        }),
      });

      if (response.ok) {
        toast.success('Thank you for your support!');
        // Reset form
      }
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    }
    */
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-4xl mx-auto">
        <div className="card p-8 md:p-12">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-primary-600 mx-auto mb-4" fill="currentColor" />
            <h2 className="text-4xl font-bold mb-4">Support Farewell Diary</h2>
            <p className="text-lg text-secondary-600 max-w-2xl mx-auto">
              Help keep Farewell Diary ad-free and scalable as an independent project. 
              Your support helps us maintain this safe space for preserving precious memories.
            </p>
          </div>

          <div className="space-y-6">
            {/* Amount Selection */}
            <div>
              <label className="block text-sm font-semibold mb-3 text-secondary-700">
                Choose Amount
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3 mb-3">
                {presetAmounts.map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setAmount(preset)}
                    className={`py-3 rounded-lg border-2 font-semibold transition-all ${
                      amount === preset
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-secondary-200 hover:border-primary-300'
                    }`}
                  >
                    ${preset}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setAmount('custom')}
                  className={`py-3 px-4 rounded-lg border-2 font-semibold transition-all ${
                    amount === 'custom'
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-secondary-200 hover:border-primary-300'
                  }`}
                >
                  Custom
                </button>
                {amount === 'custom' && (
                  <div className="flex-1 relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-secondary-400" />
                    <input
                      type="number"
                      min="1"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="input pl-10 w-full"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Display Name */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-secondary-700">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Your name"
                disabled={isAnonymous}
                className="input w-full"
              />
            </div>

            {/* Anonymous Option */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
                className="w-4 h-4 text-primary-600 border-secondary-300 rounded focus:ring-primary-500"
              />
              <label htmlFor="anonymous" className="text-sm text-secondary-700">
                Donate anonymously
              </label>
            </div>

            {/* Message */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-secondary-700">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Leave a message of support..."
                maxLength={200}
                rows={3}
                className="input w-full resize-none"
              />
              <p className="text-xs text-secondary-500 mt-1">
                {message.length}/200 characters
              </p>
            </div>

            {/* Donate Button */}
            <button
              onClick={handleDonate}
              className="btn btn-primary w-full text-lg py-4 shadow-lg hover:shadow-xl transition-all"
            >
              <Heart className="w-5 h-5 mr-2" fill="currentColor" />
              Donate ${amount === 'custom' ? customAmount || '0' : amount}
            </button>

            <p className="text-xs text-center text-secondary-500">
              Your donation will be processed securely. We never store your payment information.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
