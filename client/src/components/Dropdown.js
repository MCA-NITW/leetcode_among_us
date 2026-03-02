import React from 'react'
import PropTypes from 'prop-types'

const Dropdown = ({ options, selectedValue, onChange }) => {
  const camelCaseToSentenceCase = camelCase => {
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

Dropdown.propTypes = {
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedValue: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Dropdown
