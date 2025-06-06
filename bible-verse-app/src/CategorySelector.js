import React from 'react';

const categories = [
  { id: 'anxious', name: 'Feeling Anxious' },
  { id: 'lost', name: 'Feeling Lost' },
  { id: 'comfort', name: 'Needing Comfort' },
  { id: 'joyful', name: 'Feeling Joyful' },
  { id: 'strength', name: 'Seeking Strength' },
];

function CategorySelector({ onSelectCategory }) {
  return (
    <div>
      <h2>How are you feeling today?</h2>
      {categories.map(category => (
        <button key={category.id} onClick={() => onSelectCategory(category.id)}>
          {category.name}
        </button>
      ))}
    </div>
  );
}

export default CategorySelector;
