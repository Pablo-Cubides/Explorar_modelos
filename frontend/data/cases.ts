// Fuente única de verdad para buckets, patterns y cases
export const data = {
  "buckets": {
    "T": {"T0": [0.05, 0.15], "T1": [0.16, 0.30], "T2": [0.31, 0.50], "T3": [0.51, 0.80], "T4": [0.81, 1.30]},
    "K": {"K0": [1, 5], "K1": [6, 20], "K2": [21, 50], "K3": [51, 150]},
    "P": {"P0": [0.10, 0.20], "P1": [0.21, 0.40], "P2": [0.41, 0.75], "P3": [0.76, 1.00]},
    "R": {"R0": [1.00, 1.05], "R1": [1.06, 1.20], "R2": [1.21, 1.50], "R3": [1.51, 2.00]}
  },
  "patterns": {
    "A": {"T": "T0", "K": "K0", "P": "P0", "R": "R1"},
    "B": {"T": "T1", "K": "K1", "P": "P1", "R": "R2"},
    "C": {"T": "T2", "K": "K2", "P": "P1", "R": "R1"},
    "D": {"T": "T3", "K": "K3", "P": "P3", "R": "R0"},
    "E": {"T": "T4", "K": "K3", "P": "P3", "R": "R0"},
    "F": {"T": "T3", "K": "K1", "P": "P2", "R": "R2"},
    "G": {"T": "T2", "K": "K3", "P": "P0", "R": "R3"},
    "H": {"T": "T1", "K": "K2", "P": "P2", "R": "R1"},
    "I": {"T": "T4", "K": "K0", "P": "P3", "R": "R0"},
    "J": {"T": "T0", "K": "K3", "P": "P1", "R": "R3"}
  },
  "cases": [
    {
      "id": "pajaros",
      "title": "Los pájaros vuelan porque",
      "variants": {
        "A": "tienen alas fuertes; es su forma natural.",
        "B": "aprenden rutas y aprovechan el viento.",
        "C": "su anatomía y el aire generan sustentación.",
        "D": "el cielo los guía y dibujan rutas invisibles.",
        "E": "inventan caminos sobre la brisa, como pinceles.",
        "F": "alternan aleteo y planeo para rendir más.",
        "G": "el ala reparte el peso y el aire los sostiene.",
        "H": "evolución y práctica hacen el vuelo eficiente.",
        "I": "buscan alimento cercano: vuelos breves y directos.",
        "J": "si no conviene, se posan; vuelan cuando importa."
      }
    },
    {
      "id": "ia",
      "title": "La inteligencia artificial es",
      "variants": {
        "A": "técnicas para resolver tareas con datos.",
        "B": "herramientas que aprenden patrones.",
        "C": "sistemas que perciben y proponen decisiones.",
        "D": "una chispa creativa guiada por reglas.",
        "E": "un laboratorio de ideas con sorpresa útil.",
        "F": "modelos variados que evitan repetir lo obvio.",
        "G": "predicciones diversas con foco en lo esencial.",
        "H": "algoritmos que se ajustan al contexto.",
        "I": "un espejo conciso de nuestro lenguaje.",
        "J": "precisión con variedad, sin muletillas."
      }
    },
    {
      "id": "estudiar",
      "title": "Para estudiar mejor, recomiendo",
      "variants": {
        "A": "sesiones cortas y constantes; dormir bien.",
        "B": "resúmenes y repasos espaciados.",
        "C": "alternar materias y practicar.",
        "D": "enseñar a alguien; fija lo aprendido.",
        "E": "jugar con ideas y experimentar rutas nuevas.",
        "F": "varía ejercicios y evita repeticiones.",
        "G": "elige lo clave y profundiza.",
        "H": "equilibrar teoría y práctica.",
        "I": "micro metas diarias, claras.",
        "J": "recapitula sin repetir frases."
      }
    },
    {
      "id": "ciudad",
      "title": "La ciudad que más me gusta es",
      "variants": {
        "A": "segura y con buen transporte.",
        "B": "diversa, con barrios vivos.",
        "C": "caminarla inspira: parques y cultura.",
        "D": "un laberinto luminoso para perderse.",
        "E": "un escenario que cambia a cada paso.",
        "F": "compacta, eficiente, sin redundancias.",
        "G": "viva, pero enfocada en lo esencial.",
        "H": "equilibrada: calma y movimiento.",
        "I": "pequeña, cercana, directa.",
        "J": "clara de recorrer, sin rodeos."
      }
    },
    {
      "id": "lider",
      "title": "Un buen líder",
      "variants": {
        "A": "escucha y decide con datos.",
        "B": "empodera y comparte mérito.",
        "C": "comunica claro y corrige rápido.",
        "D": "enciende propósito y moviliza.",
        "E": "convierte dudas en impulso.",
        "F": "varía enfoques; evita repeticiones.",
        "G": "mantiene foco en prioridades.",
        "H": "adapta el estilo al equipo.",
        "I": "elige palabras precisas.",
        "J": "refuerza lo esencial, sin muletillas."
      }
    },
    {
      "id": "agua",
      "title": "El agua hierve cuando",
      "variants": {
        "A": "alcanza 100 °C a nivel del mar.",
        "B": "la presión baja acelera el hervor.",
        "C": "la energía rompe enlaces; surgen burbujas.",
        "D": "el calor danza y la olla canta.",
        "E": "estalla en perlas de vapor juguetonas.",
        "F": "sube firme, sin repeticiones de aviso.",
        "G": "el punto varía por presión y pureza.",
        "H": "depende del entorno y del recipiente.",
        "I": "se precipita en altura con menos calor.",
        "J": "hierve estable, sin frases redundantes."
      }
    },
    {
      "id": "comida",
      "title": "La comida colombiana",
      "variants": {
        "A": "maíz, fríjol, yuca y café.",
        "B": "arepas, ajiacos, sancochos.",
        "C": "regiones definen sabores.",
        "D": "un abrazo humeante en mesa.",
        "E": "colores y texturas que celebran.",
        "F": "varía técnicas; evita repetición.",
        "G": "producto local con foco.",
        "H": "equilibrio entre tradición y novedad.",
        "I": "porciones justas, sabor directo.",
        "J": "clásicos sin rodeos: a la esencia."
      }
    },
    {
      "id": "ahorrar",
      "title": "Para ahorrar dinero",
      "variants": {
        "A": "presupuesta y paga deudas caras.",
        "B": "compra al por mayor; compara.",
        "C": "automatiza apartes mensuales.",
        "D": "gamifica metas con pequeñas victorias.",
        "E": "experimenta retos rápidos y creativos.",
        "F": "reduce repeticiones de gasto.",
        "G": "enfócate en lo que más impacta.",
        "H": "mezcla disciplina y flexibilidad.",
        "I": "elige lo simple y directo.",
        "J": "registra sin repetir categorías."
      }
    },
    {
      "id": "deporte",
      "title": "El mejor deporte",
      "variants": {
        "A": "depende de tu salud y objetivo.",
        "B": "caminar, nadar o pedalear.",
        "C": "combina fuerza y resistencia.",
        "D": "el que te hace sonreír sudando.",
        "E": "el que inventa historias de esfuerzo.",
        "F": "varía rutinas; evita repeticiones.",
        "G": "prioriza movimientos básicos.",
        "H": "adapta intensidad al contexto.",
        "I": "elige uno simple para empezar.",
        "J": "constancia sin muletillas."
      }
    },
    {
      "id": "vacaciones",
      "title": "En vacaciones, quiero",
      "variants": {
        "A": "descansar y leer con mi familia.",
        "B": "comer local y evitar multitudes.",
        "C": "equilibrar aventura y calma.",
        "D": "perderme en atardeceres.",
        "E": "coleccionar cielos nuevos.",
        "F": "probar planes sin repetir.",
        "G": "pocos lugares, bien vividos.",
        "H": "ajustar el ritmo cada día.",
        "I": "rutas cortas y claras.",
        "J": "experiencias únicas, sin relleno."
      }
    }
  ]
} as const

export default data
