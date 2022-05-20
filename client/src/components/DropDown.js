import React, {useState} from "react";
import {useCombobox} from "downshift";
import {AiFillDelete} from "react-icons/ai";
import {createChat, searchUsers} from "../util/api";
import {debounce} from "lodash";
import {useMutation} from "react-query";
import {Navigate, useNavigate} from "react-router-dom";
import {FaXing} from "react-icons/fa";
// import { items, menuStyles, comboboxStyles } from './utils'
export default function DropDown({setChatId, setNewChat}) {
  const [inputItems, setInputItems] = useState([]);
  const [users, setUsers] = useState([]);
  const {mutate} = useMutation("createChat", createChat);
  const navigate = useNavigate();

  const {
    isOpen,
    getToggleButtonProps,
    getLabelProps,
    getMenuProps,
    getInputProps,
    getComboboxProps,
    highlightedIndex,
    getItemProps,
    setInputValue,
    closeMenu,
  } = useCombobox({
    items: inputItems,
    itemToString: (item) => item.username || "",
    onInputValueChange: debounce(onInputValueChange),
  });

  async function onInputValueChange(props) {
    const inputValue = props.inputValue;
    setInputItems(await searchUsers(inputValue));
  }

  const handleCreateChat = (e) => {
    setUsers(null);
    mutate(
      users.map((user) => user._id),
      {
        onSuccess: ({data: {chatId}}) => {
          setNewChat(false);
          setChatId(chatId);
        },
      }
    );
  };
  return (
    <div
      onKeyDown={(e) => {
        if (e.key !== "Enter" || inputItems?.length === 0) return;
        setUsers([...users, inputItems[highlightedIndex]]);
        setInputValue("");
        setInputItems([]);
      }}
      className="space-y-2"
    >
      <label {...getLabelProps()}>search people to chat with</label>
      <div {...getComboboxProps()}>
        <input
          {...getInputProps()}
          className="p-2 outline-none rounded-lg bg-dark-grey"
        />
        <button
          type="button"
          {...getToggleButtonProps()}
          aria-label="toggle menu"
        >
          &#8595;
        </button>
      </div>
      <ul {...getMenuProps()} className="space-y-2 child:p-1 w-1/2">
        {isOpen &&
          inputItems.map((item, index) => (
            <li
              style={
                highlightedIndex === index ? {backgroundColor: "#bde4ff"} : {}
              }
              key={`${item.username}`}
              {...getItemProps({item, index})}
              onClick={(e) => {
                setUsers([...users, item]);
                setInputValue("");
                setInputItems([]);
              }}
              onKeyDown={(e) => {
                console.log(e.target, "here");
                if (e.code !== 13) return;
                console.log("here");
                setUsers([...users, item]);
                setInputValue("");
                setInputItems([]);
              }}
            >
              {item.username}
            </li>
          ))}
      </ul>

      <ul className="space-y-2 child:border-b-2  child:border-solid child:border-blue  w-1/3">
        {users &&
          users.map((user) => (
            <li
              key={user.username}
              className="flex space-x-4 items-center justify-between p-4 bg-dark-grey"
            >
              <span>{user.username} </span>

              <span
                onClick={(e) => {
                  const newUsers = users.filter(
                    (curr) => curr.username !== user.username
                  );
                  setUsers(newUsers);
                }}
              >
                <FaXing></FaXing>
              </span>
            </li>
          ))}
      </ul>
      {users?.length > 0 && (
        <button onClick={handleCreateChat}>start chating</button>
      )}
    </div>
  );
}
