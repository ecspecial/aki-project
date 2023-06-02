import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavigationBar from './common/navigation/NavigationBar';
import UnauthHome from './home/UnauthHome';
import LoginComponent from './auth/LoginComponent';
import Footer from './common/footer/PageFooter';

function App() {
  return (
    <div className='App'>
      <BrowserRouter>
        <NavigationBar />
        <Routes>
          <Route 
            path='/'
            element={<UnauthHome />}
          />
          <Route 
            path='/login'
            element={<LoginComponent />}
          />
        </Routes>
        
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
