/**
 * build.js — Static Site Generation (SSG) for World Cup 2026
 *
 * Reads data/teams.json and data/confederations.json, aggregates stats
 * by confederation, generates the full <tbody> HTML, and injects it into
 * index.html (template). Output is saved to dist/index.html.
 *
 * Usage: node build.js
 */

const fs = require("fs");
const path = require("path");

// ---------------------------------------------------------------------------
// 1. Paths
// ---------------------------------------------------------------------------
const ROOT = __dirname;
const DATA_DIR = path.join(ROOT, "data");
const DIST_DIR = path.join(ROOT, "dist");

const TEAMS_FILE = path.join(DATA_DIR, "teams.json");
const CONFEDERATIONS_FILE = path.join(DATA_DIR, "confederations.json");
const TEMPLATE_FILE = path.join(ROOT, "index.html");
const OUTPUT_FILE = path.join(DIST_DIR, "index.html");

const FLAG_BASE_URL =
  "https://cdnjs.cloudflare.com/ajax/libs/flag-icon-css/3.5.0/flags/4x3/";

// ---------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------

/** Escape HTML special characters. */
function escapeHTML(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Read a JSON file and return the parsed object.
 * @param {string} filePath
 * @returns {any}
 */
function readJSON(filePath) {
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

// ---------------------------------------------------------------------------
// 3. Aggregate team stats by confederation
// ---------------------------------------------------------------------------

/**
 * Aggregates raw group/team data into per-confederation summaries.
 * Mirrors the logic from the original app.js initializeData().
 *
 * @param {Object} confederationData - confederations.json contents
 * @param {Object} worldCupGroups    - teams.json contents (group → teams[])
 * @returns {Array<Object>} sorted aggregated rows
 */
function aggregateData(confederationData, worldCupGroups) {
  const stats = {};

  // Initialise counters for every known confederation
  for (const key of Object.keys(confederationData)) {
    stats[key] = { teams: 0, played: 0, won: 0, drawn: 0, lost: 0, teamList: [] };
  }

  // Walk every team in every group
  for (const group of Object.values(worldCupGroups)) {
    for (const team of group) {
      const s = stats[team.confederation];
      if (!s) continue;

      s.teams += 1;
      s.played += team.played;
      s.won += team.won;
      s.drawn += team.drawn;
      s.lost += team.lost;

      const pointsEarned = team.won * 3 + team.drawn;
      const maxPoints = team.played * 3;
      const average = team.played > 0 ? pointsEarned / team.played : 0;

      s.teamList.push({
        name: team.name,
        code: team.code,
        played: team.played,
        won: team.won,
        drawn: team.drawn,
        lost: team.lost,
        pointsEarned,
        maxPoints,
        average: +average.toFixed(2),
      });
    }
  }

  // Build the final array and compute top-level aggregates
  const aggregated = Object.keys(stats).map((confed) => {
    const d = stats[confed];
    const pointsEarned = d.won * 3 + d.drawn;
    const maxPoints = d.played * 3;
    const average = d.played > 0 ? pointsEarned / d.played : 0;

    // Sort team list by points then average (descending)
    d.teamList.sort(
      (a, b) => b.pointsEarned - a.pointsEarned || b.average - a.average
    );

    return {
      confederation: confed,
      teams: d.teams,
      played: d.played,
      won: d.won,
      drawn: d.drawn,
      lost: d.lost,
      average: +average.toFixed(2),
      pointsEarned,
      maxPoints,
      teamList: d.teamList,
    };
  });

  // Sort confederations by average descending (default view)
  aggregated.sort((a, b) => b.average - a.average);

  return aggregated;
}

// ---------------------------------------------------------------------------
// 4. Generate HTML rows
// ---------------------------------------------------------------------------

/**
 * Builds the <tr> for a single confederation row.
 * Matches the exact markup produced by the original renderTable().
 */
function buildConfedRow(data, index, confedInfo) {
  const confed = escapeHTML(data.confederation);
  const logo = escapeHTML(confedInfo.logo);
  const fullName = escapeHTML(confedInfo.name);

  return `
        <tr class="confed-row" tabindex="0" role="row"
            data-confed="${confed}"
            aria-expanded="false"
            aria-label="${confed} - ${data.teams} equipos, ${data.pointsEarned} puntos">
          <td class="col-rank">${index + 1}</td>
          <td>
            <div class="confed-row__cell">
              <button class="confed-toggle"
                      aria-label="Expandir ${confed}"
                      aria-expanded="false"
                      data-confed="${confed}">
                +
              </button>
              <span class="confed-logo-wrap">
                <img src="${logo}"
                     alt="Logo de ${confed}"
                     class="confed-logo"
                     loading="lazy"
                     width="28"
                     height="28"
                     onerror="this.style.display='none'">
              </span>
              <div class="confed-info">
                <span class="confed-name">${confed}</span>
                <span class="confed-fullname">${fullName}</span>
              </div>
            </div>
          </td>
          <td class="col-center"><span class="stat-cell">${data.teams}</span></td>
          <td class="col-center"><span class="stat-cell">${data.played}</span></td>
          <td class="col-center"><span class="stat-cell stat-cell--won">${data.won}</span></td>
          <td class="col-center"><span class="stat-cell stat-cell--drawn">${data.drawn}</span></td>
          <td class="col-center"><span class="stat-cell stat-cell--lost">${data.lost}</span></td>
          <td class="col-center"><span class="stat-cell stat-cell--accent">${data.average.toFixed(2)}</span></td>
          <td class="col-center"><span class="stat-cell">${data.pointsEarned}</span></td>
          <td class="col-center"><span class="stat-cell stat-cell--muted">${data.maxPoints}</span></td>
        </tr>`;
}

// ---------------------------------------------------------------------------
// 5. Main build
// ---------------------------------------------------------------------------

function build() {
  console.log("🏗️  Building static HTML...");

  // Read source files
  const confederationData = readJSON(CONFEDERATIONS_FILE);
  const worldCupGroups = readJSON(TEAMS_FILE);
  const template = fs.readFileSync(TEMPLATE_FILE, "utf-8");

  // Aggregate data
  const aggregated = aggregateData(confederationData, worldCupGroups);
  console.log(`   ✔ Aggregated data for ${aggregated.length} confederations`);

  // Generate tbody content
  const tbodyRows = aggregated
    .map((data, i) => {
      const info = confederationData[data.confederation] || { name: "", logo: "" };
      return buildConfedRow(data, i, info);
    })
    .join("\n");

  // Build the pre-aggregated data JSON for client-side hydration
  const hydrationData = JSON.stringify({
    confederations: confederationData,
    aggregated: aggregated.map(({ teamList, ...rest }) => rest),
    teams: aggregated.reduce((acc, d) => {
      acc[d.confederation] = d.teamList;
      return acc;
    }, {}),
  });

  const hydrationScript = `<script>window.__PRELOADED_DATA__ = ${hydrationData};</script>`;

  // Inject into template: replace content between <tbody ...> ... </tbody>
  const tbodyOpen = '<tbody id="confederation-table-body">';
  const tbodyClose = "</tbody>";
  const tbodyStart = template.indexOf(tbodyOpen);
  const tbodyEnd = template.indexOf(tbodyClose, tbodyStart);

  if (tbodyStart === -1 || tbodyEnd === -1) {
    console.error(
      '❌ Could not find <tbody id="confederation-table-body"> in index.html'
    );
    process.exit(1);
  }

  // Replace everything between the opening and closing tbody tags
  let outputHTML =
    template.slice(0, tbodyStart + tbodyOpen.length) +
    "\n" +
    tbodyRows +
    "\n" +
    template.slice(tbodyEnd);

  // Inject the hydration script right before the closing </body> tag
  outputHTML = outputHTML.replace(
    /(<\/body>)/,
    `    ${hydrationScript}\n    $1`
  );

  // Ensure dist/ directory exists
  if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
  }

  // Also copy assets: css/, js/, data/, robots.txt, sitemap.xml
  const assetsToCopy = [
    { src: path.join(ROOT, "css"), dest: path.join(DIST_DIR, "css") },
    { src: path.join(ROOT, "js"), dest: path.join(DIST_DIR, "js") },
    { src: path.join(ROOT, "data"), dest: path.join(DIST_DIR, "data") },
    { src: path.join(ROOT, "robots.txt"), dest: path.join(DIST_DIR, "robots.txt") },
    { src: path.join(ROOT, "sitemap.xml"), dest: path.join(DIST_DIR, "sitemap.xml") },
  ];

  for (const { src, dest } of assetsToCopy) {
    if (!fs.existsSync(src)) continue;
    copyRecursive(src, dest);
    console.log(`   ✔ Copied ${path.relative(ROOT, src)} → ${path.relative(ROOT, dest)}`);
  }

  // Write output
  fs.writeFileSync(OUTPUT_FILE, outputHTML, "utf-8");
  console.log(`   ✔ Generated ${path.relative(ROOT, OUTPUT_FILE)}`);
  console.log("✅ Build complete!");
}

/**
 * Recursively copy a directory or file.
 */
function copyRecursive(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Run
build();
