// term zaten terminal-config.js'de oluşturuldu, tekrar oluşturmaya gerek yok

// Terminal başlangıç durumu
const terminalState = {
    commandHistory: [],
    historyIndex: -1,
    currentLine: '',
    cursorPosition: 0,
    prompt: '\x1b[1m\x1b[38;5;87m➜\x1b[0m \x1b[1m\x1b[38;5;76m~/portfolio\x1b[0m \x1b[38;5;39m$\x1b[0m '
};

// Live System Monitor for Header
let headerMonitorInterval = null;
let asciiTerm = null;
let monitorTerm = null;

function getWelcomeMessage() {
    const width = window.innerWidth;
    if (width <= 768) {
        return '\x1b[1m\x1b[38;5;82m' +
            '╔═══════════════╗\n' +
            '║ Backend OUZ   ║\n' +
            '╚═══════════════╝\x1b[0m';
    }
    
    return '\x1b[1m\x1b[38;5;82m' + 
        '  ____             _                  _    ___  _    _ ______\n' +
        ' |  _ \\           | |                | |  / _ \\| |  | |___  /\n' +
        ' | |_) | __ _  ___| | _____ _ __   __| | | | | | |  | |  / / \n' +
        ' |  _ < / _` |/ __| |/ / _ \\ \'_ \\ / _` | | | | | |  | | / /  \n' +
        ' | |_) | (_| | (__|   <  __/ | | | (_| | | |_| | |__| |/ /__ \n' +
        ' |____/ \\__,_|\\___|_|\\_\\___|_| |_|\\__,_|  \\___/ \\____//_____|\x1b[0m';
}

function initHeaderMonitor() {
    const headerDiv = document.getElementById('terminal-header');
    if (!headerDiv) return;
    
    // Clear existing content
    headerDiv.innerHTML = '';
    
    // Create container for both terminals
    const container = document.createElement('div');
    container.style.display = 'flex';
    container.style.width = '100%';
    container.style.height = '100%';
    
    // ASCII Art Terminal (Left side)
    const asciiDiv = document.createElement('div');
    asciiDiv.style.flex = window.innerWidth <= 1024 ? '0 0 auto' : '0 0 60%';
    asciiDiv.style.minWidth = '300px';
    container.appendChild(asciiDiv);
    
    // Monitor Terminal (Right side) - only on larger screens
    if (window.innerWidth > 1024) {
        const monitorDiv = document.createElement('div');
        monitorDiv.style.flex = '0 0 40%';
        monitorDiv.style.minWidth = '350px';
        container.appendChild(monitorDiv);
        
        monitorTerm = new Terminal({
            cursorBlink: false,
            disableStdin: true,
            fontSize: 11,
            fontFamily: 'JetBrains Mono, monospace',
            theme: {
                background: '#0A0A0A',
                foreground: '#E0E0E0',
                cursor: '#0A0A0A',
                black: '#0A0A0A',
                red: '#FF4444',
                green: '#51CF66',
                yellow: '#FFD93D',
                blue: '#61AFEF',
                magenta: '#C678DD',
                cyan: '#56B6C2',
                white: '#E0E0E0',
                brightBlack: '#555555',
                brightRed: '#FF6B6B',
                brightGreen: '#98C379',
                brightYellow: '#D19A66',
                brightBlue: '#61AFEF',
                brightMagenta: '#C678DD',
                brightCyan: '#56B6C2',
                brightWhite: '#FFFFFF'
            },
            convertEol: true,
            rows: 6,
            cols: 45
        });
        
        monitorTerm.open(monitorDiv);
    }
    
    // ASCII Art Terminal
    asciiTerm = new Terminal({
        cursorBlink: false,
        disableStdin: true,
        fontSize: window.innerWidth <= 768 ? 10 : 13,
        fontFamily: 'JetBrains Mono, monospace',
        theme: {
            background: '#0A0A0A',
            foreground: '#E0E0E0',
            cursor: '#0A0A0A'
        },
        convertEol: true,
        rows: window.innerWidth <= 768 ? 3 : 6
    });
    
    asciiTerm.open(asciiDiv);
    
    const welcomeMessage = getWelcomeMessage();
    asciiTerm.write(welcomeMessage);
    
    // Start live monitoring if monitor term exists
    if (monitorTerm) {
        updateHeaderMonitor();
        headerMonitorInterval = setInterval(updateHeaderMonitor, 2000);
    }
    
    headerDiv.appendChild(container);
}

function updateHeaderMonitor() {
    if (!monitorTerm) return;
    
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', { hour12: false });
    const uptime = Math.floor((Date.now() - window.pageLoadTime) / 1000);
    const uptimeStr = `${Math.floor(uptime / 3600)}:${String(Math.floor((uptime % 3600) / 60)).padStart(2, '0')}:${String(uptime % 60).padStart(2, '0')}`;
    
    // Simulated metrics
    const cpuUsage = Math.floor(Math.random() * 35 + 15);
    const memUsed = Math.floor(Math.random() * 400 + 600);
    const memTotal = 8192;
    const memPercent = Math.floor((memUsed / memTotal) * 100);
    const processes = Math.floor(Math.random() * 30 + 120);
    const loadAvg = [(Math.random() * 1.5 + 0.3).toFixed(2), (Math.random() * 1.2 + 0.4).toFixed(2), (Math.random() * 1.0 + 0.5).toFixed(2)];
    
    // Network stats (simulated)
    const netDown = (Math.random() * 15 + 5).toFixed(1);
    const netUp = (Math.random() * 8 + 2).toFixed(1);
    
    // Disk usage
    const diskUsed = 234;
    const diskTotal = 512;
    const diskPercent = Math.floor((diskUsed / diskTotal) * 100);
    
    // Clear and redraw
    monitorTerm.write('\x1b[2J\x1b[H');
    
    // Line 1: Title and time
    monitorTerm.write(`\x1b[1m\x1b[38;5;87m◉ MONITOR\x1b[0m \x1b[38;5;244m${time}\x1b[0m \x1b[38;5;244m${uptimeStr}\x1b[0m`);
    monitorTerm.write('\r\n');
    
    // Line 2: CPU
    const cpuColor = cpuUsage > 70 ? '196' : '82';
    const cpuBar = '█'.repeat(Math.floor(cpuUsage / 10)) + '░'.repeat(10 - Math.floor(cpuUsage / 10));
    monitorTerm.write(`\x1b[38;5;${cpuColor}mCPU\x1b[0m[\x1b[38;5;${cpuColor}m${cpuBar}\x1b[0m]\x1b[1m${cpuUsage}%\x1b[0m`);
    monitorTerm.write('\r\n');
    
    // Line 3: MEM
    const memColor = memPercent > 80 ? '196' : '214';
    const memBar = '█'.repeat(Math.floor(memPercent / 10)) + '░'.repeat(10 - Math.floor(memPercent / 10));
    monitorTerm.write(`\x1b[38;5;${memColor}mMEM\x1b[0m[\x1b[38;5;${memColor}m${memBar}\x1b[0m]\x1b[1m${memPercent}%\x1b[0m \x1b[38;5;244mD:\x1b[0m\x1b[38;5;33m${diskPercent}%\x1b[0m`);
    monitorTerm.write('\r\n');
    
    // Line 4: Network and services
    monitorTerm.write(`\x1b[38;5;244m▼\x1b[0m\x1b[38;5;82m${netDown}\x1b[0m \x1b[38;5;244m▲\x1b[0m\x1b[38;5;214m${netUp}\x1b[0m \x1b[38;5;82m●PG ●RD ●KF\x1b[0m`);
}

function stopHeaderMonitor() {
    if (headerMonitorInterval) {
        clearInterval(headerMonitorInterval);
        headerMonitorInterval = null;
    }
}

// Page load time for uptime calculation
window.pageLoadTime = Date.now();

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

// Initialize header monitor
initHeaderMonitor();

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
window.addEventListener('resize', () => {
    updateTerminalSize();
    // Reinitialize header on resize for responsive
    stopHeaderMonitor();
    initHeaderMonitor();
});

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
                        // Check if mobile (narrow screen)
                        const isMobile = window.innerWidth <= 768;
                        
                        writeLine('\x1b[38;5;82m');
                        if (isMobile) {
                            // Compact version for mobile
                            writeLine('╔════════════════════════════════════╗');
                            writeLine('║     Environment Ready!             ║');
                            writeLine('║                                    ║');
                            writeLine('║  Services running:                 ║');
                            writeLine('║  • PostgreSQL [OK]  • Redis [OK]  ║');
                            writeLine('║  • Kafka [OK]       • Spring Boot [OK]  ║');
                            writeLine('║  • Go Service [OK]                ║');
                            writeLine('║                                    ║');
                            writeLine('║  Try: curl localhost:8080/api/    ║');
                            writeLine('║  Or type "help"                   ║');
                            writeLine('╚════════════════════════════════════╝');
                        } else {
                            // Full version for desktop
                            writeLine('╔══════════════════════════════════════════════════════════════╗');
                            writeLine('║              Environment Ready!                              ║');
                            writeLine('║                                                              ║');
                            writeLine('║  All services are now running:                               ║');
                            writeLine('║    • PostgreSQL  (Port 5432)  [OK]                           ║');
                            writeLine('║    • Redis       (Port 6379)  [OK]                           ║');
                            writeLine('║    • Kafka       (Port 9092)  [OK]                           ║');
                            writeLine('║    • Spring Boot (Port 8080)  [OK]                           ║');
                            writeLine('║    • Go Service  (Port 8081)  [OK]                           ║');
                            writeLine('║                                                              ║');
                            writeLine('║  Try: curl localhost:8080/api/profile                        ║');
                            writeLine('║  Or type "help" to see all commands                          ║');
                            writeLine('╚══════════════════════════════════════════════════════════════╝');
                        }
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

// Check if terminal should be initialized on load - will be done in DOMContentLoaded

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
    const isMobile = window.innerWidth <= 768;
    
    if (!isMobile || (simpleDashboard && simpleDashboard.classList.contains('active'))) {
        mobileCommands.classList.remove('visible');
        mobileCommands.setAttribute('aria-hidden', 'true');
        return;
    }

    mobileCommands.innerHTML = '';
    mobileCommands.classList.add('visible');
    mobileCommands.setAttribute('aria-hidden', 'false');
    mobileCommands.setAttribute('role', 'toolbar');
    mobileCommands.setAttribute('aria-label', 'Quick terminal commands');
    
    const commands = [
        { text: 'help', cmd: 'help', icon: '?', label: 'Show help command' },
        { text: 'profile', cmd: 'curl localhost:8080/api/profile', icon: 'P', label: 'Fetch profile data' },
        { text: 'projects', cmd: 'curl localhost:8080/api/projects', icon: 'PRJ', label: 'Fetch projects data' },
        { text: 'clear', cmd: 'clear', icon: 'CLR', label: 'Clear terminal' }
    ];

    commands.forEach(({ text, cmd, icon, label }) => {
        const button = document.createElement('button');
        button.innerHTML = `<span class="btn-icon-small" aria-hidden="true">${icon}</span><span class="btn-text">${text}</span>`;
        button.setAttribute('aria-label', label);
        button.setAttribute('type', 'button');
        button.onclick = () => {
            term.write(cmd + '\r\n');
            executeCommand(cmd);
        };
        
        // Add keyboard support
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                button.click();
            }
        });
        
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

// Swipe gesture support removed - using button only for better UX

// View Toggle Function
function toggleView() {
    const body = document.body;
    const terminalHeader = document.getElementById('terminal-header');
    const terminalContainer = document.getElementById('terminal-container');
    const simpleDashboard = document.getElementById('simple-dashboard');
    const mobileCommands = document.getElementById('mobile-commands');
    const toggleBtn = document.getElementById('toggle-view-btn');
    
    if (!simpleDashboard) {
        console.error('simple-dashboard element not found');
        return;
    }
    
    if (simpleDashboard.classList.contains('active')) {
        // Switch to Terminal Mode
        body.classList.add('terminal-mode');
        simpleDashboard.classList.remove('active');
        simpleDashboard.classList.add('hidden');
        terminalHeader.style.display = 'block';
        terminalContainer.style.display = 'flex';
        
        // Update and show mobile commands
        updateMobileCommands();
        
        // Start header monitor
        stopHeaderMonitor();
        initHeaderMonitor();
        
        toggleBtn.innerHTML = '<i class="fas fa-terminal"></i><span>Simple Mode</span>';
        toggleBtn.style.background = '#0A0A0A';
        toggleBtn.style.borderColor = '#0A0A0A';
        toggleBtn.style.color = '#FFFFFF';
        
        // Terminal'i başlat ve yeniden boyutlandır
        setTimeout(() => {
            updateTerminalSize();
            initializeTerminal();
            term.focus();
        }, 100);
    } else {
        // Switch to Simple Mode
        body.classList.remove('terminal-mode');
        simpleDashboard.classList.remove('hidden');
        simpleDashboard.classList.add('active');
        terminalHeader.style.display = 'none';
        terminalContainer.style.display = 'none';
        
        // Hide mobile commands
        if (mobileCommands) {
            mobileCommands.classList.remove('visible');
            mobileCommands.innerHTML = '';
        }
        
        // Stop header monitor
        stopHeaderMonitor();
        
        toggleBtn.innerHTML = '<i class="fas fa-terminal"></i><span>Terminal Mode</span>';
        toggleBtn.style.background = '#FF3333';
        toggleBtn.style.borderColor = '#FF3333';
        toggleBtn.style.color = '#FFFFFF';
        
        // Simple, minimal animation
        setTimeout(animateLanguageBars, 100);
    }
}

// Animate Language Bars (simple, minimal)
function animateLanguageBars() {
    const langFills = document.querySelectorAll('.lang-fill');
    langFills.forEach(fill => {
        const targetWidth = fill.style.width || '100%';
        // Use transform for GPU-accelerated animation
        fill.style.transform = 'scaleX(0)';
        fill.style.width = targetWidth; // Set the target width
        setTimeout(() => {
            fill.style.transform = 'scaleX(1)';
        }, 100);
    });
}

// Initialize event listeners when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Attach toggle button event listener
    const toggleBtn = document.getElementById('toggle-view-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('Toggle button clicked');
            toggleView();
        });
        console.log('Toggle button event listener attached');
    } else {
        console.error('Toggle button not found');
    }
    
    // Check if terminal should be initialized on load and set mobile commands visibility
    const simpleDashboard = document.getElementById('simple-dashboard');
    const mobileCommands = document.getElementById('mobile-commands');
    if (simpleDashboard) {
        const isTerminalVisible = !simpleDashboard.classList.contains('active');
        if (isTerminalVisible) {
            initializeTerminal();
            updateMobileCommands();
        } else {
            // In simple mode, ensure mobile commands are hidden
            if (mobileCommands) {
                mobileCommands.classList.remove('visible');
                mobileCommands.innerHTML = '';
            }
        }
    } else {
        console.error('simple-dashboard element not found');
    }
});
