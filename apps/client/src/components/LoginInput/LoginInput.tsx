import { ChangeEvent, useState } from "react";
import "./LoginInput.css";
import axios from "../../config/axios";
import { setCookie } from "../../utils/cookies";
import { Link, useNavigate } from "react-router-dom";
import dayjs from "dayjs";

const LoginInput = () => {
  const navigate = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState(""); // 오류 메시지 상태 추가

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    const expirationInMinutes = parseInt(
      import.meta.env.VITE_APP_JWT_EXPIRATION_TIME,
      10
    );
    const expiryDate = dayjs().add(expirationInMinutes, "minute").toDate();
    event.preventDefault();
    try {
      const data = {
        email: id,
        password: pwd,
      };
      const response = await axios.post("/auth/signin", data);
      // console.log("SUCCESS", response.data);
      const accessToken = response.data.accessToken;
      setCookie("accessToken", accessToken, {
        path: "/",
        expires: expiryDate,
        // secure: true, // HTTPS에서만 전송
        // httpOnly: true
      });
      navigate("/");
    } catch (err: any) {
      // console.log("ERR", err);
      if (err.response && err.response.status === 401) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다."); // 오류 메시지 설정
      } else {
        setError("로그인 중 오류가 발생했습니다. 다시 시도해주세요."); // 일반 오류 메시지 설정
      }
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
        {error && <div className="error">{error}</div>} {/* 오류 메시지 표시 */}
        <button className="loginButton" type="submit" onClick={handleSubmit}>
          로그인
        </button>
        <Link to="/password-reset">비밀번호를 잊으셨나요?</Link>
      </div>
    </form>
  );
};

export default LoginInput;
