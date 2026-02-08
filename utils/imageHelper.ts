import JSZip from 'jszip';

export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = url;
  });
};

/**
 * Splits an image into rows * cols segments.
 * Respects the original image format (JPEG/PNG) and dimensions.
 */
export const splitImage = async (
  file: File, 
  cols: number, 
  rows: number
): Promise<string[]> => {
  const imageUrl = URL.createObjectURL(file);
  const img = await loadImage(imageUrl);
  
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    URL.revokeObjectURL(imageUrl);
    throw new Error('Canvas context not available');
  }

  // Use the image's natural dimensions divided by cols/rows
  // We floor the values to avoid sub-pixel rendering issues
  const segmentWidth = Math.floor(img.width / cols);
  const segmentHeight = Math.floor(img.height / rows);

  canvas.width = segmentWidth;
  canvas.height = segmentHeight;

  const images: string[] = [];

  // Determine output format based on input file type
  // If JPEG, use high quality JPEG. Otherwise default to PNG (lossless).
  let mimeType = 'image/png';
  if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
    mimeType = 'image/jpeg';
  } else if (file.type === 'image/webp') {
    mimeType = 'image/webp';
  }

  // Use maximum quality
  const quality = 1.0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      ctx.clearRect(0, 0, segmentWidth, segmentHeight);
      ctx.drawImage(
        img,
        c * segmentWidth, 
        r * segmentHeight, 
        segmentWidth, 
        segmentHeight,
        0, 
        0, 
        segmentWidth, 
        segmentHeight
      );
      images.push(canvas.toDataURL(mimeType, quality));
    }
  }

  URL.revokeObjectURL(imageUrl);
  return images;
};

export const downloadZip = async (images: (string | null)[], filename: string) => {
  const zip = new JSZip();
  const folder = zip.folder("split-images");
  
  if (!folder) return;

  let count = 0;
  images.forEach((dataUrl, index) => {
    if (dataUrl) {
      // Extract mime type and base64 data to determine extension
      // Format: data:image/png;base64,......
      const matches = dataUrl.match(/^data:(image\/(\w+));base64,(.+)$/);
      if (matches) {
        // matches[1] is mime type (e.g. image/jpeg)
        // matches[2] is subtype (e.g. jpeg, png)
        let extension = matches[2];
        if (extension === 'jpeg') extension = 'jpg';
        
        const data = matches[3];
        folder.file(`tile_${index + 1}.${extension}`, data, { base64: true });
        count++;
      } else {
        // Fallback if regex fails (shouldn't happen for standard data URLs)
        const data = dataUrl.split(',')[1];
        folder.file(`tile_${index + 1}.png`, data, { base64: true });
        count++;
      }
    }
  });

  if (count === 0) return;

  const content = await zip.generateAsync({ type: "blob" });
  const url = URL.createObjectURL(content);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
