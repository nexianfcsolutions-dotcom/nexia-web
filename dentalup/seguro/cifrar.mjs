// Cifra el contenido de la zona del seguro de Dental Up y genera contenido.js.
//
// Uso (desde la raíz del repositorio):
//   node dentalup/seguro/cifrar.mjs /ruta/fuera/del/repo/contenido-seguro.html
// Pide la contraseña dos veces (no se ve al escribirla). También se puede pasar
// en la variable SEGURO_CLAVE.
//
// - El archivo con el texto sin cifrar NO debe estar dentro del repositorio
//   (todo lo que hay en el repo se publica). Parte de plantilla-contenido.html.
// - Cada vez que se ejecuta cambia la sal: quien tuviera la contraseña recordada
//   en el móvil tendrá que volver a escribirla (y si cambias la contraseña, la nueva).
// - Contraseña: mejor tres o cuatro palabras y un número (p. ej. «perla-menta-azul-27»).
//   Es la misma para todos los asegurados; si alguien se da de baja, cámbiala.
// - Sin la contraseña no hay forma de recuperar el contenido desde contenido.js:
//   guarda el archivo original.

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, resolve, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { webcrypto as crypto } from "node:crypto";

const ITERACIONES = 600000; // PBKDF2-SHA256 (recomendación OWASP)
const aqui = dirname(fileURLToPath(import.meta.url));
const repo = resolve(aqui, "..", "..");

function preguntar(texto) {
  return new Promise(ok => {
    const rl = createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = s => { if (s.startsWith(texto)) process.stdout.write(s); };
    rl.question(texto, r => { rl.close(); process.stdout.write("\n"); ok(r); });
  });
}

const origen = process.argv[2];
if (!origen) {
  console.error("Uso: node dentalup/seguro/cifrar.mjs /ruta/al/contenido.html");
  process.exit(1);
}
const ruta = resolve(origen);
const rel = relative(repo, ruta);
if (!rel.startsWith("..") && !rel.endsWith("plantilla-contenido.html")) {
  console.error("El contenido sin cifrar está dentro del repositorio (" + rel + ").\nMuévelo fuera para que no se publique.");
  process.exit(1);
}

let clave = process.env.SEGURO_CLAVE;
if (!clave) {
  clave = await preguntar("Contraseña: ");
  if (clave !== await preguntar("Repite la contraseña: ")) { console.error("No coinciden."); process.exit(1); }
}
clave = clave.trim();
if (clave.length < 8) { console.error("La contraseña debe tener al menos 8 caracteres."); process.exit(1); }

// Se quitan los comentarios HTML para que no se cuelen notas internas.
const html = readFileSync(ruta, "utf8").replace(/<!--[\s\S]*?-->/g, "").trim();

const sal = crypto.getRandomValues(new Uint8Array(16));
const iv = crypto.getRandomValues(new Uint8Array(12));
const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(clave), "PBKDF2", false, ["deriveKey"]);
const key = await crypto.subtle.deriveKey(
  { name: "PBKDF2", hash: "SHA-256", salt: sal, iterations: ITERACIONES },
  base, { name: "AES-GCM", length: 256 }, false, ["encrypt"]
);
const datos = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, new TextEncoder().encode(html));
const b64 = b => Buffer.from(b).toString("base64");

const salida = join(aqui, "contenido.js");
writeFileSync(salida,
  "// Contenido de la zona del seguro, CIFRADO. No editar a mano: se genera con cifrar.mjs.\n" +
  "window.SEGURO_CIFRADO = " + JSON.stringify({
    v: 1, iteraciones: ITERACIONES, sal: b64(sal), iv: b64(iv), datos: b64(datos)
  }, null, 2) + ";\n");
console.log("Listo: " + relative(repo, salida) + " (" + html.length + " caracteres cifrados).");
