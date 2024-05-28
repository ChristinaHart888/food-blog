"use client";
import React, { useEffect, useState } from "react";
import useDB from "../hooks/useDB";

export default function Page() {
    const [storeList, setStoreList] = useState([]);
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
                    border: "1px solid white",
                    margin: "1em",
                    padding: "0.5em 1em",
                }}
            >
                {storeList.length > 0 ? (
                    storeList.map((store, index) => {
                        const storeData = store.data();
                        console.log(storeData);
                        const storeName = storeData.storeName;
                        return <div key={index}>{storeName}</div>;
                    })
                ) : (
                    <span>Loading...</span>
                )}
            </div>
        </div>
    );
}
