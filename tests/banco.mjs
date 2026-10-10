// Revisa el banco de palabras de index.html: que cada reactivo tenga una sola respuesta válida.
import { readFileSync } from 'node:fs';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const banco = JSON.parse(html.slice(html.indexOf('/*BANCO_INICIO*/') + 16, html.indexOf('/*BANCO_FIN*/')));
const n = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
const problemas = [], avisos = [];

// Relaciones conocidas por el propio banco (en ambos sentidos).
const sin = new Map(), ant = new Map();
const unir = (m, a, b) => { [[a, b], [b, a]].forEach(([x, y]) => { if (!m.has(n(x))) m.set(n(x), new Set()); m.get(n(x)).add(n(y)); }); };
banco.sinonimos.forEach((it) => unir(sin, it.palabra, it.correcta));
banco.antonimos.forEach((it) => unir(ant, it.palabra, it.correcta));
// Sinónimos de una palabra, contando la cadena de gemelas del banco.
const familia = (w) => { const vistos = new Set([n(w)]), cola = [n(w)]; while (cola.length) { const x = cola.pop(); (sin.get(x) ?? []).forEach((y) => { if (!vistos.has(y)) { vistos.add(y); cola.push(y); } }); } return vistos; };

const ids = new Set();
for (const [lista, tipo, nDis] of [[banco.sinonimos, 'sinónimo', 3], [banco.antonimos, 'antónimo', 3], [banco.oraciones, 'oración', 2]]) {
  const niveles = { 1: 0, 2: 0, 3: 0 };
  for (const it of lista) {
    const ref = `${it.id} (${tipo}: ${it.palabra ?? it.texto})`;
    if (ids.has(it.id)) problemas.push(`${ref}: id repetido`);
    ids.add(it.id);
    niveles[it.nivel] = (niveles[it.nivel] ?? 0) + 1;
    const dis = it.distractores ?? [];
    if (dis.length !== nDis || dis.some((d) => !d)) problemas.push(`${ref}: necesita ${nDis} distractores`);
    if (new Set(dis.map(n)).size !== dis.length) problemas.push(`${ref}: distractores repetidos`);
    if (dis.some((d) => n(d) === n(it.correcta))) problemas.push(`${ref}: un distractor es la respuesta correcta`);
    if (tipo === 'oración') {
      if ((it.texto.match(/___/g) ?? []).length !== 1) problemas.push(`${ref}: debe tener exactamente un ___`);
      continue;
    }
    if (dis.some((d) => n(d) === n(it.palabra))) problemas.push(`${ref}: la palabra objetivo aparece como opción`);
    if (!it.ejemplo || !n(it.ejemplo).includes(n(it.correcta).slice(0, 4))) avisos.push(`${ref}: la oración de ejemplo no usa la respuesta`);
    if (tipo === 'sinónimo') {
      // Ningún distractor puede ser también gemela (según el banco) de la palabra o de la respuesta.
      const fam = new Set([...familia(it.palabra), ...familia(it.correcta)]);
      dis.forEach((d) => { if (fam.has(n(d))) problemas.push(`${ref}: «${d}» también sería gemela`); });
    } else {
      // Ningún distractor puede ser espejo de la palabra (ni gemela de la respuesta correcta).
      const espejos = new Set([...(ant.get(n(it.palabra)) ?? []), ...familia(it.correcta)]);
      dis.forEach((d) => { if (espejos.has(n(d))) problemas.push(`${ref}: «${d}» también sería espejo`); });
    }
  }
  console.log(`${tipo}: ${lista.length} reactivos · niveles ${JSON.stringify(niveles)}`);
}
console.log(avisos.length ? `Avisos:\n- ${avisos.join('\n- ')}` : 'Sin avisos.');
console.log(problemas.length ? `PROBLEMAS:\n- ${problemas.join('\n- ')}` : 'Sin problemas: cada reactivo tiene una sola respuesta válida según el banco.');
process.exit(problemas.length ? 1 : 0);
