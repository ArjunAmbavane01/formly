import { GetFormContentByURL } from '@/actions/form';
import { FormElementInstance } from '@/components/FormElements';
import React from 'react'

const SubmitPage = async ({ params }: { params: { formURL: string; } }) => {
    const form = await GetFormContentByURL(params.formURL);

    if (!form) throw new Error("Form not found");

    const formContent = JSON.parse(form.content) as FormElementInstance[];

    return (
        <FormSubmitComponent formURL={params.formURL} content={formContent} />
    )
}

export default SubmitPage
