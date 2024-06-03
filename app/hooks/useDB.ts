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
} from "firebase/firestore";
import { firestore, storage } from "../components/firebaseConfig";
import bcrypt from "bcryptjs-react";
import {
    AddStoreParams,
    AddUserParams,
    LoginUserParams,
    ResponseObject,
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
        console.log("queruSnapshot", querySnapshot);
        return querySnapshot.size > 0;
    };

    const addStore = async ({
        storeName,
        isGroup,
        file = null,
        groupId = null,
    }: AddStoreParams) => {
        try {
            if (!storeName || !isGroup) throw "Missing Store Info";
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
            return { status: 400, body: e };
        }
    };

    const getStores = async (): Promise<ResponseObject> => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "stores")
            );
            return { status: 200, body: querySnapshot.docs };
        } catch (e) {
            return { status: 400, body: e };
        }
    };

    const getStoreDetails = async ({
        storeId,
    }: {
        storeId: string;
    }): Promise<ResponseObject> => {
        try {
            if (!storeId) throw "Missing storeId";
            const docRef = doc(firestore, "stores", storeId);
            const docSnapshot = await getDoc(docRef);

            if (docSnapshot.exists()) {
                const data = docSnapshot.data();
                return { status: 200, body: data };
            } else {
                return { status: 404, body: "Room not found" };
            }
        } catch (e) {
            return { status: 400, body: e };
        }
    };

    const getStoreGroup = async ({
        isGroup = true,
    }): Promise<ResponseObject> => {
        try {
            //Creates a reference to the stores collection
            const storesRef = collection(firestore, "stores");

            //Creates a query against the collection
            const q = query(storesRef, where("isGroup", "==", isGroup));

            const querySnapshot = await getDocs(q);
            let storeArr: Object[] = [];
            querySnapshot.forEach((store) => {
                storeArr.push(store);
            });
            return { status: 200, body: storeArr };
        } catch (e) {
            console.error("An error occurred when getting store group", e);
            return { status: 400, body: e };
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
            return { status: 400, body: e };
        }
    };

    const loginUser = async ({
        email,
        password,
    }: LoginUserParams): Promise<ResponseObject> => {
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
            let res: ResponseObject = {
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
                            body: { ...userData, userId: doc.id },
                        };
                    }
                })
            );
            return res;
        } catch (e) {
            return { status: 400, body: e };
        }
    };

    //const addReview = async ({ userId, storeId, rating, comment }) => {};

    return {
        addStore,
        getStores,
        getStoreDetails,
        getStoreGroup,
        addUser,
        loginUser,
    };
};

export default useDB;
