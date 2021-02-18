namespace WFCore {
    import HTTPResponse = GoogleAppsScript.URL_Fetch.HTTPResponse;
    import interfaceCheck = Helpers.interfaceCheck;
    import HttpHeaders = GoogleAppsScript.URL_Fetch.HttpHeaders;
    import URLFetchRequestOptions = GoogleAppsScript.URL_Fetch.URLFetchRequestOptions;
    import URLFetchRequest = GoogleAppsScript.URL_Fetch.URLFetchRequest;
    import HttpMethod = GoogleAppsScript.URL_Fetch.HttpMethod;
    import UrlFetchApp = GoogleAppsScript.URL_Fetch.UrlFetchApp;

    export class HTTPResponseWrapper implements HTTPResponse {
        private readonly response: HTTPResponse;

        constructor(response: HTTPResponse) {
            this.response = response;
        }

        getAllHeaders(): object {
            return this.response.getAllHeaders();
        }

        getAs(contentType: string): GoogleAppsScript.Base.Blob {
            return this.response.getAs(contentType);
        }

        getBlob(): GoogleAppsScript.Base.Blob {
            return this.response.getBlob();
        }

        getContent(): GoogleAppsScript.Byte[] {
            return this.response.getContent();
        }

        getContentJSON(): any {
            return JSON.parse(this.response.getContentText())
        }

        getContentAsType<T>(i_keys: Array<keyof T>): T {
            if (this.validateResponse<T>(i_keys)) {
                return <T>this.getContentJSON();
            } else {
                return <T>{};
            }
        }

        getContentText(charset?: string): string {
            return this.response.getContentText();
        }

        getHeaders(): object {
            return this.response.getHeaders();
        }

        getResponseCode(): GoogleAppsScript.Integer {
            return this.response.getResponseCode();
        }

        validateResponse<T>(i_keys: Array<keyof T>): boolean {
            if (this.getResponseCode() == 200) {
                const data = this.getContentJSON()
                return interfaceCheck<T>(data, i_keys)
            } else return false;
        }
    }

    export class WebFlowAPIHandler implements UrlFetchApp {
        private static instance: WebFlowAPIHandler;
        readonly baseUrl: string = "https://api.webflow.com";
        private _apiKey!: string;
        private _headers!: HttpHeaders;
        private _baseOptions!: URLFetchRequestOptions;
        private readonly API_KEY_ERROR: TypeError = new TypeError("They apiKey has not been defined, Please run .setAPIKey(YOUR_API_KEY).");

        private constructor() {}

        public static getInstance(): WebFlowAPIHandler {

            if (!WebFlowAPIHandler.instance) {
                WebFlowAPIHandler.instance = new WebFlowAPIHandler();
            }
            return WebFlowAPIHandler.instance;
        }

        get apiKey(): string {
            return this._apiKey;
        }

        set apiKey(value: string) {
            this._apiKey = value;
        }

        get baseOptions(): GoogleAppsScript.URL_Fetch.URLFetchRequestOptions {
            return this._baseOptions;
        }

        set baseOptions(value: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions) {
            this._baseOptions = value;
        }

        get headers(): GoogleAppsScript.URL_Fetch.HttpHeaders {
            return this._headers;
        }

        set headers(value: GoogleAppsScript.URL_Fetch.HttpHeaders) {
            this._headers = value;
        }

        public setAPIKey(api_key: string) {
            this.apiKey = api_key
            this.headers = <HttpHeaders>{
                "accept-version": "1.0.0",
                "Authorization": `Bearer ${this.apiKey}`
            };
            this.baseOptions = <URLFetchRequestOptions>{
                "contentType": 'application/json',
                "headers": this.headers,
                "redirect": 'follow'
            }
        }

        fetch(url_path: string, params: URLFetchRequestOptions = this.baseOptions): HTTPResponseWrapper {
            const response = UrlFetchApp.fetch(`${this.baseUrl}/${url_path}`, params);
            if (this._apiKey) return new HTTPResponseWrapper(response);
            else throw this.API_KEY_ERROR
        };

        fetchAll(requests: (URLFetchRequest | string)[]): HTTPResponseWrapper[] {
            if (this._apiKey) {
                const responses = UrlFetchApp.fetchAll(requests);
                return responses.map(value => new HTTPResponseWrapper(value));
            }
            else throw this.API_KEY_ERROR;
        }

        getRequest(url: string, params?: GoogleAppsScript.URL_Fetch.URLFetchRequestOptions): GoogleAppsScript.URL_Fetch.URLFetchRequest {
            if (params) return UrlFetchApp.getRequest(url, params);
            else return UrlFetchApp.getRequest(url);
        }

        getEndpoint(ep_type: string, ep_id: string): HTTPResponseWrapper {
            return this.GET(`${this.baseUrl}/${ep_type}/${ep_id}`);
        }

        GET(url_path: string): HTTPResponseWrapper {
            const method = <HttpMethod>"GET"
            const params = <URLFetchRequestOptions>Object.assign(this.baseOptions, {"method": method})

            if (this._apiKey) return this.fetch(`${this.baseUrl}/${url_path}`, params);
            else throw this.API_KEY_ERROR;
        }

        DELETE(url_path: string): HTTPResponseWrapper {
            const method: HttpMethod = <HttpMethod>"DELETE"
            const params = <URLFetchRequestOptions>Object.assign(this.baseOptions, {"method": method})
            if (this._apiKey) return this.fetch(`${this.baseUrl}/${url_path}`, params);
            else throw this.API_KEY_ERROR
        };

        PATCH(url_path: string, payload: object): HTTPResponseWrapper {
            const method: HttpMethod = <HttpMethod>"PATCH"
            const options = <URLFetchRequestOptions>{
                "contentType": 'application/json',
                "headers": this._headers,
                "method": method,
                "payload": JSON.stringify({"fields": payload})
            };
            const params = <URLFetchRequestOptions>Object.assign(this.baseOptions, options)

            if (this._apiKey) return this.fetch(`${this.baseUrl}/${url_path}`, params);
            else throw this.API_KEY_ERROR
        };

        POST(url_path: string, payload: object): HTTPResponseWrapper {
            const method: HttpMethod = <HttpMethod>"POST"
            const options = <URLFetchRequestOptions>{
                "contentType": 'application/json',
                "headers": this._headers,
                "method": method,
                "payload": JSON.stringify({"fields": payload})
            };
            const params = <URLFetchRequestOptions>Object.assign(this.baseOptions, options)

            if (this._apiKey) return this.fetch(`${this.baseUrl}/${url_path}`, params);
            else throw this.API_KEY_ERROR
        };

        PUT(url_path: string, payload: object): HTTPResponseWrapper {
            const method: HttpMethod = <HttpMethod>"PUT"
            const options = <URLFetchRequestOptions>{
                "contentType": 'application/json',
                "headers": this._headers,
                "method": method,
                "payload": JSON.stringify({"fields": payload})
            };
            const params = <URLFetchRequestOptions>Object.assign(this.baseOptions, options)

            if (this._apiKey) return this.fetch(`${this.baseUrl}/${url_path}`, params);
            else throw this.API_KEY_ERROR;
        };
    }


    export interface iAPIEndpoint {
        readonly _data: any;
        readonly _handler: WebFlowAPIHandler;
        _response: HTTPResponseWrapper;
        basePath: string;
        endpoint: string;
        id: string;
        isValid: boolean;

        getItemById(item_id: string): HTTPResponseWrapper;

        getAllItems(): HTTPResponseWrapper;

        getItemsByIds(item_ids: string[]): HTTPResponseWrapper[];
    }

    export class APIEndPoint implements iAPIEndpoint{
        readonly _data: any;
        readonly _handler: WebFlowAPIHandler = WebFlowAPIHandler.getInstance();
        _response: HTTPResponseWrapper;
        basePath: string;
        endpoint: string;
        id: string;
        isValid: boolean = false;

        constructor(endpoint_string: string, endpoint_id: string) {
            this.id = endpoint_id;
            this.endpoint = endpoint_string;
            this.basePath = `${this.endpoint}/${this.id}`
            this._response = this._handler.getEndpoint(this.endpoint, endpoint_id);
        }

        deleteItem(item_id: string): HTTPResponseWrapper {
            return this._handler.DELETE(`${this.basePath}/${item_id}`)
        }

        getItemById(item_id: string): HTTPResponseWrapper {
            return this._handler.GET(`${this.basePath}/items/${item_id}`)
        }

        getAllItems(): HTTPResponseWrapper {
            return this._handler.GET(`${this.basePath}/items`)
        }

        getItemsByIds(item_ids: string[]): HTTPResponseWrapper[] {
            const method = <GoogleAppsScript.URL_Fetch.HttpMethod>"GET"
            const params = <GoogleAppsScript.URL_Fetch.URLFetchRequestOptions>Object.assign(
                this._handler.baseOptions,
                {"method": method}
            )
            const requests: GoogleAppsScript.URL_Fetch.URLFetchRequest[] = item_ids.map((item_id) => {
                const url = `${this.basePath}/items/${item_id}`
                return this._handler.getRequest(url, params)
            })
            return this._handler.fetchAll(requests);
        }
    }
}
