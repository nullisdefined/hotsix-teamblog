import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import { useState, useEffect } from "react";
import { getCookie, removeCookie } from "../../utils/cookies";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoginPage, setIsLoginPage] = useState(true);
  const [isLogin, setIsLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsLoginPage(location.pathname === "/login");
    setIsLogin(!!getCookie("accessToken"));
  }, [location.pathname]);

  if (isLoginPage) return null;

  const handleLogout = async () => {
    try {
      removeCookie("accessToken");
      setIsLogin(false);

      if (location.pathname === "/" || location.pathname === "/login") {
        window.location.reload();
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="Header">
      <div className="Header_wrapper">
        <Link to="/" className="Logo">
          Hotsix
        </Link>
        <button className="Menu_toggle" onClick={toggleMenu}>
          ☰
        </button>
        <div className={`Header_buttons ${isMenuOpen ? "open" : ""}`}>
          {isLogin ? (
            <>
              <Link
                to="/mypage"
                className="Header_button SECONDARY"
                onClick={toggleMenu}
              >
                마이페이지
              </Link>
              <Link
                to="/posts/create"
                className="Header_button PRIMARY"
                onClick={toggleMenu}
              >
                게시글 작성
              </Link>
              <button
                className="Header_button SECONDARY"
                onClick={() => {
                  handleLogout();
                  toggleMenu();
                }}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link
                to="/join"
                className="Header_button SECONDARY"
                onClick={toggleMenu}
              >
                회원가입
              </Link>
              <Link
                to="/login"
                className="Header_button PRIMARY"
                onClick={toggleMenu}
              >
                로그인
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
