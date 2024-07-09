"use client";
import React, { useEffect, useState } from "react";
import { Tag } from "../types/dbTypes";
import useDB from "../hooks/useDB";

export default function Content() {
    const [tags, setTags] = useState<Tag[]>([]);
    const { getTags } = useDB();

    useEffect(() => {
        const init = async () => {
            const res = await getTags();
            if (res.status === 200 && typeof res.body !== "string") {
                setTags(res.body);
            }
        };
        init();
    }, []);
    return (
        <div>
            {tags.map((tag) => (
                <div>{tag.tagName}</div>
            ))}
        </div>
    );
}
