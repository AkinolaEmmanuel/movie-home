import { Loader2, Search, X, Star, Calendar, Clock, Award, Globe, Users, Film, Moon, Sun } from 'lucide-react';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import './App.css';

// Types
interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

// interface MovieDetails {
//   Title: string;
//   Year: string;
//   Rated: string;
//   Released: string;
//   Runtime: string;
//   Genre: string;
//   Director: string;
//   Writer: string;
//   Actors: string;
//   Plot: string;
//   Language: string;
//   Country: string;
//   Awards: string;
//   Poster: string;
//   Ratings: Array<{ Source: string; Value: string }>;
//   Metascore: string;
//   imdbRating: string;
//   imdbVotes: string;
//   imdbID: string;
//   Type: string;
//   BoxOffice: string;
//   Production: string;
//   Response: string;
// }

const API_URL = import.meta.env.VITE_API_URL;

function App() {
  const [search, setSearch] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMovieId, setSelectedMovieId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
  
  const ITEMS_PER_PAGE = 6;

  // Fetch movies
  const { data: moviesData, isLoading: moviesLoading, error: moviesError } = useQuery({
    queryKey: ['movies', searchQuery],
    queryFn: async () => {
      if (!searchQuery) return { Search: [], totalResults: '0' };
      const response = await fetch(`${API_URL}/movies/search?s=${searchQuery}`);
      if (!response.ok) throw new Error('Failed to fetch movies');
      return response.json();
    },
    enabled: !!searchQuery,
  });

  // Fetch movie details
  const { data: movieDetails, isLoading: detailsLoading } = useQuery({
    queryKey: ['movie', selectedMovieId],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/movies/${selectedMovieId}`);
      if (!response.ok) throw new Error('Failed to fetch movie details');
      return response.json();
    },
    enabled: !!selectedMovieId,
  });

  const movies = moviesData?.Search || [];
  const totalPages = Math.ceil(movies.length / ITEMS_PER_PAGE);
  const paginatedMovies = movies.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      setSearchQuery(search.trim());
      setCurrentPage(1);
    }
  };

  const openModal = (id: string) => {
    setSelectedMovieId(id);
  };

  const closeModal = () => {
    setSelectedMovieId(null);
  };

  return (
    <div className={`app-wrapper ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <div className="theme-toggle-container">
        <button onClick={() => setDarkMode(!darkMode)} className="theme-toggle-btn">
          {darkMode ? <Sun className="icon" /> : <Moon className="icon" />}
        </button>
      </div>

      {/* Search Section */}
      <div className="hero-section">
        <h1 className="hero-title">Movie Summary Encyclopedia</h1>
        <p className="hero-subtitle">Discover detailed information about your favorite films</p>
        
        <div className="search-wrapper">
          {moviesError && (
            <p className="search-error">
              {moviesError instanceof Error ? moviesError.message : 'Error fetching movies'}
            </p>
          )}
          <div className="search-container">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
              type="text"
              placeholder="Search for your movie choice"
              className="search-input"
              disabled={moviesLoading}
            />
            <button
              onClick={handleSearch}
              disabled={moviesLoading || !search.trim()}
              className="search-button"
            >
              {moviesLoading ? (
                <Loader2 className="icon spinning" />
              ) : (
                <Search className="icon" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Results Section */}
      <div className="results-section">
        <h2 className="results-title">Movie Results</h2>

        {/* Loading Skeleton */}
        {moviesLoading && (
          <div className="movies-grid">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="movie-card skeleton">
                <div className="skeleton-poster"></div>
                <div className="movie-info">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-year"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Movies Grid */}
        {!moviesLoading && paginatedMovies.length > 0 && (
          <>
            <div className="movies-grid">
              {paginatedMovies.map((movie: Movie) => (
                <div
                  key={movie.imdbID}
                  onClick={() => openModal(movie.imdbID)}
                  className="movie-card clickable"
                >
                  <img
                    src={movie.Poster !== 'N/A' ? movie.Poster : '/api/placeholder/300/400'}
                    alt={movie.Title}
                    className="movie-poster"
                  />
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.Title}</h3>
                    <p className="movie-year">{movie.Year}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="pagination-btn"
                >
                  Previous
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}

        {/* No Results */}
        {!moviesLoading && searchQuery && movies.length === 0 && (
          <p className="no-results">
            No movies found. Try a different search term.
          </p>
        )}
      </div>

      {/* Modal */}
      {selectedMovieId && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            {detailsLoading ? (
              <div className="modal-loading">
                <Loader2 className="icon-large spinning" />
              </div>
            ) : movieDetails ? (
              <>
                <div className="modal-header">
                  <button onClick={closeModal} className="modal-close">
                    <X className="icon" />
                  </button>
                  <img
                    src={movieDetails.Poster !== 'N/A' ? movieDetails.Poster : '/api/placeholder/400/600'}
                    alt={movieDetails.Title}
                    className="modal-poster"
                  />
                </div>

                <div className="modal-body">
                  <h2 className="modal-title">{movieDetails.Title}</h2>
                  <div className="modal-badges">
                    <span className="badge badge-primary">{movieDetails.Rated}</span>
                    <span className="badge badge-secondary">{movieDetails.Type}</span>
                  </div>

                  <p className="modal-plot">{movieDetails.Plot}</p>

                  {/* Ratings */}
                  {movieDetails.Ratings && movieDetails.Ratings.length > 0 && (
                    <div className="ratings-section">
                      <h3 className="section-title">
                        <Star className="icon-small" />
                        Ratings
                      </h3>
                      <div className="ratings-grid">
                        {movieDetails.Ratings.map((rating: any, idx: any) => (
                          <div key={idx} className="rating-card">
                            <p className="rating-source">{rating.Source}</p>
                            <p className="rating-value">{rating.Value}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Details Grid */}
                  <div className="details-grid">
                    <DetailItem icon={<Calendar />} label="Released" value={movieDetails.Released} />
                    <DetailItem icon={<Clock />} label="Runtime" value={movieDetails.Runtime} />
                    <DetailItem icon={<Film />} label="Genre" value={movieDetails.Genre} />
                    <DetailItem icon={<Users />} label="Director" value={movieDetails.Director} />
                    <DetailItem icon={<Users />} label="Actors" value={movieDetails.Actors} />
                    <DetailItem icon={<Globe />} label="Language" value={movieDetails.Language} />
                    <DetailItem icon={<Globe />} label="Country" value={movieDetails.Country} />
                    {movieDetails.BoxOffice && movieDetails.BoxOffice !== 'N/A' && (
                      <DetailItem icon={<Award />} label="Box Office" value={movieDetails.BoxOffice} />
                    )}
                  </div>

                  {/* Awards */}
                  {movieDetails.Awards && movieDetails.Awards !== 'N/A' && (
                    <div className="awards-section">
                      <p className="awards-title">
                        <Award className="icon-small" />
                        Awards
                      </p>
                      <p className="awards-text">{movieDetails.Awards}</p>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}

function DetailItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="detail-item">
      <p className="detail-label">
        {icon}
        {label}
      </p>
      <p className="detail-value">{value}</p>
    </div>
  );
}

export default App;