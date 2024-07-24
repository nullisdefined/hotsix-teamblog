import { FC } from "react";
import {
  BsEmojiWinkFill,
  BsGithub,
  BsEnvelopeAtFill,
  BsBoxArrowRight,
} from "react-icons/bs";
import "./Profile.css";

export const DEFAULT_PROFILE_IMAGE =
  "https://storage.googleapis.com/hotsix-bucket/1721775303458-default_profile.png";

type TProfileProps = {
  nickname: string;
  description: string;
  email: string;
  img?: string;
  gitUrl?: string;
  onLogout: () => void;
};

const Profile: FC<TProfileProps> = ({
  nickname,
  description,
  email,
  img,
  gitUrl,
}) => {
  return (
    <div className="Profile">
      <div className="Title">
        <div className="Thumb">
          <img src={img || DEFAULT_PROFILE_IMAGE} alt={nickname} />
        </div>
        <div className="Text">
          <h2>{nickname}</h2>
          <p>{description}</p>
        </div>
      </div>
      <div className="Icons" style={{ display: "flex", gap: "0px" }}>
        <a href={`mailto:${email}`} className="icon-hover">
          <BsEnvelopeAtFill size="40" />
        </a>
        {gitUrl && (
          <a href={gitUrl} className="icon-hover">
            <BsGithub size="40" />
          </a>
        )}
      </div>
    </div>
  );
};

export default Profile;
