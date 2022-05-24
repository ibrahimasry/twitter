import {useRef} from "react";
import Popover, {positionDefault} from "@reach/popover";
import useClickOut from "../../hooks/useClickOut";

export default function DeleteTweetRepresenter(props) {
  const refDelete = useRef();
  const {
    showDelete,
    setShowDelete,
    isLoading,
    showDeleteBotton,
    deleteTweetHanlder,
  } = props;
  const ref = useClickOut((e) => {
    e.stopPropagation();
    setShowDelete(false);
  });
  return (
    <div
      ref={ref}
      className="!ml-auto cursor-pointer"
      onClick={showDeleteBotton}
    >
      <span ref={refDelete}>&#xFE19;</span>

      {showDelete && (
        <Popover
          className="relative z-50"
          targetRef={refDelete}
          position={positionDefault}
        >
          <button
            disabled={isLoading}
            className="text-lg w-18 h-18 text-red-200 p-8 py-4  shadow-lg bg-background rounded-sm  border-secondary disabled:cursor-default"
            onClick={deleteTweetHanlder}
          >
            {isLoading ? "Deleting.." : "Delete"}
          </button>
        </Popover>
      )}
    </div>
  );
}
