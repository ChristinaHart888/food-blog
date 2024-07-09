"use client";
import { Item, NewItemReview } from "@/app/types/dbTypes";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dropdown from "./dropdown-arrow.png";

interface ItemReviewDropdownParams {
    item: Item;
    newReviewList: NewItemReview[];
    setNewReviewList: React.Dispatch<React.SetStateAction<NewItemReview[]>>;
}

export default function ItemReviewDropdown({
    item,
    newReviewList,
    setNewReviewList,
}: ItemReviewDropdownParams) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [newRating, setNewRating] = useState<number>(5);
    const [newComments, setNewComments] = useState<string>("");

    useEffect(() => {
        //Check if newReviewList already has item
        const index = newReviewList.findIndex(
            (newReview) => newReview.itemId === item.itemId
        );

        //If newReviewList has item
        if (index !== -1) {
            //Update newReviewList
            setNewReviewList((prevList) =>
                prevList.map((newReview) =>
                    newReview.itemId === item.itemId
                        ? {
                              ...newReview,
                              rating: newRating,
                              comments: newComments,
                          }
                        : newReview
                )
            );
        } else {
            //Add item to newReviewList
            const userId = localStorage.getItem("userId");
            if (userId) {
                setNewReviewList((prev) => [
                    ...prev,
                    {
                        itemId: item.itemId,
                        rating: newRating,
                        comments: newComments,
                        userId: userId,
                    },
                ]);
            }
        }
    }, [newRating, newComments]);

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "1em 0.5em",
                display: "flex",
                flexDirection: "column",
            }}
        >
            <div
                className="top"
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    width: "100%",
                }}
            >
                <div
                    className="left"
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                    }}
                >
                    <span style={{ fontWeight: "bold" }}>{item.itemName}</span>
                    <div
                        className="reviewOutline"
                        style={{ flexGrow: 1, display: "flex" }}
                    >
                        <span style={{ color: "#CCC", paddingLeft: "1em" }}>
                            {newRating}/10
                        </span>
                        {newComments.length > 0 && (
                            <span
                                style={{
                                    paddingLeft: "1em",
                                    flexGrow: 1,
                                    textOverflow: "ellipsis",
                                    overflow: "hidden",
                                    maxWidth: "190px",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {newComments}
                            </span>
                        )}
                    </div>
                </div>

                <div
                    className="dropwdownArrow"
                    onClick={() => {
                        setIsExpanded((prev) => !prev);
                    }}
                >
                    <Image
                        src={dropdown}
                        width={20}
                        height={20}
                        style={{
                            marginRight: "0.5em",
                            rotate: isExpanded ? "180deg" : "0deg",
                            transition: "150ms ease-in-out",
                            cursor: "pointer",
                        }}
                        alt="V"
                    ></Image>
                </div>
            </div>{" "}
            {isExpanded && (
                <div
                    className="expanded-content"
                    style={{
                        paddingTop: "0.5em",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    <span>Rating ({newRating})</span>
                    <div className="rating">
                        <input
                            type="range"
                            name=""
                            id=""
                            style={{ width: "100%" }}
                            min={0}
                            max={10}
                            step={1}
                            value={newRating}
                            onChange={(e) => {
                                setNewRating(parseInt(e.target.value));
                            }}
                        />
                    </div>
                    <span style={{ marginTop: "0.5em" }}>Comments</span>
                    <textarea
                        name=""
                        id=""
                        cols={30}
                        rows={10}
                        value={newComments}
                        onChange={(e) => {
                            setNewComments(e.target.value);
                        }}
                    ></textarea>
                </div>
            )}
        </div>
    );
}
