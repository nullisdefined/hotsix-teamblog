import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import userAPI from "../../services/users";
import Button from "../Button/Button";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const PasswordReset: React.FC = () => {
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [isEmailDisabled, setIsEmailDisabled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    if (location.state && location.state.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleSendVerificationCode = async () => {
    try {
      await userAPI.requestPasswordReset(email);
      setIsEmailSent(true);
      setIsEmailDisabled(true);
      setError(null);
      alert("인증 코드가 이메일로 전송되었습니다.");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("인증 코드 전송에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
      setIsEmailSent(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("새 비밀번호와 확인 비밀번호가 일치하지 않습니다.");
      return;
    }
    try {
      await userAPI.resetPassword(email, verificationCode, newPassword);
      setError(null);
      alert("비밀번호가 성공적으로 변경되었습니다.");
      navigate("/login");
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("비밀번호 변경에 실패했습니다. 잠시 후 다시 시도해주세요.");
      }
    }
  };

  return (
    <div
      className="container mx-auto px-4 py-8"
      style={{ maxWidth: "900px", margin: "0 auto" }}
    >
      <h1 className="text-3xl font-bold mb-6 mt-20">비밀번호 재설정</h1>
      <form onSubmit={handlePasswordReset} className="bg-white rounded-lg">
        <div className="mb-10 flex">
          <label htmlFor="email" className="block text-lg w-1/6 font-bold mb-2">
            이메일:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
            disabled={isEmailDisabled}
            style={{
              border: "1px solid rgba(0,0,0,0.5)",
              fontSize: "1.2em",
            }}
          />
        </div>
        <Button
          text="인증 코드 전송"
          type="SECONDARY"
          onClick={handleSendVerificationCode}
        />
        {isEmailSent && (
          <>
            <div className="mb-4 mt-10 flex">
              <label
                htmlFor="verificationCode"
                className="block text-lg w-1/6 font-bold mb-2"
              >
                인증 코드
              </label>
              <input
                id="verificationCode"
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                style={{
                  border: "1px solid rgba(0,0,0,0.5)",
                  fontSize: "1.2em",
                }}
              />
            </div>
            <div className="mb-10 flex">
              <label
                htmlFor="newPassword"
                className="block text-lg w-1/6 font-bold mb-2"
              >
                새 비밀번호
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                style={{
                  border: "1px solid rgba(0,0,0,0.5)",
                  fontSize: "1.2em",
                }}
              />
            </div>
            <div className="mb-10 flex">
              <label
                htmlFor="confirmPassword"
                className="block text-lg w-1/6 font-bold mb-2"
              >
                새 비밀번호 확인
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="shadow appearance-none border rounded w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                required
                style={{
                  border: "1px solid rgba(0,0,0,0.5)",
                  fontSize: "1.2em",
                }}
              />
            </div>
            <Button text="비밀번호 변경" type="PRIMARY" buttonType="submit" />
          </>
        )}
      </form>
      {error && <ErrorMessage message={error} />}
    </div>
  );
};

export default PasswordReset;
