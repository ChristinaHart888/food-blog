/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useRef, useState } from "react";
import { useEffect } from "react";
import useDB from "../../hooks/useDB";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Page({ params }) {
    const { getStoreDetails } = useDB();
    const [storeDetails, setStoreDetails] = useState(null);

    const initRoom = async () => {
        const res = await getStoreDetails({ storeId: params.id });
        if (res.status === 200) {
            console.log(res.body);
            setStoreDetails(res.body);
        } else if (res.status === 404) {
            alert("Room not found");
            router.push("/");
        } else {
            console.error(res.body);
        }
    };

    useEffect(() => {
        initRoom();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <h1>
                {storeDetails === null ? "Loading..." : storeDetails.storeName}
            </h1>
            {storeDetails && (
                <>
                    {storeDetails.img && (
                        <img
                            src={storeDetails.img}
                            style={{ margin: "1em", width: "calc(100% - 2em)" }}
                            alt="An Image of the store"
                        ></img>
                    )}
                    <div
                        className="storeDetails"
                        style={{
                            margin: "1em",
                            border: "1px solid white",
                            padding: "0.5em 1em",
                        }}
                    >
                        <span>
                            Type of store:{" "}
                            <strong>
                                {storeDetails.isGroup ? "Group" : "Individual"}
                            </strong>
                        </span>
                    </div>
                    {storeDetails.isGroup && (
                        <>
                            <h3 style={{ margin: "1em" }}>Sub Stores</h3>
                        </>
                    )}
                    <h3 style={{ margin: "1em" }}>Reviews</h3>
                </>
            )}
        </div>
    );
}
