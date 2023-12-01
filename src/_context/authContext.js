import { getMyPermissions, getMyprofileData } from '_services/nifty_service_api';
import Cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useEffect } from 'react';
import { useContext, createContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isContextLoaded, setIsContextLoaded] = useState(true);
  const [hasPermission, setHasPermission] = useState(null);
  const [profileDetails, setProfileDetails] = useState('')

  const router = useRouter();

  useEffect(() => {
    if (isLoggedIn) {
      getUserData();
    } else {
      router.push('/login');
    }
  }, [isContextLoaded, isLoggedIn]);

  function getUserData() {
    const token = Cookies.get('token');
    if (token) {
      setIsLoggedIn(true);
      setIsContextLoaded(true);
    } else {
      setIsLoggedIn(false);
      setIsContextLoaded(true);
    }
  }
  useEffect(() => {
    handlePermissions();
    userProfileDetails()
  }, [isLoggedIn]);

  async function handlePermissions() {
    const response = await getMyPermissions();
    if (response.result === 1) {
      const data = response.data;
      setHasPermission(data.permission);
    } else {
      setHasPermission(null);
    }
  }

  async function userProfileDetails() {
    const response = await getMyprofileData();
    if (response.result == 1) {
      setProfileDetails(response?.data);
    }
  }

  return (
    <AuthContext.Provider value={{ getUserData, isContextLoaded, isLoggedIn, hasPermission, profileDetails ,userProfileDetails}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
