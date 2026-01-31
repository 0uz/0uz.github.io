// term zaten terminal-config.js'de oluşturuldu, tekrar oluşturmaya gerek yok

// Terminal başlangıç durumu
const terminalState = {
    commandHistory: [],
    historyIndex: -1,
    currentLine: '',
    cursorPosition: 0,
    prompt: '\x1b[1m\x1b[38;5;87m➜\x1b[0m \x1b[1m\x1b[38;5;76m~/portfolio\x1b[0m \x1b[38;5;39m$\x1b[0m '
};

// Terminal container'a bağla
term.open(document.getElementById('terminal-container'));
term.options.allowTransparency = true;
term.options.theme = {
    background: '#000000',
    foreground: '#ffffff',
    cursor: '#ffffff',
    cursorAccent: '#000000',
    selection: 'rgba(255, 255, 255, 0.3)',
    black: '#000000',
    red: '#e06c75',
    green: '#98c379',
    yellow: '#d19a66',
    blue: '#61afef',
    magenta: '#c678dd',
    cyan: '#56b6c2',
    white: '#abb2bf',
    brightBlack: '#5c6370',
    brightRed: '#e06c75',
    brightGreen: '#98c379',
    brightYellow: '#d19a66',
    brightBlue: '#61afef',
    brightMagenta: '#c678dd',
    brightCyan: '#56b6c2',
    brightWhite: '#ffffff'
};

// Terminal boyutunu ayarla fonksiyonunu güncelle
function updateTerminalSize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const headerHeight = document.getElementById('terminal-header').offsetHeight;
    const isMobile = width <= 768;
    const mobileButtonsHeight = isMobile ? 40 : 0;

    let fontSize = 14;
    if (width <= 480) {
        fontSize = 11;
    } else if (width <= 768) {
        fontSize = 12;
    }

    const margin = width <= 480 ? 5 : (width <= 768 ? 10 : 20);
    const padding = width <= 480 ? 5 : (width <= 768 ? 8 : 10);
    
    const dims = {
        cols: Math.floor((width - (margin * 2) - (padding * 2)) / (fontSize * 0.6)),
        rows: Math.floor((height - headerHeight - mobileButtonsHeight - (margin * 2)) / (fontSize * 1.2))
    };

    term.options.fontSize = fontSize;
    term.resize(dims.cols, dims.rows);
    scrollToBottom();
}

// Pencere boyutu değiştiğinde terminal boyutunu güncelle
window.addEventListener('resize', updateTerminalSize);

// Header yüklendikten sonra terminal boyutunu güncelle
setTimeout(updateTerminalSize, 100);

// Terminal çıktısını en alta kaydır
function scrollToBottom() {
    const viewport = document.querySelector('.xterm-viewport');
    if (viewport) {
        viewport.scrollTop = viewport.scrollHeight;
    }
}

// Terminal giriş/çıkış yönetimi
function clearCurrentLine() {
    const currentLineLength = terminalState.prompt.length + terminalState.currentLine.length;
    term.write('\r' + ' '.repeat(currentLineLength) + '\r');
}

function refreshLine() {
    clearCurrentLine();
    term.write(terminalState.prompt + terminalState.currentLine);
    if (terminalState.currentLine.length > terminalState.cursorPosition) {
        const moveBack = terminalState.currentLine.length - terminalState.cursorPosition;
        term.write('\x1b[' + moveBack + 'D');
    }
}

function addToHistory(command) {
    if (command && command.trim() && terminalState.commandHistory[0] !== command) {
        terminalState.commandHistory.unshift(command);
        if (terminalState.commandHistory.length > 50) {
            terminalState.commandHistory.pop();
        }
    }
}

// ASCII art ve başlık için fonksiyon
function getWelcomeMessage() {
    const width = window.innerWidth;
    if (width <= 768) {
        return '\x1b[1m\x1b[38;5;82m' +
            '╔═══════════════╗\n' +
            '║ Backend OUZ   ║\n' +
            '╚═══════════════╝\x1b[0m\n' +
            '\x1b[1m\x1b[38;5;81mBackend Developer Terminal v2.0.0\n' +
            'Type "help" for available commands\x1b[0m';
    }
    
    return '\x1b[1m\x1b[38;5;82m' + 
        '  ____             _                  _    ___  _    _ ______\n' +
        ' |  _ \\           | |                | |  / _ \\| |  | |___  /\n' +
        ' | |_) | __ _  ___| | _____ _ __   __| | | | | | |  | |  / / \n' +
        ' |  _ < / _` |/ __| |/ / _ \\ \'_ \\ / _` | | | | | |  | | / /  \n' +
        ' | |_) | (_| | (__|   <  __/ | | | (_| | | |_| | |__| |/ /__ \n' +
        ' |____/ \\__,_|\\___|_|\\_\\___|_| |_|\\__,_|  \\___/ \\____//_____|\n' +
        '                                                             \n' +
        '                                                             \x1b[0m\n' +
        '\x1b[1m\x1b[38;5;81mBackend Developer Terminal v2.0.0 - Type "help" for available commands\x1b[0m';
}

// Terminal header'ını oluştur
const headerContent = getWelcomeMessage();

// Header'ı ayrı bir div'e yaz
const headerDiv = document.getElementById('terminal-header');
const headerTerm = new Terminal({
    cursorBlink: false,
    disableStdin: true,
    fontSize: term.options.fontSize,
    fontFamily: term.options.fontFamily,
    theme: term.options.theme,
    convertEol: true,
    rows: headerContent.split('\n').length
});

headerTerm.open(headerDiv);
headerTerm.write(headerContent);

// Terminal başlangıcı - sadece terminal görünürse başlat
let terminalInitialized = false;

function initializeTerminal() {
    if (terminalInitialized) return;
    terminalInitialized = true;
    
    term.write(terminalState.prompt);
    
    // Otomatik olarak infrastructure containerları başlat
    setTimeout(() => {
        if (typeof writeLine === 'function') {
            writeLine('\x1b[38;5;244m# Initializing development environment...\x1b[0m');
            writeLine('docker compose up -d');
            if (typeof commands !== 'undefined' && commands.docker) {
                commands.docker(['compose', 'up']).then(() => {
                    setTimeout(() => {
                        writeLine('\x1b[38;5;82m');
                        writeLine('╔══════════════════════════════════════════════════════════════╗');
                        writeLine('║              🚀 Environment Ready!                           ║');
                        writeLine('║                                                              ║');
                        writeLine('║  All services are now running:                               ║');
                        writeLine('║    • PostgreSQL  (Port 5432)  ✓                              ║');
                        writeLine('║    • Redis       (Port 6379)  ✓                              ║');
                        writeLine('║    • Kafka       (Port 9092)  ✓                              ║');
                        writeLine('║    • Spring Boot (Port 8080)  ✓                              ║');
                        writeLine('║    • Go Service  (Port 8081)  ✓                              ║');
                        writeLine('║                                                              ║');
                        writeLine('║  Try: curl localhost:8080/api/profile                        ║');
                        writeLine('║  Or type "help" to see all commands                          ║');
                        writeLine('╚══════════════════════════════════════════════════════════════╝');
                        writeLine('\x1b[0m');
                        term.write(terminalState.prompt);
                    }, 500);
                }).catch(() => {
                    term.write(terminalState.prompt);
                });
            } else {
                term.write(terminalState.prompt);
            }
        }
    }, 500);
}

// Check if terminal should be initialized on load
const simpleDashboard = document.getElementById('simple-dashboard');
const isTerminalVisible = !simpleDashboard.classList.contains('active');
if (isTerminalVisible) {
    initializeTerminal();
}

// Klavye olaylarını dinle
term.onKey(({ key, domEvent }) => {
    const ev = domEvent;
    const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

    if (ev.keyCode === 9) { // Tab
        ev.preventDefault();
        const completedLine = handleTabCompletion(terminalState.currentLine);
        if (completedLine !== terminalState.currentLine) {
            terminalState.currentLine = completedLine;
            terminalState.cursorPosition = completedLine.length;
            refreshLine();
        }
    }
    else if (ev.keyCode === 13) { // Enter
        const command = terminalState.currentLine.trim();
        term.write('\r\n');
        
        if (command) {
            addToHistory(command);
            const [cmd, ...args] = command.toLowerCase().split(' ');
            
            if (commands.hasOwnProperty(cmd)) {
                try {
                    Promise.resolve(commands[cmd](args)).finally(() => {
                        term.write('\r\n' + terminalState.prompt);
                        updateMobileCommands();
                        scrollToBottom();
                    });
                } catch (error) {
                    writeLine('Error executing command: ' + error);
                    term.write(terminalState.prompt);
                    updateMobileCommands();
                    scrollToBottom();
                }
            } else {
                writeLine(`Command not found: ${cmd}`);
                writeLine('Type "help" for available commands');
                term.write(terminalState.prompt);
                updateMobileCommands();
                scrollToBottom();
            }
        } else {
            term.write(terminalState.prompt);
        }

        terminalState.currentLine = '';
        terminalState.cursorPosition = 0;
        terminalState.historyIndex = -1;
        scrollToBottom();
    }
    else if (ev.keyCode === 8) { // Backspace
        if (terminalState.cursorPosition > 0) {
            terminalState.currentLine = 
                terminalState.currentLine.slice(0, terminalState.cursorPosition - 1) + 
                terminalState.currentLine.slice(terminalState.cursorPosition);
            terminalState.cursorPosition--;
            refreshLine();
        }
    }
    else if (ev.keyCode === 37) { // Sol ok
        if (terminalState.cursorPosition > 0) {
            terminalState.cursorPosition--;
            term.write('\x1b[D');
        }
    }
    else if (ev.keyCode === 39) { // Sağ ok
        if (terminalState.cursorPosition < terminalState.currentLine.length) {
            terminalState.cursorPosition++;
            term.write('\x1b[C');
        }
    }
    else if (ev.keyCode === 38) { // Yukarı ok
        if (terminalState.historyIndex < terminalState.commandHistory.length - 1) {
            terminalState.historyIndex++;
            terminalState.currentLine = terminalState.commandHistory[terminalState.historyIndex];
            terminalState.cursorPosition = terminalState.currentLine.length;
            refreshLine();
        }
    }
    else if (ev.keyCode === 40) { // Aşağı ok
        if (terminalState.historyIndex > -1) {
            terminalState.historyIndex--;
            terminalState.currentLine = terminalState.historyIndex >= 0 
                ? terminalState.commandHistory[terminalState.historyIndex]
                : '';
            terminalState.cursorPosition = terminalState.currentLine.length;
            refreshLine();
        }
    }
    else if (printable && key.length === 1) {
        terminalState.currentLine = 
            terminalState.currentLine.slice(0, terminalState.cursorPosition) +
            key +
            terminalState.currentLine.slice(terminalState.cursorPosition);
        terminalState.cursorPosition++;
        refreshLine();
        updateMobileCommands();
    }
});

// Mobil klavye için ek olay dinleyicisi
document.addEventListener('input', function(e) {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        e.preventDefault();
    }
}, true);

// Terminal container'a tıklandığında mobil klavyeyi göster
document.getElementById('terminal-container').addEventListener('click', function() {
    term.focus();
});

// Simple Mode default - animasyonları başlat
setTimeout(() => {
    const simpleDashboard = document.getElementById('simple-dashboard');
    if (simpleDashboard && simpleDashboard.classList.contains('active')) {
        animateLanguageBars();
    }
}, 300);

// Terminal başlatıldığında mobil butonları güncelle
updateMobileCommands();

// Mobil komutları güncelle
function updateMobileCommands() {
    const mobileCommands = document.getElementById('mobile-commands');
    if (!mobileCommands) return;

    const simpleDashboard = document.getElementById('simple-dashboard');
    if (simpleDashboard && simpleDashboard.classList.contains('active')) {
        mobileCommands.style.display = 'none';
        return;
    }

    mobileCommands.innerHTML = '';
    mobileCommands.style.display = 'flex';
    
    const commands = [
        { text: 'help', cmd: 'help', icon: '❓' },
        { text: 'profile', cmd: 'curl localhost:8080/api/profile', icon: '👤' },
        { text: 'projects', cmd: 'curl localhost:8080/api/projects', icon: '🚀' },
        { text: 'clear', cmd: 'clear', icon: '🧹' },
        { text: 'matrix', cmd: 'matrix', icon: '💊' }
    ];

    commands.forEach(({ text, cmd, icon }) => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="btn-icon-small">${icon}</span><span class="btn-text">${text}</span>`;
        button.onclick = () => {
            term.write(cmd + '\r\n');
            executeCommand(cmd);
        };
        mobileCommands.appendChild(button);
    });
}

// Swipe gesture support for mobile
let touchStartX = 0;
let touchEndX = 0;

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        const simpleDashboard = document.getElementById('simple-dashboard');
        // Simple Mode'da sağa swipe = Terminal Mode'a geç
        // Terminal Mode'da sola swipe = Simple Mode'a geç
        if (simpleDashboard.classList.contains('active') && diff < 0) {
            // Simple Mode'da sağa kaydır → Terminal
            toggleView();
        } else if (!simpleDashboard.classList.contains('active') && diff > 0) {
            // Terminal Mode'da sola kaydır → Simple
            toggleView();
        }
    }
}

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
}, false);

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
}, false);

// View Toggle Function
function toggleView() {
    const body = document.body;
    const terminalHeader = document.getElementById('terminal-header');
    const terminalContainer = document.getElementById('terminal-container');
    const simpleDashboard = document.getElementById('simple-dashboard');
    const mobileCommands = document.getElementById('mobile-commands');
    const toggleBtn = document.getElementById('toggle-view-btn');
    const swipeHint = document.getElementById('swipe-hint');
    
    if (simpleDashboard.classList.contains('active')) {
        // Switch to Terminal Mode
        simpleDashboard.classList.remove('active');
        simpleDashboard.classList.add('hidden');
        terminalHeader.style.display = 'block';
        terminalContainer.style.display = 'flex';
        if (mobileCommands) mobileCommands.style.display = 'flex';
        
        toggleBtn.innerHTML = '<i class="fas fa-terminal"></i><span>Simple Mode</span>';
        toggleBtn.style.background = '#0A0A0A';
        toggleBtn.style.borderColor = '#0A0A0A';
        toggleBtn.style.color = '#FFFFFF';
        
        if (swipeHint) swipeHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Swipe left for Simple Mode';
        
        // Terminal'i başlat ve yeniden boyutlandır
        setTimeout(() => {
            updateTerminalSize();
            initializeTerminal();
            term.focus();
        }, 100);
    } else {
        // Switch to Simple Mode
        simpleDashboard.classList.remove('hidden');
        simpleDashboard.classList.add('active');
        terminalHeader.style.display = 'none';
        terminalContainer.style.display = 'none';
        if (mobileCommands) mobileCommands.style.display = 'none';
        
        toggleBtn.innerHTML = '<i class="fas fa-terminal"></i><span>Terminal Mode</span>';
        toggleBtn.style.background = '#FF3333';
        toggleBtn.style.borderColor = '#FF3333';
        toggleBtn.style.color = '#FFFFFF';
        
        if (swipeHint) swipeHint.innerHTML = '<i class="fas fa-hand-pointer"></i> Swipe right for Terminal';
        
        // Simple, minimal animation
        setTimeout(animateLanguageBars, 100);
    }
}

// Animate Language Bars (simple, minimal)
function animateLanguageBars() {
    const langFills = document.querySelectorAll('.lang-fill');
    langFills.forEach(fill => {
        const width = fill.style.width;
        fill.style.width = '0%';
        setTimeout(() => {
            fill.style.width = width;
        }, 100);
    });
}
