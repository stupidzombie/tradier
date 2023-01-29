"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tradier = exports.URLS = void 0;
const market_data_1 = require("./core/market-data");
const orders_1 = require("./core/orders");
const request_1 = require("./utils/request");
exports.URLS = {
    beta: "https://api.tradier.com/beta/",
    prod: "https://api.tradier.com/v1/",
    stream: "https://stream.tradier.com/v1",
    sandbox: "https://sandbox.tradier.com/v1/",
};
class Tradier {
    constructor(accessToken, accountId, version) {
        this.accessToken = accessToken;
        this.version = version;
        this.tradier = (0, request_1.createTradierApi)(exports.URLS[this.version], this.accessToken, accountId);
        /**
         * @NOTE
         * So this is a general fyi on how this all comes together. This
         * bit of code here registers each module of the Tradier class.
         * There are just too many calls to do method after method, so instead
         * I've opted to break up the calls into individual plugins. So for
         * example the getOptionsChain call is in Tradier.options.getChain
         */
        this.marketData = new market_data_1.MarketDataRequests(this.tradier.api, this.tradier.accountId);
        this.orders = new orders_1.Orders(this.tradier.api, this.tradier.accountId);
    }
}
exports.Tradier = Tradier;
//# sourceMappingURL=tradier.js.map