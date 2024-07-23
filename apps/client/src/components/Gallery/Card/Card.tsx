import { FC } from "react";
import { IPost } from "../../../types";
import { BsFillChatSquareHeartFill, BsFillHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./Card.css";
type TPostProps = {
  post: IPost;
};

const Card: FC<TPostProps> = ({ post }) => {
  console.log(post);
  const firstImageMatch = post.content.match(/<img[^>]+src="([^">]+)"/);
  const firstImageUrl = firstImageMatch ? firstImageMatch[1] : null;
  const contentWithoutImages = post.content.replace(/<img[^>]*>/g, "");
  console.log(post.likes);

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength
      ? text.substring(0, maxLength) + "..."
      : text;
  };

  return (
    <div className="Card">
      <Link to={`/posts/${post.articleId}`}>
        <div
          className="Image"
          style={{
            height: "150px",
            backgroundColor: firstImageUrl ? "transparent" : "#f0f0f0",
          }}
        >
          {firstImageUrl && (
            <img
              src={firstImageUrl}
              alt={post.title}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
          )}
        </div>
        <div className="p-4">
          <div className="mb-2">
            {/* 제목 */}
            <h3 className="text-xl font-bold">
              {truncateText(post.title, 37)}
            </h3>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            {/* 작성일 */}
            <span>
              {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                year: "2-digit",
                month: "2-digit",
                day: "2-digit",
              })}
            </span>
            {/* 좋아요 및 댓글수 */}
            <span className="flex items-center">
              <BsFillHeartFill className="mr-1" />
              {post.likes}
              <BsFillChatSquareHeartFill className="ml-3 mr-1" />
              {post.commentCount}
            </span>
          </div>
          {/* 본문 */}
          <p
            className="text-gray-700"
            dangerouslySetInnerHTML={{
              __html: truncateText(contentWithoutImages, 100).replace(
                /\n/g,
                "<br />"
              ),
            }}
          ></p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
