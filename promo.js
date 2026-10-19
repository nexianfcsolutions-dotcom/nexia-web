// Aviso de la promoción de primera compra (diseño gratis). Los datos salen de precios.js (P.promoDiseno):
// si la promo se desactiva allí (activa: false), este aviso deja de salir. Se carga después de precios.js.
// Sale a los pocos segundos, abajo a la izquierda, y si el visitante lo cierra no vuelve a salir en 30 días.
(function () {
  var P = window.NEXIA_PRECIOS;
  if (!P || !P.promoDiseno || !P.promoDiseno.activa) return;
  var CLAVE = 'nexia-promo-diseno-cerrada', DIAS = 30;
  try { var t = Number(localStorage.getItem(CLAVE)); if (t && Date.now() - t < DIAS * 864e5) return; } catch (e) { /* sin almacenamiento: se muestra */ }

  var css = '' +
    '.nxp{position:fixed;left:20px;bottom:20px;z-index:40;width:min(360px,calc(100vw - 112px));box-sizing:border-box;padding:20px 20px 18px;border-radius:12px;' +
    'background:#10172A;color:#E6ECF5;font-family:"DM Sans",system-ui,sans-serif;box-shadow:0 18px 40px rgba(16,23,42,.35);border:1px solid rgba(0,193,202,.35);' +
    'opacity:0;transform:translateY(16px);transition:opacity .35s ease,transform .35s ease}' +
    '.nxp.on{opacity:1;transform:none}' +
    '.nxp-tag{display:inline-block;margin:0 0 10px;padding:4px 10px;border-radius:999px;background:rgba(0,193,202,.14);color:#00C1CA;font:500 12px/1.4 "DM Mono",ui-monospace,monospace;letter-spacing:.04em;text-transform:uppercase}' +
    '.nxp h2{margin:0 32px 6px 0;font:800 22px/1.15 "Archivo",system-ui,sans-serif;color:#FFFFFF}' +
    '.nxp p{margin:0 0 14px;font-size:15px;line-height:1.45;color:#C9D2E0}' +
    '.nxp a.nxp-cta{display:inline-flex;align-items:center;min-height:44px;padding:0 18px;border-radius:8px;background:#00C1CA;color:#10172A;font-weight:700;font-size:15px;text-decoration:none}' +
    '.nxp a.nxp-cta:hover{background:#33D3DA}' +
    '.nxp button{position:absolute;top:10px;right:10px;width:36px;height:36px;border:0;border-radius:50%;background:transparent;color:#9FB0CB;font-size:22px;line-height:1;cursor:pointer}' +
    '.nxp button:hover{background:rgba(255,255,255,.08);color:#FFFFFF}' +
    '.nxp a:focus-visible,.nxp button:focus-visible{outline:2px solid #00C1CA;outline-offset:2px}' +
    '@media (max-width:520px){.nxp{left:12px;bottom:12px;width:calc(100vw - 96px);padding:16px 16px 14px}.nxp h2{font-size:19px}}' +
    '@media (prefers-reduced-motion:reduce){.nxp{transition:none}}';

  function mostrar() {
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
    var d = document.createElement('div');
    d.className = 'nxp'; d.setAttribute('role', 'dialog'); d.setAttribute('aria-labelledby', 'nxp-t');
    d.innerHTML = '<span class="nxp-tag">Primera compra</span>' +
      '<h2 id="nxp-t">Tu diseño, gratis</h2>' +
      '<p>En tu primer pedido de ' + P.promoDiseno.minUnidades + ' o más tarjetas, el diseño a medida con tu logo y tus colores lo hacemos gratis (ahorras ' + P.fmt(P.diseno) + ').</p>' +
      '<a class="nxp-cta" href="configurar.html">Configurar mi pedido</a>' +
      '<button type="button" aria-label="Cerrar aviso">×</button>';
    var cerrar = function () {
      try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) { /* nada */ }
      d.classList.remove('on'); setTimeout(function () { d.remove(); }, 350);
      document.removeEventListener('keydown', esc);
    };
    var esc = function (e) { if (e.key === 'Escape') cerrar(); };
    d.querySelector('button').addEventListener('click', cerrar);
    d.querySelector('a').addEventListener('click', function () { try { localStorage.setItem(CLAVE, String(Date.now())); } catch (e) { /* nada */ } });
    document.addEventListener('keydown', esc);
    document.body.appendChild(d);
    requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
  }
  var empezar = function () { setTimeout(mostrar, 4000); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', empezar); else empezar();
})();
