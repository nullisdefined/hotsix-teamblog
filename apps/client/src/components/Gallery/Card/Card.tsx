import { FC } from "react";
import { IPost } from "../../../types";
import { BsFillChatSquareHeartFill } from "react-icons/bs";
import { Link } from "react-router-dom";
import "./Card.css";
type TPostProps = {
  post: IPost;
};

const Card: FC<TPostProps> = ({ post }) => {
  return (
    <div className="Card">
      <Link to={`/posts/${post.articleId}`}>
        <div className="Image">
          <img src={post.thumb} alt={post.title} />
          <p className="Likes">
            <BsFillChatSquareHeartFill />
            <span>00</span>
          </p>
        </div>
        <div className="Text">
          <div className="Title">
            <h3>{post.title}</h3>
            <span>{post.createdAt}</span>
          </div>
          <p className="Description">{post.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default Card;
