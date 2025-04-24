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
import { Switch } from "../ui/switch";
import { IoMdCheckbox } from "react-icons/io"
import { cn } from "@/lib/utils";
import { Checkbox } from "../ui/checkbox";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
    label: "Checkbox field",
    helperText: "Helper text",
    required: false,
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false).optional(),
})

export const CheckboxFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes,
    }),
    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Checkbox field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
        const element = formElement as CustomInstance;
        if (element.extraAttributes.required) return currentValue === "true";
        return true;
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { label, required, helperText } = element.extraAttributes;
    const id = `checkbox-${element.id}`
    return (
        <div className="flex items-start space-x-2">
            <Checkbox id={id} />
            <div className="flex flex-col w-full gap-2">
                <Label htmlFor={id}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
                )}
            </div>
        </div>
    )
}

function FormComponent({ elementInstance, submitValue, isInvalid, defaultValue }: { elementInstance: FormElementInstance, submitValue?: SubmitFunction, isInvalid?: boolean, defaultValue?: string }) {

    const [value, setValue] = useState<boolean>(defaultValue === "true" ? true : false);
    const [error, setError] = useState(false);

    useEffect(() => {
        setError(isInvalid === true)
    }, [isInvalid]);

    const element = elementInstance as CustomInstance
    const { label, required, helperText } = element.extraAttributes;
    const id = `checkbox-${element.id}`

    return (
        <div className="flex items-start space-x-2">
            <Checkbox
                id={id}
                checked={value}
                className={cn(error && "border-red-500")}
                onCheckedChange={(checked) => {
                    let value = false;
                    if (checked === true) value = true;
                    setValue(value);
                    if (!submitValue) return;
                    const stringValue = value ? "true" : "false";
                    const valid = CheckboxFieldFormElement.validate(element, stringValue);
                    setError(!valid);
                    submitValue(element.id, stringValue);
                }}
            />
            <div className="flex flex-col w-full gap-2">
                <Label htmlFor={id} className={cn(error && "border-red-500")}>
                    {label}
                    {required && "*"}
                </Label>
                {helperText && (
                    <p className={cn("text-muted-foreground text-[0.8rem]", error && "text-red-500")}>{helperText}</p>
                )}
            </div>
        </div>
    )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;
    const { label, required, helperText } = element.extraAttributes;

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: { label, helperText, required }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
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