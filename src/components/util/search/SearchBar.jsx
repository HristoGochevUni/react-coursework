import {MagnifyingGlassIcon} from '@heroicons/react/20/solid'

export function SearchBar({onSearch, value}) {
    return <div className="w-64 rounded-md bg-gray-600 h-9 flex items-center gap-3 px-3">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true"/>
        <input onChange={onSearch} value={value}
               className="max-w-fit bg-transparent border-0 outline-none font-normal caret-gray-200 text-gray-200 text-md"
               placeholder="Search"/>
    </div>
}