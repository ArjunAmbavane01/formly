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
import { MdTextFields } from "react-icons/md";
import { Switch } from "../ui/switch";
import { cn } from "@/lib/utils";
import { Bs123 } from "react-icons/bs";

const type: ElementsType = "TextField";

const extraAttributes = {
    label: "Number field",
    helperText: "Helper text",
    required: false,
    placeholder: "0",
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false).optional(),
    placeholder: z.string().max(50),
})

export const NumberFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes,
    }),
    designerBtnElement: {
        icon: Bs123,
        label: "Number Field"
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
            <Input readOnly disabled type="number" placeholder={placeholder} />
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
    const { label, required, placeholder, helperText } = element.extraAttributes;

    return <div className="text-white">
        <div className="flex flex-col w-full gap-2">
            <Label className={cn(error && "text-red-500")}>
                {label}
                {required && " *"}
            </Label>
            <Input
                type="number"
                className={cn(error && "border-red-500")}
                placeholder={placeholder}
                onChange={(e) => setValue(e.target.value)}
                onBlur={(e) => {
                    if (!submitValue) return;
                    const valid = NumberFieldFormElement.validate(element, e.target.value);
                    setError(!valid);
                    if (!valid) return;
                    submitValue(element.id, e.target.value);
                }}
                value={value}
            />
            {helperText && (
                <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>
            )}
        </div>
    </div>
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const { label, required, placeholder, helperText } = element.extraAttributes;

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: { label, helperText, required, placeholder }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        const { label, required, placeholder, helperText } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: { ...values }
        })
    };


    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => {
            e.preventDefault();
        }} className="space-y-3">
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

        </form>
    </Form>
}