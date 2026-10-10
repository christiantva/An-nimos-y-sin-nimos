// Panel docente: clave, resultados, CSV, exportar/importar resultados entre equipos, banco de palabras,
// ajustes del aula y reinicio de un alumno. Uso: node tests/docente.mjs [tactil|mouse]
import { readFileSync, writeFileSync } from 'node:fs';
import { abrir, BASE, CAPTURAS } from './comun.mjs';

const modo = process.argv[2] ?? 'mouse';
const tactil = modo === 'tactil';
const { navegador, pagina: p, errores } = await abrir({ tactil, ancho: 1366, alto: 768, nombre: `docente-${modo}` });
const tocar = (sel) => (tactil ? p.locator(sel).first().tap() : p.locator(sel).first().click());
const comprobaciones = {};
const ok = (k, v) => { comprobaciones[k] = !!v; };

await p.goto(`${BASE}/index.html?debug`, { waitUntil: 'networkidle' });
await p.evaluate(() => localStorage.clear());
await p.reload({ waitUntil: 'networkidle' });
// Dos alumnos con resultados de ejemplo
await p.evaluate(() => {
  const { Alumnos } = window.MP;
  const base = (nombre, av) => ({ clave: nombre.toLowerCase(), nombre, avatar: av, creado: Date.now(), ultimaSesion: Date.now(), tiempoSeg: 900, paso: 5, energia: 5, progreso: null,
    planetas: { 1: { completado: true, estrellas: 3, precision: 95 }, 2: { completado: true, estrellas: 2, precision: 80 } },
    stats: { sinonimo: { a: 14, e: 1 }, antonimo: { a: 12, e: 3 }, oracion: { a: 0, e: 0 }, clasificacion: { a: 0, e: 0 } },
    fallos: { alto: 2, 'cerdo': 1 }, insignias: ['racha5'], llaves: ['gemela', 'espejo'], palabras: ['contento', 'bajo'], puntos: 300, racha: 0, mejorRacha: 6,
    nave: { color: '#ff8fb8', calcomanias: [] }, robiAccesorio: null, terminado: false });
  Alumnos.guardar(base('José Pérez', 1));
  Alumnos.guardar(base('Ñusta Quispe', 4));
});
await p.reload({ waitUntil: 'networkidle' });
ok('listaInicio', await p.locator('.lista-alumnos button').count() === 2);

await tocar('#btnDocente');
await p.fill('#pantallaModal input[type=password]', '9999');
await tocar('#pantallaModal [type=submit]');
ok('claveIncorrecta', (await p.locator('#pantallaModal .error').textContent()) === 'Clave incorrecta.');
await p.fill('#pantallaModal input[type=password]', '1234');
await tocar('#pantallaModal [type=submit]');
await p.waitForSelector('.docente table');
ok('tablaResultados', await p.locator('.docente tbody tr').count() === 2);

// Ajustes del aula
await tocar('[data-tab="ajustes"]');
await p.fill('[data-k="ie"]', 'I.E. N.° 1234 «Señor de los Milagros»');
await p.fill('[data-k="docente"]', 'Rocío Ñañez');
await p.fill('[data-k="grado"]', '3.er grado');
await p.fill('[data-k="seccion"]', 'B');
await p.fill('[data-k="equipo"]', 'Tablet 07');
await tocar('.ajustes [type=submit]');
ok('ajustesGuardados', (await p.locator('.docente .mensajes .ok').textContent()).includes('guardados'));
await p.screenshot({ path: `${CAPTURAS}${modo}-docente-ajustes.png` });

// CSV
await tocar('[data-tab="resultados"]');
const [d1] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), tocar('[data-acc="csv"]')]);
await d1.saveAs(`${CAPTURAS}${modo}-docente.csv`);
const csv = readFileSync(`${CAPTURAS}${modo}-docente.csv`);
const texto = csv.toString('utf8');
ok('csvBOM', csv[0] === 0xEF && csv[1] === 0xBB && csv[2] === 0xBF);
ok('csvTildes', texto.includes('Ñusta Quispe') && texto.includes('José Pérez') && texto.includes('Rocío Ñañez') && texto.includes('Señor de los Milagros'));
ok('csvFilas', texto.trim().split('\r\n').length === 3);

// Exportar resultados de este equipo e importarlos como si fueran de otro equipo
const [d2] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), tocar('[data-acc="exportar"]')]);
const rutaJson = `${CAPTURAS}${modo}-equipo.json`;
await d2.saveAs(rutaJson);
const datos = JSON.parse(readFileSync(rutaJson, 'utf8'));
ok('exportJson', datos.app === 'mision-palabra' && datos.alumnos.length === 2 && datos.equipo === 'Tablet 07');
datos.equipo = 'Tablet 12';
datos.alumnos = datos.alumnos.map((a) => ({ ...a, nombre: `${a.nombre} (T12)` }));
const otro = `${CAPTURAS}${modo}-tablet12.json`;
writeFileSync(otro, JSON.stringify(datos));
writeFileSync(`${CAPTURAS}${modo}-basura.json`, '{"hola": 1}');
await p.setInputFiles('[data-archivo]', [otro, `${CAPTURAS}${modo}-basura.json`]);
await p.waitForSelector('.docente .mensajes .adv');
ok('importarMensaje', (await p.locator('.docente .mensajes').textContent()).includes('Importados: 1'));
ok('importarFilas', await p.locator('.docente tbody tr').count() === 4);
const [d3] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), tocar('[data-acc="csv"]')]);
await d3.saveAs(`${CAPTURAS}${modo}-salon.csv`);
const salon = readFileSync(`${CAPTURAS}${modo}-salon.csv`, 'utf8');
ok('csvSalon', salon.trim().split('\r\n').length === 5 && salon.includes('Tablet 12') && salon.includes('Ñusta Quispe (T12)'));
await p.screenshot({ path: `${CAPTURAS}${modo}-docente-salon.png` });

// Reiniciar un alumno (con confirmación)
await tocar('[data-reiniciar="0"]');
await tocar('.pantalla [data-r="0"]');
ok('cancelarReinicio', (await p.evaluate(() => window.MP.Alumnos.lista().every((a) => a.puntos === 300))));
await tocar('[data-reiniciar="0"]');
await tocar('.pantalla [data-r="1"]');
ok('reinicio', (await p.evaluate(() => window.MP.Alumnos.lista().filter((a) => a.puntos === 0).length)) === 1);

// Banco: agregar fila incompleta → error; completarla → guardar; persiste al recargar
await tocar('[data-tab="banco"]');
await tocar('[data-acc="agregar"]');
await tocar('[data-acc="guardar"]');
ok('bancoValida', await p.locator('.docente .mensajes .error').count() > 0);
const fila = p.locator('.docente tbody tr').last();
await fila.locator('[data-campo="palabra"]').fill('feliz');
await fila.locator('[data-campo="correcta"]').fill('dichoso');
await fila.locator('[data-dis="0"]').fill('triste');
await fila.locator('[data-dis="1"]').fill('mojado');
await fila.locator('[data-dis="2"]').fill('lento');
await fila.locator('[data-campo="ejemplo"]').fill('Me siento dichoso con mi familia.');
await tocar('[data-acc="guardar"]');
ok('bancoGuardado', (await p.locator('.docente .mensajes .ok').count()) > 0);
await p.screenshot({ path: `${CAPTURAS}${modo}-docente-banco.png` });
const [d4] = await Promise.all([p.waitForEvent('download', { timeout: 10000 }), tocar('[data-acc="exportar"]')]);
await d4.saveAs(`${CAPTURAS}${modo}-banco.json`);
ok('bancoExportado', JSON.parse(readFileSync(`${CAPTURAS}${modo}-banco.json`, 'utf8')).sinonimos.length === 41);
await p.reload({ waitUntil: 'networkidle' });
ok('bancoPersiste', await p.evaluate(() => window.MP.banco().sinonimos.length === 41));
ok('ajustesPersisten', await p.evaluate(() => window.MP.ajustes().docente === 'Rocío Ñañez'));
await tocar('#btnDocente');
await p.fill('#pantallaModal input[type=password]', '1234');
await tocar('#pantallaModal [type=submit]');
await tocar('[data-tab="banco"]');
await tocar('[data-acc="restaurar"]');
await tocar('.pantalla [data-r="1"]');
ok('bancoRestaurado', await p.evaluate(() => window.MP.banco().sinonimos.length === 40));
await tocar('[data-cerrar]');
ok('cierraPanel', await p.locator('#pantallaModal').isHidden());

await navegador.close();
const fallidas = Object.entries(comprobaciones).filter(([, v]) => !v).map(([k]) => k);
console.log(JSON.stringify({ modo, comprobaciones, fallidas, errores }, null, 2));
process.exit(fallidas.length || errores.length ? 1 : 0);
