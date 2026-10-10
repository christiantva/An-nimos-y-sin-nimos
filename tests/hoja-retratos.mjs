// Genera una hoja con todos los personajes y expresiones para revisión visual.
import { chromium } from 'playwright';
const base = process.argv[2] ?? 'http://localhost:8123';
const salida = new URL('./capturas/', import.meta.url).pathname;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1400, height: 900 } });
await p.goto(`${base}/muestra.html`, { waitUntil: 'networkidle' });
await p.evaluate(() => {
  const filas = Object.entries(PERSONAJES).filter(([id]) => id !== 'cadete').map(([id, per]) =>
    `<tr><th>${per.nombre}</th>${per.exp.map((e) => `<td>${per.dibujo(e, {})}<br>${e}</td>`).join('')}</tr>`);
  filas.push(`<tr><th>ROBI chullo / Nebu gris</th><td>${robi('normal', { accesorio: 'chullo' })}</td><td>${robi('feliz', { accesorio: 'chullo' })}</td><td>${nebu('normal', { gris: true })}</td><td>${nebu('triste', { gris: true })}</td></tr>`);
  AVATARES.forEach((_, i) => filas.push(`<tr><th>Avatar ${i + 1}</th>${EXP_BASE.map((e) => `<td>${cadete(i, e)}<br>${e}</td>`).join('')}</tr>`));
  document.querySelector('main').remove();
  document.querySelector('#galeria').remove();
  document.body.style.cssText = 'display:block;height:auto;background:#fff;overflow:visible';
  const t = document.createElement('table');
  t.innerHTML = filas.join('');
  t.style.cssText = 'font:12px sans-serif;text-align:center';
  t.querySelectorAll('svg').forEach((s) => { s.style.width = '150px'; s.style.height = '150px'; });
  document.body.appendChild(t);
});
await p.screenshot({ path: `${salida}hoja-retratos.png`, fullPage: true });
await b.close();
