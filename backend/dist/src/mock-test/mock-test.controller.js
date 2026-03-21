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
exports.MockTestController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const mock_test_service_1 = require("./mock-test.service");
let MockTestController = class MockTestController {
    mockTestService;
    constructor(mockTestService) {
        this.mockTestService = mockTestService;
    }
    findAll(categoryId) {
        return this.mockTestService.findAll(categoryId ? +categoryId : undefined);
    }
    startAttempt(dto) {
        return this.mockTestService.startAttempt(dto.otrId, dto.mockTestId);
    }
    submitAttempt(dto) {
        return this.mockTestService.submitAttempt(dto);
    }
    submitExamAttempt(dto) {
        return this.mockTestService.submitExamAttempt(dto);
    }
    getRecentAttempt(otrId) {
        return this.mockTestService.getRecentAttempt(otrId);
    }
    calculateRank(mockTestId, otrId) {
        return this.mockTestService.calculateRank(+mockTestId, otrId);
    }
    findOne(id) {
        return this.mockTestService.findOne(+id);
    }
};
exports.MockTestController = MockTestController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('categoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('start-attempt'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "startAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('attempts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "submitAttempt", null);
__decorate([
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Post)('exam-attempts'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "submitExamAttempt", null);
__decorate([
    (0, common_1.Get)('attempts/recent/:otrId'),
    __param(0, (0, common_1.Param)('otrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "getRecentAttempt", null);
__decorate([
    (0, common_1.Get)('rank/:mockTestId/:otrId'),
    __param(0, (0, common_1.Param)('mockTestId')),
    __param(1, (0, common_1.Param)('otrId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "calculateRank", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MockTestController.prototype, "findOne", null);
exports.MockTestController = MockTestController = __decorate([
    (0, common_1.Controller)('mock-test'),
    __metadata("design:paramtypes", [mock_test_service_1.MockTestService])
], MockTestController);
//# sourceMappingURL=mock-test.controller.js.map