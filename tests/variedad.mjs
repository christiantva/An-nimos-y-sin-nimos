// ¿Qué tan distintas son las preguntas entre alumnos? Simula 30 alumnos y compara cada par.
import { abrir, BASE } from './comun.mjs';
const { navegador, pagina: p, errores } = await abrir({ tactil: false });
await p.goto(`${BASE}/index.html?debug`, { waitUntil: 'networkidle' });
const r = await p.evaluate(() => {
  const { Juego, Preguntas } = window.MP;
  const N = 30, planetas = {};
  for (const n of [1, 2, 3, 4, 5]) {
    const alumnos = Array.from({ length: N }, () => {
      Juego.alumno = { vistos: {} };
      const fases = n === 5 ? ['jefe'] : ['oleada', 'jefe'];
      return fases.flatMap((f) => Preguntas.armar(n, f)).map((ref) => {
        const q = Preguntas.crear(ref);
        const objetivo = q.tipo === 'clasificacion' ? q.par.join('·') : q.tipo === 'oracion' ? q.item.texto : q.palabra;
        return { objetivo, correcta: q.opciones.findIndex((o) => o.ok) };
      });
    });
    let mismaPregunta = 0, mismaPosicion = 0, pares = 0, comunes = 0, total = 0;
    for (let i = 0; i < N; i++) for (let j = i + 1; j < N; j++) {
      const a = alumnos[i], b = alumnos[j];
      const largo = Math.min(a.length, b.length);
      for (let k = 0; k < largo; k++) {
        pares++;
        if (a[k].objetivo === b[k].objetivo) { mismaPregunta++; if (a[k].correcta === b[k].correcta) mismaPosicion++; }
      }
      const sa = new Set(a.map((x) => x.objetivo));
      comunes += b.filter((x) => sa.has(x.objetivo)).length; total += b.length;
    }
    planetas[n] = {
      'misma pregunta al mismo tiempo (%)': +(100 * mismaPregunta / pares).toFixed(1),
      'misma pregunta y respuesta en el mismo lugar (%)': +(100 * mismaPosicion / pares).toFixed(1),
      'preguntas que comparten en todo el planeta (%)': +(100 * comunes / total).toFixed(0),
    };
  }
  return planetas;
});
console.log(JSON.stringify(r, null, 1), errores);
await navegador.close();
