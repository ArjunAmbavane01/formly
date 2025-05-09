"use client"

import { cn } from "@/lib/utils";
import DesignerSidebar from "./DesignerSidebar"
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { ElementsType, FormElementInstance, FormElements } from "./FormElements";
import useDesigner from "./hooks/useDesigner";
import { idGenerator } from "@/lib/idGenerator";
import { useState } from "react";
import { Button } from "./ui/button";
import { BiSolidTrash } from "react-icons/bi";

const Designer = () => {

    const { elements, addElement, selectedElement, setSelectedElement,removeElement } = useDesigner();

    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true,
        }
    })

    useDndMonitor({
        onDragEnd: (event: DragEndEvent) => {
            const { active, over } = event;
            if (!active || !over) return;

            const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
            const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea;
            
            const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea;

            if (droppingSidebarBtnOverDesignerDropArea) {
                console.log('hi')
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator());
                addElement(elements.length, newElement);
                return;
            }

            const isDroppingOverDesignerElementTophalf = over.data?.current?.isTopHalfDesignerElement;
            const isDroppingOverDesignerElementBottomhalf = over.data?.current?.isBottomHalfDesignerElement;

            const isDroppingOverDesignerElement = isDroppingOverDesignerElementTophalf || isDroppingOverDesignerElementBottomhalf;

            const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement;

            if(droppingSidebarBtnOverDesignerElement){
                const type = active.data?.current?.type;
                const newElement = FormElements[type as ElementsType].construct(idGenerator());

                const overId = over.data?.current?.elementId;

                const overElementIndex = elements.findIndex((el)=>el.id===overId);
                if(overElementIndex === -1){
                    throw new Error("Element not found");
                }

                let indexForNewElement = overElementIndex;
                if(isDroppingOverDesignerElementBottomhalf){
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, newElement);
                return;
            }

            const isDraggingDesignerElement = active.data?.current?.isDesignerElement;

            const draggingDesignerElementOverAnotherDesignerElement = isDroppingOverDesignerElement && isDraggingDesignerElement;

            if(draggingDesignerElementOverAnotherDesignerElement){

                const activeId = active.data?.current?.elementId;
                const overId = over.data?.current?.elementId;

                const activeElementIndex = elements.findIndex((el)=>el.id===activeId);

                const overElementIndex = elements.findIndex((el)=>el.id===overId);

                if(activeElementIndex === -1 || overElementIndex === -1){
                    throw new Error("Element not found");
                }

                const activeElement = {...elements[activeElementIndex]};
                removeElement(activeId);

                let indexForNewElement = overElementIndex;
                if(isDroppingOverDesignerElementBottomhalf){
                    indexForNewElement = overElementIndex + 1;
                }

                addElement(indexForNewElement, activeElement);
                return;
            }

        }
    })

    return (
        <div className="flex size-full">
            <div className="p-4 w-full"
                onClick={() => {
                    if (selectedElement) setSelectedElement(null);
                }}
            >
                <div
                    ref={droppable.setNodeRef}
                    className={cn("bg-background max-w-[920px] h-full m-auto rounded-xl flex flex-col grow items-center justify-start flex-1 overflow-y-auto",
                        droppable.isOver && "ring-3 ring-primary ring-inset"
                    )}>
                    {!droppable.isOver && elements.length === 0 && (<p className="text-3xl text-muted-foreground flex grow items-center font-bold">Drop Here</p>)}
                    {droppable.isOver && elements.length === 0 && (<div className="p-4 w-full">
                        <div className="h-[120px] rounded bg-primary/20"></div>
                    </div>)}

                    {elements.length > 0 && (
                        <div className="flex flex-col w-full gap-2 p-4">
                            {elements.map((element) => (
                                <DesignerElementWrapper key={element.id} element={element} />))}
                        </div>
                    )}
                </div>
            </div>
            <DesignerSidebar />
        </div>
    )
}


const DesignerElementWrapper = ({ element }: { element: FormElementInstance }) => {
    const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);
    const { removeElement, selectedElement, setSelectedElement } = useDesigner();

    const topHalf = useDroppable({
        id: element.id + "-top",
        data: {
            type: element.type,
            elementId: element.id,
            isTopHalfDesignerElement: true,
        }
    })

    const bottomHalf = useDroppable({
        id: element.id + "-bottom",
        data: {
            type: element.type,
            elementId: element.id,
            isBottomHalfDesignerElement: true,
        }
    })

    const draggable = useDraggable({
        id: element.id + "drag-handler",
        data: {
            type: element.type,
            elementId: element.id,
            isDesignerElement: true,
        }
    })

    if (draggable.isDragging) return null

    const DesignerElement = FormElements[element.type].designerComponent;

    return (
        <div
            ref={draggable.setNodeRef}
            {...draggable.listeners}
            {...draggable.attributes}
            className="relative h-[120px] flex flex-col text-foreground hover:cursor-pointer rounded ring-1 ring-accent ring-inset"
            onMouseEnter={() => { setMouseIsOver(true) }}
            onMouseLeave={() => { setMouseIsOver(false) }}
            onClick={(e) => {
                e.stopPropagation();
                setSelectedElement(element)
            }}
        >
            <div
                ref={topHalf.setNodeRef}
                className="w-full absolute h-1/2 rounded-t-md" />
            <div
                ref={bottomHalf.setNodeRef}
                className="w-full absolute h-1/2 bottom-0 rounded-b-md" />
            {
                mouseIsOver && (
                    <>
                        <div className="absolute right-0 h-full">
                            <Button
                                variant={"outline"}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    if(selectedElement?.id === element.id) setSelectedElement(null);
                                    removeElement(element.id);
                                }}
                                className="flex justify-center h-full border rounded rounded-l-none !bg-red-500"
                            >
                                <BiSolidTrash className="size-6" />
                            </Button>
                        </div>
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
                            <p className="text-muted-foreground text-sm">Click for properties or drag to move</p>
                        </div>
                    </>
                )
            }
            {
                topHalf.isOver && (
                    <div className="absolute top-0 w-full rounded h-[7px] bg-primary rounded-b-none">

                    </div>
                )
            }
            <div className={cn("flex w-full h-[120px] items-center rounded bg-accent/40 px-4 py-2 pointer-events-none",
                mouseIsOver && "opacity-30"
            )}>
                <DesignerElement elementInstance={element} />
            </div>
            {
                bottomHalf.isOver && (
                    <div className="absolute bottom-0 w-full rounded h-[7px] bg-primary rounded-t-none">

                    </div>
                )
            }
        </div>
    )
}

export default Designer
