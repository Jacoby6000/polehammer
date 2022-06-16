import { Chart, ChartData } from "chart.js";
import ALL_WEAPONS from "./all_weapons";
import { MetricLabel } from "./metrics";
import { UnitStats, WeaponStats } from "./stats";
import { Weapon } from "./weapon";

const SATURATION = "85%";
const LIGHTNESS = "45%";

// Repeat the palette three times:
// Once solid, then once dashed, then once dotted
// const PALETTE_SIZE = Math.ceil(Object.values(Weapon).length / 3);
const PALETTE_SIZE = 16;
const PALETTE_DEGS = [...Array(PALETTE_SIZE)].map((_, idx) => {
  // Cycle through large shifts in the 360deg colour wheel
  // This changes the colour more from one index to another
  // so we don't get "three shades of green" all in a row
  return (idx * 360) / PALETTE_SIZE + (idx % 2) * 180;
});

export function weaponColor(weapon: Weapon, opacity: number): string {
  const idx = ALL_WEAPONS.indexOf(weapon);
  return `hsl(${
    PALETTE_DEGS[idx % PALETTE_DEGS.length]
  }deg, ${SATURATION}, ${LIGHTNESS}, ${opacity})`;
}

export function metricColor(value: number, range: {min: number; max: number}): string {
  let size = range.max - range.min
  let relativeValue = value - range.min;
  let hueOffset = relativeValue/size * 120

  return `hsl(${hueOffset}deg, ${SATURATION}, ${LIGHTNESS}, ${0.5})`;
}

export function weaponDash(weapon: Weapon) {
  const idx = ALL_WEAPONS.indexOf(weapon);
  if (idx >= 2 * PALETTE_SIZE) {
    return "dotted";
  } else if (idx >= PALETTE_SIZE) {
    return "dashed";
  } else {
    return "solid";
  }
}

export function borderDash(weapon: Weapon) {
  switch (weaponDash(weapon)) {
    case "solid":
      return undefined;
    case "dashed":
      return [8, 8];
    case "dotted":
      return [2, 2];
  }
}

export function createBarChart(element: HTMLCanvasElement, weapons: Array<Weapon>, category: MetricLabel, stats: WeaponStats, unitStats: UnitStats) {
  const barUnitStats: UnitStats = new Map();
  if(category.includes("Speed")) {
    barUnitStats.set(category, unitStats.get(category)!);
  }

  return new Chart(element as HTMLCanvasElement, {
    type: "bar",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    },
    data: chartData(stats, weapons, new Set([category]), barUnitStats, true),
  });
}

export function createRadarChart(canvasElem: HTMLCanvasElement, data: ChartData, range: {min: number; max: number}|undefined = undefined): Chart {
  return new Chart(canvasElem, {
    type: "radar",
    options: {
      animation: false,
      plugins: {
        legend: {
          display: false,
          position: "bottom",
        },
      },
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        radial: {
          min: range ? range.max : undefined,
          max: range ? range.min : undefined,
          ticks: {
            display: false,
            maxTicksLimit: 2,
          },
        },
      },
    },
    data: data
  });
}

export function chartData(
  dataset: WeaponStats,
  weapons: Array<Weapon>,
  categories: Set<MetricLabel>,
  normalizationStats: UnitStats,
  setBgColor: boolean
): ChartData {
  let sortedCategories = Array.from(categories);
  sortedCategories.sort((a,b) => {
    return Object.values(MetricLabel).indexOf(a) - Object.values(MetricLabel).indexOf(b);
  });

  return {
    labels: [...sortedCategories],
    datasets: [...weapons].map((w) => {
      return {
        label: w.name,
        data: [...sortedCategories].map((c) => {
          const metric = dataset.get(w.name)!.get(c)!;
          let value = metric.value;
          const maybeUnitStats = normalizationStats.get(c);
          if (maybeUnitStats) {
            const unitMin = maybeUnitStats!.min;
            const unitMax = maybeUnitStats!.max;

            // Normalize
            return (value - unitMin) / (unitMax - unitMin);
          }
          return value;
        }),
        backgroundColor: setBgColor ? weaponColor(w, 0.6) : weaponColor(w, 0.1),
        borderColor: weaponColor(w, 0.6),
        borderDash: borderDash(w),
      };
    }),
  };
}
