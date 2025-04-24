import { GetFormbyId } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";

const BuilderPage = async ({ params }: { params: { id: string } }) => {
    const { id } = params;
    const form = await GetFormbyId(Number(id));
    if(!form) throw new Error("form not found");
    return <FormBuilder form={form} />
}

export default BuilderPage
