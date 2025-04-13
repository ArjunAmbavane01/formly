"use server"

import { currentUser } from "@clerk/nextjs/server"
import prismaClient from "@/lib/prisma";
import { formSchema, FormSchemaType } from "@/schemas/form";

class UserNotFoundErr extends Error { };

export const GetFormStats = async () => {
    const user = await currentUser();
    if (!user) throw new UserNotFoundErr();

    const stats = await prismaClient.form.aggregate({
        where: {
            userId: user.id,
        },
        _sum: {
            visits: true,
            submissions: true,
        }
    })

    const visits = stats._sum.visits || 0;
    const submissions = stats._sum.submissions || 0;

    let submissionRate = 0;
    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }
    let bounceRate = 100 - submissionRate;
    return { visits, submissions, submissionRate, bounceRate }
}

export const CreateForm = async (data: FormSchemaType) => {
    const validation = formSchema.safeParse(data);
    if (!validation.success) {
        throw new Error("Form fields not valid")
    }
    const user = await currentUser();
    if (!user) throw new UserNotFoundErr();
    const { name, description } = data;
    const form = await prismaClient.form.create({
        data: {
            userId: user.id,
            name,
            description,
        }
    })
    if (!form) {
        throw new Error("something went wrong")
    }
    return form.id;
}