import useDesigner from './hooks/useDesigner'
import { Button } from './ui/button'
import { MdPreview } from "react-icons/md"
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import { FormElements } from './FormElements';

const PreviewDialogBtn = () => {
    const { elements } = useDesigner();

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={"outline"} className="gap-2">
                    <MdPreview className="size-6" />
                    Preview
                </Button>
            </DialogTrigger>
            <DialogContent className='h-screen w-screen flex flex-col grow p-0 gap-0'>
                <DialogTitle />
                <div className='px-4 py-2 border-b'>
                    <p className='text-lg font-bold text-muted-foreground'>
                        Form Preview
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        This is how your form will look to your users.
                    </p>
                </div>
                <div className='bg-accent flex flex-col grow items-center justify-center p-4 overflow-y-auto rounded'>
                <div className='max-w-[620px] flex flex-col grow bg-background size-full p-8 overflow-y-auto rounded space-y-3'>
                    {elements.map((el)=>{
                        const FormComponent = FormElements[el.type].formComponent;
                        return <FormComponent key={el.id} elementInstance={el} />
                    })}
                </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default PreviewDialogBtn
