import React from "react";
import { BrowserRouter } from "react-router-dom";
import RootRouters from "./routers/RootRouters";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer} from 'react-toastify';

export default function App() {
  return (
    <BrowserRouter>
      <RootRouters />
      <ToastContainer />
    </BrowserRouter>
  );
}
