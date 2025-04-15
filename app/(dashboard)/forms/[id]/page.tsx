import { GetFormbyId, GetFormStats } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";

const FormDetailPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    
    const form = await GetFormbyId(Number(id));
    
    if(!form) throw new Error("form not found");

    const {visits,submissions} = await GetFormStats();

    let submissionRate = 0;
    if (visits > 0) {
        submissionRate = (submissions / visits) * 100;
    }
    let bounceRate = 100 - submissionRate;

    return (
        <>
        <div className="py-10 border-b border-muted">
            <div className="flex justify-between container">
                <h1 className="text-4xl font-bold truncate">{form.name}</h1>
                <VisitBtn shareURL={form.shareURL} />
            </div>
            <div className="py-4 border-b border-muted">
                <div className="container flex gap-2 items-center justify-between">
                    <FormLinkShare shareURL={form.shareURL} />
                </div>
            </div>
        </div>
        </>
    )
}

export default FormDetailPage
