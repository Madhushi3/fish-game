/**
 * Service for Marc Conrad's Fish Math Puzzle API
 * Endpoint: https://marcconrad.com/uob/fish/api.php?out=csv&base64=yes
 *
 * NOTE on CSV output structure:
 * Format: [base64_image_data],[fish_count],[chest_count]
 * val1 (first number after image) = fish count
 * val2 (second number after image) = chest count
 *
 * NOTE on JSON output structure:
 * { "question": "<base64_image_data>", "fish": <number>, "chest": <number> }
 */

export interface FishPuzzleData {
  imageData: string // data:image/png;base64,...
  fishCount: number // The solution for fish
  chestCount: number // The solution for chests
}

// Background pre-fetch cache to make round transitions instant
let preloadedPuzzlePromise: Promise<FishPuzzleData> | null = null

async function requestPuzzle(url: string, timeoutMs = 15000): Promise<FishPuzzleData> {
  const res = await fetch(url, { cache: 'no-store', signal: AbortSignal.timeout(timeoutMs) })
  if (!res.ok) throw new Error(`HTTP error ${res.status}`)

  const isJson = url.includes('out=json') || res.headers.get('content-type')?.includes('application/json')

  if (isJson) {
    const data = await res.json()
    const rawBase64 = data.question || ''
    const imageData = rawBase64.startsWith('http')
      ? rawBase64
      : rawBase64.startsWith('data:')
        ? rawBase64
        : `data:image/png;base64,${rawBase64}`

    const fishCount =
      typeof data.fish === 'number'
        ? data.fish
        : parseInt(data.fish, 10) || 0

    const chestCount =
      typeof data.chest === 'number'
        ? data.chest
        : parseInt(data.chest, 10) || 0

    return {
      imageData,
      fishCount,
      chestCount: Math.max(1, chestCount),
    }
  } else {
    const text = (await res.text()).trim()
    const lastComma = text.lastIndexOf(',')
    const secondLastComma = text.lastIndexOf(',', lastComma - 1)

    if (lastComma > 0 && secondLastComma > 0) {
      const rawBase64 = text.substring(0, secondLastComma).trim()
      const fishStr = text.substring(secondLastComma + 1, lastComma).trim()
      const chestStr = text.substring(lastComma + 1).trim()

      const fishCount = parseInt(fishStr, 10) || 0
      const chestCount = parseInt(chestStr, 10) || 0

      const imageData = rawBase64.startsWith('data:')
        ? rawBase64
        : `data:image/png;base64,${rawBase64}`

      return {
        imageData,
        fishCount,
        chestCount: Math.max(1, chestCount),
      }
    }
    throw new Error('Invalid CSV structure')
  }
}

async function doFetchFishPuzzle(): Promise<FishPuzzleData> {
  // Strategy 1: Vite Proxy JSON (fastest, avoids browser CORS/mixed network lag)
  try {
    const puzzle = await requestPuzzle('/api/marcconrad/uob/fish/api.php?out=json&base64=yes', 15000)
    console.log('✅ Fish API loaded (Vite Proxy JSON):', { fish: puzzle.fishCount, chest: puzzle.chestCount })
    return puzzle
  } catch (err) {
    console.warn('Vite proxy failed, trying direct JSON:', err)
  }

  // Strategy 2: Direct JSON from marcconrad.com
  try {
    const puzzle = await requestPuzzle('https://marcconrad.com/uob/fish/api.php?out=json&base64=yes', 18000)
    console.log('✅ Fish API loaded (Direct JSON):', { fish: puzzle.fishCount, chest: puzzle.chestCount })
    return puzzle
  } catch (err) {
    console.warn('Direct JSON failed, trying CSV format:', err)
  }

  // Strategy 3: Direct CSV from marcconrad.com
  try {
    const puzzle = await requestPuzzle('https://marcconrad.com/uob/fish/api.php?out=csv&base64=yes', 18000)
    console.log('✅ Fish API loaded (Direct CSV):', { fish: puzzle.fishCount, chest: puzzle.chestCount })
    return puzzle
  } catch (err) {
    console.warn('Direct CSV failed:', err)
  }

  // Strategy 4: High-fidelity Authentic Marc Conrad Fallback Puzzle (8 Fish & 5 Chests)
  console.log('ℹ️ Using authentic Marc Conrad sample puzzle fallback')
  return {
    imageData: '/game-assets/fish-puzzle-sample.png',
    fishCount: 8,
    chestCount: 5,
  }
}

export function preloadNextFishPuzzle(): void {
  preloadedPuzzlePromise = doFetchFishPuzzle()
}

export async function fetchFishPuzzle(): Promise<FishPuzzleData> {
  if (preloadedPuzzlePromise) {
    const p = preloadedPuzzlePromise
    preloadedPuzzlePromise = null
    try {
      const cached = await p
      // Immediately schedule pre-fetch for next round
      setTimeout(preloadNextFishPuzzle, 1000)
      return cached
    } catch {
      // Continue to fresh fetch
    }
  }

  const result = await doFetchFishPuzzle()
  // Immediately schedule pre-fetch for next round
  setTimeout(preloadNextFishPuzzle, 1000)
  return result
}

export default {
  fetchFishPuzzle,
}
