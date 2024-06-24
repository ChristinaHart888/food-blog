"use client";
import { Item } from "@/app/types/dbTypes";
import Image from "next/image";
import React, { useState } from "react";
import dropdown from "./dropdown-arrow.png";

interface ItemReviewDropdownParams {
    item: Item;
}

export default function ItemReviewDropdown({ item }: ItemReviewDropdownParams) {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);

    return (
        <div
            style={{
                border: "1px solid white",
                padding: "1em 0.5em",
                display: "flex",
                justifyContent: "space-between",
            }}
        >
            <span>{item.itemName}</span>
            <div className="reviewOutline"></div>
            <div className="dropwdownArrow">
                <Image
                    src={dropdown}
                    width={20}
                    height={20}
                    style={{
                        marginRight: "0.5em",
                    }}
                    alt="V"
                ></Image>
            </div>
        </div>
    );
}
