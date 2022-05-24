import {useMutation, useQueryClient} from "react-query";
import tw from "tailwind-styled-components";
import Suggest from "../components/suggest";
import {logoutRequest} from "../util/api";
import {AiOutlineLogout} from "react-icons/ai";
import {Link, useNavigate, useSearchParams} from "react-router-dom";
import {useAuth} from "../useAuth";
import useSocketEvent from "../useSocketEvent";
import {Children, useState} from "react";
import {BsTwitter} from "react-icons/bs";
import Trends from "../components/Trends";
import {HomeIcon, InboxIcon, NotificationsIcon, ProfileIcon} from "../icons";
import {MainLink} from "../components/navLink";
export default function Layout({children}) {
  const user = useAuth();
  const {username, refetch, notifications} = user;
  const {mutate} = useMutation("logout", logoutRequest);
  const [currNotifications, setCurrNotifications] = useState(notifications);
  const [currMesseges, setCurrMessages] = useState(0);
  const [searchParams] = useSearchParams();
  const queryClient = useQueryClient();
  useSocketEvent("newNoftication", () =>
    setCurrNotifications((prev) => prev + 1)
  );


  useSocketEvent("message", async (data) => {
    setCurrMessages((prev) => prev + 1);
    await queryClient.refetchQueries("getChat");
    await queryClient.refetchQueries("getChats");
  });

  useSocketEvent("follow", async () => {
    await queryClient.invalidateQueries(["getProfile", username]);
    setCurrNotifications((prev) => prev + 1);
  });

  const handleNotificationsClick = () => {
    setCurrNotifications(0);
  };
  const handleMessagesClick = () => {
    setCurrMessages(0);
  };
  const Counter = tw.span`absolute w-6 h-6 -top-1  -right-1 text-neutral font-extrabold flex items-center justify-center bottom-2 p-1 rounded-full text-xs bg-secondary`;
  return (
    <>
      <div className="grid grid-cols-12  sm:gap-4  min-h-screen  md:p-4 ">
        <header className="md:h-screen border-t-[1px] md:border-t-[0px] md:w-32 fixed z-50 bottom-0 w-full   md:px-8 flex  md:flex-col justify-around items-center p-2 md:items-center md:text-3xl md:border-r-[1px] md:border-solid md:border-r-secondary  text-xl  bg-background ">
          <span className="hidden md:block">
            <BsTwitter></BsTwitter>
          </span>

          <MainLink to="/">
            <HomeIcon classes={"w-8 h-8 md:w-12 md:h-12"}></HomeIcon>
          </MainLink>
          <MainLink end to={`${username}`}>
            <ProfileIcon classes={"w-8 h-8 md:w-12 md:h-12"}></ProfileIcon>
          </MainLink>

          <MainLink to={`/${username}/notifications`}>
            <span className="relative " onClick={handleNotificationsClick}>
              <NotificationsIcon
                classes={"w-8 h-8 md:w-12 md:h-12"}
              ></NotificationsIcon>
              {currNotifications > 0 && (
                <Counter className="absolute left-3/4 w-6 h-6 -top-1  -right-1 text-neutral font-extrabold flex items-center justify-center bottom-2 p-1 rounded-full text-xs bg-secondary">
                  {currNotifications}
                </Counter>
              )}
            </span>
          </MainLink>
          <MainLink to={`/${username}/inbox`}>
            <span className="relative" onClick={handleMessagesClick}>
              <InboxIcon classes="w-8 h-8 md:w-12 md:h-12"></InboxIcon>
              {currMesseges > 0 && (
                <Counter>
                  <span>{currMesseges}</span>
                </Counter>
              )}
            </span>
          </MainLink>
          {/* <MainLink to="/setting">
            <AiFillSetting></AiFillSetting>
          </MainLink> */}
          <AiOutlineLogout onClick={mutate}></AiOutlineLogout>
        </header>
        <div className="col-span-12  md:ml-[9rem]   md:p-2">{children}</div>
      </div>
    </>
  );
}
