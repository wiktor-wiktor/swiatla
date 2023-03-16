import React from "react";

type props = {
  title: string;
  children?: React.ReactNode | null;
};

const Section = ({ title, children }: props) => {
  return <div className="section">
    <h2>{ title }</h2>
    { children }
  </div>
}

export default Section;