// Hoja con todas las opciones del creador de cadete y 12 cadetes al azar, para revisión visual.
import { abrir, BASE, CAPTURAS } from './comun.mjs';
const { navegador, pagina: p, errores } = await abrir({ tactil: false, ancho: 1024, alto: 768 });
await p.goto(`${BASE}/index.html?debug`, { waitUntil: 'networkidle' });
await p.evaluate(() => { localStorage.clear(); });
await p.fill('#inNombre', 'Hoja');
await p.click('.form-nombre button');
await p.waitForSelector('.creador');
await p.screenshot({ path: `${CAPTURAS}creador.png` });
// Una fila por peinado (con distintas pieles y detalles) y una fila de cadetes al azar
await p.click('[data-azar]');
await p.waitForTimeout(200);
await p.screenshot({ path: `${CAPTURAS}creador-azar.png` });
for (const t of ['cara', 'detalles']) { await p.click(`[data-pest="${t}"]`); await p.screenshot({ path: `${CAPTURAS}creador-${t}.png` }); }
console.log(errores);
await navegador.close();
