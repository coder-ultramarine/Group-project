const STORAGE_KEY = 'keam-library-state';

const state = {
  users: [],
  currentUserName: null,
  authMode: 'login',
  searchTerm: '',
  notice: null
};

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.users = Array.isArray(parsed.users) ? parsed.users : [];
    state.currentUserName = parsed.currentUserName || null;
  } catch (error) {
    state.users = [];
    state.currentUserName = null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    users: state.users,
    currentUserName: state.currentUserName
  }));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getCurrentUser() {
  if (!state.currentUserName) {
    return null;
  }

  return state.users.find((user) => user.username === state.currentUserName) || null;
}

function createUser(username, password) {
  return {
    username,
    password,
    games: [],
    friends: [],
    incomingRequests: [],
    outgoingRequests: [],
    messages: {}
  };
}

function setNotice(message, isError = false) {
  state.notice = { message, isError };
  renderNotice();
}

function clearNotice() {
  state.notice = null;
  renderNotice();
}

function renderNotice() {
  const noticeElement = document.getElementById('notice');
  if (!noticeElement) {
    return;
  }

  if (!state.notice) {
    noticeElement.textContent = '';
    noticeElement.className = '';
    return;
  }

  noticeElement.textContent = state.notice.message;
  noticeElement.className = `status ${state.notice.isError ? 'error' : 'success'}`;
}

function signUp(username, password) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    setNotice('Please enter a username and password.', true);
    return false;
  }

  if (state.users.some((user) => user.username === cleanUsername)) {
    setNotice('That username already exists.', true);
    return false;
  }

  const user = createUser(cleanUsername, cleanPassword);
  state.users.push(user);
  state.currentUserName = user.username;
  saveState();
  setNotice(`Welcome, ${cleanUsername}!`, false);
  return true;
}

function login(username, password) {
  const cleanUsername = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanUsername || !cleanPassword) {
    setNotice('Please enter a username and password.', true);
    return false;
  }

  const user = state.users.find(
    (entry) => entry.username === cleanUsername && entry.password === cleanPassword
  );

  if (!user) {
    setNotice('Wrong username or password.', true);
    return false;
  }

  state.currentUserName = user.username;
  saveState();
  setNotice(`Logged in as ${user.username}.`, false);
  return true;
}

function logout() {
  state.currentUserName = null;
  clearNotice();
  saveState();
  render();
}

function addGame(title, genre, year) {
  const user = getCurrentUser();
  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  const cleanTitle = title.trim();
  const cleanGenre = genre.trim();
  const cleanYear = year.trim();

  if (!cleanTitle || !cleanGenre || !cleanYear) {
    setNotice('Please fill in the title, genre, and year.', true);
    return false;
  }

  if (user.games.some((game) => game.title.toLowerCase() === cleanTitle.toLowerCase())) {
    setNotice('That game is already in your library.', true);
    return false;
  }

  user.games.unshift({
    id: `game-${Date.now()}`,
    title: cleanTitle,
    genre: cleanGenre,
    year: Number(cleanYear),
    status: 'Installed'
  });

  saveState();
  setNotice(`Added ${cleanTitle} to your library.`, false);
  return true;
}

function clearLibrary() {
  const user = getCurrentUser();
  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  if (!user.games.length) {
    setNotice('Your library is already empty.', true);
    return false;
  }

  user.games = [];
  saveState();
  setNotice('Your game library has been cleared.', false);
  return true;
}

function deinstallGame(gameId) {
  const user = getCurrentUser();
  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  const game = user.games.find((item) => item.id === gameId);
  if (!game) {
    setNotice('Game not found.', true);
    return false;
  }

  if (game.status === 'Not installed') {
    setNotice(`${game.title} is already not installed.`, true);
    return false;
  }

  game.status = 'Not installed';
  saveState();
  setNotice(`${game.title} was deinstalled.`, false);
  return true;
}

function renderAuthPage() {
  const app = document.getElementById('app');
  if (!app) {
    return;
  }

  app.innerHTML = `
    <div class="auth-card">
      <div>
        <h1 style="margin: 0 0 10px;">KEAM Login</h1>
        <p class="muted">Create an account or sign in to manage your game library.</p>
      </div>

      <div class="auth-tabs">
        <button class="btn ${state.authMode === 'login' ? 'btn-primary' : ''}" data-auth-mode="login" type="button">Login</button>
        <button class="btn ${state.authMode === 'signup' ? 'btn-primary' : ''}" data-auth-mode="signup" type="button">Create Account</button>
      </div>

      <div id="notice" class="status" style="min-height: 42px; margin-top: 8px;"></div>

      ${state.authMode === 'login' ? `
        <form id="login-form" class="form-row" style="grid-template-columns: 1fr;">
          <input class="input" id="login-username" type="text" placeholder="Username" required />
          <input class="input" id="login-password" type="password" placeholder="Password" required />
          <button class="btn btn-primary" type="submit">Login</button>
        </form>
      ` : `
        <form id="signup-form" class="form-row" style="grid-template-columns: 1fr;">
          <input class="input" id="signup-username" type="text" placeholder="Username" required />
          <input class="input" id="signup-password" type="password" placeholder="Password" required />
          <button class="btn btn-primary" type="submit">Create Account</button>
        </form>
      `}
    </div>
  `;

  renderNotice();

  document.querySelectorAll('[data-auth-mode]').forEach((button) => {
    button.addEventListener('click', () => {
      state.authMode = button.getAttribute('data-auth-mode');
      render();
    });
  });

  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');

  loginForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    if (login(username, password)) {
      render();
    }
  });

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    if (signUp(username, password)) {
      render();
    }
  });
}

function renderLibraryPage() {
  const user = getCurrentUser();
  const app = document.getElementById('app');
  if (!app || !user) {
    return;
  }

  const term = state.searchTerm.trim().toLowerCase();
  const filteredGames = user.games.filter((game) => {
    if (!term) {
      return true;
    }

    return (
      game.title.toLowerCase().includes(term) ||
      game.genre.toLowerCase().includes(term) ||
      String(game.year).includes(term)
    );
  });

  app.innerHTML = `
    <div class="panel">
      <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap; margin-bottom:18px;">
        <div>
          <h2 style="margin:0;">${escapeHtml(user.username)}'s Library</h2>
          <p class="muted" style="margin:6px 0 0;">${user.games.length} games in your collection</p>
        </div>
        <div style="display:flex; gap:10px; flex-wrap:wrap; align-items:center;">
          <button class="btn btn-warning" id="clear-library-btn" type="button">Clear library</button>
          <button class="btn" id="open-quiz-nav" type="button">Open quiz</button>
          <button class="btn btn-danger" id="logout-btn" type="button">Logout</button>
        </div>
      </div>

      <div id="notice" class="status" style="min-height: 42px; margin-bottom: 16px;"></div>

      <form id="game-form" class="form-row" style="margin-bottom: 18px; grid-template-columns: repeat(3, minmax(0, 1fr));">
        <input class="input" id="game-title" type="text" placeholder="Game title" />
        <input class="input" id="game-genre" type="text" placeholder="Genre" />
        <input class="input" id="game-year" type="number" placeholder="Year" />
        <button class="btn btn-primary" type="submit" style="min-width: 180px;">Add game</button>
      </form>

      <div class="form-row" style="margin-bottom: 18px; align-items: center;">
        <input class="input" id="search-input" type="text" placeholder="Search games" value="${escapeHtml(state.searchTerm)}" />
        <button class="btn" id="clear-search-btn" type="button">Clear search</button>
      </div>

      <div class="game-list">
        ${filteredGames.length ? filteredGames.map((game) => `
          <div class="game-card">
            <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; flex-wrap:wrap;">
              <div>
                <strong>${escapeHtml(game.title)}</strong>
                <div class="meta">${escapeHtml(game.genre)} · ${escapeHtml(game.year)}</div>
              </div>
              <div style="display:flex; align-items:center; gap:10px; flex-wrap:wrap;">
                <span class="tag ${game.status === 'Installed' ? 'tag-installed' : 'tag-uninstalled'}">${escapeHtml(game.status)}</span>
                ${game.status === 'Installed' ? `<button class="btn btn-small btn-warning" data-deinstall-game="${escapeHtml(game.id)}" type="button">Deinstall</button>` : ''}
              </div>
            </div>
          </div>
        `).join('') : `
          <div class="game-card">
            <strong>No games found</strong>
            <div class="muted">Add a game to start building your collection.</div>
          </div>
        `}
      </div>
    </div>
  `;

  renderNotice();

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
  });

  document.getElementById('game-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('game-title').value;
    const genre = document.getElementById('game-genre').value;
    const year = document.getElementById('game-year').value;
    if (addGame(title, genre, year)) {
      document.getElementById('game-form').reset();
      render();
    }
  });

  document.getElementById('search-input')?.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    render();
  });

  document.getElementById('clear-search-btn')?.addEventListener('click', () => {
    state.searchTerm = '';
    render();
  });

  document.getElementById('clear-library-btn')?.addEventListener('click', () => {
    if (clearLibrary()) {
      render();
    }
  });

  document.getElementById('open-quiz-nav')?.addEventListener('click', () => {
    document.getElementById('openQuizBtn')?.click();
  });

  document.querySelectorAll('[data-deinstall-game]').forEach((button) => {
    button.addEventListener('click', () => {
      const gameId = button.getAttribute('data-deinstall-game');
      if (deinstallGame(gameId)) {
        render();
      }
    });
  });
}

function render() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    renderAuthPage();
    return;
  }

  renderLibraryPage();
}

function attachQuizLoader() {
  document.getElementById('openQuizBtn')?.addEventListener('click', () => {
    const container = document.getElementById('quizContent');
    if (!container) {
      return;
    }

    container.innerHTML = '<div class="quiz-loading">Loading quiz...</div>';

    const iframe = document.createElement('iframe');
    iframe.className = 'quiz-iframe';
    iframe.src = 'index-game.html';
    iframe.title = 'Game quiz';
    iframe.setAttribute('loading', 'eager');

    container.innerHTML = '';
    container.appendChild(iframe);
  });

  document.getElementById('closeQuizBtn')?.addEventListener('click', () => {
    const container = document.getElementById('quizContent');
    if (container) {
      container.innerHTML = '';
    }
  });
}

loadState();
attachQuizLoader();
render();
