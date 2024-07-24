import React, { ChangeEvent, useState } from 'react';
import "./EmailInput.css";

const EmailInput = () => {

    const [email, setEmail] = useState("");

    const onChangeEmail = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }

    return (
        <div className="EmailInput">
            <div className='text'>
                비밀번호를 변경하고자 하는 이메일을 입력해주세요.
            </div>
            <input className="email" placeholder="이메일" onChange={onChangeEmail}/>
            <button className="emailCheckBtn" type="submit" >
                다음
            </button>
        </div>
    );
}

export default EmailInput;
