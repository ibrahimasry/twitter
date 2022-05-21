import {Slider} from "@mui/material";
import React, {useRef, useState} from "react";
import {useMediaQuery} from "react-responsive";
import AvatarEditor from "react-avatar-editor";
import Button from "./shared/Button";
function ImageCropper(props) {
  const editor = useRef(null);
  const [progress, setProgress] = useState(1);
  const isDesktop = useMediaQuery({
    query: "(min-width: 1000px)",
  });

  const style =
    props.field === "avatar"
      ? {width: "12rem", height: "12rem", position: "relative"}
      : {
          width: isDesktop ? "40vw" : "70vw",
          height: isDesktop ? "15vw" : "30vw",
          position: "relative",
        };
  return (
    <>
      <div className=" space-y-4 flex flex-col items-center overflow-auto">
        <AvatarEditor
          ref={editor}
          image={props.imageToCrop}
          style={style}
          border={25}
          color={[0, 0, 0, 0.6]} // RGBA
          scale={progress}
          rotate={0}
          disableBoundaryChecks
        ></AvatarEditor>
        <Slider
          size="small"
          defaultValue={70}
          aria-label="Small"
          valueLabelDisplay="auto"
          onChange={(e) => setProgress(1 + e.target.value / 100)}
        />

        <Button
          className="p-1 rounded-sm "
          onClick={() => {
            if (editor) {
              const file = editor.current.getImage().toDataURL();
              props.onImageCropped(file, props.field);
              props.close();
            }
          }}
        >
          Crop
        </Button>
      </div>
    </>
  );
}

export default ImageCropper;
