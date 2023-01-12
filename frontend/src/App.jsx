import React from 'react';
import './styles/App.css';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom'
import PrivateRoute from './utils/PrivateRoute'
import { AuthProvider } from './context/AuthContext'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Header from './components/Header'
import Footer from './components/Footer'

function App() {
  return ( 
    <div className='App'>
      <Router>
        <AuthProvider>
          <Header/>
          <Routes style={{zIndex:1}}>
            <Route exact path='/' element={<PrivateRoute Component = {HomePage} />} />
            <Route element={<LoginPage />} path='/login' exact />
            <Route element={<RegisterPage />} path='/register' exact />
          </Routes>
          <Footer/>
        </AuthProvider>
      </Router>
    </div>
   );
}
 
export default App;