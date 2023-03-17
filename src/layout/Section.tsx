import React from "react";

type props = {
  title: string;
  className?: string;
  children?: React.ReactNode | null;
};

const Section = ({ title, className, children }: props) => {
  return <div className='section'>
    <h2>{ title }</h2>
    <div className={ className }>
      { children }
    </div>
  </div>
}

export default Section;