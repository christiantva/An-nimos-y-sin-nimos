# Misión Palabra — Documento de diseño

Juego 3D de sinónimos ("palabras gemelas") y antónimos ("palabras espejo") para 3.er grado de primaria (Perú, CNEB: "Lee diversos tipos de textos escritos en su lengua materna").

Estado: **fase 1 lista para revisión** (historia, banco y plan aprobados).

---

## 1. Decisiones tomadas

| Tema | Decisión |
|---|---|
| Tecnología | Un solo `index.html`: HTML + CSS + JavaScript, Three.js por CDN (versión fija), Web Audio, Web Speech, localStorage |
| Distribución | Vercel (sitio estático conectado a este repositorio, sin build) |
| Equipos | Tablets Android y laptops Windows con Chrome |
| Duración | **Una sola sesión** de 35-40 min |
| Estilo | Combinado: diálogos tipo novela visual en tonos pastel + espacio 3D con colores saturados |
| Rostros | SVG dentro del código, por capas, con expresiones |
| Tipografía | Andika (Google Fonts) |
| Nombre | El alumno escribe su nombre; los nombres usados en el equipo aparecen como botones para continuar |
| Voz | Diálogos leídos automáticamente + botón para repetir |
| Música | Suave, volumen bajo, botón de silencio siempre visible |
| Diploma | PNG descargable + botón "Imprimir / Guardar PDF" del navegador |
| Datos del aula | Opcionales en el panel docente: IE, docente, grado, sección. Si están vacíos, no aparecen |
| Al terminar | Se desbloquea "Práctica libre" (elegir cualquier planeta) |
| Banco | Creado desde cero (no hay libro de referencia) |
| Resultados del salón | Cada equipo exporta un archivo de resultados; el docente los importa en su laptop y descarga **un solo CSV** del salón (USB, WhatsApp o Drive para moverlos) |
| Siguiente paso | Revisión de la muestra de personajes (`/muestra`) antes de la fase 2 |

### Audio sin audífonos (aula con 25-30 equipos)
- Voz a velocidad 0.9 y volumen moderado; la música baja automáticamente mientras habla la voz.
- Se leen automáticamente solo los diálogos de la historia y la palabra objetivo; las opciones no (salvo en modo apoyo).
- Efectos cortos y suaves, sin estallidos fuertes.
- Panel docente: "Voz automática" (sí/no), "Volumen general" y "Modo aula silenciosa" (solo efectos suaves y voz con botón).
- El juego entero se puede jugar sin sonido: todo lo hablado también está escrito.

### Tiempo de una partida
| Parte | Tiempo |
|---|---|
| Prólogo y avatar | 2 min |
| Planetas 1-4 (8 preguntas + jefe de 6 c/u) | 20 min |
| Estaciones (historia 30 s + pausa activa 60 s + recompensas 30 s) | 8 min |
| Corazón de la Nebulosa (8 preguntas) | 3 min |
| Final y diploma | 2 min |
| **Total** | **~35 min** |

"Reparar la nave" solo aparece si la energía está baja (máx. 1 min).

---

## 2. Historia (tono alegre)

**Premisa:** la Nebulosa Muda es una nebulosa **bebé y glotona**. No sabe hablar todavía y cree que las palabras son caramelos porque brillan. No hay que derrotarla: hay que enseñarle a hablar.

- **ROBI** tiene el chip de vocabulario mordido y confunde gemelas con espejos ("¡Buenas noches!" en la mañana). El alumno puede corregirlo con "¡Bien dicho!" / "¡Te equivocaste, ROBI!" (sin puntaje).
- **Jefes** (Copión, Revés, Borrón, Enredo) cometen errores típicos de un niño; al perder, entienden y se hacen amigos.
- **Objetivo:** 4 llaves (Gemela, Espejo, Frase, Mezcla) arman el **Megáfono Estelar** para hablarle a la nebulosa.
- El rayo de la nave es un **"rayo de voz"**: libera la palabra atrapada en el meteorito.

| Acto | Lugar | Guardián | Jefe (su error) | Premio |
|---|---|---|---|---|
| Prólogo | Base Estelar Inti | Comandante Killa | — | — |
| 1 | Planeta Gemelo (sinónimos) | Tika y Taka | Copión: cree que las gemelas "se escriben parecido" (CAMA/CAMELLO) | Llave Gemela |
| 2 | Planeta Espejo (antónimos) | Reina Rirpu | Revés: confunde espejos con gemelas ("lo contrario de feliz es contento") | Llave Espejo |
| 3 | Planeta Frase (oraciones) | Abuelo Amaru | Borrón: estornuda y borra palabras | Llave Frase + revelación: "¡es una bebé!" |
| 4 | Planeta Mezcla (clasificar) | Pichu | Enredo: ovillo que mezcla todo | Llave Mezcla |
| 5 | Corazón de la Nebulosa | — | La Nebulosa: barra "Panza llena"; cada acierto le da hipo y suelta una palabra | Galaxia recupera su voz |
| Epílogo | Fiesta de las Palabras | Todos | La nebulosa se llama **Nebu** | Diploma "Chaski Estelar" |

Elección del prólogo: "¿Cómo te sientes?" → "¡Feliz!" / "¡Alegre!" → ROBI: "¡Son palabras gemelas!".
Chiste final: NEBU "¡Hip! ¡FIN!" · COPIÓN "¿FIN y FINAL son gemelas?" · ROBI "¡Sí! ¡Esta vez acertaste!".

---

## 3. Banco de palabras (borrador para revisión)

Reglas: misma categoría gramatical en todas las opciones; ningún distractor es sinónimo (o antónimo) válido de la palabra objetivo; un distractor "trampa" (la palabra del tipo contrario) para que el niño piense; nivel 1 muestra 3 opciones, niveles 2-3 muestran 4.

### 3.1 Palabras gemelas (sinónimos) — 40

| # | Nivel | Palabra | Gemela ✔ | Distractores ✘ |
|---|---|---|---|---|
| 1 | 1 | alegre | contento | triste, mojado, lento |
| 2 | 1 | rápido | veloz | lento, pesado, sucio |
| 3 | 1 | grande | enorme | pequeño, oscuro, blando |
| 4 | 1 | bonito | lindo | feo, duro, frío |
| 5 | 1 | empezar | comenzar | terminar, dormir, saltar |
| 6 | 1 | brincar | saltar | sentarse, dormir, llorar |
| 7 | 1 | pelo | cabello | ojo, uña, boca |
| 8 | 1 | auto | carro | avión, barco, bicicleta |
| 9 | 1 | cerdo | chancho | vaca, oveja, gallina |
| 10 | 1 | maestro | profesor | alumno, doctor, bombero |
| 11 | 1 | alumno | estudiante | maestro, director, cocinero |
| 12 | 1 | cara | rostro | mano, pie, espalda |
| 13 | 1 | terminar | acabar | empezar, jugar, subir |
| 14 | 1 | caminar | andar | volar, nadar, sentarse |
| 15 | 2 | casa | hogar | escuela, parque, calle |
| 16 | 2 | limpio | aseado | sucio, roto, mojado |
| 17 | 2 | cansado | agotado | descansado, alegre, limpio |
| 18 | 2 | enojado | molesto | tranquilo, alegre, dormido |
| 19 | 2 | tirar | lanzar | atrapar, guardar, pintar |
| 20 | 2 | poner | colocar | quitar, mirar, oír |
| 21 | 2 | responder | contestar | preguntar, dormir, correr |
| 22 | 2 | regresar | volver | irse, cantar, comer |
| 23 | 2 | cuarto | habitación | jardín, techo, calle |
| 24 | 2 | tranquilo | calmado | nervioso, ruidoso, mojado |
| 25 | 2 | arreglar | reparar | romper, ensuciar, perder |
| 26 | 2 | comida | alimento | juguete, ropa, mesa |
| 27 | 2 | mirar | observar | escuchar, oler, cerrar |
| 28 | 2 | ayudar | apoyar | molestar, olvidar, dormir |
| 29 | 3 | lleno | repleto | vacío, abierto, liviano |
| 30 | 3 | sabroso | delicioso | horrible, crudo, duro |
| 31 | 3 | bajar | descender | subir, gritar, pintar |
| 32 | 3 | estrecho | angosto | ancho, largo, alto |
| 33 | 3 | antiguo | viejo | nuevo, moderno, limpio |
| 34 | 3 | famoso | conocido | desconocido, pequeño, rápido |
| 35 | 3 | sencillo | fácil | difícil, pesado, oscuro |
| 36 | 3 | dar | entregar | recibir, mirar, jugar |
| 37 | 3 | miedo | temor | valor, alegría, sueño |
| 38 | 3 | olor | aroma | sabor, color, sonido |
| 39 | 3 | hallar | encontrar | perder, esconder, buscar |
| 40 | 3 | regalo | obsequio | castigo, tarea, ruido |

### 3.2 Palabras espejo (antónimos) — 40

| # | Nivel | Palabra | Espejo ✔ | Distractores ✘ |
|---|---|---|---|---|
| 1 | 1 | alto | bajo | grande, ancho, rápido |
| 2 | 1 | frío | caliente | helado, blanco, mojado |
| 3 | 1 | abrir | cerrar | entrar, mirar, pintar |
| 4 | 1 | día | noche | sol, mañana, semana |
| 5 | 1 | grande | pequeño | enorme, alto, pesado |
| 6 | 1 | rápido | lento | veloz, ruidoso, alto |
| 7 | 1 | feliz | triste | alegre, cansado, limpio |
| 8 | 1 | lleno | vacío | repleto, grande, limpio |
| 9 | 1 | limpio | sucio | aseado, nuevo, mojado |
| 10 | 1 | entrar | salir | pasar, correr, comer |
| 11 | 1 | arriba | abajo | encima, lejos, rápido |
| 12 | 1 | mojado | seco | húmedo, frío, limpio |
| 13 | 1 | encender | apagar | prender, pintar, mirar |
| 14 | 1 | subir | bajar | trepar, saltar, cantar |
| 15 | 2 | bueno | malo | amable, grande, alto |
| 16 | 2 | nuevo | viejo | moderno, limpio, bonito |
| 17 | 2 | claro | oscuro | luminoso, blanco, limpio |
| 18 | 2 | ganar | perder | vencer, jugar, correr |
| 19 | 2 | duro | blando | fuerte, frío, alto |
| 20 | 2 | pesado | liviano | grande, duro, lento |
| 21 | 2 | mucho | poco | bastante, grande, rápido |
| 22 | 2 | cerca | lejos | junto, arriba, adentro |
| 23 | 2 | largo | corto | extenso, ancho, alto |
| 24 | 2 | reír | llorar | sonreír, saltar, comer |
| 25 | 2 | dormir | despertar | descansar, soñar, bostezar |
| 26 | 2 | primero | último | segundo, mayor, nuevo |
| 27 | 2 | recordar | olvidar | acordarse, pensar, aprender |
| 28 | 2 | empezar | terminar | comenzar, jugar, correr |
| 29 | 3 | fuerte | débil | poderoso, grande, valiente |
| 30 | 3 | verdad | mentira | cierto, palabra, pregunta |
| 31 | 3 | comprar | vender | pagar, gastar, mirar |
| 32 | 3 | preguntar | responder | consultar, escribir, leer |
| 33 | 3 | dar | recibir | regalar, entregar, mostrar |
| 34 | 3 | sumar | restar | agregar, contar, escribir |
| 35 | 3 | aparecer | desaparecer | mostrar, brillar, volar |
| 36 | 3 | ruidoso | silencioso | escandaloso, alegre, rápido |
| 37 | 3 | sano | enfermo | saludable, fuerte, limpio |
| 38 | 3 | temprano | tarde | pronto, hoy, siempre |
| 39 | 3 | generoso | egoísta | amable, alegre, bondadoso |
| 40 | 3 | ordenado | desordenado | limpio, arreglado, tranquilo |

### 3.3 Oraciones para completar — 20

Cada oración tiene una pista que deja **una sola** respuesta posible.

| # | Nivel | Oración | Correcta ✔ | Distractores ✘ |
|---|---|---|---|---|
| 1 | 1 | Mi perro corre tan ___ que siempre gana la carrera. | veloz | lento, cansado |
| 2 | 1 | La sopa está muy ___, espera a que se enfríe. | caliente | fría, dulce |
| 3 | 1 | La jirafa es muy ___, alcanza las hojas de arriba. | alta | baja, lenta |
| 4 | 1 | Hace frío, por favor ___ la ventana. | cierra | abre, pinta |
| 5 | 1 | Mi vaso está ___, no tiene nada de agua. | vacío | lleno, grande |
| 6 | 1 | Me lavé las manos y ahora están ___. | limpias | sucias, rotas |
| 7 | 1 | El sol brilla de día y la luna brilla de ___. | noche | día, lunes |
| 8 | 2 | Enciende la luz, el cuarto está muy ___. | oscuro | claro, limpio |
| 9 | 2 | La tortuga camina muy ___, por eso llega tarde. | lento | rápido, alto |
| 10 | 2 | Mi mochila tiene muchos libros, está muy ___. | pesada | liviana, limpia |
| 11 | 2 | Ganamos el partido y todos estamos muy ___. | alegres | tristes, dormidos |
| 12 | 2 | Después de jugar bajo la lluvia, mi ropa está ___. | mojada | seca, nueva |
| 13 | 2 | En la biblioteca estamos ___ para no molestar. | callados | ruidosos, mojados |
| 14 | 2 | Mi abuela me dio un ___ por mi cumpleaños: ¡una pelota! | regalo | castigo, ruido |
| 15 | 3 | La cuerda era muy ___ y no llegaba al otro lado. | corta | larga, limpia |
| 16 | 3 | Ana perdió su lápiz, pero luego lo ___ debajo de la mesa. | encontró | perdió, comió |
| 17 | 3 | El maestro preguntó "¿Cuánto es 2 + 2?" y Luis ___: "¡Cuatro!". | respondió | preguntó, durmió |
| 18 | 3 | El bebé tenía hambre y empezó a ___. | llorar | reír, volar |
| 19 | 3 | El elefante es ___, ¡mucho más grande que una casa! | enorme | pequeño, liviano |
| 20 | 3 | Mi hermanito se cayó, pero no lloró. ¡Es muy ___! | valiente | miedoso, ruidoso |

### 3.4 Uso por planeta
- **Gemelo:** 8 sinónimos (niveles 1→2) + jefe Copión 6 (niveles 2→3).
- **Espejo:** 8 antónimos (1→2) + jefe Revés 6 (2→3).
- **Frase:** 8 oraciones (1→2) + jefe Borrón 6 (2→3).
- **Mezcla:** 8 pares para clasificar (gemela/espejo) tomados de ambos bancos + jefe Enredo 6.
- **Corazón:** 8 preguntas mezcladas de todos los tipos.
- Las preguntas se sortean en cada partida; las falladas vuelven a aparecer más adelante.

---

## 4. Plan de programación

### 4.1 Archivos del repositorio
```
index.html          ← el juego completo (único archivo que se publica)
muestra.html        ← página de muestra de personajes (fase 1, se borra al final)
docs/diseno.md      ← este documento
tests/              ← pruebas automáticas con Playwright (no se publican)
vercel.json         ← solo cabeceras de caché; sin build
```

### 4.2 Librerías (por CDN, versión fija)
- `three@0.160.0` vía importmap (jsDelivr) + `CSS2DRenderer` de `three/addons`.
- Fuente Andika (Google Fonts).
- Nada más: audio, voz, guardado, CSV y diploma se hacen con APIs del navegador.

### 4.3 Estructura interna de `index.html`
| # | Sección | Responsabilidad |
|---|---|---|
| 1 | `CONFIG` | Clave docente (1234), energía (5 corazones), escáneres (2), velocidades por planeta, nº de preguntas |
| 2 | `BANCO` | Objeto JSON editable (sección 3 de este documento) |
| 3 | `GUION` | Todas las escenas: `{quien, expresion, texto, eleccion?}` con `{nombre}` |
| 4 | `PERSONAJES` | Nombre, color de marco y retrato SVG por capas con expresiones |
| 5 | `Store` | localStorage con versión y migración; tolerante a errores |
| 6 | `Audio` | Efectos y música generativa (Web Audio), silencio, "ducking" con la voz |
| 7 | `Voz` | Web Speech: elige es-PE → es-419 → es-US → es; cola, cancelar, repetir |
| 8 | `UI` | Cuadro de novela visual, HUD, pantallas (inicio, estación, panel, diploma) |
| 9 | `Motor3D` | Renderer, cámara, estrellas, nave, asteroides, planetas, portales, jefes |
| 10 | `Efectos` | Rayo de voz, partículas (pool fijo ≤ 300), estelas, palabra al cofre |
| 11 | `Preguntas` | Genera la secuencia por planeta con dificultad progresiva y cola de repaso |
| 12 | `Juego` | Máquina de estados y reglas (energía, puntos, estrellas, insignias) |
| 13 | `Minijuegos` | Reparar la nave, pausa activa, armar el megáfono |
| 14 | `Docente` | Resultados, CSV, editor del banco, importar/exportar JSON, datos del aula |
| 15 | `Diploma` | Dibujo en canvas → PNG; impresión → PDF del navegador |

### 4.4 Máquina de estados
```
INICIO → (nombre/avatar) → PROLOGO
  → PLANETA(n): ESCENA_LLEGADA → OLEADAS(8) → ESCENA_JEFE → JEFE(6) → ESCENA_VICTORIA
      energía 0 → ESTACION_RECARGA → reintenta el planeta conservando lo logrado
  → ESTACION(n): HISTORIA → PAUSA_ACTIVA(60 s) → RECOMPENSAS → [Continuar misión]
  → ... → CORAZON(8) → FINAL → DIPLOMA → PRACTICA_LIBRE
```

### 4.5 Datos guardados (localStorage)
- `mp:v1:alumnos` → `{ [nombreNormalizado]: Alumno }`
- `mp:v1:banco` → banco editado por el docente (si no existe, se usa el de fábrica)
- `mp:v1:config` → clave, datos del aula, voz automática, volumen, modo apoyo, separador CSV

```js
Alumno = {
  nombre, avatar, creado, ultimaSesion, tiempoJugadoSeg,
  planetaActual, progresoPlaneta: { cola, indice, aciertos, errores },
  planetas: { 1: { completado, estrellas, precision } , ... },
  stats: { sinonimo:{a,e}, antonimo:{a,e}, oracion:{a,e}, clasificacion:{a,e} },
  fallos: { "alegre→contento": 2, ... },
  insignias: [], llaves: [], palabrasRescatadas: [],
  nave: { color, calcomanias: [] }, robiAccesorio, modoApoyo, terminado
}
```
Se guarda después de cada respuesta, para que recargar la página no pierda nada.

### 4.6 Decisiones técnicas clave
- **Palabras sobre asteroides con `CSS2DRenderer`**: texto HTML nítido, siempre de frente, ≥ 28 px; la tarjeta misma es el área táctil (grande).
- **Entrada unificada** con Pointer Events (táctil + mouse) y raycasting con esferas invisibles más grandes que el asteroide.
- **Horizontal**: aviso "Gira tu tablet" en vertical; botón de pantalla completa.
- **Rendimiento**: materiales `MeshToonMaterial`, 1 luz ambiental + 1 direccional, sin sombras, geometrías de bajo polígono, `pixelRatio` máx. 1.5 con bajada automática si los FPS caen de 40, render en pausa con la pestaña oculta.
- **Sin parpadeos**: ningún destello más de 3 veces por segundo.
- **Asteroides sin castigo por tiempo**: en planetas 1-2 se detienen y flotan; desde el 3 dan la vuelta y regresan.
- **CSV**: UTF-8 con BOM; separador configurable (`;` por defecto, `,` opcional) porque Excel usa el de la configuración regional de Windows.
- **Modo prueba** (`?debug=1`): saltar escenas y responder solo, para las pruebas automáticas.

### 4.7 Vercel
- Importar el repositorio en Vercel → framework "Other", sin comando de build, carpeta raíz `/`.
- Producción sale de la rama `main`; cada rama genera una URL de vista previa.
- **Importante**: el progreso vive en el navegador y depende de la dirección. Los alumnos deben usar siempre la misma URL de producción (no las de vista previa).

### 4.8 Fases
| Fase | Entrega | Revisión |
|---|---|---|
| 0 ✅ | Esqueleto: `index.html`, importmap, `vercel.json` | — |
| 1 ✅ | `muestra.html`: retratos SVG con expresiones + cuadro de diálogo + voz | **Docente revisa** |
| 2 | Motor 3D: espacio, nave, asteroides con palabras, rayo de voz, toque/clic | — |
| 3 | Planeta 1 completo: preguntas, energía, escáner, cofre, jefe Copión | — |
| 4 | Planetas 2-4, Corazón de la Nebulosa e historia completa | **Docente prueba** |
| 5 | Estaciones: pausa activa, recompensas, personalización, reparar la nave | — |
| 6 | Alumnos y guardado | — |
| 7 | Panel docente: resultados, CSV, editor del banco, JSON, datos del aula | — |
| 8 | Diploma, práctica libre, música y pulido | — |
| 9 | Verificación final (abajo) | **Docente aprueba** |

### 4.9 Verificación final
- Recorrido automático de principio a fin con Playwright, en modo táctil (tablet) y con mouse (laptop).
- Cero errores en consola durante todo el recorrido.
- Recargar a mitad de planeta y comprobar que se recupera el progreso.
- CSV: comprobar BOM, tildes y ñ, y abrirlo con LibreOffice como prueba de Excel.
- Revisión del banco: script que verifica que ningún distractor sea a la vez respuesta de otra pregunta del mismo tipo con la misma palabra objetivo y que todas las opciones estén completas.
- Prueba de rendimiento con la CPU ralentizada 4× (simulación de tablet de gama media).

### 4.10 Cómo correr las pruebas
```
python3 -m http.server 8123          # en la raíz del repositorio
node tests/muestra.mjs               # recorre la muestra con táctil y mouse; falla si hay errores en consola
node tests/hoja-retratos.mjs         # genera tests/capturas/hoja-retratos.png con todas las expresiones
```
Requiere Playwright (`npm i -D playwright`).
