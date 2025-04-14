"use client"

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import useDesigner from "../hooks/useDesigner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Form, FormControl, FormDescription, FormMessage, FormField, FormItem, FormLabel } from "../ui/form";
import { MdTextFields } from "react-icons/md";
import { Switch } from "../ui/switch";

const type: ElementsType = "TextField";

const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    required: false,
    placeholder: "Value here...",
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(50),
    helperText: z.string().max(200),
    required: z.boolean().default(false).optional(),
    placeholder: z.string().max(50),
})

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes,
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text fields"
    },
    designerComponent: DesignerComponent,
    formComponent: () => <div>Form Component</div>,
    propertiesComponent: PropertiesComponent,
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
            <Input readOnly disabled placeholder={placeholder} />
            {helperText && (
                <p className="text-muted-foreground text-[0.8rem]">{helperText}</p>
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