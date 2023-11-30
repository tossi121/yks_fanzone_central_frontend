import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronLeft,
  faChevronRight,
  faImages,
  faNewspaper,
  faUser,
  faUserFriends,
} from '@fortawesome/free-solid-svg-icons';
import Cookies from 'js-cookie';

const links = [
  { href: '/press-release', tokenKey: 'manage_press_release', label: 'Press Release', iconSrc: faNewspaper },
  { href: '/gallery', tokenKey: 'manage_gallery', label: 'Gallery', iconSrc: faImages },
  { href: '/player-profile', tokenKey: 'manage_player_profile', label: 'Player Profile', iconSrc: faUserFriends },
  { href: '/user-access', tokenKey: 'create_user', label: 'User Access', iconSrc: faUser },
];

function SidebarLink({ href, label, iconSrc, tokenKey }) {
  const token = Cookies.get('yks_fanzone_central_permissions');

  const router = useRouter();

  let isActive = '';

  if (href === '/') {
    isActive = (router.asPath === href && 'active') || '';
  } else {
    isActive = (router.asPath.startsWith(href) && 'active') || '';
  }

  return (
    <>
      {/* {token?.includes(tokenKey) && ( */}
        <li className="my-3">
          <Link href={href}>
            <div className={`fw-medium side_link slate_gray rounded-2 ${isActive}`}>
              <FontAwesomeIcon icon={iconSrc} width={21} height={21} className="me-3" />
              {<span className="text-nowrap">{label}</span>}
            </div>
          </Link>
        </li>
      {/* )} */}
    </>
  );
}

function Sidebar({ toggle, handleToggle }) {
  return (
    <section className={`sidebar_section bg-white position-fixed shadow-sm ${(!toggle && 'sidebar_sm') || ''} `}>
      <div>
        <span
          className="btn_expanded align-items-center slate_gray border rounded-circle position-absolute justify-content-center bg-white d-lg-flex d-none cursor_pointer"
          onClick={handleToggle}
        >
          <FontAwesomeIcon icon={(!toggle && faChevronRight) || faChevronLeft} width={15} height={15} />
        </span>
        <ul className="p-3 vh-100 list-unstyled">
          {links.map(({ href, label, iconSrc, tokenKey }) => (
            <SidebarLink key={href} href={href} tokenKey={tokenKey} label={(toggle && label) || ''} iconSrc={iconSrc} />
          ))}
        </ul>
      </div>
    </section>
  );
}

export default Sidebar;
