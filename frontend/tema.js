// tema.js - Aplicado em TODAS as telas do sistema

// 1. Carregar preferências IMEDIATAMENTE (Evita a tela piscar)
if (localStorage.getItem('tema') === 'light') {
    document.body.classList.add('light-mode');
}
if (localStorage.getItem('daltonico') === 'true') {
    document.body.classList.add('daltonico-mode');
}

// 2. Esperar a tela carregar para ligar os botões
document.addEventListener('DOMContentLoaded', () => {
    const btnSettings = document.getElementById('btn-settings');
    const modalSettings = document.getElementById('modal-settings');
    const toggleTema = document.getElementById('toggle-tema');
    const toggleDaltonismo = document.getElementById('toggle-daltonismo');
    const fecharSettings = document.getElementById('fechar-settings');
    let escudo = document.getElementById('escudo-bloqueio');

    // Se a página não tiver o escudo, a gente cria um invisível rapidinho
    if (!escudo && modalSettings) {
        escudo = document.createElement('div');
        escudo.id = 'escudo-bloqueio';
        escudo.classList.add('bloqueio-tela');
        document.body.appendChild(escudo);
    }

    if (toggleTema) {
        toggleTema.textContent = document.body.classList.contains('light-mode') ? '☀️ Modo Claro Ativo' : '🌙 Modo Escuro Ativo';
    }
    if (toggleDaltonismo) {
        toggleDaltonismo.textContent = document.body.classList.contains('daltonico-mode') ? '👁️ Modo Daltônico: Ligado' : '👁️ Modo Daltônico: Desligado';
    }

    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            modalSettings.classList.remove('escondido');
            escudo.classList.add('ativo');
        });
    }

    if (fecharSettings) {
        fecharSettings.addEventListener('click', () => {
            modalSettings.classList.add('escondido');
            escudo.classList.remove('ativo');
        });
    }

    if (toggleTema) {
        toggleTema.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            localStorage.setItem('tema', isLight ? 'light' : 'dark');
            toggleTema.textContent = isLight ? '☀️ Modo Claro Ativo' : '🌙 Modo Escuro Ativo';
        });
    }

    if (toggleDaltonismo) {
        toggleDaltonismo.addEventListener('click', () => {
            document.body.classList.toggle('daltonico-mode');
            const isDaltonico = document.body.classList.contains('daltonico-mode');
            localStorage.setItem('daltonico', isDaltonico ? 'true' : 'false');
            toggleDaltonismo.textContent = isDaltonico ? '👁️ Modo Daltônico: Ligado' : '👁️ Modo Daltônico: Desligado';
        });
    }

    // --- LÓGICA DA SPLASH SCREEN (TELA DE ABERTURA) ---
    const splash = document.getElementById('splash-screen');
    if (splash) {
        // Dá um tempo de 1 segundo (1000ms) mostrando a animação
        setTimeout(() => {
            splash.classList.add('esconder-splash');
            
            // Espera meio segundo para a animação de sumiço acabar e arranca ela do HTML
            setTimeout(() => {
                splash.remove();
            }, 500); 
        }, 1000); 
    }
});