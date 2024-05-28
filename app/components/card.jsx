"use client";
import React from "react";
import Link from "next/link";
import style from "./card.module.css";
import Image from "next/image";

export default function Card({ title, background, link }) {
    return (
        <Link href={link} className={style.card}>
            <div
                className={style.background}
                style={{
                    backgroundImage: `url(${background})`,
                }}
            >
                <div
                    className=""
                    style={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <span style={{ fontSize: "32px", textAlign: "center" }}>
                        {title}
                    </span>
                </div>
            </div>
        </Link>
    );
}
