import React from 'react';
import { Row, Col, Dropdown } from 'react-bootstrap';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { useEffect } from 'react';
import { useState } from 'react';

function Topbar(props) {
  const { handleToggle } = props;
  const router = useRouter();
  const [userName, setUserName] = useState(null);

  function logout() {
    Cookies.remove('yks_fanzone_central_token');
    Cookies.remove('yks_fanzone_central_user_name');
    Cookies.remove('yks_fanzone_central_permissions');
    router.push('/login');
    history.pushState(null, null, location.href);
    window.onpopstate = function () {
      history.go(1);
    };
  }

  useEffect(() => {
    const name = Cookies.get('yks_fanzone_central_user_name');
    setUserName(name);
  }, [userName]);

  return (
    <>
      <div className="w-100 top_bar position-sticky top-0 bg-white shadow-sm">
        <Row className="mx-0 h-100 align-items-center">
          <Col lg={12}>
            <div className="d-flex align-items-center justify-content-between">
              <Link href={'/'}>
                <Image src="/images/logo.png" alt="logo" width={110} height={54} />
              </Link>
              <div className="d-lg-none d-block">
                <FontAwesomeIcon icon={faBars} onClick={handleToggle} width={18} height={18} />
              </div>
              <div className="ms-auto d-lg-flex d-none mx-2 align-items-center">
                <span className="blue_dark fw-bold fs_14 text-capitalize">{userName || ''}</span>
                <div className="mx-3">
                  <Dropdown className="slate_gray">
                    <Dropdown.Toggle
                      variant="none"
                      className="p-0 border-0 d-flex align-items-center"
                      id="dropdown-basic"
                    >
                      <Image src={'/images/user.png'} alt="image" height={40} width={40} className="rounded-circle" />
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100 rounded-4">
                      <Dropdown.Item className="py-2 fs_14 slate_gray" onClick={logout}>
                        Logout
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
}
export default Topbar;
