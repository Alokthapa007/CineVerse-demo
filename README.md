# 🎬 CineVerse

**CineVerse** is a simple, front-end-only movie review and rating web app built with **HTML, CSS, and basic JavaScript**. It gives movie fans one clean place to search for films, read and write reviews, rate titles, and keep a personal watchlist — without ads, clutter, or unnecessary frameworks.

---

## 📌 About the Project

Finding an honest opinion about a movie before watching it is harder than it should be. Viewers rely on scattered social media comments, ticketing apps, and generic aggregator sites — most cluttered with ads, dominated by critic scores, or poorly moderated.

CineVerse was built to solve this by giving everyday viewers one focused, review-first platform to discover movies and share genuine opinions — using only fundamental web technologies, making it lightweight and easy to learn from.

---

## ✨ Features

- 🔐 Basic user login / sign-up (stored in browser local storage)
- 🔍 Search and browse movies by title or genre using a public movie API
- 🎞️ Movie detail pages with synopsis, cast, poster, and community rating
- ⭐ Star-rating and written-review system (add, edit, delete)
- 📌 Personal watchlist saved locally in the browser
- 🎯 Simple genre-based movie suggestions
- 📱 Responsive design for mobile, tablet, and desktop

---

## 🛠️ Tech Stack

- **HTML5** – page structure
- **CSS3** – styling and responsive layout
- **JavaScript (Vanilla)** – DOM manipulation, event handling, Fetch API
- **[TMDB API](https://www.themoviedb.org/documentation/api)** (or similar) – movie data source
- **Local Storage** – storing user accounts, reviews, ratings, and watchlist

No frameworks, libraries, or backend server required.

---

## 📂 Project Structure

```
cineverse/
├── index.html          # Home page
├── login.html          # Login / Sign-up page
├── movie-details.html  # Movie details & reviews page
├── watchlist.html      # User's watchlist page
├── css/
│   └── style.css       # All styling
├── js/
│   ├── api.js          # Fetch calls to the movie API
│   ├── auth.js         # Login/signup logic (local storage)
│   ├── reviews.js       # Add/edit/delete reviews & ratings
│   ├── watchlist.js     # Watchlist logic
│   └── main.js          # Shared/general script logic
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, etc.)
- A free API key from [TMDB](https://www.themoviedb.org/signup) (or your chosen movie API)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/cineverse.git
   cd cineverse
   ```

2. **Add your API key**
   Open `js/api.js` and replace the placeholder with your API key:
   ```js
   const API_KEY = "YOUR_API_KEY_HERE";
   ```

3. **Run the project**
   Simply open `index.html` in your browser, or use a live server extension (e.g., VS Code's "Live Server") for the best experience.

---

## 🖥️ Usage

1. Sign up or log in.
2. Search or browse movies from the home page.
3. Click on a movie to view its details, cast, and existing reviews.
4. Rate the movie and write a review.
5. Add movies to your watchlist to revisit later.

---

## 🗺️ Roadmap

- [ ] Add sorting/filtering for reviews (by date, rating)
- [ ] Add basic review moderation
- [ ] Improve recommendation logic
- [ ] Add dark mode

---

## 🤝 Contributing

Contributions are welcome! To contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👥 Authors

- [Your Name] — [GitHub Profile](https://github.com/your-username)

---

## 🙏 Acknowledgements

- Movie data powered by [TMDB API](https://www.themoviedb.org/documentation/api)
