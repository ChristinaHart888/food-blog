"use client";
import React, { useState } from "react";

export default function Form() {
    const [tagName, setTagName] = useState<string>("");
    const [color, setColor] = useState<string>("");

    return (
        <form
            style={{
                display: "flex",
                flexDirection: "column",
            }}
        >
            <label htmlFor="">Tag Name</label>
            <input type="text" style={{ padding: "1em 0.5em" }} />
            <label htmlFor="color">Tag Color</label>
            <div
                className="color"
                style={{
                    border: "1px solid white",
                    display: "flex",
                    flexWrap: "wrap",
                }}
            >
                <div
                    style={{
                        width: "3em",
                        height: "3em",
                        borderRadius: "100VMAX",
                        backgroundColor: "red",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",
                        borderRadius: "100VMAX",
                        backgroundColor: "green",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",
                        borderRadius: "100VMAX",
                        backgroundColor: "blue",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",
                        borderRadius: "100VMAX",
                        backgroundColor: "yellow",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",

                        borderRadius: "100VMAX",
                        backgroundColor: "indigo",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",

                        borderRadius: "100VMAX",
                        backgroundColor: "orange",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",

                        borderRadius: "100VMAX",
                        backgroundColor: "purple",
                        margin: "0.5em",
                    }}
                ></div>
                <div
                    style={{
                        width: "3em",
                        height: "3em",

                        borderRadius: "100VMAX",
                        backgroundColor: "grey",
                        margin: "0.5em",
                    }}
                ></div>
            </div>
        </form>
    );
}
