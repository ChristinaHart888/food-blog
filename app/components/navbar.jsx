import Link from "next/link";
import React from "react";

export default function Navbar() {
    return (
        <nav
            style={{
                backgroundColor: "#6203c1",
                minHeight: "56px",
                padding: "0.5em 1em",
            }}
        >
            <Link style={{ fontSize: "32px" }} href={"/"}>
                Food
            </Link>
        </nav>
    );
}
