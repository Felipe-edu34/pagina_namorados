// =====================================================
// CANVAS DE PARTÍCULAS — fundo animado leve
// =====================================================
(function() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];
 
    function resize() {
        W = canvas.width = window.innerWidth;
        H = canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
 
    function randomBetween(a, b) { return a + Math.random() * (b - a); }
 
    for (let i = 0; i < 60; i++) {
        particles.push({
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
            r: randomBetween(0.5, 2.5),
            vx: randomBetween(-0.15, 0.15),
            vy: randomBetween(-0.2, -0.05),
            alpha: randomBetween(0.1, 0.5),
            color: Math.random() > 0.5 ? '#ff4081' : '#ff80ab'
        });
    }
 
    function drawParticles() {
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.alpha;
            ctx.fill();
            p.x += p.vx;
            p.y += p.vy;
            if (p.y < -5) { p.y = H + 5; p.x = Math.random() * W; }
            if (p.x < -5) p.x = W + 5;
            if (p.x > W + 5) p.x = -5;
        });
        ctx.globalAlpha = 1;
        requestAnimationFrame(drawParticles);
    }
    drawParticles();
})();
 
// =====================================================
// CORAÇÕES FLUTUANTES
// =====================================================
const heartEmojis = ['❤️', '🩷', '💕', '💗', '💖'];
 
function criarCoracao() {
    const container = document.getElementById('heart-rain');
    if (!container) return;
    const heart = document.createElement('div');
    heart.classList.add('floating-heart');
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.fontSize = (Math.random() * 16 + 12) + 'px';
    heart.style.animationDuration = (Math.random() * 6 + 8) + 's';
    heart.style.setProperty('--drift', ((Math.random() - 0.5) * 100) + 'px');
    heart.style.opacity = (Math.random() * 0.3 + 0.15).toString();
    container.appendChild(heart);
    setTimeout(() => heart.remove(), 15000);
}
setInterval(criarCoracao, 700);
 
// =====================================================
// PLAYER DE MÚSICA — ESTILO SPOTIFY
// =====================================================
const playlist = [
    { nome: "Apenas Mais uma de Amor", artista: "Lulu Santos", arquivo: "musicas/musica1.mp4" },
    { nome: "Nossa Música 2", artista: "Nós Dois", arquivo: "musicas/musica2.mp4" },
    { nome: "Nossa Música 3", artista: "Nós Dois", arquivo: "musicas/musica3.mp4" },
    { nome: "Nossa Música 4", artista: "Nós Dois", arquivo: "musicas/musica4.mp4" },
    { nome: "Nossa Música 5", artista: "Nós Dois", arquivo: "musicas/musica5.mp4" }
];
 
let indiceMusica = 0;
let tocando = false;
 
const audio       = document.getElementById('musica-fundo');
const iconePlay   = document.getElementById('icone-play');
const nomeMusica  = document.getElementById('nome-musica');
const artistaMusica = document.getElementById('artista-musica');
const barraProgresso = document.getElementById('barra-progresso');
const tempoAtual  = document.getElementById('tempo-atual');
const tempoTotal  = document.getElementById('tempo-total');
const albumArt    = document.getElementById('album-art');
const equalizer   = document.getElementById('equalizer');
 
function inicializarPlayer() {
    if (audio) audio.src = playlist[indiceMusica].arquivo;
    if (nomeMusica) nomeMusica.textContent = playlist[indiceMusica].nome;
    if (artistaMusica) artistaMusica.textContent = playlist[indiceMusica].artista;
}
inicializarPlayer();
 
function carregarMusica(indice) {
    if (!audio) return;
    audio.src = playlist[indice].arquivo;
    if (nomeMusica) nomeMusica.textContent = playlist[indice].nome;
    if (artistaMusica) artistaMusica.textContent = playlist[indice].artista;
    if (tocando) audio.play().catch(() => {});
}
 
function tocarMusica() {
    if (!audio || !iconePlay) return;
    if (tocando) {
        audio.pause();
        iconePlay.textContent = 'play_arrow';
        if (albumArt) albumArt.classList.remove('spinning');
        if (equalizer) equalizer.classList.remove('active');
    } else {
        audio.play().catch(() => {});
        iconePlay.textContent = 'pause';
        if (albumArt) albumArt.classList.add('spinning');
        if (equalizer) equalizer.classList.add('active');
    }
    tocando = !tocando;
}
 
function proximaMusica() {
    indiceMusica = (indiceMusica + 1) % playlist.length;
    carregarMusica(indiceMusica);
}
 
function voltarMusica() {
    indiceMusica = (indiceMusica - 1 + playlist.length) % playlist.length;
    carregarMusica(indiceMusica);
}
 
if (audio) {
    audio.addEventListener('ended', proximaMusica);
    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration)) {
            const pct = (audio.currentTime / audio.duration) * 100;
            if (barraProgresso) barraProgresso.value = pct;
 
            if (barraProgresso) {
                barraProgresso.style.background = `linear-gradient(to right, #e91e63 ${pct}%, rgba(255,255,255,0.12) ${pct}%)`;
            }
 
            const fmt = s => `${Math.floor(s/60)}:${String(Math.floor(s%60)).padStart(2,'0')}`;
            if (tempoAtual) tempoAtual.textContent = fmt(audio.currentTime);
            if (tempoTotal) tempoTotal.textContent = fmt(audio.duration);
        }
    });
}
 
function mudarProgresso() {
    if (audio && barraProgresso) {
        audio.currentTime = (barraProgresso.value / 100) * audio.duration;
    }
}
 
function curtir(el) {
    el.classList.toggle('liked');
    el.style.fontVariationSettings = el.classList.contains('liked') ? "'FILL' 1" : "'FILL' 0";
}
 
// =====================================================
// ABERTURA DO PRESENTE E TRANSIÇÕES CINEMATOGRÁFICAS
// =====================================================
function abrirPresente() {
    const wrapper   = document.querySelector('.gift-wrapper');
    const overlay   = document.getElementById('gift-overlay');
    const transition = document.getElementById('transition-screen');
    const mainSite  = document.getElementById('main-site');
    const polaroids = document.querySelectorAll('.polaroid');
    const polaroidsContainer = document.getElementById('polaroids-container');
    const loadingContainer = document.getElementById('loading-container');
    const heartWrapper = document.getElementById('heart-fill-wrapper');
    const heartLoader  = document.getElementById('heart-loader');
    const loadingText  = document.getElementById('loading-text');
 
    if (!wrapper || wrapper.classList.contains('opened')) return;
    wrapper.classList.add('opened');
 
    setTimeout(() => { if (!tocando) tocarMusica(); }, 400);
 
    setTimeout(() => {
        overlay.classList.add('hidden');
        transition.classList.remove('hidden');
        iniciarPolaroids();
    }, 900);
 
    function iniciarPolaroids() {
        setTimeout(() => polaroids[0] && polaroids[0].classList.add('drop-in'), 700);
        setTimeout(() => polaroids[1] && polaroids[1].classList.add('drop-in'), 2300);
        setTimeout(() => polaroids[2] && polaroids[2].classList.add('drop-in'), 3900);
 
        setTimeout(() => {
            if(polaroids[0]) polaroids[0].classList.add('slide-out-left');
            if(polaroids[1]) polaroids[1].classList.add('slide-out-bottom');
            if(polaroids[2]) polaroids[2].classList.add('slide-out-right');
        }, 7000);
 
        setTimeout(() => {
            if (polaroidsContainer) polaroidsContainer.classList.add('hidden');
            iniciarDownload();
        }, 8000);
    }
 
    function iniciarDownload() {
        if (loadingContainer) loadingContainer.classList.remove('hidden');
 
        const steps = [
            [600,  '30%',  'Iniciando download de memórias...'],
            [2400, '60%',  'Sintetizando momentos inesquecíveis...'],
            [4400, '88%',  'Preparando o coração...'],
            [6200, '100%', 'Pronto para amar! ❤️'],
        ];
 
        steps.forEach(([delay, height, text]) => {
            setTimeout(() => {
                if (heartWrapper) heartWrapper.style.height = height;
                if (loadingText) loadingText.textContent = text;
            }, delay);
        });
 
        setTimeout(() => {
            if (heartLoader) heartLoader.classList.add('explode');
            if (loadingText) loadingText.style.opacity = '0';
        }, 7200);
 
        setTimeout(() => {
            if (transition) transition.classList.add('hidden');
            if (mainSite) {
                mainSite.classList.remove('hidden-site');
                mainSite.style.opacity = '0';
                mainSite.style.transform = 'translateY(20px)';
                requestAnimationFrame(() => {
                    mainSite.style.transition = 'opacity 1s ease, transform 1s ease';
                    mainSite.style.opacity = '1';
                    mainSite.style.transform = 'translateY(0)';
                });
            }
        }, 8600);
    }
}
 
// =====================================================
// CONTADOR PROGRESSIVO (DATA DE INÍCIO)
// =====================================================
const dataInicio = new Date(2022, 0, 5, 0, 0, 0); // 05 de Janeiro de 2022
 
function atualizarContador() {
    const diff = new Date() - dataInicio;
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
 
    const el = (id, val) => {
        const e = document.getElementById(id);
        if (e) e.textContent = String(val).padStart(2, '0');
    };
    el('dias', d); el('horas', h); el('minutos', m); el('segundos', s);
}
setInterval(atualizarContador, 1000);
atualizarContador();
 
// =====================================================
// QUIZ INTERATIVO — FUGA DO NÃO + ACEITOU
// =====================================================
function fuga() {
    const btn = document.getElementById('btn-nao');
    if (!btn) return;
    btn.style.position = 'fixed';
    btn.style.left = Math.random() * (window.innerWidth - 130) + 'px';
    btn.style.top  = Math.random() * (window.innerHeight - 70) + 'px';
    btn.style.zIndex = '9999';
}
 
function aceitou() {
    const pergunta = document.getElementById('pergunta');
    const botoes   = document.querySelector('.buttons');
    const btnNao   = document.getElementById('btn-nao');
    
    if (btnNao) btnNao.remove();
    if (botoes) botoes.style.display = 'none';
 
    if (pergunta) {
        pergunta.innerHTML = `
            <div class="acceptance-message">
                <strong>Eu já sabia! ❤️</strong>
                Feliz Dia dos Namorados, meu amor.<br>
                Você é e sempre será o amor da minha vida.
            </div>
        `;
    }
    explosaoDeAmor();
}
 
// =====================================================
// CARROSSEL E LIGHTBOX DE FOTOS
// =====================================================
function slideCarrossel(btn, dir) {
    const container = btn.closest('.carousel-wrapper').querySelector('.scroll-container');
    if (container) container.scrollLeft += dir * 300;
}
 
let fotosDoAlbumAtual = [];
let indiceFotoAtual   = 0;
 
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.scroll-container').forEach(container => {
        const imgs = container.querySelectorAll('.scroll-item img');
        imgs.forEach((img, i) => {
            img.addEventListener('click', () => {
                fotosDoAlbumAtual = Array.from(imgs).map(im => im.src);
                indiceFotoAtual   = i;
                abrirModal();
            });
        });
    });
});
 
function abrirModal() {
    const modal = document.getElementById('image-modal');
    if (modal) { modal.style.display = 'flex'; atualizarFotoModal(); }
}
 
function atualizarFotoModal() {
    const img = document.getElementById('img-modal-target');
    const ind = document.getElementById('modal-indicator');
    if (img) img.src = fotosDoAlbumAtual[indiceFotoAtual];
    if (ind) ind.textContent = `${indiceFotoAtual + 1} / ${fotosDoAlbumAtual.length}`;
}
 
function fotoProxima(e) {
    if (e) e.stopPropagation();
    indiceFotoAtual = (indiceFotoAtual + 1) % fotosDoAlbumAtual.length;
    atualizarFotoModal();
}
 
function fotoAnterior(e) {
    if (e) e.stopPropagation();
    indiceFotoAtual = (indiceFotoAtual - 1 + fotosDoAlbumAtual.length) % fotosDoAlbumAtual.length;
    atualizarFotoModal();
}
 
function fecharModal(e) {
    if (e.target.id === 'image-modal' || e.target.className === 'close-modal') {
        const modal = document.getElementById('image-modal');
        if (modal) modal.style.display = 'none';
    }
}
 
document.addEventListener('keydown', e => {
    const modal = document.getElementById('image-modal');
    if (modal && modal.style.display === 'flex') {
        if (e.key === 'ArrowRight') fotoProxima(null);
        if (e.key === 'ArrowLeft')  fotoAnterior(null);
        if (e.key === 'Escape')     modal.style.display = 'none';
    }
});
 
// =====================================================
// FUNÇÃO "ME FAÇA SORRIR"
// =====================================================
const motivos = [
    "Seu sorriso ilumina até o meu dia mais escuro.",
    "Eu amo o jeito que seus olhos brilham quando você fala do que gosta.",
    "Com você, qualquer lugar do mundo parece a minha casa.",
    "Meu coração ainda bate mais forte toda vez que o meu celular avisa que é você.",
    "Você é, de longe, a melhor parte de todos os meus dias.",
    "Eu amo a nossa sintonia e como a gente se entende no olhar.",
    "Se eu tivesse que escolher de novo, escolheria você um milhão de vezes.",
    "Sua risada é a minha música favorita no mundo todo.",
    "A vida é muito mais leve e colorida desde que você chegou.",
    "Eu me apaixono por você todos os dias como se fosse a primeira vez."
];
 
function gerarMotivo() {
    const texto = document.getElementById('motivo-texto');
    if (!texto) return;
    texto.classList.remove('visible');
 
    setTimeout(() => {
        const idx = Math.floor(Math.random() * motivos.length);
        texto.textContent = `"${motivos[idx]}"`;
        texto.classList.add('visible');
    }, 400);
}
 
// =====================================================
// EXPLOSÃO RADIAL DE AMOR (CORAÇÕES EFÊMEROS)
// =====================================================
function explosaoDeAmor() {
    const container = document.getElementById('love-explosion');
    if (!container) return;
    for (let i = 0; i < 90; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.classList.add('explosion-heart');
            heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
            heart.style.left = '50%';
            heart.style.top  = '50%';
            heart.style.setProperty('--x', ((Math.random() - 0.5) * window.innerWidth * 1.6) + 'px');
            heart.style.setProperty('--y', ((Math.random() - 0.5) * window.innerHeight * 1.6) + 'px');
            heart.style.fontSize = (Math.random() * 24 + 16) + 'px';
            container.appendChild(heart);
            setTimeout(() => heart.remove(), 3000);
        }, Math.random() * 600);
    }
}