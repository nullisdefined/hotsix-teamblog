import "./JoinInput.css";

const JoinInput = () => {
  return (
    <div className="JoinInput">
      <div className="email">
        <p>이메일</p>
        <div style={{ display: "flex" }}>
          <input
            className="emailInput"
            type="email"
            placeholder="email@hotsix.co.kr"
          />
          <button className="dupeCheck">중복 확인</button>
        </div>
      </div>

      <div className="pwd">
        <p>비밀번호</p>
        <input
          className="pwdInput"
          type="password"
          placeholder="8~16자리/영문 대소문자, 숫자, 특수문자 조합"
        />
      </div>

      <div className="nickname">
        <p>닉네임</p>
        <div style={{ display: "flex" }}>
          <input className="nicknameInput" />
          <button className="dupeCheck">중복 확인</button>
        </div>
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
        <input className="gitLinkInput" />
      </div>

      <div className="intro">
        <p>소개</p>
        <textarea rows={5} />
      </div>

      <button className="joinBtn">회원 가입</button>
    </div>
  );
};

export default JoinInput;
