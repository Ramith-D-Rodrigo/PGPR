import React from 'react'

//here the props

//label - label of the form field
//name - name of the form field
//type - type of the form field (text, number, email, password, textarea, select, checkbox, radio)
//isReadonly - whether the form field is readonly or not
//options - options for select, checkbox and radio form fields (array of objects with label,value, name attributes <- follow these interface for the options array)
//onChange - onChange event handler for the form field

const FormField = ({label, name, type, isReadonly, options, onChange, value,required}) => {
  return (
    <div style={{width:"45%",margin:"0.5rem 0"}} className="mb-4 flex items-center">
        <label htmlFor={name} className="block w-48 font-medium text-gray-700">
            {label}
        </label>
        {/*here the form field*/}
        {(type === 'textarea') ? (
            <textarea required={required} id={name} name={name} className="form-input w-full flex-grow h-30 resize-none bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1" readOnly={isReadonly} onChange={onChange}/>
        )
        : (
            <div className="relative flex-grow">
                {(type === 'select') ? (
                    <select required={required} id={name} name={name} className="form-select block w-full h-10 bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1 pr-8" readOnly={isReadonly} onChange={onChange}>    
                        {options.map((option) => (
                            <option key={name + option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                )
                : (type === 'checkbox' || type === 'radio') ? (
                    options.map((option) => (
                        <div className="flex items-center mb-4" key={name + option.name}>
                            {(type === 'radio') ? (
                                <>
                                    <input required={required} id={option.name + name} type="radio" value={option.value} name={name} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" readOnly={isReadonly} onChange={onChange}/>
                                    <label htmlFor={option.name + name} className="ml-2 text-sm font-medium text-gray-900">{option.label}</label>
                                </>
                            )
                            : (
                                <>
                                    <input required={required} id="default-checkbox" type="checkbox" value={option.value} className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" readOnly={isReadonly} onChange={onChange}/>
                                    <label htmlFor="default-checkbox" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">{option.label}</label>
                                </>
                            )}
                        </div>
                    ))
                ) :(
                    
                    <input required={required} id={name} name={name} type={type} className="form-input w-full bg-white border border-black rounded-lg hover:border-black focus:outline-none px-2 py-1" readOnly={isReadonly} onChange={onChange} value={value}/>

                )}
            </div>
        )}
    </div>
  )
}

export default FormField