"use client";
import React, { useEffect, useState } from "react";
import useDB from "../hooks/useDB";
import { Item, Review } from "../types/dbTypes";

export default function ReviewList() {
    const [reviewList, setReviewList] = useState<Review[]>([]);
    const [itemList, setItemList] = useState<Item[]>([]);
    const { getReviews, getItems } = useDB();

    useEffect(() => {
        const init = async () => {
            const result = await getItems();
            if (result.status === 200 && typeof result.body !== "string") {
                setItemList(result.body);
            }
            const res = await getReviews();
            if (res.status === 200 && typeof res.body !== "string") {
                setReviewList(res.body);
            }
        };
        init();
    }, []);

    return (
        <div>
            {reviewList?.length > 0 &&
                reviewList.map((review) => {
                    return (
                        <div key={review.reviewId}>
                            {"itemId" in review && (
                                <div
                                    style={{
                                        padding: "1em 0.5em",
                                        border: "1px solid white",
                                    }}
                                >
                                    <span style={{ fontWeight: "bold" }}>
                                        {
                                            itemList[
                                                itemList.findIndex(
                                                    (item) =>
                                                        item.itemId ===
                                                        review.itemId
                                                )
                                            ].itemName
                                        }
                                    </span>
                                    <div className="review">
                                        <p>{review.rating}/10</p>
                                        {review.comments}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
        </div>
    );
}
