import {fromPairs, replace} from "lodash";
import React, {useEffect, useState} from "react";
import {
  useParams,
  Routes,
  Route,
  Link,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import UserTweets from "../components/userTweets";
import {useAuth} from "../useAuth";
import TimeLine from "../components/timeline";
import ProfileTweet from "../components/profileTweet";
import ProfileLikes from "../components/profileLikes";
import {useMutation, useQuery} from "react-query";
import {
  AiFillMessage,
  AiFillSlackCircle,
  AiOutlineLoading,
  AiOutlineLoading3Quarters,
} from "react-icons/ai";
import {
  createChat,
  getFollowers,
  getFollowings,
  getProfile,
  useFollowMutation,
} from "../util/api";
import useSocketEvent from "../useSocketEvent";
import {queryClient} from "../AppProvider";
import {
  FaInternetExplorer,
  FaLocationArrow,
  FaTruckLoading,
} from "react-icons/fa";
import {BsChevronDoubleDown} from "react-icons/bs";
import {Button} from "../components/ProfilePreview";
import Header from "../components/Header";
import Model from "../components/model";
import Users from "../components/Users";
import ProfileEditing from "./ProfileEditing";

export default function Profile() {
  const params = useParams();
  const currUser = useAuth();
  const [searchParams] = useSearchParams();
  const {mutate} = useMutation("createChat", createChat);

  const navigate = useNavigate();
  const [profileEditing, setProfileEditing] = useState(
    searchParams.get("profile-editing")
  );
  const {data: user, isLoading, refetch, isError, error} = useQuery(
    ["getProfile", params.username],
    () => getProfile(params)
  );
  const [currModel, setCurrModel] = React.useState(undefined);

  const [showReactionInfo, setShowReactionInfo] = React.useState(false);

  const openUsers = (data) => {
    data = data.toString();
    setShowReactionInfo(true);
    setCurrModel(data);
  };
  const closeUsers = () => {
    setShowReactionInfo(false);
    setCurrModel(undefined);
  };

  const {
    bio,
    username,
    cover,
    location,
    birth,
    website,
    avatar,
    name,
    createdAt: join,
    followings,
    followers,
    isFollowing,
    _id,
  } = user || {};

  if (isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <AiOutlineLoading3Quarters className="animate-pulse animate-ping h-14 w-14"></AiOutlineLoading3Quarters>
      </div>
    );
  const isOwner = currUser.username === username;
  return (
    <>
      <Header title="profile" goBack={true}></Header>
      <div className="lg:p-3">
        <div className="h-[30vw] w-full md:h-[20vw] md:w-[60vw] ">
          <img className="w-full h-full" src={cover}></img>
        </div>

        <div className=" -mt-5">
          <div className="flex space-x-10 items-center">
            <div className="border-2 border-solid border-black rounded-full w-24 h-24 ">
              <img className="w-full h-full rounded-full " src={avatar}></img>
            </div>
            <span className="space-y-2 p-2 mt-5">
              <Button
                username={username}
                _id={_id}
                followingState={isFollowing}
              ></Button>
              {isOwner && (
                <button onClick={() => setProfileEditing(true)}>
                  edit profile
                </button>
              )}

              {!isOwner && (
                <AiFillMessage
                  className="h-6 w-6"
                  onClick={() => {
                    mutate([_id, currUser._id], {
                      onSuccess: ({data: {chatId}}) => {
                        navigate(
                          `/${currUser.username}/inbox?chatId=${chatId}`
                        );
                      },
                    });
                  }}
                ></AiFillMessage>
              )}
            </span>
          </div>

          <div>
            <div className="flex flex-col p-2 ">
              <span>@{username}</span>
              <span>{name}</span>
              <span>{bio}</span>
              <div className="text-xs flex space-x-2">
                {location && (
                  <span className="flex space-x-1 ">
                    <FaLocationArrow className="text-gray-300">
                      {" "}
                    </FaLocationArrow>
                    <span>{location}</span>
                  </span>
                )}
                {birth && (
                  <span className="flex space-x-1">
                    <BsChevronDoubleDown className="text-gray-300"></BsChevronDoubleDown>
                    <span> born at {birth}</span>
                  </span>
                )}
                {website && (
                  <span className="flex space-x-1">
                    <AiFillSlackCircle className="text-gray-200"></AiFillSlackCircle>
                    <span>{<a href={website}>{website.slice(0, 10)}</a>}</span>
                  </span>
                )}

                <span>
                  {" "}
                  <em>
                    Join since :{" "}
                    {new Date(join)
                      .toDateString()
                      .split(" ")
                      .slice(1)
                      .join(" ")}{" "}
                  </em>{" "}
                </span>
              </div>
              <span className="space-x-1">
                <span
                  className="text-xs p-2 cursor-pointer hover:text-dark-grey font-bold"
                  onClick={() => openUsers("followers")}
                >
                  {followers?.length} followers
                </span>
                <span
                  className="text-xs p-2 cursor-pointer hover:text-dark-grey font-bold"
                  onClick={() => openUsers("following")}
                >
                  {followings?.length} following
                </span>
              </span>
              <Model
                close={closeUsers}
                label="following"
                showDialog={showReactionInfo}
                style={{width: "25vw"}}
              >
                <Users
                  closeUsers={closeUsers}
                  apiCall={
                    currModel == "following" ? getFollowings : getFollowers
                  }
                  title={currModel}
                  _id={_id}
                ></Users>
              </Model>
            </div>
          </div>
        </div>
        <div className="w-full">
          {user && (
            <UserTweets>
              <Routes>
                <Route
                  path="/media"
                  element={
                    <ProfileTweet filterBy="media" username={username} />
                  }
                ></Route>

                <Route
                  path="/likes"
                  element={<ProfileLikes username={username} />}
                ></Route>
                <Route
                  index
                  element={<ProfileTweet username={username} />}
                ></Route>
              </Routes>
            </UserTweets>
          )}{" "}
        </div>
      </div>
      {profileEditing && (
        <Model close={() => setProfileEditing(false)} label="profile-editing">
          <ProfileEditing
            close={() => setProfileEditing(false)}
          ></ProfileEditing>
        </Model>
      )}
    </>
  );
}
