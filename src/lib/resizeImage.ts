// Photos are shrunk so their longest side is at most this many pixels, never enlarged or cropped
export const MAX_PHOTO_EDGE_PX = 2560;
export const PHOTO_JPEG_QUALITY = 0.85;

export class UnreadableImageError extends Error {
  constructor(fileName: string) {
    super(`${fileName} couldn't be read as a photo`);
    this.name = 'UnreadableImageError';
  }
}

// Re-encoding also drops hidden metadata, like the GPS location the photo was taken at
export const resizeImage = async (file: File): Promise<Blob> => {
  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new UnreadableImageError(file.name);
  }

  const scale = Math.min(1, MAX_PHOTO_EDGE_PX / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    throw new Error('This browser could not prepare the photo');
  }
  // JPEG has no transparency, so see-through PNG areas become white instead of black
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingQuality = 'high';
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      blob => (blob ? resolve(blob) : reject(new Error('This browser could not prepare the photo'))),
      'image/jpeg',
      PHOTO_JPEG_QUALITY
    );
  });
};
