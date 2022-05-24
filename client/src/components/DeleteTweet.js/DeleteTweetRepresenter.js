import {useRef} from "react";
import OnOutsiceClick from "react-outclick";
import Popover, {positionDefault} from "@reach/popover";

export default function DeleteTweetRepresenter(props) {
  const refDelete = useRef();
  const {
    showDelete,
    setShowDelete,
    isLoading,
    showDeleteBotton,
    deleteTweetHanlder,
  } = props;
  return (
    <div className="!ml-auto cursor-pointer" onClick={showDeleteBotton}>
      <span ref={refDelete}>&#xFE19;</span>

      {showDelete && (
        <OnOutsiceClick onOutsideClick={() => setShowDelete(false)}>
          <Popover
            //className="relative z-50"
            targetRef={refDelete}
            position={positionDefault}
          >
            <button
              disabled={isLoading}
              className="text-sm text-red-200 p-6 py-2  shadow-lg bg-background rounded-sm  border-secondary disabled:cursor-default"
              onClick={deleteTweetHanlder}
            >
              {isLoading ? "Deleting.." : "Delete"}
            </button>
          </Popover>
        </OnOutsiceClick>
      )}
    </div>
  );
}
