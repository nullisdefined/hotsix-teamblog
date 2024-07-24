import React, { ChangeEvent, useState } from 'react';
import "./PwdInput.css";

const PwdInput = () => {

    const [pwd, setPwd] = useState("");

    const onChangePwd = (e: ChangeEvent<HTMLInputElement>) => {
        setPwd(e.target.value);
    }

    const Reset = () => {
        
    }

    return (
        <div className="EmailInput">
            <div className='text'>
                새로운 비밀번호를 입력해주세요.
            </div>
            <input className="email" placeholder="비밀번호" type='password' onChange={onChangePwd}/>
            <button className="emailCheckBtn" type="submit" onClick={Reset}>
                다음
            </button>
        </div>
    )
}

export default PwdInput;
