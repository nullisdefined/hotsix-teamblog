import React from "react";
import Card from "./Card/Card";
import { IPost } from "../../types";
import "./Gallery.css";

interface GalleryProps {
  posts: IPost[];
}

const Gallery: React.FC<GalleryProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return <div>No posts available</div>;
  }

  return (
    <div className="Gallery">
      {posts.map((post) => (
        <Card key={post.articleId} post={post} />
      ))}
    </div>
  );
};

export default Gallery;
