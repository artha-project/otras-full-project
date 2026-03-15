"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BurnoutService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/ai.service");
const burnout_prompt_1 = require("./burnout.prompt");
let BurnoutService = class BurnoutService {
    constructor(aiService) {
        this.aiService = aiService;
    }
    async generate(payload) {
        return this.aiService.generate(burnout_prompt_1.burnoutPrompt, payload);
    }
};
exports.BurnoutService = BurnoutService;
exports.BurnoutService = BurnoutService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_service_1.AiService])
], BurnoutService);
//# sourceMappingURL=burnout.service.js.map