import React, { useEffect } from "react";

export default function useObserver(setValue, cb) {
  const [pointer, setPointer] = React.useState(5);

  const observer = React.useRef(
    new IntersectionObserver((entries) => {
      const first = entries[0];
      if (first.isIntersecting) {
        setPointer((no) => no + 5);
      }
    })
  );

  useEffect(() => {
    cb();
  }, pointer);

  return [observer, pointer];
}
