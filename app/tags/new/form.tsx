"use client";
import useDB from "@/app/hooks/useDB";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function Form() {
    const [tagName, setTagName] = useState<string>("");
    const [selectedColor, setSelectedColor] = useState<string>("red");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const COLORS = [
        "red",
        "orange",
        "yellow",
        "green",
        "aqua",
        "purple",
        "pink",
        "grey",
    ];
    const { addTag } = useDB();
    const router = useRouter();
    const submitFormHandler = async () => {
        setIsLoading(true);
        if (tagName == "") return alert("Tag Name is required");
        const userId = localStorage.getItem("userId");
        if (!userId) return router.push("/login");
        const res = await addTag({
            tagName,
            tagColor: selectedColor,
            userId,
        });
        if (res.status === 200) {
            alert("Tag added");
            window.location.reload();
        } else {
            alert("An error hhas occured");
            console.error(res.body);
            setIsLoading(false);
        }
    };

    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
                border: "1px solid white",
                padding: "1em",
                flexGrow: 1,
            }}
            action={submitFormHandler}
        >
            <label
                htmlFor=""
                style={{
                    marginBottom: "1em",
                    fontWeight: "bold",
                    fontSize: "1.5em",
                }}
            >
                Tag Name
            </label>
            <input
                type="text"
                style={{ padding: "1em 0.5em" }}
                value={tagName}
                onChange={(e) => setTagName(e.target.value)}
                required
            />
            <label
                htmlFor="color"
                style={{
                    marginBlock: "1em",
                    fontWeight: "bold",
                    fontSize: "1.5em",
                }}
            >
                Tag Color
            </label>
            <div
                className="color"
                style={{
                    border: "1px solid white",
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                {COLORS.map((color) => (
                    <div
                        style={{
                            width: "3em",
                            height: "3em",
                            borderRadius: "100VMAX",
                            backgroundColor: color,
                            margin: "0.5em",
                            cursor: "pointer",
                            border:
                                selectedColor === color
                                    ? "3px solid lime"
                                    : "none",
                        }}
                        onClick={() => setSelectedColor(color)}
                    ></div>
                ))}
            </div>
            {!isLoading ? (
                <button
                    type="submit"
                    style={{
                        padding: "1em",
                        marginBlock: "1em",
                    }}
                >
                    Create Tag
                </button>
            ) : (
                <span>Loading...</span>
            )}
        </form>
    );
}
