class SteamUser {
  constructor() {
    this.storageKey = 'steam-users';
    this.currentUserKey = 'steam-current-user';
    this.users = this.loadUsers();
    this.currentUser = this.loadCurrentUser();
  }

  loadUsers() {
    try {
      return (JSON.parse(localStorage.getItem(this.storageKey)) || []).map(user => ({
        username: user.username,
        password: user.password,
        friends: user.friends || [],
        messages: user.messages || {},
        incomingRequests: user.incomingRequests || [],
        outgoingRequests: user.outgoingRequests || []
      }));
    } catch {
      return [];
    }
  }

  saveUsers() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.users));
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

  signUp(username, password) {
    const cleanName = username.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName || !cleanPassword) {
      return { success: false, message: 'Please write a username and password.' };
    }

    if (this.users.some(user => user.username === cleanName)) {
      return { success: false, message: 'That username already exists.' };
    }

    const newUser = {
      username: cleanName,
      password: cleanPassword,
      friends: [],
      messages: {},
      incomingRequests: [],
      outgoingRequests: []
    };

    this.users.push(newUser);
    this.currentUser = newUser;
    this.saveUsers();
    this.saveCurrentUser(newUser);

    return { success: true, message: `Welcome, ${cleanName}!`, user: newUser };
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
    return { success: true, message: `You are logged in as ${user.username}.`, user };
  }

  logout() {
    this.currentUser = null;
    this.saveCurrentUser(null);
    return { success: true, message: 'You logged out.' };
  }

  addFriend(friendName) {
    const cleanName = friendName.trim();

    if (!cleanName) {
      return { success: false, message: 'Please write a friend name.' };
    }

    if (!this.currentUser) {
      return { success: false, message: 'Please log in first.' };
    }

    const targetUser = this.users.find(user => user.username === cleanName);
    if (!targetUser) {
      return { success: false, message: 'That user does not exist.' };
    }

    if (this.currentUser.friends.includes(cleanName)) {
      return { success: false, message: 'This friend is already in your list.' };
    }

    if (this.currentUser.outgoingRequests.includes(cleanName)) {
      return { success: false, message: 'A request is already waiting for this user.' };
    }

    this.currentUser.outgoingRequests.push(cleanName);
    targetUser.incomingRequests.push(this.currentUser.username);
    this.saveUsers();
    this.saveCurrentUser(this.currentUser);

    return { success: true, message: `Friend request sent to ${cleanName}.` };
  }

  acceptFriendRequest(friendName) {
    const requester = this.users.find(user => user.username === friendName);
    if (!requester) {
      return { success: false, message: 'That user does not exist.' };
    }

    this.currentUser.incomingRequests = this.currentUser.incomingRequests.filter(name => name !== friendName);
    requester.outgoingRequests = requester.outgoingRequests.filter(name => name !== this.currentUser.username);

    if (!this.currentUser.friends.includes(friendName)) {
      this.currentUser.friends.push(friendName);
    }

    if (!requester.friends.includes(this.currentUser.username)) {
      requester.friends.push(this.currentUser.username);
    }

    this.currentUser.messages[friendName] = this.currentUser.messages[friendName] || [];
    requester.messages[this.currentUser.username] = requester.messages[this.currentUser.username] || [];

    this.saveUsers();
    this.saveCurrentUser(this.currentUser);
    return { success: true, message: `You are now friends with ${friendName}.` };
  }

  declineFriendRequest(friendName) {
    const requester = this.users.find(user => user.username === friendName);
    if (!requester) {
      return { success: false, message: 'That user does not exist.' };
    }

    this.currentUser.incomingRequests = this.currentUser.incomingRequests.filter(name => name !== friendName);
    requester.outgoingRequests = requester.outgoingRequests.filter(name => name !== this.currentUser.username);

    this.saveUsers();
    this.saveCurrentUser(this.currentUser);
    return { success: true, message: `Friend request from ${friendName} declined.` };
  }

  removeFriend(friendName) {
    this.currentUser.friends = this.currentUser.friends.filter(name => name !== friendName);
    delete this.currentUser.messages[friendName];
    this.saveUsers();
    this.saveCurrentUser(this.currentUser);
    return { success: true, message: `${friendName} removed from your friends list.` };
  }

  sendMessage(friendName, messageText) {
    const cleanFriend = friendName.trim();
    const cleanMessage = messageText.trim();

    if (!this.currentUser) {
      return { success: false, message: 'Please log in first.' };
    }

    if (!cleanFriend || !this.currentUser.friends.includes(cleanFriend)) {
      return { success: false, message: 'Select a valid friend first.' };
    }

    if (!cleanMessage) {
      return { success: false, message: 'Please write a message.' };
    }

    const recipientUser = this.users.find(user => user.username === cleanFriend);
    if (!recipientUser) {
      return { success: false, message: 'That friend could not be found.' };
    }

    const time = new Date().toLocaleTimeString();

    this.currentUser.messages[cleanFriend] = this.currentUser.messages[cleanFriend] || [];
    this.currentUser.messages[cleanFriend].push({ sender: 'you', text: cleanMessage, time });

    recipientUser.messages[this.currentUser.username] = recipientUser.messages[this.currentUser.username] || [];
    recipientUser.messages[this.currentUser.username].push({ sender: 'friend', text: cleanMessage, time });

    this.saveUsers();
    this.saveCurrentUser(this.currentUser);
    return { success: true, message: 'Message sent.' };
  }

  getAvailableUsers() {
    if (!this.currentUser) return [];

    return this.users
      .filter(user => user.username !== this.currentUser.username)
      .filter(user => !this.currentUser.friends.includes(user.username))
      .filter(user => !this.currentUser.outgoingRequests.includes(user.username))
      .filter(user => !this.currentUser.incomingRequests.includes(user.username))
      .map(user => user.username);
  }

  getCurrentUser() {
    return this.currentUser;
  }
}

class SteamApp {
  constructor() {
    this.app = document.getElementById('app');
    this.auth = new SteamUser();
    this.selectedFriend = null;
    this.render();
  }

  randomButtonStyle() {
    const y = Math.random() > 0.5 ? 'top' : 'bottom';
    const x = Math.random() > 0.5 ? 'left' : 'right';
    const yValue = Math.floor(Math.random() * 70) + 5;
    const xValue = Math.floor(Math.random() * 70) + 5;
    const rotate = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 35) + 5);
    const scale = (0.9 + Math.random() * 0.6).toFixed(2);
    const padding = Math.floor(Math.random() * 6) + 8;
    const fontSize = Math.floor(Math.random() * 5) + 12;

    return `${y}:${yValue}%; ${x}:${xValue}%; transform: rotate(${rotate}deg) scale(${scale}); padding:${padding}px ${padding + 4}px; font-size:${fontSize}px;`;
  }

  randomTextStyle() {
    const rotate = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 20) + 3);
    const scale = (0.95 + Math.random() * 0.35).toFixed(2);
    const fontSize = Math.floor(Math.random() * 7) + 14;
    return `transform: rotate(${rotate}deg) scale(${scale}); font-size:${fontSize}px; display:inline-block;`;
  }

  randomInputStyle() {
    const rotate = (Math.random() > 0.5 ? 1 : -1) * (Math.floor(Math.random() * 10) + 2);
    const scale = (0.95 + Math.random() * 0.2).toFixed(2);
    const width = Math.floor(Math.random() * 80) + 140;
    return `transform: rotate(${rotate}deg) scale(${scale}); width:${width}px; max-width:100%;`;
  }

  render() {
    const currentUser = this.auth.getCurrentUser();

    if (!currentUser) {
      this.app.innerHTML = this.buildLoginPage();
      this.bindLoginEvents();
      return;
    }

    this.app.innerHTML = this.buildMainPage(currentUser);
    this.bindMainEvents();
  }

  buildLoginPage() {
    return `
      <div class="panel">
        <h1 style="${this.randomTextStyle()}">Steam-like App</h1>
        <p style="${this.randomTextStyle()}">Make an account and talk to your friends.</p>

        <div class="controls">
          <button class="btn floating-btn" style="${this.randomButtonStyle()}" id="show-signup">Sign Up</button>
          <button class="btn floating-btn" style="${this.randomButtonStyle()}" id="show-login">Login</button>
        </div>

        <form id="signup-form" class="auth-form">
          <h2>Create an account</h2>
          <input type="text" id="signup-username" placeholder="Username" style="${this.randomInputStyle()}" />
          <input type="password" id="signup-password" placeholder="Password" style="${this.randomInputStyle()}" />
          <button class="btn" type="submit" style="${this.randomButtonStyle()}">Create Account</button>
        </form>

        <form id="login-form" class="auth-form hidden">
          <h2>Login</h2>
          <input type="text" id="login-username" placeholder="Username" style="${this.randomInputStyle()}" />
          <input type="password" id="login-password" placeholder="Password" style="${this.randomInputStyle()}" />
          <button class="btn" type="submit" style="${this.randomButtonStyle()}">Login</button>
        </form>
      </div>
    `;
  }

  buildMainPage(user) {
    return `
      <div class="panel">
        <h1 style="${this.randomTextStyle()}">Friends and Chat</h1>
        <p style="${this.randomTextStyle()}">Hello ${user.username}</p>

        <div class="controls">
          <button class="btn floating-btn danger" style="${this.randomButtonStyle()}" id="logout-btn">Logout</button>
        </div>

        <div class="section">
          <h2>Friends</h2>

          <form id="add-friend-form" class="auth-form">
            <input type="text" id="friend-name" placeholder="Add a friend" style="${this.randomInputStyle()}" />
            <button class="btn" type="submit" style="${this.randomButtonStyle()}">Add Friend</button>
          </form>

          <div class="friends-layout">
            <div class="friends-list">
              <h3>Friends</h3>
              ${this.buildFriendList(user)}
            </div>

            <div class="chat-panel">
              <h3>Requests</h3>
              ${this.buildRequests(user)}
              ${this.buildChatArea(user)}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  buildFriendList(user) {
    const friends = user.friends || [];
    if (!friends.length) return '<p>No friends yet.</p>';

    return friends.map(friend => `
      <div class="friend-row">
        <button class="friend-button ${friend === this.selectedFriend ? 'active' : ''}" data-select-friend="${friend}">${friend}</button>
        <button class="btn small danger" data-remove-friend="${friend}">Remove</button>
      </div>
    `).join('');
  }

  buildRequests(user) {
    const incoming = user.incomingRequests || [];
    const outgoing = user.outgoingRequests || [];
    const available = this.auth.getAvailableUsers();

    return `
      <div class="request-block">
        <strong>Incoming</strong>
        ${incoming.length ? incoming.map(name => `
          <div class="request-item">
            <span>${name}</span>
            <div class="request-actions">
              <button class="btn small" data-accept-request="${name}">Accept</button>
              <button class="btn small danger" data-decline-request="${name}">Decline</button>
            </div>
          </div>
        `).join('') : '<p>No incoming requests.</p>'}
      </div>

      <div class="request-block">
        <strong>Outgoing</strong>
        ${outgoing.length ? outgoing.map(name => `
          <div class="request-item">
            <span>${name}</span>
            <small>Pending</small>
          </div>
        `).join('') : '<p>No outgoing requests.</p>'}
      </div>

      <div class="request-block">
        <strong>Available Friends</strong>
        ${available.length ? available.map(name => `
          <div class="request-item">
            <span>${name}</span>
            <button class="btn small" data-request-friend="${name}">Send Request</button>
          </div>
        `).join('') : '<p>No available friends.</p>'}
      </div>
    `;
  }

  buildChatArea(user) {
    const friends = user.friends || [];
    const selectedFriend = this.selectedFriend && friends.includes(this.selectedFriend) ? this.selectedFriend : friends[0] || null;

    if (selectedFriend && this.selectedFriend !== selectedFriend) {
      this.selectedFriend = selectedFriend;
    }

    if (!selectedFriend) {
      return '<p>Select a friend to chat.</p>';
    }

    return `
      <h3>${selectedFriend}</h3>
      <div class="messages">
        ${(user.messages[selectedFriend] || []).map(message => `
          <div class="message ${message.sender === 'you' ? 'mine' : 'theirs'}">
            <span>${message.text}</span>
            <small>${message.time}</small>
          </div>
        `).join('')}
      </div>
      <form id="message-form" class="auth-form">
        <input type="text" id="message-text" placeholder="Send a message" style="${this.randomInputStyle()}" />
        <button class="btn" type="submit" style="${this.randomButtonStyle()}">Send</button>
      </form>
    `;
  }

  bindLoginEvents() {
    document.getElementById('show-signup').addEventListener('click', () => {
      document.getElementById('signup-form').classList.remove('hidden');
      document.getElementById('login-form').classList.add('hidden');
    });

    document.getElementById('show-login').addEventListener('click', () => {
      document.getElementById('login-form').classList.remove('hidden');
      document.getElementById('signup-form').classList.add('hidden');
    });

    document.getElementById('signup-form').addEventListener('submit', event => {
      event.preventDefault();
      const username = document.getElementById('signup-username').value;
      const password = document.getElementById('signup-password').value;
      const result = this.auth.signUp(username, password);
      alert(result.message);
      if (result.success) this.render();
    });

    document.getElementById('login-form').addEventListener('submit', event => {
      event.preventDefault();
      const username = document.getElementById('login-username').value;
      const password = document.getElementById('login-password').value;
      const result = this.auth.login(username, password);
      alert(result.message);
      if (result.success) this.render();
    });
  }

  bindMainEvents() {
    document.getElementById('logout-btn').addEventListener('click', () => {
      this.auth.logout();
      this.render();
    });

    document.getElementById('add-friend-form').addEventListener('submit', event => {
      event.preventDefault();
      const input = document.getElementById('friend-name');
      const result = this.auth.addFriend(input.value);
      alert(result.message);
      input.value = '';
      this.render();
    });

    document.querySelectorAll('[data-select-friend]').forEach(button => {
      button.addEventListener('click', () => {
        this.selectedFriend = button.getAttribute('data-select-friend');
        this.render();
      });
    });

    document.querySelectorAll('[data-remove-friend]').forEach(button => {
      button.addEventListener('click', () => {
        const friendName = button.getAttribute('data-remove-friend');
        const result = this.auth.removeFriend(friendName);
        alert(result.message);
        this.render();
      });
    });

    document.querySelectorAll('[data-accept-request]').forEach(button => {
      button.addEventListener('click', () => {
        const friendName = button.getAttribute('data-accept-request');
        const result = this.auth.acceptFriendRequest(friendName);
        alert(result.message);
        this.selectedFriend = friendName;
        this.render();
      });
    });

    document.querySelectorAll('[data-decline-request]').forEach(button => {
      button.addEventListener('click', () => {
        const friendName = button.getAttribute('data-decline-request');
        const result = this.auth.declineFriendRequest(friendName);
        alert(result.message);
        this.render();
      });
    });

    document.querySelectorAll('[data-request-friend]').forEach(button => {
      button.addEventListener('click', () => {
        const friendName = button.getAttribute('data-request-friend');
        const result = this.auth.addFriend(friendName);
        alert(result.message);
        this.render();
      });
    });

    const messageForm = document.getElementById('message-form');
    if (messageForm) {
      messageForm.addEventListener('submit', event => {
        event.preventDefault();
        const input = document.getElementById('message-text');
        const result = this.auth.sendMessage(this.selectedFriend, input.value);
        alert(result.message);
        input.value = '';
        this.render();
      });
    }
  }
}

new SteamApp();
