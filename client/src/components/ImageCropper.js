import {Field} from "formik";
import React, {useRef, useState} from "react";
import AvatarEditor from "react-avatar-editor";
import Button from "./shared/Button";

function ImageCropper(props) {
  const editor = useRef(null);
  const w = `w-[100px]`;
  const h = `h-[100px]`;

  return (
    <>
      <div className="relative ">
        <AvatarEditor
          ref={editor}
          image={props.imageToCrop}
          width={props.width}
          height={props.height}
          border={100}
          color={[0, 0, 0, 0.6]} // RGBA
          scale={1.2}
          rotate={0}
          disableBoundaryChecks
        ></AvatarEditor>
        {props.field == "avatar" ? (
          <div
            className={`pointer-events-none absolute top-[100px] left-[100px]  border-dark-grey border-2 border-solid w-[100px] h-[100px]`}
          ></div>
        ) : (
          <div
            className={`pointer-events-none absolute top-[100px] left-[100px]  border-dark-grey border-2 border-solid w-[300px] h-[100px]`}
          ></div>
        )}
        <Button
          className="p-1"
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
