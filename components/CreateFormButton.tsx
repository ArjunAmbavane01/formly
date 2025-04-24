"use client"

import { useForm } from "react-hook-form";
import { formSchema, FormSchemaType } from "@/schemas/form";
import { CreateForm } from "@/actions/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription, } from "./ui/dialog";
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField, } from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { toast } from "sonner"
import { ImSpinner2 } from "react-icons/im";
import { BsFileEarmarkPlus } from "react-icons/bs";
import { useRouter } from "next/navigation";

const CreateFormButton = () => {
    const router = useRouter();
    const form = useForm<FormSchemaType>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: ""
        }
    })

    const onSubmit = async (values: FormSchemaType) => {
        try {
            const formId = await CreateForm(values);
            router.push(`/builder/${formId}`)
            toast.success("Form created successfully");
        } catch (_) {
            toast.error("Something went wrong, please try again later")
        }
    }
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="group border border-primary/20 h-[190px] flex flex-col items-center justify-center hover:border-primary hover:cursor-pointer border-dashed gap-4">
                <BsFileEarmarkPlus className="size-8 text-muted-foreground group-hover:text-primary" />
                <p className="font-bold text-xl text-muted-foreground group-hover:text-primary">Create New Form</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Form</DialogTitle>
                    <DialogDescription>
                        Create a new form to start collecting responses
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Textarea rows={5} {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
                <DialogFooter>
                    <Button
                        onClick={form.handleSubmit(onSubmit)}
                        disabled={form.formState.isSubmitting}
                        className="w-full mt-4"
                    >

                        {!form.formState.isSubmitting && <span>Save</span>}
                        {form.formState.isSubmitting && <ImSpinner2 className="animate-spin" />}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default CreateFormButton
