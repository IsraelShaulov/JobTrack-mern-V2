import { Outlet, useLoaderData, redirect, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { BigSidebar, Navbar, SmallSidebar } from '../components';
import React, { useContext, useState } from 'react';
import { checkDefaultTheme } from '../App';
import customFetch from '../utils/customFetch';
import { toast } from 'react-toastify';

// loader
export const loader = async () => {
  try {
    const response = await customFetch.get('/users/current-user');
    const data = response.data;
    return data;
  } catch (error) {}
  return redirect('/');
};
// end of loader

// Context API
const DashboardContext = React.createContext();

const DashboardLayout = () => {
  // const data = useLoaderData();
  // console.log(data);
  const { user } = useLoaderData();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    await customFetch.get('/auth/logout');
    navigate('/');
    toast.success('Logging out...');
  };

  return (
    <DashboardContext.Provider
      value={{
        user,
        showSidebar,
        isDarkTheme,
        toggleDarkTheme,
        toggleSidebar,
        logoutUser,
      }}
    >
      <Wrapper>
        <main className='dashboard'>
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className='dashboard-page'>
              <Outlet context={{ user }} />
            </div>
          </div>
        </main>
      </Wrapper>
    </DashboardContext.Provider>
  );
};

// custom hook
export const useDashboardContext = () => {
  return useContext(DashboardContext);
};

const Wrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 2rem 0;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    .dashboard-page {
      width: 90%;
    }
  }
`;

export default DashboardLayout;
