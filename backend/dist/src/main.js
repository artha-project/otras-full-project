"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const child_process_1 = require("child_process");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
async function bootstrap() {
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
    try {
        if (process.platform === 'win32') {
            try {
                const stdout = (0, child_process_1.execSync)(`netstat -ano | findstr :${port}`).toString();
                const lines = stdout.split(/\r?\n/);
                for (const line of lines) {
                    if (line.includes('LISTENING')) {
                        const parts = line.trim().split(/\s+/);
                        const pid = parts[parts.length - 1];
                        if (pid && pid !== '0') {
                            console.log(`Killing process ${pid} on port ${port}`);
                            (0, child_process_1.execSync)(`taskkill /F /PID ${pid}`, { stdio: 'ignore' });
                        }
                    }
                }
            }
            catch (e) { }
        }
        else {
            (0, child_process_1.execSync)(`npx kill-port ${port}`, { stdio: 'ignore' });
        }
    }
    catch (e) { }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.enableCors();
    try {
        await app.listen(port);
        console.log(`Backend is running on: http://localhost:${port}`);
    }
    catch (error) {
        if (error.code === 'EADDRINUSE') {
            const fallbackPort = Number(port) + 5;
            console.warn(`Port ${port} is still in use, trying fallback port ${fallbackPort}...`);
            await app.listen(fallbackPort);
            console.log(`Backend is running on: http://localhost:${fallbackPort}`);
        }
        else {
            throw error;
        }
    }
}
bootstrap();
//# sourceMappingURL=main.js.map