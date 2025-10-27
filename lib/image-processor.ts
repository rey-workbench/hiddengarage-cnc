/**
 * Image to G-Code Processor
 * Converts images to G-code using edge detection and vectorization
 */

export interface ImageEdge {
  x: number;
  y: number;
}

export interface ImageContour {
  points: ImageEdge[];
  isClosed: boolean;
}

/**
 * Process image and detect edges using Canvas API
 */
export async function detectImageEdges(
  imageFile: File,
  threshold: number = 128
): Promise<ImageContour[]> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const reader = new FileReader();

    reader.onload = (e) => {
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Could not get canvas context'));
            return;
          }

          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);

          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const edges = detectEdges(imageData, threshold);
          const contours = traceContours(edges, canvas.width, canvas.height);
          
          resolve(contours);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(imageFile);
  });
}

/**
 * Simple edge detection using brightness threshold
 */
function detectEdges(imageData: ImageData, threshold: number): boolean[][] {
  const { width, height, data } = imageData;
  const edges: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = (y * width + x) * 4;
      const brightness = (data[idx] + data[idx + 1] + data[idx + 2]) / 3;

      // Check neighbors for edge detection
      if (brightness < threshold) {
        const neighbors = [
          getBrightness(data, x - 1, y, width),
          getBrightness(data, x + 1, y, width),
          getBrightness(data, x, y - 1, width),
          getBrightness(data, x, y + 1, width),
        ];

        if (neighbors.some(n => n > threshold)) {
          edges[y][x] = true;
        }
      }
    }
  }

  return edges;
}

function getBrightness(data: Uint8ClampedArray, x: number, y: number, width: number): number {
  const idx = (y * width + x) * 4;
  return (data[idx] + data[idx + 1] + data[idx + 2]) / 3;
}

/**
 * Trace contours from edge map
 */
function traceContours(edges: boolean[][], width: number, height: number): ImageContour[] {
  const contours: ImageContour[] = [];
  const visited: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (edges[y][x] && !visited[y][x]) {
        const contour = traceContour(edges, visited, x, y, width, height);
        if (contour.points.length > 5) { // Filter out noise
          contours.push(contour);
        }
      }
    }
  }

  return contours;
}

/**
 * Trace a single contour starting from a point
 */
function traceContour(
  edges: boolean[][],
  visited: boolean[][],
  startX: number,
  startY: number,
  width: number,
  height: number
): ImageContour {
  const points: ImageEdge[] = [];
  const stack: [number, number][] = [[startX, startY]];
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

  while (stack.length > 0) {
    const [x, y] = stack.pop()!;
    
    if (x < 0 || x >= width || y < 0 || y >= height) continue;
    if (visited[y][x] || !edges[y][x]) continue;

    visited[y][x] = true;
    points.push({ x, y });

    // Check neighbors
    for (const [dx, dy] of directions) {
      stack.push([x + dx, y + dy]);
    }
  }

  // Simplify contour using Douglas-Peucker
  const simplified = douglasPeucker(points, 2);

  return {
    points: simplified,
    isClosed: points.length > 10,
  };
}

/**
 * Douglas-Peucker line simplification algorithm
 */
function douglasPeucker(points: ImageEdge[], epsilon: number): ImageEdge[] {
  if (points.length < 3) return points;

  let maxDist = 0;
  let index = 0;
  const end = points.length - 1;

  for (let i = 1; i < end; i++) {
    const dist = perpendicularDistance(points[i], points[0], points[end]);
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist > epsilon) {
    const left = douglasPeucker(points.slice(0, index + 1), epsilon);
    const right = douglasPeucker(points.slice(index), epsilon);
    return [...left.slice(0, -1), ...right];
  }

  return [points[0], points[end]];
}

function perpendicularDistance(point: ImageEdge, lineStart: ImageEdge, lineEnd: ImageEdge): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const norm = Math.sqrt(dx * dx + dy * dy);
  
  if (norm === 0) return Math.sqrt(Math.pow(point.x - lineStart.x, 2) + Math.pow(point.y - lineStart.y, 2));
  
  return Math.abs(dy * point.x - dx * point.y + lineEnd.x * lineStart.y - lineEnd.y * lineStart.x) / norm;
}

/**
 * Scale and offset contours to fit stock dimensions
 */
export function scaleContoursToStock(
  contours: ImageContour[],
  imageWidth: number,
  imageHeight: number,
  stockWidth: number,
  stockHeight: number,
  originX: 'left' | 'center' | 'right',
  originY: 'top' | 'center' | 'bottom'
): ImageContour[] {
  const scaleX = stockWidth / imageWidth;
  const scaleY = stockHeight / imageHeight;
  const scale = Math.min(scaleX, scaleY);

  const offsetX = originX === 'center' ? stockWidth / 2 : originX === 'right' ? stockWidth : 0;
  const offsetY = originY === 'center' ? stockHeight / 2 : originY === 'bottom' ? stockHeight : 0;

  return contours.map(contour => ({
    ...contour,
    points: contour.points.map(p => ({
      x: p.x * scale + offsetX,
      y: p.y * scale + offsetY,
    })),
  }));
}
