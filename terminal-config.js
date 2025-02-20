const terminalConfig = {
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
    letterSpacing: 0,
    lineHeight: 1,
    theme: {
        background: '#000',
        foreground: '#fff',
    },
    rendererType: 'canvas',
    convertEol: true,
    wordWrap: true,
    scrollback: 1000,
    // Link desteği için yeni ayarlar ekle
    allowProposedApi: true,
    linkHandler: {
        activate: (e, uri) => {
            window.open(uri, '_blank');
            return false;
        }
    },
    windowOptions: {
        windowsMode: true
    }
};

// Global term değişkenini oluştur
const term = new Terminal({
    cursorBlink: true,
    cursorStyle: 'block',
    fontSize: 14,
    fontFamily: 'Consolas, monospace',
    theme: {
        background: '#000',
        foreground: '#fff',
    },
    allowTransparency: true,
    convertEol: true,
    wordWrap: true,
    screenKeys: true, // Mobil klavye desteği için
    useStyle: true   // Stil desteği için
});

// Link eklentisini yükle
const webLinksAddon = new WebLinksAddon();
term.loadAddon(webLinksAddon);

const terminalState = {
    commandHistory: [],
    historyIndex: -1,
    currentLine: '',
    cursorPosition: 0,
    prompt: '\x1b[1m\x1b[38;5;87m➜\x1b[0m \x1b[1m\x1b[38;5;76m~/portfolio\x1b[0m \x1b[38;5;39m$\x1b[0m '
};

// Mobil giriş için yardımcı fonksiyon
function handleMobileInput(e) {
    const text = e.data;
    if (text && text.length > 0) {
        term.write(text);
        terminalState.currentLine += text;
        terminalState.cursorPosition += text.length;
        updateMobileCommands();
    }
}

// Mobil giriş olaylarını dinle
term.onData(handleMobileInput);

// writeLine ve simulateLoading fonksiyonlarını kaldır çünkü index.html'de tanımlandı
