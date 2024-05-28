import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import {
    collection,
    addDoc,
    serverTimestamp,
    getDocs,
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

    return {
        addStore,
        getStores,
    };
};

export default useDB;
