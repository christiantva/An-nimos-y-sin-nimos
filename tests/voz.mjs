// Comprueba la voz con un motor de voz simulado (el navegador de pruebas no tiene voces):
// frases largas en trozos, cola sin cortes, interrupción al avanzar y recuperación si el motor se cuelga.
import { abrir, BASE } from './comun.mjs';

const { navegador, pagina: p, errores } = await abrir({ tactil: true, nombre: 'voz' });
await p.addInitScript(() => {
  window.__habla = [];
  const voz = { name: 'Google español de Estados Unidos', lang: 'es-US' };
  const motor = {
    speaking: false, pending: false, paused: false, colgar: false, _q: [], _cur: null,
    getVoices: () => [voz], addEventListener() {},
    speak(u) { this._q.push(u); this.pending = true; this._run(); },
    _run() {
      if (this._cur || !this._q.length) { this.pending = this._q.length > 0; return; }
      const u = this._cur = this._q.shift();
      this.pending = this._q.length > 0;
      this.speaking = true;
      setTimeout(() => {
        if (this._cur !== u) return;
        u.onstart?.();
        window.__habla.push({ t: u.text, ev: 'inicio' });
        if (this.colgar) { this.colgar = false; this._cur = null; this.speaking = false; window.__habla.push({ t: u.text, ev: 'colgada' }); return; }
        u._timer = setTimeout(() => {
          if (this._cur !== u) return;
          this._cur = null; this.speaking = false;
          window.__habla.push({ t: u.text, ev: 'fin' });
          u.onend?.();
          this._run();
        }, 12 * u.text.length);
      }, 10);
    },
    cancel() {
      const u = this._cur;
      this._q = []; this.pending = false;
      if (u) { clearTimeout(u._timer); this._cur = null; this.speaking = false; window.__habla.push({ t: u.text, ev: 'cortada' }); u.onerror?.({ error: 'interrupted' }); }
    },
    pause() {}, resume() {},
  };
  Object.defineProperty(window, 'speechSynthesis', { value: motor, configurable: true });
  window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
});
await p.goto(`${BASE}/index.html?debug`, { waitUntil: 'networkidle' });
const esperarHabla = (ms) => p.waitForTimeout(ms);
const habla = () => p.evaluate(() => window.__habla);
const limpiar = () => p.evaluate(() => { window.__habla = []; });
const res = {};

// 1. Texto largo: se dice completo, en trozos, sin cortes
const largo = '¡Casi! La gemela de CARA es ROSTRO: significan lo mismo. Por ejemplo: «Me lavo el rostro cada mañana». Esa palabra volverá más adelante, así que presta mucha atención, cadete, porque ROBI confía en ti y en todo lo que sabes.';
await p.evaluate((t) => window.MP.Voz.decir(t), largo);
await esperarHabla(5000);
let h = await habla();
res.largoEnTrozos = h.filter((x) => x.ev === 'fin').length >= 2;
res.largoCompleto = h.filter((x) => x.ev === 'fin').map((x) => x.t).join(' ').replace(/\s+/g, ' ').includes('todo lo que sabes.');
res.largoSinCortes = !h.some((x) => x.ev === 'cortada');

// 2. Cola: la lectura de la pregunta espera a que termine la frase anterior
await limpiar();
await p.evaluate(() => { window.MP.Voz.decir('Las gemelas significan lo mismo. ¡Toca el meteorito con la palabra gemela!'); window.MP.Voz.decir('¿Cuál es la palabra gemela de alegre?', {}, { encolar: true }); });
await esperarHabla(4000);
h = await habla();
res.colaSinCortes = !h.some((x) => x.ev === 'cortada') && h.filter((x) => x.ev === 'fin').map((x) => x.t).join(' ').includes('gemela!') && h.at(-1).t.includes('alegre');

// 3. Avanzar el diálogo sí corta la frase anterior (comportamiento esperado)
await limpiar();
await p.evaluate(() => { window.MP.Voz.decir('Primera frase bastante larga que el alumno no quiere esperar.'); });
await esperarHabla(200);
await p.evaluate(() => window.MP.Voz.decir('Segunda frase.'));
await esperarHabla(2000);
h = await habla();
res.avanzarCorta = h.some((x) => x.ev === 'cortada' && x.t.startsWith('Primera')) && h.some((x) => x.ev === 'fin' && x.t === 'Segunda frase.');

// 4. Si el motor se cuelga sin avisar, la voz se recupera y sigue con la siguiente frase
await limpiar();
await p.evaluate(() => { window.speechSynthesis.colgar = true; window.MP.Voz.decir('Frase uno que se cuelga. Y esta es la frase dos, que también debe escucharse completa aunque la anterior haya fallado sin avisar.'); });
await esperarHabla(4500);
h = await habla();
res.recuperaColgada = h.some((x) => x.ev === 'colgada') && h.some((x) => x.ev === 'fin' && x.t.includes('frase dos'));

// 5. En el juego real: la última línea de ROBI antes de la primera pregunta no se corta
await limpiar();
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await p.fill('#inNombre', 'Voz');
await p.locator('.form-nombre button').tap();
await p.locator('[data-av="0"]').tap();
await p.locator('[data-ok]').tap();
for (let k = 0; k < 200 && !(await p.locator('#objetivo:not([hidden])').count()); k++) {
  if (await p.locator('#vn:not(.oculta)').isVisible()) {
    if (await p.locator('#vnOpciones button').count()) await p.locator('#vnOpciones button').first().tap({ force: true });
    else { await esperarHabla(150); await p.locator('#vnMarco').tap({ force: true }); }
  } else await esperarHabla(100);
}
await esperarHabla(4000);
h = await habla();
const ultima = h.filter((x) => x.t.includes('Mantén el dedo'));
res.juegoUltimaLinea = ultima.some((x) => x.ev === 'fin') && !ultima.some((x) => x.ev === 'cortada');
res.juegoLeePregunta = h.some((x) => x.ev === 'fin' && x.t.includes('palabra gemela de'));

// 6. Mantener presionada una palabra la lee y NO la elige
await p.waitForSelector('.etiqueta[data-ok]:not(.apagada)');
await p.waitForTimeout(600);
const antes = await p.evaluate(() => ({ e: window.MP.Juego.alumno.energia, i: window.MP.Juego.prog.i }));
await limpiar();
const etiqueta = p.locator('.etiqueta[data-ok="0"]:not(.apagada)').first();
const texto = (await etiqueta.textContent()).trim();
const caja = await etiqueta.boundingBox();
await p.mouse.move(caja.x + caja.width / 2, caja.y + caja.height / 2);
await p.mouse.down();
await p.waitForTimeout(800);
await p.mouse.up();
await p.waitForTimeout(1500);
h = await habla();
const despues = await p.evaluate(() => ({ e: window.MP.Juego.alumno.energia, i: window.MP.Juego.prog.i }));
res.mantenerLee = h.some((x) => x.t === texto);
res.mantenerNoElige = antes.e === despues.e && antes.i === despues.i && !(await p.locator('#vn:not(.oculta)').isVisible());

// 7. El cofre abre el diccionario y pausa el juego
await p.locator('#cofre').tap();
res.diccionarioAbre = await p.locator('.diccionario').isVisible();
res.diccionarioPausa = await p.evaluate(() => window.MP.Motor.pausado);
await p.screenshot({ path: new URL('./capturas/voz-diccionario.png', import.meta.url).pathname });
await p.locator('.diccionario [data-cerrar]').tap();
res.diccionarioCierra = !(await p.locator('.diccionario').count()) && !(await p.evaluate(() => window.MP.Motor.pausado));

await navegador.close();
const fallidas = Object.entries(res).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ res, fallidas, errores }, null, 2));
process.exit(fallidas.length || errores.length ? 1 : 0);
