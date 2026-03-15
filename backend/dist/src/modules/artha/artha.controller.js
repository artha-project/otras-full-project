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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArthaController = void 0;
const common_1 = require("@nestjs/common");
const artha_service_1 = require("./artha.service");
let ArthaController = class ArthaController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getStatus(userId) {
        return this.service.getStatus(userId);
    }
    async startTier(body, tier) {
        return this.service.startTierAssessment(body.userId, parseInt(tier, 10));
    }
    async completeTier1(body) {
        return this.service.processTier1(body, body.assessmentId);
    }
    async completeTier2(body) {
        return this.service.processTier2(body.userId, body.assessmentId);
    }
    async completeTier3(body) {
        return this.service.processTier3(body.userId, body.assessmentId);
    }
    async attemptQuestion(body) {
        return this.service.recordQuestionAttempt(body);
    }
};
exports.ArthaController = ArthaController;
__decorate([
    (0, common_1.Get)("status/:userId"),
    __param(0, (0, common_1.Param)("userId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "getStatus", null);
__decorate([
    (0, common_1.Post)("start-tier/:tier"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("tier")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "startTier", null);
__decorate([
    (0, common_1.Post)("tier1"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier1", null);
__decorate([
    (0, common_1.Post)("tier2"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier2", null);
__decorate([
    (0, common_1.Post)("tier3"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "completeTier3", null);
__decorate([
    (0, common_1.Post)("attempt-question"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ArthaController.prototype, "attemptQuestion", null);
exports.ArthaController = ArthaController = __decorate([
    (0, common_1.Controller)("artha"),
    __metadata("design:paramtypes", [artha_service_1.ArthaService])
], ArthaController);
//# sourceMappingURL=artha.controller.js.map