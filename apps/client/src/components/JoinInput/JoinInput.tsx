import { useState } from "react";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";
import "./JoinInput.css";

const JoinInput = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [gitLink, setGitLink] = useState("");
  const [intro, setIntro] = useState("");
  const [error, setError] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [emailMessageColor, setEmailMessageColor] = useState("blue");
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameMessageColor, setNicknameMessageColor] = useState("blue");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordMessageColor, setPasswordMessageColor] = useState("red");

  const validatePassword = (password: string) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*\d{2,})(?!.*\s).{8,50}$/;
    return passwordRegex.test(password);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (validatePassword(newPassword)) {
      setPasswordMessage("사용할 수 있는 비밀번호입니다.");
      setPasswordMessageColor("blue");
    } else {
      setPasswordMessage(
        "비밀번호는 최소 8자 이상, 최대 50자 이하, 알파벳 소문자와 숫자 2개 이상을 포함해야 하며 공백이 없어야 합니다."
      );
      setPasswordMessageColor("red");
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError("");

    if (!email || !password || !nickname) {
      setError("이메일, 비밀번호, 닉네임은 필수 입력 항목입니다.");
      return;
    }

    const data = {
      email,
      password,
      nickname,
      profileImage: "https://storage.googleapis.com/hotsix-bucket/test.PNG",
      gitUrl: gitLink,
      introduce: intro,
    };
    const response = await axios.post("/auth/signup", data);
    console.log("SUCCESS", response.data);
    alert("회원가입 처리되었습니다.");
    navigate("/login");
  };

  const checkEmailDuplication = async () => {
    setEmailMessage("");
    if (!email) {
      setEmailMessage("이메일을 입력해주세요.");
      setEmailMessageColor("red");
      return;
    }

    try {
      const response = await axios.post("/users/check-email", { email });
      if (response.status === 200) {
        const { isDuplicate } = response.data;
        if (isDuplicate) {
          setEmailMessage("이미 사용 중인 이메일입니다.");
          setEmailMessageColor("red");
        } else {
          setEmailMessage("사용할 수 있는 이메일입니다.");
          setEmailMessageColor("blue");
        }
      }
    } catch (err: any) {
      if (err.response) {
        if (err.response.status === 400) {
          setEmailMessage(
            err.response.data.message[0] || "올바른 이메일 형식이 아닙니다."
          );
        } else if (err.response.status === 500) {
          setEmailMessage(
            "서버 오류가 발생했습니다. 나중에 다시 시도해주세요."
          );
        } else {
          setEmailMessage("이메일 중복 확인 중 오류가 발생했습니다.");
        }
      }
      setEmailMessageColor("red");
      console.log("ERR", err);
    }
  };

  const checkNicknameDuplication = async () => {
    setNicknameMessage("");
    const response = await axios.post("/users/check-nickname", { nickname });
    if (response.status === 200) {
      const { isDuplicate } = response.data;
      if (isDuplicate) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setNicknameMessageColor("red");
      } else {
        setNicknameMessage("사용할 수 있는 닉네임입니다.");
        setNicknameMessageColor("blue");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="JoinInput">
        <div className="email">
          <p>이메일</p>
          <div style={{ display: "flex" }}>
            <input
              className="emailInput"
              type="email"
              placeholder="email@hotsix.co.kr"
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              type="button"
              className="dupeCheck"
              onClick={checkEmailDuplication}
            >
              중복 확인
            </button>
          </div>
          {emailMessage && (
            <div className="message" style={{ color: emailMessageColor }}>
              {emailMessage}
            </div>
          )}{" "}
          {/* 이메일 중복 확인 메시지 표시 */}
        </div>
        <div className="pwd">
          <p>비밀번호</p>
          <input
            className="pwdInput"
            type="password"
            placeholder="8~50자리/영문 소문자, 숫자 2개 이상 조합"
            onChange={handlePasswordChange}
          />
          {passwordMessage && (
            <div className="message" style={{ color: passwordMessageColor }}>
              {passwordMessage}
            </div>
          )}
          {/* 비밀번호 유효성 메시지 표시 */}
        </div>
        <div className="nickname">
          <p>닉네임</p>
          <div style={{ display: "flex" }}>
            <input
              className="nicknameInput"
              onChange={(e) => setNickname(e.target.value)}
            />
            <button
              type="button"
              className="dupeCheck"
              onClick={checkNicknameDuplication}
            >
              중복 확인
            </button>
          </div>
          {nicknameMessage && (
            <div className="message" style={{ color: nicknameMessageColor }}>
              {nicknameMessage}
            </div>
          )}{" "}
          {/* 닉네임 중복 확인 메시지 표시 */}
        </div>
        <div className="profileImg">
          <p>프로필 이미지</p>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            <img src="https://picsum.photos/id/16/200/300" />
            <img src="https://picsum.photos/id/17/200/300" />
            <img src="https://picsum.photos/id/29/200/300" />
          </div>
        </div>
        <div className="gitLink">
          <p>Github 링크</p>
          <input
            className="gitLinkInput"
            onChange={(e) => setGitLink(e.target.value)}
          />
        </div>
        <div className="intro">
          <p>소개</p>
          <textarea rows={5} onChange={(e) => setIntro(e.target.value)} />
        </div>
        {error && <div className="error">{error}</div>}{" "}
        {/* 일반 오류 메시지 표시 */}
        <button className="joinBtn" type="submit">
          회원 가입
        </button>
      </div>
    </form>
  );
};

export default JoinInput;
