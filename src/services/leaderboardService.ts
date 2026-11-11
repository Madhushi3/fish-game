/**
 * Leaderboard Service
 * Interoperability module prepared for future Laravel API backend (/api/leaderboard).
 * Matches the players and scores from the "Swimming – Dive, Collect & Survive" Figma design.
 */

export interface LeaderboardEntry {
  id: string
  rank: number
  name: string
  score: number
  isCurrentPlayer?: boolean
}

export const FIGMA_LEADERBOARD: Omit<LeaderboardEntry, 'rank'>[] = [
  { id: '1', name: 'GameMaster', score: 2450 },
  { id: '2', name: 'OceanHero', score: 2300 },
  { id: '3', name: 'FishLover', score: 2100 },
  { id: '4', name: 'Madhushi', score: 1250, isCurrentPlayer: true },
  { id: '5', name: 'DreamPlayer', score: 1100 },
  { id: '6', name: 'BlueDiver', score: 950 },
  { id: '7', name: 'SeaExplorer', score: 870 },
  { id: '8', name: 'WaveRider', score: 720 },
]

const STORAGE_KEY = 'swimming_game_leaderboard_v1'

class LeaderboardService {
  public async getLeaderboard(playerName = 'Madhushi', playerScore = 1250): Promise<LeaderboardEntry[]> {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      let list: Omit<LeaderboardEntry, 'rank'>[] = stored ? JSON.parse(stored) : [...FIGMA_LEADERBOARD]

      // Update current player score if higher
      const playerIdx = list.findIndex(e => e.isCurrentPlayer || e.name.toLowerCase() === playerName.toLowerCase())
      if (playerIdx >= 0) {
        list[playerIdx].score = Math.max(list[playerIdx].score, playerScore)
        list[playerIdx].name = playerName
        list[playerIdx].isCurrentPlayer = true
      } else {
        list.push({
          id: 'player_' + Date.now(),
          name: playerName,
          score: playerScore,
          isCurrentPlayer: true,
        })
      }

      // Sort descending by score
      list.sort((a, b) => b.score - a.score)

      return list.map((item, index) => ({
        ...item,
        rank: index + 1,
      }))
    } catch {
      return FIGMA_LEADERBOARD.map((item, index) => ({ ...item, rank: index + 1 }))
    }
  }

  public async submitScore(playerName: string, score: number): Promise<void> {
    const board = await this.getLeaderboard(playerName, score)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(board))
  }
}

export const leaderboardService = new LeaderboardService()
export default leaderboardService
