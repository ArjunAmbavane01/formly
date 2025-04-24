import { GetFormbyId } from "@/actions/form";
import FormBuilder from "@/components/FormBuilder";
 
type Props = {
  params: Promise<{ id: string }>
}
const BuilderPage = async ({ params }: Props) => {
  const { id } = await params;
  const form = await GetFormbyId(Number(id));
  if (!form) throw new Error("form not found");
  return <FormBuilder form={form} />;
};

export default BuilderPage;
