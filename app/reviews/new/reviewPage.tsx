import { Item, NewItemReview } from "@/app/types/dbTypes";
import React, { useEffect, useState } from "react";
import ItemReviewDropdown from "./itemReviewDropdown";

interface ReviewPageParams {
    selectedItems: Item[];
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    newReviewList: NewItemReview[];
    setNewReviewList: React.Dispatch<React.SetStateAction<NewItemReview[]>>;
    isUploadingReviews: boolean;
    setIsUploadingReviews: React.Dispatch<React.SetStateAction<boolean>>;
    addReviewsHandler: () => Promise<void>;
}

export default function ReviewPage({
    selectedItems,
    setCurrentPage,
    newReviewList,
    setNewReviewList,
    isUploadingReviews,
    setIsUploadingReviews,
    addReviewsHandler,
}: ReviewPageParams) {
    useEffect(() => {
        setNewReviewList(
            selectedItems.map((item) => ({
                itemId: item.itemId,
                rating: 5,
                comments: "",
            }))
        );
    }, []);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "100%",
                flexGrow: 1,
            }}
        >
            <div className="content">
                {selectedItems?.length > 0 ? (
                    selectedItems.map((item) => {
                        return (
                            <ItemReviewDropdown
                                key={item.itemId}
                                item={item}
                                newReviewList={newReviewList}
                                setNewReviewList={setNewReviewList}
                            ></ItemReviewDropdown>
                        );
                    })
                ) : (
                    <div>
                        <p>Uh Oh, you have not yet selected any items</p>
                    </div>
                )}
            </div>

            <div className="buttonGroup">
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        setCurrentPage(1);
                    }}
                    style={{
                        padding: "1em 0.5em",
                        width: "50%",
                    }}
                >
                    Go back
                </button>
                <button
                    style={{
                        padding: "1em 0.5em",
                        width: "50%",
                        backgroundColor: "green",
                    }}
                    disabled={isUploadingReviews}
                    onClick={(e) => {
                        e.preventDefault();
                        setIsUploadingReviews(true);
                        addReviewsHandler();
                    }}
                    type="submit"
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
}
