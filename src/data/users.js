export const USERS = [
  {
    id: 'u1',
    role: 'trainee',
    fullName: 'Ahmed Stagiaire',
    cef: '20240001',
    password: '123', // Keeping it simple for demo '123456' usually requested, let's use 123456 as requested
  },
  {
    id: 'u2',
    role: 'trainee',
    fullName: 'Fatima Zahra Trainee',
    cef: '20240002',
    password: '123'
  },
  {
    id: 'u3',
    role: 'admin',
    fullName: 'Admin CMC BMK',
    email: 'admin@cmcbmk.ma',
    password: 'admin'
  }
];

// Re-assigning requested passwords to be exact
USERS[0].password = '123456';
USERS[1].password = '123456';
USERS[2].password = 'admin123';
