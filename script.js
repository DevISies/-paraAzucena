document.body.classList.remove('not-loaded');

function resizeFlowers() {
  var el = document.querySelector('.flowers');
  if (!el) return;
  var vw = window.visualViewport ? window.visualViewport.width : window.innerWidth;
  var vh = window.visualViewport ? window.visualViewport.height : window.innerHeight;
  var vmin = Math.min(vw, vh);
  var vmax = Math.max(vw, vh);
  var isLandscape = vw > vh;
  var isSmallHeight = vh < 560;
  var isNarrow = vw < 420;

  // Espacio reservado arriba (texto) + abajo (botón + ramo + safe-area)
  var textReserve = Math.max(46, Math.min(118, vh * 0.11)); // texto + padding
  var btnReserve = isSmallHeight ? 44 : 72;
  var ramoReserve = isSmallHeight ? vh * 0.08 : Math.max(54, vh * 0.09);
  // Si es landscape bajo, el ramo es más pequeño
  if (isLandscape && isSmallHeight) ramoReserve = 28;

  var availableH = vh - textReserve - btnReserve - ramoReserve;
  var availableW = vw - 20; // margen lateral 10px cada lado

  // Tamaño natural del bouquet a escala 1
  // WEB (>=1025px) se mantiene EXACTO como original (1.45*vmin) para no agrandar
  var naturalH, naturalW;
  if (vw >= 1025) {
    naturalH = 1.45 * vmin; // original web
    naturalW = 100 * vmin / 100;
  } else {
    naturalH = isLandscape && isSmallHeight ? 88 * vmin / 100 : 108 * vmin / 100;
    naturalW = 96 * vmin / 100;
  }

  // En pantallas muy angostas el ancho manda más que el alto
  var scaleH = availableH / naturalH;
  var scaleW = availableW / naturalW;
  var scale = Math.min(scaleH, scaleW);

  // Clamp fino - móvil encaja sin recorte, WEB respeta tamaño original
  var minScale, maxScale;
  if (vw <= 320) { minScale = 0.42; maxScale = 0.62; }
  else if (vw <= 360) { minScale = 0.46; maxScale = 0.70; }
  else if (vw <= 390) { minScale = 0.50; maxScale = 0.78; } // iPhone 12/13/14
  else if (vw <= 430) { minScale = 0.54; maxScale = 0.84; } // iPhone 14 Pro Max, Pixel
  else if (vw <= 480) { minScale = 0.56; maxScale = 0.88; }
  else if (vw <= 768) { minScale = 0.60; maxScale = 0.94; } // tablets portrait
  else if (vw <= 1024) { minScale = 0.45; maxScale = 1.00; } // tablet landscape - original
  else if (vw <= 1440) { minScale = 0.45; maxScale = 1.00; } // web - ORIGINAL - no agrandar
  else if (vw <= 1920) { minScale = 0.45; maxScale = 1.00; } // web grande - ORIGINAL
  else { minScale = 0.45; maxScale = 1.00; } // 4K - mantiene original

  // En landscape bajo reduce un poco más para no cortar
  if (isLandscape && vh < 500) maxScale = Math.min(maxScale, 0.72);
  if (isLandscape && vh < 400) maxScale = Math.min(maxScale, 0.58);

  // Pantallas muy alargadas (20:9, 21:9) - prioriza ancho
  if (vmax / vmin > 2.1 && isNarrow) scale = Math.min(scale, scaleW * 0.98);

  scale = Math.max(minScale, Math.min(maxScale, scale));
  // Suaviza decimales para evitar subpixel jitter
  scale = Math.round(scale * 1000) / 1000;
  el.style.setProperty('--scale', scale);
  el.style.transform = 'scale(' + scale + ')';
}

resizeFlowers();

// Debounce resize + orientationchange + visualViewport
var resizeTimeout;
function debouncedResize() {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(resizeFlowers, 80);
}
window.addEventListener('resize', debouncedResize);
window.addEventListener('orientationchange', function() {
  setTimeout(resizeFlowers, 200);
});
if (window.visualViewport) {
  window.visualViewport.addEventListener('resize', debouncedResize);
}

setTimeout(function() {
  var ramo = document.querySelector('.ramo');
  if (ramo) ramo.classList.add('ramo--visible');
}, 2500);

var __tulipRainStarted = false;
var __startTulipRain = null;

document.addEventListener('DOMContentLoaded', function() {
    const body = document.querySelector('body');
    let animationPaused = false;
    let createInterval;
    
    // Ajusta densidad según pantalla / performance
    function getIntervalTime() {
      var w = window.innerWidth;
      if (w < 380) return 900; // menos flores en móviles muy pequeños
      if (w < 768) return 750;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 2000;
      return 600;
    }
    let intervalTime = getIntervalTime();
    
    // Pausar si pestaña no visible (ahorra batería)
    document.addEventListener('visibilitychange', function() {
      animationPaused = document.hidden;
    });
    window.addEventListener('resize', function() {
      if (!__tulipRainStarted) return;
      var newInterval = getIntervalTime();
      if (newInterval !== intervalTime) {
        intervalTime = newInterval;
        startTulipRain();
      }
    });

    // NO inicia automáticamente - espera al botón PRESIONE
    
    function createTulip() {
        if (animationPaused) return;
        if (document.hidden) return;
        
        const tulip = document.createElement('div');
        tulip.classList.add('tulip');
        
        const posX = Math.random() * window.innerWidth;
        tulip.style.left = `${posX}px`;
        
        // Wrapper interno para escalar sin conflicto con animación fall
        const scaleSize = Math.random() * 0.6 + 0.7;
        // En móviles reduce ligeramente el tamaño base
        var responsiveScale = window.innerWidth < 480 ? scaleSize * 0.85 : scaleSize;
        
        const duration = Math.random() * 5 + 10;
        tulip.style.animationDuration = `${duration}s`;
        
        tulip.style.opacity = String(Math.random() * 0.5 + 0.4);
        
        tulip.innerHTML = `
            <div class="tulip__inner" style="transform: scale(${responsiveScale})">
                <div class="flowerss__leafsss">
                    <div class="flowerss__leafss flowerss__leafss--1"></div>
                    <div class="flowerss__leafss flowerss__leafss--2"></div>
                    <div class="flowerss__leafss flowerss__leafss--3"></div>
                    <div class="flowerss__leafss flowerss__leafss--4"></div>
                    <div class="flowerss__leafss flowerss__leafss--5"></div>
                    <div class="flowerss__leafss flowerss__leafss--6"></div>
                    <div class="flowerss__centerss"></div>
                </div>
                <div class="flowerss__liness">
                    <div class="flowerss__liness__leafss flowerss__liness__leafss--1"></div>
                    <div class="flowerss__liness__leafss flowerss__liness__leafss--2"></div>
                    <div class="flowerss__liness__leafss flowerss__liness__leafss--3"></div>
                    <div class="flowerss__liness__leafss flowerss__liness__leafss--4"></div>
                </div>
            </div>
        `;
        
        body.appendChild(tulip);
        
        // Limpieza correcta: duración real + buffer
        setTimeout(() => {
            if (tulip.parentNode) {
                tulip.remove();
            }
        }, duration * 1000 + 800);
    }
    
    function startTulipRain() {
        if (__tulipRainStarted && createInterval) clearInterval(createInterval);
        __tulipRainStarted = true;
        createInterval = setInterval(createTulip, intervalTime);
        
        var initialCount = window.innerWidth < 480 ? 2 : 4;
        for (let i = 0; i < initialCount; i++) {
            setTimeout(createTulip, i * 900);
        }
    }

    // Expone para que el botón pueda iniciarla
    __startTulipRain = startTulipRain;
    window.__startTulipRain = startTulipRain;
});

// --- Audio FloricientaFlores.mp3 controlado por botón #playBtn ---
document.addEventListener('DOMContentLoaded', function() {
  var audio = document.getElementById('floriAudio');
  var btn = document.getElementById('playBtn');
  if (!audio || !btn) return;

  audio.volume = 0.9;
  audio.preload = 'auto';

  btn.addEventListener('click', async function() {
    try {
      await audio.play();
      // Inicia la lluvia de tulipanes solo al presionar PRESIONE
      if (window.__startTulipRain && !__tulipRainStarted) {
        window.__startTulipRain();
      } else if (__startTulipRain && !__tulipRainStarted) {
        __startTulipRain();
      }
      // Oculta el botón con transición suave al presionar
      btn.classList.add('hidden');
      // Lo quita del flujo después de la transición para no captar clicks
      setTimeout(function() {
        btn.style.display = 'none';
      }, 550);
    } catch (e) {
      console.warn('No se pudo reproducir el audio:', e);
      // Aun si falla el audio, igual inicia la lluvia para no dejar la pantalla vacía
      if (window.__startTulipRain && !__tulipRainStarted) window.__startTulipRain();
      btn.textContent = 'Error - toca de nuevo';
      setTimeout(function() { btn.textContent = 'Presiona'; }, 1800);
    }
  });

  audio.addEventListener('error', function() {
    console.error('Error cargando FloricientaFlores.mp3');
    btn.textContent = 'Audio no disponible';
    btn.disabled = true;
  });
});
