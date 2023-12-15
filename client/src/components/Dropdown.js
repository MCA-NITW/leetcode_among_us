import React from "react";

const Dropdown = ({ options, selectedValue, onChange }) => {
  const camelCaseToSentenceCase = (camelCase) => {
    const result = camelCase.replace(/([A-Z])/g, " $1");
    const finalResult = result.charAt(0).toUpperCase() + result.slice(1);
    return finalResult;
  };

  return (
    <select value={selectedValue} onChange={onChange}>
      {options.map((option, index) => (
        <option key={index} value={option}>
          {camelCaseToSentenceCase(option)}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
