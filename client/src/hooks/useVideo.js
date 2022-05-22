import {useEffect, useRef, useState} from "react";

export default function useVideo() {
  const videoRef = useRef();
  const [isPlaying, setPlaying] = useState(false);
  const [isMuted, setMuted] = useState(true);
  const [progress, setProgress] = useState(0);

  const toggleMute = (e) => {
    e.stopPropagation();
    setMuted((prev) => !prev);
  };
  function togglePlay(event) {
    event.stopPropagation();
    if (isPlaying) {
      videoRef.current?.pause();
      setPlaying(false);
    } else {
      videoRef.current?.play();
      setPlaying(true);
      setMuted(false);
    }
  }

  useEffect(() => {
    const updateTime = (e) => {
      console.log("here");
      setProgress(Math.floor((e.target.currentTime / e.target.duration) * 100));
    };
    videoRef?.current?.addEventListener("timeupdate", updateTime);

    return () =>
      videoRef.current?.removeEventListener("timeupdate", updateTime);
  }, [videoRef.current]);

  return {
    videoRef,
    isPlaying,
    isMuted,
    setPlaying,
    togglePlay,
    toggleMute,
    progress,
    setProgress,
  };
}
