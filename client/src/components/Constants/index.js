import {
  javascript,
  typescript,
  html,
  css,
  reactjs,
  tailwind,
  nodejs,
  git,
  threejs,
  MusicHouse,
  ecommerce,
  gericht,
  Apple,
  GPT3,
  bank,
  snake,
  memory,
  rock,
  typing
} from "../../assets";

export const navLinks = [
  {
    id: "about",
    title: "About",
  },
  {
    id: "work",
    title: "Work",
  },
  {
    id: "contact",
    title: "Contact",
  },
];


const technologies = [
  {
    name: "HTML 5",
    icon: html,
  },
  {
    name: "CSS 3",
    icon: css,
  },
  {
    name: "JavaScript",
    icon: javascript,
  },
  {
    name: "TypeScript",
    icon: typescript,
  },
  {
    name: "React JS",
    icon: reactjs,
  },
  ,
  {
    name: "Tailwind CSS",
    icon: tailwind,
  },
  {
    name: "Node JS",
    icon: nodejs,
  },
  {
    name: "Three JS",
    icon: threejs,
  },
  {
    name: "git",
    icon: git,
  },
];


const projects = [
  {
    name: "Music App",
    description:
      "Web-based platform that combines music discovery with lyrics exploration, allowing users to easily search tracks, albums, and artists while uncovering the stories behind the lyrics.",
    tags: [
      {
        name: "react",
      },
      {
        name: "express.js",
      },
      {
        name: "spotifyapi",
      },
      {
        name: "tailwind",
      },
    ],
    image: MusicHouse,
    source_code_link: "https://musichouse-jade.vercel.app/",
  },
  {
    name: "Bank",
    description:
      "A modern digital banking platform designed for seamless money management, combining intuitive functionality with sleek, responsive design.",
    tags: [
      {
        name: "React",
      },
      {
        name: "Tailwind.css",
      },
    ],
    image: bank,
    source_code_link: "https://delonansah.github.io/Hoobank-website-project/",
  },
  {
    name: "E-Commerce Platform",
    description:
      "A full-featured online store with product management, cart functionality, and secure payment processing.",
    tags: [
      {
        name: "React",
      },
      {
        name: "Node.js",
      },
      {
        name: "MongoDB",
      },
      {
        name: "Stripe",
      },
    ],
    image: ecommerce,
    source_code_link: "https://foreverclothing-delonansah.netlify.app/",
  },
  {
    name: "Restaurant",
    description:
      "A modern restaurant showcasing our curated menu, warm ambiance, and easy online reservations designed to deliver a seamless dining experience from screen to table.",
    tags: [
      {
        name: "React",
      },
      {
        name: "Tailwind.css",
      },
    ],
    image: gericht,
    source_code_link: "https://delonansah.github.io/Gericht-Restaurant-clone/",
  },
  {
    name: "GPT-3 AI",
    description:
      "A sleek, user-friendly interface inspired by GPT-3, designed to deliver a clean and efficient AI chat experience for writing, coding, and creative tasks.",
    tags: [
      {
        name: "React.js",
      },
      {
        name: "Tailwind.css",
      },
    ],
    image: GPT3,
    source_code_link: "https://delonansah.github.io/GPT3-website-clone/",
  },
  {
    name: "IPhone15pro showcase",
    description:
      "A sleek and immersive product experience highlighting the iPhone 15 Pro in Natural Titanium, with fluid animations, and an interactive 3D model for a premium feel.",
    tags: [
      {
        name: "React",
      },
      {
        name: "GSAP",
      },
      {
        name: "Three.js",
      },
    ],
    image: Apple,
    source_code_link: "https://delonansah-iphone15pro-page.netlify.app/",
  },

];

// snippets/index.js

const knowledgeSnippets = [
  {
    category: 'Finance',
    content: `Compound interest is the process by which interest is added to the principal, so that from that moment on, the interest that has been added also earns interest.`,
    difficulty: 'easy'
  },
  {
    category: 'Artificial Intelligence',
    content: `Machine learning is a subset of AI where algorithms improve automatically through experience. It relies heavily on data and statistical methods to identify patterns.`,
    difficulty: 'medium'
  },
  {
    category: 'Technology',
    content: `Quantum computing leverages the principles of quantum mechanics, using qubits that can exist in multiple states simultaneously, enabling immense computational power.`,
    difficulty: 'hard'
  },
  {
    category: 'Psychology',
    content: `Cognitive dissonance refers to the mental discomfort experienced when holding two or more conflicting beliefs, values, or attitudes.`,
    difficulty: 'easy'
  },
  {
    category: 'Science',
    content: `Photosynthesis is a biochemical process that converts light energy into chemical energy, allowing plants to produce glucose and release oxygen.`,
    difficulty: 'medium'
  },
  {
    category: 'Economics',
    content: `Inflation is the rate at which the general level of prices for goods and services rises, eroding purchasing power over time.`,
    difficulty: 'easy'
  },
  {
    category: 'History',
    content: `The Renaissance was a period of great cultural, artistic, political, and economic "rebirth" following the Middle Ages, starting in Italy in the 14th century.`,
    difficulty: 'medium'
  },
  {
    category: 'Cybersecurity',
    content: `A zero-day exploit refers to a security vulnerability that is unknown to the software vendor and has not yet been patched, making it a critical threat.`,
    difficulty: 'hard'
  },
  {
    category: 'Biology',
    content: `DNA, or deoxyribonucleic acid, is the hereditary material in humans and almost all other organisms, consisting of two strands forming a double helix.`,
    difficulty: 'medium'
  },
  {
    category: 'Sociology',
    content: `Social stratification refers to a system by which a society ranks categories of people in a hierarchy based on factors like wealth, race, education, and power.`,
    difficulty: 'medium'
  }
];

const games = [
  {
    id: 1,
    title: "Snake Game",
    description: "Classic Snake game with modern twists. Navigate the snake to collect food and grow longer while avoiding walls and yourself.",
    image: snake,
    category: "classic",
    difficulty: "Medium",
    playTime: "5-15 mins",
    rating: 4.5,
    features: ["Score tracking", "Increasing speed", "Wall collision", "Self-collision"],
    tech: ["React", "Framer Motion", "Tailwind CSS"]
  },
  {
    id: 2,
    title: "Typing Challenge",
    description: "Test and improve your typing speed and accuracy with this challenging typing game featuring random quotes and passages.",
    image: typing,
    category: "educational",
    difficulty: "Easy-Medium",
    playTime: "1-10 mins",
    rating: 4.2,
    features: ["WPM calculation", "Accuracy tracking", "Multiple difficulty levels", "Progress charts"],
    tech: [ "React", "Framer Motion","Tailwind CSS" ]
  },
  {
    id: 3,
    title: "Rock Paper Scissors",
    description: "Digital version of the classic hand game with added tournament mode and AI opponents of varying difficulty.",
    image: rock,
    category: "classic",
    difficulty: "Easy",
    playTime: "1-5 mins",
    rating: 4.0,
    features: ["Single player vs AI", "Score history", "Customizable AI"],
    tech: [ "React", "Framer Motion","Tailwind CSS" ]
  },
  {
    id: 4,
    title: "Memory Game",
    description: "Challenge your memory with this card matching game featuring beautiful artwork and multiple difficulty settings.",
    image: memory,
    category: "puzzle",
    difficulty: "Medium-Hard",
    playTime: "5-20 mins",
    rating: 4.7,
    features: ["Multiple themes", "Timer", "Move counter", "High score table"],
    tech: [ "React", "Framer Motion","Tailwind CSS" ]
  }
];




export { technologies, projects, knowledgeSnippets, games };