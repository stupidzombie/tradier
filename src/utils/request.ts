import axios, { AxiosInstance } from "axios";

export const createTradierApi = (
    baseURL: string,
    betaURL: string,
    accessToken: string,
    accountId: string
): { api: AxiosInstance, betaApi: AxiosInstance, accountId: string } => {
    return {
        api: axios.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        }),
        betaApi: axios.create({
            baseURL: betaURL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        }),
        accountId
    }
}

