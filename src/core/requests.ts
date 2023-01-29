import { AxiosInstance } from "axios";

export abstract class BaseRequests {
    api: AxiosInstance;
    accountId: string

    constructor(api: AxiosInstance, accountId: string) {
        this.api = api;
        this.accountId = accountId
    }
}
