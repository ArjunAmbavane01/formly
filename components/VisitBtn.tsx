"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button"

const VisitBtn = ({ shareURL }: { shareURL: string }) => {

    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const shareLink = `${window.location.origin}/submit/${shareURL}`;


    return (
        <Button
            className="w-[200px]"
            onClick={() => {
                window.open(shareLink, "_blank");
            }}
        >
            Visit
        </Button>
    )
}

export default VisitBtn
