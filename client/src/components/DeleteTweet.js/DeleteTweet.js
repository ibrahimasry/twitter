import React from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useDeleteTweet} from "../../util/api";
import DeleteTweetRepresenter from "./DeleteTweetRepresenter";

export default function DeleteTweet({_id}) {
  const [showDelete, setShowDelete] = React.useState(false);
  const {tweetID} = useParams();
  const {mutate, isLoading} = useDeleteTweet({_id});
  const navigate = useNavigate();
  const showDeleteBotton = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDelete(true);
  };

  const deleteTweetHanlder = (e) => {
    e.stopPropagation();
    mutate();
    if (tweetID) {
      navigate("/");
    }
  };

  const props = {
    showDelete,
    setShowDelete,
    mutate,
    isLoading,
    tweetID,
    navigate,
    showDeleteBotton,
    deleteTweetHanlder,
  };

  return <DeleteTweetRepresenter {...props} />;
}
