// ═══════════════════════════════════════════════════════════
// PWA INSTALL PROMPT - Sistema de instalación elegante
// ═══════════════════════════════════════════════════════════

let deferredPrompt = null;
let installPromptShown = false;

// Detectar el evento de instalación
window.addEventListener('beforeinstallprompt', (e) => {
    // Prevenir que Chrome muestre su mini-infobar automático
    e.preventDefault();
    
    // Guardar el evento para usarlo después
    deferredPrompt = e;
    
    console.log('💾 PWA instalable detectada');
    
    // Mostrar el banner personalizado después de 3 segundos
    // (da tiempo al usuario de ver la página primero)
    setTimeout(() => {
        if (!installPromptShown) {
            showInstallBanner();
        }
    }, 3000);
});

// Detectar cuando la app fue instalada
window.addEventListener('appinstalled', (e) => {
    console.log('✅ PWA instalada exitosamente');
    
    // Ocultar el banner si está visible
    hideInstallBanner();
    
    // Opcional: Mostrar mensaje de éxito
    showSuccessMessage();
    
    // Limpiar el prompt guardado
    deferredPrompt = null;
});

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PARA MOSTRAR EL BANNER DE INSTALACIÓN
// ═══════════════════════════════════════════════════════════
function showInstallBanner() {
    // Verificar si ya fue instalada o si el usuario ya lo rechazó antes
    if (localStorage.getItem('pwa-install-dismissed') === 'true') {
        return; // No molestar si el usuario ya dijo que no
    }
    
    // Verificar si ya está instalada
    if (window.matchMedia('(display-mode: standalone)').matches) {
        return; // Ya está instalada
    }
    
    installPromptShown = true;
    
    // Crear el HTML del banner
    const banner = document.createElement('div');
    banner.id = 'pwa-install-banner';
    banner.className = 'pwa-install-banner';
    banner.innerHTML = `
        <div class="pwa-banner-content">
            <button class="pwa-close-btn" id="pwa-close" aria-label="Cerrar">×</button>
            
            <div class="pwa-icon">
                <img src="./pwa/icon-192.png" alt="Crossing River Icon">
            </div>
            
            <div class="pwa-text">
                <h3>¡Instala Crossing THAT River! 🎮</h3>
                <p>Juega sin conexión y accede más rápido desde tu pantalla de inicio</p>
            </div>
            
            <div class="pwa-buttons">
                <button class="pwa-install-btn" id="pwa-install">
                    ⬇️ Instalar App
                </button>
                <button class="pwa-later-btn" id="pwa-later">
                    Más tarde
                </button>
            </div>
        </div>
    `;
    
    // Agregar al body
    document.body.appendChild(banner);
    
    // Animación de entrada
    setTimeout(() => {
        banner.classList.add('show');
    }, 100);
    
    // Event listeners
    document.getElementById('pwa-install').addEventListener('click', installPWA);
    document.getElementById('pwa-close').addEventListener('click', dismissInstallBanner);
    document.getElementById('pwa-later').addEventListener('click', () => {
        hideInstallBanner();
        // Volver a mostrar en 24 horas
        setTimeout(showInstallBanner, 24 * 60 * 60 * 1000);
    });
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PARA INSTALAR LA PWA
// ═══════════════════════════════════════════════════════════
async function installPWA() {
    if (!deferredPrompt) {
        console.log('⚠️ No hay prompt de instalación disponible');
        return;
    }
    
    // Mostrar el prompt nativo
    deferredPrompt.prompt();
    
    // Esperar la respuesta del usuario
    const { outcome } = await deferredPrompt.userChoice;
    
    console.log(`Usuario respondió: ${outcome}`);
    
    if (outcome === 'accepted') {
        console.log('✅ Usuario aceptó instalar');
    } else {
        console.log('❌ Usuario rechazó instalar');
    }
    
    // Limpiar el prompt
    deferredPrompt = null;
    
    // Ocultar el banner
    hideInstallBanner();
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PARA OCULTAR EL BANNER
// ═══════════════════════════════════════════════════════════
function hideInstallBanner() {
    const banner = document.getElementById('pwa-install-banner');
    if (banner) {
        banner.classList.remove('show');
        setTimeout(() => {
            banner.remove();
        }, 300);
    }
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PARA RECHAZAR PERMANENTEMENTE
// ═══════════════════════════════════════════════════════════
function dismissInstallBanner() {
    localStorage.setItem('pwa-install-dismissed', 'true');
    hideInstallBanner();
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN PARA MOSTRAR MENSAJE DE ÉXITO
// ═══════════════════════════════════════════════════════════
function showSuccessMessage() {
    const success = document.createElement('div');
    success.className = 'pwa-success-message';
    success.innerHTML = `
        <div class="pwa-success-content">
            ✅ ¡App instalada con éxito!
        </div>
    `;
    
    document.body.appendChild(success);
    
    setTimeout(() => {
        success.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        success.classList.remove('show');
        setTimeout(() => success.remove(), 300);
    }, 3000);
}

// ═══════════════════════════════════════════════════════════
// FUNCIÓN OPCIONAL: Botón manual de instalación
// Si quieres agregar un botón en tu UI para instalar
// ═══════════════════════════════════════════════════════════
function setupManualInstallButton() {
    const installBtn = document.getElementById('manual-install-btn');
    
    if (installBtn) {
        // Mostrar solo si la PWA es instalable
        window.addEventListener('beforeinstallprompt', (e) => {
            installBtn.style.display = 'block';
        });
        
        // Ocultar si ya está instalada
        if (window.matchMedia('(display-mode: standalone)').matches) {
            installBtn.style.display = 'none';
        }
        
        installBtn.addEventListener('click', installPWA);
    }
}

// Inicializar botón manual si existe
window.addEventListener('DOMContentLoaded', setupManualInstallButton);