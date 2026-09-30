(function () {
  const TMDB_API_KEY = 'a2030d49da05db8e760e49b030fc4a03';
  const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
  const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
  const TMDB_BACKDROP_BASE = 'https://image.tmdb.org/t/p/original';
  const TMDB_GENRE_IDS = {
    action: 28,
    adventure: 12,
    animation: 16,
    comedy: 35,
    crime: 80,
    documentary: 99,
    drama: 18,
    family: 10751,
    fantasy: 14,
    history: 36,
    horror: 27,
    music: 10402,
    mystery: 9648,
    romance: 10749,
    thriller: 53,
    'sci-fi': 878,
    war: 10752,
    western: 37
  };
  const TMDB_GENRE_NAMES_BY_ID = Object.keys(TMDB_GENRE_IDS).reduce(function (names, genre) {
    names[TMDB_GENRE_IDS[genre]] = genre === 'sci-fi' ? 'Science Fiction' : genre.charAt(0).toUpperCase() + genre.slice(1);
    return names;
  }, {});

  function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.toLowerCase();
  }

  function initNavbar() {
    const navContainer = document.querySelector('[data-navbar]');
    if (!navContainer || navContainer.dataset.initialized === 'true') return;

    const pages = [
      { href: 'home.html', label: 'Homepage' },
      { href: 'recommendation.html', label: 'Recommendation' },
      { href: 'profile.html', label: 'Profile' }
    ];

    const currentPage = getCurrentPageName();
    const logoutBtn = document.getElementById('logoutBtn');
    const brand = document.createElement('a');
    brand.href = 'home.html';
    brand.className = 'brand';
    brand.setAttribute('aria-label', 'CineVerse homepage');

    const logo = document.createElement('img');
    logo.src = 'assets/cineverse-logo.svg';
    logo.alt = '';

    const wordmark = document.createElement('span');
    wordmark.textContent = 'CineVerse';
    brand.appendChild(logo);
    brand.appendChild(wordmark);

    const nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.setAttribute('aria-label', 'Main navigation');

    pages.forEach(function (page) {
      const link = document.createElement('a');
      link.href = page.href;
      link.className = 'nav-link';
      if (currentPage === page.href.toLowerCase()) {
        link.classList.add('active');
      }
      link.textContent = page.label;
      nav.appendChild(link);
    });

    navContainer.dataset.initialized = 'true';
    navContainer.innerHTML = '';
    navContainer.appendChild(brand);
    navContainer.appendChild(nav);
    if (logoutBtn) {
      logoutBtn.classList.add('btn', 'btn-danger');
      navContainer.appendChild(logoutBtn);
    }

    const profileBtn = document.getElementById('profileBtn');
    if (profileBtn) {
      profileBtn.classList.add('btn', 'btn-secondary');
    }
  }

  function bindLogoutButtons() {
    const logoutButtons = document.querySelectorAll('#logoutBtn, [data-logout]');
    if (!logoutButtons.length) return;

    const dialog = document.createElement('dialog');
    dialog.className = 'logout-confirm-dialog';
    dialog.setAttribute('aria-labelledby', 'logoutConfirmTitle');

    const content = document.createElement('div');
    content.className = 'logout-confirm-content';

    const title = document.createElement('h2');
    title.id = 'logoutConfirmTitle';
    title.textContent = 'Log out?';

    const message = document.createElement('p');
    message.textContent = 'Are you sure you want to log out of CineVerse?';

    const actions = document.createElement('div');
    actions.className = 'logout-confirm-actions';

    const cancelButton = document.createElement('button');
    cancelButton.type = 'button';
    cancelButton.className = 'btn btn-secondary';
    cancelButton.textContent = 'Cancel';
    cancelButton.autofocus = true;
    cancelButton.addEventListener('click', function () {
      dialog.close();
    });

    const confirmButton = document.createElement('button');
    confirmButton.type = 'button';
    confirmButton.className = 'btn btn-danger';
    confirmButton.textContent = 'Log out';
    confirmButton.addEventListener('click', function () {
      localStorage.removeItem('loggedInUser');
      window.location.href = 'Login.html';
    });

    actions.appendChild(cancelButton);
    actions.appendChild(confirmButton);
    content.appendChild(title);
    content.appendChild(message);
    content.appendChild(actions);
    dialog.appendChild(content);
    document.body.appendChild(dialog);

    logoutButtons.forEach(function (btn) {
      if (btn.dataset.logoutConfirmBound === 'true') return;
      btn.dataset.logoutConfirmBound = 'true';
      btn.addEventListener('click', function (event) {
        event.preventDefault();
        dialog.showModal();
      });
    });
  }

  function getPosterFallback() {
    const title = 'Movie poster';
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450" viewBox="0 0 300 450">',
      '<defs><linearGradient id="bg" x1="0" x2="1" y1="0" y2="1"><stop offset="0%" stop-color="#151515"/><stop offset="100%" stop-color="#2a2a2a"/></linearGradient></defs>',
      '<rect width="300" height="450" fill="url(#bg)"/>',
      '<rect x="30" y="40" width="240" height="310" rx="18" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.13)"/>',
      '<circle cx="150" cy="160" r="56" fill="rgba(255,255,255,0.08)"/>',
      '<path d="M121 188h58c18 0 33 15 33 33v49H88v-49c0-18 15-33 33-33z" fill="rgba(255,255,255,0.08)"/>',
      '<path d="M85 290h130l-18 54H103z" fill="rgba(255,255,255,0.08)"/>',
      '<text x="150" y="360" text-anchor="middle" font-family="Arial, sans-serif" font-size="22" fill="#e5e7eb" font-weight="700">' + title + '</text>',
      '</svg>'
    ].join('');

    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  }

  function buildImageUrl(path, baseUrl) {
    if (!path || !baseUrl) return getPosterFallback();
    if (typeof path === 'string' && /^https?:\/\//i.test(path)) {
      return path;
    }
    return baseUrl + path;
  }

  function mapGenres(genreList) {
    if (Array.isArray(genreList) && genreList.length) {
      return genreList.map(function (entry) {
        if (entry && entry.name) return entry.name;
        return TMDB_GENRE_NAMES_BY_ID[entry] || '';
      }).filter(Boolean).join(', ');
    }

    if (Array.isArray(genreList) && genreList.length === 0) {
      return 'N/A';
    }

    return 'N/A';
  }

  function normalizeMovie(movie) {
    if (!movie) return null;

    const rawId = movie.id ?? movie.imdbID ?? movie.tmdbId ?? null;
    const title = movie.title || movie.Title || 'Unknown title';
    const releaseDate = movie.release_date || movie.Year || '';
    const year = releaseDate ? String(releaseDate).slice(0, 4) : 'N/A';
    const posterSource = movie.poster_path || movie.Poster || '';
    const posterUrl = posterSource && posterSource !== 'N/A' ? buildImageUrl(posterSource, TMDB_IMAGE_BASE) : getPosterFallback();
    const genreText = movie.Genre || mapGenres(movie.genres || movie.genre_ids);
    const ratingValue = movie.vote_average ?? movie.imdbRating ?? 'N/A';
    const ratingText = ratingValue !== 'N/A' && ratingValue !== null && ratingValue !== undefined ? Number(ratingValue).toFixed(1) : 'N/A';

    return {
      ...movie,
      id: rawId,
      imdbID: rawId,
      Title: title,
      title: title,
      Year: year,
      year: year,
      release_date: releaseDate,
      Poster: posterUrl,
      poster_path: movie.poster_path || '',
      backdrop_path: movie.backdrop_path || '',
      Plot: movie.overview || movie.Plot || 'No plot summary is available.',
      overview: movie.overview || movie.Plot || 'No plot summary is available.',
      Genre: genreText,
      imdbRating: ratingText,
      vote_average: movie.vote_average ?? null,
      Runtime: movie.runtime || movie.Runtime || 'N/A',
      Language: movie.original_language || movie.Language || 'N/A',
      Director: movie.Director || 'N/A',
      Writer: movie.Writer || 'N/A',
      Actors: movie.Actors || 'N/A',
      Awards: movie.Awards || 'N/A',
      backdrop: movie.backdrop_path ? buildImageUrl(movie.backdrop_path, TMDB_BACKDROP_BASE) : posterUrl
    };
  }

  function hasMoviePoster(movie) {
    if (!movie) return false;
    if (typeof movie.poster_path === 'string' && movie.poster_path.trim()) return true;
    return typeof movie.Poster === 'string' && movie.Poster !== 'N/A' && !movie.Poster.startsWith('data:image/svg+xml');
  }

  function createMovieCard(movie) {
    const item = normalizeMovie(movie) || {};
    const article = document.createElement('article');
    article.className = 'movie-card';

    const img = document.createElement('img');
    const safePoster = item.Poster || getPosterFallback();
    img.src = safePoster;
    img.alt = item.Title || 'Movie poster';
    img.loading = 'lazy';
    img.decoding = 'async';
    img.onerror = function () {
      if (this.dataset.fallbackApplied === 'true') return;
      this.dataset.fallbackApplied = 'true';
      this.src = getPosterFallback();
    };

    const content = document.createElement('div');
    content.className = 'movie-card-content';

    const title = document.createElement('h3');
    title.className = 'movie-card-title';
    title.textContent = item.Title || 'Unknown title';

    const meta = document.createElement('p');
    meta.className = 'movie-card-meta';
    const year = item.Year || item.Released || '';
    const genre = item.Genre ? String(item.Genre).split(',')[0] : '';
    meta.textContent = [genre, year].filter(Boolean).join(' • ');

    const rating = document.createElement('p');
    rating.className = 'movie-card-rating';
    const ratingText = item.imdbRating && item.imdbRating !== 'N/A' ? 'IMDb: ' + item.imdbRating : 'Rating available';
    rating.textContent = ratingText;

    content.appendChild(title);
    content.appendChild(meta);
    content.appendChild(rating);

    article.appendChild(img);
    article.appendChild(content);
    return article;
  }

  function getWatchlist() {
    try {
      const list = JSON.parse(localStorage.getItem('cineverseWatchlist') || '[]');
      return Array.isArray(list) ? list : [];
    } catch (error) {
      return [];
    }
  }

  function saveWatchlist(items) {
    localStorage.setItem('cineverseWatchlist', JSON.stringify(items));
  }

  function getMovieIdentifier(movie) {
    if (!movie) return null;
    return movie.imdbID || movie.id || movie.tmdbId || null;
  }

  function addToWatchlist(movie) {
    const movieId = getMovieIdentifier(movie);
    if (!movieId) return;
    const list = getWatchlist();
    if (!list.some(item => getMovieIdentifier(item) === movieId)) {
      list.push(normalizeMovie(movie) || movie);
      saveWatchlist(list);
    }
  }

  function removeFromWatchlist(movieId) {
    const list = getWatchlist().filter(item => getMovieIdentifier(item) !== movieId);
    saveWatchlist(list);
  }

  function isInWatchlist(movieId) {
    return !!(movieId && getWatchlist().some(item => getMovieIdentifier(item) === movieId));
  }

  function getReviews() {
    try {
      const reviews = JSON.parse(localStorage.getItem('cineverseReviews') || '{}');
      return reviews && typeof reviews === 'object' ? reviews : {};
    } catch (error) {
      return {};
    }
  }

  function saveReview(movieId, review) {
    if (!movieId || !review) return;
    const reviews = getReviews();
    if (!reviews[movieId]) reviews[movieId] = [];
    reviews[movieId].push(review);
    localStorage.setItem('cineverseReviews', JSON.stringify(reviews));
  }

  function updateReview(movieId, reviewIndex, review) {
    const reviews = getReviews();
    if (!movieId || !review || !Array.isArray(reviews[movieId]) || !Number.isInteger(reviewIndex) || reviewIndex < 0 || reviewIndex >= reviews[movieId].length) {
      return false;
    }

    reviews[movieId][reviewIndex] = review;
    localStorage.setItem('cineverseReviews', JSON.stringify(reviews));
    return true;
  }

  function deleteReview(movieId, reviewIndex) {
    const reviews = getReviews();
    if (!Array.isArray(reviews[movieId]) || !Number.isInteger(reviewIndex) || reviewIndex < 0 || reviewIndex >= reviews[movieId].length) return false;
    reviews[movieId].splice(reviewIndex, 1);
    localStorage.setItem('cineverseReviews', JSON.stringify(reviews));
    return true;
  }

  async function fetchTMDB(endpoint, params) {
    const url = new URL(TMDB_BASE_URL + endpoint);
    url.searchParams.set('api_key', TMDB_API_KEY);

    Object.keys(params || {}).forEach(function (key) {
      const value = params[key];
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, value);
      }
    });

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error('TMDB request failed.');
    }

    return response.json();
  }

  async function fetchMovies(query, page) {
    const searchTerm = (query || '').trim();
    if (!searchTerm) {
      return { Search: [], totalResults: 0, error: 'Please enter a movie title.' };
    }

    try {
      const data = await fetchTMDB('/search/movie', { query: searchTerm, page: page || 1 });
      const results = Array.isArray(data.results) ? data.results.map(normalizeMovie).filter(hasMoviePoster) : [];
      return {
        Search: results,
        totalResults: Number(data.total_results || results.length || 0),
        error: null
      };
    } catch (error) {
      return { Search: [], totalResults: 0, error: 'Unable to search movies right now.' };
    }
  }

  async function fetchAnimeMovies(page) {
    try {
      const data = await fetchTMDB('/discover/movie', {
        with_genres: TMDB_GENRE_IDS.animation,
        with_original_language: 'ja',
        sort_by: 'popularity.desc',
        page: page || 1
      });
      return Array.isArray(data && data.results) ? data.results.map(normalizeMovie).filter(hasMoviePoster) : [];
    } catch (error) {
      console.warn('Anime movie lookup failed:', error);
      return [];
    }
  }

  async function fetchMovieDetails(movieId) {
    const id = movieId || '';
    if (!id) {
      throw new Error('Movie ID is required.');
    }

    const data = await fetchTMDB('/movie/' + encodeURIComponent(id));
    return normalizeMovie(data);
  }

  async function fetchMovieCredits(movieId) {
    const id = movieId || '';
    if (!id) return { directors: [], cast: [] };

    try {
      const data = await fetchTMDB('/movie/' + encodeURIComponent(id) + '/credits');
      const crew = Array.isArray(data && data.crew) ? data.crew : [];
      const cast = Array.isArray(data && data.cast) ? data.cast : [];
      const directorIds = new Set();
      const directors = crew.filter(function (person) {
        if (!person || person.job !== 'Director' || directorIds.has(person.id)) return false;
        directorIds.add(person.id);
        return true;
      });
      return { directors: directors, cast: cast.filter(function (person) { return person && person.name; }).slice(0, 8) };
    } catch (error) {
      console.warn('Movie credits lookup failed:', error);
      return { directors: [], cast: [] };
    }
  }

  async function fetchMovieTrailer(movieId) {
    const id = movieId || '';
    if (!id) {
      return null;
    }

    try {
      const data = await fetchTMDB('/movie/' + encodeURIComponent(id) + '/videos');
      const videos = Array.isArray(data && data.results) ? data.results : [];
      const trailer = videos.find(function (item) {
        if (!item || item.site !== 'YouTube') return false;
        if (typeof item.key !== 'string' || !/^[A-Za-z0-9_-]{11}$/.test(item.key.trim())) {
          return false;
        }
        return item.type === 'Trailer' || item.type === 'Teaser';
      }) || videos.find(function (item) {
        if (!item || item.site !== 'YouTube') return false;
        return typeof item.key === 'string' && /^[A-Za-z0-9_-]{11}$/.test(item.key.trim());
      }) || null;

      return trailer ? { key: trailer.key.trim(), site: trailer.site, type: trailer.type } : null;
    } catch (error) {
      console.warn('Trailer lookup failed:', error);
      return null;
    }
  }

  async function fetchSimilarMovies(movieId) {
    const id = movieId || '';
    if (!id) return [];

    try {
      const data = await fetchTMDB('/movie/' + encodeURIComponent(id) + '/recommendations', { page: 1 });
      const results = Array.isArray(data && data.results) ? data.results : [];
      return results.map(normalizeMovie).filter(function (movie) {
        return hasMoviePoster(movie) && String(movie.id) !== String(id);
      }).slice(0, 8);
    } catch (error) {
      console.warn('Similar movies lookup failed:', error);
      return [];
    }
  }

  async function searchMovies(query) {
    return fetchMovies(query, 1);
  }

  async function fetchSectionMovies(section) {
    const limit = section && section.limit ? section.limit : 6;
    const sectionType = section && section.type ? section.type : 'discover';
    const genreKey = section && section.genre ? String(section.genre).toLowerCase() : '';
    const genreId = TMDB_GENRE_IDS[genreKey] || null;

    try {
      let data = null;

      if (sectionType === 'trending') {
        data = await fetchTMDB('/trending/movie/day', { page: 1 });
      } else if (sectionType === 'popular') {
        data = await fetchTMDB('/movie/popular', { page: 1 });
      } else if (sectionType === 'top_rated') {
        data = await fetchTMDB('/movie/top_rated', { page: 1 });
      } else if (sectionType === 'now_playing') {
        data = await fetchTMDB('/movie/now_playing', { page: 1 });
      } else if (sectionType === 'upcoming') {
        data = await fetchTMDB('/movie/upcoming', { page: 1 });
      } else if (genreId) {
        data = await fetchTMDB('/discover/movie', {
          with_genres: genreId,
          sort_by: 'popularity.desc',
          page: 1
        });
      } else if (section && Array.isArray(section.queries) && section.queries.length) {
        const queryResults = await Promise.all(section.queries.slice(0, 2).map(function (query) {
          return fetchMovies(query, 1);
        }));

        const seen = new Map();
        queryResults.forEach(function (result) {
          (result.Search || []).forEach(function (movie) {
            if (!movie || !movie.id || seen.has(movie.id)) return;
            seen.set(movie.id, movie);
          });
        });
        return Array.from(seen.values()).slice(0, limit);
      }

      const results = Array.isArray(data && data.results) ? data.results : [];
      let movies = results.map(normalizeMovie).filter(hasMoviePoster);

      if (section && section.sort === 'rating') {
        movies = movies.sort(function (a, b) {
          const ra = Number(a.vote_average || 0);
          const rb = Number(b.vote_average || 0);
          return rb - ra;
        });
      }

      return movies.slice(0, limit);
    } catch (error) {
      console.warn('Unable to load TMDB section:', section && section.title, error);
      return [];
    }
  }

  function setPageMeta() {
    const page = getCurrentPageName();
    if (page === 'login.html' || page === 'signup.html' || page === 'reset-password.html') {
      document.body.classList.add('auth-page');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    initNavbar();
    bindLogoutButtons();
    setPageMeta();
  });

  window.CineVerse = {
    TMDB_API_KEY: TMDB_API_KEY,
    TMDB_IMAGE_BASE: TMDB_IMAGE_BASE,
    TMDB_BACKDROP_BASE: TMDB_BACKDROP_BASE,
    createMovieCard: createMovieCard,
    normalizeMovie: normalizeMovie,
    hasMoviePoster: hasMoviePoster,
    fetchTMDB: fetchTMDB,
    fetchMovies: fetchMovies,
    fetchAnimeMovies: fetchAnimeMovies,
    fetchMovieDetails: fetchMovieDetails,
    fetchMovieCredits: fetchMovieCredits,
    fetchMovieTrailer: fetchMovieTrailer,
    fetchSimilarMovies: fetchSimilarMovies,
    searchMovies: searchMovies,
    fetchSectionMovies: fetchSectionMovies,
    getWatchlist: getWatchlist,
    addToWatchlist: addToWatchlist,
    removeFromWatchlist: removeFromWatchlist,
    isInWatchlist: isInWatchlist,
    getReviews: getReviews,
    saveReview: saveReview,
    updateReview: updateReview,
    deleteReview: deleteReview,
    getPosterFallback: getPosterFallback
  };
})();
