// Partida completa de principio a fin (táctil o mouse), con errores a propósito, recarga de energía,
// escáner, recarga de la página a mitad de la misión, panel docente y CSV.
// Uso: node tests/juego.mjs [tactil|mouse]
import { readFileSync } from 'node:fs';
import { abrir, BASE, CAPTURAS } from './comun.mjs';

const modo = process.argv[2] ?? 'tactil';
const tactil = modo === 'tactil';
const { navegador, pagina: p, errores } = await abrir({ tactil, ancho: tactil ? 1280 : 1366, alto: tactil ? 800 : 768, nombre: modo });
// Los meteoritos se mueven y desaparecen: si un toque no llega a tiempo, el bucle simplemente vuelve a mirar.
const tocar = async (sel) => {
  const el = p.locator(sel).first();
  try { if (tactil) await el.tap({ force: true, timeout: 3000 }); else await el.click({ force: true, timeout: 3000 }); return true; } catch { return false; }
};
const visible = (sel) => p.locator(sel).first().isVisible().catch(() => false);
const estado = () => p.evaluate(() => { const J = window.MP?.Juego; const a = J?.alumno; return a ? { paso: a.paso, energia: a.energia, n: J.n, fase: J.prog?.fase, terminado: a.terminado } : null; });
const fotos = new Set();
const foto = async (nombre) => { if (fotos.has(nombre)) return; fotos.add(nombre); await p.screenshot({ path: `${CAPTURAS}${modo}-${nombre}.png` }); };

await p.goto(`${BASE}/index.html?debug&rapido`, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
await foto('00-inicio');
await p.fill('#inNombre', 'María Ñahui');
await tocar('.form-nombre button');
await p.waitForSelector('.creador');
await tocar('[data-k="peinado"] [data-v="erizo"]');
await tocar('[data-pest="cara"]');
await tocar('[data-k="cejas"] [data-v="gruesas"]');
await tocar('[data-k="piel"] [data-v="#8d5a3b"]');
await tocar('[data-pest="detalles"]');
await tocar('[data-k="extra"] [data-v="lentes"]');
await foto('01-creador');
await tocar('[data-ok]');
const avatarGuardado = await p.evaluate(() => window.MP.Juego.alumno?.avatar ?? JSON.parse(localStorage.getItem('mp:v1:alumnos'))['maria nahui'].avatar);
if (avatarGuardado?.peinado !== 'erizo' || avatarGuardado?.extra !== 'lentes' || avatarGuardado?.piel !== '#8d5a3b') errores.push(`Avatar no guardado: ${JSON.stringify(avatarGuardado)}`);

let errAPropósito = { p1: 0, p3: 0 }, escanerUsado = false, recargado = false, reparoVisto = false, pasos = 0;
const t0 = Date.now();
let ultimoLog = 0;
while (pasos++ < 6000 && Date.now() - t0 < 25 * 60000) {
  if (await visible('[data-r="practica"]')) break;
  const e = await estado();
  if (Date.now() - ultimoLog > 15000) { ultimoLog = Date.now(); console.log(`[${((Date.now() - t0) / 1000).toFixed(0)} s] ${JSON.stringify(e)}`); }
  // Recarga de la página después de terminar el planeta 1: el progreso debe recuperarse.
  if (!recargado && e && e.paso >= 3) {
    recargado = true;
    const antes = e.paso;
    await p.reload({ waitUntil: 'networkidle' });
    await foto('10-inicio-con-lista');
    await tocar('.lista-alumnos button');
    await p.waitForTimeout(300);
    const despues = await estado();
    if (!despues || despues.paso !== antes) errores.push(`Progreso no recuperado tras recargar: antes ${antes}, después ${JSON.stringify(despues)}`);
    continue;
  }
  if (await visible('#vn:not(.oculta)')) {
    if (await visible('#vnOpciones button')) { await foto('05-eleccion'); await tocar('#vnOpciones button'); }
    else { await tocar('#vnMarco'); }
    continue;
  }
  if (await visible('.etiqueta[data-ok="1"]:not(.apagada)') && await p.locator('.etiqueta[data-ok]:not(.apagada)').count() >= 2) {
    // Planeta 1: un error a propósito. Planeta 3: errores hasta quedarse sin energía.
    if (e?.n === 1 && errAPropósito.p1 < 1 && e.fase === 'oleada') { errAPropósito.p1++; await foto('02-pregunta'); await tocar('.etiqueta[data-ok="0"]:not(.apagada)'); await p.waitForTimeout(200); await foto('03-error'); continue; }
    if (e?.n === 3 && e.energia > 0 && !reparoVisto && e.fase === 'oleada') { if (await tocar('.etiqueta[data-ok="0"]:not(.apagada)')) errAPropósito.p3++; continue; }
    if (e?.n === 2 && !escanerUsado && await p.locator('#btnEscaner:not([disabled])').count()) { escanerUsado = true; await tocar('#btnEscaner'); await p.waitForTimeout(150); await foto('06-escaner'); }
    if (e?.fase === 'jefe') await foto(`07-jefe-p${e.n}`);
    if (e?.n === 4) await foto('08-portales');
    if (e?.n === 3) await foto('09-oracion');
    await tocar('.etiqueta[data-ok="1"]:not(.apagada)');
    continue;
  }
  if (await visible('.reparar-grid')) {
    reparoVisto = true;
    await foto('11-reparar');
    const pares = await p.$$eval('.reparar-grid button:not(.unida)', (bs) => bs.map((b) => [b.dataset.i, b.dataset.par]));
    const grupo = {};
    pares.forEach(([i, par]) => (grupo[par] ??= []).push(i));
    for (const [a, b] of Object.values(grupo)) { await tocar(`[data-i="${a}"]`); await tocar(`[data-i="${b}"]`); }
    await p.waitForSelector('[data-fin]:not([hidden]) [data-ok]');
    await tocar('[data-fin] [data-ok]');
    continue;
  }
  if (await visible('.llaves [data-k]:not(.puesta)')) { await foto('12-megafono'); await tocar('.llaves [data-k]:not(.puesta)'); continue; }
  if (await visible('.pausa')) { await foto('13-pausa-activa'); await p.waitForSelector('[data-sig]:not([disabled])', { timeout: 20000 }); await tocar('[data-sig]'); continue; }
  if (await visible('[data-continuar]')) {
    await foto(`14-recompensas`);
    if (!(await p.evaluate(() => window.MP.Juego.alumno.nave.calcomanias.length))) { await tocar('[data-calco="estrella"]'); await tocar('[data-color="#7cc8ff"]'); await tocar('[data-acc="flor"]'); await foto('15-personalizada'); }
    if (await p.locator('[data-estela="hielo"]:not([disabled])').count() && (await p.evaluate(() => window.MP.Juego.alumno.nave.estela)) === 'fuego') { await tocar('[data-estela="hielo"]'); await tocar('[data-acc="bufanda"]:not([disabled])'); await foto('15b-estela-bufanda'); }
    await tocar('[data-continuar]');
    continue;
  }
  if (await visible('.diploma-img')) { await p.waitForTimeout(300); await foto('16-diploma'); await tocar('[data-r="ok"]'); continue; }
  if (await visible('#pantalla [data-ok]:not([disabled])')) { await tocar('#pantalla [data-ok]'); continue; }
  await p.waitForTimeout(50);
}
const final = await estado();
const extras = await p.evaluate(() => ({ estela: window.MP.Juego.alumno?.nave?.estela, accesorio: window.MP.Juego.alumno?.robiAccesorio, rescatadas: window.MP.Juego.alumno?.rescatadas?.length }));
const minutos = ((Date.now() - t0) / 60000).toFixed(1);
await foto('17-mision-cumplida');

// Panel docente y CSV
await tocar('[data-r="salir"]');
await p.waitForSelector('#btnDocente:not([hidden])');
await tocar('#btnDocente');
await p.fill('#pantallaModal input[type=password]', '0000');
await tocar('#pantallaModal [type=submit]');
const claveMala = await p.locator('#pantallaModal .error').textContent();
await p.fill('#pantallaModal input[type=password]', '1234');
await tocar('#pantallaModal [type=submit]');
await p.waitForSelector('.docente table');
await foto('18-docente-resultados');
const [descarga] = await Promise.all([p.waitForEvent('download'), tocar('[data-acc="csv"]')]);
const ruta = `${CAPTURAS}${modo}-resultados.csv`;
await descarga.saveAs(ruta);
const bytes = readFileSync(ruta);
const csv = bytes.toString('utf8');
const csvOk = bytes[0] === 0xEF && bytes[1] === 0xBB && bytes[2] === 0xBF && csv.includes('María Ñahui') && csv.includes('Clasificación aciertos') && csv.includes('Sinónimos');
await tocar('[data-tab="banco"]');
await foto('19-docente-banco');
await tocar('[data-tab="ajustes"]');
await foto('20-docente-ajustes');

await navegador.close();
const resumen = { modo, minutos, final, extras, errAPropósito, escanerUsado, recargado, reparoVisto, claveMala, csvOk, primeraLineaCSV: csv.split('\r\n')[0].slice(1, 120), filaAlumno: csv.split('\r\n')[1]?.slice(0, 200), errores };
console.log(JSON.stringify(resumen, null, 2));
process.exit(!final?.terminado || !csvOk || !reparoVisto || errores.length ? 1 : 0);
