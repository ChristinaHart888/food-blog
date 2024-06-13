import { DocumentData } from "firebase/firestore";

export interface AddStoreParams {
    storeName: string;
    isGroup: boolean;
    file?: File | null;
    groupId?: string | null;
}

export interface AddUserParams {
    email: string;
    password: string;
    username: string;
    profile?: null | File;
}

export interface LoginUserParams {
    email: string;
    password: string;
}

export interface AddReviewParams {
    reviewsArray: Review[];
}

export interface AddItemParams {
    storeId: string;
    itemName: string;
    img?: File;
}

export interface GetItemsByStoreParams {
    storeId: string;
}

interface BaseReview {
    reviewId: string;
    userId: string;
    img?: string;
    rating: number;
    comments?: string;
}

interface StoreReview extends BaseReview {
    storeId: string;
}

interface ItemReview extends BaseReview {
    itemId: string;
}

export type Tag = {
    tagId: string;
    tagName: string;
};

export type Review = StoreReview | ItemReview;

export type Item = {
    itemId: string;
    createdAt?: any;
    createdBy?: string;
    storeId: string;
    img?: File;
    itemName: string;
    tags?: Tag[];
};

export type Store = {
    storeId: string;
    storeName: string;
    isGroup: boolean;
    groupId?: string;
    img?: string;
    createdAt?: string;
    createdBy?: string;
    tags?: Tag[];
};

export interface ResponseObject {
    status: number;
    body: DocumentData | string;
}

export interface StoreResponseObject extends ResponseObject {
    body: Store | string;
}

export interface StoreListResponseObject extends ResponseObject {
    body: Store[] | string;
}
export interface AddItemResponse extends ResponseObject {
    body: Item | string;
}

export interface ItemListResponse extends ResponseObject {
    body: Item[] | string;
}
