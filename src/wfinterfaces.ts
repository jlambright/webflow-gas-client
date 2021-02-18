namespace WFInterfaces {
    interface iMessages {
        maxLength: number;
        pattern: string;
    }

    interface iValidations {
        singleLine: boolean;
        collectionId: string;
        maxLength?: number;
        messages: iMessages;
        pattern: object;
    }

    export interface iField {
        id: string;
        editable: boolean;
        required: boolean;
        type: string;
        slug: string;
        name: string;
        validations: iValidations;
        helpText: string;
        innerType: string;
        unique?: boolean;
        default?: boolean;
    }

    export interface ThumbnailImage {
        fileId: string;
        url: string;
    }

    export interface MainImage {
        fileId: string;
        url: string;
    }

    export interface iItem {
        _archived: boolean;
        _draft: boolean;
        color: string;
        featured: boolean;
        name: string;
        "post-body": string;
        "post-summary": string;
        "thumbnail-image": ThumbnailImage;
        "main-image": MainImage;
        slug: string;
        "updated-on": Date;
        "updated-by": string;
        "created-on": Date;
        "created-by": string;
        "published-on": Date;
        "published-by": string;
        author: string;
        _cid: string;
        _id: string;
    }

    export interface iItems {
        items: iItem[];
        count: number;
        limit: number;
        offset: number;
        total: number;
    }

}