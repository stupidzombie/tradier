import axios, { AxiosInstance } from "axios";

export const createTradierApi = (
    baseURL: string,
    accessToken: string,
    accountId: string
): { api: AxiosInstance, accountId: string} => {
    return {
        api: axios.create({
            baseURL,
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Accept: "application/json"
            }
        }),
        accountId
    }
}
    
