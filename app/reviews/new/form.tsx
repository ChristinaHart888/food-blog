/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Card from "@/app/components/card";
import Popup from "@/app/components/popup";
import TextInput from "@/app/components/TextInput";
import useDB from "@/app/hooks/useDB";
import { Item } from "@/app/types/dbTypes";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

export default function Form() {
    const [stores, setStores] = useState<any>();
    const [selectedStore, setSelectedStore] = useState<DocumentData | null>(
        null
    );
    const [storeSearchTerm, setStoreSearchTerm] = useState<string>("");
    const [items, setItems] = useState<Item[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newItemName, setNewItemName] = useState<string>("");
    const [newImg, setNewImg] = useState<File | undefined>();
    const [newRating, setNewRating] = useState<number>();
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { getStores, addItem } = useDB();

    useEffect(() => {
        const initRoom = async () => {
            const res = await getStores();
            if (res.status === 200 && typeof res.body !== "string") {
                setStores(res.body);
                console.log("res.body", res.body);
                // res.body.forEach((store: any) => {
                //     console.log("store", store.data());
                // });
            }
        };
        initRoom();
    }, []);

    const addItemHandler = async (e: any) => {
        e.preventDefault;
        setIsLoading(true);
        if (newItemName && selectedStore) {
            {
                const res = await addItem({
                    itemName: newItemName,
                    storeId: selectedStore.id,
                    img: newImg,
                });
                if (res.status === 200) {
                    setIsLoading(false);
                    closeModal();
                } else {
                    console.error(res.body);
                }
                console.log(res);
            }
        } else {
            setErrorMessage("Please fill in all the fields");
        }
    };

    const openModal = () => {
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    return (
        <div
            className="formDiv"
            style={{
                border: "1px solid white",
                margin: "1em",
                padding: "1em 0.5em",
                minHeight: "650px",
            }}
        >
            <form
                action=""
                style={{ display: "flex", flexDirection: "column" }}
            >
                <label htmlFor="store">Store Name</label>
                {!selectedStore ? (
                    <>
                        <input
                            type="text"
                            id="store"
                            style={{ padding: "0.5em 1em", margin: "1em 0" }}
                            value={storeSearchTerm}
                            onChange={(e) => setStoreSearchTerm(e.target.value)}
                        />
                        <div
                            className="storelist"
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                overflow: "scroll",
                                maxHeight: "25em",
                            }}
                        >
                            {stores?.map((store: any, index: number) => {
                                // console.log("Store", store);
                                const storeData = store.data();
                                const showStore =
                                    storeSearchTerm.length == 0 ||
                                    (storeSearchTerm.length > 0 &&
                                        storeData.storeName
                                            .toUpperCase()
                                            .includes(
                                                storeSearchTerm.toUpperCase()
                                            ));
                                return (
                                    <>
                                        {showStore ? (
                                            <div
                                                key={index}
                                                onClick={() => {
                                                    // console.log(
                                                    //     store.data(),
                                                    //     store.id
                                                    // );
                                                    setSelectedStore(store);
                                                }}
                                                style={{
                                                    width: "100%",
                                                    border: "1px solid white",
                                                    padding: "0.5em 1em",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                {storeData.storeName}
                                            </div>
                                        ) : (
                                            <></>
                                        )}
                                    </>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <div
                        style={{
                            padding: "0.5em 1em",
                            display: "flex",
                            border: "1px solid white",
                            justifyContent: "space-between",
                        }}
                    >
                        {selectedStore.data().storeName}{" "}
                        <div
                            onClick={() => setSelectedStore(null)}
                            style={{ cursor: "pointer" }}
                        >
                            X
                        </div>
                    </div>
                )}
                {selectedStore && (
                    <>
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                margin: "1.5em 0",
                            }}
                        >
                            <h4>Items</h4>
                            <div
                                onClick={(e) => {
                                    e.preventDefault();
                                    setModalIsOpen(true);
                                }}
                            >
                                Add Item
                            </div>
                        </div>
                        <div className="itemList">
                            <input
                                type="text"
                                placeholder="Search"
                                style={{
                                    padding: "1em 0.5em",
                                    width: "100%",
                                    backgroundColor: "#444",
                                }}
                            />
                            <div className="itemms"></div>
                        </div>
                        <Modal
                            isOpen={modalIsOpen}
                            shouldCloseOnOverlayClick={true}
                            onRequestClose={closeModal}
                            style={{
                                content: {
                                    backgroundColor: "#333",
                                    border: "none",
                                    bottom: "auto",
                                    top: "30%",
                                    paddingBottom: "3em",
                                },
                                overlay: {},
                            }}
                        >
                            <h2>New Item</h2>
                            <form action={addItemHandler}>
                                <TextInput
                                    label={"Item Name"}
                                    type="text"
                                    onChange={setNewItemName}
                                    style={{
                                        margin: "1em 0",
                                        borderBottom: "1px solid white",
                                    }}
                                    required
                                ></TextInput>

                                <label
                                    htmlFor=""
                                    style={{
                                        width: "100%",
                                        display: "block",
                                        margin: "1em 0 0.5em 0",
                                    }}
                                >
                                    Image
                                </label>
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        setNewImg(
                                            e.target.files
                                                ? e.target.files[0]
                                                : undefined
                                        );
                                    }}
                                />
                                <label
                                    style={{
                                        margin: "1em 0",
                                        width: "100%",
                                        display: "block",
                                    }}
                                >
                                    Tags
                                </label>
                                <small>WIP</small>
                                {!isLoading ? (
                                    <button
                                        type="submit"
                                        style={{
                                            width: "100%",
                                            marginLeft: "auto",
                                            padding: "1em 0.5em",
                                            marginTop: "1em",
                                        }}
                                    >
                                        Add item
                                    </button>
                                ) : (
                                    <div
                                        style={{
                                            width: "100%",
                                            marginLeft: "auto",
                                            padding: "1em 0.5em",
                                            marginTop: "1em",
                                        }}
                                    >
                                        Loading...
                                    </div>
                                )}
                            </form>
                        </Modal>
                    </>
                )}
            </form>
            <Popup
                errorMessage={errorMessage}
                setErrorMessage={setErrorMessage}
                timeout={5000}
            ></Popup>
        </div>
    );
}
