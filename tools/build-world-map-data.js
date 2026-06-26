const fs = require("fs");

const [mainTopoPath, fallbackTopoPath, outputPath = "world-map-data.js"] = process.argv.slice(2);

if (!mainTopoPath || !fallbackTopoPath) {
  throw new Error("Usage: node tools/build-world-map-data.js <countries-50m.json> <countries-10m.json> [output]");
}

const scriptSource = fs.readFileSync("script.js", "utf8");
const countryGroups = Function(`return (${scriptSource.match(/const worldCountryGroups = ([\s\S]*?);\n\nconst worldAliases/)[1]});`)();
const answerAliases = Function(`return (${scriptSource.match(/const worldAliases = ([\s\S]*?);\n\nconst worldCountries/)[1]});`)();
const quizNames = Object.values(countryGroups).flat();

const mapNameAliases = {
  "Antigua and Barbuda": ["Antigua and Barb."],
  "Bosnia and Herzegovina": ["Bosnia and Herz."],
  Brunei: ["Brunei Darussalam"],
  "Central African Republic": ["Central African Rep."],
  Congo: ["Republic of the Congo", "Congo-Brazzaville"],
  "Cote d'Ivoire": ["Cote d'Ivoire", "Ivory Coast"],
  Czechia: ["Czech Rep."],
  "Democratic Republic of the Congo": ["Dem. Rep. Congo", "Democratic Republic of the Congo"],
  "Dominican Republic": ["Dominican Rep."],
  "East Timor": ["Timor-Leste"],
  "Equatorial Guinea": ["Eq. Guinea"],
  Eswatini: ["eSwatini", "Swaziland"],
  Laos: ["Lao PDR"],
  "Marshall Islands": ["Marshall Is."],
  "North Korea": ["Dem. Rep. Korea", "North Korea"],
  "North Macedonia": ["Macedonia"],
  Russia: ["Russian Federation"],
  "Saint Kitts and Nevis": ["St. Kitts and Nevis"],
  "Saint Vincent and the Grenadines": ["St. Vin. and Gren."],
  "Sao Tome and Principe": ["Sao Tome and Principe"],
  "Solomon Islands": ["Solomon Is."],
  "South Korea": ["Republic of Korea", "South Korea"],
  "South Sudan": ["S. Sudan"],
  Syria: ["Syrian Arab Republic"],
  Taiwan: ["Taiwan*"],
  Turkey: ["Turkiye"],
  "United States": ["United States of America"],
  "Vatican City": ["Vatican"],
  Vietnam: ["Viet Nam"]
};

const width = 960;
const height = 500;
const mainTopo = JSON.parse(fs.readFileSync(mainTopoPath, "utf8"));
const fallbackTopo = JSON.parse(fs.readFileSync(fallbackTopoPath, "utf8"));

function normalizeName(value) {
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/^the\s+/, "")
    .trim();
}

function buildFeatureMap(topology) {
  const features = topology.objects.countries.geometries;
  return new Map(features.map((geometry) => [normalizeName(geometry.properties.name), geometry]));
}

const mainFeatures = buildFeatureMap(mainTopo);
const fallbackFeatures = buildFeatureMap(fallbackTopo);

function resolveGeometry(name) {
  const candidates = [
    name,
    ...(answerAliases[name] || []),
    ...(mapNameAliases[name] || [])
  ].map(normalizeName);

  for (const candidate of candidates) {
    if (mainFeatures.has(candidate)) {
      return { topology: mainTopo, geometry: mainFeatures.get(candidate) };
    }
  }

  for (const candidate of candidates) {
    if (fallbackFeatures.has(candidate)) {
      return { topology: fallbackTopo, geometry: fallbackFeatures.get(candidate) };
    }
  }

  return null;
}

function makeArcDecoder(topology) {
  const cache = new Map();
  const transform = topology.transform;

  return function decodeArc(arcIndex) {
    const reversed = arcIndex < 0;
    const index = reversed ? ~arcIndex : arcIndex;
    if (!cache.has(index)) {
      let x = 0;
      let y = 0;
      cache.set(index, topology.arcs[index].map(([dx, dy]) => {
        x += dx;
        y += dy;
        return [
          x * transform.scale[0] + transform.translate[0],
          y * transform.scale[1] + transform.translate[1]
        ];
      }));
    }

    const points = cache.get(index);
    return reversed ? [...points].reverse() : points;
  };
}

const decoderCache = new WeakMap();

function getDecoder(topology) {
  if (!decoderCache.has(topology)) {
    decoderCache.set(topology, makeArcDecoder(topology));
  }
  return decoderCache.get(topology);
}

function projectPoint([lon, lat]) {
  return [
    ((lon + 180) / 360) * width,
    ((90 - lat) / 180) * height
  ];
}

function formatNumber(value) {
  const rounded = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : String(rounded);
}

function ringToPath(points) {
  if (points.length < 3) {
    return "";
  }

  const commands = [];
  let previous = null;

  points.forEach((point) => {
    const projected = projectPoint(point);
    const command = previous && Math.abs(projected[0] - previous[0]) > width * 0.55 ? "M" : commands.length ? "L" : "M";
    commands.push(`${command}${formatNumber(projected[0])},${formatNumber(projected[1])}`);
    previous = projected;
  });

  commands.push("Z");
  return commands.join("");
}

function stitchRing(topology, ring) {
  const decodeArc = getDecoder(topology);
  return ring.flatMap((arcIndex, ringIndex) => {
    const points = decodeArc(arcIndex);
    return ringIndex === 0 ? points : points.slice(1);
  });
}

function geometryToPath(topology, geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.arcs] : geometry.arcs;
  return polygons
    .flatMap((polygon) => polygon.map((ring) => ringToPath(stitchRing(topology, ring))))
    .filter(Boolean)
    .join("");
}

function splitProjectedRing(points) {
  const segments = [];
  let current = [];
  let previous = null;

  points.forEach((point) => {
    const projected = projectPoint(point);
    if (previous && Math.abs(projected[0] - previous[0]) > width * 0.55) {
      if (current.length >= 2) {
        segments.push(current);
      }
      current = [projected];
    } else {
      current.push(projected);
    }
    previous = projected;
  });

  if (current.length >= 2) {
    segments.push(current);
  }

  return segments;
}

function segmentBounds(points) {
  return points.reduce((bounds, [x, y]) => ({
    minX: Math.min(bounds.minX, x),
    minY: Math.min(bounds.minY, y),
    maxX: Math.max(bounds.maxX, x),
    maxY: Math.max(bounds.maxY, y)
  }), {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity
  });
}

function segmentArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[(index + 1) % points.length];
    area += x1 * y2 - x2 * y1;
  }
  return area / 2;
}

function segmentCentroid(points) {
  const area = segmentArea(points);
  if (Math.abs(area) < 0.01) {
    const bounds = segmentBounds(points);
    return [
      (bounds.minX + bounds.maxX) / 2,
      (bounds.minY + bounds.maxY) / 2
    ];
  }

  let x = 0;
  let y = 0;
  for (let index = 0; index < points.length; index += 1) {
    const [x1, y1] = points[index];
    const [x2, y2] = points[(index + 1) % points.length];
    const factor = x1 * y2 - x2 * y1;
    x += (x1 + x2) * factor;
    y += (y1 + y2) * factor;
  }

  return [
    x / (6 * area),
    y / (6 * area)
  ];
}

function geometryToMarker(topology, geometry) {
  const polygons = geometry.type === "Polygon" ? [geometry.arcs] : geometry.arcs;
  const candidates = polygons.flatMap((polygon) => {
    const outerRing = stitchRing(topology, polygon[0]);
    return splitProjectedRing(outerRing).map((segment) => {
      const bounds = segmentBounds(segment);
      const area = Math.abs(segmentArea(segment));
      const boxArea = Math.max(0.01, (bounds.maxX - bounds.minX) * (bounds.maxY - bounds.minY));
      return {
        score: Math.max(area, boxArea),
        point: segmentCentroid(segment)
      };
    });
  });

  const best = candidates.sort((first, second) => second.score - first.score)[0];
  if (!best) {
    return [width / 2, height / 2];
  }

  return best.point.map((value) => Number(formatNumber(value)));
}

const countries = quizNames.map((name) => {
  const match = resolveGeometry(name);
  if (!match) {
    throw new Error(`Missing map geometry for ${name}`);
  }

  return {
    name,
    path: geometryToPath(match.topology, match.geometry),
    marker: geometryToMarker(match.topology, match.geometry)
  };
});

const output = `// Generated from Natural Earth geometry via world-atlas.\nwindow.WORLD_MAP_COUNTRIES = ${JSON.stringify(countries)};\n`;
fs.writeFileSync(outputPath, output);
console.log(JSON.stringify({ countries: countries.length, bytes: Buffer.byteLength(output) }));
