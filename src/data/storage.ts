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

const ENV_LOCAL_FILE = path.join(process.cwd(), '.env.local');
const ENV_FILE = path.join(process.cwd(), '.env');

export interface AdminConfig {
  geminiApiKey?: string;
  adminPin?: string;
}

export function getAdminConfig(): AdminConfig {
  let config: AdminConfig = {};
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      const content = fs.readFileSync(CONFIG_FILE, 'utf-8');
      config = JSON.parse(content);
    }
  } catch {
    // Handled silently
  }

  // If apiKey is in process.env, ensure it is available in config
  if (!config.geminiApiKey && process.env.GEMINI_API_KEY) {
    config.geminiApiKey = process.env.GEMINI_API_KEY;
  }

  // If still not found, check .env.local file
  if (!config.geminiApiKey && fs.existsSync(ENV_LOCAL_FILE)) {
    try {
      const envText = fs.readFileSync(ENV_LOCAL_FILE, 'utf-8');
      const match = envText.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
      if (match && match[1]) {
        config.geminiApiKey = match[1];
        process.env.GEMINI_API_KEY = match[1];
      }
    } catch {}
  }

  return config;
}

export function saveAdminConfig(config: AdminConfig): void {
  try {
    const dir = path.dirname(CONFIG_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Only persist non-sensitive settings (like adminPin) in config.json
    // Secrets like API keys are kept strictly in .env / .env.local to prevent git exposure
    const safeJsonConfig: AdminConfig = {
      adminPin: config.adminPin,
    };
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(safeJsonConfig, null, 2), 'utf-8');

    // Also persist GEMINI_API_KEY in .env.local and .env
    if (config.geminiApiKey) {
      process.env.GEMINI_API_KEY = config.geminiApiKey;

      // Update .env.local
      let envLocalText = fs.existsSync(ENV_LOCAL_FILE) ? fs.readFileSync(ENV_LOCAL_FILE, 'utf-8') : '';
      if (envLocalText.includes('GEMINI_API_KEY=')) {
        envLocalText = envLocalText.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY="${config.geminiApiKey}"`);
      } else {
        envLocalText = `${envLocalText.trim()}\nGEMINI_API_KEY="${config.geminiApiKey}"\n`;
      }
      fs.writeFileSync(ENV_LOCAL_FILE, envLocalText, 'utf-8');

      // Update .env
      let envText = fs.existsSync(ENV_FILE) ? fs.readFileSync(ENV_FILE, 'utf-8') : '';
      if (envText.includes('GEMINI_API_KEY=')) {
        envText = envText.replace(/GEMINI_API_KEY=.*/, `GEMINI_API_KEY="${config.geminiApiKey}"`);
      } else {
        envText = `${envText.trim()}\nGEMINI_API_KEY="${config.geminiApiKey}"\n`;
      }
      fs.writeFileSync(ENV_FILE, envText, 'utf-8');
    } else if (config.geminiApiKey === undefined) {
      delete process.env.GEMINI_API_KEY;

      if (fs.existsSync(ENV_LOCAL_FILE)) {
        let envLocalText = fs.readFileSync(ENV_LOCAL_FILE, 'utf-8');
        envLocalText = envLocalText.replace(/GEMINI_API_KEY=.*/, '');
        fs.writeFileSync(ENV_LOCAL_FILE, envLocalText, 'utf-8');
      }
      if (fs.existsSync(ENV_FILE)) {
        let envText = fs.readFileSync(ENV_FILE, 'utf-8');
        envText = envText.replace(/GEMINI_API_KEY=.*/, '');
        fs.writeFileSync(ENV_FILE, envText, 'utf-8');
      }
    }
  } catch {
    // Handled silently
  }
}
