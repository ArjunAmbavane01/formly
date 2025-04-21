"use client"

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import useDesigner from "../hooks/useDesigner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormMessage, FormField, FormItem, FormLabel } from "../ui/form";
import { RxDropdownMenu } from "react-icons/rx";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Separator } from "../ui/separator";
import { toast } from "sonner";

const type: ElementsType = "SelectField";

const extraAttributes = {
    label: "Select field",
    helperText: "Helper text",
    required: false,
    placeholder: "Value here...",
    options: [],
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false).optional(),
    placeholder: z.string().max(50),
    options: z.array(z.string()).default([]).transform(val => val ?? []),
})

export const SelectFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes,
    }),
    designerBtnElement: {
        icon: RxDropdownMenu,
        label: "Select field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomInstance;
        if (element.extraAttributes.required) return currentValue.length > 0;
        return true;
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { label, required, placeholder, helperText } = element.extraAttributes;
    return <div className="text-white">
        <div className="flex flex-col w-full gap-2">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Select>
                <SelectTrigger className="w-full">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
            </Select>
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
            )}
        </div>
    </div>
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }: { elementInstance: FormElementInstance, submitValue?: SubmitFunction, isInvalid?: boolean, defaultValue?: string }) {

    const [value, setValue] = useState(defaultValue || "");
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid]);

    const element = elementInstance as CustomInstance
    const { label, required, placeholder, helperText, options } = element.extraAttributes;

    return <div className="text-white">
        <div className="flex flex-col w-full gap-2">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && " *"}
            </Label>
            <Select
                defaultValue={value}
                onValueChange={value => {
                    setValue(value);
                    if (!submitValue) return;
                    const valid = SelectFieldFormElement.validate(element, value);
                    setError(!valid);
                    submitValue(element.id, value);
                }}>
                <SelectTrigger className={cn("w-full", error && "border-red-500")}>
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option} value={option}>
                            {option}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {helperText && (
                <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>
            )}
        </div>
    </div>
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement, setSelectedElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, helperText, options } = element.extraAttributes;

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onSubmit",
        defaultValues: { label, helperText, required, placeholder, options }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        updateElement(element.id, {
            ...element,
            extraAttributes: { ...values }
        });

        toast.success("Properties saved successfully");
        setSelectedElement(null);
    };


    return <Form {...form}>
        <form onSubmit={form.handleSubmit(applyChanges)} className="space-y-3">
            <FormField
                control={form.control}
                name="label"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Label</FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }} />
                        </FormControl>
                        <FormDescription>
                            The label of the field. <br /> It will be displayed above the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="placeholder"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Placeholder</FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }} />
                        </FormControl>
                        <FormDescription>
                            The placeholder of the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="helperText"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Helper Text</FormLabel>
                        <FormControl>
                            <Input {...field} onKeyDown={(e) => {
                                if (e.key === "Enter") e.currentTarget.blur();
                            }} />
                        </FormControl>
                        <FormDescription>
                            The helper text of the field. <br /> It will be displayed above the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="options"
                render={({ field }) => (
                    <FormItem>
                        <div className="flex justify-between items-center">
                            <FormLabel>Options</FormLabel>
                            <Button
                                variant={"outline"}
                                className="gap-2"
                                onClick={(e) => {
                                    e.preventDefault();
                                    form.setValue("options", field.value.concat("New option"));
                                }}
                            >
                                <AiOutlinePlus />
                                Add Option
                            </Button>
                        </div>
                        <div className="flex flex-col gap-2">
                            {form.watch("options").map((option, index) => (
                                <div key={index} className="flex items-center justify-between gap-1">
                                    <Input placeholder="" value={option} onChange={((e) => {
                                        field.value[index] = e.target.value;
                                        field.onChange(field.value);
                                    })} />
                                    <Button variant={"ghost"} size={"icon"} onClick={e => {
                                        e.preventDefault();
                                        const newOptions = [...field.value]
                                        newOptions.splice(index, 1)
                                        field.onChange(newOptions);
                                    }}>
                                        <AiOutlineClose />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        <FormDescription>
                            The helper text of the field. <br /> It will be displayed above the field
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <Separator />
            <FormField
                control={form.control}
                name="required"
                render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded border p-3 shadow-sm">
                        <div className="space-y-0.5">
                            <FormLabel>Required</FormLabel>
                            <FormDescription>
                                To make the field required
                            </FormDescription>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                            <FormMessage />
                        </div>
                    </FormItem>
                )}
            />
            <Separator />
            <Button className="w-full" type="submit">Save</Button>
        </form>
    </Form>
}