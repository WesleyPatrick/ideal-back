export type StatisticKey =
  | "assertiveness_by_activity"
  | "completion_time_avg"
  | "module_accuracy_avg"
  | "error_rate"
  | "return_time_avg"
  | "guessing_rate";

export interface StatisticMetric {
  key: StatisticKey;
  value: number;
}

export interface StatisticResponse {
  metrics: StatisticMetric[];
}
