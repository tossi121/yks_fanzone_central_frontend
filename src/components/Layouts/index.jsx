import React from 'react';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { Toaster } from 'react-hot-toast';

const Sidebar = dynamic(import('./Sidebar'));
const Topbar = dynamic(import('./Topbar'));

function DashboardLayout(props) {
  const { children } = props;
  const [toggle, setToggle] = useState(true);

  function handleToggle() {
    setToggle(!toggle);
  }

  return (
    <>
      <>
        <Toaster position="top-right" reverseOrder={false} />
        <Topbar {...{ handleToggle }} />
        <div className="d-flex h-100 w-100">
          <Sidebar {...{ handleToggle, toggle }} />
          <div className={`content_section ms-auto py-4 px-md-3 px-2 ${(!toggle && 'content_sm') || ''}`}>
            {children}
          </div>
        </div>
      </>
    </>
  );
}
export default DashboardLayout;
