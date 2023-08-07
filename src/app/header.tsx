"use client";
import dynamic from "next/dynamic";
import React from "react";

const DynamicDrawer = dynamic(() => import("@/components/Drawer/Drawer"), {
  ssr: false,
});

const Header: React.FC = () => {
  return (
    <header className="flex "
    style={{
      
      paddingTop:"55px",
      paddingBottom:"55px",
      backgroundImage: `url('/images/logo.jpg')`,
      backgroundPosition: 'center', // Centraliza a imagem de fundo
      backgroundRepeat: 'no-repeat', // Previne a repetição da imagem
      backgroundSize: '330px' // Faz a imagem cobrir toda a área disponível
    }}>
   
  </header>
  );
};

export default Header;
