import React, { createContext, useState, useEffect } from "react";

export const LoginContext = createContext("");

export const Context = ({ children }) => {
    
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [loginData, setLoginData] = useState(storedUser || null);
  const [userRole, setUserRole] = useState(storedUser?.role || null);

  return (
    <div>
      <LoginContext.Provider
        value={{ loginData, setLoginData, userRole, setUserRole }}
      >
        {children}
      </LoginContext.Provider>
    </div>
  );
};
