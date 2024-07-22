import { useEffect } from "react";
import Profile from "../components/Profile/Profile";
import Gallery from "../components/Gallery/Gallery";
import postAPI from "../services/post";

function Main() {
  useEffect(() => {
    const postArticle = async () => {
      try {
        const response = await postAPI.getArticles();
        console.log("SUCCESS", response);
      } catch (err) {
        console.log("ERR", err.response.data);
      }
    };

    postArticle();
  }, []);

  const posts = [
    {
      id: 1,
      nickname: "userName1",
      thumb: "https://picsum.photos/id/88/300/250",
      title: "First Post",
      description: "Content of the first post",
      createdAt: "2024-06-28T12:34:56.789Z",
      updatedAt: "2024-06-28T12:34:56.789Z",
      status: true,
    },
    {
      id: 2,
      nickname: "userName2",
      thumb: "https://picsum.photos/id/192/300/250",
      title: "Second Post",
      description: "Content of the second post",
      createdAt: "2024-06-28T12:34:56.789Z",
      updatedAt: "2024-06-28T12:34:56.789Z",
      status: true,
    },
  ];
  return (
    <div className="Container">
      <Profile
        nickname="김유저"
        description="개발자입니다."
        email="user@gmail.com"
        gitUrl="https://www.github.com/user"
      ></Profile>
      <Gallery posts={posts}></Gallery>
    </div>
  );
}

export default Main;
