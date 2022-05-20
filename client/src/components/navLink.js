import {Link, NavLink} from "react-router-dom";

export default ({partial = false, ...props}) => {
  const style = "border-b-2 border-solid border-b-blue p-2";
  return (
    <NavLink
      {...props}
      className={({isActive}) => {
        return (isActive && style) || "";
      }}
    />
  );
};
export function MainLink({partial = false, ...props}) {
  const style = "fill-secondary";
  return (
    <NavLink
      {...props}
      className={({isActive}) => {
        return (isActive && style) || "fill-neutral";
      }}
    />
  );
}
