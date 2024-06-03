/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import useDB from "../hooks/useDB";
import Card from "../components/card";

export default function Page() {
    //TODO: Add interface for stores
    const [storeList, setStoreList] = useState<any[]>([]);
    const { getStores } = useDB();

    const initRoom = async () => {
        const res = await getStores();
        if (res.status === 200) {
            console.log(res.body);
            setStoreList(res.body);
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
                }}
            >
                {storeList.length > 0 ? (
                    storeList.map((store, index) => {
                        const storeData = store.data();
                        console.log(storeData);
                        const storeName = storeData.storeName;
                        return (
                            <Card
                                title={storeName}
                                key={index}
                                background={storeData.img}
                                link={`/stores/${store.id}`}
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
