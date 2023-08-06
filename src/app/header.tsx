"use client";
import dynamic from "next/dynamic";
import React from "react";

const DynamicDrawer = dynamic(() => import("@/components/Drawer/Drawer"), {
  ssr: false,
});

const Header: React.FC = () => {
  return (
    <header className="flex justify-center p-10">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <nav className="flex items-center">
            {/* <DynamicDrawer /> */}
            <h2>hello</h2>
          </nav>
          <div className="flex items-center">
            {/* <div className="mr-4">LOGO</div> */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
