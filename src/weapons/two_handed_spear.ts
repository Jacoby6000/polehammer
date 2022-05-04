import { Metric, RawMetrics } from "../rating";

const metrics: RawMetrics = new Map([
  [Metric.DURATION_HORIZONTAL, 24],
  [Metric.DURATION_OVERHEAD, 20],
  [Metric.DURATION_STAB, 24],
  [Metric.DURATION_SPECIAL, 12],

  [Metric.RANGE_HORIZONTAL, 39],
  [Metric.RANGE_ALT_HORIZONTAL, 36],
  [Metric.RANGE_OVERHEAD, 28],
  [Metric.RANGE_ALT_OVERHEAD, 34],
  [Metric.RANGE_STAB, 40],
  [Metric.RANGE_ALT_STAB, 41],

  [Metric.DAMAGE_HORIZONTAL_LIGHT, 40],
  [Metric.DAMAGE_OVERHEAD_LIGHT, 30],
  [Metric.DAMAGE_STAB_LIGHT, 50],
  [Metric.DAMAGE_HORIZONTAL_HEAVY, 60],
  [Metric.DAMAGE_OVERHEAD_HEAVY, 50],
  [Metric.DAMAGE_STAB_HEAVY, 70],
  [Metric.DAMAGE_SPECIAL, 0],
]);

export default metrics;
