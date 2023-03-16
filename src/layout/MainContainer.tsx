import React from "react";

type props = {
  children: React.ReactNode | null;
};

const MainContainer = ({ children }: props) => {
  return <div className="main-container">{ children }</div>
};

export default MainContainer;