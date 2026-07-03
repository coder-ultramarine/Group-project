
const STORAGE_KEY = 'keam-library-state-v1';

const initialUsers = [
  {
    username: 'player1',
    password: 'steam123',
    games: [
      { id: 'g1', title: 'Portal 2', genre: 'Puzzle', year: 2011, status: 'Installed' },
      { id: 'g2', title: 'Hades', genre: 'Action', year: 2020, status: 'Played' },
      { id: 'g3', title: 'Cyberpunk 2077', genre: 'RPG', year: 2020, status: 'Installed' }
    ],
    friends: ['friend42', 'gamer22'],
    messages: {},
    incomingRequests: [],
    outgoingRequests: []
  },
  {
    username: 'friend42',
    password: 'friendpass',
    games: [
      { id: 'g4', title: 'Half-Life 2', genre: 'Shooter', year: 2004, status: 'Installed' },
      { id: 'g5', title: 'Terraria', genre: 'Adventure', year: 2011, status: 'Wishlist' }
    ],
    friends: ['player1'],
    messages: {},
    incomingRequests: [],
    outgoingRequests: []
  },
  {
    username: 'gamer22',
    password: 'letsgame',
    games: [
      { id: 'g6', title: 'Stardew Valley', genre: 'Simulation', year: 2016, status: 'Played' },
      { id: 'g7', title: 'The Witcher 3', genre: 'RPG', year: 2015, status: 'Installed' }
    ],
    friends: ['player1'],
    messages: {},
    incomingRequests: [],
    outgoingRequests: []
  }
];

const state = {
  users: [],
  currentUserName: null,
  selectedFriend: null,
  authMode: 'login',
  notice: null,
  searchTerm: '',
  newMessage: ''
};

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
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      state.users = parsed.users || [];
      state.currentUserName = parsed.currentUserName || null;
      state.selectedFriend = parsed.selectedFriend || null;
    } catch {
      state.users = [];
      state.currentUserName = null;
      state.selectedFriend = null;
    }
  } else {
    state.users = initialUsers.map((user) => ({ ...user }));
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({
    users: state.users,
    currentUserName: state.currentUserName,
    selectedFriend: state.selectedFriend
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

function loadQuizPage() {
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
}

function closeQuizPage() {
  const container = document.getElementById('quizContent');
  if (container) container.innerHTML = '';
}

function attachQuizLoader() {
  document.getElementById('openQuizBtn')?.addEventListener('click', loadQuizPage);
  document.getElementById('closeQuizBtn')?.addEventListener('click', closeQuizPage);
}

function ensureSteamGamesInLibrary(user) {
  if (!user || !Array.isArray(window.GAMES) || !window.GAMES.length) {
    return;
  }

  const existingTitles = new Set(user.games.map((game) => game.title.toLowerCase()));
  const steamGames = window.GAMES
    .filter((game) => !existingTitles.has(game.title.toLowerCase()))
    .slice(0, 24)
    .map((game, index) => ({
      id: `steam-${index + 1}`,
      title: game.title,
      genre: (game.genres || []).slice(0, 2).join(', '),
      year: game.releaseYear || 2020,
      status: 'Installed'
    }));

  if (steamGames.length) {
    user.games = [...steamGames, ...user.games];
    saveState();
  }
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
    year: Number(cleanedYear),
    status: 'Installed'
  });

  saveState();
  setNotice(`Added ${cleanedTitle} to your library.`, false);
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

function renderAuthPage() {
  const currentNotice = state.notice;
  document.getElementById('app').innerHTML = `
    <div class="auth-card">
      <div class="auth-tabs">
        <button class="btn ${state.authMode === 'login' ? 'btn-primary' : ''}" data-auth-mode="login">Login</button>
        <button class="btn ${state.authMode === 'signup' ? 'btn-primary' : ''}" data-auth-mode="signup">Create Account</button>
      </div>

      <h1>Steam-style game hub</h1>
      <p class="muted">Sign up, build your library, add friends, and chat.</p>

      ${currentNotice ? `<p class="status ${currentNotice.isError ? 'error' : 'success'}">${currentNotice.message}</p>` : ''}

      ${state.authMode === 'login' ? `
        <form id="login-form">
          <input class="input" id="login-username" type="text" placeholder="Username" required>
          <input class="input" id="login-password" type="password" placeholder="Password" required>
          <button class="btn btn-primary" type="submit">Login</button>
        </form>
      ` : `
        <form id="signup-form">
          <input class="input" id="signup-username" type="text" placeholder="Username" required>
          <input class="input" id="signup-password" type="password" placeholder="Password" required>
          <button class="btn btn-primary" type="submit">Create Account</button>
        </form>
      `}
    </div>
  `;

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
    login(username, password);
    render();
  });

  signupForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const username = document.getElementById('signup-username').value;
    const password = document.getElementById('signup-password').value;
    signUp(username, password);
    render();
  });
}

function renderMainPage() {
  const user = getCurrentUser();
  if (user) {
    ensureSteamGamesInLibrary(user);
  }

  const suggestion = getSuggestedGame();
  const filteredGames = (user?.games || []).filter((game) => {
    const term = state.searchTerm.toLowerCase();
    return !term || game.title.toLowerCase().includes(term) || game.genre.toLowerCase().includes(term);
  });
  const selectedFriend = state.selectedFriend && user?.friends.includes(state.selectedFriend) ? state.selectedFriend : null;

  document.getElementById('app').innerHTML = `
    <div class="app-shell">
      <aside class="sidebar">
        <div class="brand">
          <div class="brand-badge">KE</div>
          <div>KEAM<br>Library</div>
        </div>

        <div class="sidebar-card">
          <strong>${user?.username || 'Guest'}</strong>
          <p class="muted">${user?.games.length || 0} games � ${user?.friends.length || 0} friends</p>
        </div>

        <nav class="sidebar-nav">
          <a class="nav-link" href="#library">Library</a>
          <a class="nav-link" href="#friends">Friends</a>
          <a class="nav-link" href="#chat">Chat</a>
        </nav>

        <div class="sidebar-card">
          <button class="btn btn-danger" id="logout-btn">Logout</button>
        </div>
      </aside>

      <main class="main">
        <header class="topbar">
          <div>
            <strong>Welcome back</strong>
            <div class="muted">Keep your game library organised and stay in touch with your friends.</div>
          </div>
          <div class="hero-actions">
            <a class="btn" href="#library">Browse library</a>
            <a class="btn" href="#friends">Manage friends</a>
          </div>
        </header>

        <section class="hero">
          <div class="hero-card">
            <h1>Build your next collection</h1>
            <p>Add games, search your library, and see what your friends are playing.</p>
            <div class="hero-actions" style="margin-top: 12px;">
              <a class="btn btn-primary" href="#library">Add a game</a>
              <a class="btn" href="#friends">Open friend list</a>
            </div>
          </div>
          <div class="hero-card">
            <h3>Suggested for you</h3>
            ${suggestion ? `<p><strong>${suggestion.game.title}</strong></p><p class="muted">Recommended by ${suggestion.friend} � ${suggestion.game.genre}</p>` : '<p class="muted">Add friends or games to get recommendations.</p>'}
          </div>
        </section>

        <section class="dashboard-grid">
          <div class="panel" id="library">
            <h2>Your library</h2>
            <p class="muted">Track the games you own and keep everything in one place.</p>
            <form id="game-form" class="form-row">
              <input class="input" id="game-title" type="text" placeholder="Game title">
              <input class="input" id="game-genre" type="text" placeholder="Genre">
              <input class="input" id="game-year" type="number" placeholder="Year">
              <button class="btn btn-primary" type="submit">Add game</button>
            </form>
            <div class="form-row" style="margin-top: 10px;">
              <input class="input" id="search-input" type="text" placeholder="Search your library" value="${state.searchTerm}">
              <button class="btn" id="clear-search-btn" type="button">Clear</button>
            </div>
            <div class="game-list">
              ${filteredGames.length ? filteredGames.map((game) => `
                <div class="game-card">
                  <strong>${game.title}</strong>
                  <div class="meta">${game.genre} � ${game.year}</div>
                  <span class="tag">${game.status}</span>
                </div>
              `).join('') : '<div class="game-card"><strong>No games found</strong><div class="muted">Add a game to start building your collection.</div></div>'}
            </div>
          </div>

          <div class="panel" id="friends">
            <h2>Friends & requests</h2>
            <form id="friend-form" class="form-row">
              <input class="input" id="friend-name" type="text" placeholder="Add a friend">
              <button class="btn btn-primary" type="submit">Send request</button>
            </form>

            <div class="request-list">
              ${user?.incomingRequests.length ? user.incomingRequests.map((name) => `
                <div class="request-card">
                  <strong>${name}</strong>
                  <div class="request-actions">
                    <button class="btn btn-small" data-accept-request="${name}">Accept</button>
                    <button class="btn btn-small btn-danger" data-decline-request="${name}">Decline</button>
                  </div>
                </div>
              `).join('') : '<div class="request-card"><strong>No incoming requests</strong></div>'}
            </div>

            <div class="friend-list">
              ${user?.friends.length ? user.friends.map((friendName) => `
                <div class="friend-card">
                  <strong>${friendName}</strong>
                  <div class="muted">${state.users.find((entry) => entry.username === friendName)?.games.length || 0} shared games</div>
                  <div class="hero-actions" style="margin-top: 8px;">
                    <button class="btn btn-small" data-select-friend="${friendName}">Open chat</button>
                    <button class="btn btn-small btn-danger" data-remove-friend="${friendName}">Remove</button>
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
              ${(user?.messages[selectedFriend] || []).map((message) => `
                <div class="message-card ${message.sender === 'you' ? 'mine' : 'theirs'}">
                  <div>${message.text}</div>
                  <div class="muted">${message.time}</div>
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

  document.getElementById('logout-btn').addEventListener('click', logout);

  document.getElementById('game-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('game-title').value;
    const genre = document.getElementById('game-genre').value;
    const year = document.getElementById('game-year').value;
    addGame(title, genre, year);
    document.getElementById('game-form').reset();
    render();
  });

  document.getElementById('search-input').addEventListener('input', (event) => {
    state.searchTerm = event.target.value;
    render();
  });

  document.getElementById('clear-search-btn').addEventListener('click', () => {
    state.searchTerm = '';
    document.getElementById('search-input').value = '';
    render();
  });

  document.getElementById('friend-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('friend-name');
    addFriend(input.value);
    input.value = '';
    render();
  });

  document.querySelectorAll('[data-select-friend]').forEach((button) => {
    button.addEventListener('click', () => {
      state.selectedFriend = button.getAttribute('data-select-friend');
      render();
    });
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

  const messageForm = document.getElementById('message-form');
  messageForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('message-input');
    sendMessage(state.selectedFriend, input.value);
    input.value = '';
    render();
  });
}

function render() {
  loadState();
  const currentUser = getCurrentUser();
  if (!currentUser) {
    renderAuthPage();
  } else {
    renderMainPage();
  }
}

attachQuizLoader();
render();
  }}
