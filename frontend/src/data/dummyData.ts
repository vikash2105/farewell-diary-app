// Dummy data for homepage - used when backend returns no data

export const dummyDonations = [
  {
    id: 'dummy-1',
    displayName: 'Sarah M.',
    amount: '$25',
    message: 'Such a beautiful way to preserve memories. Thank you for creating this!',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
  },
  {
    id: 'dummy-2',
    displayName: 'Anonymous',
    amount: '$50',
    message: 'In memory of my grandmother. This platform helped us collect beautiful messages.',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), // 5 days ago
  },
  {
    id: 'dummy-3',
    displayName: 'James K.',
    amount: '$10',
    message: null,
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 week ago
  },
  {
    id: 'dummy-4',
    displayName: 'Maria Rodriguez',
    amount: '$100',
    message: 'This helped my family during a difficult time. Worth every penny to keep it ad-free.',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), // 10 days ago
  },
  {
    id: 'dummy-5',
    displayName: 'David & Emma',
    amount: '$30',
    message: 'Used this for our farewell party. Everyone loved leaving their messages!',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 weeks ago
  },
  {
    id: 'dummy-6',
    displayName: 'Anonymous',
    amount: '$15',
    message: null,
    createdAt: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(), // 18 days ago
  },
];

export const dummyTestimonials = [
  {
    id: 'test-1',
    name: 'Emily Chen',
    message: 'I created a farewell diary before moving abroad. Reading the messages from friends and family still brings tears to my eyes. This is more than an app - it\'s a treasure chest of memories.',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-2',
    name: 'Michael Torres',
    message: 'When my father was diagnosed with terminal illness, we used Farewell Diary to collect messages from everyone who loved him. It gave him so much comfort in his final weeks. Forever grateful.',
    createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-3',
    name: 'Priya Sharma',
    message: 'Simple, beautiful, and private. Exactly what I needed for my retirement party. The encrypted notes feature gave everyone the freedom to be honest and heartfelt.',
    createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-4',
    name: 'Robert Williams',
    message: 'I was skeptical at first, but this exceeded all expectations. The interface is intuitive, and the notes people left were incredibly meaningful. Highly recommend!',
    createdAt: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-5',
    name: 'Lisa Anderson',
    message: 'Used this for our team member who was leaving after 15 years. The ability to write anonymously meant people could be vulnerable and genuine. Beautiful experience.',
    createdAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'test-6',
    name: 'Anonymous',
    message: 'This app helped me process grief in a way I never expected. Being able to collect and revisit farewell messages has been healing. Thank you.',
    createdAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
