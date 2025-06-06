import React from 'react';

function VerseDisplay({ verseData }) {
  if (!verseData) {
    return <p>Select a category to see a verse.</p>;
  }

  return (
    <div>
      <h3>{verseData.reference}</h3>
      <p>{verseData.text}</p>
      <small>Translation: {verseData.translation_name} ({verseData.translation_id})</small>
    </div>
  );
}

export default VerseDisplay;
