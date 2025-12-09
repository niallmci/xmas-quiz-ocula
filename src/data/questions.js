// src/data/questions.js
// Add your team members' trees here!
// Image naming: name_tree.jpg (e.g., john_tree.jpg, sarah_tree.jpg)

export const questions = [
  {
    id: 1,
    imageUrl: '/images/danny_tree.jpeg',
    correctAnswer: 'Dannyyy',
  },
  {
    id: 2,
    imageUrl: '/images/niall_tree.jpeg',
    correctAnswer: 'Niall',
  },
  {
    id: 3,
    imageUrl: '/images/brendy_tree.jpg',
    correctAnswer: 'Brendy',
  },
  {
    id: 4,
    imageUrl: '/images/ronan_tree.jpg',
    correctAnswer: 'Ronan',
  },
  {
    id: 5,
    imageUrl: '/images/alex_tree.jpg',
    correctAnswer: 'Alex',
  },
  {
    id: 6,
    imageUrl: '/images/oscar_tree.jpg',
    correctAnswer: 'Oscar',
  },
  {
    id: 7,
    imageUrl: '/images/tom_tree.jpg',
    correctAnswer: 'Tom',
 
  },
  {
    id: 8,
    imageUrl: '/images/izzy_tree.jpg',
    correctAnswer: 'Izzy',
  },
  {
    id: 9,
    imageUrl: '/images/dean_tree.jpg',
    correctAnswer: 'Dean',
  },
  {
    id: 10,
    imageUrl: '/images/ioanna_tree.jpg',
    correctAnswer: 'Ioanna',
  },
  {
    id: 11,
    imageUrl: '/images/noel_tree.jpg',
    correctAnswer: 'Noel',
  },
  // Add more team members...
  // Example:
  // {
  //   id: 6,
  //   imageUrl: '/images/niall_tree.jpg',
  //   correctAnswer: 'Niall',
  // },
];

// Generate all name options from the correct answers
export const allNames = questions.map(q => q.correctAnswer);
