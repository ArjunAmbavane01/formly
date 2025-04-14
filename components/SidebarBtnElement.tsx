import { useDraggable } from '@dnd-kit/core';
import { FormElement } from './FormElements'
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export const SidebarBtnElement = ({ formElement }: { formElement: FormElement }) => {
    const { icon: Icon, label } = formElement.designerBtnElement;
    const draggable = useDraggable({
        id:`designer-btn-${formElement.type}`,
        data:{
            type:formElement.type,
            isDesignerBtnElement:true
        }
    });
    return (
        <Button 
        ref={draggable.setNodeRef}
        variant={'outline'} 
        className={cn("flex flex-col gap-2 size-[120px] cursor-grab",draggable.isDragging && "ring-2 ring-primary")}
        {...draggable.listeners}
        {...draggable.attributes}
        >
            <Icon className='size-8 text-primary cursor-grab' />
            <p className='text-xs'>{label}</p>
        </Button>
    )
}

export const SidebarBtnElementDragOverlay = ({ formElement }: { formElement: FormElement }) => {
    const { icon: Icon, label } = formElement.designerBtnElement;
    return (
        <Button 
        variant={'outline'} 
        className="flex flex-col gap-2 size-[120px] cursor-grab"
        >
            <Icon className='size-8 text-primary cursor-grab' />
            <p className='text-xs'>{label}</p>
        </Button>
    )
}

