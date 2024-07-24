import React from "react";
import { Link } from "react-router-dom";
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
        <Link key={post.articleId} to={`/posts/${post.articleId}`}>
          <Card key={post.articleId} post={post} />
        </Link>
      ))}
    </div>
  );
};

export default Gallery;
