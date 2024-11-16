import React from 'react';
// import logo from './logo.svg';
import './App.css';
import { BrowserRouter} from 'react-router-dom';
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/bootstrap-icons/font/bootstrap-icons.css";
import "../node_modules/bootstrap/dist/js/bootstrap.bundle.js";
import { Mainpage } from './components/main/mainpage';
import { Header } from './components/header/header';

function App() {
  return (
    <div className='appContainer'>
      <BrowserRouter>
        <Header />
        <Mainpage />
      </BrowserRouter>
    </div>
  );
}

export default App;
