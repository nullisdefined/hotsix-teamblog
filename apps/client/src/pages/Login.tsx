import LoginInput from "../components/LoginInput/LoginInput";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="LoginPage">
      <Link to="/">
        <h1
          style={{
            fontSize: "3em",
            fontFamily: "Pretendard-Black",
            marginBottom: "20px",
          }}
        >
          Hotsix
        </h1>
      </Link>
      <LoginInput />
    </div>
  );
};

export default Login;
