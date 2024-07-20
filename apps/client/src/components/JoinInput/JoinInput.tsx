import { ChangeEvent, useState } from "react";
import "./JoinInput.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JoinInput = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [pwd, setPwd] = useState("");
    const [nickname, setNickname] = useState("");
    const [img, setImg] = useState(1);
    const [link, setLink] = useState("");
    const [introduction, setIntroduction] = useState("");

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
        setPwd(e.target.value);
    }

    const onChangeNickname = (e: ChangeEvent<HTMLInputElement>) => {
        setNickname(e.target.value);
    }

    const onChangeLink = (e: ChangeEvent<HTMLInputElement>) => {
        setLink(e.target.value);
    }

    const onChangeIntroduction = (e: ChangeEvent<HTMLTextAreaElement>) => {
        setIntroduction(e.target.value);
    }

    const Join = () => {

        console.log(email + pwd + nickname + img + link + introduction);

        axios.post('http://localhost:5173/api/join',
            {
                "email": email,
                "pwd": pwd,
                "nickname": nickname,
                "img": img,
                "link": link,
                "introduction": introduction
            }, {
                headers: { 'Content-type': 'application/json' }
            })
        .then((res)=>{
              console.log(res);
              alert("회원가입 성공");
              navigate("/login");
          }).catch(error=>{
              alert("회원가입 실패");
              navigate("/");
              console.log(error);
              throw new Error(error);
          });
    }

    return (
        <div className="JoinInput">
            <div className="email">
                <p>이메일</p>
                <div style={{display: "flex"}}>
                    <input className="emailInput" type="email" placeholder="email@hotsix.co.kr" onChange={onChangeEmail}/>
                    <button className="dupeCheck">중복 확인</button>
                </div>
            </div>
            
            <div className="pwd">
                <p>비밀번호</p>
                <input className="pwdInput" type="password" placeholder="8~16자리/영문 대소문자, 숫자, 특수문자 조합" onChange={onChangePwd}/>
            </div>
            
            <div className="nickname">
                <p>닉네임</p>
                <div style={{display: "flex"}}>
                    <input className="nicknameInput" placeholder="nickname" onChange={onChangeNickname}/>
                    <button className="dupeCheck">중복 확인</button>
                </div>
            </div>
            
            <div className="profileImg">
                <p>프로필 이미지</p>
                <div style={{display: "flex", justifyContent: "space-around"}}>
                    <img src="https://picsum.photos/id/16/200/300"/>
                    <img src="https://picsum.photos/id/17/200/300"/>
                    <img src="https://picsum.photos/id/29/200/300"/>
                </div>
            </div>
            
            <div className="gitLink">
                <p>Github 링크</p>
                <input className="gitLinkInput" placeholder="https://github.com" onChange={onChangeLink}/>
            </div>
            
            <div className="intro">
                <p>소개</p>
                <textarea rows={5} placeholder="자기 자신을 간단하게 소개해주세요." onChange={onChangeIntroduction}/>
            </div>

            <button className="joinBtn" onClick={Join}>회원 가입</button>

        </div>
    );
}

export default JoinInput;