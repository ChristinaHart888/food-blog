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
import ItemSelector from "./itemSelector";
import ReviewPage from "./reviewPage";

export default function Form() {
    const [stores, setStores] = useState<Store[]>([]);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null);
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItems, setSelectedItems] = useState<Item[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const { getStores, addItem, getItemsByStore } = useDB();

    useEffect(() => {
        const initRoom = async () => {
            const res = await getStores();
            if (res.status === 200 && typeof res.body !== "string") {
                setStores(res.body);
                setIsLoading(false);
                // res.body.forEach((store: any) => {
                //     console.log("store", store.data());
                // });
            }
        };
        initRoom();
    }, []);

    return (
        <div
            className="formDiv"
            style={{
                border: "1px solid white",
                margin: "1em",
                padding: "1em 0.5em",
                minHeight: "650px",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <form
                action=""
                style={{
                    height: "100%",
                    width: "100%",
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                {currentPage === 1 && (
                    <ItemSelector
                        stores={stores}
                        selectedStore={selectedStore}
                        setSelectedStore={setSelectedStore}
                        items={items}
                        setItems={setItems}
                        selectedItems={selectedItems}
                        setSelectedItems={setSelectedItems}
                        setErrorMessage={setErrorMessage}
                        setCurrentPage={setCurrentPage}
                    ></ItemSelector>
                )}
                {currentPage === 2 && (
                    <ReviewPage
                        selectedItems={selectedItems}
                        setCurrentPage={setCurrentPage}
                    ></ReviewPage>
                )}
            </form>

            {isLoading && <span>Loading...</span>}
            {errorMessage && (
                <Popup
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    timeout={5000}
                ></Popup>
            )}
        </div>
    );
}
