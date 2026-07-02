const form = document.querySelector('#login-form');
const statusEl = document.querySelector('#login-status');

if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const username = form.username.value.trim();
        const password = form.password.value.trim();
        const remember = form.remember.checked;

        if (!username || !password) {
            statusEl.textContent = 'Please enter both username and password.';
            statusEl.style.color = '#ff8a8a';
            return;
        }

        statusEl.textContent = 'Signing in...';
        statusEl.style.color = '#a6d69d';

        window.setTimeout(() => {
            statusEl.textContent = `Welcome back, ${username}!`;
            statusEl.style.color = '#9ff535';
        }, 700);

        console.log('Login attempt', { username, remember });
    });
}
