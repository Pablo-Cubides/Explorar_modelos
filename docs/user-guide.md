# Guía de Usuario - ExploraModelo

## ¿Qué es ExploraModelo?

ExploraModelo es una aplicación educativa interactiva que te ayuda a comprender cómo funcionan los parámetros de decodificación en los modelos de lenguaje (LLMs). A través de una experiencia paso a paso, aprenderás sobre Temperatura, Top-k, Top-p y Penalización por repetición.

## Cómo usar la aplicación

### 1. Introducción
- Lee la explicación general de la aplicación y su propósito educativo.
- Explora cada parámetro con descripciones detalladas y ejemplos conceptuales.

### 2. Parámetros
- Aprende sobre cada parámetro individualmente:
  - **Temperatura**: Controla la aleatoriedad
  - **Top-k**: Limita candidatos absolutos
  - **Top-p**: Núcleo probabilístico acumulativo
  - **Penalización por repetición**: Evita repeticiones

### 3. Playground
- Experimenta con sliders para ajustar los parámetros.
- Observa cómo cambian las interpretaciones del comportamiento del modelo.
- Elige diferentes casos de ejemplo para ver variaciones.

### 4. Exportar
- Exporta tus configuraciones como PNG (imagen) o JSON (datos).
- Útil para compartir o guardar tus experimentos.

## Preguntas Frecuentes (FAQ)

### ¿Es esta aplicación gratuita?
Sí, completamente gratuita y de código abierto.

### ¿Necesito conocimientos previos?
No, está diseñada para principiantes, pero también útil para expertos.

### ¿Cómo funciona la decodificación?
Los LLMs generan texto token por token. Estos parámetros controlan cómo se selecciona cada token siguiente.

### ¿Puedo usar esto en producción?
Es educativo. Para producción, consulta la documentación técnica de tu LLM específico.

### Problemas comunes
- **Export PNG no funciona**: Asegúrate de tener JavaScript habilitado. Es un fallback a JSON.
- **Sliders no responden**: Verifica que estés en el paso Playground.

## Soporte
Si encuentras problemas, revisa la [documentación técnica](../README.md) o abre un issue en GitHub.