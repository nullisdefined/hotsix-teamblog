import { ChangeEvent, useState } from "react";
import "./LoginInput.css";

const LoginInput = () => {
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");

  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
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
        <button className="loginButton" type="submit">
          로그인
        </button>
        <a href="/">비밀번호를 잊으셨나요?</a>
      </div>
    </form>
  );
};

export default LoginInput;
