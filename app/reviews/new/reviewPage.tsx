import { Item } from "@/app/types/dbTypes";
import React from "react";
import ItemReviewDropdown from "./itemReviewDropdown";

interface ReviewPageParams {
    selectedItems: Item[];
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ReviewPage({
    selectedItems,
    setCurrentPage,
}: ReviewPageParams) {
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
                >
                    Submit Review
                </button>
            </div>
        </div>
    );
}
