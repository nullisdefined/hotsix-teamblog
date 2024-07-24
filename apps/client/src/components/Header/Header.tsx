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
    setIsLoginPage(location.pathname === "/login");
    setIsLogin(!!getCookie("accessToken"));
  }, [location.pathname]);

  if (isLoginPage) return null;

  const handleLogout = async () => {
    try {
      removeCookie("accessToken");
      setIsLogin(false);

      // 로그아웃 후 처리
      if (location.pathname === "/" || location.pathname === "/login") {
        // 홈페이지나 로그인 페이지에 있을 경우 새로고침
        window.location.reload();
      } else {
        // 다른 페이지에 있을 경우 로그인 페이지로 이동
        navigate("/login");
      }
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
