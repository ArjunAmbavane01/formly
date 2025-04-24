"use client"

import { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from './FormElements'
import { Button } from './ui/button'
import { toast } from 'sonner'
import { HiCursorClick } from 'react-icons/hi'
import { ImSpinner } from 'react-icons/im'
import { SubmitForm } from '@/actions/form'

const FormSubmitComponent = ({ formURL, content }: { formURL: string, content: FormElementInstance[] }) => {

    const [renderKey, setRenderKey] = useState(new Date().getTime());
    const [submitted, setSubmitted] = useState(false);

    const formValues = useRef<{ [Key: string]: string }>({});
    const formErrors = useRef<{ [Key: string]: boolean }>({});

    const [pending, startTransition] = useTransition();

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

    const submitForm = async () => {
        formErrors.current = {};
        const validForm = validateForm();
        if (!validForm) {
            setRenderKey(new Date().getTime());
            toast.error("Please check the form for errors");
            return;
        }

        try {
            const jsonContent = JSON.stringify(formValues.current);
            await SubmitForm(formURL, jsonContent);
            setSubmitted(true);
            toast.error("Form submitted successfully");
        } catch (_) {
            toast.error("Something went wrong");
        }
    }

    if (submitted) {
        return (
            <div className='flex justify-center size-full items-center p-8'>
                <div className='max-w-[620px] flex flex-col gap-4 grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
                    <h1 className='text-2xl font-bold'>Form Submitted</h1>
                    <p className='text-muted-foreground'>
                        Thankyou for submitting this form, you can close this page now.
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className='flex justify-center size-full items-center p-8'>
            <div key={renderKey} className='max-w-[620px] flex flex-col gap-4 grow bg-background w-full p-8 overflow-y-auto border shadow-xl shadow-blue-700 rounded'>
                {content.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return <FormElement
                        key={element.id}
                        elementInstance={element}
                        defaultValue={formValues.current[element.id]}
                        submitValue={submitValue}
                        isInvalid={formErrors.current[element.id]}
                    />
                })}
                <Button
                    className='mt-8'
                    disabled={pending}
                    onClick={() => { startTransition(submitForm) }}>
                    {!pending && (
                        <>
                            <HiCursorClick className='mr-2' />
                            Submit
                        </>
                    )}
                    {pending && <ImSpinner className='animate-spin' />}
                </Button>
            </div>
        </div>
    )
}

export default FormSubmitComponent
