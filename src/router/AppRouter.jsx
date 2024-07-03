import { Navigate, Route, Routes } from "react-router-dom"
import { LoginPage } from "../auth";
import { CalendarPage } from "../Calendar";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect } from "react";

export const AppRouter = () => {

  // const authStatus = 'not-authenticated';

  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, [])

  if(status === 'checking') {
    return (
      <h3>Checking...</h3>
    )
  }  

  return (
    <Routes>
      {
        (status === 'not-authenticated')
        ? (
          <>
            <Route path="/auth/*" element={ <LoginPage/>} />
            <Route path="/*" element={<Navigate to="/auth/login"/>} />
          </>
        )
        : (
          <>
            <Route path="/" element={ <CalendarPage/>} />
            <Route path="/*" element={<Navigate to="/"/>} />
          </>
        )
      }
  
    </Routes>
  )
}
