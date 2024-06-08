"use client";
import React from "react";
import Link from "next/link";
import style from "./card.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

interface BaseCardParams {
    title: string;
    background?: string;
}

interface LinkCardParams extends BaseCardParams {
    link: string;
    onClick?: never;
}

interface OnClickCardParams extends BaseCardParams {
    link?: never;
    onClick: () => void;
}

type CardParams = LinkCardParams | OnClickCardParams;

export default function Card({ title, background, link, onClick }: CardParams) {
    const router = useRouter();
    return (
        <div
            className={style.card}
            onClick={
                onClick
                    ? onClick
                    : () => {
                          router.push(link);
                      }
            }
        >
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
        </div>
    );
}
