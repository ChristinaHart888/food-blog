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
import { firestore, storage, db } from "../components/firebaseConfig";

const useDB = () => {
    const addStore = async ({
        storeName,
        isGroup,
        file = null,
        groupId = null,
    }) => {
        try {
            if (!storeName || !isGroup) throw Error("Missing Store Info");
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

    const getStores = async () => {
        try {
            const querySnapshot = await getDocs(
                collection(firestore, "stores")
            );
            return { status: 200, body: querySnapshot.docs };
        } catch (e) {
            return { status: 400, body: e };
        }
    };

    const getStoreDetails = async ({ storeId }) => {
        try {
            if (!storeId) throw Error("Missing storeId");
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

    const getStoreGroup = async ({ isGroup = true }) => {
        try {
            //Creates a reference to the stores collection
            const storesRef = collection(firestore, "stores");

            //Creates a query against the collection
            const q = query(storesRef, where("isGroup", "==", isGroup));

            const querySnapshot = await getDocs(q);
            let storeArr = [];
            querySnapshot.forEach((store) => {
                storeArr.push(store);
            });
            return { status: 200, body: storeArr };
        } catch (e) {
            console.error("An error occurred when getting store group", e);
            return { status: 400, body: e };
        }
    };

    return {
        addStore,
        getStores,
        getStoreDetails,
        getStoreGroup,
    };
};

export default useDB;
