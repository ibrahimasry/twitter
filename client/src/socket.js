import {io} from "socket.io-client";
import {useEffect, useState} from "react";
import {useAuth} from "./useAuth";
import {debounce} from "lodash";

function useSocket(params) {
  const URL = "http://localhost:8080";
  const [socket, setSocket] = useState(null);
  const user = useAuth();

  useEffect(() => {
    const newSocket = io(URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);
  if (user && socket) {
    socket.auth = {};
    socket.auth._id = user._id?.toString();
    socket.auth.username = user.username?.toString();

    socket.onAny(
      debounce((event, ...args) => {
        if (event === "messaga") console.log(event, args);
      })
    );
  }

  return socket;
}
export default useSocket;
