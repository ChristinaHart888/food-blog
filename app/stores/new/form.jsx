"use client";
import React, { useState } from "react";
import useDB from "../../hooks/useDB";

export default function Form() {
    const [isGroup, setIsGroup] = useState(false);
    const [file, setFile] = useState(null);
    const [storeName, setStoreName] = useState("");
    const [groupId, setGroupId] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const { addStore } = useDB();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleAddStore = async () => {
        console.log("Adding store");
        setIsLoading(true);
        const result = await addStore({
            storeName,
            isGroup,
            file,
            groupId,
            file,
        });
        if (result.status === 200) {
            console.log("Done", result.body);
            setIsLoading(false);
            alert("New store added");
        } else {
            console.error(result.body);
        }
    };

    return (
        <form
            action={handleAddStore}
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
                <div
                    className="group-selector"
                    onClick={() => setIsGroup((curr) => !curr)}
                    style={{ cursor: "pointer", border: "1px solid white" }}
                >
                    {isGroup ? "Group" : "Individual"}
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
                    <input id="group" list="groups" defaultValue="No Group" />
                    <datalist id="groups">
                        <option value="0">No Group</option>
                    </datalist>
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
                <button type="submit">Create Store</button>
            )}
        </form>
    );
}
