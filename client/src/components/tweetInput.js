import {useState, useRef, useEffect, useMemo} from "react";
import Picker from "emoji-picker-react";
import {convertToRaw, Editor, EditorState} from "draft-js";
import {BsEmojiSmileFill} from "react-icons/bs";
import TweetButton from "./shared/Button";
import Post from "./post";
import {useMutation, useQuery, useQueryClient} from "react-query";
import {postReplyRequest, postTweet, postQuoteRequest} from "../util/api";
import compositeDecorator from "./editorStragies";
import {getMentions} from "../util/helper";
import {useAuth} from "../useAuth";
import {AiFillDelete, AiFillPicture} from "react-icons/ai";
import {CircularProgress, circularProgressClasses} from "@mui/material";
import {uploadMedia} from "../upload";
import {socket} from "../authApp";
import ShowMedia from "./ShowMedia";

export default function TweetInput({
  tweet,
  isReply,
  isQuote,
  close = () => {},
}) {
  let [value, setValue] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty(compositeDecorator)
  );
  const [toSubmit, setToSubmit] = useState(true);
  const [count, setCount] = useState(0);

  const [chosenEmoji, setChosenEmoji] = useState(null);
  const [showPicker, setShowPicker] = useState(false);
  const [media, setMedia] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [placeHolder, setPlaceHolder] = useState(
    !isReply ? "what's happening?" : "add reply"
  );
  const {mutate: postTweetMutation} = useMutation("postTweet", postTweet);
  const {mutate: postReplyMutation} = useMutation(
    "postReplyRequest",
    postReplyRequest
  );
  const {mutate: postQuoteMutation} = useMutation(
    "postQuote",
    postQuoteRequest
  );
  const user = useAuth();
  const ref = useRef();

  const onEmojiClick = (event, emojiObject) => {
    setChosenEmoji(emojiObject);
    setValue(value + emojiObject.emoji);
    setShowPicker(false);
  };
  const refPicker = useClickOutPicker(
    () => showPicker && setShowPicker(() => false)
  );
  //useEffect(() => ref.current?.focus(), [toSubmit]);
  const handlerOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (toSubmit === true) return;
    let text = editorState.getCurrentContent().getPlainText();
    const mentions = getMentions(text);
    let value = {text, media};
    setMedia(undefined);
    let content = "";
    setCount(0);
    if (isQuote) {
      postQuoteMutation(
        {...value, tweetId: tweet._id},
        {
          onSuccess: () => {
            content = `${user.username} mention you in a quote tweet`;
            setEditorState(EditorState.createEmpty(compositeDecorator));
            socket.emit("quoteTweet", {to: tweet.owner._id});
            close();
          },
        }
      );
    } else if (isReply)
      postReplyMutation(
        {...value, tweetId: tweet._id},
        {
          onSuccess: () => {
            setEditorState(EditorState.createEmpty(compositeDecorator));
            content = `${user.username} mention you in a reply`;
          },
        }
      );
    else
      postTweetMutation(
        {value},
        {
          onSuccess: ({data: {tweet, user}}) => {
            content = `${user.username} mention you in a tweet`;
            socket.emit("newTweet", {to: user.followers});

            setEditorState(EditorState.createEmpty(compositeDecorator));
          },
        }
      );

    if (mentions.length) {
      socket.emit("notify", {from: user._id, to: mentions, content});
    }
  };
  const handleImgUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    setIsUploading(true);
    setMedia(undefined);
    const type = file?.type.split("/")[0];
    const res = await uploadMedia({type, preset: "twitter", file}, setProgress);
    setIsUploading(false);
    setMedia(res);
  };

  const onChangeHandler = (e) => {
    let text = editorState
      .getCurrentContent()
      .getPlainText()
      .trim();
    console.log();
    setCount(text.length);
    setEditorState(e);
  };
  useEffect(() => {
    if (
      count > 100 ||
      (count == 1 && editorState.getLastChangeType() !== "insert-characters")
    ) {
      setToSubmit(true);
    } else if (isUploading) setToSubmit(true);
    else setToSubmit(false);
  }, [editorState, count, isUploading]);
  return (
    <div
      ref={refPicker}
      className="px-2 grow  border-b-2 border-solid border-secondary"
    >
      <div
        onClick={() => setPlaceHolder("")}
        onFocus={() => setPlaceHolder("")}
        className="border-[.5px] border-solid border-secondary rounded-lg"
      >
        <Editor
          editorState={editorState}
          placeholder={placeHolder}
          onChange={onChangeHandler}
          ref={ref}
          className="resize-none  h-24"
        ></Editor>
      </div>
      {media && (
        <div className="relative w-6/12 h-6/12 bg-slate-500 p-1">
          {ShowMedia({url: media})}
        </div>
      )}
      <div className="flex space-x-3 px-100  py-3 relative items-center text-2xl">
        {/* <BsEmojiSmileFill
          className=""
          onClick={() => setShowPicker(true)}
        ></BsEmojiSmileFill> */}
        {showPicker && (
          <div className="w-1/6  absolute top-0 z-20">
            <Picker onEmojiClick={onEmojiClick}></Picker>
          </div>
        )}
        {!isUploading ? (
          <label htmlFor="media">
            <input
              type="file"
              accept="video/mp4 ,image/*"
              hidden
              id="media"
              onChange={handleImgUpload}
              multiple
            ></input>
            <AiFillPicture></AiFillPicture>
          </label>
        ) : (
          <CircularProgress
            variant="determinate"
            value={progress}
          ></CircularProgress>
        )}
        <span>{count > 100 && 100 - count}</span>
        <span>
          {count < 100 && count > 0 && (
            <CircularProgress
              variant="determinate"
              value={Math.floor((count / 100) * 100)}
            ></CircularProgress>
          )}
          {count > 100 && (
            <CircularProgress
              variant="determinate"
              value={100}
            ></CircularProgress>
          )}
        </span>
        <TweetButton
          className="!ml-auto "
          type="submit"
          disabled={toSubmit}
          onClick={handlerOnClick}
        >
          <span>
            {isReply ? "Reply" : "Tweet"} {toSubmit}
          </span>
        </TweetButton>
      </div>
      {isQuote && <Post tweet={tweet}></Post>}
    </div>
  );
}

const useClickOutPicker = (cb) => {
  const ref = useRef(null);
  useEffect(() => {
    const clickOut = (e) => {
      if (!ref.current.contains(e.target)) {
        cb(e);
      }
    };
    window.addEventListener("click", clickOut);
    return () => {
      window.removeEventListener("click", clickOut);
    };
  }, [cb]);
  return ref;
};
