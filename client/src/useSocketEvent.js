import React, {useEffect} from "react";
import useSocket from "./socket";

export default function useSocketEvent(event, fn) {
  const socket = useSocket();
  useEffect(() => {
    socket?.on(event, fn);
    return () => socket?.offAny(event);
  }, [socket]);

  return socket;
}
