/**
 * RetroScroll Infinite - Main Application Logic
 * By Gemini, 2025
 */

// --- GAME MODULES (Mocks/Stubs) ---
// In a real project, these would be in separate files like /games/flappy-cat.js
// and dynamically imported. For this prototype, they are included here for simplicity.

const Games = {
    'flappy-cat': {
        initGame(container, onScore, onEnd) {
            container.innerHTML = `
                <div style="color:white; text-align:center; padding: 2rem; font-family:var(--font-pixel);">
                    <h2>Flappy Cat!</h2>
                    <p>Press SPACE to flap. Avoid pipes.</p>
                    <p>This is a mock game. Click to get points!</p>
                    <button id="flappy-score-btn" class="play-button">Get 1200 Score</button>
                </div>`;
            const btn = container.querySelector('#flappy-score-btn');
            btn.onclick = () => {
                onScore(1200);
                onEnd();
                alert('You got 1200 points! +12 XP');
            };
            this.destroy = () => { btn.onclick = null; };
        },
        destroyGame() { if(this.destroy) this.destroy(); }
    },
    'pixel-maze': {
        initGame(container, onScore, onEnd) {
            container.innerHTML = `<div style="color:white; text-align:center; padding: 2rem; font-family:var(--font-pixel);"><h2>Pixel Maze</h2><p>Mock Pac-Man clone. Use arrow keys.</p><button id="maze-score-btn" class="play-button">Get 5000 Score</button></div>`;
            const btn = container.querySelector('#maze-score-btn');
            btn.onclick = () => {
                onScore(5000);
                onEnd();
                alert('You got 5000 points! +50 XP');
            };
            this.destroy = () => { btn.onclick = null; };
        },
        destroyGame() { if(this.destroy) this.destroy(); }
    },
    'dino-run': {
        initGame(container, onScore, onEnd) {
            container.innerHTML = `<div style="color:white; text-align:center; padding: 2rem; font-family:var(--font-pixel);"><h2>Dino Run</h2><p>Mock Dino runner. Press UP to jump.</p><button id="dino-score-btn" class="play-button">Get 850 Score</button></div>`;
             const btn = container.querySelector('#dino-score-btn');
            btn.onclick = () => {
                onScore(850);
                onEnd();
                alert('You got 850 points! +8 XP');
            };
            this.destroy = () => { btn.onclick = null; };
        },
        destroyGame() { if(this.destroy) this.destroy(); }
    },
    'num-crunch': {
        initGame(container, onScore, onEnd) {
            container.innerHTML = `<div style="color:white; text-align:center; padding: 2rem; font-family:var(--font-pixel);"><h2>Number Crunchers</h2><p>Mock math game. Solve 5 + 3.</p><button id="num-score-btn" class="play-button">Get 2500 Score</button></div>`;
            const btn = container.querySelector('#num-score-btn');
            btn.onclick = () => {
                onScore(2500);
                onEnd();
                alert('You got 2500 points! +25 XP');
            };
            this.destroy = () => { btn.onclick = null; };
        },
        destroyGame() { if(this.destroy) this.destroy(); }
    }
};

// --- MAIN APP MODULE ---
const App = (() => {
    // --- STATE MANAGEMENT ---
    let state = {
        user: {
            username: 'PixelSurfer',
            avatar: 0,
            visits: 1,
            lastVisit: new Date().toISOString().split('T')[0],
            streak: 1,
            totalDistance: 0,
            level: 1,
            xp: 0,
        },
        preferences: {
            theme: 'retro',
            sound: true,
        },
        games: {
            // 'game-id': { plays: 0, highScore: 0, xpEarned: 0 }
        },
        feedPage: 0,
        isLoading: false,
        showDebug: false,
    };
    
    const XP_PER_LEVEL = 100;

    const DOM = {}; // To store frequently accessed DOM elements

    // --- MOCK API ---
    const API = {
        async fetchContent(page) {
            console.log(`Fetching content for page ${page}...`);
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay

            const contentTypes = ['fact', 'highlight', 'image', 'ai', 'quote', 'game'];
            const items = [];
            for (let i = 0; i < 10; i++) {
                const type = contentTypes[Math.floor(Math.random() * contentTypes.length)];
                const id = `item-${page}-${i}`;
                let item;
                switch (type) {
                    case 'fact': item = { id, type, title: 'Tiny Fact', content: 'The blob of toothpaste on your toothbrush has a name: a nurdle.' }; break;
                    case 'highlight': item = { id, type, title: 'Human Feat', content: 'Alex Honnold free soloed El Capitan, climbing 3,000 feet without ropes.' }; break;
                    case 'image': item = { id, type, title: 'Striking Photo', imageUrl: `https://picsum.photos/seed/${id}/400/300`, alt: 'A random vibrant image' }; break;
                    case 'ai': item = { id, type, title: 'AI Tidbit', content: 'An AI wrote this fun fact: a group of flamingos is called a flamboyance.' }; break;
                    case 'quote': item = { id, type, content: 'The best way to predict the future is to invent it.', author: 'Alan Kay' }; break;
                    case 'game': item = {id, type, gameId: 'flappy-cat', title: 'Mini-Game!', description: 'Try your luck at Flappy Cat!'}; break;
                }
                items.push(item);
                
                // Interleave ads
                if (i === 4) {
                    items.push({ id: `ad-${page}`, type: 'ad', title: 'Sponsored Message', content: 'Drink RetroCola! The taste of the 90s in a can. Now with more pixels.', link: '#' });
                }
            }
            return items;
        },
        async fetchGameList() {
            return [
                { id: 'flappy-cat', name: 'Flappy Cat', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%2387CEEB"/%3E%3Crect x="12" y="12" width="8" height="8" fill="%23FFD700"/%3E%3Crect x="20" y="14" width="4" height="4" fill="white"/%3E%3Crect x="22" y="16" width="2" height="2" fill="black"/%3E%3Cpath d="M12 20h8v2h-8z" fill="%23FFA500"/%3E%3C/svg%3E' },
                { id: 'pixel-maze', name: 'Pixel Maze', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="black"/%3E%3Cpath d="M4 4h24v24H4z" fill="%230000FF"/%3E%3Ccircle cx="16" cy="16" r="6" fill="%23FFFF00"/%3E%3C/svg%3E' },
                { id: 'dino-run', name: 'Dino Run', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%23F0F0F0"/%3E%3Cpath d="M10 16h12v2H10z" fill="gray"/%3E%3Crect x="6" y="10" width="8" height="8" fill="%232E8B57"/%3E%3C/svg%3E' },
                { id: 'num-crunch', name: 'Number Crunchers', thumbnail: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"%3E%3Crect width="32" height="32" fill="%234A00E0"/%3E%3Ctext x="8" y="24" font-family="monospace" font-size="20" fill="white"%3E5+3%3C/text%3E%3C/svg%3E' },
            ];
        }
    };

    // --- UI RENDERING & MANIPULATION ---
    const UI = {
        cacheDOM() {
            const $ = (selector) => document.querySelector(selector);
            const $$ = (selector) => document.querySelectorAll(selector);
            
            DOM.body = document.body;
            DOM.feedContainer = $('#feed-container');
            DOM.sentinel = $('#feed-sentinel');
            DOM.drawer = $('#drawer');
            DOM.drawerOverlay = $('#drawer-overlay');
            DOM.hamburger = $('#hamburger-button');
            DOM.closeDrawer = $('#close-drawer-button');
            DOM.mobileStatsBtn = $('#mobile-stats-button');
            
            // Profile
            DOM.profileAvatar = $('#profile-avatar');
            DOM.profileUsername = $('#profile-username');
            
            // Stats
            DOM.stats = {
                visits: $('#stats-visits'),
                streak: $('#stats-streak'),
                distance: $('#stats-distance'),
                level: $('#stats-level'),
                xp: $('#stats-xp'),
                xpBar: $('#xp-bar-progress'),
            };

            // Chip
            DOM.statusChip = $('#status-chip');
            DOM.chip = {
                level: $('#chip-level'),
                xp: $('#chip-xp'),
                streak: $('#chip-streak'),
            };

            // Preferences
            DOM.themeToggle = $('#theme-toggle');
            DOM.soundToggle = $('#sound-toggle');
            DOM.resetButton = $('#reset-button');

            // Navigation
            DOM.navButtons = $$('.nav-button');
            DOM.views = $$('.view');

            // Games
            DOM.gamesList = $('#games-list');
            DOM.gameArena = $('#game-arena');
            DOM.gameViewport = $('#game-viewport');
            DOM.closeGameBtn = $('#close-game-button');
            DOM.gameStatsContainer = $('#game-stats-container');

            // Debug
            DOM.debugPanel = $('#debug-panel');
            DOM.debugContent = $('#debug-content');
        },

        renderCard(item) {
            const card = document.createElement('div');
            card.className = 'card pixel-border';
            card.dataset.type = item.type;
            
            let contentHTML = '';
            switch (item.type) {
                case 'fact':
                case 'highlight':
                case 'ai':
                    contentHTML = `<div class="card-content">
                        <h3 class="card-header">✦ ${item.title}</h3>
                        <p>${item.content}</p>
                    </div>`;
                    break;
                case 'image':
                    contentHTML = `
                        <img src="${item.imageUrl}" alt="${item.alt}" class="card-image" loading="lazy">
                        <div class="card-content">
                           <h3 class="card-header">${item.title}</h3>
                        </div>`;
                    break;
                case 'quote':
                     contentHTML = `<div class="card-content">
                        <p>"${item.content}"</p>
                        <footer>— ${item.author}</footer>
                    </div>`;
                    break;
                case 'ad':
                    contentHTML = `<a href="${item.link}" target="_blank" rel="noopener sponsored" class="ad-card-link">
                        <div class="card-content">
                           <h3 class="card-header">⭐ ${item.title} ⭐</h3>
                           <p>${item.content}</p>
                        </div>
                    </a>`;
                    break;
                case 'game':
                    contentHTML = `<div class="card-content">
                        <h3 class="card-header">🎮 ${item.title}</h3>
                        <p>${item.description}</p>
                        <button class="play-button" data-game-id="${item.gameId}">Play Now!</button>
                    </div>`;
                    break;
            }
            card.innerHTML = contentHTML;
            return card;
        },
        
        updateStats() {
            const { user } = state;
            DOM.stats.visits.textContent = user.visits;
            DOM.stats.streak.textContent = `${user.streak} day${user.streak === 1 ? '' : 's'} 🔥`;
            DOM.stats.distance.textContent = `${Math.round(user.totalDistance)}m`;
            DOM.stats.level.textContent = user.level;
            
            const xpForNextLevel = user.level * XP_PER_LEVEL;
            DOM.stats.xp.textContent = `${user.xp} / ${xpForNextLevel}`;
            DOM.stats.xpBar.style.width = `${(user.xp / xpForNextLevel) * 100}%`;
            
            DOM.chip.level.textContent = `Lvl ${user.level}`;
            DOM.chip.xp.textContent = `${user.xp} XP`;
            DOM.chip.streak.textContent = `🔥 ${user.streak}`;

            this.updateGameStats();
        },

        updateGameStats() {
            const gameStats = Object.entries(state.games);
            if (gameStats.length === 0) {
                DOM.gameStatsContainer.innerHTML = '<p>Play some games to see your stats here!</p>';
                return;
            }
            let html = '<ul>';
            for (const [id, data] of gameStats) {
                html += `<li>
                    <strong>${id.replace('-', ' ')}:</strong> 
                    <span>High Score: ${data.highScore}</span>
                </li>`;
            }
            html += '</ul>';
            DOM.gameStatsContainer.innerHTML = html;
        },

        updateProfile() {
            DOM.profileUsername.textContent = state.user.username;
            DOM.profileAvatar.style.backgroundImage = `url('${Identity.getAvatar(state.user.avatar)}')`;
        },

        toggleDrawer(show) {
            if (show) {
                DOM.drawer.classList.add('active');
                DOM.drawerOverlay.classList.add('active');
                DOM.hamburger.setAttribute('aria-expanded', 'true');
            } else {
                DOM.drawer.classList.remove('active');
                DOM.drawerOverlay.classList.remove('active');
                DOM.hamburger.setAttribute('aria-expanded', 'false');
            }
        },

        applyPreferences() {
            // Theme
            if (state.preferences.theme === 'chill') {
                DOM.body.classList.add('chill-theme');
                DOM.body.classList.remove('retro-theme');
                DOM.themeToggle.checked = true;
            } else {
                DOM.body.classList.remove('chill-theme');
                DOM.body.classList.add('retro-theme');
                DOM.themeToggle.checked = false;
            }
            // Sound
            DOM.soundToggle.checked = state.preferences.sound;
        },

        switchView(viewId) {
            DOM.views.forEach(v => v.classList.remove('active'));
            DOM.navButtons.forEach(b => b.classList.remove('active'));

            document.getElementById(`${viewId}-view`).classList.add('active');
            document.querySelectorAll(`[data-view="${viewId}"]`).forEach(b => b.classList.add('active'));
        },

        renderGameList(games) {
            DOM.gamesList.innerHTML = games.map(game => `
                <div class="game-preview-card pixel-border">
                    <img src="${game.thumbnail}" alt="${game.name} preview">
                    <h3>${game.name}</h3>
                    <button class="play-button" data-game-id="${game.id}">Play</button>
                </div>
            `).join('');
        },

        toggleGameArena(show) {
            if (show) {
                DOM.gameArena.classList.add('active');
            } else {
                DOM.gameArena.classList.remove('active');
                DOM.gameViewport.innerHTML = ''; // Clear viewport
            }
        },

        updateDebugPanel() {
            if (state.showDebug) {
                DOM.debugPanel.style.display = 'block';
                DOM.debugContent.textContent = JSON.stringify(state, null, 2);
            } else {
                DOM.debugPanel.style.display = 'none';
            }
        }
    };

    // --- GAMIFICATION & EFFECTS ---
    const Gamification = {
        addXp(amount) {
            state.user.xp += amount;
            
            let xpForNextLevel = state.user.level * XP_PER_LEVEL;
            while (state.user.xp >= xpForNextLevel) {
                state.user.xp -= xpForNextLevel;
                state.user.level++;
                xpForNextLevel = state.user.level * XP_PER_LEVEL;
                this.levelUp();
            }
            
            UI.updateStats();
            saveState();
        },
        
        levelUp() {
            console.log(`Level up to ${state.user.level}!`);
            Effects.playSound('levelUp');
            Effects.showConfetti();
        },
        
        updateStreak() {
            const today = new Date().toISOString().split('T')[0];
            if (state.user.lastVisit === today) return; // Already visited today

            const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
            if (state.user.lastVisit === yesterday) {
                state.user.streak++;
            } else {
                state.user.streak = 1; // Streak broken
            }

            state.user.visits++;
            state.user.lastVisit = today;
            saveState();
        },

        updateGameScore(gameId, score) {
            if (!state.games[gameId]) {
                state.games[gameId] = { plays: 0, highScore: 0, xpEarned: 0 };
            }

            const gameData = state.games[gameId];
            gameData.plays++;
            
            if (score > gameData.highScore) {
                gameData.highScore = score;
                console.log(`New high score for ${gameId}: ${score}`);
            }
            
            const xpGained = Math.floor(score / 100);
            gameData.xpEarned += xpGained;
            this.addXp(xpGained);

            UI.updateGameStats();
            saveState();
        }
    };
    
    const Effects = {
        sounds: {
            // Base64 encoded short sounds for portability
            levelUp: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(30).join('1234567890')),
            click: new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU'+Array(5).join('1234567890')),
        },

        playSound(soundName) {
            if(state.preferences.sound && this.sounds[soundName]) {
                this.sounds[soundName].currentTime = 0;
                this.sounds[soundName].play().catch(e => console.error("Sound play failed:", e));
            }
        },

        showConfetti() {
            for (let i = 0; i < 50; i++) {
                const confetti = document.createElement('div');
                confetti.className = 'confetti-particle';
                const x = Math.random() * window.innerWidth;
                const y = Math.random() * window.innerHeight;
                confetti.style.left = `${x}px`;
                confetti.style.top = `${y}px`;
                const color = ['var(--color-primary)', 'var(--color-secondary)', 'var(--color-accent)'][Math.floor(Math.random() * 3)];
                confetti.style.backgroundColor = color;
                
                DOM.body.appendChild(confetti);

                confetti.animate([
                    { transform: 'translateY(0px) scale(1)', opacity: 1 },
                    { transform: `translateY(${window.innerHeight - y}px) scale(0)`, opacity: 0 }
                ], {
                    duration: 2000 + Math.random() * 3000,
                    easing: 'ease-out'
                });

                setTimeout(() => confetti.remove(), 5000);
            }
        },

        animateCat() {
            const cat = document.getElementById('cat-sprite');
            let frame = 0;
            setInterval(() => {
                frame = (frame + 1) % 3;
                cat.style.backgroundPosition = `-${frame * 32}px 0`;
            }, 200);
        }
    };

    // --- USER IDENTITY ---
    const Identity = {
        adjectives: ['Pixel', 'Retro', 'Cyber', 'Data', 'Glitch', 'Neon', 'Cosmic', 'Quantum'],
        nouns: ['Surfer', 'Pioneer', 'Ranger', 'Knight', 'Wizard', 'Bot', 'Explorer', 'Jockey'],
        avatars: [
            // 4 different 16x16 pixel avatars as data URIs
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%232c3e50"/%3E%3Crect x="4" y="4" width="8" height="8" fill="%233498db"/%3E%3Crect x="6" y="6" width="1" height="1" fill="white"/%3E%3Crect x="9" y="6" width="1" height="1" fill="white"/%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%239b59b6"/%3E%3Crect x="3" y="3" width="10" height="10" fill="%23f1c40f"/%3E%3Crect x="5" y="5" width="2" height="2" fill="black"/%3E%3Crect x="9" y="5" width="2" height="2" fill="black"/%3E%3Crect x="4" y="10" width="8" height="1" fill="black"/%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%2316a085"/%3E%3Cpath d="M8 2L2 8h12L8 2z" fill="%232ecc71"/%3E%3Crect y="8" width="16" height="6" fill="%2327ae60"/%3E%3C/svg%3E',
            'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"%3E%3Crect width="16" height="16" fill="%23e74c3c"/%3E%3Ccircle cx="8" cy="8" r="5" fill="%23c0392b"/%3E%3Ccircle cx="8" cy="8" r="2" fill="%23f1c40f"/%3E%3C/svg%3E',
        ],
        
        generate() {
            const adj = this.adjectives[Math.floor(Math.random() * this.adjectives.length)];
            const noun = this.nouns[Math.floor(Math.random() * this.nouns.length)];
            const num = Math.floor(Math.random() * 100);
            state.user.username = `${adj}${noun}${num}`;
            state.user.avatar = Math.floor(Math.random() * this.avatars.length);
        },

        getAvatar(index) {
            return this.avatars[index % this.avatars.length];
        }
    };
    
    // --- EVENT HANDLERS ---
    function bindEvents() {
        // Infinite scroll
        const observer = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && !state.isLoading) {
                loadMoreContent();
            }
        }, { rootMargin: '500px' });
        observer.observe(DOM.sentinel);

        // Drawer toggle
        DOM.hamburger.addEventListener('click', () => UI.toggleDrawer(true));
        DOM.mobileStatsBtn.addEventListener('click', () => UI.toggleDrawer(true));
        DOM.closeDrawer.addEventListener('click', () => UI.toggleDrawer(false));
        DOM.drawerOverlay.addEventListener('click', () => UI.toggleDrawer(false));

        // Preferences
        DOM.themeToggle.addEventListener('change', (e) => {
            state.preferences.theme = e.target.checked ? 'chill' : 'retro';
            UI.applyPreferences();
            saveState();
        });
        DOM.soundToggle.addEventListener('change', (e) => {
            state.preferences.sound = e.target.checked;
            saveState();
        });
        DOM.resetButton.addEventListener('click', handleReset);
        
        // Scroll tracking for distance
        let lastScrollY = window.scrollY;
        window.addEventListener('scroll', () => {
            const distance = Math.abs(window.scrollY - lastScrollY) / 100; // rough meters
            state.user.totalDistance += distance;
            lastScrollY = window.scrollY;
            if (Math.random() < 0.01) { // Save occasionally
                UI.updateStats();
                saveState();
            }
        }, { passive: true });

        // Navigation
        DOM.navButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const viewId = e.currentTarget.dataset.view;
                if (viewId) UI.switchView(viewId);
            });
        });

        // Game launching
        document.body.addEventListener('click', e => {
            const playButton = e.target.closest('.play-button[data-game-id]');
            if (playButton) {
                const gameId = playButton.dataset.gameId;
                launchGame(gameId);
            }
        });
        DOM.closeGameBtn.addEventListener('click', () => {
            GameEngine.endCurrentGame();
        });

        // Keyboard shortcuts
        window.addEventListener('keydown', e => {
            if (e.key === 'g' && !e.metaKey && !e.ctrlKey) UI.switchView('games');
            if (e.key === 'f' && !e.metaKey && !e.ctrlKey) UI.switchView('feed');
            if (e.key === 'Escape' && DOM.drawer.classList.contains('active')) UI.toggleDrawer(false);
            if (e.key === 'Escape' && DOM.gameArena.classList.contains('active')) GameEngine.endCurrentGame();
            if (e.key === 'd' && e.ctrlKey) { // Ctrl+D for debug
                e.preventDefault();
                state.showDebug = !state.showDebug;
                UI.updateDebugPanel();
            }
        });
    }

    // --- GAME ENGINE ---
    const GameEngine = {
        currentGame: null,
        
        async launch(gameId) {
            if (this.currentGame) return; // Don't launch if one is running
            
            console.log(`Launching game: ${gameId}`);
            UI.toggleGameArena(true);

            // In a real app: const gameModule = await import(`./games/${gameId}.js`);
            // For prototype:
            const gameModule = Games[gameId];

            if (gameModule) {
                this.currentGame = { id: gameId, module: gameModule };
                gameModule.initGame(
                    DOM.gameViewport, 
                    (score) => Gamification.updateGameScore(gameId, score),
                    () => this.endCurrentGame()
                );
            } else {
                console.error(`Game module for ${gameId} not found.`);
                this.endCurrentGame();
            }
        },

        endCurrentGame() {
            if (this.currentGame && this.currentGame.module.destroyGame) {
                this.currentGame.module.destroyGame();
            }
            this.currentGame = null;
            UI.toggleGameArena(false);
        }
    };

    // --- INITIALIZATION & CORE LOGIC ---
    function loadState() {
        const savedState = localStorage.getItem('retroScrollState');
        if (savedState) {
            const parsedState = JSON.parse(savedState);
            // Merge saved state with defaults to handle new properties
            state = { ...state, ...parsedState, user: { ...state.user, ...parsedState.user }, preferences: { ...state.preferences, ...parsedState.preferences }, games: { ...state.games, ...parsedState.games } };

            if (!state.user.username) {
                Identity.generate();
            }
        } else {
            Identity.generate();
        }
    }

    function saveState() {
        localStorage.setItem('retroScrollState', JSON.stringify(state));
        UI.updateDebugPanel();
    }
    
    async function loadMoreContent() {
        if (state.isLoading) return;
        state.isLoading = true;
        
        state.feedPage++;
        const items = await API.fetchContent(state.feedPage);
        const fragment = document.createDocumentFragment();
        items.forEach((item, index) => {
            const card = UI.renderCard(item);
            card.style.animationDelay = `${index * 50}ms`;
            fragment.appendChild(card);
        });
        DOM.feedContainer.appendChild(fragment);

        state.isLoading = false;
    }

    function launchGame(gameId) {
        UI.switchView('games');
        GameEngine.launch(gameId);
    }

    function handleReset() {
        if (confirm('Are you sure you want to reset all your progress? This cannot be undone.')) {
            localStorage.removeItem('retroScrollState');
            window.location.reload();
        }
    }

    async function init() {
        UI.cacheDOM();
        loadState();
        Gamification.updateStreak();
        UI.applyPreferences();
        UI.updateProfile();
        UI.updateStats();
        bindEvents();
        
        // Initial load
        await loadMoreContent();

        // Load games list
        const games = await API.fetchGameList();
        UI.renderGameList(games);

        Effects.animateCat();
        console.log("RetroScroll initialized. Welcome back, " + state.user.username);
    }
    
    return {
        init: init
    };
})();

document.addEventListener('DOMContentLoaded', App.init);