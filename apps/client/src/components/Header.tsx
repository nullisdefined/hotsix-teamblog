import React from "react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <>
      <p>
        <Link to="/">
          <span style={{ paddingRight: "50px" }}>Hotsix</span>
        </Link>
        <Link to="/login">
          <button>Login</button>
        </Link>
        <Link to="/join">
          <button>Join</button>
        </Link>
      </p>
    </>
  );
};

export default Header;
