export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface PresetRange {
  label: string;
  key: PresetKey;
}

export type PresetKey =
  | "today"
  | "yesterday"
  | "thisWeek"
  | "lastWeek"
  | "thisMonth"
  | "lastMonth"
  | "thisYear"
  | "lastYear"
  | "allTime";
