import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
    getDoc,
    doc,
    where,
    query,
    writeBatch,
} from "firebase/firestore";
import { firestore, storage } from "../components/firebaseConfig";
import bcrypt from "bcryptjs-react";
import {
    AddItemParams,
    AddItemResponse,
    AddReviewParams,
    AddStoreParams,
    AddTagParams,
    AddUserParams,
    GetItemsByStoreParams,
    Item,
    ItemListResponse,
    LoginUserParams,
    ResponseObject,
    Review,
    ReviewListResponse,
    Store,
    StoreListResponseObject,
    StoreResponseObject,
    TagListResponse,
    TagResponse,
    UserResponseObject,
} from "../types/dbTypes";
//import jwt from 'jsonwebtoken'

const useDB = () => {
    const SALT_ROUNDS = 10;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const isValidEmail = (email: string) => {
        return EMAIL_REGEX.test(email);
    };

    const isValidUser = async (email: string) => {
        const userRef = collection(firestore, "users");
        const q = query(userRef, where("email", "==", email));
        const querySnapshot = await getDocs(q);
        return querySnapshot.size > 0;
    };

    const uploadImage = async (file: File | undefined): Promise<string> => {
        if (file) {
            console.log("File name", file.name);
            const storageRef = ref(storage, `images/${file.name}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);
            return url;
        } else {
            return "";
        }
    };

    const addStore = async ({
        storeName,
        isGroup,
        file = null,
        groupId = null,
    }: AddStoreParams) => {
        try {
            if (!storeName || (isGroup !== true && isGroup !== false))
                throw "Missing Store Info";
            let url = null;
            if (file) {
                console.log("File name", file.name);
                const storageRef = ref(storage, `images/${file.name}`);
                await uploadBytes(storageRef, file);
                url = await getDownloadURL(storageRef);
            }

            const newStore = await addDoc(collection(firestore, "stores"), {
                storeName,
                isGroup,
                groupId,
                img: url,
                createdAt: serverTimestamp(),
            });
            if (newStore.id) {
                return { status: 200, body: newStore.id };
            }
        } catch (e) {
            console.log("storeName", storeName);
            return { status: 400, body: e + "" };
        }
    };

    const getStores = async (): Promise<StoreListResponseObject> => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "stores")
            );
            let storeList: Store[] = [];
            querySnapshot.docs.forEach((store) => {
                const data = store.data();
                storeList.push({
                    storeId: store.id,
                    storeName: data.storeName,
                    img: data.img,
                    isGroup: data.isGroup,
                    createdAt: data.createdAt,
                });
            });
            return { status: 200, body: storeList };
        } catch (e) {
            return { status: 400, body: e + "" };
        }
    };

    const getStoreDetails = async ({
        storeId,
    }: {
        storeId: string;
    }): Promise<StoreResponseObject> => {
        try {
            if (!storeId) throw "Missing storeId";
            const docRef = doc(firestore, "stores", storeId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                const store: Store = {
                    storeId: data.storeId,
                    storeName: data.storeName,
                    isGroup: data.isGroup,
                    img: data.img,
                    createdAt: data.createdAt ? data.createdAt : undefined,
                    createdBy: data.createdBy ? data.createdBy : undefined,
                    tags: data.tagss ? data.tags : [],
                };
                return { status: 200, body: store };
            } else {
                return { status: 404, body: "Room not found" };
            }
        } catch (e) {
            return { status: 400, body: e + "" };
        }
    };

    const getStoreGroup = async ({
        isGroup = true,
    }): Promise<StoreListResponseObject> => {
        try {
            //Creates a reference to the stores collection
            const storesRef = collection(firestore, "stores");

            //Creates a query against the collection
            const q = query(storesRef, where("isGroup", "==", isGroup));

            const querySnapshot = await getDocs(q);
            let stores = querySnapshot.docs;
            let storeList: Store[] = [];
            stores.forEach((store) => {
                let data = store.data();
                storeList.push({
                    storeId: store.id,
                    storeName: data.storeName,
                    isGroup: data.isGroup,
                    img: data.img,
                    createdAt: data.createdAt ? data.createdAt : undefined,
                    createdBy: data.createdBy ? data.createdBy : undefined,
                    tags: data.tagss ? data.tags : [],
                });
            });
            return { status: 200, body: storeList };
        } catch (e) {
            console.error("An error occurred when getting store group", e);
            return { status: 400, body: e + "" };
        }
    };

    const addUser = async ({
        email,
        password,
        username,
        profile = null,
    }: AddUserParams): Promise<ResponseObject> => {
        try {
            if (!isValidEmail) throw "Invalid Email";

            const userAlreadyExists = await isValidUser(email);
            if (userAlreadyExists) throw "User already exists";

            const newPass = await bcrypt.hash(password, SALT_ROUNDS);
            if (newPass) {
                const data = {
                    email,
                    password: newPass,
                    username,
                    profile,
                };
                const res = await addDoc(collection(firestore, "users"), data);
                if (res.id) {
                    return { status: 200, body: res.id };
                } else {
                    throw "Something went wrong when add user to database";
                }
            } else {
                throw "Something went wrong with the hashing of password";
            }
        } catch (e) {
            console.error("An error occurred when adding user", e);
            return { status: 400, body: e + "" };
        }
    };

    const loginUser = async ({
        email,
        password,
    }: LoginUserParams): Promise<UserResponseObject> => {
        try {
            if (!isValidEmail) throw "Email provided is not valid";
            const userRef = collection(firestore, "users");
            const q = query(userRef, where("email", "==", email));
            const querySnapshot = await getDocs(q);
            if (querySnapshot.size < 1)
                return {
                    status: 404,
                    body: "User with email does not exist",
                };
            let res: UserResponseObject = {
                status: 400,
                body: "Something went wrong when checking your password",
            };
            await Promise.all(
                querySnapshot.docs.map(async (doc) => {
                    const userData = doc?.data();
                    const passwordHash = userData.password;
                    const isCorrectPassword = await bcrypt.compare(
                        password,
                        passwordHash
                    );
                    if (!isCorrectPassword) {
                        res = { status: 401, body: "Incorrect Password" };
                    } else {
                        res = {
                            status: 200,
                            body: {
                                userId: doc.id,
                                username: userData.username,
                            },
                        };
                    }
                })
            );
            return res;
        } catch (e) {
            return { status: 400, body: e + "" };
        }
    };

    const addItem = async ({
        itemName,
        storeId,
        img,
    }: AddItemParams): Promise<AddItemResponse> => {
        try {
            const url = await uploadImage(img);
            const data = {
                itemName,
                storeId,
                img: url,
                createdAt: serverTimestamp(),
            };
            console.log("data", data);
            const res = await addDoc(collection(firestore, "items"), data);
            if (res.id) {
                const data = res;
                console.log(data);
                const body: Item = {
                    itemId: res.id,
                    createdAt: "sometime",
                    itemName: itemName,
                    storeId,
                };
                return { status: 200, body: body };
            } else {
                throw "AN Error occured when adding item";
            }
        } catch (e) {
            console.error(e);
            return { status: 400, body: e + "" };
        }
    };

    const getItems = async (): Promise<ItemListResponse> => {
        try {
            const querySnapshot = await getDocs(collection(firestore, "items"));
            let itemList: Item[] = [];
            querySnapshot.forEach((item) => {
                const data = item.data();
                itemList.push({
                    itemId: item.id,
                    itemName: data.itemName,
                    storeId: data.storeId,
                    ...(data.tags ? { tags: data.tags } : {}),
                });
            });
            return { status: 200, body: itemList };
        } catch (e) {
            console.error(e);
            return {
                status: 400,
                body: e + "",
            };
        }
    };

    const getItemsByStore = async ({
        storeId,
    }: GetItemsByStoreParams): Promise<ItemListResponse> => {
        try {
            if (!storeId) throw "Invalid StoreID";
            //Creates a reference to the items collection
            const itemsRef = collection(firestore, "items");

            //Creates a query against the collection
            const q = query(itemsRef, where("storeId", "==", storeId));

            const querySnapshot = await getDocs(q);
            let items = querySnapshot.docs;
            let itemList: Item[] = [];
            items.forEach((item) => {
                let data = item.data();
                itemList.push({
                    itemId: item.id,
                    itemName: data.itemName,
                    img: data.img,
                    storeId: data.storeId,
                    createdAt: data.createdAt ? data.createdAt : undefined,
                    createdBy: data.createdBy ? data.createdBy : undefined,
                    tags: data.tagss ? data.tags : [],
                });
            });
            return { status: 200, body: itemList };
        } catch (e) {
            return { status: 400, body: e + "" };
        }
    };

    const addReviews = async ({
        reviewsArray,
    }: AddReviewParams): Promise<ResponseObject> => {
        try {
            if (reviewsArray.length < 1) throw "No reviews provided";

            const batch = writeBatch(firestore);
            const collectionRef = collection(firestore, "reviews");

            reviewsArray.forEach((review) => {
                const docRef = doc(collectionRef);
                batch.set(docRef, review);
            });

            await batch.commit();
            return { status: 200, body: "Success" };
        } catch (e) {
            console.error(e);
            return {
                status: 400,
                body: e + "",
            };
        }
    };

    const getReviews = async (): Promise<ReviewListResponse> => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "reviews")
            );
            let reviewList: Review[] = [];
            querySnapshot.docs.forEach((review) => {
                const data = review.data();
                reviewList.push({
                    reviewId: review.id,
                    storeId: data.storeId,
                    rating: data.rating,
                    comments: data.comments,
                    ...(data.userId ? { userId: data.userId } : {}),
                    ...(data.storeId ? { storeId: data.storeId } : {}),
                    ...(data.itemId ? { itemId: data.itemId } : {}),
                });
            });
            return {
                status: 200,
                body: reviewList,
            };
        } catch (e) {
            return {
                status: 400,
                body: e + "",
            };
        }
    };

    const addTags = async ({
        tagName,
        tagColor,
        userId,
    }: AddTagParams): Promise<TagResponse> => {
        try {
            const collectionRef = collection(firestore, "tags");
            const res = await addDoc(collectionRef, {
                tagName,
                tagColor,
                userId,
            });
            if (res.id) {
                return {
                    status: 200,
                    body: {
                        tagId: res.id,
                        tagName,
                        tagColor,
                        userId,
                    },
                };
            } else {
                throw "Error occured when creating Tag";
            }
        } catch (e) {
            console.error(e);
            return {
                status: 400,
                body: e + "",
            };
        }
    };

    return {
        addStore,
        getStores,
        getStoreDetails,
        getStoreGroup,
        addUser,
        loginUser,
        addItem,
        getItems,
        getItemsByStore,
        addReviews,
        getReviews,
        addTags,
    };
};

export default useDB;
