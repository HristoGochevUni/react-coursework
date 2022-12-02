import {PlusIcon} from "@heroicons/react/20/solid";

export function PlusButton({text, onClick}){
    return <button onClick={onClick} className=" flex items-center justify-between rounded-md pl-2.5 pr-4 gap-1.5 h-9   hover:bg-gray-600 bg-gray-500">
        <PlusIcon className="h-6 w-6 text-gray-100"/>
        <h3 className="font-normal text-gray-100 text-md">{text}</h3>
    </button>
}