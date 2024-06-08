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

export type Review = StoreReview | ItemReview;

export type Item = {
    itemId: string;
    createdAt?: any;
    storeId: string;
    img?: string;
};

export interface AddReviewParams {
    reviewsArray: Review[];
}

export type ResponseObject = {
    status: number;
    body: DocumentData | string;
};
