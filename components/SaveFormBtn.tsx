import { UpdateFormContent } from '@/actions/form';
import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import { HiSaveAs } from "react-icons/hi"
import { toast } from 'sonner';
import { useTransition } from 'react';
import { FaSpinner } from 'react-icons/fa';

const SaveFormBtn = ({id}:{id:number}) => {
    const { elements } = useDesigner();
    const [loading,startTransition] = useTransition();

    const updateFormContent = async () => {
        try {
            const jsonElements = JSON.stringify(elements);
            await UpdateFormContent(id, jsonElements);
            toast.success("Your form has been saved");
        } catch (err) { 
            toast.error("Something went wrong");
        }
    }

    return (
        <Button variant={"outline"} className="gap-2" disabled={loading} onClick={()=>{
            startTransition(updateFormContent);
        }}>
            <HiSaveAs className="size-6" />
            Save
            {loading && <FaSpinner className="animate-spin size-4" />}
        </Button>
    )
}

export default SaveFormBtn
