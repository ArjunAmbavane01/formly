import { IconType } from "react-icons/lib";
import { TextFieldFormElement } from "./fields/TextField";
import { TitleFieldFormElement } from "./fields/TitleField";
import { SubTitleFieldFormElement } from "./fields/SubTitleField";
import { ParagraphFormElement } from "./fields/ParagraphField";
import { SeparatorFieldFormElement } from "./fields/SeparatorField";
import { SpacerFieldFormElement } from "./fields/SpacerField";

export type ElementsType = "TextField" | "TitleField" | "SubTitleField" | "ParagraphField" | "SeparatorField" | "SpacerField";

export type SubmitFunction = (key: string, value: string) => void;

export type FormElement = {
    type: ElementsType;

    construct: (id: string) => FormElementInstance;

    designerBtnElement: {
        icon: IconType;
        label: string;
    };

    designerComponent: React.FC<{ elementInstance: FormElementInstance }>;

    formComponent: React.FC<{
        elementInstance: FormElementInstance,
        submitValue?: SubmitFunction,
        isInvalid?: boolean;
        defaultValue?: string;
    }>;

    propertiesComponent: React.FC<{ elementInstance: FormElementInstance }>;

    validate: (formElement: FormElementInstance, currentValue: string) => boolean;
};

export type FormElementInstance = {
    id: string;
    type: ElementsType;
    extraAttributes?: Record<string, any>;
}

type FormElementsType = {
    [key in ElementsType]: FormElement
}

export const FormElements: FormElementsType = {
    TextField: TextFieldFormElement,
    TitleField: TitleFieldFormElement,
    SubTitleField: SubTitleFieldFormElement,
    ParagraphField: ParagraphFormElement,
    SeparatorField: SeparatorFieldFormElement,
    SpacerField: SpacerFieldFormElement,
};
