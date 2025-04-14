"use client"

import { MdTextFields } from "react-icons/md";
import { ElementsType, FormElement } from "../FormElements"

const type: ElementsType = "TextField";

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id, type, extraAttributes: {
            label: "Text field",
            helperText: "Helper text",
            required: false,
            placeholder: "Value here...",
        }
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text fields"
    },
    designerComponent: () => <div className="text-white">Designer Component</div>,
    formComponent: () => <div>Form Component</div>,
    propertiesComponent: () => <div>Properties Component</div>,
}