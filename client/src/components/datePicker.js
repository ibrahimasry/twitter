import {useEffect, useState} from "react";
import Selections from "./selections";
export default function DatePicker(props) {
  const [year, setYear] = useState(2010);
  const [month, setMonth] = useState(1);
  const [days, setDays] = useState([]);
  useEffect(() => {
    const monthNumber = Number(month);
    const curr = getDays(year, monthNumber);
    setDays(() => curr);
  }, [year, month]);

  return (
    <div className="flex  text-xs space-x-2 items-baseline ">
      <span className="text-xs">data of birth :</span>
      <Selections
        items={getYears()}
        labelId={"year"}
        onChangeHandler={setYear}
      ></Selections>
      <Selections
        labelId={"month"}
        items={getMonths()}
        onChangeHandler={setMonth}
      ></Selections>
      <Selections labelId={"day"} items={days}></Selections>
    </div>
  );
}

function getMonths() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
}

function getYears() {
  const years = [];
  let start = 1910;

  for (let i = 0; i <= 110; i++) years.push(start + i);

  return years;
}

function getDays(year, month) {
  const res = [];
  const n = new Date(year, month, 0).getDate();
  for (let i = 1; i <= n; i++) res.push(i);
  return res;
}
