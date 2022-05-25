import React, {useEffect, useState} from "react";
import useVideo from "../hooks/useVideo";
import {BsMicMute, BsPauseCircle, BsSoundwave} from "react-icons/bs";
import {FaPlayCircle} from "react-icons/fa";
import {LinearProgress} from "@mui/material";
import {vi} from "date-fns/locale";
import {useMediaQuery} from "react-responsive";

export default function Video({url}) {
  const {
    videoRef,
    isPlaying,
    isMuted,
    togglePlay,
    toggleMute,
    setPlaying,
    progress,
  } = useVideo();

  const isPortrait = useMediaQuery({query: "(orientation: portrait)"});

  useEffect(() => {
    const options = {
      rootMargin: "0px",
      threshold: [0.8, 1],
    };

    function playVideo(entries) {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          videoRef.current?.play();
          setPlaying(true);
        } else {
          videoRef.current?.pause();
          setPlaying(false);
        }
      });
    }
    const observer = new IntersectionObserver(playVideo, options);
    observer.observe(videoRef.current);

    return () => {
      observer.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const setTime = (e) => {
    e.stopPropagation();
    const currWidth = Math.floor(
      e.clientX - e.target.getBoundingClientRect().left
    );
    videoRef.current.currentTime =
      (currWidth / e.target.getBoundingClientRect().width).toFixed(4) *
      videoRef.current.duration;
  };

  return (
    <div
      className={`relative  border border-secondary flex-col overflow-hidden ${
        isPortrait ? " h-[30vh]" : "h-[50vh]"
      } w-9/12 rounded-lg `}
    >
      <video
        onDoubleClick={(e) => e.target.requestFullscreen()}
        ref={videoRef}
        src={url}
        playsInline
        loop
        muted={isMuted}
        className={"w-full h-full"}
      ></video>
      <div className="absolute w-full bottom-0  space-x-2 flex items-baseline justify-center bg-opacity-50 bg-red-400 p-4">
        <MuteButton toggleMute={toggleMute} isMuted={isMuted} />
        <PauseButton isPlaying={isPlaying} togglePlay={togglePlay} />
        <div className="relative w-[20rem] h-3 p-3 " onClick={setTime}>
          <LinearProgress
            variant="determinate"
            value={progress}
            size="large"
            className="w-full "
          ></LinearProgress>
        </div>
      </div>
    </div>
  );
}

function PauseButton({isPlaying, togglePlay}) {
  return (
    <button className="pause-button" onClick={togglePlay}>
      {!isPlaying ? <FaPlayCircle /> : <BsPauseCircle />}
    </button>
  );
}

function MuteButton({isMuted, toggleMute}) {
  return (
    <button onClick={toggleMute} className="mute-button">
      <div className="mute-button-inner">
        {isMuted ? <BsMicMute /> : <BsSoundwave />}
      </div>
    </button>
  );
}
