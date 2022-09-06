import { insertNode } from "./dropdown.js";

export const create_UUID = () => {
  let dt = new Date().getTime();
  let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    function (c) {
      let r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
    }
  );
  return uuid;
};
export const drop = (ev) => {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  if(document.getElementById("div1").contains(document.getElementById(data))) {
    ev.target.appendChild(document.getElementById(data));
} else {
  const nodeCopy = document.getElementById(data).cloneNode(true);
  // technically we need to create a new id but code breaks if I do
 
  ev.target.appendChild(nodeCopy);
}
};

export const draggableList = [
  {
    id: create_UUID(),
    content: "Apt Date",
  },
  {
    id: create_UUID(),
    content: "Apt Time",
  },
  {
    id: create_UUID(),
    content: "Location",
  },
  {
    id: create_UUID(),
    content: "Patient Name",
  },
];

  // ]gets the input div
 export const dragDrop = () => {
    const div1 = document.getElementById("div1");
    div1.setAttribute("contentEditable", true);
  
    let b = document.createDocumentFragment();
    let c = false;
    // creates draggables
    for (let x = 0; x < draggableList.length; x++) {
      const d = document.createElement("span");
      d.setAttribute("class", "draggables");
      d.setAttribute("id", draggableList[x].id);
  
      d.innerText = draggableList[x].content;
      d.setAttribute("contentEditable", false);
      d.setAttribute("draggable", true);
      b.appendChild(d);
    }
    div1.after(b); // attaches draggables
  
    // event listeners for drag drop
    document.addEventListener("dragover", (ev) => {
      ev.preventDefault();
    });
  
    document.addEventListener("dragstart", (ev) => {
      ev.dataTransfer.setData("text", ev.target.id);
    });
  
    // specifies event listener to div1
    div1.addEventListener("drop", drop);
  
    // another weird error, trying to add spans in the middle of spaces
    // div1.innerHTML = div1.innerText.replace(
    //   /(^|<\/?[^>]+>|\s+)([^\s<]+)/g,
    //   '$1<span class="words">$2</span><span class="words"> </span>'
    // );
    div1.innerHTML = div1.innerText.replace(/\s/g, '<span class="words"> </span>');
  
    
  };
  

