"use client"

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";
import { Computer, LaptopMinimal, Moon, Sun } from "lucide-react";

const ThemeSwitcher = () => {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted((c) => !c);
    }, []);

    if (!mounted) return null;
    return (
        <Tabs>
            <TabsList className="border rounded-md">
                <TabsTrigger value="light" className="cursor-pointer" onClick={()=>setTheme("light")}>
                    <Sun className="size-5"/>
                </TabsTrigger>
                <TabsTrigger value="dark" className="cursor-pointer" onClick={()=>setTheme("dark")}>
                    <Moon className="size-5"/>
                </TabsTrigger>
                <TabsTrigger value="system" className="cursor-pointer" onClick={()=>setTheme("system")}>
                    <LaptopMinimal className="size-5"/>
                </TabsTrigger>
            </TabsList>
        </Tabs>
    );
}

export default ThemeSwitcher;