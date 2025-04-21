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
import { LuHeading1, LuSeparatorHorizontal } from "react-icons/lu";
import { Slider } from "../ui/slider";

const type: ElementsType = "SpacerField";

const extraAttributes = {
    height: 20,
}

const propertiesSchema = z.object({
    height: z.number().min(2).max(200),
})

export const SpacerFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes,
    }),
    designerBtnElement: {
        icon: LuSeparatorHorizontal,
        label: "Spacer Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
    validate: () => true,
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes;
}

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function DesignerComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const element = elementInstance as CustomInstance
    const { height } = element.extraAttributes;
    return <div className="text-white">
        <div className="flex flex-col items-center w-full gap-2">
            <Label className="text-muted-foreground">Spacer Field: {height}px</Label>
            <LuSeparatorHorizontal className="size-8" />
        </div>
    </div>
}

function FormComponent({ elementInstance }: { elementInstance: FormElementInstance }) {

    const element = elementInstance as CustomInstance
    const { height } = element.extraAttributes;

    return (
        <div style={{ height, width: "100%" }}></div>
    )
}

function PropertiesComponent({ elementInstance }: { elementInstance: FormElementInstance }) {
    const { updateElement } = useDesigner();
    const element = elementInstance as CustomInstance;

    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: { height: element.extraAttributes.height }
    });

    useEffect(() => {
        form.reset(element.extraAttributes);
    }, [element, form]);

    const applyChanges = (values: propertiesFormSchemaType) => {
        const { height } = values;
        updateElement(element.id, {
            ...element,
            extraAttributes: { height }
        })
    };


    return <Form {...form}>
        <form onBlur={form.handleSubmit(applyChanges)} onSubmit={(e) => {
            e.preventDefault();
        }} className="space-y-3">
            <FormField
                control={form.control}
                name="height"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                        <FormControl>
                            <Slider
                                defaultValue={[field.value]}
                                min={5}
                                max={200}
                                step={1}
                                onValueChange={(val) => {
                                    field.onChange(val[0]);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </form>
    </Form>
}