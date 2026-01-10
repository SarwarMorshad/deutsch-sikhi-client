/* eslint-disable no-undef */
/**
 * A1 Course Complete Seed Data
 * Based on structured learning blueprint
 */

// ==================== LEVELS ====================
const levels = [
  {
    code: "A1",
    title: {
      de: "Anfänger",
      en: "Beginner",
      bn: "শুরু",
    },
    description: {
      de: "Grundlagen der deutschen Sprache",
      en: "Master the basics of German language. Learn to introduce yourself, ask simple questions, and handle daily situations.",
      bn: "জার্মান ভাষার মূল বিষয়গুলো শিখুন। নিজের পরিচয় দিতে, সহজ প্রশ্ন করতে এবং দৈনন্দিন পরিস্থিতি সামলাতে শিখুন।",
    },
    order: 1,
    isActive: true,
    totalLessons: 8,
    estimatedWeeks: 8,
    goals: [
      "Introduce yourself",
      "Ask simple questions",
      "Understand basic sentences",
      "Handle daily situations",
    ],
  },
  {
    code: "A2",
    title: {
      de: "Grundlegend",
      en: "Elementary",
      bn: "প্রাথমিক",
    },
    description: {
      de: "Aufbau auf den Grundlagen",
      en: "Build on basics with everyday topics and more complex conversations.",
      bn: "দৈনন্দিন বিষয় এবং জটিল কথোপকথন দিয়ে ভিত্তি তৈরি করুন।",
    },
    order: 2,
    isActive: false,
    totalLessons: 10,
    estimatedWeeks: 10,
  },
  {
    code: "B1",
    title: {
      de: "Mittelstufe",
      en: "Intermediate",
      bn: "মধ্যবর্তী",
    },
    description: {
      de: "Unabhängige Sprachverwendung",
      en: "Express yourself on familiar topics with confidence.",
      bn: "পরিচিত বিষয়ে আত্মবিশ্বাসের সাথে নিজেকে প্রকাশ করুন।",
    },
    order: 3,
    isActive: false,
    totalLessons: 12,
    estimatedWeeks: 12,
  },
];

// ==================== A1 LESSONS (8 Modules) ====================
const a1Lessons = [
  // =============== MODULE 1: Basics & Pronunciation ===============
  {
    levelCode: "A1",
    order: 1,
    title: {
      de: "Grundlagen & Aussprache",
      en: "Basics & Pronunciation",
      bn: "মূল বিষয় ও উচ্চারণ",
    },
    description: {
      en: "Learn the German alphabet, special characters, greetings, and numbers 1-20.",
      bn: "জার্মান বর্ণমালা, বিশেষ অক্ষর, অভিবাদন এবং ১-২০ সংখ্যা শিখুন।",
    },
    objectives: [
      "Recognize German alphabet sounds",
      "Pronounce Umlauts (ä, ö, ü) and ß",
      "Use basic greetings",
      "Count from 1 to 20",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "A",
          text: "Hallo! Guten Tag!",
          translation: { en: "Hello! Good day!", bn: "হ্যালো! শুভ দিন!" },
        },
        {
          speaker: "B",
          text: "Guten Tag! Wie geht es Ihnen?",
          translation: { en: "Good day! How are you?", bn: "শুভ দিন! আপনি কেমন আছেন?" },
        },
        {
          speaker: "A",
          text: "Gut, danke! Und Ihnen?",
          translation: { en: "Good, thanks! And you?", bn: "ভালো, ধন্যবাদ! আর আপনি?" },
        },
      ],
      audioUrl: "/audio/a1/lesson1/warmup.mp3",
      imageUrl: "/images/a1/lesson1/greeting.svg",
    },
    grammar: {
      title: { en: "German Alphabet & Special Characters", bn: "জার্মান বর্ণমালা ও বিশেষ অক্ষর" },
      explanation: {
        en: "German has 26 letters like English, plus 4 special characters: ä, ö, ü (Umlauts) and ß (Eszett/sharp S).",
        bn: "জার্মানে ইংরেজির মতো ২৬টি অক্ষর আছে, এবং ৪টি বিশেষ অক্ষর: ä, ö, ü (উমলাউট) এবং ß (এসৎসেট)।",
      },
      rules: [
        { rule: "ä sounds like 'e' in 'bed'", example: "Mädchen (girl)" },
        { rule: "ö sounds like 'i' in 'bird'", example: "schön (beautiful)" },
        { rule: "ü sounds like 'ew' in 'few'", example: "grün (green)" },
        { rule: "ß sounds like 'ss'", example: "Straße (street)" },
      ],
    },
    conversation: {
      situation: { en: "Meeting someone for the first time", bn: "প্রথমবার কারো সাথে দেখা" },
      dialogue: [
        {
          speaker: "A",
          text: "Hallo! Ich bin Max.",
          translation: { en: "Hello! I am Max.", bn: "হ্যালো! আমি ম্যাক্স।" },
        },
        {
          speaker: "B",
          text: "Hallo Max! Ich bin Anna.",
          translation: { en: "Hello Max! I am Anna.", bn: "হ্যালো ম্যাক্স! আমি আনা।" },
        },
        {
          speaker: "A",
          text: "Freut mich!",
          translation: { en: "Nice to meet you!", bn: "আপনার সাথে পরিচিত হয়ে ভালো লাগলো!" },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 30,
  },

  // =============== MODULE 2: Personal Information ===============
  {
    levelCode: "A1",
    order: 2,
    title: {
      de: "Persönliche Informationen",
      en: "Personal Information",
      bn: "ব্যক্তিগত তথ্য",
    },
    description: {
      en: "Learn to introduce yourself, talk about countries, nationalities, and ask basic questions.",
      bn: "নিজের পরিচয় দিতে, দেশ, জাতীয়তা সম্পর্কে বলতে এবং সহজ প্রশ্ন করতে শিখুন।",
    },
    objectives: [
      "Introduce yourself with Ich bin/heiße",
      "Talk about countries and nationalities",
      "Use verbs: sein, kommen",
      "Ask questions with Wer? Wo? Wie?",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "A",
          text: "Wie heißen Sie?",
          translation: { en: "What is your name?", bn: "আপনার নাম কী?" },
        },
        {
          speaker: "B",
          text: "Ich heiße Maria. Und Sie?",
          translation: { en: "My name is Maria. And you?", bn: "আমার নাম মারিয়া। আর আপনি?" },
        },
        {
          speaker: "A",
          text: "Ich bin Thomas. Woher kommen Sie?",
          translation: { en: "I am Thomas. Where are you from?", bn: "আমি থমাস। আপনি কোথা থেকে এসেছেন?" },
        },
        {
          speaker: "B",
          text: "Ich komme aus Spanien.",
          translation: { en: "I come from Spain.", bn: "আমি স্পেন থেকে এসেছি।" },
        },
      ],
      imageUrl: "/images/a1/lesson2/introduction.svg",
    },
    grammar: {
      title: { en: "Verbs: sein (to be) & kommen (to come)", bn: "ক্রিয়া: sein (হওয়া) ও kommen (আসা)" },
      explanation: {
        en: "German verbs change based on the subject. Learn the most important verb 'sein' (to be).",
        bn: "জার্মান ক্রিয়া বিষয় অনুযায়ী পরিবর্তন হয়। সবচেয়ে গুরুত্বপূর্ণ ক্রিয়া 'sein' (হওয়া) শিখুন।",
      },
      rules: [
        { rule: "ich bin (I am)", example: "Ich bin Student." },
        { rule: "du bist (you are - informal)", example: "Du bist nett." },
        { rule: "er/sie ist (he/she is)", example: "Sie ist Lehrerin." },
        { rule: "wir sind (we are)", example: "Wir sind aus Bangladesh." },
      ],
    },
    conversation: {
      situation: { en: "At a language school registration", bn: "ভাষা স্কুলে নিবন্ধনের সময়" },
      dialogue: [
        {
          speaker: "Staff",
          text: "Guten Tag! Wie heißen Sie?",
          translation: { en: "Good day! What's your name?", bn: "শুভ দিন! আপনার নাম কী?" },
        },
        {
          speaker: "You",
          text: "Ich heiße [Name]. Ich komme aus Bangladesh.",
          translation: {
            en: "My name is [Name]. I come from Bangladesh.",
            bn: "আমার নাম [নাম]। আমি বাংলাদেশ থেকে এসেছি।",
          },
        },
        {
          speaker: "Staff",
          text: "Willkommen! Wie alt sind Sie?",
          translation: { en: "Welcome! How old are you?", bn: "স্বাগতম! আপনার বয়স কত?" },
        },
        {
          speaker: "You",
          text: "Ich bin 25 Jahre alt.",
          translation: { en: "I am 25 years old.", bn: "আমার বয়স ২৫ বছর।" },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 35,
  },

  // =============== MODULE 3: Daily Activities ===============
  {
    levelCode: "A1",
    order: 3,
    title: {
      de: "Tägliche Aktivitäten",
      en: "Daily Activities",
      bn: "দৈনন্দিন কাজকর্ম",
    },
    description: {
      en: "Learn action verbs, German sentence structure, time expressions, and daily routines.",
      bn: "ক্রিয়াপদ, জার্মান বাক্য গঠন, সময়ের প্রকাশ এবং দৈনন্দিন রুটিন শিখুন।",
    },
    objectives: [
      "Use verbs: gehen, arbeiten, lernen, essen",
      "Understand verb position in sentences",
      "Tell time and days of the week",
      "Describe daily routines",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "A",
          text: "Was machst du heute?",
          translation: { en: "What are you doing today?", bn: "আজ তুমি কী করছ?" },
        },
        {
          speaker: "B",
          text: "Ich gehe zur Arbeit.",
          translation: { en: "I am going to work.", bn: "আমি কাজে যাচ্ছি।" },
        },
        { speaker: "A", text: "Um wie viel Uhr?", translation: { en: "At what time?", bn: "কটার সময়?" } },
        { speaker: "B", text: "Um acht Uhr.", translation: { en: "At eight o'clock.", bn: "আটটায়।" } },
      ],
      imageUrl: "/images/a1/lesson3/daily.svg",
    },
    grammar: {
      title: {
        en: "German Sentence Structure (Verb Position 2)",
        bn: "জার্মান বাক্য গঠন (ক্রিয়া ২য় স্থানে)",
      },
      explanation: {
        en: "In German statements, the verb ALWAYS comes in the second position. This is the most important rule!",
        bn: "জার্মান বিবৃতিতে, ক্রিয়া সবসময় দ্বিতীয় স্থানে থাকে। এটি সবচেয়ে গুরুত্বপূর্ণ নিয়ম!",
      },
      rules: [
        { rule: "Subject + Verb + Object", example: "Ich lerne Deutsch." },
        { rule: "Time + Verb + Subject + Object", example: "Heute gehe ich zur Schule." },
        { rule: "Question word + Verb + Subject", example: "Wo arbeitest du?" },
        { rule: "Yes/No: Verb first", example: "Lernst du Deutsch?" },
      ],
    },
    conversation: {
      situation: { en: "Talking about your daily routine", bn: "দৈনন্দিন রুটিন সম্পর্কে কথা বলা" },
      dialogue: [
        {
          speaker: "A",
          text: "Wann stehst du auf?",
          translation: { en: "When do you wake up?", bn: "তুমি কখন ওঠ?" },
        },
        {
          speaker: "B",
          text: "Ich stehe um 7 Uhr auf.",
          translation: { en: "I wake up at 7 o'clock.", bn: "আমি ৭টায় উঠি।" },
        },
        {
          speaker: "A",
          text: "Und was machst du dann?",
          translation: { en: "And what do you do then?", bn: "তারপর তুমি কী কর?" },
        },
        {
          speaker: "B",
          text: "Ich frühstücke und gehe zur Arbeit.",
          translation: { en: "I have breakfast and go to work.", bn: "আমি সকালের নাস্তা করি এবং কাজে যাই।" },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 40,
  },

  // =============== MODULE 4: Food & Shopping ===============
  {
    levelCode: "A1",
    order: 4,
    title: {
      de: "Essen & Einkaufen",
      en: "Food & Shopping",
      bn: "খাবার ও কেনাকাটা",
    },
    description: {
      en: "Learn food vocabulary, numbers for prices, polite ordering, and German articles.",
      bn: "খাবারের শব্দভাণ্ডার, দামের সংখ্যা, ভদ্রভাবে অর্ডার করা এবং জার্মান আর্টিকেল শিখুন।",
    },
    objectives: [
      "Know common food vocabulary",
      "Understand prices and larger numbers",
      "Order food politely with möchten",
      "Use articles: der, die, das",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "Waiter",
          text: "Guten Tag! Was möchten Sie?",
          translation: { en: "Good day! What would you like?", bn: "শুভ দিন! আপনি কী চান?" },
        },
        {
          speaker: "Customer",
          text: "Ich möchte einen Kaffee, bitte.",
          translation: { en: "I would like a coffee, please.", bn: "আমি একটি কফি চাই, দয়া করে।" },
        },
        {
          speaker: "Waiter",
          text: "Möchten Sie auch etwas essen?",
          translation: { en: "Would you also like something to eat?", bn: "আপনি কি কিছু খেতেও চান?" },
        },
        {
          speaker: "Customer",
          text: "Ja, ein Brötchen, bitte.",
          translation: { en: "Yes, a bread roll, please.", bn: "হ্যাঁ, একটি রুটি, দয়া করে।" },
        },
      ],
      imageUrl: "/images/a1/lesson4/restaurant.svg",
    },
    grammar: {
      title: { en: "German Articles: der, die, das", bn: "জার্মান আর্টিকেল: der, die, das" },
      explanation: {
        en: "Every German noun has a gender: masculine (der), feminine (die), or neuter (das). You must memorize the article with each word!",
        bn: "প্রতিটি জার্মান বিশেষ্যের একটি লিঙ্গ আছে: পুং (der), স্ত্রী (die), বা ক্লীব (das)। প্রতিটি শব্দের সাথে আর্টিকেল মুখস্থ করতে হবে!",
      },
      rules: [
        { rule: "der (masculine)", example: "der Kaffee, der Tee, der Saft" },
        { rule: "die (feminine)", example: "die Milch, die Suppe, die Pizza" },
        { rule: "das (neuter)", example: "das Brot, das Wasser, das Bier" },
        { rule: "die (plural - all genders)", example: "die Äpfel, die Brötchen" },
      ],
    },
    conversation: {
      situation: { en: "At a bakery", bn: "একটি বেকারিতে" },
      dialogue: [
        {
          speaker: "You",
          text: "Guten Morgen! Was kostet das Brot?",
          translation: { en: "Good morning! How much is the bread?", bn: "সুপ্রভাত! রুটির দাম কত?" },
        },
        {
          speaker: "Baker",
          text: "Das Brot kostet 2 Euro 50.",
          translation: { en: "The bread costs 2 Euro 50.", bn: "রুটির দাম ২ ইউরো ৫০।" },
        },
        {
          speaker: "You",
          text: "Ich nehme zwei, bitte.",
          translation: { en: "I'll take two, please.", bn: "আমি দুটি নেব, দয়া করে।" },
        },
        {
          speaker: "Baker",
          text: "Das macht 5 Euro. Sonst noch etwas?",
          translation: { en: "That's 5 Euro. Anything else?", bn: "সেটা ৫ ইউরো। আর কিছু?" },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 40,
  },

  // =============== MODULE 5: Directions & Places ===============
  {
    levelCode: "A1",
    order: 5,
    title: {
      de: "Wegbeschreibung & Orte",
      en: "Directions & Places",
      bn: "দিকনির্দেশ ও স্থান",
    },
    description: {
      en: "Learn city vocabulary, asking for directions, prepositions, and transportation.",
      bn: "শহরের শব্দভাণ্ডার, দিকনির্দেশ জিজ্ঞাসা, অব্যয় এবং পরিবহন শিখুন।",
    },
    objectives: [
      "Know city and place vocabulary",
      "Ask and give directions",
      "Use prepositions: in, auf, mit, nach",
      "Talk about transportation",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "Tourist",
          text: "Entschuldigung, wo ist der Bahnhof?",
          translation: { en: "Excuse me, where is the train station?", bn: "মাফ করবেন, রেল স্টেশন কোথায়?" },
        },
        {
          speaker: "Local",
          text: "Gehen Sie geradeaus und dann links.",
          translation: { en: "Go straight and then left.", bn: "সোজা যান এবং তারপর বামে।" },
        },
        { speaker: "Tourist", text: "Ist es weit?", translation: { en: "Is it far?", bn: "এটা কি দূরে?" } },
        {
          speaker: "Local",
          text: "Nein, etwa 5 Minuten zu Fuß.",
          translation: { en: "No, about 5 minutes on foot.", bn: "না, পায়ে হেঁটে প্রায় ৫ মিনিট।" },
        },
      ],
      imageUrl: "/images/a1/lesson5/directions.svg",
    },
    grammar: {
      title: { en: "Prepositions of Place", bn: "স্থানের অব্যয়" },
      explanation: {
        en: "Prepositions tell us where something is or where we are going. Some common ones: in, auf, an, bei, mit, nach.",
        bn: "অব্যয় আমাদের বলে কিছু কোথায় আছে বা আমরা কোথায় যাচ্ছি। কিছু সাধারণ: in, auf, an, bei, mit, nach।",
      },
      rules: [
        { rule: "in + place", example: "Ich bin in der Stadt. (I am in the city.)" },
        { rule: "auf + surface", example: "Das Buch ist auf dem Tisch. (The book is on the table.)" },
        { rule: "mit + transport", example: "Ich fahre mit dem Bus. (I go by bus.)" },
        { rule: "nach + city/country", example: "Ich fahre nach Berlin. (I go to Berlin.)" },
      ],
    },
    conversation: {
      situation: { en: "Taking public transport", bn: "গণপরিবহন ব্যবহার করা" },
      dialogue: [
        {
          speaker: "You",
          text: "Fährt dieser Bus zum Zentrum?",
          translation: { en: "Does this bus go to the center?", bn: "এই বাস কি কেন্দ্রে যায়?" },
        },
        {
          speaker: "Driver",
          text: "Ja, steigen Sie ein.",
          translation: { en: "Yes, get in.", bn: "হ্যাঁ, উঠুন।" },
        },
        {
          speaker: "You",
          text: "Eine Fahrkarte, bitte. Was kostet das?",
          translation: { en: "One ticket, please. How much is it?", bn: "একটি টিকেট, দয়া করে। দাম কত?" },
        },
        { speaker: "Driver", text: "2 Euro 80.", translation: { en: "2 Euro 80.", bn: "২ ইউরো ৮০।" } },
      ],
    },
    status: "published",
    estimatedMinutes: 40,
  },

  // =============== MODULE 6: Family & Descriptions ===============
  {
    levelCode: "A1",
    order: 6,
    title: {
      de: "Familie & Beschreibungen",
      en: "Family & Descriptions",
      bn: "পরিবার ও বর্ণনা",
    },
    description: {
      en: "Learn family vocabulary, adjectives for describing people, and possessive pronouns.",
      bn: "পরিবারের শব্দভাণ্ডার, মানুষ বর্ণনার বিশেষণ এবং সম্বন্ধসূচক সর্বনাম শিখুন।",
    },
    objectives: [
      "Know family member vocabulary",
      "Use adjectives to describe people",
      "Use possessive pronouns: mein, dein, sein, ihr",
      "Form plural nouns",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "A",
          text: "Hast du Geschwister?",
          translation: { en: "Do you have siblings?", bn: "তোমার কি ভাইবোন আছে?" },
        },
        {
          speaker: "B",
          text: "Ja, ich habe einen Bruder und eine Schwester.",
          translation: {
            en: "Yes, I have a brother and a sister.",
            bn: "হ্যাঁ, আমার একটি ভাই এবং একটি বোন আছে।",
          },
        },
        {
          speaker: "A",
          text: "Wie alt ist dein Bruder?",
          translation: { en: "How old is your brother?", bn: "তোমার ভাইয়ের বয়স কত?" },
        },
        {
          speaker: "B",
          text: "Er ist 20 Jahre alt.",
          translation: { en: "He is 20 years old.", bn: "তার বয়স ২০ বছর।" },
        },
      ],
      imageUrl: "/images/a1/lesson6/family.svg",
    },
    grammar: {
      title: { en: "Possessive Pronouns", bn: "সম্বন্ধসূচক সর্বনাম" },
      explanation: {
        en: "Possessive pronouns show ownership. They change based on the gender of the noun they describe.",
        bn: "সম্বন্ধসূচক সর্বনাম মালিকানা দেখায়। তারা যে বিশেষ্য বর্ণনা করে তার লিঙ্গ অনুযায়ী পরিবর্তন হয়।",
      },
      rules: [
        { rule: "mein (my)", example: "mein Vater, meine Mutter, mein Kind" },
        { rule: "dein (your - informal)", example: "dein Bruder, deine Schwester" },
        { rule: "sein (his)", example: "sein Auto, seine Frau" },
        { rule: "ihr (her)", example: "ihr Mann, ihre Kinder" },
      ],
    },
    conversation: {
      situation: { en: "Showing family photos", bn: "পারিবারিক ছবি দেখানো" },
      dialogue: [
        {
          speaker: "A",
          text: "Wer ist das auf dem Foto?",
          translation: { en: "Who is that in the photo?", bn: "ছবিতে এটা কে?" },
        },
        {
          speaker: "B",
          text: "Das ist meine Familie.",
          translation: { en: "That is my family.", bn: "এটা আমার পরিবার।" },
        },
        {
          speaker: "A",
          text: "Ist das deine Mutter? Sie sieht jung aus!",
          translation: {
            en: "Is that your mother? She looks young!",
            bn: "এটা কি তোমার মা? দেখতে অনেক তরুণ!",
          },
        },
        {
          speaker: "B",
          text: "Ja, sie ist 45 Jahre alt.",
          translation: { en: "Yes, she is 45 years old.", bn: "হ্যাঁ, তার বয়স ৪৫ বছর।" },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 35,
  },

  // =============== MODULE 7: Health & Appointments ===============
  {
    levelCode: "A1",
    order: 7,
    title: {
      de: "Gesundheit & Termine",
      en: "Health & Appointments",
      bn: "স্বাস্থ্য ও অ্যাপয়েন্টমেন্ট",
    },
    description: {
      en: "Learn body parts, express symptoms, make appointments, and use modal verbs.",
      bn: "শরীরের অঙ্গ, উপসর্গ প্রকাশ, অ্যাপয়েন্টমেন্ট নেওয়া এবং মোডাল ক্রিয়া ব্যবহার শিখুন।",
    },
    objectives: [
      "Know body part vocabulary",
      "Express symptoms and feelings",
      "Make appointments by phone",
      "Use modal verbs: müssen, können, dürfen",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "Patient",
          text: "Ich brauche einen Termin.",
          translation: { en: "I need an appointment.", bn: "আমার একটি অ্যাপয়েন্টমেন্ট দরকার।" },
        },
        {
          speaker: "Receptionist",
          text: "Was haben Sie für Beschwerden?",
          translation: { en: "What symptoms do you have?", bn: "আপনার কী সমস্যা?" },
        },
        {
          speaker: "Patient",
          text: "Ich habe Kopfschmerzen und Fieber.",
          translation: { en: "I have a headache and fever.", bn: "আমার মাথাব্যথা এবং জ্বর আছে।" },
        },
        {
          speaker: "Receptionist",
          text: "Können Sie morgen um 10 Uhr kommen?",
          translation: { en: "Can you come tomorrow at 10?", bn: "আপনি কি কাল সকাল ১০টায় আসতে পারবেন?" },
        },
      ],
      imageUrl: "/images/a1/lesson7/health.svg",
    },
    grammar: {
      title: { en: "Modal Verbs: müssen, können, dürfen", bn: "মোডাল ক্রিয়া: müssen, können, dürfen" },
      explanation: {
        en: "Modal verbs express ability, permission, or necessity. The main verb goes to the end in infinitive form.",
        bn: "মোডাল ক্রিয়া সক্ষমতা, অনুমতি বা প্রয়োজনীয়তা প্রকাশ করে। মূল ক্রিয়া শেষে infinitive রূপে যায়।",
      },
      rules: [
        { rule: "können (can/able to)", example: "Ich kann Deutsch sprechen. (I can speak German.)" },
        { rule: "müssen (must/have to)", example: "Ich muss zum Arzt gehen. (I must go to the doctor.)" },
        { rule: "dürfen (may/allowed to)", example: "Darf ich hier rauchen? (May I smoke here?)" },
        { rule: "Modal + infinitive at end", example: "Ich muss heute arbeiten." },
      ],
    },
    conversation: {
      situation: { en: "At the doctor's office", bn: "ডাক্তারের অফিসে" },
      dialogue: [
        {
          speaker: "Doctor",
          text: "Guten Tag! Was kann ich für Sie tun?",
          translation: {
            en: "Good day! What can I do for you?",
            bn: "শুভ দিন! আমি আপনার জন্য কী করতে পারি?",
          },
        },
        {
          speaker: "Patient",
          text: "Mir geht es nicht gut. Ich habe Halsschmerzen.",
          translation: {
            en: "I don't feel well. I have a sore throat.",
            bn: "আমার ভালো লাগছে না। আমার গলা ব্যথা।",
          },
        },
        { speaker: "Doctor", text: "Seit wann?", translation: { en: "Since when?", bn: "কবে থেকে?" } },
        {
          speaker: "Patient",
          text: "Seit drei Tagen.",
          translation: { en: "For three days.", bn: "তিন দিন ধরে।" },
        },
        {
          speaker: "Doctor",
          text: "Sie müssen viel Wasser trinken und sich ausruhen.",
          translation: {
            en: "You must drink lots of water and rest.",
            bn: "আপনাকে প্রচুর পানি পান করতে হবে এবং বিশ্রাম নিতে হবে।",
          },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 45,
  },

  // =============== MODULE 8: Review & Mini Test ===============
  {
    levelCode: "A1",
    order: 8,
    title: {
      de: "Wiederholung & Test",
      en: "Review & Final Test",
      bn: "পুনরালোচনা ও চূড়ান্ত পরীক্ষা",
    },
    description: {
      en: "Review all A1 topics and take a comprehensive test to complete the level.",
      bn: "সমস্ত A1 বিষয় পুনরালোচনা করুন এবং স্তর সম্পূর্ণ করতে একটি সম্পূর্ণ পরীক্ষা দিন।",
    },
    objectives: [
      "Review all vocabulary from A1",
      "Practice all grammar rules",
      "Complete listening exercises",
      "Pass the final A1 test",
    ],
    warmup: {
      dialogue: [
        {
          speaker: "Teacher",
          text: "Herzlichen Glückwunsch! Sie haben A1 fast geschafft!",
          translation: {
            en: "Congratulations! You've almost completed A1!",
            bn: "অভিনন্দন! আপনি প্রায় A1 শেষ করেছেন!",
          },
        },
        {
          speaker: "Student",
          text: "Danke! Ich habe viel gelernt.",
          translation: { en: "Thanks! I've learned a lot.", bn: "ধন্যবাদ! আমি অনেক কিছু শিখেছি।" },
        },
        {
          speaker: "Teacher",
          text: "Jetzt kommt der Test. Viel Erfolg!",
          translation: { en: "Now comes the test. Good luck!", bn: "এখন পরীক্ষা। শুভকামনা!" },
        },
      ],
      imageUrl: "/images/a1/lesson8/graduation.svg",
    },
    grammar: {
      title: { en: "A1 Grammar Summary", bn: "A1 ব্যাকরণ সারাংশ" },
      explanation: {
        en: "Let's review all the grammar you learned in A1.",
        bn: "চলুন A1-এ শেখা সমস্ত ব্যাকরণ পুনরালোচনা করি।",
      },
      rules: [
        { rule: "Verb position 2", example: "Ich lerne Deutsch. Heute gehe ich zur Schule." },
        { rule: "Articles: der, die, das", example: "der Mann, die Frau, das Kind" },
        { rule: "Possessives: mein, dein", example: "mein Buch, deine Tasche" },
        { rule: "Modal verbs", example: "Ich kann, ich muss, ich darf" },
      ],
    },
    conversation: {
      situation: { en: "Complete conversation practice", bn: "সম্পূর্ণ কথোপকথন অনুশীলন" },
      dialogue: [
        {
          speaker: "A",
          text: "Guten Tag! Ich heiße Anna. Wie heißen Sie?",
          translation: {
            en: "Good day! My name is Anna. What's your name?",
            bn: "শুভ দিন! আমার নাম আনা। আপনার নাম কী?",
          },
        },
        {
          speaker: "B",
          text: "Ich heiße [Name]. Freut mich!",
          translation: {
            en: "My name is [Name]. Nice to meet you!",
            bn: "আমার নাম [নাম]। আপনার সাথে দেখা হয়ে ভালো লাগলো!",
          },
        },
        {
          speaker: "A",
          text: "Woher kommen Sie und was machen Sie beruflich?",
          translation: {
            en: "Where are you from and what do you do?",
            bn: "আপনি কোথা থেকে এসেছেন এবং আপনি কী করেন?",
          },
        },
        {
          speaker: "B",
          text: "Ich komme aus Bangladesh und ich bin Student/Studentin.",
          translation: {
            en: "I come from Bangladesh and I am a student.",
            bn: "আমি বাংলাদেশ থেকে এসেছি এবং আমি একজন ছাত্র/ছাত্রী।",
          },
        },
      ],
    },
    status: "published",
    estimatedMinutes: 60,
    isFinalTest: true,
  },
];

module.exports = {
  levels,
  a1Lessons,
};
