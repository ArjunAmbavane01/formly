"use client"

import { cn } from "@/lib/utils";
import DesignerSidebar from "./DesignerSidebar"
import { DragEndEvent, useDndMonitor, useDroppable } from "@dnd-kit/core";
import { ElementsType, FormElementInstance, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";

const Designer = () => {

    const { elements, addElement } = useDesigner();

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDroppable: true
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event;
            if (!active || !over) return;
            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;

            if (isDesignerBtnElement) {
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator());
                addElement(0, newElement);
            }
            console.log('drag end');
        }
    })

    return (
        <div className="flex size-full">
            <div className="p-4 w-full">
                <div
                    ref={droppable.setNodeRef}
                    className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col grow items-center justify-start flex-1 overflow-y-auto",
                        droppable.isOver && "ring-2 ring-primary/20"
                    )}>
                    {!droppable.isOver && elements.length === 0 && (<p className="text-3xl text-muted-foreground flex grow items-center font-bold">Drop Here</p>)}
                    {droppable.isOver && (<div className="p-4 w-full">
                        <div className="h-[120px] rounded bg-primary/20"></div>
                    </div>)}

                    {elements.length > 0 && elements.map((element) => (
                        <DesignerElementWrapper key={element.id} element={element} />
                    ))}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    )
}


const DesignerElementWrapper = ({ element }: { element: FormElementInstance }) => {
    const DesignerElement = FormElements[element.type].designerComponent;

    return <DesignerElement />;
}

export default Designer
