import fs from 'fs';
import path from 'path';
import { GAMES_DATA, GameData } from './games';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'games.json');

export function getStoredGames(): Record<string, GameData> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch (error) {
    console.error('Error reading games.json, falling back to default:', error);
  }
  return GAMES_DATA;
}

export function saveStoredGames(games: Record<string, GameData>): void {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(games, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing games.json:', error);
    throw error;
  }
}

export function saveGame(game: GameData): void {
  const games = getStoredGames();
  games[game.id] = game;
  saveStoredGames(games);
}

export function deleteGame(id: string): boolean {
  const games = getStoredGames();
  if (games[id]) {
    delete games[id];
    saveStoredGames(games);
    return true;
  }
  return false;
}
