import React from "react";
import Form from "./form";

export default function Page() {
    return (
        <div>
            <h1>New Tag</h1>
            <div
                style={{
                    margin: "1em",
                }}
            >
                <Form></Form>
            </div>
        </div>
    );
}
