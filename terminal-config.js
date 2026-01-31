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
    screenKeys: true,
    useStyle: true
});

// Link eklentisini yükle
const webLinksAddon = new WebLinksAddon();
term.loadAddon(webLinksAddon);
