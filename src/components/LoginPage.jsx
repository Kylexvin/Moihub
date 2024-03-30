import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Route, Navigate } from 'react-router-dom'; // Import Route and Navigate
import LoginButton from './LoginButton';

const LoginPage = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <Route>
      {({ location }) => (
        <>
          {isAuthenticated ? (
            <Navigate to="/home" replace state={{ from: location }} />
          ) : (
            <div>
              <h2>Login Page</h2>
              <LoginButton />
            </div>
          )}
        </>
      )}
    </Route>
  );
};

export default LoginPage;
