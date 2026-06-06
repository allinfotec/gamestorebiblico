export interface CellCoord {
  r: number;
  c: number;
}

export interface PlacedWord {
  word: string;
  coords: CellCoord[];
}

export interface CacaPalavrasGridData {
  grid: string[][];
  placedWords: PlacedWord[];
}

const DIRECTIONS = [
  [0, 1],   // horizontal right
  [1, 0],   // vertical down
  [1, 1],   // diagonal down-right
  [-1, 1],  // diagonal up-right
  [0, -1],  // horizontal left (backward)
  [-1, 0],  // vertical up (backward)
  [1, -1],  // diagonal down-left
  [-1, -1]  // diagonal up-left
];

/**
 * Generates a word search grid for a given list of uppercase words and gridSize.
 */
export function generateCacaPalavrasGrid(words: string[], gridSize: number = 10): CacaPalavrasGridData {
  // Sort words from longest to shortest to easier fitting
  const sortedWords = [...words]
    .map(w => w.toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^A-Z]/g, ""))
    .sort((a, b) => b.length - a.length);

  let grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(""));
  const placedWords: PlacedWord[] = [];

  for (const word of sortedWords) {
    if (word.length > gridSize) continue; // word is too long for this grid

    let placed = false;
    let attempts = 0;

    while (!placed && attempts < 200) {
      attempts++;
      const dirIndex = Math.floor(Math.random() * DIRECTIONS.length);
      const [dr, dc] = DIRECTIONS[dirIndex];

      // Random starting coordinates
      const startR = Math.floor(Math.random() * gridSize);
      const startC = Math.floor(Math.random() * gridSize);

      // Check bounds
      const endR = startR + dr * (word.length - 1);
      const endC = startC + dc * (word.length - 1);

      if (endR < 0 || endR >= gridSize || endC < 0 || endC >= gridSize) {
        continue;
      }

      // Check collision
      let canPlace = true;
      const wordCoords: CellCoord[] = [];

      for (let i = 0; i < word.length; i++) {
        const currR = startR + dr * i;
        const currC = startC + dc * i;
        const existingChar = grid[currR][currC];

        if (existingChar !== "" && existingChar !== word[i]) {
          canPlace = false;
          break;
        }
        wordCoords.push({ r: currR, c: currC });
      }

      if (canPlace) {
        // Place on grid
        for (let i = 0; i < word.length; i++) {
          const currR = startR + dr * i;
          const currC = startC + dc * i;
          grid[currR][currC] = word[i];
        }
        placedWords.push({ word, coords: wordCoords });
        placed = true;
      }
    }

    // Fallback if failed to place: let's try with simpler directions (only horizontal or vertical)
    if (!placed) {
      let attemptsSimple = 0;
      while (!placed && attemptsSimple < 100) {
        attemptsSimple++;
        const simpleDirs = [[0, 1], [1, 0]];
        const [dr, dc] = simpleDirs[Math.floor(Math.random() * simpleDirs.length)];
        const startR = Math.floor(Math.random() * gridSize);
        const startC = Math.floor(Math.random() * gridSize);

        const endR = startR + dr * (word.length - 1);
        const endC = startC + dc * (word.length - 1);

        if (endR < 0 || endR >= gridSize || endC < 0 || endC >= gridSize) continue;

        let canPlace = true;
        const wordCoords: CellCoord[] = [];
        for (let i = 0; i < word.length; i++) {
          const currR = startR + dr * i;
          const currC = startC + dc * i;
          if (grid[currR][currC] !== "" && grid[currR][currC] !== word[i]) {
            canPlace = false;
            break;
          }
          wordCoords.push({ r: currR, c: currC });
        }

        if (canPlace) {
          for (let i = 0; i < word.length; i++) {
            grid[startR + dr * i][startC + dc * i] = word[i];
          }
          placedWords.push({ word, coords: wordCoords });
          placed = true;
        }
      }
    }
  }

  // Fill in other cells with random letters
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      }
    }
  }

  return { grid, placedWords };
}

/**
 * Checks if a selection is a straight line in horizontal, vertical or diagonal keys.
 * Returns the array of coords between start and end if valid, otherwise null.
 */
export function getSelectionLineCoords(start: CellCoord, end: CellCoord): CellCoord[] | null {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  
  if (dr === 0 && dc === 0) {
    return [start];
  }

  const steps = Math.max(Math.abs(dr), Math.abs(dc));
  
  // Check if horizontal, vertical or exact 45-degree diagonal
  const isHorizontal = dr === 0;
  const isVertical = dc === 0;
  const isDiagonal = Math.abs(dr) === Math.abs(dc);

  if (!isHorizontal && !isVertical && !isDiagonal) {
    return null;
  }

  const stepR = dr === 0 ? 0 : dr / steps;
  const stepC = dc === 0 ? 0 : dc / steps;

  const path: CellCoord[] = [];
  for (let i = 0; i <= steps; i++) {
    path.push({
      r: start.r + stepR * i,
      c: start.c + stepC * i
    });
  }

  return path;
}
