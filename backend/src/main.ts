import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import 'dotenv/config';

async function bootstrap() {
  // Robust .env loader
  const envPath = path.resolve(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split(/\r?\n/).forEach(line => {
      const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
      if (match) {
        let key = match[1];
        let value = match[2] || '';
        if (value.length > 0 && value.startsWith('"') && value.endsWith('"')) {
          value = value.substring(1, value.length - 1);
        } else if (value.length > 0 && value.startsWith("'") && value.endsWith("'")) {
          value = value.substring(1, value.length - 1);
        }
        process.env[key] = value;
      }
    });
  }

  const port = process.env.PORT || 4000;
  console.log(`Starting backend on port ${port}...`);

  // Kill port logic
  try {
    if (process.platform === 'win32') {
      try {
        const stdout = execSync(`netstat -ano | findstr :${port} | findstr LISTENING`).toString();
        const pid = stdout.trim().split(/\s+/).pop();
        if (pid && pid !== '0' && pid !== 'LISTENING') {
          console.log(`Killing process ${pid} on port ${port}`);
          execSync(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
        }
      } catch (e) { }
    }
  } catch (e) { }

  const app = await NestFactory.create(AppModule);
  app.enableCors();

  // Use express middleware for large payloads
  const express = require('express');
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));

  try {
    await app.listen(port);
    console.log(`Backend is running on: http://localhost:${port}`);
  } catch (error) {
    console.error("Backend failed to start:", error);
  }
}
bootstrap();
