"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted((c) => !c);
    }, []);

    if (!mounted) return null;
    return (
        <div>ThemeSwitcher</div>
    );
}

export default ThemeSwitcher;