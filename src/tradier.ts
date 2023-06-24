import { AxiosInstance } from "axios";
import { TradierVersion } from "types";
import { MarketDataRequests } from "./core/market-data";
import { Orders } from "./core/orders";
import { createTradierApi } from "./utils/request";

export const URLS = {
    beta: "https://api.tradier.com/beta/",
    prod: "https://api.tradier.com/v1/",
    stream: "https://stream.tradier.com/v1",
    sandbox: "https://sandbox.tradier.com/v1/",
};

export class Tradier {
    accessToken: string;
    version: TradierVersion;
    tradier: { api: AxiosInstance, betaApi: AxiosInstance, accountId: string };
    marketData: MarketDataRequests;
    orders: Orders
    accountId: string

    constructor(accessToken: string, accountId: string, version?: TradierVersion) {
        this.accessToken = accessToken;
        this.version = version;
        this.tradier = createTradierApi(URLS[this.version], URLS['beta'], this.accessToken, accountId);

        /**
         * @NOTE
         * So this is a general fyi on how this all comes together. This
         * bit of code here registers each module of the Tradier class.
         * There are just too many calls to do method after method, so instead
         * I've opted to break up the calls into individual plugins. So for
         * example the getOptionsChain call is in Tradier.options.getChain
         */

        this.marketData = new MarketDataRequests(this.tradier, this.tradier.accountId);
        this.orders = new Orders(this.tradier.api, this.tradier.accountId);
    }
}
