"use client";
import Card from "@/app/components/card";
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
    const [items, setItems] = useState<Item[]>([]);
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newItemName, setNewItemName] = useState<string>("");
    const [newRating, setNewRating] = useState<number>();

    const { getStores } = useDB();

    useEffect(() => {
        const initRoom = async () => {
            const res = await getStores();
            if (res.status === 200 && typeof res.body !== "string") {
                setStores(res.body);
                console.log("res.body", res.body);
                res.body.forEach((store: any) => {
                    console.log("store", store.data());
                });
            }
        };
        initRoom();
    }, []);

    const addItemHandler = () => {};

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
                                console.log("Store", store);
                                const storeData = store.data();
                                return (
                                    <div
                                        key={index}
                                        onClick={() => {
                                            console.log(store.data(), store.id);
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
                <label htmlFor="items">Items</label>
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setModalIsOpen(true);
                    }}
                >
                    Add Item
                </button>
                <Modal
                    isOpen={modalIsOpen}
                    style={{
                        content: {
                            backgroundColor: "#333",
                            border: "none",
                        },
                        overlay: {},
                    }}
                >
                    <h2>New Item</h2>
                    <form action="">
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
                        <TextInput
                            label="Rating (1-10)"
                            type="number"
                            onChange={setNewRating}
                            max={10}
                            min={1}
                            required
                        ></TextInput>
                    </form>
                </Modal>
            </form>
        </div>
    );
}
