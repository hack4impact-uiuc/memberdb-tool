import React from 'react';
import type { Node } from 'react';
import '../../css/Page.css';

/**
 * Layout for a page
 *
 * @param {*} props
 * @returns
 */
function Page({ title, children, menuItems }: PageProp): Node {
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

type PageProp = {
  title: any,
  children: any,
  menuItems: any,
};

export default Page;
