import { AxiosInstance } from "axios";
import { BaseRequests } from "./requests";
const qs = require('qs');



export class Orders extends BaseRequests {
    constructor(api: AxiosInstance, accountId: string) {
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
    public async placeMultiLegOptionOrder(symbol: string, legs: any[], price: number) {
        const no = {
            price: price,
            symbol: symbol,
            class: 'multileg',
            type: 'credit',
            duration: 'day',
            //preview: true
        }
        let start = 0
        let end = legs.length
        while (start < end) {
            no['quantity' + '[' + start + ']'] = legs[start].quantity
            no['side' + '[' + start + ']'] = legs[start].side
            no['option_symbol' + '[' + start + ']'] = legs[start].option_symbol
            start = start + 1
        }
        try {
            const data = await this.api.post("/accounts/" + this.accountId + "/orders", qs.stringify(no), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            return data.data

        } catch (error) {
            console.log(error)
        }


        // return data.data.quotes.quote;
    }

    async placeSingleLegOptionOrder(stockSymbol, optionSymbol, price, side, quantity) {
        try {
            const params = {
                price: price,
                class: "option",
                symbol: stockSymbol,
                side: side,
                duration: "day",
                quantity: quantity,
                type: "limit",
                option_symbol: optionSymbol
            }
            const data = await this.api.post("/accounts/" + this.accountId + "/orders", qs.stringify(params), {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            //console.log(data.data)
        } catch (error) {
            console.log(error)
        }
    }

    public async getOrderDetails() {
        const data = await this.api.get("/accounts/" + this.accountId + "/orders")
        return data.data.orders.order
    }

    public async getAccountBalances() {
        const cash = await this.api.get("/accounts/" + this.accountId + "/balances")
        return cash.data.balances
    }

    public async cancelOrder(orderID: string) {
        const cancelOrder = await this.api.delete("/accounts/" + this.accountId + "/orders/" + orderID)
        console.log("Order Cancelled!")
    }

    public async getAccountPositions() {
        const positionsData = await this.api.get("/accounts/" + this.accountId + "/positions")
        return positionsData.data.positions.position
    }
}