export interface GridItem {
  id: string;
  file: File | null;
  previewUrl: string | null;
}

export interface GridConfig {
  gap: number;
  backgroundColor: string;
  exportSize: number; // Width/Height of the final square image in pixels
}

export const TOTAL_SLOTS = 25;
export const GRID_COLS = 5;

export type GridSplitSize = 3 | 5; // 3x3 or 5x5
