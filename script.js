// ELPOEBOT JavaScript - Generador de Poemes amb Corpus d'Usuari

// Initialize corpus from localStorage
function getCorpus() {
    const corpus = localStorage.getItem('corpus');
    if (!corpus) {
        return [];
    }
    return JSON.parse(corpus);
}

function saveCorpus(corpus) {
    localStorage.setItem('corpus', JSON.stringify(corpus));
}

function addVerseToCorpus(verse) {
    const corpus = getCorpus();
    corpus.push(verse.trim());
    saveCorpus(corpus);
    return corpus;
}

// Check which page we're on and initialize accordingly
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('verseForm')) {
        initInputPage();
    } else if (document.getElementById('outputContent')) {
        initOutputPage();
    }
});

// INPUT PAGE FUNCTIONALITY
function initInputPage() {
    const form = document.getElementById('verseForm');
    const input = document.getElementById('verseInput');
    const statusMessage = document.getElementById('statusMessage');
    const corpusCount = document.getElementById('corpusCount');
    
    // Update corpus count
    updateCorpusCount();
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const verse = input.value.trim();
        
        if (verse === '') {
            showStatus('ERROR: Has d\'introduir un vers.', 'error');
            return;
        }
        
        // Add verse to corpus
        const corpus = addVerseToCorpus(verse);
        
        // Random messages list
        const randomMessages = [
            "El Poebot s'alimenta de les il·lusions dels altres",
            "El Poebot té fam, no li donis només un vers",
            "Les teves paraules fan crèixer la bèstia",
            "On tu hi veus fems digital, el Poebot hi veu vida",
            "Per ser bon poeta, el Poebot ha de menjar",
            "Cada mot, és un alè de vida per al Poebot",
            "El Poebot processa Mots i genera Art",
            "Deixa que el Poebot dissenyi els teus pensaments"
        ];
        
        // Select random message
        const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
        
        // Show success message
        showStatus(randomMessage, 'success');
        
        // Clear input
        input.value = '';
        
        // Update count
        updateCorpusCount();
        
        // Focus back on input
        input.focus();
    });
}

function updateCorpusCount() {
    const corpusCount = document.getElementById('corpusCount');
    if (corpusCount) {
        const corpus = getCorpus();
        corpusCount.textContent = corpus.length;
    }
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = '> ' + message;
    statusMessage.className = 'status-message ' + type;
}

// OUTPUT PAGE FUNCTIONALITY
function initOutputPage() {
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    // Get corpus
    const corpus = getCorpus();
    
    if (corpus.length < 4) {
        resultsDisplay.innerHTML = `
            <p>&gt; CORPUS INSUFICIENT.</p>
            <p>&gt; Necessites almenys 4 versos al corpus per generar un poema.</p>
            <p>&gt; Versos actuals: ${corpus.length}</p>
            <br>
            <p>&gt; Ves a la pàgina INPUT per afegir més versos.</p>
        `;
        return;
    }
    
    // Generate random delay between 30 seconds (30000ms) and 5 minutes (300000ms)
    const minDelay = 30000;
    const maxDelay = 300000;
    const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
    
    // Show waiting message with countdown
    const startTime = Date.now();
    const endTime = startTime + randomDelay;
    
    // Update countdown every second
    const countdownInterval = setInterval(() => {
        const remainingMs = endTime - Date.now();
        if (remainingMs <= 0) {
            clearInterval(countdownInterval);
        } else {
            const remainingSeconds = Math.ceil(remainingMs / 1000);
            const minutes = Math.floor(remainingSeconds / 60);
            const seconds = remainingSeconds % 60;
            resultsDisplay.innerHTML = `
                <p>&gt; El Poebot està creant el teu poema...</p>
                <p>&gt; Temps estimat restant: ${minutes}m ${seconds}s</p>
            `;
        }
    }, 1000);
    
    // Generate poem after delay
    setTimeout(() => {
        clearInterval(countdownInterval);
        
        // Generate poem
        const poem = generatePoem(corpus);
        
        if (poem) {
            // Save poem to book
            savePoemToBook(poem);
            
            displayPoem(poem, corpus.length);
        } else {
            resultsDisplay.innerHTML = `
                <p>&gt; ERROR: No s'ha pogut generar el poema.</p>
                <p>&gt; Intenta afegir més versos al corpus.</p>
            `;
        }
    }, randomDelay);
}

// Save poem to book with timestamp
function savePoemToBook(poem) {
    const timestamp = new Date().toISOString();
    const book = getBook();
    
    const poemEntry = {
        poem: poem,
        timestamp: timestamp,
        date: new Date().toLocaleString('ca-ES')
    };
    
    book.push(poemEntry);
    localStorage.setItem('book', JSON.stringify(book));
    
    console.log('Poema desat al book:', poemEntry);
}

// Get book from localStorage
function getBook() {
    const book = localStorage.getItem('book');
    if (!book) {
        return [];
    }
    return JSON.parse(book);
}

// Remove punctuation and get rhyme (last 4 characters)
function getRhyme(text) {
    const cleaned = text.replace(/[;:,.¿?¡!()\s]/g, '');
    return cleaned.slice(-4).toLowerCase();
}

// Get random element from array
function randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

// Find a line that ends with the specified rhyme
function findRhymingLine(lines, rhyme, excludeLines = []) {
    const maxAttempts = 100;
    let attempts = 0;
    
    // First try to find exact rhyme
    while (attempts < maxAttempts) {
        const line = randomChoice(lines);
        const lineRhyme = getRhyme(line);
        
        if (lineRhyme === rhyme && !excludeLines.includes(line)) {
            return line;
        }
        
        attempts++;
    }
    
    // If no exact rhyme found, return a random line
    let line;
    do {
        line = randomChoice(lines);
    } while (excludeLines.includes(line) && lines.length > excludeLines.length);
    
    return line;
}

// Generate poem following the rhyme scheme ABAB
function generatePoem(corpus) {
    if (corpus.length < 4) {
        console.error('Corpus massa petit');
        return null;
    }
    
    try {
        // Try to generate ABAB quatrain
        const ababPoem = tryGenerateABAB(corpus);
        
        if (ababPoem) {
            return {
                ...ababPoem,
                type: 'ABAB'
            };
        }
        
        // If ABAB fails, generate random length poem (4-14 lines)
        console.log('No s\'ha pogut generar ABAB, generant poema aleatori');
        return generateRandomPoem(corpus);
        
    } catch (error) {
        console.error('Error generant poema:', error);
        return generateRandomPoem(corpus);
    }
}

// Try to generate ABAB quatrain
function tryGenerateABAB(corpus) {
    const maxAttempts = 50;
    let attempts = 0;
    
    while (attempts < maxAttempts) {
        // 1. Select first line
        const line1 = randomChoice(corpus);
        const rima1 = getRhyme(line1);
        
        // 2. Select second line (different from first)
        let line2;
        do {
            line2 = randomChoice(corpus);
        } while (line2 === line1);
        const rima2 = getRhyme(line2);
        
        // 3. Find third line that rhymes with first line
        const line3 = findRhymingLine(corpus, rima1, [line1, line2]);
        
        // Check if line3 actually rhymes
        if (getRhyme(line3) !== rima1) {
            attempts++;
            continue;
        }
        
        // 4. Find fourth line that rhymes with second line
        const line4 = findRhymingLine(corpus, rima2, [line1, line2, line3]);
        
        // Check if line4 actually rhymes
        if (getRhyme(line4) !== rima2) {
            attempts++;
            continue;
        }
        
        // Success! We have an ABAB poem
        return {
            lines: [line1, line2, line3, line4],
            rhymes: {
                rima1: rima1,
                rima2: rima2
            }
        };
    }
    
    // Failed to generate ABAB after max attempts
    return null;
}

// Generate random length poem when ABAB fails
function generateRandomPoem(corpus) {
    // Random number of lines between 4 and 14
    const numLines = Math.floor(Math.random() * 11) + 4; // 4 to 14
    
    const lines = [];
    const usedLines = [];
    
    for (let i = 0; i < numLines; i++) {
        let line;
        // Try to get a unique line, but allow repetition if corpus is small
        if (corpus.length > usedLines.length) {
            do {
                line = randomChoice(corpus);
            } while (usedLines.includes(line));
        } else {
            line = randomChoice(corpus);
        }
        lines.push(line);
        usedLines.push(line);
    }
    
    return {
        lines: lines,
        rhymes: null,
        type: 'LLIURE'
    };
}

function displayPoem(poem, corpusSize) {
    const resultsDisplay = document.getElementById('resultsDisplay');
    const book = getBook();
    
    let html = `
        <div class="info-box">
            <p>&gt; Poema generat a partir de ${corpusSize} versos del corpus</p>
            <p>&gt; Total de poemes al book: ${book.length}</p>
        </div>
        <br>
        <div class="original-verse">
            <br>
            <div class="text" style="white-space: pre-line; font-size: 18px; line-height: 1.8;">
${poem.lines.map((line, i) => `${line}`).join('\n')}
            </div>
        </div>
    `;
    
    resultsDisplay.innerHTML = html;
}

// Download book as text file
function downloadBook() {
    const book = getBook();
    
    if (book.length === 0) {
        alert('El book està buit. Genera algun poema primer.');
        return;
    }
    
    let bookContent = '═══════════════════════════════════════\n';
    bookContent += '          ELPOEBOT - BOOK              \n';
    bookContent += '    Projecte artístic Laura Torres     \n';
    bookContent += '═══════════════════════════════════════\n\n';
    
    book.forEach((entry, index) => {
        bookContent += `\n─────────────────────────────────────\n`;
        bookContent += `POEMA #${index + 1}\n`;
        bookContent += `Data: ${entry.date}\n`;
        bookContent += `Tipus: ${entry.poem.type}\n`;
        bookContent += `─────────────────────────────────────\n\n`;
        
        entry.poem.lines.forEach(line => {
            bookContent += line + '\n';
        });
        
        if (entry.poem.type === 'ABAB' && entry.poem.rhymes) {
            bookContent += `\nRimes: ${entry.poem.rhymes.rima1} / ${entry.poem.rhymes.rima2}\n`;
        }
    });
    
    bookContent += `\n\n═══════════════════════════════════════\n`;
    bookContent += `Total de poemes: ${book.length}\n`;
    bookContent += `Generat: ${new Date().toLocaleString('ca-ES')}\n`;
    bookContent += `═══════════════════════════════════════\n`;
    
    // Create download
    const blob = new Blob([bookContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `elpoebot-book-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
