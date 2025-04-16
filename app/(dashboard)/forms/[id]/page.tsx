import { GetFormbyId, GetFormStats } from "@/actions/form";
import FormLinkShare from "@/components/FormLinkShare";
import VisitBtn from "@/components/VisitBtn";
import { StatsCard } from "../../page";
import { LuView } from "react-icons/lu";
import { FaWpforms } from "react-icons/fa";
import { HiCursorClick } from "react-icons/hi";
import { TbArrowBounce } from "react-icons/tb";

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
         <div className="w-full pt-8 gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 container">
              <StatsCard
                title="Total Visits"
                icon={<LuView className="text-blue-600" />}
                helperText="All time form visits"
                value={visits.toLocaleString() || ""}
                loading={false}
                className="shadow-md shadow-blue-600"
              />
              <StatsCard
                title="Total Submissions"
                icon={<FaWpforms className="text-yellow-600" />}
                helperText="All time form submissions"
                value={submissions.toLocaleString() || ""}
                loading={false}
                className="shadow-md shadow-yellow-600"
              />
              <StatsCard
                title="Submission Rate"
                icon={<HiCursorClick className="text-green-600" />}
                helperText="visits that result in form submissions"
                value={submissionRate.toLocaleString() + "%" || ""}
                loading={false}
                className="shadow-md shadow-green-600"
              />
              <StatsCard
                title="Bounce Rate"
                icon={<TbArrowBounce className="text-red-600" />}
                helperText="visits that leaves without interacting"
                value={bounceRate.toLocaleString() + "%" || ""}
                loading={false}
                className="shadow-md shadow-red-600"
              />
            </div>
            <div className="container pt-10">
                <SubmissionTable id={form.id} />

            </div>
        </>
    )
}

export default FormDetailPage

const SubmissionTable = ({id}:{id:number}) => {
    return (
        <>
        <h1 className="text-2xl font-bold my-4">Form Submissions</h1>
        </>
    )
}