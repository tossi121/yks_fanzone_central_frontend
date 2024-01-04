import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Dropdown } from 'react-bootstrap';

function ReusableDropdown(props) {
  const {
    options,
    selectedValue,
    selectedValueData,
    onSelect,
    placeholder,
    displayKey,
    singleSelect,
    tagSelect,
    setShow,
  } = props;
  const [searchValue, setSearchValue] = useState();
  const [selected, setSelected] = useState([]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
  };

  const filteredOptions = options.filter((option) => {
    const optionKey = option[displayKey];
    const searchTerm = searchValue ? searchValue.toLowerCase() : '';

    return optionKey && optionKey.toLowerCase().includes(searchTerm);
  });

  const handleOptionSelect = (option) => {
    onSelect(option);
  };

  const handleCheckboxChange = (id) => {
    onSelect((prevSelected) => {

      const isSelected = Array.isArray(prevSelected) && prevSelected.some((item) => item.id === id);

      if (isSelected) {
        return prevSelected.filter((item) => item.id !== id);
      } else {
        const selectedOption = options.find((option) => option.id === id);
        return [...(Array.isArray(prevSelected) ? prevSelected : []), selectedOption];
      }
    });
  };

  useEffect(() => {
    if (Array.isArray(selectedValueData)) {
      const value = selectedValueData.map((i) => i[displayKey]).join(',');
      setSelected(value);
    } else {
      console.error('selectedValueData is not an array.');
    }
  }, [selectedValueData]);

  const displayText = selected.length === 0 ? `Select ${placeholder}` : selectedValue || selected;

  return (
    <Dropdown className="w-100 rounded-1">
      <Dropdown.Toggle
        variant="none"
        className="fs_14 slate_gray w-100 d-flex justify-content-between align-items-center form-control shadow-none border"
        id="dropdown-basic"
      >
        <span className="text-truncate pe-3">{selectedValue || displayText}</span>
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
          <div className={`px-2 mb-2 ${tagSelect && 'd-flex gap-2 align-items-center'}`}>
            <div className="w-100">
              <input
                type="search"
                placeholder={`Search ${placeholder}`}
                onChange={handleSearchChange}
                className="form-control shadow-none fs_14 slate_gray"
                value={searchValue}
              />
            </div>
            {tagSelect && (
              <div
                className="common_btn text-white h-100 p-1 px-2 rounded-2 cursor_pointer text-nowrap"
                onClick={() => setShow(true)}
              >
                <FontAwesomeIcon icon={faPlusCircle} width={16} height={16} />
              </div>
            )}
          </div>
          {filteredOptions.map((option, index) => (
            <div
              key={option[displayKey]}
              className="d-flex align-items-center user-select-none dropdown-item w-100 slate_gray"
            >
              <input
                type="checkbox"
                id={option[displayKey]}
                onChange={() => handleCheckboxChange(option.id)}
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
