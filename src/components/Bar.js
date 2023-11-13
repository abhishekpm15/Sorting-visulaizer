import React from "react";

const Bar = (props) => {
  console.log('props',props);
  return (
      <div
        key={props.key}
        index = {props.key}
        className={`w-5 mx-10  bg-teal-400 rounded-md ${props.isSelected && "bg-orange-800"}`}
        style={{ height: `${props.value * 30}px` }}
      ></div>
  );
};

export default Bar;
