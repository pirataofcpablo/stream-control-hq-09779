import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const TMDB_API_KEY = "9049a1d821f51ef88e70e430d10298c5";
const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

const TMDBCarousel = () => {
  const [moviesLeft, setMoviesLeft] = useState<Movie[]>([]);
  const [moviesRight, setMoviesRight] = useState<Movie[]>([]);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Fetch popular movies
        const response1 = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
        );
        const data1 = await response1.json();
        
        // Fetch top rated movies
        const response2 = await fetch(
          `https://api.themoviedb.org/3/movie/top_rated?api_key=${TMDB_API_KEY}&language=pt-BR&page=1`
        );
        const data2 = await response2.json();

        setMoviesLeft(data1.results || []);
        setMoviesRight(data2.results || []);
      } catch (error) {
        console.error("Error fetching TMDB data:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <section className="py-20 overflow-hidden bg-card/20">
      <div className="mb-12 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Biblioteca <span className="gradient-text">completa</span> de conteúdo
        </h2>
        <p className="text-muted-foreground">Milhares de filmes e séries disponíveis</p>
      </div>

      {/* Left scrolling carousel */}
      <div className="mb-8 relative overflow-hidden">
        <div className="flex gap-4 animate-slide-left">
          {moviesLeft.length > 0 && [...moviesLeft, ...moviesLeft].map((movie, index) => (
            movie.poster_path && (
              <div
                key={`left-${movie.id}-${index}`}
                className="flex-shrink-0 w-40 cursor-pointer transform hover:scale-110 transition-transform"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
                <div className="mt-2 text-sm font-medium truncate">{movie.title}</div>
                {movie.vote_average > 0 && (
                  <div className="text-xs text-primary">⭐ {movie.vote_average.toFixed(1)}</div>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Right scrolling carousel */}
      <div className="relative overflow-hidden">
        <div className="flex gap-4 animate-slide-right">
          {moviesRight.length > 0 && [...moviesRight, ...moviesRight].map((movie, index) => (
            movie.poster_path && (
              <div
                key={`right-${movie.id}-${index}`}
                className="flex-shrink-0 w-40 cursor-pointer transform hover:scale-110 transition-transform"
                onClick={() => setSelectedMovie(movie)}
              >
                <img
                  src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                  alt={movie.title}
                  className="w-full rounded-lg shadow-lg"
                  loading="lazy"
                />
                <div className="mt-2 text-sm font-medium truncate">{movie.title}</div>
                {movie.vote_average > 0 && (
                  <div className="text-xs text-primary">⭐ {movie.vote_average.toFixed(1)}</div>
                )}
              </div>
            )
          ))}
        </div>
      </div>

      {/* Movie details modal */}
      <Dialog open={!!selectedMovie} onOpenChange={() => setSelectedMovie(null)}>
        <DialogContent className="max-w-2xl">
          {selectedMovie && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{selectedMovie.title}</DialogTitle>
              </DialogHeader>
              <div className="grid md:grid-cols-2 gap-6">
                <img
                  src={`${TMDB_IMAGE_BASE}${selectedMovie.poster_path}`}
                  alt={selectedMovie.title}
                  className="w-full rounded-lg"
                />
                <div className="space-y-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Avaliação</div>
                    <div className="text-xl font-bold text-primary">
                      ⭐ {selectedMovie.vote_average.toFixed(1)}/10
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Sinopse</div>
                    <p className="text-sm leading-relaxed">{selectedMovie.overview || "Sinopse não disponível"}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default TMDBCarousel;
