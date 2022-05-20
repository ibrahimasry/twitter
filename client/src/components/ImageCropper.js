import {Slider} from "@mui/material";
import {Field} from "formik";
import React, {useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import Button from "./shared/Button";

function ImageCropper(props) {
  const editor = useRef(null);
  const w = `w-[100px]`;
  const h = `h-[100px]`;
  const [progress, setProgress] = useState(1);

  return (
    <>
      <div className="relative space-y-4 ">
        <AvatarEditor
          ref={editor}
          image={props.imageToCrop}
          width={props.width}
          height={props.height}
          border={100}
          color={[0, 0, 0, 0.6]} // RGBA
          scale={progress}
          rotate={0}
          disableBoundaryChecks
        ></AvatarEditor>
        {props.field == "avatar" ? (
          <div
            className={`pointer-events-none absolute top-[85px] left-[100px]  border-dark-grey border-2 border-solid w-[100px] h-[100px]`}
          ></div>
        ) : (
          <div
            className={`pointer-events-none absolute top-[85px] left-[100px]  border-dark-grey border-2 border-solid w-[300px] h-[100px]`}
          ></div>
        )}
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
