// Recorre la muestra con táctil (tablet) y con mouse (laptop), registra errores de consola y toma capturas.
// Uso: node tests/muestra.mjs [urlBase]
import { chromium } from 'playwright';

const base = process.argv[2] ?? 'http://localhost:8123';
const salida = new URL('./capturas/', import.meta.url).pathname;
const errores = [];

async function recorrer(nombre, opciones, tocar) {
  const navegador = await chromium.launch();
  const ctx = await navegador.newContext(opciones);
  const page = await ctx.newPage();
  page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(`[${nombre}] ${m.type()}: ${m.text()}`); });
  page.on('pageerror', (e) => errores.push(`[${nombre}] pageerror: ${e.message}`));
  await page.goto(`${base}/muestra.html`, { waitUntil: 'networkidle' });
  await page.screenshot({ path: `${salida}${nombre}-0-inicio.png` });
  await tocar(page, '#btnEmpezar');
  let pasos = 0, capturas = 0;
  while (pasos++ < 120) {
    if (await page.locator('#fin').isVisible()) break;
    const opciones = page.locator('#vnOpciones button');
    if (await opciones.count()) {
      if (capturas++ < 3) await page.screenshot({ path: `${salida}${nombre}-opciones-${capturas}.png` });
      await tocar(page, '#vnOpciones button >> nth=0');
      continue;
    }
    // primer toque completa el texto, el segundo avanza
    await tocar(page, '#vnTexto');
    await page.waitForTimeout(120);
    if (pasos === 1 || pasos === 14 || pasos === 30) await page.screenshot({ path: `${salida}${nombre}-paso-${pasos}.png` });
  }
  const fin = await page.locator('#fin').isVisible();
  // historial
  await page.screenshot({ path: `${salida}${nombre}-fin.png` });
  await page.click('[data-tab="galeria"]');
  await page.screenshot({ path: `${salida}${nombre}-galeria.png`, fullPage: true });
  await navegador.close();
  return { fin, pasos };
}

const tablet = await recorrer('tablet', { viewport: { width: 1280, height: 800 }, hasTouch: true, isMobile: true, deviceScaleFactor: 1.5 },
  (p, s) => p.tap(s));
const laptop = await recorrer('laptop', { viewport: { width: 1366, height: 768 } },
  (p, s) => p.click(s));

console.log(JSON.stringify({ tablet, laptop, errores }, null, 2));
process.exit(errores.length || !tablet.fin || !laptop.fin ? 1 : 0);
