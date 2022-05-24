import React, {useState} from "react";
import {AiOutlineUpload} from "react-icons/ai";
import {CircularProgress} from "@mui/material";

import {uploadMedia} from "../upload";
import {postProfileInfo} from "../util/api";
import {useMutation} from "react-query";
import {useNavigate} from "react-router-dom";
import UserTweets from "../components/userTweets";
import {useAuth} from "../useAuth";

import ImageCropper from "../components/ImageCropper";
import Model from "../components/model";
import {queryClient} from "../AppProvider";
import Button from "../components/shared/Button";
export default function ProfileEditing({close}) {
  const user = useAuth();
  const [progress, setProgress] = useState(0);

  const [formData, setFormData] = useState({
    bio: user.bio,
    location: user.location,
    website: user.website,
    avatar: user.avatar,
    cover: user.cover,
  });
  const [isUpload, setIsUpload] = useState(false);
  const [imageToCrop, setImageToCrop] = useState();
  const [showDialog, setShowDialog] = useState(false);
  const [avatar, setAvatar] = useState(formData?.avatar);
  const [cover, setCover] = useState(formData?.cover);

  const [options, setOptions] = useState(false);

  const {mutate} = useMutation("postProfileInfo", postProfileInfo);
  const navigate = useNavigate();
  const allowedFileTypes = `image/gif image/png, image/jpeg, image/x-png`;

  const onMediaChange = async (event, field) => {
    if (event.target.files && event.target.files.length > 0) {
      const reader = new FileReader();

      reader.addEventListener("load", () => {
        const image = reader.result;

        setImageToCrop(image);
        setShowDialog(true);
        if (field == "cover") setOptions({field});
        else setOptions({field});
      });

      reader.readAsDataURL(event.target.files[0]);
    }
  };

  const uploadImage = async (file, field) => {
    setIsUpload(true);
    if (field == "avatar") setAvatar(file);
    else setCover(file);
    const res = await uploadMedia(
      {type: "image", preset: "twitter", file},
      setProgress
    );
    setIsUpload(false);
    const newFormData = {...formData};
    newFormData[field] = res;
    setFormData(newFormData);
  };

  const onChangeHandler = (e) => {
    const newFormData = {...formData};
    newFormData[e.target.id] = e.target.value;
    setFormData(newFormData);
  };

  function onSubmitHandler(e) {
    e.preventDefault();
    if (isUpload) return;
    mutate(formData, {
      onSuccess: async (data) => {
        await queryClient.refetchQueries(["getProfile", user.username]);
        navigate("/" + data.data.user.username);
        if (close) close();
      },
      onError: (e) => console.log(e),
    });
  }
  return (
    <>
      <form onSubmit={onSubmitHandler} className="space-y-4 ">
        <div className="flex flex-col space-x-2 text-xs">
          <div
            className={`flex flex-col  p-1  bg-background space-y-4 h-[30vw] w-full md:h-[20vw] md:w-[40vw]  bg-cover bg-no-repeat`}
            style={{
              backgroundImage: `url(${cover})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundBlendMode: "multiply",
            }}
          >
            <label
              htmlFor="cover"
              className=" flex flex-col justify-center items-center p-2  m-1 self-center opacity-50 "
            >
              {isUpload && options.field == "cover" ? (
                <CircularProgress variant="determinate" value={progress} />
              ) : (
                <>
                  <span>edit cover</span>
                  <AiOutlineUpload></AiOutlineUpload>
                </>
              )}
              <input
                onChange={(e) => onMediaChange(e, "cover")}
                type="file"
                id="cover"
                accept={allowedFileTypes}
                className="hidden"
              ></input>
            </label>

            <label
              htmlFor="avatar"
              className={`  p-2  mr-auto rounded-full w-[10vw] h-[10vw]   text-center`}
            >
              <div
                style={{
                  backgroundImage: `url(${avatar})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  backgroundBlendMode: "multiply",
                }}
                className="text-secondary flex flex-col justify-center items-center bg-background w-[7vw] h-[7vw] rounded-full  "
              >
                {isUpload && options.field == "avatar" ? (
                  <CircularProgress variant="determinate" value={progress} />
                ) : (
                  <>
                    <span>edit avatar</span>
                    <AiOutlineUpload></AiOutlineUpload>
                  </>
                )}
              </div>
              <input
                id="avatar"
                type="file"
                className="hidden"
                onChange={(e) => onMediaChange(e, "avatar")}
              ></input>
            </label>
          </div>
        </div>

        <div className="space-y-2   w-3/4 flex flex-col ">
          <label htmlFor="bio" className="flex space-x-10">
            <span>bio</span>
            <textarea
              value={formData.bio}
              onChange={onChangeHandler}
              id="bio"
              className={`p-1 outline-none  appearance-none resize-none  flex-1 
            border-b-2
            border-blue-300
            border-solid
            focus:border-blue-500 rounded-ls  `}
            />
          </label>
          <label htmlFor="website" className="flex justify-between">
            website
            <input
              id="website"
              value={formData.website}
              onChange={onChangeHandler}
              className={`p-1 m-1 outline-none 
            border-b-2
            border-blue-300
            border-solid
            focus:border-blue-500 rounded-ls  flex-1`}
            ></input>
          </label>
          <label htmlFor="location" className="flex justify-between">
            <span>location</span>
            <input
              onChange={onChangeHandler}
              value={formData.location}
              id="location"
              className={`p-1 m-1 outline-none 
            border-b-2

            border-blue-300
            border-solid
            focus:border-blue-500 rounded-ls flex-1`}
            ></input>
          </label>
          <Button
            type="submit"
            className="p-1  rounded-sm self-center text-sm"
            disabled={isUpload}
          >
            submit
          </Button>
        </div>
      </form>
      <Model
        label={"image"}
        showDialog={showDialog}
        close={() => setShowDialog(false)}
        back={true}
      >
        <ImageCropper
          close={() => setShowDialog(false)}
          {...options}
          imageToCrop={imageToCrop}
          onImageCropped={(img, field) => uploadImage(img, field)}
        ></ImageCropper>
      </Model>
    </>
  );
}
