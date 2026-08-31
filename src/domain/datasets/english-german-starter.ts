export type StarterVocabularyEntry = {
  english: string;
  german: string;
};

export const englishGermanStarterEntries: readonly StarterVocabularyEntry[] = [
  { english: "hello", german: "Hallo" },
  { english: "goodbye", german: "Auf Wiedersehen" },
  { english: "yes", german: "ja" },
  { english: "no", german: "nein" },
  { english: "please", german: "bitte" },
  { english: "thank you", german: "danke" },
  { english: "sorry", german: "es tut mir leid" },
  { english: "name", german: "Name" },
  { english: "friend", german: "Freund" },
  { english: "family", german: "Familie" },
  { english: "mother", german: "Mutter" },
  { english: "father", german: "Vater" },
  { english: "child", german: "Kind" },
  { english: "person", german: "Mensch" },
  { english: "man", german: "Mann" },
  { english: "woman", german: "Frau" },
  { english: "house", german: "Haus" },
  { english: "room", german: "Zimmer" },
  { english: "door", german: "Tür" },
  { english: "window", german: "Fenster" },
  { english: "table", german: "Tisch" },
  { english: "chair", german: "Stuhl" },
  { english: "bed", german: "Bett" },
  { english: "book", german: "Buch" },
  { english: "pen", german: "Stift" },
  { english: "school", german: "Schule" },
  { english: "work", german: "Arbeit" },
  { english: "city", german: "Stadt" },
  { english: "street", german: "Straße" },
  { english: "car", german: "Auto" },
  { english: "train", german: "Zug" },
  { english: "bicycle", german: "Fahrrad" },
  { english: "food", german: "Essen" },
  { english: "water", german: "Wasser" },
  { english: "bread", german: "Brot" },
  { english: "milk", german: "Milch" },
  { english: "coffee", german: "Kaffee" },
  { english: "apple", german: "Apfel" },
  { english: "day", german: "Tag" },
  { english: "night", german: "Nacht" },
  { english: "morning", german: "Morgen" },
  { english: "evening", german: "Abend" },
  { english: "today", german: "heute" },
  { english: "tomorrow", german: "morgen" },
  { english: "time", german: "Zeit" },
  { english: "weather", german: "Wetter" },
  { english: "sun", german: "Sonne" },
  { english: "rain", german: "Regen" },
  { english: "snow", german: "Schnee" },
  { english: "good", german: "gut" },
  { english: "bad", german: "schlecht" },
  { english: "big", german: "groß" },
  { english: "small", german: "klein" },
  { english: "new", german: "neu" },
  { english: "old", german: "alt" },
  { english: "beautiful", german: "schön" },
  { english: "easy", german: "einfach" },
  { english: "difficult", german: "schwierig" },
  { english: "hot", german: "heiß" },
  { english: "cold", german: "kalt" },
  { english: "red", german: "rot" },
  { english: "blue", german: "blau" },
  { english: "green", german: "grün" },
  { english: "black", german: "schwarz" },
  { english: "white", german: "weiß" },
  { english: "one", german: "eins" },
  { english: "two", german: "zwei" },
  { english: "three", german: "drei" },
  { english: "four", german: "vier" },
  { english: "five", german: "fünf" },
  { english: "I", german: "ich" },
  { english: "you", german: "du" },
  { english: "we", german: "wir" },
  { english: "they", german: "sie" },
  { english: "this", german: "dies" },
  { english: "that", german: "das" },
  { english: "who", german: "wer" },
  { english: "what", german: "was" },
  { english: "where", german: "wo" },
  { english: "when", german: "wann" },
  { english: "why", german: "warum" },
  { english: "how", german: "wie" },
  { english: "to be", german: "sein" },
  { english: "to have", german: "haben" },
  { english: "to go", german: "gehen" },
  { english: "to come", german: "kommen" },
  { english: "to eat", german: "essen" },
  { english: "to drink", german: "trinken" },
  { english: "to learn", german: "lernen" },
  { english: "to speak", german: "sprechen" },
  { english: "to read", german: "lesen" },
  { english: "to write", german: "schreiben" },
  { english: "to see", german: "sehen" },
  { english: "to know", german: "wissen" },
  { english: "to want", german: "wollen" },
  { english: "to like", german: "mögen" },
  { english: "to help", german: "helfen" },
  { english: "to live", german: "leben" },
  { english: "to buy", german: "kaufen" },
  { english: "to pay", german: "bezahlen" },
] as const;

export type StarterCardInput = {
  sourceText: string;
  translation: string;
};

export function getEnglishGermanStarterCards(
  sourceLanguageCode: string,
  targetLanguageCode: string,
): StarterCardInput[] | null {
  const sourceLanguage = sourceLanguageCode.split("-", 1)[0];
  const targetLanguage = targetLanguageCode.split("-", 1)[0];

  if (sourceLanguage === "en" && targetLanguage === "de") {
    return englishGermanStarterEntries.map(({ english, german }) => ({
      sourceText: english,
      translation: german,
    }));
  }

  if (sourceLanguage === "de" && targetLanguage === "en") {
    return englishGermanStarterEntries.map(({ english, german }) => ({
      sourceText: german,
      translation: english,
    }));
  }

  return null;
}
