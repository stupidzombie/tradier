"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketDataRequests = void 0;
const qs = require('qs');
class MarketDataRequests {
    constructor(tradier, accountId) {
        //super(tradier.api, accountId);
        this.api = tradier.api;
        this.betaApi = tradier.betaApi;
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
     * Gets a list of watchlists
     */
    async getWatchlists() {
        var _a;
        const watchlists = await this.api.get("/watchlists");
        return (_a = watchlists === null || watchlists === void 0 ? void 0 : watchlists.data) === null || _a === void 0 ? void 0 : _a.watchlists;
    }
    /**
     *
     * @param {string} name
     * @param {Array} symbols
     * @returns
     */
    async createWatchlist(name, symbols) {
        let params = { name, symbols: symbols.join(",") };
        try {
            const createWatchlist = await this.api.post("/watchlists", qs.stringify(params));
            return createWatchlist;
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * @description
     * Update specified watchlist
     * @param {string} name
     * @param {Array} symbols
     * @returns
     */
    async updateWatchlist(name, symbols) {
        let params = { name, symbols: symbols.join(",") };
        try {
            const updateWatchlist = await this.api.put(`/watchlists/${name}`, qs.stringify(params));
            if (updateWatchlist && !Array.isArray(updateWatchlist)) {
                return [updateWatchlist];
            }
            return updateWatchlist;
        }
        catch (error) {
            console.log(error);
        }
    }
    /**
     * @description
     * Get specified watchlist or default if none specified
     * @param {string} name
     * @returns
     */
    async getWatchlist(name) {
        if (!name)
            name = 'default';
        const watchlist = await this.api.get(`/watchlists/${name}`);
        if (watchlist.data.watchlist.items === 'null') {
            return [];
        }
        let actualWatchlist = watchlist.data.watchlist.items.item;
        if (actualWatchlist && !Array.isArray(actualWatchlist)) {
            actualWatchlist = [actualWatchlist];
        }
        console.log(actualWatchlist);
        return actualWatchlist;
    }
    async getMarketOpen() {
        const isMarketOpen = await this.api.get("/markets/clock");
        // console.log(isMarketOpen)
        return isMarketOpen;
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
    async getEvents(symbol) {
        let eventList;
        try {
            eventList = await this.betaApi.get("/markets/fundamentals/calendars", {
                params: { symbols: symbol }
            });
            let filteredList = eventList.data[0].results.filter((listItem) => { return listItem.tables.corporate_calendars != null; });
            return filteredList[0].tables.corporate_calendars;
        }
        catch (error) {
            // we are likely in the sandbox
            return [];
        }
    }
    /**
     * @description
     * Gets whether the specified week has earnings
     * @param symbol
     * @param thisWeekOrNextWeek 0 for this week, 1 for next week
     * @returns
     */
    async getEarningsWeek(symbol, thisWeekOrNextWeek) {
        let getEarningsWeek;
        try {
            getEarningsWeek = await this.betaApi.get("/markets/fundamentals/calendars", {
                params: { symbols: symbol }
            });
        }
        catch (error) {
            // we are likely in the sandbox
            getEarningsWeek = [];
        }
        //console.log(getEarningsWeek.data[0].results)
        let filteredList = getEarningsWeek.data[0].results.filter((listItem) => { return listItem.tables.corporate_calendars != null; });
        let eventTypeEarningsList = [7, 8, 9, 10];
        let filteredListForCompanyEvents = filteredList[0].tables.corporate_calendars.filter((listitemy) => {
            if (eventTypeEarningsList.includes(listitemy.event_type)) {
                const now = new Date();
                // create a Date object for the date you want to check
                const myDate = new Date(listitemy.begin_date_time); // replace with your desired date
                // calculate the start and end of the current week
                const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
                const endOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (6 - now.getDay()));
                const startOfNextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay() + 7);
                const endOfNextWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() + (13 - now.getDay()));
                // check if myDate is within the current week
                //thisweekornextweek == 0 (0 means this week, 1 would be next week)
                if (myDate >= startOfWeek && myDate <= endOfWeek && thisWeekOrNextWeek == 0) {
                    return true;
                }
                if (myDate >= startOfNextWeek && myDate <= endOfNextWeek && thisWeekOrNextWeek == 1) {
                    return true;
                }
            }
        });
        //console.log(filteredListForCompanyEvents)
        return filteredListForCompanyEvents;
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