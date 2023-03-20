"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataRequests = void 0;
const requests_1 = require("./requests");
class MarketDataRequests extends requests_1.BaseRequests {
    constructor(api, accountId) {
        super(api, accountId);
    }
    /**
     * @description
     * Get a list of symbols using a keyword lookup on the symbols description. Results are in
     * descending order by average volume of the security. This can be used for simple search
     * functions.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-quotes
     */
    async getQuotes(symbols, greeks) {
        const data = await this.api.get("/markets/quotes", {
            params: { symbols, greeks },
        });
        return data.data.quotes.quote;
    }
    /**
     * @description
     * Get all quotes in an option chain. Greek and IV data is included courtesy of ORATS. Please
     * check out their APIs for more in-depth options data.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-options-chains
     */
    async getOptionChain(symbol, expiration, greeks) {
        const data = await this.api.get("/markets/options/chains", {
            params: { symbol, expiration, greeks },
        });
        if (data.data.options)
            return data.data.options.option;
        else
            return data.data;
    }
    /**
     * @description
     * Get an options strike prices for a specified expiration date.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-options-strikes
     */
    async getOptionStrikes(symbol, expiration) {
        const data = await this.api.get("/markets/options/strikes", {
            params: { symbol, expiration },
        });
        return data.data.strikes.strike;
    }
    /**
     * @description
     * Note that some underlying securities use a different symbol for their weekly
     * options (RUT/RUTW, SPX/SPXW). To make sure you see all expirations, make sure
     * to send the includeAllRoots parameter. This will also ensure any unique options
     * due to corporate actions (AAPL1) are returned.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-options-expirations
     */
    async getOptionExpirationDates(symbol, includeAllRoots, strikes) {
        try {
            const data = await this.api.get("/markets/options/expirations", {
                params: { symbol, includeAllRoots, strikes },
            });
            return includeAllRoots || strikes
                ? data.data.expirations.expiration
                : data.data.expirations.date;
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * @description
     * Get all options symbols for the given underlying. This will include additional option
     * roots (ex. SPXW, RUTW) if applicable.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-lookup-options-symbols
     */
    async getOptionSymbols(underlying) {
        const data = await this.api.get("/markets/options/lookup", { params: { underlying } });
        return data.data.symbols[0].options;
    }
    /**
     * @description
     * Get historical pricing for a security. This data will usually cover the entire lifetime of
     * the company if sending reasonable start/end times. You can fetch historical pricing for
     * options by passing the OCC option symbol (ex. AAPL220617C00270000) as the symbol.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-history
     */
    async getHistoricalPricing(symbol, interval, start, end) {
        const data = await this.api.get("/markets/history", {
            params: { symbol, interval, start, end },
        });
        return data.data.history;
    }
    /**
     * @description
     * Time and Sales (timesales) is typically used for charting purposes. It captures pricing
     * across a time slice at predefined intervals. Tick data is also available through this
     * endpoint. This results in a very large data set for high-volume symbols, so the time
     * slice needs to be much smaller to keep downloads time reasonable.
     *
     * @note
     * Please note that the tick interval is not available in Sandbox.
     *
     * @warning
     * There is a known issue as it pertains to downloading data using the tick interval from
     * this endpoint as it results in extremely large datasets. Because of this, it is not
     * recommended to get tick data via request/response, and instead use the streaming endpoints.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-timesales
     */
    async getTimeAndSales(symbol, interval, start, end, session_filter) {
        const data = await this.api.get("/markets/timesales", {
            params: { symbol, interval, start, end, session_filter },
        });
        return data.data.series.data;
    }
    /**
     * @description
     * The ETB list contains securities that are able to be sold short with a Tradier Brokerage
     * account. The list is quite comprehensive and can result in a long download response time.
     *
     * @link
     * https://documentation.tradier.com/brokerage-api/markets/get-etb
     */
    async getETBList() {
        const data = await this.api.get("/markets/etb");
        return data.data.securities.security;
    }
}
exports.MarketDataRequests = MarketDataRequests;
//# sourceMappingURL=market-data.js.map