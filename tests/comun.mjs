// Utilidades compartidas por las pruebas: servidor local, Three.js desde una copia local y registro de errores.
import { chromium } from 'playwright';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const BASE = process.env.BASE ?? 'http://localhost:8123';
export const CAPTURAS = fileURLToPath(new URL('./capturas/', import.meta.url));
const THREE_LOCAL = process.env.THREE_DIR ?? fileURLToPath(new URL('./vendor/three/', import.meta.url));

export async function abrir({ tactil = true, ancho = 1280, alto = 800, nombre = 'prueba' } = {}) {
  const navegador = await chromium.launch();
  const contexto = await navegador.newContext({
    viewport: { width: ancho, height: alto }, hasTouch: tactil, isMobile: tactil, deviceScaleFactor: tactil ? 1.5 : 1, acceptDownloads: true, locale: 'es-PE',
  });
  // El contenedor de pruebas no llega a jsDelivr: se sirve la misma versión de Three.js desde npm.
  if (existsSync(THREE_LOCAL)) {
    await contexto.route('https://cdn.jsdelivr.net/npm/three@0.160.0/**', (route) => {
      const ruta = new URL(route.request().url()).pathname.replace('/npm/three@0.160.0/', '');
      route.fulfill({ status: 200, contentType: 'application/javascript', body: readFileSync(THREE_LOCAL + ruta) });
    });
  }
  const pagina = await contexto.newPage();
  const errores = [];
  // Avisos del WebGL por software de este contenedor (sin GPU): no vienen del juego.
  const delEntorno = /GL Driver Message|swiftshader|GroupMarkerNotSet|GPU stall/i;
  pagina.on('console', (m) => {
    if ((m.type() === 'error' || m.type() === 'warning') && !delEntorno.test(m.text())) errores.push(`[${nombre}] ${m.type()}: ${m.text()}`);
  });
  pagina.on('pageerror', (e) => errores.push(`[${nombre}] pageerror: ${e.message}`));
  return { navegador, contexto, pagina, errores };
}
