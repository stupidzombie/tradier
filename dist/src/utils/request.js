"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTradierApi = void 0;
const axios_1 = __importDefault(require("axios"));
const createTradierApi = (baseURL, betaURL, accessToken, accountId) => {
    return {
        api: axios_1.default.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        }),
        betaApi: axios_1.default.create({
            baseURL: betaURL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        }),
        accountId
    };
};
exports.createTradierApi = createTradierApi;
//# sourceMappingURL=request.js.map