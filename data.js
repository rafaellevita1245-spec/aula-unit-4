// Conteúdo da aula: Unit 4 · Planning a Trip (10º ano)
// Todas as respostas vêm dos próprios slides. Para editar, mude apenas este arquivo.
// Em "blank", use "—" para "sem artigo". Respostas aceitas: lista de strings.

window.AULA = {
  slides: [
    { n: 1, title: "Ready to Travel? Where would you go?" },
    { n: 2, title: "Your Travel Story" },
    { n: 3, title: "Pick a Destination" },
    { n: 4, title: "At the Airport" },
    { n: 5, title: "Choose Your Seat" },
    { n: 6, title: "On Your Journey" },
    { n: 7, title: "Match and Explain" },
    { n: 8, title: "Travel Problems" },
    { n: 9, title: "Before You Listen" },
    { n: 10, title: "Listen for the Main Idea" },
    { n: 11, title: "Listen for Details" },
    { n: 12, title: "Your Travel Checklist" },
    { n: 13, title: "At the Hotel" },
    { n: 14, title: "Who Is Speaking?" },
    { n: 15, title: "Ask to Book" },
    { n: 16, title: "Hotel Role-play" },
    { n: 17, title: "Words Have Jobs" },
    { n: 18, title: "Noun Traps" },
    { n: 19, title: "Word-Class Challenge" },
    { n: 20, title: "Travel Mission" },
    { n: 21, title: "A Trip or a New Life? (Part B)" },
    { n: 22, title: "Why Do People Move?" },
    { n: 23, title: "Words for the Reading" },
    { n: 24, title: "Match the Meaning" },
    { n: 25, title: "Before We Read" },
    { n: 26, title: "Read for the Main Idea" },
    { n: 27, title: "Find the Key Information" },
    { n: 28, title: "True, False, or Needs Correction?" },
    { n: 29, title: "Ask the Reader" },
    { n: 30, title: "Summarize in Your Own Words" },
    { n: 31, title: "A Trip Becomes The Trip" },
    { n: 32, title: "A or An? Listen to the Sound" },
    { n: 33, title: "Which One? Use The" },
    { n: 34, title: "When We Use No Article" },
    { n: 35, title: "Article Check-in" },
    { n: 36, title: "A Postcard from London" },
    { n: 37, title: "Write Your Travel Postcard" },
    { n: 38, title: "People Behind the Journeys" },
    { n: 39, title: "Discuss with Respect" },
    { n: 40, title: "Final Boarding Challenge" }
  ],

  // Quiz de múltipla escolha. "answer" é o índice da opção correta.
  quiz: [
    { slide: 4, q: "What is a \"timetable\"?", options: ["A small bag you take into the cabin", "A schedule of arrivals and departures", "A document that lets you board a plane", "A company that operates flights"], answer: 1 },
    { slide: 4, q: "What is a \"boarding pass\"?", options: ["A schedule of arrivals and departures", "A small bag you take into the cabin", "A document that lets you board a plane", "A company that operates flights"], answer: 2 },
    { slide: 6, q: "What is a \"stopover\"?", options: ["The area where you collect checked luggage", "A short stay between two parts of a journey", "A seat in business class", "A type of hotel room"], answer: 1 },
    { slide: 13, q: "A \"single room\" is a room for:", options: ["Two guests", "One guest", "The hotel staff", "A family of four"], answer: 1 },
    { slide: 17, q: "In \"The traveler packed a comfortable suitcase carefully.\" Which word is an adverb?", options: ["traveler", "packed", "comfortable", "carefully"], answer: 3 },
    { slide: 18, q: "The news ___ good.", options: ["is", "are"], answer: 0 },
    { slide: 18, q: "My clothes ___ clean.", options: ["is", "are"], answer: 1 },
    { slide: 19, q: "She has a lot of ___ for his opinion.", options: ["respect", "respectful", "respectfully"], answer: 0 },
    { slide: 23, q: "Which word means \"escape from danger\"?", options: ["sponsor", "flee", "enact", "seeker"], answer: 1 },
    { slide: 23, q: "Which word means \"remain longer than permitted\"?", options: ["overstay", "lawful", "enact", "seeker"], answer: 0 },
    { slide: 24, q: "What does \"lawful\" mean?", options: ["Authorized by law", "Make a law official", "Provide support or funding", "A person looking for something"], answer: 0 },
    { slide: 22, q: "Ana is joining her parents abroad. Which reason for moving is this?", options: ["Work and study", "Family", "Safety", "New opportunities"], answer: 1 },
    { slide: 32, q: "Choose the correct article: ___ umbrella", options: ["a", "an"], answer: 1 },
    { slide: 33, q: "I booked a room. ___ room has a sea view.", options: ["A", "The"], answer: 1 },
    { slide: 34, q: "I love ___ music.", options: ["the", "(no article)"], answer: 1 },
    { slide: 38, q: "A \"refugee\" is:", options: ["A tourist visiting a place for a limited time", "A person forced to flee and needing protection", "A person who moves to another country to live", "A person whose asylum claim is awaiting a decision"], answer: 1 },
    { slide: 40, q: "I'm visiting ___ Brazil.", options: ["a", "the", "(no article)"], answer: 2 }
  ],

  // Completar: cada item tem blanks. Cada blank: { answers: [...], options?: [...] }
  // Se houver "options", aparece uma lista; senão, um campo de texto.
  fill: [
    {
      slide: 8, title: "Travel Problems",
      items: [
        { before: "Please show me your", blank: { answers: ["boarding pass"] }, after: "before you board." },
        { before: "Your", blank: { answers: ["carry-on luggage", "carry on luggage"] }, after: "is too heavy. You'll have to check it." },
        { before: "We have a two-hour", blank: { answers: ["stopover"] }, after: "before our next flight." },
        { before: "Check the", blank: { answers: ["timetable"] }, after: "to find your departure time." }
      ]
    },
    {
      slide: 19, title: "Word-Class Challenge",
      items: [
        { before: "He", blank: { answers: ["sounds"] }, after: "like a very nice person." },
        { before: "The child was", blank: { answers: ["sound"] }, after: "asleep." },
        { before: "She is the", blank: { answers: ["love"] }, after: "of my life." },
        { before: "What a", blank: { answers: ["lovely"] }, after: "smile!" },
        { before: "She has a lot of", blank: { answers: ["respect"] }, after: "for his opinion." },
        { before: "He", blank: { answers: ["respectfully"] }, after: "removed his hat." }
      ]
    },
    {
      slide: 35, title: "Article Check-in",
      items: [
        { before: "I bought", blank: { answers: ["a"], options: ["a", "an", "the", "—"] }, after: "pair of shoes." },
        { before: "We waited for", blank: { answers: ["an"], options: ["a", "an", "the", "—"] }, after: "hour." },
        { before: "She is studying at", blank: { answers: ["a"], options: ["a", "an", "the", "—"] }, after: "university." },
        { before: "I booked a hotel.", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "hotel has a pool." },
        { before: "I love", blank: { answers: ["—"], options: ["a", "an", "the", "—"] }, after: "music." },
        { before: "We are flying to", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "United States." }
      ]
    },
    {
      slide: 36, title: "A Postcard from London",
      items: [
        { before: "We're on holiday in", blank: { answers: ["—"], options: ["a", "an", "the", "—"] }, after: "London." },
        { before: "", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "weather is great." },
        { before: "We visited", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "British Museum yesterday." },
        { before: "We took", blank: { answers: ["a"], options: ["a", "an", "the", "—"] }, after: "boat trip on" },
        { before: "", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "Thames." },
        { before: "I bought", blank: { answers: ["an"], options: ["a", "an", "the", "—"] }, after: "umbrella because it rained." },
        { before: "", blank: { answers: ["the"], options: ["a", "an", "the", "—"] }, after: "umbrella is blue." }
      ]
    },
    {
      slide: 14, title: "Who Is Speaking?",
      items: [
        { before: "Question 1 \"Can I get you anything?\" is said by:", blank: { answers: ["hotel staff"], options: ["hotel staff", "traveler"] }, after: "" },
        { before: "Question 2 \"Where can I exchange foreign currency?\" is said by:", blank: { answers: ["traveler"], options: ["hotel staff", "traveler"] }, after: "" },
        { before: "Question 3 \"Can I call you a taxi?\" is said by:", blank: { answers: ["hotel staff"], options: ["hotel staff", "traveler"] }, after: "" },
        { before: "Question 4 \"Where can I buy a subway ticket?\" is said by:", blank: { answers: ["traveler"], options: ["hotel staff", "traveler"] }, after: "" }
      ]
    }
  ],

  // Missões em equipe (slides 20 e 40): 30 segundos por tarefa, 1 ponto por resposta correta.
  missions: [
    {
      name: "Travel Mission (slide 20)",
      tasks: [
        "Name three airport words.",
        "Explain a stopover.",
        "Give two travel tips.",
        "Ask two hotel booking questions.",
        "Classify: traveler, book (verb), comfortable, carefully.",
        "Complete: My luggage ___ heavy. My belongings ___ safe."
      ]
    },
    {
      name: "Final Boarding Challenge (slide 40)",
      tasks: [
        "Explain lawful and overstay.",
        "Give one main idea from the reading.",
        "Complete: ___ hour / ___ university.",
        "Complete: I booked a room. ___ room is quiet.",
        "Complete: I like ___ music. I'm visiting ___ Brazil.",
        "Give one opportunity and one challenge of moving abroad."
      ]
    }
  ],

  // Speaking (slides 1, 2, 3, 9, 14, 16, 21, 22, 39)
  speaking: [
    { slide: 1, prompt: "I'd like to visit ___ because ___.", hint: "culture • food • nature • adventure" },
    { slide: 2, prompt: "Have you ever traveled by plane? Have you ever been abroad?", hint: "Yes, I have. / No, I haven't. Where did you go? How did you feel when the plane took off?" },
    { slide: 3, prompt: "Which destination is your top choice? Why?", hint: "Tokyo • Paris • Rio de Janeiro" },
    { slide: 9, prompt: "Agree or disagree: \"I like to plan my trips months ahead.\" Explain.", hint: "I agree because I like to be prepared. / I disagree because I enjoy spontaneous trips." },
    { slide: 21, prompt: "Would you like to live in another country? Why?", hint: "A tourist usually … / Someone moving abroad may …" },
    { slide: 22, prompt: "What would you consider before moving?", hint: "People may move because … One challenge could be …" },
    { slide: 39, prompt: "What opportunities can immigration bring? What challenges might newcomers face?", hint: "work • education • language • culture • housing • belonging" }
  ]
};
