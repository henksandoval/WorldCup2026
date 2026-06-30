# World Cup 2026 - Rendimiento por Confederación 🏆⚽

# World Cup 2026 - Rendimiento por Confederación 🏆⚽

**El objetivo de este proyecto es aportar datos duros al histórico debate del fútbol:** ¿Es justa la distribución de plazas en el Mundial?

Este Dashboard interactivo en vivo resuelve el debate analizando el rendimiento real de las diferentes confederaciones (UEFA, CONMEBOL, CONCACAF, AFC, CAF, OFC) durante la Copa Mundial de la FIFA 2026, **penalizando el volumen y premiando la efectividad**.

## 🌟 Características

- **Tabla de Posiciones Interactiva**: Ordena las estadísticas por cualquier métrica (Partidos Jugados, Victorias, Goles a Favor, Puntos, etc.) con un solo clic.
- **Métricas Avanzadas**: Además de las estadísticas clásicas, incluye comparativas de "Puntos Obtenidos vs. Puntos Máximos Posibles" para cada confederación.
- **Soporte de Temas (Modo Claro/Oscuro)**: Botón integrado para alternar entre el tema claro y oscuro, mejorando la experiencia visual del usuario.
- **Diseño Responsivo y Accesible**: Optimizado para funcionar en dispositivos móviles y de escritorio, además de ser amigable con lectores de pantalla y navegación por teclado.

## 🌟 Características y Métricas de Debate

- **Coeficiente de Rendimiento Global:** La métrica definitiva que mide la calidad promedio aportada por cada plaza otorgada a una confederación, calculada como `(Puntos Totales Acumulados + Bonos por Avance en Eliminatorias) / Equipos Iniciales`.
- **Tasa de Supervivencia:** Muestra claramente el porcentaje de equipos de cada confederación que sobrevive a las fases de eliminación directa.
- **Efectividad en Eliminatorias (Avances KO):** Contabiliza los "partidos a vida o muerte" superados, incluyendo victorias por penales.
- **Vistas por Pestañas:** Alterna entre las métricas de la "Fase de Grupos", las "Eliminatorias" y la comparativa "Global" sin saturar la pantalla.
- **Soporte de Temas (Modo Claro/Oscuro)**: Botón integrado para alternar entre el tema claro y oscuro.
- **Diseño Responsivo y Accesible**: Optimizado para funcionar en dispositivos móviles y de escritorio.

## 🚀 Tecnologías Utilizadas

- **Frontend**: HTML5 Semántico, CSS3 (Vanilla), JavaScript (Vanilla)
- **Construcción y Scripts**: Node.js (`build.js`)
- **Analíticas**: Vercel Web Analytics
- **Fuentes**: Google Fonts (Barlow Condensed, Sora, JetBrains Mono)

## 🛠️ Instalación y Uso Local

Para correr este proyecto en tu máquina local:

1. **Clona el repositorio** o asegúrate de estar en el directorio del proyecto.
2. **Instala las dependencias**:
   ```bash
   npm install
   ```
3. **Inicia el servidor de desarrollo**:
   ```bash
   npm run dev
   ```
   *Esto construirá el proyecto y levantará un servidor local utilizando `serve`.*
4. **Construcción de producción**:
   Si sólo deseas ejecutar el script de construcción sin levantar el servidor, usa:
   ```bash
   npm run build
   ```

## 📂 Estructura del Proyecto

- `/css` - Estilos de la aplicación.
- `/js` - Lógica del dashboard, ordenamiento de la tabla y manejo de temas.
- `/data` - Archivos de datos con la información y estadísticas del torneo.
- `/dist` - Directorio de salida de los archivos compilados para producción.
- `index.html` - Archivo principal y estructura del Dashboard.
- `build.js` - Script de construcción de Node.js.
