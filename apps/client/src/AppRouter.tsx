import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header/Header";
import Main from "./pages/Main";
import Login from "./pages/Login";
import Join from "./pages/Join";
import PostDetail from "./pages/post/Detail";
import PostEdit from "./pages/post/Edit";
import EmailCheck from "./pages/pwdReset/EmailCheck";
import PwdReset from "./pages/pwdReset/PwdReset";

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
          <Route path="/emailcheck" element={<EmailCheck />} />
          <Route path="/pwdreset" element={<PwdReset />} />
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default AppRouter;
