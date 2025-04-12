import { UserButton } from "@clerk/nextjs";
import { ReactNode } from "react";

const Layout = ({children}:{children:ReactNode}) => {
    return  <div className="flex flex-col min-h-screen min-w-full bg-background max-h-screen">
        <nav>
            <Logo />
            <ThemeSwitcher />
            <UserButton  /> 
        </nav>
        <main className="flex w-full flex-grow">
        {children}
        </main>
        </div> ;
}
 
export default Layout;