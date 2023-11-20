import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';

function DashboardBreadcrumb(props) {
  const router = useRouter();
  return (
    <>
      <div className="dashboard-breadcrumb-wrapper">
        <nav aria-label="breadcrumb" className="dashboard-breadcrumb pe-3 py-1">
          {(router.pathname != '/' && (
            <ol className="breadcrumb justify-content-start card-border bg-white py-2 rounded-2 mb-0">
              <li className="breadcrumb-item">
                <Link href="/">
                  <span className="text-decoration-none slate_gray fs-14 fw-400">
                    <Image
                      src={'/images/dashboard-icons/dashboard-home.svg'}
                      alt="home"
                      width={18}
                      height={18}
                      className="mb-1 me-1"
                    />
                    {props.data}
                  </span>
                </Link>
              </li>
              <li className="breadcrumb-item">
                <a className="text-decoration-none slate_gray fs-14 fw-400">{props.breadcrumbTitle}</a>
              </li>
            </ol>
          )) || (
            <ol className="breadcrumb mb-0 card-border bg-white py-2 rounded-2 mb-0">
              <li className="breadcrumb-item">
                <Link href="/">
                  <span className="text-decoration-none slate_gray fs-14 fw-400">
                    <Image
                      src={'/images/dashboard-icons/dashboard-home.svg'}
                      alt="home"
                      width={18}
                      height={18}
                      className="mb-1 me-1"
                    />
                    {props.data}
                  </span>
                </Link>
              </li>
            </ol>
          )}
        </nav>
      </div>
    </>
  );
}

export default DashboardBreadcrumb;
