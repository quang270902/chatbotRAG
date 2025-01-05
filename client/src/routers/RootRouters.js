import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../pages/home";

const RootRouters = () => {
  return (
    <Routes>
      <Route path="/c/:session_id" element={<Home />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
};

export default RootRouters;
