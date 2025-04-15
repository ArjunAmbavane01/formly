"use client"

import { useEffect, useState } from "react";
import { Button } from "./ui/button"
import { Input } from "./ui/input";
import { toast } from "sonner";
import { ImShare } from "react-icons/im";

const FormLinkShare = ({ shareURL }: { shareURL: string }) => {

    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    const shareLink = `${window.location.origin}/submit/${shareURL}`;


    return (
        <div className="flex flex-col grow gap-4 items-center">
            <Input value={shareLink} readOnly />
            <Button
                className="max-w-[250px]"
                onClick={() => {
                    navigator.clipboard.writeText(shareLink);
                    toast.success("Copied!");
                }}
            >
                <ImShare className="mr-2 size-4" />
                Share Link
            </Button>
        </div>
    )
}

export default FormLinkShare
