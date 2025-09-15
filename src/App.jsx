import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Nav from './components/Nav';
import CheckResume from './components/CheckResume';

const App = () => {
  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/check" element={<CheckResume />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
