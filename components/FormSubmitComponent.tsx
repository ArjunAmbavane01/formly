"use client"

import { useCallback, useRef, useState } from 'react'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button'
import { toast } from 'sonner'

const FormSubmitComponent = ({ formURL, content }: { formURL: string, content: FormElementInstance[] }) => {

    const formValues = useRef<{ [Key: string]: string }>({});
    const formErrors = useRef<{ [Key: string]: boolean }>({});
    const [renderKey,setRenderKey] = useState(new Date().getTime());

    const validateForm = useCallback((): boolean => {
        for (const field of content) {
            const acutalValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, acutalValue);

            if (!valid) formErrors.current[field.id] = true;
        }

        if (Object.keys(formErrors.current).length > 0) return false;
        return true;
    }, [content]);

    const submitValue = useCallback((key: string, value: string) => {
        formValues.current[key] = value;
    }, []);

    const submitForm = () => {
        formErrors.current = {};
        const validForm = validateForm();
        if(!validForm) {
            setRenderKey(new Date().getTime());
            toast.error("Please check the form for errors");
            return;
        }
        console.log(formValues.current);
    }

    return (
        <div className='flex justify-center size-full items-center p-8'>
            <div key={renderKey} className='max-w-[620px] flex flex-col gap-4 grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
                {content.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return <FormElement
                        key={element.id}
                        elementInstance={element}
                        submitValue={submitValue}
                        isInvalid={formErrors.current[element.id]}
                    />
                })}
                <Button className='mt-8' onClick={() => { submitForm(); }}>
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent
