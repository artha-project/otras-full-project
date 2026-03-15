import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

async function bootstrap() {
  // Simple .env loader since dotenv might not be available
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split(/\r?\n/).forEach(line => {
      const trimmedLine = line.trim();
      if (trimmedLine && !trimmedLine.startsWith('#')) {
        const [key, ...valueParts] = trimmedLine.split('=');
        const value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    });
  }

  const port = process.env.PORT || 4000;

  console.log(`Starting backend on port ${port}...`);

  // Kill port logic
  try {
    if (process.platform === 'win32') {
      try {
        const stdout = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = stdout.split(/\r?\n/);
        for (const line of lines) {
          if (line.includes('LISTENING')) {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && pid !== '0') {
              console.log(`Killing process ${pid} on port ${port}`);
              execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
            }
          }
        }
      } catch (e) {}
    } else {
      execSync(`npx kill-port ${port}`, { stdio: 'ignore' });
    }
  } catch (e) {}

  const app = await NestFactory.create(AppModule);
  app.enableCors();
  
  try {
    await app.listen(port);
    console.log(`Backend is running on: http://localhost:${port}`);
  } catch (error) {
    if (error.code === 'EADDRINUSE') {
      const fallbackPort = Number(port) + 5;
      console.warn(`Port ${port} is still in use, trying fallback port ${fallbackPort}...`);
      await app.listen(fallbackPort);
      console.log(`Backend is running on: http://localhost:${fallbackPort}`);
    } else {
      throw error;
    }
  }
}
bootstrap();
