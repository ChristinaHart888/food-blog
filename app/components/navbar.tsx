"use client";
import Link from "next/link";
import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
    const { user, logout } = useAuth() || {};

    return (
        <nav
            style={{
                backgroundColor: "#6203c1",
                minHeight: "56px",
                padding: "0.5em 1em",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <Link style={{ fontSize: "32px" }} href={"/"}>
                Food
            </Link>
            {user && user.userId != null ? (
                <div
                    onClick={logout}
                    style={{
                        textAlign: "center",
                        justifyContent: "center",
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}
                >
                    Log Out
                </div>
            ) : (
                <Link
                    href={"/login"}
                    style={{
                        textAlign: "center",
                        justifyContent: "center",
                        marginTop: "auto",
                        marginBottom: "auto",
                    }}
                >
                    Log In
                </Link>
            )}
        </nav>
    );
}
