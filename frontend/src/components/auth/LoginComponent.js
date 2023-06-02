import './LoginComponent.css';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { setUser } from '../../redux/actions/userActions';
import { useDispatch } from 'react-redux';
const apiUrl = 'http://localhost:8080/api';

function LoginComponent() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
  
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
        setEmailError('');
      };
      
      const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setPasswordError('');
      };
  
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (email === '') {
          setEmailError('Please enter your email');
          return;
        }
      
        if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
          setEmailError('Please enter a valid email');
          return;
        }
      
        if (password === '') {
          setPasswordError('Please enter a password');
          return;
        }
      
        if (password.length < 8) {
          setPasswordError('The password must be 8 characters or longer');
          return;
        }
  
      const userData = {
        email: email,
        password: password
      };
      
      try {
        const response = await fetch(`${apiUrl}/user/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(userData)
        });
  
        if (response.ok) {
          const data = await response.json();
          console.log(data);
          // Handle successful login, e.g., store user data and token in Redux store
        } else {
          // Handle login error, e.g., display error message
          const errorData = await response.json();
          console.log(errorData.error);
        }
      } catch (error) {
        // Handle network or server errors
        console.log(error);
      }
    };
  
    return (
        <div className="App">
          <div className="Auth-form-container">
            <form className="Auth-form" onSubmit={handleSubmit}>
              <div className="Auth-form-content">
                <div className="auth-form-header">
                  <h3 className="Auth-form-title">Вход</h3>
                  <Link to="/register" className="register-link">
                    Зарегистрироваться
                  </Link>
                </div>
                <div className="form-group mt-3">
                  <label>Электронная почта</label>
                  <input
                    type="email"
                    className="form-control mt-1 inputBox"
                    placeholder="Введите почту"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                  {emailError && <label className="error-message">{emailError}</label>}
                </div>
                <div className="form-group mt-3">
                  <label>Пароль</label>
                  <input
                    type="password"
                    className="form-control mt-1 inputBox"
                    placeholder="Введите пароль"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                  {passwordError && <label className="error-message">{passwordError}</label>}
                </div>
                <div className="d-grid gap-2 mt-3">
                  <button type="submit" className="btn btn-primary inputButton">
                    Войти
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      );
  }
  
  export default LoginComponent;