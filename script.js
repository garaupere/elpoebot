// ELPOEBOT JavaScript

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
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const verse = input.value.trim();
        
        if (verse === '') {
            showStatus('ERROR: Has d\'introduir un vers.', 'error');
            return;
        }
        
        // Save verse to localStorage
        saveVerse(verse);
        
        // Show success message
        showStatus('VERS PROCESSAT CORRECTAMENT. Redirigint a OUTPUT...', 'success');
        
        // Redirect to output page after 2 seconds
        setTimeout(function() {
            window.location.href = 'output.html';
        }, 2000);
    });
}

function showStatus(message, type) {
    const statusMessage = document.getElementById('statusMessage');
    statusMessage.textContent = '> ' + message;
    statusMessage.className = 'status-message ' + type;
}

function saveVerse(verse) {
    // Save to localStorage
    localStorage.setItem('currentVerse', verse);
    
    // Add to history
    let history = JSON.parse(localStorage.getItem('verseHistory') || '[]');
    history.unshift({
        verse: verse,
        timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 verses
    if (history.length > 10) {
        history = history.slice(0, 10);
    }
    
    localStorage.setItem('verseHistory', JSON.stringify(history));
}

// OUTPUT PAGE FUNCTIONALITY
function initOutputPage() {
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    // Get current verse from localStorage
    const currentVerse = localStorage.getItem('currentVerse');
    
    if (!currentVerse) {
        resultsDisplay.innerHTML = `
            <p>&gt; CAP VERS PROCESSAT.</p>
            <p>&gt; Ves a la pàgina INPUT per introduir un vers.</p>
        `;
        return;
    }
    
    // Generate combinations
    const combinations = generateCombinations(currentVerse);
    
    // Display results
    displayResults(currentVerse, combinations);
}

function generateCombinations(verse) {
    // Split verse into words
    const words = verse.split(/\s+/);
    const combinations = [];
    
    // Generate different types of combinations
    
    // 1. Reverse word order
    combinations.push({
        type: 'INVERSIÓ',
        description: 'Ordre invers de les paraules',
        result: words.slice().reverse().join(' ')
    });
    
    // 2. Alternate words
    if (words.length > 1) {
        const evenWords = words.filter((_, i) => i % 2 === 0);
        const oddWords = words.filter((_, i) => i % 2 === 1);
        combinations.push({
            type: 'PARAULES PARELLES',
            description: 'Només paraules en posicions parelles',
            result: evenWords.join(' ')
        });
        combinations.push({
            type: 'PARAULES IMPARELLES',
            description: 'Només paraules en posicions imparelles',
            result: oddWords.join(' ')
        });
    }
    
    // 3. First and last words
    if (words.length >= 2) {
        combinations.push({
            type: 'EXTREMS',
            description: 'Primera i última paraula',
            result: words[0] + ' ' + words[words.length - 1]
        });
    }
    
    // 4. Uppercase transformation
    combinations.push({
        type: 'MAJÚSCULES',
        description: 'Tot en majúscules',
        result: verse.toUpperCase()
    });
    
    // 5. Reverse characters
    combinations.push({
        type: 'CARÀCTERS INVERTITS',
        description: 'Caràcters en ordre invers',
        result: verse.split('').reverse().join('')
    });
    
    // 6. Each word on separate line
    combinations.push({
        type: 'VERTICALITZACIÓ',
        description: 'Cada paraula en una línia',
        result: words.join('\n')
    });
    
    // 7. Vowels only
    const vowels = verse.match(/[aeiouàèéíòóú]/gi);
    if (vowels && vowels.length > 0) {
        combinations.push({
            type: 'NOMÉS VOCALS',
            description: 'Només les vocals del vers',
            result: vowels.join(' ')
        });
    }
    
    // 8. Consonants only
    const consonants = verse.match(/[bcdfghjklmnpqrstvwxyz]/gi);
    if (consonants && consonants.length > 0) {
        combinations.push({
            type: 'NOMÉS CONSONANTS',
            description: 'Només les consonants del vers',
            result: consonants.join(' ')
        });
    }
    
    return combinations;
}

function displayResults(originalVerse, combinations) {
    const resultsDisplay = document.getElementById('resultsDisplay');
    
    let html = `
        <div class="original-verse">
            <div class="label">&gt; VERS ORIGINAL:</div>
            <div class="text">"${originalVerse}"</div>
        </div>
        <br>
        <p>&gt; COMBINACIONS GENERADES: ${combinations.length}</p>
        <br>
    `;
    
    combinations.forEach((combo, index) => {
        html += `
            <div class="result-item">
                <div class="result-header">[${index + 1}] ${combo.type}</div>
                <div class="result-text">&gt; ${combo.description}</div>
                <div class="result-text" style="margin-top: 10px; white-space: pre-line;">"${combo.result}"</div>
            </div>
        `;
    });
    
    resultsDisplay.innerHTML = html;
}
