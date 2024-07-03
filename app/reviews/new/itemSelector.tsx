/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import Card from "@/app/components/card";
import Popup from "@/app/components/popup";
import TextInput from "@/app/components/TextInput";
import useDB from "@/app/hooks/useDB";
import { Item, Store } from "@/app/types/dbTypes";
import { DocumentData } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import Modal from "react-modal";

interface ItemSelectorParams {
    stores: Store[];
    selectedStore: Store | null;
    setSelectedStore: React.Dispatch<React.SetStateAction<Store | null>>;
    items: Item[];
    setItems: React.Dispatch<React.SetStateAction<Item[]>>;
    selectedItems: Item[];
    setSelectedItems: React.Dispatch<React.SetStateAction<Item[]>>;
    setErrorMessage: React.Dispatch<React.SetStateAction<string>>;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ItemSelector({
    stores,
    selectedStore,
    setSelectedStore,
    items,
    setItems,
    selectedItems,
    setSelectedItems,
    setErrorMessage,
    setCurrentPage,
}: ItemSelectorParams) {
    const [storeSearchTerm, setStoreSearchTerm] = useState<string>("");
    const [itemSearchTerm, setItemSearchTerm] = useState<string>("");
    const [modalIsOpen, setModalIsOpen] = useState<boolean>(false);
    const [newItemName, setNewItemName] = useState<string>("");
    const [newImg, setNewImg] = useState<File | undefined>();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { getStores, addItem, getItemsByStore } = useDB();

    const getItems = async (storeId: string) => {
        const res = await getItemsByStore({ storeId });
        if (res.status === 200 && typeof res.body !== "string") {
            setItems(res.body);
        }
    };

    useEffect(() => {
        selectedStore && getItems(selectedStore.storeId);
    }, [selectedStore]);

    const addItemHandler = async (e: any) => {
        e.preventDefault;
        setIsLoading(true);
        if (newItemName && selectedStore) {
            {
                const res = await addItem({
                    itemName: newItemName,
                    storeId: selectedStore.storeId,
                    img: newImg,
                });
                if (res.status === 200) {
                    setIsLoading(false);
                    closeModal();
                    getItems(selectedStore.storeId);
                    setNewImg(undefined);
                    setNewItemName("");
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

    const selectItemHandler = (item: Item) => {
        if (selectedItems.includes(item)) {
            setSelectedItems((prevItems) =>
                prevItems.filter(
                    (selectedItem) => selectedItem.itemId !== item.itemId
                )
            );
        } else {
            setSelectedItems((prevItems) => [...prevItems, item]);
        }
    };

    return (
        <>
            {" "}
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
                        {stores?.map((store: Store, index: number) => {
                            // console.log("Store", store);
                            const showStore =
                                storeSearchTerm.length == 0 ||
                                (storeSearchTerm.length > 0 &&
                                    store.storeName
                                        .toUpperCase()
                                        .includes(
                                            storeSearchTerm.toUpperCase()
                                        ));
                            return (
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
                                        display: showStore ? "block" : "none",
                                    }}
                                >
                                    {store.storeName}
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
                    {selectedStore.storeName}{" "}
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
                        <h4>Items({selectedItems.length})</h4>
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                setModalIsOpen(true);
                            }}
                            style={{ cursor: "pointer" }}
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
                            value={itemSearchTerm}
                            onChange={(e) => {
                                setItemSearchTerm(e.target.value);
                            }}
                            //TODO: Handel search
                        />
                        <div
                            className="items"
                            style={{
                                marginBlock: "1em",
                                maxHeight: "30em",
                                overflow: "scroll",
                            }}
                        >
                            {items.length > 0 &&
                                items.map((item: Item) => {
                                    const isSelected = selectedItems.some(
                                        (selectedItem) =>
                                            selectedItem.itemId === item.itemId
                                    );
                                    return (
                                        <div
                                            key={item.itemId}
                                            style={{
                                                borderBottom: "1px solid black",
                                                padding: "1em 0.5em",
                                                display: "flex",
                                                backgroundColor: isSelected
                                                    ? "green"
                                                    : "#555",
                                                justifyContent: "space-between",
                                                cursor: "pointer",
                                            }}
                                            onClick={() => {
                                                selectItemHandler(item);
                                            }}
                                        >
                                            <span>{item.itemName}</span>
                                            {/* <input type="checkbox" /> */}
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                    <button
                        style={{
                            padding: "1em 0.5em",
                            width: "100%",
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(2);
                        }}
                    >
                        Next
                    </button>
                    <Modal
                        isOpen={modalIsOpen}
                        shouldCloseOnOverlayClick={true}
                        onRequestClose={closeModal}
                        style={{
                            content: {
                                backgroundColor: "#333",
                                border: "none",
                                bottom: "auto",
                                top: "20%",
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
                                value={newItemName}
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
        </>
    );
}
