import { FC } from "react";
import Card from "./Card/Card";
import { IPost } from "../../types";
import "./Gallery.css";

type TGalleryProps = {
  posts: IPost[];
};

const Gallery: FC<TGalleryProps> = ({ posts }) => {
  return (
    <div className="Gallery">
      {posts.map((post) => (
        <Card key={post.articleId} post={post}></Card>
      ))}
    </div>
  );
};

export default Gallery;
