import React from 'react'

interface DropdownProps {
  options: string[]
  selectedValue: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Dropdown = ({ options, selectedValue, onChange }: DropdownProps) => {
  const camelCaseToSentenceCase = (camelCase: string): string => {
    const result = camelCase.replaceAll(/([A-Z])/g, ' $1')
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1)
    return finalResult
  }

  return (
    <select value={selectedValue} onChange={onChange}>
      {options.map(option => (
        <option key={option} value={option}>
          {camelCaseToSentenceCase(option)}
        </option>
      ))}
    </select>
  )
}

export default Dropdown
