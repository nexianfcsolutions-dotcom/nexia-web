# NEXIA · web (nexianfc.com)

Web estática de NEXIA (tarjetas, placas y soportes NFC, portales web y vídeo para negocios). Se publica con GitHub Pages desde `main` (dominio en `CNAME`). No hay build ni dependencias: lo que está en el repo es lo que se sirve.

## Cómo están hechas las páginas
- Cada `.html` viene de Claude Design: el contenido va dentro de `<x-dc>…</x-dc>` y la lógica en `<script type="text/x-dc" data-dc-script>` como `class Component extends DCLogic`. Los `{{ … }}` del marcado salen de `renderVals()`.
- `support.js` es el runtime de Claude Design (React 18 empaquetado y minificado). **No editarlo.**
- Estilos en línea y un `<style>` por página; no hay CSS compartido. Cabecera y pie están copiados en cada página: un cambio de menú o pie hay que hacerlo en todas.
- Si una página se vuelve a exportar desde Claude Design, revisa que siga cargando `<script src="./precios.js"></script>` antes de `support.js` (en `configurar.html` y `precios.html`).

## Precios (importante: es dinero)
- **La única tabla de precios es `precios.js`** (sin IVA). La usan `configurar.html` (`qPrice`), `precios.html` (`pCalc`/`renderVals`) y el servidor de pagos (`nexia-pagos/lib/precios.cjs`, copia exacta).
- No escribas importes a mano en la lógica de las páginas: usa `window.NEXIA_PRECIOS` (`P.unidad(n, formato)`, `P.fmt`, `P.diseno`, …).
- `precios.html` también tiene precios escritos en el texto (tabla de lotes, extras, portales). Si cambia la tabla, hay que actualizarlos; el test de `nexia-pagos` avisa si no coinciden.
- Tras cambiar `precios.js`: en `nexia-pagos`, `npm run sync-precios && npm test`, y publicar web y pagos.
- Cobro online: `PAGO_ONLINE` en `configurar.html` (ahora solo `tarjeta`). Los pagos van a `https://nexia-pagos.netlify.app/api/crear-pago`; los pedidos sin pago fijo se envían por FormSubmit a nexianfcsolutions@gmail.com.

## Otras carpetas
- `asador/`, `dentalup/`, `reproalba/`: demos para clientes (no forman parte de la web de NEXIA; `asador/` pesa ~6 MB con vídeos).
- `pago-prueba/`: página interna de prueba del pago.
- `opiniones.json`: opiniones que muestra `opiniones.html` (ahora vacío).

## Cómo trabajar aquí
- Todo el texto de la web y los mensajes de commit van en **español**. Commits con el formato `Página o zona: qué cambia` (p. ej. `Precios: …`, `Asador v23: …`).
- Ver los cambios: `python3 -m http.server 8000` en esta carpeta y abrir `http://localhost:8000/`. Revisar en móvil (390 px de ancho) además de escritorio.
- Sin referencias a «NFC» en titulares; contacto solo por correo.
