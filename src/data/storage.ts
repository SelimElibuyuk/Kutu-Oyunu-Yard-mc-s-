import fs from 'fs';
import path from 'path';
import { GAMES_DATA, GameData } from './games';

const DATA_FILE = path.join(process.cwd(), 'src', 'data', 'games.json');
const CONFIG_FILE = path.join(process.cwd(), 'src', 'data', 'config.json');

export function getStoredGames(): Record<string, GameData> {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Fallback to default games if filesystem read fails
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
  } catch {
    // Serverless environments have read-only filesystem; handled silently
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

export interface AdminConfig {
  geminiApiKey?: string;
  adminPin?: string;
}

export function getAdminConfig(): AdminConfig {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      return JSON.parse(content);
    }
  } catch {
    // Handled silently
  }
  return {};
}

export function saveAdminConfig(config: AdminConfig): void {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2), 'utf-8');
  } catch {
    // Handled silently
  }
}
