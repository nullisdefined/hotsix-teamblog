import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import userAPI from "../../services/users";
import Button from "../Button/Button";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const EditProfile: React.FC = () => {
  const [nickname, setNickname] = useState("");
  const [gitUrl, setGitUrl] = useState("");
  const [introduce, setIntroduce] = useState("");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await userAPI.getCurrentUser();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await userAPI.updateUser({
        nickname,
        gitUrl,
        introduce,
        profileImage:
          profileImage ||
          "https://storage.googleapis.com/hotsix-bucket/1721775303458-default_profile.png",
      });
      navigate("/mypage");
    } catch (err) {
      console.error("Failed to update user:", err);
      setError("프로필 업데이트에 실패했습니다.");
    } finally {
      setLoading(false);
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
        {/* 기존 입력 필드들 */}
        <div className="mb-4">
          <label htmlFor="nickname" className="block text-sm font-bold mb-2">
            닉네임:
          </label>
          <input
            id="nickname"
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
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
        <div className="flex items-center justify-between">
          <Button text="프로필 업데이트" type="PRIMARY" buttonType="submit" />
          <Button
            text="취소"
            type="SECONDARY"
            onClick={() => navigate("/mypage")}
          />
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
