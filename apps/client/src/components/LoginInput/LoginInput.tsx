import { ChangeEvent, useState } from "react";
import "./LoginInput.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginInput = () => {


  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");

  
  const onChangeId = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
    setPwd(e.target.value);
  };

  const Login = () => {

    axios({
      method:"POST",
      url: 'http://http://localhost:5173/api/login',
      data:{
          "email": email,
          "password": pwd
      }
    }).then((res)=>{
        console.log(res);
        const token = res.data.token;
        localStorage.setItem('jwtToken', token);
        alert("로그인 성공");
        navigate("/");
    }).catch(error=>{
        alert("로그인 실패");
        navigate("/");
        console.log(error);
        throw new Error(error);
    });
  }


  return (
    <>
      <div className="LoginInput">
        <input className="idpw" placeholder="이메일" onChange={onChangeId} />
        <input
          className="idpw"
          placeholder="비밀번호"
          type="password"
          onChange={onChangePwd}
        />
        <button className="loginButton" type="submit" onClick={Login}>
          로그인
        </button>
        <a href="/">비밀번호를 잊으셨나요?</a>
      </div>
    </>
  );
};

export default LoginInput;

