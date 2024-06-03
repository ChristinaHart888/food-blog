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

export type ResponseObject = {
    status: number;
    body: any;
};
