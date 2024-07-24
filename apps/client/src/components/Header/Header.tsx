import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import "./Header.css";
import { useState, useEffect } from "react";
import { getCookie, removeCookie } from "../../utils/cookies";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    location.pathname === "/login"
      ? setIsLoginPage(true)
      : setIsLoginPage(false);
    getCookie("accessToken") ? setIsLogin(true) : setIsLogin(false);
  }, [location.pathname, setIsLoginPage, setIsLogin]);

  if (isLoginPage) return null;

  const handleLogout = async () => {
    try {
      removeCookie("accessToken");
      setIsLogin(false);
      navigate("/");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <header className="Header">
      <div className="Header_wrapper">
        <Link to="/" className="Logo">
          Hotsix
        </Link>
        <div>
          {isLogin ? (
            <>
              <Link to="/mypage" className="Join mr-2">
                마이페이지
              </Link>
              <Button
                text="게시글 작성"
                type="PRIMARY"
                link="/posts/create"
                spacing="mr-2"
              />
              <Button text="로그아웃" type="SECONDARY" onClick={handleLogout} />
            </>
          ) : (
            <>
              <Link className="Join mr-2" to="/join">
                회원가입
              </Link>
              <Button text="로그인" type="PRIMARY" link="/login" />
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
