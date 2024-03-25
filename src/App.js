import React from "react";
import { Signup } from "./Auth/SignUp";
import { Signin } from "./Auth/Signin";
import { AuthContext } from "./Context/AuthContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Components/Home";
import { Protected } from "./Auth/Protected";
import ProfileUpdate from "./Components/ProfileUpdate";
import ForgotPassword from "./Auth/ForgotPassword";
const App = () => {
  return (
    <>
      {" "}
      <AuthContext>
        {" "}
        <BrowserRouter>
          {" "}
          <Routes>
            {" "}
            <Route path="/" element={<Signin />} />{" "}
            <Route
              path="/home"
              element={
                <Protected>
                  <Home />
                </Protected>
              }
            />{" "}
            <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
            <Route
              path="/profile-update"
              element={
                <Protected>
                  <ProfileUpdate />
                </Protected>
              }
            />{" "}
            <Route path="/login" element={<Signin />} />{" "}
            <Route path="/signUp" element={<Signup />} />
          </Routes>{" "}
        </BrowserRouter>{" "}
      </AuthContext>{" "}
    </>
  );
};
export default App;
