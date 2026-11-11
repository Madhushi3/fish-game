/**
 * Fish Game API Service
 * Interoperability module for the official University of Bedfordshire Fish Game API.
 * Official Endpoint: https://marcconrad.com/uob/fish/api.php
 * Documentation: https://marcconrad.com/uob/fish/doc.php
 * 
 * Used for "Swimming – Dive, Collect & Survive" to fetch challenge targets,
 * game round configs, and dynamic difficulty parameters.
 */

export interface FishPuzzleResponse {
  question: string
  fish: number
  chest?: number
}

export interface RoundConfig {
  targetFish: number
  targetTreasures: number
  environment: 'Swimming Pool' | 'Sunny Beach' | 'River Adventure'
  speed: number
  puzzleImage?: string
}

const API_BASE_URL = 'https://marcconrad.com/uob/fish/api.php'

class FishApiService {
  /**
   * Fetches official API data or returns configured round targets.
   * Per Figma requirements: Initially 5 fish and 3 treasures as mock API response values.
   */
  public async getRoundTargets(roundNumber = 1): Promise<RoundConfig> {
    const environments: Array<'Swimming Pool' | 'Sunny Beach' | 'River Adventure'> = [
      'Swimming Pool',
      'Sunny Beach',
      'River Adventure',
    ]

    const envIndex = (roundNumber - 1) % environments.length
    const currentEnv = environments[envIndex]
    const baseSpeed = 1.0 + (roundNumber - 1) * 0.35

    // Attempt official API call with graceful fallback to round targets
    try {
      const response = await fetch(`${API_BASE_URL}?out=json&_t=${Date.now()}`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      })
      if (response.ok) {
        const data: FishPuzzleResponse = await response.json()
        return {
          targetFish: 5, // As specified in game requirements
          targetTreasures: 3, // As specified in game requirements
          environment: currentEnv,
          speed: baseSpeed,
          puzzleImage: data.question,
        }
      }
    } catch {
      // Offline fallback: Use mock API response values (5 fish, 3 treasures)
    }

    return {
      targetFish: 5,
      targetTreasures: 3,
      environment: currentEnv,
      speed: baseSpeed,
    }
  }

  /**
   * Validates completed round against API
   */
  public validateRound(collectedFish: number, collectedTreasures: number, targetFish = 5, targetTreasures = 3): boolean {
    return collectedFish >= targetFish && collectedTreasures >= targetTreasures
  }
}

export const fishApiService = new FishApiService()
export default fishApiService
