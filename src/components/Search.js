// src/components/Search.js
import React, { useState } from 'react';
import axios from 'axios';

const Search = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const response = await axios.get(`http://localhost:8000/api/search/?q=${query}`);
    setResults(response.data);
  };

  return (
    <div className="container mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Búsqueda</h2>
      <form onSubmit={handleSearch} className="mb-4">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar empresas, productos o categorías"
          className="w-full p-2 border rounded"
        />
        <button type="submit" className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">Buscar</button>
      </form>
      <div>
        {results.map((item) => (
          <div key={item.id} className="mb-2 p-2 bg-white rounded shadow">
            <h3 className="font-semibold">{item.name}</h3>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;