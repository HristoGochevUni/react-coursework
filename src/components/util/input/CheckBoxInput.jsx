export function CheckBoxInput({label, name, checked, onCheckedChange}) {
    const onChange = (event) => {
        onCheckedChange(event.target.name, event.target.checked)
    }

    return <div className="flex items-center mb-3">
        <input className="mr-2 leading-tight" name={name} checked={checked} type="checkbox" onChange={onChange}/>
        <span className="text-sm font-bold text-gray-700 ">{label}</span>
    </div>
}