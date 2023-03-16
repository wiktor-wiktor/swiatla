import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import MainContainer from './layout/MainContainer';
import Section from './layout/Section';

const App = () => {
  return (
    <div className='App'>
      <MainContainer>
        <Section title='Lightbulbs'></Section>
        <Section title='Groups'></Section>
        <Section title='Timeline'></Section>
        <Section title='Performance preview'></Section>
        <Section title='Config'></Section>
      </MainContainer>
    </div>
  )
};

export default App;
