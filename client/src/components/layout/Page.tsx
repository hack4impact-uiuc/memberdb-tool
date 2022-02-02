// @flow
import React, { ReactElement } from 'react';
import '../../css/Page.css';

type PageProp = {
  title?: any,
  children?: any,
  menuItems?: any,
};

/**
 * Layout for a page
 *
 * @param {*} props
 * @returns
 */
const Page = ({ title, children, menuItems }: PageProp): ReactElement => {
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

export default Page;
