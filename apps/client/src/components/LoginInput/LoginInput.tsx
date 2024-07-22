import { ChangeEvent, useState } from "react";
import "./LoginInput.css";
import axios from "../../config/axios";
import { setCookie } from "../../utils/cookies";
import { useNavigate } from "react-router-dom";

const LoginInput = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const data = {
        email: id,
        password: pwd,
      };
      const response = await axios.post("/auth/signin", data);
      console.log("SUCCESS", response.data);
      const accessToken = response.data.accessToken;
      setCookie("accessToken", accessToken, {
        path: "/",
        // expires:
        // secure: true, // HTTPS에서만 전송
        // httpOnly: true
      });
      navigate("/");
    } catch (err) {
      console.log("ERR", err);
    }
  };

  return (
    <form>
      <div className="LoginInput">
        <input className="idpw" placeholder="이메일" onChange={onChangeId} />
        <input
          className="idpw"
          placeholder="비밀번호"
          type="password"
          onChange={onChangePwd}
        />
        <button className="loginButton" type="submit" onClick={handleSubmit}>
          로그인
        </button>
        <a href="/">비밀번호를 잊으셨나요?</a>
      </div>
    </form>
  );
};

export default LoginInput;
