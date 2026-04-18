const words = ["aku", "kamu", "dia", "ini", "itu", "ada", "apa", "iya", "tidak", "bisa", "mau", "suka", "lihat", "dengar", "makan", "minum", "jalan", "lari", "duduk", "tidur", "rumah", "sekolah", "buku", "meja", "kursi", "pintu", "jendela", "lampu", "air", "api", "tanah", "langit", "awan", "hujan", "panas", "dingin", "besar", "kecil", "baru", "lama", "cepat", "lambat", "baik", "buruk", "benar", "salah", "hari", "malam", "pagi", "siang", "sore", "senang", "sedih", "marah", "tenang", "teman", "keluarga", "ayah", "ibu", "kakak", "adik", "kerja", "main", "belajar", "tulis", "baca", "hitung", "uang", "pasar", "toko", "mobil", "motor", "jalan", "kota", "desa", "laut", "pantai", "gunung", "ikan", "ayam", "nasi", "roti", "susu", "gula", "garam", "kopi", "teh", "gigi", "mata", "tangan", "kaki", "kepala", "badan", "warna", "merah", "biru", "hijau", "hitam", "putih"];

const quoteDisplayElement = document.getElementById('quote-display');
const quoteInputElement = document.getElementById('quote-input');
const startBtn = document.getElementById('start-btn'); 
const timerElement = document.getElementById('timer');
const wpmElement = document.getElementById('wpm');
const accuracyElement = document.getElementById('accuracy');


const wpmBox = wpmElement.parentElement;
const accBox = accuracyElement.parentElement;

let timerInterval;
let startTime;
let timeLimit = 60;
let isPlaying = false;
let isStarted = false;
let totalCorrectChars = 0;
let totalTypedChars = 0;

// 
function generateWords() {
    quoteDisplayElement.innerHTML = '';
    
    for (let i = 0; i < 15; i++) {
        const word = words[Math.floor(Math.random() * words.length)];
        const wordSpan = document.createElement('span');
        wordSpan.innerText = word;
        quoteDisplayElement.appendChild(wordSpan);
    }
    // Set kata pertama sebagai kata aktif
    quoteDisplayElement.firstChild.classList.add('active');
}

// 2: Auto-start saat mulai mengetik
quoteInputElement.addEventListener('input', (e) => {
    // Jalankan timer hanya pada ketikan pertama
    if (!isStarted) {
        startTimer();
        isStarted = true;
        isPlaying = true;
    }

    if (!isPlaying) return;

    const activeSpan = quoteDisplayElement.querySelector('.active');
    if (!activeSpan) return;

    const targetWord = activeSpan.innerText;
    const currentInput = quoteInputElement.value;

    // Logika Spasi: Cek kata saat spasi ditekan
    if (currentInput.endsWith(" ")) {
        const inputWord = currentInput.trim(); // Hapus spasi untuk pencocokan
        
        // Tambahkan panjang kata target ke total karakter yang (seharusnya) diketik
        totalTypedChars += targetWord.length;

        // Validasi Kebenaran Kata
        if (inputWord === targetWord) {
            activeSpan.classList.replace('active', 'correct');
            totalCorrectChars += targetWord.length; // Hitung benar
        } else {
            activeSpan.classList.replace('active', 'incorrect');
        }

        quoteInputElement.value = ""; // Kosongkan input untuk kata baru

        // Pindah ke kata berikutnya
        const nextWord = activeSpan.nextElementSibling;
        if (nextWord) {
            nextWord.classList.add('active');
        } else {
            // JIKA BARIS HABIS: Generate 2 baris kata baru
            generateWords();
        }
    } else {
        // Visual real-time: Beri warna merah jika user mulai salah ketik di tengah kata
        if (!targetWord.startsWith(currentInput)) {
            activeSpan.classList.add('error-text');
        } else {
            activeSpan.classList.remove('error-text');
        }
    }

    updateStats();
});

// Perbaikan Penghitungan Akurasi & WPM
function updateStats() {
    // Jika game belum mulai, jangan hitung
    if (!isStarted) return; 

    const timeElapsed = (new Date() - startTime) / 60000; // waktu dalam menit
    
    // Hitung WPM
    if (timeElapsed > 0) {
        // Karena timeElapsed terus bertambah, jika totalCorrectChars diam, WPM otomatis turun
        const wpm = Math.round((totalCorrectChars / 5) / timeElapsed);
        wpmElement.innerText = wpm > 0 ? wpm : 0;
    }

    // Hitung Akurasi
    if (totalTypedChars > 0) {
        const acc = Math.floor((totalCorrectChars / totalTypedChars) * 100);
        accuracyElement.innerText = acc;
    }
}

function startTimer() {
    startTime = new Date();
    timerInterval = setInterval(() => {
        const timePassed = new Date() - startTime;
        const timeLeft = timeLimit - Math.floor(timePassed / 1000);
        
        timerElement.innerText = timeLeft > 0 ? timeLeft : 0;
        
        // Paksa hitung ulang WPM setiap detik
        updateStats(); 
        
        if (timeLeft <= 0) {
            finishGame();
        }
    }, 1000);
}

// Hasil visual
function finishGame() {
    clearInterval(timerInterval);
    isPlaying = false;
    quoteInputElement.disabled = true;
    
    wpmBox.classList.add('finished');
    accBox.classList.add('finished');
}

// Fungsi Reset (Kembali ke awal)
function resetGame() {
    clearInterval(timerInterval);
    isStarted = false;
    isPlaying = false;
    totalCorrectChars = 0;
    totalTypedChars = 0;
    
    wpmElement.innerText = 0;
    accuracyElement.innerText = 100;
    timerElement.innerText = timeLimit;
    
    // Hapus efek hijau
    wpmBox.classList.remove('finished');
    accBox.classList.remove('finished');
    
    quoteInputElement.disabled = false;
    quoteInputElement.value = "";
    quoteInputElement.focus();
    startBtn.innerText = "Ulangi";
    
    generateWords();
}

startBtn.addEventListener('click', resetGame);

resetGame();