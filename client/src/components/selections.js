import {Listbox, ListboxOption} from "@reach/listbox";
import {useField} from "formik";

import signUpModel from "../form/signUpModel";
export default function Selections({labelId, items, onChangeHandler, ...rest}) {
  const [field, _, fieldHelper] = useField({name: labelId});
  console.log(field);
  return (
    <Listbox
      className="h-1/10 "
      value={field.value}
      aria-labelledby={labelId}
      onChange={(value) => {
        fieldHelper.setValue(value);
        if (onChangeHandler) onChangeHandler(value);
      }}
    >
      {items &&
        items.map((item, i) => (
          <ListboxOption
            className="border-2  border-secondary border-solid text-xs"
            value={getValue(labelId, item, i)}
            key={item}
          >
            {item}
          </ListboxOption>
        ))}
    </Listbox>
  );
}

function getValue(label, item, i) {
  let res = label === "month" ? i + 1 : item;
  if (res < 10) res = "0" + "" + res;

  return String(res);
}
