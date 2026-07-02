class GameLibraryApp {
  constructor(root) {
    this.root = root;
    this.userStorageKey = 'game-library-users';
    this.currentUserKey = 'game-library-current-user';
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
    this.games = [
      { title: 'The Witcher 3', genre: 'RPG' },
      { title: 'Hades', genre: 'Action' },
      { title: 'Portal 2', genre: 'Puzzle' },
      { title: 'Celeste', genre: 'Platformer' },
      { title: 'Minecraft', genre: 'Sandbox' },
      { title: 'Stardew Valley', genre: 'Simulation' },
      { title: 'Baldur\'s Gate 3', genre: 'RPG' },
      { title: 'Hollow Knight', genre: 'Metroidvania' }
    ];
    this.searchTerm = '';
    this.render();
  }

  loadUsers() {
    try {
      return JSON.parse(localStorage.getItem(this.userStorageKey)) || [];
    } catch {
      return [];
    }
  }

  saveUsers() {
    localStorage.setItem(this.userStorageKey, JSON.stringify(this.users));
  }

  saveCurrentUser(user) {
    if (user) {
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.currentUserKey);
    }
  }

  loadCurrentUser() {
    try {
      const savedUser = JSON.parse(localStorage.getItem(this.currentUserKey));
      if (!savedUser) return null;
      return this.users.find(user => user.username === savedUser.username) || null;
    } catch {
      return null;
    }
  }

  signIn(username, password) {
    const cleanName = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanPassword) {
      return { success: false, message: 'Please enter a username and password.' };
    }

    if (this.users.some(user => user.username === cleanName)) {
      return { success: false, message: 'That username already exists.' };
    }

    const newUser = { username: cleanName, password: cleanPassword };
    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveUsers();
    this.saveCurrentUser(newUser);
    return { success: true, message: `Welcome, ${cleanName}!` };
  }

  login(username, password) {
    const cleanName = username.trim().toLowerCase();
    const cleanPassword = password.trim();
    const user = this.users.find(item => item.username === cleanName && item.password === cleanPassword);

    if (!user) {
      return { success: false, message: 'Wrong username or password.' };
    }

    this.currentUser = user;
    this.saveCurrentUser(user);
    return { success: true, message: `Logged in as ${user.username}.` };
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser(null);
    return { success: true, message: 'You logged out.' };
  }

  getFilteredGames() {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) return this.games;

    return this.games.filter(game => {
      return game.title.toLowerCase().includes(term) || game.genre.toLowerCase().includes(term);
    });
  }

  render() {
    if (!this.root) return;

    if (!this.currentUser) {
      this.root.innerHTML = this.buildAuthPage();
      this.bindAuthEvents();
      return;
    }

    this.root.innerHTML = this.buildLibraryPage();
    this.bindLibraryEvents();
  }

  buildAuthPage() {
    return `
      <div style="max-width: 460px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; background: #111; color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        <h1 style="margin-top:0;">Game Hub</h1>
        <p style="color:#bbb;">Choose sign in or log in to browse the game library.</p>

        <div style="display:flex; gap:10px; margin-bottom: 16px;">
          <button type="button" id="show-signin" style="flex:1; padding:10px; border:none; border-radius:8px; background:#8b5cf6; color:white; cursor:pointer;">Sign In</button>
          <button type="button" id="show-login" style="flex:1; padding:10px; border:none; border-radius:8px; background:#22c55e; color:white; cursor:pointer;">Log In</button>
        </div>

        <form id="signin-form" style="margin-bottom: 20px;">
          <h2>Sign In</h2>
          <input id="signin-username" type="text" placeholder="Username" style="display:block; width:100%; margin:8px 0; padding:10px; border-radius:8px; border:1px solid #444;" />
          <input id="signin-password" type="password" placeholder="Password" style="display:block; width:100%; margin:8px 0; padding:10px; border-radius:8px; border:1px solid #444;" />
          <button type="submit" style="width:100%; padding:10px; border:none; border-radius:8px; background:#8b5cf6; color:white; cursor:pointer;">Create Account</button>
        </form>

        <form id="login-form" style="display:none;">
          <h2>Log In</h2>
          <input id="login-username" type="text" placeholder="Username" style="display:block; width:100%; margin:8px 0; padding:10px; border-radius:8px; border:1px solid #444;" />
          <input id="login-password" type="password" placeholder="Password" style="display:block; width:100%; margin:8px 0; padding:10px; border-radius:8px; border:1px solid #444;" />
          <button type="submit" style="width:100%; padding:10px; border:none; border-radius:8px; background:#22c55e; color:white; cursor:pointer;">Log In</button>
        </form>
        <p id="auth-message" style="margin-top: 16px; color:#fbbf24;"></p>
      </div>
    `;
  }

  buildLibraryPage() {
    const games = this.getFilteredGames();

    return `
      <div style="max-width: 760px; margin: 40px auto; padding: 24px; font-family: Arial, sans-serif; background: #111; color: white; border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.3);">
        <div style="display:flex; justify-content:space-between; align-items:center; gap:12px; margin-bottom: 16px;">
          <div>
            <h1 style="margin:0;">Welcome, ${this.currentUser.username}</h1>
            <p style="margin:4px 0 0; color:#bbb;">Search the game library below.</p>
          </div>
          <button id="logout-btn" style="padding:10px 14px; border:none; border-radius:8px; background:#ef4444; color:white; cursor:pointer;">Log Out</button>
        </div>

        <input id="game-search" type="text" placeholder="Search games..." value="${this.searchTerm}" style="width:100%; padding:10px; border-radius:8px; border:1px solid #444; margin-bottom: 16px;" />

        <div style="display:grid; gap:10px;">
          ${games.length ? games.map(game => `
            <div style="padding:12px 14px; border:1px solid #2a2a2a; border-radius:10px; background:#1a1a1a;">
              <strong>${game.title}</strong>
              <div style="color:#aaa; font-size: 14px; margin-top: 4px;">Genre: ${game.genre}</div>
            </div>
          `).join('') : '<p style="color:#bbb;">No games found.</p>'}
        </div>
      </div>
    `;
  }

  bindAuthEvents() {
    const signinForm = document.getElementById('signin-form');
    const loginForm = document.getElementById('login-form');
    const authMessage = document.getElementById('auth-message');
    const showSigninBtn = document.getElementById('show-signin');
    const showLoginBtn = document.getElementById('show-login');

    showSigninBtn.addEventListener('click', () => {
      signinForm.style.display = 'block';
      loginForm.style.display = 'none';
    });

    showLoginBtn.addEventListener('click', () => {
      signinForm.style.display = 'none';
      loginForm.style.display = 'block';
    });

    signinForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = document.getElementById('signin-username').value;
      const password = document.getElementById('signin-password').value;
      const result = this.signIn(username, password);
      authMessage.textContent = result.message;
      if (result.success) this.render();
    });

    loginForm.addEventListener('submit', event => {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const result = this.login(username, password);
      authMessage.textContent = result.message;
      if (result.success) this.render();
    });
  }

  bindLibraryEvents() {
    const logoutBtn = document.getElementById('logout-btn');
    const searchInput = document.getElementById('game-search');

    logoutBtn.addEventListener('click', () => {
      this.logout();
      this.render();
    });

    searchInput.addEventListener('input', event => {
      this.searchTerm = event.target.value;
      this.render();
    });
  }
}

const root = document.getElementById('app');
if (root) {
  new GameLibraryApp(root);
}
