/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import useDB from "../hooks/useDB";
import Card from "../components/card";
import { Store } from "../types/dbTypes";

export default function Page() {
    //TODO: Add interface for stores
    const [storeList, setStoreList] = useState<Store[]>([]);
    const { getStores } = useDB();

    const initRoom = async () => {
        const res = await getStores();
        if (res.status === 200 && typeof res.body !== "string") {
            console.log(res.body);
            setStoreList(res.body);
        } else {
            console.error(res.body);
        }
    };

    useEffect(() => {
        initRoom();
    }, []);

    return (
        <div>
            <h1>Stores</h1>
            <input type="text" placeholder="Search" />
            <div
                className="storeList"
                style={{
                    display: "grid",
                    gap: "0.4em",
                    gridTemplateColumns:
                        "repeat(auto-fit, minmax(175px, 10em))",
                    padding: "0.5em",
                    justifyContent: "center",
                }}
            >
                {storeList.length > 0 ? (
                    storeList.map((store, index) => {
                        return (
                            <Card
                                title={store.storeName}
                                key={index}
                                background={store.img}
                                link={`/stores/${store.storeId}`}
                            ></Card>
                        );
                    })
                ) : (
                    <span>Loading...</span>
                )}
            </div>
        </div>
    );
}
