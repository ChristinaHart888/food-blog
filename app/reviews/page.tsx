import React from "react";
import ReviewList from "./reviewList";

export default function Reviews() {
    return (
        <div>
            <h1>Reviews</h1>
            <div className="content">
                <ReviewList></ReviewList>
            </div>
        </div>
    );
}
