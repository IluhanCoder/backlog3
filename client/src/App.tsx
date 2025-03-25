import React, { useEffect } from 'react';
import Header from './header';
import { BrowserRouter, Route, Router, RouterProvider, Routes } from 'react-router-dom';
import router from './router';
import CustomRoutes from './router';
import FormComponent from './forms/form-component';
import { useState } from 'react';
import formStore from './forms/form-store';
import { observer } from 'mobx-react';
import { useNavigate } from 'react-router-dom';
import FormCloserProvider from './forms/form-closer-provider';
import authService from './auth/auth-service';
import userStore from './user/user-store';

function App() {
  const {form} = formStore;

  const verifyUser = async () => {
    await authService.checkAuth();
  }
  useEffect(() => {
    verifyUser();
  }, [])

  return (
    <div className='h-full w-full flex'>
      <BrowserRouter>
        <FormCloserProvider>
          <Header/>
          <div className='grow overflow-auto h-full'>
            <Routes>
              {CustomRoutes.map(route => route)}
            </Routes>
          </div>
          {form && <div>{form}</div>}
        </FormCloserProvider>
      </BrowserRouter>
    </div>
  );
}

export default observer(App);
