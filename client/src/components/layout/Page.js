import React from 'react';
import PropTypes from 'prop-types';
import '../../css/Page.css';

/**
 * Layout for a page
 *
 * @param {*} props
 * @returns
 */
function Page({ title, children, menuItems }) {
  return (
    <div className="page-wrapper">
      <header>
        <h1>{title ?? 'MemberDB'}</h1>
        <div className="menu">{menuItems}</div>
      </header>
      <main>{children}</main>
    </div>
  );
}

Page.propTypes = {
  title: PropTypes.any,
  children: PropTypes.any,
  menuItems: PropTypes.any,
};

export default Page;
