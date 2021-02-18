namespace WFSite {
    import APIEndPoint = WFCore.APIEndPoint;

    export interface iSite {
        _id: string;
        createdOn: Date;
        name: string;
        shortName: string;
        lastPublished: Date;
        previewUrl: string;
        timezone: string;
        database: string;
    }

    const siteKeys = <Array<keyof iSite>> Object.keys(<iSite>{})

    export class Site extends APIEndPoint {
        readonly _data: iSite = <iSite>{};

        constructor(site_id: string) {
            super("sites", site_id);
            this.isValid = this._response.validateResponse<iSite>(siteKeys);
            if (this.isValid) {
                this._data = this._response.getContentAsType<iSite>(siteKeys);
            }
        }
    }
}