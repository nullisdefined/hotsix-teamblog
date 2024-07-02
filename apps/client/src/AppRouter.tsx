import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Join from "./pages/Join";
import PostDetail from "./pages/post/Detail";
import PostEdit from "./pages/post/Edit";

const AppRouter = () => {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/join" element={<Join />} />
          <Route path="/posts/:id" element={<PostDetail />} />
          <Route path="/posts/edit" element={<PostEdit />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
