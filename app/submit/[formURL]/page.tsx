import { GetFormContentByURL } from '@/actions/form';
import { FormElementInstance } from '@/components/FormElements';
import FormSubmitComponent from '@/components/FormSubmitComponent';
import React from 'react';

type Props = {
    params: Promise<{ formURL: string }>
}

const SubmitPage = async ({ params }: Props) => {
    const { formURL } = await params;
    const form = await GetFormContentByURL(formURL);

    if (!form) throw new Error("Form not found");

    const formContent = JSON.parse(form.content) as FormElementInstance[];

    return (
        <FormSubmitComponent formURL={formURL} content={formContent} />
    )
}

export default SubmitPage
