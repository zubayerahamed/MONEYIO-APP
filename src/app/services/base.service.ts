
export class BaseService {

    private API_KEY: string = "1234567890";
    private API_URL: string = "http://localhost:8000/api";

    constructor() {

    }

    get apiUrl(): string {
        return this.API_URL;
    }

    get apiKey(): string {
        return this.API_KEY;
    }

}   