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
      maxHeight:"200px",
      paddingTop:"13%",
      paddingBottom:"10%",
     marginTop:"5px",
      backgroundImage: `url('/images/logo.jpg')`,
      backgroundPosition: 'center', // Centraliza a imagem de fundo
      backgroundRepeat: 'no-repeat', // Previne a repetição da imagem
      backgroundSize: '330px' // Faz a imagem cobrir toda a área disponível
    }}>
   
  </header>
  );
};

export default Header;
