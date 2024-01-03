import React, { useState } from 'react';
import { Dropdown } from 'react-bootstrap';

function ReusableDropdown(props) {
  const { options, selectedValue, onSelect, placeholder, displayKey, singleSelect } = props;
  const [searchValue, setSearchValue] = useState('');

  const handleCheckboxChange = (option) => {
    onSelect((prevSelected) => {
      const isSelected =
        Array.isArray(prevSelected) && prevSelected.some((item) => item[displayKey] === option[displayKey]);

      if (isSelected) {
        return prevSelected.filter((item) => item[displayKey] !== option[displayKey]);
      } else {
        return [...(Array.isArray(prevSelected) ? prevSelected : []), option];
      }
    });
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const filteredOptions = options.filter((option) =>
    option[displayKey].toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleOptionSelect = (option) => {
    onSelect(option);
  };

  return (
    <Dropdown className="w-100 rounded-1">
      <Dropdown.Toggle
        variant="none"
        className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
        id="dropdown-basic"
      >
        <span className="text-truncate pe-3">{selectedValue.replace(/[-_]/g, ' ')}</span>
      </Dropdown.Toggle>

      {(singleSelect && (
        <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
          <div className="px-2 mb-2">
            <input
              type="search"
              placeholder={`Search ${placeholder}`}
              onChange={handleSearchChange}
              className="form-control shadow-none fs_14 slate_gray"
              value={searchValue}
            />
          </div>

          {filteredOptions.map((option, index) => (
            <div
              key={index}
              className={`d-flex align-items-center user-select-none dropdown-item w-100 cursor_pointer ${
                selectedValue === option[displayKey] ? 'active text-white' : 'slate_gray'
              }`}
              onClick={() => handleOptionSelect(option)}
            >
              {option[displayKey]}
            </div>
          ))}
        </Dropdown.Menu>
      )) || (
        <Dropdown.Menu className="w-100 overflow-auto dropdown_height">
          <div className="px-2 mb-2">
            <input
              type="search"
              placeholder={`Search ${placeholder}`}
              onChange={handleSearchChange}
              className="form-control shadow-none fs_14 slate_gray"
              value={searchValue}
            />
          </div>

          {filteredOptions.map((option, index) => (
            <div key={index} className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray">
              <input
                type="checkbox"
                id={option[displayKey]}
                checked={selectedValue.includes(option[displayKey])}
                onChange={() => handleCheckboxChange(option)}
                className="cursor_pointer"
              />
              <label htmlFor={option[displayKey]} className="ms-3 cursor_pointer user-select-none w-100">
                {option[displayKey].replace(/[-_]/g, ' ')}
              </label>
            </div>
          ))}
        </Dropdown.Menu>
      )}
    </Dropdown>
  );
}

export default ReusableDropdown;
