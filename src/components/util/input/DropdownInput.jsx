export function DropdownInput({value, onValueChange, error, setError, showErrorMessage = true, id, label, name, options}) {
    const renderErrorMessage = () => {
        if (error && showErrorMessage) {
            return <p className="text-red-500 text-xs italic mt-3">{error}</p>
        }
    }

    const onChange = (event) => {
        onValueChange(name, event.target.value)
        setError("")
    }

    return <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>{label}</label>
        <div className="relative">
            <select
                name={name}
                className={(error ? 'border-red-500 ' : '') + "shadow block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-2 px-3 pr-8 rounded leading-tight focus:outline-none  focus:shadow-outline"}
                id={id} value={value} onChange={onChange}>
                {options.map(option => <option key={option.id} value={option.id}> {option.name}</option>)}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                </svg>
            </div>
        </div>

        {renderErrorMessage()}
    </div>
}