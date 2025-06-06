import React, { useState } from 'react';
import './App.css';
import CategorySelector from './CategorySelector';
import VerseDisplay from './VerseDisplay';

function App() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [verseData, setVerseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVerse = async () => {
    setIsLoading(true);
    setError(null);
    setVerseData(null); // Clear previous verse

    try {
      const response = await fetch('https://bible-api.com/data/kjv/random');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // The API returns an object with reference, text, translation_id, translation_name
      // Sometimes it can return an array of verses if the random pick is a passage.
      // For simplicity, we'll take the first verse if it's an array.
      const verse = Array.isArray(data) ? data[0] : data;

      // Make sure we have the expected fields. The direct random endpoint gives slightly different structure.
      // It gives: bookname, chapter, verse, text. And we want reference, text, translation_id, translation_name
      // The actual API (e.g. /john 3:16) gives: reference, verses: [{book_id, book_name, chapter, verse, text}], translation_id, translation_name
      // The /data/kjv/random endpoint seems to give:
      // { "bookid": "LUK", "bookname": "Luke", "chapter": "6", "verse": "31", "text": "And as ye would that men should do to you, do ye also to them likewise." }
      // So we need to adapt this to what VerseDisplay expects.

      if (verse && verse.bookname && verse.chapter && verse.verse && verse.text) {
        setVerseData({
          reference: `${verse.bookname} ${verse.chapter}:${verse.verse}`,
          text: verse.text,
          translation_id: 'kjv', // We are hardcoding KJV for now from the URL
          translation_name: 'King James Version' // Assuming KJV
        });
      } else if (verse && verse.reference && verse.text && verse.translation_id && verse.translation_name) {
        // This is for the case where the API might return the structure we initially expected
         setVerseData({
          reference: verse.reference,
          text: verse.text,
          translation_id: verse.translation_id,
          translation_name: verse.translation_name
        });
      }
      else {
        console.error("Unexpected API response structure:", data);
        throw new Error("Could not parse verse data from API.");
      }

    } catch (e) {
      console.error("Failed to fetch verse:", e);
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectCategory = (category) => {
    setSelectedCategory(category);
    fetchVerse(); // Fetch a new verse when a category is selected
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Daily Bible Verse</h1>
      </header>
      <main>
        <CategorySelector onSelectCategory={handleSelectCategory} />
        {isLoading && <p>Loading verse...</p>}
        {error && <p>Error fetching verse: {error}. Please try again.</p>}
        <VerseDisplay verseData={verseData} />
        {!isLoading && verseData && (
          <button onClick={fetchVerse} style={{marginTop: '20px'}}>
            Get Another Verse
          </button>
        )}
      </main>
    </div>
  );
}

export default App;
