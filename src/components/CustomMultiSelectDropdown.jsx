// MultiSelectDropdown.js

import { Dropdown, Form } from 'react-bootstrap';
import React, { useState } from 'react';

export default function CustomMultiSelectDropdown({
  items,
  selectedItems,
  onItemToggle,
  placeholder,
  searchBy,
  selectedItemsId,
}) {
  const [searchText, setSearchText] = useState('');

  const handleItemClick = (id, category) => {
    onItemToggle(id, category);
  };

  const filteredItems = items?.filter((item) => item?.name?.toLowerCase().includes(searchText.toLowerCase()));

  return (
    <Form.Group className="position-relative">
      <div className="form-select-catgory">
        <Dropdown className="form-control px-0 py-0 border-0">
          <Dropdown.Toggle
            variant="none"
            className="w-100 text-start filter-box-dropdown label-color-2 bg-white py-2 d-flex align-items-center fs-14"
            id="dropdown-basic"
          >
            {(selectedItems?.length === 0 && <span className="fw-400 base-color">{placeholder}</span>) || (
              <span className="tag-list text-truncate">
                {(selectedItems?.length > 2 && (
                  <span className="fw-400 base-color">{selectedItems?.length} items Selected</span>
                )) || (
                  <>
                    {selectedItems?.map((categoryItem, index) => (
                      <span key={index} className="fw-400 btn-selected-tag">
                        {categoryItem}
                      </span>
                    ))}
                  </>
                )}
              </span>
            )}
            <div
              className="filter-box-dropdown-btn-img"
              style={{ backgroundImage: `url(/images/icons/select-down-arrow.svg)`, backgroundSize: 'contain' }}
            ></div>
          </Dropdown.Toggle>
          <Dropdown.Menu className="w-100 card-border banner-filter-menu">
            {searchBy && (
              <div className="px-2 mb-2">
                <input
                  type="search"
                  placeholder="Search..."
                  onChange={(e) => setSearchText(e.target.value)}
                  className="form-control shadow-none card-border fs-14 select-search-box"
                />
              </div>
            )}
            {filteredItems?.length === 0 && <p className="mb-0 fs-14 text-center label-color-1">No result found</p>}
            {filteredItems?.map((item, key) => (
              <Dropdown.Item
                key={key}
                className={`py-2 fs-14 base-color ${selectedItemsId?.includes(item.id) ? 'selected-items' : ''}`}
                onClick={() => handleItemClick(item?.id, item?.name)}
              >
                {item?.name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </Form.Group>
  );
}
