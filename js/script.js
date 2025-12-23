/**
 * Portfolio Main Script
 * Handles navigation, games, modals, and interactive features
 */

// ========== MOBILE MENU TOGGLE ==========
function initMobileMenu() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (!hamburger || !navMenu) return;

    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.setAttribute('aria-expanded', navMenu.classList.contains('active'));
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.setAttribute('aria-expanded', 'false');
        });
    });
}

// ========== MODAL FUNCTIONS ==========
function openProjectModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    if (modal) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }
}

function closeProjectModal(projectId) {
    const modal = document.getElementById(`${projectId}-modal`);
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
    }
}

function initModalHandlers() {
    // Close modal when clicking outside
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal')) {
            event.target.classList.remove('show');
            document.body.style.overflow = 'auto';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            document.querySelectorAll('.modal.show').forEach(modal => {
                modal.classList.remove('show');
                document.body.style.overflow = 'auto';
            });
        }
    });
}

// ========== SCROLL ANIMATIONS ==========
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-group, .game-card, .experience-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// ========== ACTIVE NAV LINK HIGHLIGHTING ==========
function initActiveNavHighlight() {
    window.addEventListener('scroll', () => {
        let current = '';
        const sections = document.querySelectorAll('section');

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

// ========== SMOOTH SCROLLING ==========
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ========== TIC TAC TOE GAME ==========
class TicTacToeGame {
    constructor() {
        this.board = document.getElementById('tictactoe-board');
        this.infoDisplay = document.getElementById('tictactoe-info');
        this.resetBtn = document.getElementById('tictactoe-reset');

        if (!this.board) return;

        this.state = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;

        this.winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        this.init();
    }

    init() {
        this.board.querySelectorAll('.cell').forEach((cell, index) => {
            cell.addEventListener('click', () => this.handleCellClick(index));
        });

        this.resetBtn.addEventListener('click', () => this.reset());
        this.updateDisplay();
    }

    checkWinner(board) {
        for (let [a, b, c] of this.winningConditions) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        return null;
    }

    isBoardFull(board) {
        return board.every(cell => cell !== '');
    }

    getAIMove(board) {
        // Check if AI can win
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                if (this.checkWinner(board) === 'O') {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Check if player can win and block
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                if (this.checkWinner(board) === 'X') {
                    board[i] = '';
                    return i;
                }
                board[i] = '';
            }
        }

        // Take center
        if (board[4] === '') return 4;

        // Take corners
        const corners = [0, 2, 6, 8].filter(i => board[i] === '');
        if (corners.length > 0) {
            return corners[Math.floor(Math.random() * corners.length)];
        }

        // Take any available space
        const available = board.map((cell, i) => cell === '' ? i : null).filter(i => i !== null);
        return available[Math.floor(Math.random() * available.length)];
    }

    updateDisplay() {
        this.board.querySelectorAll('.cell').forEach((cell, index) => {
            cell.textContent = this.state[index];
            cell.classList.remove('x', 'o');
            if (this.state[index] === 'X') cell.classList.add('x');
            if (this.state[index] === 'O') cell.classList.add('o');
        });

        const winner = this.checkWinner(this.state);
        if (winner) {
            this.infoDisplay.textContent = winner === 'X' ? '🎉 You Won!' : '😢 AI Won!';
            this.gameActive = false;
        } else if (this.isBoardFull(this.state)) {
            this.infoDisplay.textContent = "It's a Draw!";
            this.gameActive = false;
        } else {
            this.infoDisplay.textContent = 'Your Turn (X)';
        }
    }

    handleCellClick(index) {
        if (this.state[index] === '' && this.gameActive) {
            this.state[index] = 'X';
            this.updateDisplay();

            if (this.gameActive) {
                setTimeout(() => {
                    const aiMove = this.getAIMove(this.state);
                    this.state[aiMove] = 'O';
                    this.updateDisplay();
                }, 500);
            }
        }
    }

    reset() {
        this.state = ['', '', '', '', '', '', '', '', ''];
        this.gameActive = true;
        this.updateDisplay();
    }
}

// ========== 8 PUZZLE GAME ==========
class PuzzleGame {
    constructor() {
        this.board = document.getElementById('puzzle-board');
        this.infoDisplay = document.getElementById('puzzle-info');
        this.movesDisplay = document.getElementById('puzzle-moves');
        this.resetBtn = document.getElementById('puzzle-reset');

        if (!this.board) return;

        this.state = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        this.moves = 0;

        this.resetBtn.addEventListener('click', () => this.reset());
        this.shuffle();
    }

    shuffle() {
        const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        this.state = [...solved];

        let emptyPos = 8;
        for (let i = 0; i < 100; i++) {
            const validMoves = [];
            if (emptyPos > 2) validMoves.push(emptyPos - 3);
            if (emptyPos < 6) validMoves.push(emptyPos + 3);
            if (emptyPos % 3 !== 0) validMoves.push(emptyPos - 1);
            if (emptyPos % 3 !== 2) validMoves.push(emptyPos + 1);

            const randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
            [this.state[emptyPos], this.state[randomMove]] = [this.state[randomMove], this.state[emptyPos]];
            emptyPos = randomMove;
        }

        this.moves = 0;
        this.movesDisplay.textContent = '0';
        this.updateDisplay();
    }

    updateDisplay() {
        this.board.innerHTML = '';
        this.state.forEach((num, index) => {
            const tile = document.createElement('div');
            tile.className = `puzzle-tile ${num === 0 ? 'empty' : ''}`;
            if (num !== 0) {
                tile.textContent = num;
                tile.addEventListener('click', () => this.moveTile(index));
            }
            this.board.appendChild(tile);
        });

        this.checkSolved();
    }

    moveTile(index) {
        const emptyIndex = this.state.indexOf(0);
        const validMoves = [];

        if (emptyIndex > 2) validMoves.push(emptyIndex - 3);
        if (emptyIndex < 6) validMoves.push(emptyIndex + 3);
        if (emptyIndex % 3 !== 0) validMoves.push(emptyIndex - 1);
        if (emptyIndex % 3 !== 2) validMoves.push(emptyIndex + 1);

        if (validMoves.includes(index)) {
            [this.state[index], this.state[emptyIndex]] = [this.state[emptyIndex], this.state[index]];
            this.moves++;
            this.movesDisplay.textContent = this.moves;
            this.updateDisplay();
        }
    }

    checkSolved() {
        const solved = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        if (JSON.stringify(this.state) === JSON.stringify(solved)) {
            this.infoDisplay.textContent = `🎉 Solved in ${this.moves} moves!`;
        } else {
            this.infoDisplay.textContent = 'Arrange tiles in order';
        }
    }

    reset() {
        this.shuffle();
    }
}

// ========== INITIALIZE ALL ==========
document.addEventListener('DOMContentLoaded', () => {
    initMobileMenu();
    initModalHandlers();
    initScrollAnimations();
    initActiveNavHighlight();
    initSmoothScrolling();

    // Initialize games
    new TicTacToeGame();
    new PuzzleGame();
});
