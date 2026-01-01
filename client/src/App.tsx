import { Loader2, Search } from 'lucide-react'
import './App.css';
import type React from 'react';
import { useState } from 'react';

function App() {

  const API_URL = import.meta.env.VITE_API_URL || '';
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [movies, setMovies] = useState<any[]>([]);

  const fetchMovies = async (e: React.FormEvent) => {
    e.preventDefault();
   
    if (!search) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/movies/search?s=${search}`);

      if (!response.ok) {
        setError(response.statusText || 'Error fetching movies');
        setMovies([]);
      } 

      const data = await response.json();
      setMovies(data.Search || []);
    } catch (error) {
        setError(error instanceof Error ? error.message : 'Unknown error');
        setMovies([]);
    } finally {
        setLoading(false);
    }
  };

  return (
    <>

    <div className="app-container">
      <h1>Welcome to Movie Home!</h1>
      <div className="input-container">
      {error && <p className='error-message'>{error}</p>}
      <input id='search' value={search} onChange={(e) => setSearch(e.target.value)} type="text" placeholder='Search for your movie choice'/>
      <button onClick={fetchMovies}>
        {loading ? <Loader2 className='loader'/> : <Search className='search'/>}</button>
      </div>
      </div>

      <div className="movies-container">

        <h1>Movie Results</h1>
        {movies.length > 0 && (
          <div className="movies-grid">
            {movies.map((movie) => (
              <div key={movie.imdbID} className="movie-card">
                <img src={movie.Poster !== 'N/A' ? movie.Poster : '/placeholder.png'} alt={movie.Title} />
                <h3>{movie.Title}</h3>
                <p>{movie.Year}</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
    </>
  )
}

export default App
