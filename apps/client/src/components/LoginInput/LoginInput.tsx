import { useState } from "react";
import "./LoginInput.css";
import axios from "axios";

const LoginInput = () => {

    const [id, setId] = useState("");
    const [pwd, setPwd] = useState("");

    const onChangeId = (e) => {
        setId(e.target.value);
    }

    const onChangePwd = (e) => {
        setPwd(e.target.value);
    }

    const Login = () => {
        axios.post("/login", {
            
        })
    }


    return (
        <form>
            <div className="LoginInput">
                <input className="idpw" placeholder="이메일" onChange={onChangeId}/>
                <input className="idpw" placeholder="비밀번호" type="password" onChange={onChangePwd}/>
                <button className="loginButton" type="submit" onClick={Login}>로그인</button>
                <a href="/">
                    비밀번호를 잊으셨나요?
                </a>
            </div>
        </form>
        
    );
    
}

export default LoginInput;