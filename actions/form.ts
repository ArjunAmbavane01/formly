"use server"

import { currentUser } from "@clerk/nextjs/server"

export const GetFormStats = async()=> {
    const user = currentUser();
    if(!user) throw new UserNotFoundErr()
}