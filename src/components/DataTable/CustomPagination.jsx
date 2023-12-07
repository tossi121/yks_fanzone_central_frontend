import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useMemo, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DOTS, usePagination } from './usePagination';

const CustomPagination = (props) => {
  const {
    siblingCount = 1,
    pageSize,
    setCurrentData,
    data,
    setNumFirst,
    setNumData,
    currentPage,
    setCurrentPage,
  } = props;

  const totalCount = data?.length;

  function onPageChange(page) {
    setCurrentPage(page);
  }


  // useEffect(() => {
  //   setCurrentPage(currentPage);
  // }, [pageSize, currentPage]);

  const paginationRange = usePagination({ currentPage, totalCount, siblingCount, pageSize });

  const currentTableData = useMemo(() => {
    if (data) {
      const firstPageIndex = (currentPage - 1) * pageSize;
      const lastPageIndex = firstPageIndex + pageSize;
      if (firstPageIndex >= data.length) {
        return data.slice(0, lastPageIndex);
      } else {
        return data.slice(firstPageIndex, lastPageIndex);
      }
    }
  }, [currentPage, data, pageSize]);

  const numberOfData = useMemo(() => {
    const firstPageIndex = (Number(currentPage) - 1) * Number(pageSize);
    const lastPageIndex = Number(firstPageIndex) + Number(pageSize);
    if (lastPageIndex < totalCount || currentPage > firstPageIndex) {
      return firstPageIndex, lastPageIndex;
    } else {
      const lastPageIndex = totalCount;
      return lastPageIndex;
    }
  }, [currentPage, pageSize, currentTableData]);

  const numberOfFirstData = useMemo(() => {
    const firstPageIndex = (Number(currentPage) - 2) * Number(pageSize) + 1;
    const lastPageIndex = Number(firstPageIndex) + Number(pageSize);
    return firstPageIndex, lastPageIndex;
  }, [currentPage, pageSize]);

  useEffect(() => {
    setCurrentData(currentTableData);
    setNumData(numberOfData);
    setNumFirst(numberOfFirstData);
  }, [currentTableData, numberOfFirstData, numberOfData, pageSize]);

  if (currentPage === 0 || paginationRange?.length < 2) {
    return null;
  }

  const onNext = () => {
    onPageChange(currentPage + 1);
  };

  const onPrevious = () => {
    onPageChange(currentPage - 1);
  };

  const lastPage = paginationRange[paginationRange?.length - 1];
  return (
    <>
      <div className="d-flex align-items-baseline">
        <ul className="pagination_container d-flex align-items-center justify-content-center mb-0 list-unstyled">
          <li
            className={`pagination_item ${(currentPage === 1 && 'disabled') || ''}`}
            onClick={onPrevious}
            title="Previous"
          >
            <FontAwesomeIcon icon={faChevronLeft} width={8} />
          </li>
          {paginationRange.map((pageNumber, index) => {
            if (pageNumber === DOTS) {
              return (
                <li key={index} className="px-2 bg-transparent dots">
                  &#8230;
                </li>
              );
            }
            return (
              <>
                <li
                  key={index}
                  className={`pagination_item ${(pageNumber === currentPage && 'selected') || ''}`}
                  onClick={() => onPageChange(pageNumber)}
                >
                  {pageNumber}
                </li>
              </>
            );
          })}
          <li
            className={`pagination_item ${(currentPage === lastPage && 'disabled') || ''}`}
            onClick={onNext}
            title="Next"
          >
            <FontAwesomeIcon icon={faChevronRight} width={8} />
          </li>
        </ul>
      </div>
    </>
  );
};

export default CustomPagination;
