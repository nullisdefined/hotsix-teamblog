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

  const handleLogout = () => {
    removeCookie("accessToken");
    navigate(0); // 새로고침
  };

  return (
    <header className="Header">
      <div className="Header_wrapper">
        <Link to="/" className="Logo">
          Hotsix
        </Link>
        <div>
          <Link className="Join" to="/join">
            회원가입
          </Link>
          {isLogin ? (
            <Button
              text="로그아웃"
              type="PRIMARY"
              onClick={handleLogout}
            ></Button>
          ) : (
            <Button text="로그인" type="PRIMARY" link="/login"></Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
