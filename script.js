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
        
        // Show success message
        showStatus(`VERS AFEGIT AL CORPUS! Total de versos: ${corpus.length}`, 'success');
        
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
    
    // Generate poem
    const poem = generatePoem(corpus);
    
    if (poem) {
        displayPoem(poem, corpus.length);
    } else {
        resultsDisplay.innerHTML = `
            <p>&gt; ERROR: No s'ha pogut generar el poema.</p>
            <p>&gt; Intenta afegir més versos al corpus.</p>
        `;
    }
}

// Remove punctuation and get rhyme (last 4 characters)
function getRhyme(text) {
    const cleaned = text.replace(/[;:,.¿?¡!)(.\s]/g, '');
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
        
        // 4. Find fourth line that rhymes with second line
        const line4 = findRhymingLine(corpus, rima2, [line1, line2, line3]);
        
        return {
            lines: [
                line1,
                line2,
                line3,
                line4
            ],
            rhymes: {
                rima1: rima1,
                rima2: rima2
            }
        };
    } catch (error) {
        console.error('Error generant poema:', error);
        return null;
    }
}

function displayPoem(poem, corpusSize) {
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    let html = `
        <div class="info-box">
            <p>&gt; Poema generat a partir de ${corpusSize} versos del corpus</p>
        </div>
        <br>
        <div class="original-verse">
            <div class="label">&gt; POEMA GENERAT AMB ESQUEMA DE RIMES ABAB:</div>
            <br>
            <div class="text" style="white-space: pre-line; font-size: 18px; line-height: 1.8;">
${poem.lines.map((line, i) => `${line}`).join('\n')}
            </div>
        </div>
        <br>
        <div class="result-item">
            <div class="result-header">&gt; ANÀLISI DE RIMES:</div>
            <div class="result-text">&gt; Línia 1 i 3 rimen amb: "${poem.rhymes.rima1}"</div>
            <div class="result-text">&gt; Línia 2 i 4 rimen amb: "${poem.rhymes.rima2}"</div>
        </div>
        <br>
        <div class="result-item">
            <div class="result-header">&gt; ESTRUCTURA DEL POEMA:</div>
            <div class="result-text">&gt; Esquema de rimes: A-B-A-B</div>
            <div class="result-text">&gt; Nombre de línies: 4</div>
            <div class="result-text">&gt; Tipus: Quarteta amb rimes consonants</div>
        </div>
        <br>
        <div class="menu-item" style="text-align: center;">
            <button onclick="location.reload()" class="terminal-button">
                [ GENERAR UN ALTRE POEMA ]
            </button>
        </div>
    `;
    
    resultsDisplay.innerHTML = html;
}
