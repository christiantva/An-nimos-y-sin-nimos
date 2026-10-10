// Depuración: juega hasta el primer error y muestra el estado interno en cada paso.
import { abrir, BASE } from './comun.mjs';
const { navegador, pagina: p, errores } = await abrir({ tactil: true });
await p.goto(`${BASE}/index.html?debug&rapido`, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear()); await p.reload({ waitUntil: 'networkidle' });
await p.fill('#inNombre', 'Test'); await p.locator('.form-nombre button').tap();
await p.locator('[data-av="1"]').tap(); await p.locator('[data-ok]').tap();
const snap = async (tag) => console.log(tag, JSON.stringify(await p.evaluate(() => ({
  vn: !document.querySelector('#vn').classList.contains('oculta'), texto: document.querySelector('#vnTexto').textContent.slice(0, 40),
  etiquetas: [...document.querySelectorAll('.etiqueta')].map((e) => `${e.className}:${e.textContent}`),
  pausado: window.MP.Motor.pausado, bloq: window.MP.Motor.bloqueado, opciones: window.MP.Motor.opciones.map((o) => o.estado),
  fase: window.MP.Juego.prog?.fase, i: window.MP.Juego.prog?.i, alElegir: !!window.MP.Motor.alElegir,
}))));
for (let k = 0; k < 60; k++) {
  if (await p.locator('#vn:not(.oculta)').isVisible()) { if (await p.locator('#vnOpciones button').count()) await p.locator('#vnOpciones button').first().tap({ force: true }); else await p.locator('#vnMarco').tap({ force: true }); continue; }
  const malo = p.locator('.etiqueta[data-ok="0"]:not(.apagada)');
  if (await malo.count()) { await snap('antes'); await malo.first().tap({ force: true }); await p.waitForTimeout(500); await snap('tras-error'); break; }
  await p.waitForTimeout(100);
}
for (let k = 0; k < 12; k++) { await snap(`paso${k}`); if (await p.locator('#vn:not(.oculta)').isVisible()) await p.locator('#vnMarco').tap({ force: true }); await p.waitForTimeout(300); }
console.log(errores);
await navegador.close();
