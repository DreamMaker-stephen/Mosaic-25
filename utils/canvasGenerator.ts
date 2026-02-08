import { GridItem, GridConfig } from '../types';

/**
 * Draws the grid onto a canvas and returns the Data URL.
 * Implements "object-fit: cover" logic manually for canvas drawing.
 * Supports variable column count (defaults to 5).
 */
export const generateGridImage = async (
  items: GridItem[],
  config: GridConfig,
  cols: number = 5
): Promise<string> => {
  const canvas = document.createElement('canvas');
  const size = config.exportSize;
  const gap = config.gap;
  
  // Set canvas dimension
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  // Fill background
  ctx.fillStyle = config.backgroundColor;
  ctx.fillRect(0, 0, size, size);

  // Calculate individual slot size
  // cellSize = (totalSize - (gaps * (cols - 1))) / cols
  const totalGapSpace = gap * (cols - 1);
  const cellSize = (size - totalGapSpace) / cols;

  const loadImage = (url: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (e) => reject(e);
      img.src = url;
    });
  };

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (!item.previewUrl) continue;

    const col = i % cols;
    const row = Math.floor(i / cols);

    const x = col * (cellSize + gap);
    const y = row * (cellSize + gap);

    try {
      const img = await loadImage(item.previewUrl);

      // Calculate "object-fit: cover"
      let sourceX = 0;
      let sourceY = 0;
      let sourceW = img.width;
      let sourceH = img.height;

      const imgAspect = img.width / img.height;
      const cellAspect = 1; // Square cells

      if (imgAspect > cellAspect) {
        // Image is wider than cell (landscapeish relative to square)
        // Crop left/right
        sourceW = img.height * cellAspect;
        sourceX = (img.width - sourceW) / 2;
      } else {
        // Image is taller than cell (portrait relative to square)
        // Crop top/bottom
        sourceH = img.width / cellAspect;
        sourceY = (img.height - sourceH) / 2;
      }

      ctx.drawImage(
        img,
        sourceX,
        sourceY,
        sourceW,
        sourceH,
        x,
        y,
        cellSize,
        cellSize
      );
    } catch (error) {
      console.error(`Failed to load image for slot ${i}`, error);
    }
  }

  return canvas.toDataURL('image/png', 1.0);
};

export const downloadImage = (dataUrl: string, filename: string) => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
