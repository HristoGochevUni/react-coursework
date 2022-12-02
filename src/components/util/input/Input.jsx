export function Input({
                          value, onValueChange = (name, newValue) => {
    }, error, setError, showErrorText = true, name, id, label, type, placeHolder, autocomplete="off"
                      }) {

    const renderErrorMessage = () => {
        if (error && showErrorText) {
            return <p className="text-red-500 text-xs italic mt-3">{error}</p>
        }
    }

    const onChange = (event) => {
        onValueChange(event.target.name, event.target.value)
        setError("")
    }

    return <div className="mb-3">
        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={id}>{label}</label>
        <input
            onChange={onChange} name={name}
            autoComplete={autocomplete}
            className={(error ? 'border-red-500 ' : '') + 'bg-gray-200 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none  focus:shadow-outline'}
            value={value} id={id} type={type} placeholder={placeHolder}/>
        {renderErrorMessage()}
    </div>
}