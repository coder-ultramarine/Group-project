const STORAGE_KEY = 'keam-state';

const state = {
  users: [],
  currentUserName: null,
  selectedFriend: null,
  authMode: 'login',
  notice: null,
  searchTerm: '',
  sortMode: 'none',
  showSection: 'all',
  selectedGenre: 'all',
  detailGameTitle: null
};

const GENRE_OPTIONS = [
  'Indie', 'Action', 'Adventure', 'Soulslike', 'Action RPG', 'DLC', 'Sci-Fi', 'RPG', 'Survival', 'Exploration', 'Zombie', 'Multiplayer', 'Horror', 'Co-op', 'Party', 'Battle Royale', 'Sports', 'Racing', 'Open World', 'FPS', 'Competitive', 'Tactical Shooter', 'Sandbox'
];

const GENRE_NORMALIZATION = {
  'indie': 'Indie',
  'action': 'Action',
  'adventure': 'Adventure',
  'soulslike': 'Soulslike',
  'action rpg': 'Action RPG',
  'dlc': 'DLC',
  'sci-fi': 'Sci-Fi',
  'sci fi': 'Sci-Fi',
  'rpg': 'RPG',
  'survival': 'Survival',
  'exploration': 'Exploration',
  'zombie': 'Zombie',
  'multiplayer': 'Multiplayer',
  'horror': 'Horror',
  'co-op': 'Co-op',
  'coop': 'Co-op',
  'party': 'Party',
  'battle royale': 'Battle Royale',
  'sports': 'Sports',
  'racing': 'Racing',
  'open world': 'Open World',
  'open-world': 'Open World',
  'fps': 'FPS',
  'competitive': 'Competitive',
  'tactical shooter': 'Tactical Shooter',
  'shooter': 'Tactical Shooter',
  'simulation': 'Sandbox',
  'driving': 'Racing',
  'city builder': 'Sandbox',
  'strategy': 'Sandbox',
  'fantasy': 'Adventure',
  'story rich': 'Adventure',
  'roguelike': 'Indie',
  'metroidvania': 'Indie'
};

function normalizeGenreLabel(rawGenre) {
  const normalizedKey = String(rawGenre || '').trim().toLowerCase();
  return GENRE_NORMALIZATION[normalizedKey] || null;
}

function getCanonicalGameGenres(game) {
  const genres = new Set();
  (Array.isArray(game.genres) ? game.genres : []).forEach((value) => {
    const normalized = normalizeGenreLabel(value);
    if (normalized) genres.add(normalized);
  });
  (Array.isArray(game.tags) ? game.tags : []).forEach((value) => {
    const normalized = normalizeGenreLabel(value);
    if (normalized) genres.add(normalized);
  });
  return Array.from(genres);
}

function createUser(username, password) {
  return {
    username: username.trim().toLowerCase(),
    password: password.trim(),
    games: [],
    friends: [],
    messages: {},
    incomingRequests: [],
    outgoingRequests: []
  };
}

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    state.users = [];
    state.currentUserName = null;
    state.selectedFriend = null;
    state.authMode = 'login';
    state.searchTerm = '';
    return;
  }

  try {
    const parsed = JSON.parse(saved);
    state.users = Array.isArray(parsed.users) ? parsed.users : [];
    state.currentUserName = typeof parsed.currentUserName === 'string' ? parsed.currentUserName : null;
    state.selectedFriend = typeof parsed.selectedFriend === 'string' ? parsed.selectedFriend : null;
    state.authMode = parsed.authMode || 'login';
    state.searchTerm = parsed.searchTerm || '';
    state.sortMode = parsed.sortMode || 'none';
    state.showSection = parsed.showSection || 'all';
    state.selectedGenre = parsed.selectedGenre || 'all';
    state.detailGameTitle = typeof parsed.detailGameTitle === 'string' ? parsed.detailGameTitle : null;
  } catch {
    state.users = [];
    state.currentUserName = null;
    state.selectedFriend = null;
    state.authMode = 'login';
    state.searchTerm = '';
    state.sortMode = 'none';
    state.showSection = 'all';
    state.selectedGenre = 'all';
    state.detailGameTitle = null;
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    users: state.users,
    currentUserName: state.currentUserName,
    selectedFriend: state.selectedFriend,
    authMode: state.authMode,
    searchTerm: state.searchTerm,
    sortMode: state.sortMode,
    showSection: state.showSection,
    selectedGenre: state.selectedGenre,
    detailGameTitle: state.detailGameTitle
  }));
}

function getCurrentUser() {
  return state.users.find((user) => user.username === state.currentUserName) || null;
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function setNotice(message, isError = false) {
  state.notice = { message, isError };
}

function clearNotice() {
  state.notice = null;
}

function signUp(username, password) {
  const cleanName = username.trim().toLowerCase();
  const cleanPassword = password.trim();

  if (!cleanName || !cleanPassword) {
    setNotice('Please enter a username and password.', true);
    return false;
  }

  if (state.users.some((user) => user.username === cleanName)) {
    setNotice('That username already exists.', true);
    return false;
  }

  const newUser = createUser(cleanName, cleanPassword);
  state.users.push(newUser);
  state.currentUserName = newUser.username;
  state.selectedFriend = null;
  saveState();
  setNotice(`Welcome, ${newUser.username}!`, false);
  return true;
}

function login(username, password) {
  const cleanName = username.trim().toLowerCase();
  const cleanPassword = password.trim();
  const user = state.users.find((entry) => entry.username === cleanName && entry.password === cleanPassword);

  if (!user) {
    setNotice('Wrong username or password.', true);
    return false;
  }

  state.currentUserName = user.username;
  state.selectedFriend = null;
  saveState();
  setNotice(`Signed in as ${user.username}.`, false);
  return true;
}

function logout() {
  state.currentUserName = null;
  state.selectedFriend = null;
  clearNotice();
  saveState();
  render();
}

function addGame(title, genre, year) {
  const user = getCurrentUser();
  const cleanedTitle = title.trim();
  const cleanedGenre = genre.trim();
  const cleanedYear = year.trim();

  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  if (!cleanedTitle || !cleanedGenre || !cleanedYear) {
    setNotice('Please fill in the title, genre, and year.', true);
    return false;
  }

  const alreadyExists = user.games.some((game) => game.title.toLowerCase() === cleanedTitle.toLowerCase());
  if (alreadyExists) {
    setNotice('That game is already in your library.', true);
    return false;
  }

  user.games.unshift({
    id: `game-${Date.now()}`,
    title: cleanedTitle,
    genre: cleanedGenre,
    year: Number(cleanedYear) || 0,
    status: 'Installed'
  });

  saveState();
  setNotice(`Added ${cleanedTitle} to your library.`, false);
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

  game.status = 'Not installed';
  saveState();
  setNotice(`${game.title} was deinstalled.`, false);
  return true;
}

function reinstallGame(gameId) {
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

  game.status = 'Installed';
  saveState();
  setNotice(`${game.title} was reinstalled.`, false);
  return true;
}

function addFriend(friendName) {
  const user = getCurrentUser();
  const name = friendName.trim().toLowerCase();

  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  if (!name) {
    setNotice('Please enter a friend username.', true);
    return false;
  }

  if (user.username === name) {
    setNotice('You cannot add yourself.', true);
    return false;
  }

  const target = state.users.find((entry) => entry.username === name);
  if (!target) {
    setNotice('No account found with that username.', true);
    return false;
  }

  if (user.friends.includes(name)) {
    setNotice('This user is already your friend.', true);
    return false;
  }

  if (user.outgoingRequests.includes(name) || user.incomingRequests.includes(name)) {
    setNotice('A request is already pending with this user.', true);
    return false;
  }

  user.outgoingRequests.push(name);
  target.incomingRequests.push(user.username);
  saveState();
  setNotice(`Friend request sent to ${name}.`, false);
  return true;
}

function acceptFriendRequest(friendName) {
  const user = getCurrentUser();
  const name = friendName.trim().toLowerCase();
  const requester = state.users.find((entry) => entry.username === name);

  if (!user || !requester) {
    setNotice('This request could not be processed.', true);
    return false;
  }

  user.incomingRequests = user.incomingRequests.filter((entry) => entry !== name);
  requester.outgoingRequests = requester.outgoingRequests.filter((entry) => entry !== user.username);
  if (!user.friends.includes(name)) user.friends.push(name);
  if (!requester.friends.includes(user.username)) requester.friends.push(user.username);
  user.messages[name] = user.messages[name] || [];
  requester.messages[user.username] = requester.messages[user.username] || [];
  state.selectedFriend = name;
  saveState();
  setNotice(`You are now friends with ${name}.`, false);
  return true;
}

function declineFriendRequest(friendName) {
  const user = getCurrentUser();
  const name = friendName.trim().toLowerCase();
  const requester = state.users.find((entry) => entry.username === name);

  if (!user || !requester) {
    setNotice('This request could not be processed.', true);
    return false;
  }

  user.incomingRequests = user.incomingRequests.filter((entry) => entry !== name);
  requester.outgoingRequests = requester.outgoingRequests.filter((entry) => entry !== user.username);
  saveState();
  setNotice(`Declined request from ${name}.`, false);
  return true;
}

function removeFriend(friendName) {
  const user = getCurrentUser();
  const name = friendName.trim().toLowerCase();
  if (!user) return false;

  user.friends = user.friends.filter((entry) => entry !== name);
  delete user.messages[name];
  saveState();
  setNotice(`${name} removed from your friends list.`, false);
  return true;
}

function sendMessage(friendName, messageText) {
  const user = getCurrentUser();
  const name = friendName.trim().toLowerCase();
  const text = messageText.trim();

  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  if (!name || !user.friends.includes(name)) {
    setNotice('Select a valid friend first.', true);
    return false;
  }

  if (!text) {
    setNotice('Please write a message.', true);
    return false;
  }

  const recipient = state.users.find((entry) => entry.username === name);
  if (!recipient) {
    setNotice('That friend could not be found.', true);
    return false;
  }

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  user.messages[name] = user.messages[name] || [];
  user.messages[name].push({ sender: 'you', text, time });
  recipient.messages[user.username] = recipient.messages[user.username] || [];
  recipient.messages[user.username].push({ sender: user.username, text, time });
  saveState();
  setNotice('Message sent.', false);
  return true;
}

function getSuggestedGame() {
  const user = getCurrentUser();
  if (!user) return null;

  const friendUsers = user.friends
    .map((friendName) => state.users.find((entry) => entry.username === friendName))
    .filter(Boolean);

  const suggested = [];
  friendUsers.forEach((friend) => {
    friend.games.forEach((game) => {
      if (!user.games.some((owned) => owned.title.toLowerCase() === game.title.toLowerCase())) {
        suggested.push({ game, friend: friend.username });
      }
    });
  });

  if (!suggested.length) {
    return null;
  }

  return suggested[Math.floor(Math.random() * suggested.length)];
}

function getAvailableSteamGames(user) {
  if (!user || !Array.isArray(window.GAMES) || !window.GAMES.length) {
    return [];
  }

  const existingTitles = new Set(user.games.map((game) => game.title.toLowerCase()));
  return window.GAMES
    .filter((game) => !existingTitles.has(game.title.toLowerCase()))
    .slice(0, 24)
    .map((game) => {
      const normalizedGenres = getCanonicalGameGenres(game);
      return {
        title: game.title,
        genre: normalizedGenres.length ? normalizedGenres.join(', ') : (game.genres || []).slice(0, 2).join(', '),
        year: game.releaseYear || 2020,
        price: game.price || 0,
        platforms: game.platforms || [],
        developer: game.developer || 'Unknown',
        publisher: game.publisher || 'Unknown',
        description: game.description || 'No description is available.',
        tags: game.tags || [],
        status: 'Available'
      };
    });
}

function formatGameDetails(game) {
  const priceText = typeof game.price === 'number' ? `$${game.price.toFixed(2)}` : (game.price || 'Unknown');
  const platformsText = Array.isArray(game.platforms) ? game.platforms.join(', ') : 'Unknown';
  const tagsText = Array.isArray(game.tags) ? game.tags.join(', ') : 'None';

  return {
    title: game.title,
    genre: game.genre || 'Unknown',
    year: game.year || 'Unknown',
    price: priceText,
    platforms: platformsText,
    developer: game.developer || 'Unknown',
    publisher: game.publisher || 'Unknown',
    description: game.description || 'No description is available.',
    tags: tagsText,
    status: game.status || 'Unknown'
  };
}

function findGameDetails(title, user) {
  const normalizedTitle = title.trim().toLowerCase();
  const libraryGame = user.games.find((game) => game.title.toLowerCase() === normalizedTitle);
  if (libraryGame) {
    const steamSource = Array.isArray(window.GAMES)
      ? window.GAMES.find((entry) => entry.title.toLowerCase() === normalizedTitle)
      : null;
    return formatGameDetails({
      ...steamSource,
      ...libraryGame,
      genre: libraryGame.genre || (steamSource ? (steamSource.genres || []).slice(0, 2).join(', ') : ''),
      price: libraryGame.price ?? steamSource?.price,
      platforms: libraryGame.platforms ?? steamSource?.platforms,
      developer: libraryGame.developer ?? steamSource?.developer,
      publisher: libraryGame.publisher ?? steamSource?.publisher,
      description: libraryGame.description ?? steamSource?.description,
      tags: libraryGame.tags ?? steamSource?.tags
    });
  }

  const available = Array.isArray(window.GAMES)
    ? window.GAMES.find((game) => game.title.toLowerCase() === normalizedTitle)
    : null;
  return available ? formatGameDetails({
    title: available.title,
    genre: getCanonicalGameGenres(available).join(', ') || (available.genres || []).slice(0, 2).join(', '),
    year: available.releaseYear || 2020,
    price: available.price || 0,
    platforms: available.platforms || [],
    developer: available.developer || 'Unknown',
    publisher: available.publisher || 'Unknown',
    description: available.description || 'No description is available.',
    tags: available.tags || [],
    status: 'Available'
  }) : null;
}

function installSteamGame(gameTitle) {
  const user = getCurrentUser();
  if (!user) {
    setNotice('Please sign in first.', true);
    return false;
  }

  const gameData = Array.isArray(window.GAMES)
    ? window.GAMES.find((entry) => entry.title === gameTitle)
    : null;

  if (!gameData) {
    setNotice('That game could not be found.', true);
    return false;
  }

  if (user.games.some((game) => game.title.toLowerCase() === gameData.title.toLowerCase())) {
    setNotice('This game is already in your library.', true);
    return false;
  }

  user.games.unshift({
    id: `steam-${Date.now()}`,
    title: gameData.title,
    genre: (gameData.genres || []).slice(0, 2).join(', '),
    year: gameData.releaseYear || 2020,
    status: 'Installed'
  });

  saveState();
  setNotice(`Installed ${gameData.title}.`, false);
  return true;
}

function renderAuthPage() {
  const messageHtml = state.notice ? `<div class="status ${state.notice.isError ? 'error' : 'success'}">${escapeHtml(state.notice.message)}</div>` : '';
  root.innerHTML = `
    <div class="auth-card">
      <div class="auth-tabs">
        <button class="btn ${state.authMode === 'login' ? 'btn-primary' : ''}" type="button" id="show-login">Login</button>
        <button class="btn ${state.authMode === 'signup' ? 'btn-primary' : ''}" type="button" id="show-signup">Create Account</button>
      </div>
      ${messageHtml}
      <form id="login-form" class="form-row" style="display: ${state.authMode === 'login' ? 'block' : 'none'};">
        <input class="input" id="login-username" type="text" placeholder="Username" required>
        <input class="input" id="login-password" type="password" placeholder="Password" required>
        <button class="btn btn-primary" type="submit">Login</button>
      </form>
      <form id="signup-form" class="form-row" style="display: ${state.authMode === 'signup' ? 'block' : 'none'};">
        <input class="input" id="signup-username" type="text" placeholder="Username" required>
        <input class="input" id="signup-password" type="password" placeholder="Password" required>
        <button class="btn btn-primary" type="submit">Create Account</button>
      </form>
    </div>
  `;

  document.getElementById('show-login')?.addEventListener('click', () => {
    state.authMode = 'login';
    clearNotice();
    render();
  });

  document.getElementById('show-signup')?.addEventListener('click', () => {
    state.authMode = 'signup';
    clearNotice();
    render();
  });

  document.getElementById('login-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;
    login(username, password);
    render();
  });

  document.getElementById('signup-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    signUp(username, password);
    render();
  });
}

function renderMainPage() {
  const user = getCurrentUser();
  if (!user) {
    renderAuthPage();
    return;
  }

  const searchTerm = state.searchTerm.trim().toLowerCase();
  const filteredGames = user.games.filter((game) => {
    const titleMatches = game.title.toLowerCase().includes(searchTerm);
    const genreMatches = game.genre.toLowerCase().includes(searchTerm);
    const searchMatches = !searchTerm || titleMatches || genreMatches;

    if (!searchMatches) return false;
    if (state.selectedGenre === 'all') return true;

    const selected = state.selectedGenre.toLowerCase();
    const gameGenres = game.genre.toLowerCase().split(',').map((value) => value.trim());
    const tagGenres = Array.isArray(game.tags) ? game.tags.map((tag) => tag.toLowerCase()) : [];
    return gameGenres.includes(selected) || tagGenres.includes(selected);
  });

  let installedGames = filteredGames.filter((game) => game.status === 'Installed');
  let notInstalledGames = filteredGames.filter((game) => game.status !== 'Installed');

  if (state.showSection === 'installed') {
    notInstalledGames = [];
  } else if (state.showSection === 'uninstalled') {
    installedGames = [];
  }

  const sortGames = (games) => {
    const copy = [...games];
    if (state.sortMode === 'genre') {
      return copy.sort((a, b) => a.genre.localeCompare(b.genre));
    }
    if (state.sortMode === 'price-asc') {
      return copy.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    }
    if (state.sortMode === 'price-desc') {
      return copy.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    }
    return copy;
  };

  installedGames = sortGames(installedGames);
  notInstalledGames = sortGames(notInstalledGames);
  const availableGames = getAvailableSteamGames(user);
  const suggestion = getSuggestedGame();
  const selectedFriend = state.selectedFriend && user.friends.includes(state.selectedFriend) ? state.selectedFriend : null;
  const messageHtml = state.notice ? `<div class="status ${state.notice.isError ? 'error' : 'success'}">${escapeHtml(state.notice.message)}</div>` : '';
  const suggestionHtml = suggestion ? `
            <div class="suggestion-box">
              <strong>Recommended from friends</strong>
              <p>${escapeHtml(suggestion.game.title)} is suggested by <strong>${escapeHtml(suggestion.friend)}</strong>.</p>
            </div>
  ` : '';

  root.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">KEAM Library</div>
        <div class="sidebar-card">
          <strong>${escapeHtml(user.username)}</strong>
          <p class="muted">${user.games.length} games • ${user.friends.length} friends</p>
        </div>
        <div class="sidebar-card">
          <button class="btn btn-danger" id="logout-btn">Logout</button>
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div>
            <strong>Welcome back</strong>
            <div class="muted">Keep your game library organised and stay in touch with friends.</div>
          </div>
        </header>
        ${messageHtml}
        <section class="dashboard-grid">
          <div class="panel" id="library">
            <h2>Your library</h2>
            <form id="game-form" class="form-row">
              <input class="input" id="game-title" type="text" placeholder="Game title">
              <input class="input" id="game-genre" type="text" placeholder="Genre">
              <input class="input" id="game-year" type="number" placeholder="Year">
              <button class="btn btn-primary" type="submit">Add game</button>
            </form>
            <div class="form-row" style="margin-top: 10px;">
              <input class="input" id="search-input" type="text" placeholder="Search your library" value="${escapeHtml(state.searchTerm)}">
              <button class="btn" id="clear-search-btn" type="button">Clear</button>
            </div>
            <div class="control-row">
              <div class="filter-group">
                <button class="btn btn-small ${state.showSection === 'all' ? 'btn-primary' : ''}" type="button" id="filter-all">All</button>
                <button class="btn btn-small ${state.showSection === 'installed' ? 'btn-primary' : ''}" type="button" id="filter-installed">Installed</button>
                <button class="btn btn-small ${state.showSection === 'uninstalled' ? 'btn-primary' : ''}" type="button" id="filter-uninstalled">Uninstalled</button>
              </div>
              <div class="sort-group">
                <div class="genre-control">
                  <label for="genre-filter">Genre</label>
                  <select class="genre-select" id="genre-filter">
                    <option value="all">All genres</option>
                    ${GENRE_OPTIONS.map((genre) => `
                      <option value="${escapeHtml(genre)}" ${state.selectedGenre === genre ? 'selected' : ''}>${escapeHtml(genre)}</option>
                    `).join('')}
                  </select>
                </div>
                <button class="btn btn-small ${state.sortMode === 'genre' ? 'btn-primary' : ''}" type="button" id="sort-genre">Genre</button>
                <button class="btn btn-small ${state.sortMode === 'price-asc' ? 'btn-primary' : ''}" type="button" id="sort-price-asc">Price ↑</button>
                <button class="btn btn-small ${state.sortMode === 'price-desc' ? 'btn-primary' : ''}" type="button" id="sort-price-desc">Price ↓</button>
              </div>
            </div>
            ${suggestionHtml}
            <div class="detail-panel ${state.detailGameTitle ? 'active' : ''}">
              ${state.detailGameTitle ? (() => {
                const detail = findGameDetails(state.detailGameTitle, user);
                if (!detail) return '<div class="game-card empty-card"><strong>Game details not found.</strong></div>';
                return `
                  <div class="detail-header">
                    <strong>Game details</strong>
                    <button class="btn btn-small btn-danger" type="button" id="close-detail">Close</button>
                  </div>
                  <div class="detail-body">
                    <h3>${escapeHtml(detail.title)}</h3>
                    <p><strong>Genre:</strong> ${escapeHtml(detail.genre)}</p>
                    <p><strong>Year:</strong> ${escapeHtml(detail.year)}</p>
                    <p><strong>Price:</strong> ${escapeHtml(detail.price)}</p>
                    <p><strong>Status:</strong> ${escapeHtml(detail.status)}</p>
                    <p><strong>Platforms:</strong> ${escapeHtml(detail.platforms)}</p>
                    <p><strong>Developer:</strong> ${escapeHtml(detail.developer)}</p>
                    <p><strong>Publisher:</strong> ${escapeHtml(detail.publisher)}</p>
                    <p><strong>Tags:</strong> ${escapeHtml(detail.tags)}</p>
                    <p>${escapeHtml(detail.description)}</p>
                  </div>
                `;
              })() : ''}
            </div>
            <div class="library-grid">
              <div class="game-section install-section">
                <h3>Install new games</h3>
                <div class="game-list">
                  ${availableGames.length ? availableGames.map((game) => `
                    <div class="game-card">
                      <div>
                        <strong>${escapeHtml(game.title)}</strong>
                        <div class="meta">${escapeHtml(game.genre)} • ${escapeHtml(String(game.year))}</div>
                      </div>
                      <div class="game-card-actions">
                        <button class="btn btn-small btn-install" type="button" data-install-game="${escapeHtml(game.title)}">Install</button>
                        <button class="btn btn-small" type="button" data-show-details="${escapeHtml(game.title)}">Details</button>
                      </div>
                    </div>
                  `).join('') : '<div class="game-card empty-card"><strong>No games available to install</strong><div class="muted">Your library already contains the visible titles.</div></div>'}
                </div>
              </div>
              <div class="game-section">
                <h3>Not installed</h3>
                <div class="game-list">
                  ${notInstalledGames.length ? notInstalledGames.map((game) => `
                    <div class="game-card">
                      <div>
                        <strong>${escapeHtml(game.title)}</strong>
                        <div class="meta">${escapeHtml(game.genre)} • ${escapeHtml(String(game.year))}</div>
                      </div>
                      <div class="game-card-actions">
                        <span class="tag tag-uninstalled">${escapeHtml(game.status)}</span>
                        <button class="btn btn-small btn-primary" type="button" data-reinstall-game="${escapeHtml(game.id)}">Reinstall</button>
                        <button class="btn btn-small" type="button" data-show-details="${escapeHtml(game.title)}">Details</button>
                      </div>
                    </div>
                  `).join('') : '<div class="game-card empty-card"><strong>No uninstalled games</strong><div class="muted">Any games you deinstall will appear here.</div></div>'}
                </div>
              </div>
              <div class="game-section">
                <h3>Installed games</h3>
                <div class="game-list">
                  ${installedGames.length ? installedGames.map((game) => `
                    <div class="game-card">
                      <div>
                        <strong>${escapeHtml(game.title)}</strong>
                        <div class="meta">${escapeHtml(game.genre)} • ${escapeHtml(String(game.year))}</div>
                      </div>
                      <div class="game-card-actions">
                        <span class="tag tag-installed">${escapeHtml(game.status)}</span>
                        <button class="btn btn-small btn-warning" type="button" data-deinstall-game="${escapeHtml(game.id)}">Deinstall</button>
                        <button class="btn btn-small" type="button" data-show-details="${escapeHtml(game.title)}">Details</button>
                      </div>
                    </div>
                  `).join('') : '<div class="game-card empty-card"><strong>No installed games</strong><div class="muted">Installed titles appear here once you add them.</div></div>'}
                </div>
              </div>
            </div>
          </div>
          <div class="panel" id="friends">
            <h2>Friends & requests</h2>
            <form id="friend-form" class="form-row">
              <input class="input" id="friend-name" type="text" placeholder="Add a friend">
              <button class="btn btn-primary" type="submit">Send request</button>
            </form>
            <div class="request-list">
              ${user.incomingRequests.length ? user.incomingRequests.map((name) => `
                <div class="request-card">
                  <strong>${escapeHtml(name)}</strong>
                  <div class="request-actions">
                    <button class="btn btn-small" type="button" data-accept-request="${escapeHtml(name)}">Accept</button>
                    <button class="btn btn-small btn-danger" type="button" data-decline-request="${escapeHtml(name)}">Decline</button>
                  </div>
                </div>
              `).join('') : '<div class="request-card"><strong>No incoming requests</strong></div>'}
            </div>
            <div class="friend-list">
              ${user.friends.length ? user.friends.map((friendName) => `
                <div class="friend-card">
                  <strong>${escapeHtml(friendName)}</strong>
                  <div class="muted">${state.users.find((entry) => entry.username === friendName)?.games.length || 0} shared games</div>
                  <div class="hero-actions" style="margin-top: 8px;">
                    <button class="btn btn-small" type="button" data-select-friend="${escapeHtml(friendName)}">Open chat</button>
                    <button class="btn btn-small btn-danger" type="button" data-remove-friend="${escapeHtml(friendName)}">Remove</button>
                  </div>
                </div>
              `).join('') : '<div class="friend-card"><strong>No friends yet</strong><div class="muted">Add one to start chatting.</div></div>'}
            </div>
          </div>
        </section>
        <section class="panel" id="chat">
          <h2>Messages</h2>
          <p class="muted">Chat with the friends you accepted.</p>
          ${selectedFriend ? `
            <div class="message-list">
              ${(user.messages[selectedFriend] || []).map((message) => `
                <div class="message-card ${message.sender === 'you' ? 'mine' : 'theirs'}">
                  <div>${escapeHtml(message.text)}</div>
                  <div class="muted">${escapeHtml(message.time)}</div>
                </div>
              `).join('')}
            </div>
            <form id="message-form" class="chat-actions" style="margin-top: 12px;">
              <input class="input" id="message-input" type="text" placeholder="Type a message">
              <button class="btn btn-primary" type="submit">Send</button>
            </form>
          ` : '<div class="game-card"><strong>Select a friend</strong><div class="muted">Choose a friend from the list above to open a chat.</div></div>'}
        </section>
      </main>
    </div>
  `;

  document.getElementById('logout-btn')?.addEventListener('click', () => {
    logout();
    render();
  });

  document.getElementById('game-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('game-title').value;
    const genre = document.getElementById('game-genre').value;
    const year = document.getElementById('game-year').value;
    if (addGame(title, genre, year)) {
      document.getElementById('game-form').reset();
    }
    render();
  });

  document.getElementById('search-input')?.addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    saveState();
    render();
  });

  document.getElementById('clear-search-btn')?.addEventListener('click', () => {
    state.searchTerm = '';
    document.getElementById('search-input').value = '';
    saveState();
    render();
  });

  document.querySelectorAll('[data-deinstall-game]').forEach((button) => {
    button.addEventListener('click', () => {
      deinstallGame(button.getAttribute('data-deinstall-game'));
      render();
    });
  });

  document.getElementById('friend-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('friend-name');
    if (addFriend(input.value)) {
      input.value = '';
    }
    render();
  });

  document.querySelectorAll('[data-select-friend]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedFriend = button.getAttribute('data-select-friend');
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-install-game]').forEach((button) => {
    button.addEventListener('click', () => {
      installSteamGame(button.getAttribute('data-install-game'));
      render();
    });
  });

  document.querySelectorAll('[data-show-details]').forEach((button) => {
    button.addEventListener('click', () => {
      state.detailGameTitle = button.getAttribute('data-show-details');
      saveState();
      render();
    });
  });

  document.querySelectorAll('[data-reinstall-game]').forEach((button) => {
    button.addEventListener('click', () => {
      reinstallGame(button.getAttribute('data-reinstall-game'));
      render();
    });
  });

  document.getElementById('close-detail')?.addEventListener('click', () => {
    state.detailGameTitle = null;
    saveState();
    render();
  });

  document.getElementById('filter-all')?.addEventListener('click', () => {
    state.showSection = 'all';
    saveState();
    render();
  });

  document.getElementById('filter-installed')?.addEventListener('click', () => {
    state.showSection = 'installed';
    saveState();
    render();
  });

  document.getElementById('filter-uninstalled')?.addEventListener('click', () => {
    state.showSection = 'uninstalled';
    saveState();
    render();
  });

  document.getElementById('genre-filter')?.addEventListener('change', (event) => {
    state.selectedGenre = event.target.value;
    saveState();
    render();
  });

  document.getElementById('sort-price-asc')?.addEventListener('click', () => {
    state.sortMode = 'price-asc';
    saveState();
    render();
  });

  document.getElementById('sort-price-desc')?.addEventListener('click', () => {
    state.sortMode = 'price-desc';
    saveState();
    render();
  });

  document.getElementById('sort-genre')?.addEventListener('click', () => {
    state.sortMode = 'genre';
    saveState();
    render();
  });

  document.querySelectorAll('[data-remove-friend]').forEach((button) => {
    button.addEventListener('click', () => {
      removeFriend(button.getAttribute('data-remove-friend'));
      render();
    });
  });

  document.querySelectorAll('[data-accept-request]').forEach((button) => {
    button.addEventListener('click', () => {
      acceptFriendRequest(button.getAttribute('data-accept-request'));
      render();
    });
  });

  document.querySelectorAll('[data-decline-request]').forEach((button) => {
    button.addEventListener('click', () => {
      declineFriendRequest(button.getAttribute('data-decline-request'));
      render();
    });
  });

  document.getElementById('message-form')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('message-input');
    if (sendMessage(selectedFriend, input.value)) {
      input.value = '';
    }
    render();
  });
}

function attachQuizLoader() {
  document.getElementById('openQuizBtn')?.addEventListener('click', () => {
    const container = document.getElementById('quizContent');
    if (!container) return;
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
    if (container) container.innerHTML = '';
  });
}

function render() {
  const currentUser = getCurrentUser();
  if (!currentUser) {
    renderAuthPage();
  } else {
    renderMainPage();
  }
}

const root = document.getElementById('app');
if (root) {
  loadState();
  attachQuizLoader();
  render();
}

