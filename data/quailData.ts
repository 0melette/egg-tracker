export interface QuailProfile {
  id: string;
  name: string;
  sex: 'Male' | 'Female' | 'Unknown';
  bio: string;
  favoriteFood: string;
  imageSrc: string; // Path to the quail's specific image
}

export const quailsDB: QuailProfile[] = [
  {
    id: 'q1',
    name: 'Quail1',
    sex: 'Male',
    bio: 'Loves to perch on the highest spot and survey his domain. Confident and calm.',
    favoriteFood: 'Sunflower seeds',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q2',
    name: 'Quail2',
    sex: 'Female',
    bio: 'Always grooming others in the flock. A nurturing and social quail.',
    favoriteFood: 'Mealworms',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q3',
    name: 'Quail3',
    sex: 'Male',
    bio: 'The fastest runner in the group. Darting between shadows is his specialty.',
    favoriteFood: 'Cracked corn',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q4',
    name: 'Quail4',
    sex: 'Female',
    bio: 'Quiet and observant, she watches before she acts. Wise beyond her years.',
    favoriteFood: 'Millet',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q5',
    name: 'Quail5',
    sex: 'Male',
    bio: 'Always curious and poking his beak into new places. Trouble follows.',
    favoriteFood: 'Berries',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q6',
    name: 'Quail6',
    sex: 'Female',
    bio: 'Loves to sunbathe and nap in the warmest spot she can find.',
    favoriteFood: 'Fresh greens',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q7',
    name: 'Quail7',
    sex: 'Male',
    bio: 'Very vocal and sings to the sunrise every morning. A true morning bird.',
    favoriteFood: 'Oats',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q8',
    name: 'Quail8',
    sex: 'Female',
    bio: 'Bold and fearless, she once chased off a curious cat.',
    favoriteFood: 'Insects',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q9',
    name: 'Quail9',
    sex: 'Male',
    bio: 'A prankster of the flock, known for stealing bits of straw.',
    favoriteFood: 'Rice grains',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q10',
    name: 'Quail10',
    sex: 'Female',
    bio: 'Loves nesting and arranging feathers just right. A perfectionist.',
    favoriteFood: 'Pumpkin seeds',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q11',
    name: 'Quail11',
    sex: 'Male',
    bio: 'A gentle giant who always lets others eat first.',
    favoriteFood: 'Peas',
    imageSrc: '/images/quail.png',
  },
  {
    id: 'q12',
    name: 'Quail12',
    sex: 'Female',
    bio: 'Mysterious and often active at dusk, she chirps soft lullabies.',
    favoriteFood: 'Small insects',
    imageSrc: '/images/quail.png',
  },
];
