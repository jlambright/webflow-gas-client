namespace WFCollection {
    import APIEndPoint = WFCore.APIEndPoint;
    import iField = WFInterfaces.iField;

    export interface iCollection {
        _id: string;
        lastUpdated: Date;
        createdOn: Date;
        name: string;
        slug: string;
        singularName: string;
        fields: iField[];
    }

    const collectionKeys = <Array<keyof iCollection>> Object.keys(<iCollection>{})

    export class Collection extends APIEndPoint{

        readonly _data: iCollection = <iCollection>{};

        constructor(collection_id: string) {
            super("collections", collection_id)
            this.isValid = this._response.validateResponse<iCollection>(collectionKeys);
            if (this.isValid) {
                this._data = this._response.getContentAsType<iCollection>(collectionKeys);
            }
        }

        get createdOn(): Date {
            return this._data.createdOn;
        }

        get lastUpdated(): Date {
            return this._data.lastUpdated;
        }

        get name(): string {
            return this._data.name;
        }

        get slug(): string {
            return this._data.slug;
        }

        get singularName(): string {
            return this._data.singularName;
        }

        get fields(): iField[] {
            return this._data.fields;
        }
    }
}