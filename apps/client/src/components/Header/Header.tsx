import React from "react";
import { Link } from "react-router-dom";
import Button from "../Button/Button";
import "./Header.css";

const Header = () => {
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
          <Button
            text="로그인" // 로그인 여부 확인 후 로그인 or 로그아웃 노출
            type="PRIMARY"
            link="/login"
          ></Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
