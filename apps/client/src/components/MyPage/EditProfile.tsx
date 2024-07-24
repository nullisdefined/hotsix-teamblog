import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/users";
import Button from "../Button/Button";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import axios from "../../config/axios";

const EditProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [gitUrl, setGitUrl] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nicknameMessage, setNicknameMessage] = useState("");
  const [nicknameMessageColor, setNicknameMessageColor] = useState("blue");
  const [isNicknameChecked, setIsNicknameChecked] = useState(true);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userAPI.getCurrentUser();
        setUser(userData.data);
        setEmail(userData.data.email);
        setNickname(userData.data.nickname);
        setGitUrl(userData.data.gitUrl || "");
        setIntroduce(userData.data.introduce || "");
        setPreviewUrl(userData.data.profileImage || null);
      } catch (err) {
        console.error("Failed to fetch user data:", err);
        setError("사용자 정보를 불러오는데 실패했습니다.");
      }
    };

    fetchUserData();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));

      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        if (response.status === 201) {
          setPreviewUrl(response.data.url);
        }
      } catch (err: any) {
        console.error("Image upload failed", err);
        setError(
          err.response?.data?.message || "이미지 업로드에 실패했습니다."
        );
      }
    }
  };

  const checkNicknameDuplication = async () => {
    setNicknameMessage("");
    if (!nickname) {
      setNicknameMessage("닉네임을 입력해주세요.");
      setNicknameMessageColor("red");
      setIsNicknameChecked(false);
      return;
    }

    try {
      const response = await userAPI.checkNickname(nickname);
      if (response.data.isDuplicate) {
        setNicknameMessage("이미 사용 중인 닉네임입니다.");
        setNicknameMessageColor("red");
        setIsNicknameChecked(false);
      } else {
        setNicknameMessage("사용할 수 있는 닉네임입니다.");
        setNicknameMessageColor("blue");
        setIsNicknameChecked(true);
      }
    } catch (err: any) {
      console.error("Nickname check failed", err);
      setNicknameMessage("닉네임 중복 확인 중 오류가 발생했습니다.");
      setNicknameMessageColor("red");
      setIsNicknameChecked(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isNicknameChecked) {
      alert("닉네임 중복 확인을 해주세요.");
      return;
    }
    setLoading(true);
    setError(null);

    const userData = {
      nickname,
      gitUrl,
      introduce,
      profileImage:
        previewUrl ||
        "https://storage.googleapis.com/hotsix-bucket/1721775303458-default_profile.png",
    };

    try {
      await userAPI.updateUser(userData);
      navigate("/mypage");
    } catch (err: any) {
      console.error("Failed to update user:", err);
      setError(
        err.response?.data?.message || "프로필 업데이트에 실패했습니다."
      );
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordResetRequest = async () => {
    try {
      await userAPI.requestPasswordReset(email);
      setShowPasswordReset(true);
    } catch (err) {
      setError("비밀번호 재설정 요청에 실패했습니다.");
    }
  };

  const handlePasswordReset = async () => {
    try {
      await userAPI.resetPassword(email, verificationCode, newPassword);
      setShowPasswordReset(false);
      alert("비밀번호가 성공적으로 변경되었습니다.");
    } catch (err) {
      setError("비밀번호 변경에 실패했습니다.");
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말로 계정을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        await userAPI.deleteAccount();
        localStorage.removeItem("token");
        navigate("/login");
      } catch (err) {
        setError("계정 삭제에 실패했습니다.");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">프로필 수정</h1>
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">프로필 사진:</label>
          <div className="flex items-center">
            <img
              src={previewUrl || "/default-profile.png"}
              alt="Profile"
              className="w-20 h-20 rounded-full mr-4 object-cover"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              ref={fileInputRef}
              className="hidden"
            />
            <Button
              text="사진 변경"
              type="SECONDARY"
              onClick={() => fileInputRef.current?.click()}
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-bold mb-2">
            이메일:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            readOnly
          />
        </div>
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-bold mb-2">
            닉네임:
          </label>
          <div className="flex items-center space-x-2">
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => {
                setNickname(e.target.value);
                setIsNicknameChecked(false);
              }}
              className="shadow appearance-none border rounded w-11/12 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
            <Button
              text="중복 확인"
              type="SECONDARY"
              onClick={checkNicknameDuplication}
            />
          </div>
          {nicknameMessage && (
            <p className="text-sm mt-1" style={{ color: nicknameMessageColor }}>
              {nicknameMessage}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="gitUrl" className="block text-sm font-bold mb-2">
            GitHub URL:
          </label>
          <input
            id="gitUrl"
            type="url"
            value={gitUrl}
            onChange={(e) => setGitUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="introduce" className="block text-sm font-bold mb-2">
            소개:
          </label>
          <textarea
            id="introduce"
            value={introduce}
            onChange={(e) => setIntroduce(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows={4}
          />
        </div>
        <div className="flex items-center justify-between mb-4">
          <Button
            text="비밀번호 변경하기"
            type="SECONDARY"
            onClick={handlePasswordResetRequest}
          />
          <Button text="프로필 업데이트" type="PRIMARY" buttonType="submit" />
        </div>
      </form>

      {showPasswordReset && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">비밀번호 변경</h2>
          <div className="mb-4">
            <label
              htmlFor="verificationCode"
              className="block text-sm font-bold mb-2"
            >
              인증 코드:
            </label>
            <input
              id="verificationCode"
              type="text"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="newPassword"
              className="block text-sm font-bold mb-2"
            >
              새 비밀번호:
            </label>
            <input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              required
            />
          </div>
          <Button
            text="비밀번호 변경"
            type="PRIMARY"
            onClick={handlePasswordReset}
          />
        </div>
      )}

      <div className="mt-6">
        <Button text="회원 탈퇴" type="DANGER" onClick={handleDeleteAccount} />
      </div>
    </div>
  );
};

export default EditProfile;
