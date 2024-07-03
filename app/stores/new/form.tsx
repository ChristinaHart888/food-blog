/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import React, { useEffect, useState } from "react";
import useDB from "../../hooks/useDB";
import { Store } from "@/app/types/dbTypes";
import Popup from "@/app/components/popup";

export default function Form() {
    const [isGroup, setIsGroup] = useState<boolean>(false);
    const [file, setFile] = useState(null);
    const [storeName, setStoreName] = useState<string>("");
    const [searchGroupName, setSearchGroupName] = useState<string>("");
    const [selectedGroup, setSelectedGroup] = useState<
        Store | null | undefined
    >(undefined);
    //TODO: Fix the probelm with the button not being disabled when isLoading is true
    const [isLoading, setIsLoading] = useState<boolean>(false);
    //TODO: Set store interface
    const [storeGroup, setStoreGroup] = useState<Store[]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");

    const { addStore, getStoreGroup } = useDB();

    useEffect(() => {
        const initRoom = async () => {
            const res = await getStoreGroup({ isGroup: true });
            if (res.status === 200 && typeof res.body !== "string") {
                console.log(res.body);
                setStoreGroup(res.body);
            } else {
                console.error(res.body);
                setErrorMessage(res.body + "");
            }
        };
        initRoom();
    }, []);

    const handleFileChange = (e: any) => {
        setFile(e.target.files[0]);
    };

    const handleAddStore = async () => {
        setIsLoading(true);
        const result = await addStore({
            storeName,
            isGroup,
            file,
            groupId: selectedGroup ? selectedGroup?.storeId : null,
        });
        if (result?.status === 200) {
            console.log("Done", result.body);
            setIsLoading(false);
            window.location.reload();
        } else {
            console.error(result?.body);
            setErrorMessage(result?.body + "");
            setIsLoading(false);
        }
    };

    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                padding: " 1em",
                border: "1px solid white",
                margin: "1em",
            }}
        >
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <label htmlFor="store-name">Store Name</label>
                <input
                    type="text"
                    className="store-name"
                    onChange={(e) => setStoreName(e.target.value)}
                    value={storeName}
                    style={{
                        padding: "1em 0.5em",
                    }}
                />
            </div>
            <div
                style={{
                    margin: "0.5em 0",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <label htmlFor="group-selector">Type of store</label>
                <div className="group-selector" style={{ display: "flex" }}>
                    <div
                        onClick={() => setIsGroup(true)}
                        style={{
                            cursor: "pointer",
                            border: "1px solid white",
                            padding: "1em",
                            width: "50%",
                            textAlign: "center",
                            backgroundColor: isGroup ? "green" : "#222",
                        }}
                    >
                        Group
                    </div>
                    <div
                        onClick={() => setIsGroup(false)}
                        style={{
                            cursor: "pointer",
                            border: "1px solid white",
                            padding: "1em",
                            width: "50%",
                            textAlign: "center",
                            backgroundColor: !isGroup ? "green" : "#222",
                        }}
                    >
                        Individual
                    </div>
                </div>
            </div>
            {!isGroup && (
                <div
                    style={{
                        margin: "0.5em 0",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <label htmlFor="group">What group is it in?</label>
                    {selectedGroup !== undefined ? (
                        <div
                            style={{
                                border: "1px solid white",
                                padding: "1em 0.5em",
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <span>
                                {selectedGroup === null
                                    ? "No Group"
                                    : selectedGroup.storeName}
                            </span>
                            <div
                                className="div"
                                onClick={() => setSelectedGroup(undefined)}
                                style={{
                                    cursor: "pointer",
                                }}
                            >
                                X
                            </div>
                        </div>
                    ) : (
                        <>
                            <input
                                id="group"
                                type="text"
                                style={{
                                    padding: "1em 0.5em",
                                }}
                                value={searchGroupName}
                                onChange={(e) =>
                                    setSearchGroupName(e.target.value)
                                }
                            />
                            <div
                                className="groupList"
                                style={{
                                    maxHeight: "20em",
                                    overflow: "scroll",
                                }}
                            >
                                <div
                                    style={{
                                        padding: "1em 0.5em",
                                        borderBottom: "1px solid black",
                                        backgroundColor: "#444",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => {
                                        setSelectedGroup(null);
                                        setSearchGroupName("No Group");
                                    }}
                                >
                                    No Group
                                </div>
                                {storeGroup.length > 0 &&
                                    storeGroup.map((store) => {
                                        const showStore =
                                            searchGroupName.length === 0 ||
                                            (searchGroupName.length > 0 &&
                                                store.storeName
                                                    .toUpperCase()
                                                    .includes(
                                                        searchGroupName.toUpperCase()
                                                    ));
                                        return (
                                            <div
                                                style={{
                                                    padding: "1em 0.5em",
                                                    borderBottom:
                                                        "1px solid black",
                                                    backgroundColor: "#444",
                                                    display: showStore
                                                        ? "block"
                                                        : "none",
                                                    cursor: "pointer",
                                                }}
                                                onClick={() => {
                                                    setSelectedGroup(store);
                                                }}
                                            >
                                                {store.storeName}
                                            </div>
                                        );
                                    })}
                            </div>{" "}
                        </>
                    )}
                    {/* <datalist id="groups">
                        <option value="0">No Group</option>
                        {storeGroup.length > 0 &&
                            storeGroup.map((store) => {
                                return (
                                    <option
                                        key={store.storeId}
                                        value={store.storeName}
                                    >
                                        {store.storeName}
                                    </option>
                                );
                            })}
                    </datalist> */}
                </div>
            )}
            <div
                style={{
                    margin: "0.5em 0",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <label htmlFor="img">Image</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            {isLoading ? (
                <span>Loading...</span>
            ) : (
                <button
                    type="submit"
                    disabled={isLoading}
                    style={{ cursor: "pointer", padding: "1em 0.5em" }}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsLoading(true);
                        handleAddStore();
                    }}
                >
                    Create Store
                </button>
            )}
            {errorMessage && (
                <Popup
                    errorMessage={errorMessage}
                    setErrorMessage={setErrorMessage}
                    timeout={5000}
                ></Popup>
            )}
        </form>
    );
}
