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

// Link eklentisini yükle - WebLinksAddon global'de tanımlıysa
if (typeof WebLinksAddon !== 'undefined') {
    try {
        const webLinksAddon = new WebLinksAddon();
        term.loadAddon(webLinksAddon);
    } catch (e) {
        console.warn('WebLinksAddon could not be loaded:', e);
    }
} else {
    console.warn('WebLinksAddon not available');
}
