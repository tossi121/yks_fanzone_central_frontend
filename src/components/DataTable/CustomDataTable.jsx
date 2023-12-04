import { faLongArrowAltDown, faLongArrowAltUp, faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment from 'moment';
import { Form, Table } from 'react-bootstrap';

const CustomPagination = dynamic(import('./CustomPagination'));

const defaultProps = {
  lengthChange: true,
  info: true,
  lengthMenu: [-1, 10, 20, 50, 100],
  search: true,
  columns: {},
  pagination: true,
  sorting: true,
};
function CustomDataTable(props) {
  const { rows, columns, options } = props;
  const [cols, setCols] = useState(null);
  const [currentData, setCurrentData] = useState([]);
  const [currentPageSize, setCurrentPageSize] = useState(10);
  const [numData, setNumData] = useState(null);
  const [numFirst, setNumFirst] = useState(null);
  const [filterData, setFilterData] = useState([]);
  const [tempFilterData, setTempFilterData] = useState([]);
  const [ascending, setAscending] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [sortingBy, setSortingBy] = useState('');
  const [sortType, setSortType] = useState('');
  const [entity, setEntities] = useState(Object.assign({}, defaultProps, options));

  const cellClasses = {
    left: 'text-start',
    center: 'text-center',
    right: 'text-end',
  };

  useEffect(() => {
    if (entity) {
      const { hideColumns } = entity;
      if (hideColumns?.length > 0) {
        if (columns?.length > 0) {
          const tempCols = columns.filter((item) => {
            return hideColumns.indexOf(item.field) === -1;
          });
          setCols(tempCols);
        }
      } else {
        setCols(columns);
      }
      if (entity.defaultSortBy) {
        setSortingBy(entity.defaultSortBy);
        handleSorting(entity.defaultSortBy);
      }
    } else {
      setCols(columns);
      setSortingBy(columns[0]['field']);
      handleSorting(columns[0]['field']);
    }
  }, [entity]);

  useEffect(() => {
    if (searchInput !== '') {
      const filtered = rows?.filter((item) => {
        return Object.keys(item).some((key) => {
          const value = item[key];
          if (typeof value === 'number') {
            const formattedValue = value?.toFixed(2);
            return formattedValue.toString().toLowerCase().includes(searchInput?.replaceAll(',', '').toLowerCase());
          }
          return value?.toString().toLowerCase().includes(searchInput?.replaceAll(',', '').toLowerCase());
        });
      });
      setFilterData(filtered);
      setTempFilterData(filtered);
    } else {
      setFilterData(rows);
      setTempFilterData(rows);
    }

    if (!entity.pagination) {
      setCurrentData(rows);
    }
  }, [searchInput, rows]);

  function getVariableWithType(a, b) {
    let keyA = a;
    let keyB = b;
    if (!isNaN(parseFloat(a))) {
      keyA = eval(parseFloat(a));
      keyB = eval(parseFloat(b));
    } else if (moment(a).isValid()) {
      keyA = moment(a);
      keyB = moment(b);
    }
    return { keyA, keyB };
  }

  function handleSorting(keyName) {
    const sorted = [...filterData];
    if (sortingBy != '' && keyName != sortingBy) {
      setSortType('asc');
      sorted.sort(function (a, b) {
        const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
        if (keyA < keyB) {
          return -1;
        }
        if (keyA > keyB) {
          return 1;
        }
        return 0;
      });
      setFilterData([...sorted]);
      setAscending(false);
      setSortingBy(keyName);
    } else if (sortType == 'desc') {
      setFilterData([...tempFilterData]);
      setSortType('');
      setSortingBy('');
    } else {
      setSortType((ascending && 'asc') || 'desc');
      if (ascending) {
        sorted.sort(function (a, b) {
          const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
          if (keyA < keyB) {
            return -1;
          }
          if (keyA > keyB) {
            return 1;
          }
          return 0;
        });
        setFilterData([...sorted]);
      } else {
        sorted.sort(function (a, b) {
          const { keyA, keyB } = getVariableWithType(a[keyName], b[keyName]);
          if (keyA > keyB) {
            return -1;
          }
          if (keyA < keyB) {
            return 1;
          }
          return 0;
        });
        setFilterData([...sorted]);
      }
      setAscending(!ascending);
      setSortingBy(keyName);
    }
  }
  function renderTableColumns() {
    return (
      <thead>
        <tr>
          {cols &&
            cols.map((col, key) => {
              return (
                <th
                  key={key}
                  className={`fs_14 text-white text-capitalize bg_purple ${
                    entity?.sorting && col.heading !== 'Action' ? 'cursor_pointer' : ''
                  }   
                  ${(col?.align && cellClasses[col.align]) || 'text-left'}
                    `}
                  onClick={() => {
                    if (col.heading !== 'Action') {
                      handleSorting(col.field);
                    }
                  }}
                >
                  {col.heading}
                  {entity?.sorting && col.heading !== 'Action' && (
                    <button className="ps-1 pe-0 bg-transparent border-0 text-white outline-0 shadow-none ms-auto">
                      {sortingBy == col.field && sortType == 'asc' && (
                        <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1" />
                      )}
                      {sortingBy == col.field && sortType == 'desc' && (
                        <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1" />
                      )}
                      {sortingBy != col.field && (
                        <>
                          <FontAwesomeIcon icon={faLongArrowAltUp} width={5} className="mb-1 ms-1" />
                          <FontAwesomeIcon icon={faLongArrowAltDown} width={5} className="mt-1" />
                        </>
                      )}
                    </button>
                  )}
                </th>
              );
            })}
        </tr>
      </thead>
    );
  }

  function renderTableRows() {
    return (
      <tbody>
        {currentData.map((row, key) => {
          return (
            <tr key={key}>
              {cols &&
                cols.map((col, index) => {
                  // Extract the field from the column
                  const field = col['field'];
                  // Use optional chaining to get the render function
                  const colRender = entity?.columns?.render?.[field];

                  // Use a default align value if it's not specified in the column
                  const alignClass = col?.align ? cellClasses[col.align] : 'text-left';

                  // Get the value from the row
                  const fieldValue = row[field];
                  // Check if the fieldValue is null, undefined, or an empty string and display 'N/A' in those cases
                  const displayValue =
                    fieldValue == null || fieldValue === undefined || fieldValue === '' ? 'N/A' : fieldValue;
                  // Call the render function if it exists, otherwise use the fieldValue
                  const finalValue = colRender ? colRender(fieldValue, row, field) : displayValue;

                  return (
                    <>
                      <td key={index} className={`${alignClass} fs_13 blue_dark fw-medium`}>
                        {finalValue}
                      </td>
                    </>
                  );
                })}
            </tr>
          );
        })}
      </tbody>
    );
  }

  function selectBox() {
    return (
      <>
        <div className="form-group fs_14 fw-medium slate_gray mb-3 mb-sm-0">
          Show{' '}
          <select
            className="border rounded-1 cursor_pointer px-2 py-1 mx-1 slate_gray"
            defaultValue={10}
            onChange={(e) => setCurrentPageSize((e.target.value == -1 && rows?.length) || e.target.value)}
          >
            {entity?.lengthMenu.map((item, index) => {
              return (
                <option key={index} defaultValue={index == 1} value={item}>
                  {(item == -1 && 'ALL') || item}
                </option>
              );
            })}
          </select>{' '}
          Entries
        </div>
      </>
    );
  }

  return (
    <>
      <div>
        <div className="d-flex justify-content-end position-absolute search_input-box">
          {rows?.length >= 1 && entity && (
            <>
              {entity?.search && (
                <>
                  {(!searchInput && (
                    <FontAwesomeIcon
                      icon={faSearch}
                      width={18}
                      height={18}
                      className="slate_gray position-absolute search_icon"
                    />
                  )) || (
                    <FontAwesomeIcon
                      icon={faTimes}
                      width={18}
                      height={18}
                      className="slate_gray position-absolute search_icon"
                      onClick={() => setSearchInput('')}
                    />
                  )}
                  <Form.Control
                    type="text"
                    className="form-control fs_14 shadow-none"
                    placeholder="Search"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                  />
                </>
              )}
            </>
          )}
        </div>
        <div className="common_table text-nowrap mt-3">
          <Table responsive bordered>
            {cols?.length > 0 && entity && renderTableColumns()}
            {(currentData?.length > 0 && renderTableRows()) || (
              <tbody>
                <tr>
                  <td colSpan={cols?.length}>No record found!</td>
                </tr>
              </tbody>
            )}
          </Table>
        </div>
        <div className="align-items-center mt-3 mt-lg-0 justify-content-sm-between justify-content-center d-flex flex-wrap">
          {currentData.length > 0 && entity?.info && (
            <>
              {(rows?.length > 10 && (
                <p className="mb-sm-0 fw-medium slate_gray fs_14">
                  Showing {numFirst} to{' '}
                  <span className="fw-medium slate_gray">
                    {(numData > currentData.length && numFirst == 1 && currentData.length) || numData}{' '}
                  </span>
                  of {filterData.length} entries
                </p>
              )) || (
                <p className="mb-sm-0 fw-medium slate_gray fs_14">
                  Showing {numFirst} to <span className="fw-medium slate_gray">{currentData.length}</span> of{' '}
                  {filterData.length} entries
                </p>
              )}
            </>
          )}
          {entity?.pagination && (
            <div className="d-flex flex-wrap justify-content-sm-start justify-content-center">
              {rows?.length >= 1 && <>{entity?.lengthChange && selectBox()}</>}
              <CustomPagination
                data={filterData}
                pageSize={Number(currentPageSize)}
                setCurrentData={setCurrentData}
                setNumData={setNumData}
                setNumFirst={setNumFirst}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CustomDataTable;
