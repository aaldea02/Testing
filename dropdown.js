import { draggableList, create_UUID, drop } from "./dragdrop.js";

export const insertNode = (node) => {
  let sel, range;

  if (window.getSelection) {
    sel = window.getSelection();

    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0);
      range.deleteContents();

      range.insertNode(node);

      range.collapse(true);
      setTimeout(() => {
        node.focus();
      }, 0);
    }
  }
};
document.addEventListener("DOMContentLoaded", () => {
  const div1 = document.getElementById("div1");
  let choice = -1;

  const clearPopup = (node) => {
    node.childNodes[3].innerHTML = "";
    node.childNodes[3].style.display = "none";
  };

  const placeIbeamAfterNode = (node) => {
    if (typeof window.getSelection != "undefined") {
      const range = document.createRange();
      range.setStartAfter(node);
      range.collapse(true);
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
    }
  };

  const completeInput = (node) => {
    // replaces search and hidden text
    console.log(node.childNodes[2].innerText);
    if (node.childNodes[2].innerText !== "") {
      console.log("complete");
      node.childNodes[1].innerText = node.childNodes[2].innerText;
      node.childNodes[2].innerText = "";
    }

    setTimeout(function () {
      div1.focus();
    }, 0);

    placeIbeamAfterNode(node);
    div1.setAttribute("contentEditable", true);
    node.childNodes[1].setAttribute("contentEditable", false);

    clearPopup(node);
  };

  const clickChoice = (node, choices) => {
    node.childNodes[2].innerText = "";
    node.childNodes[1].innerText = choices.innerText;
    node.childNodes[3].innerHTML = "";
    node.childNodes[3].style.display = "none";
    placeIbeamAfterNode(node);
    div1.setAttribute("contentEditable", true);
    node.childNodes[1].setAttribute("contentEditable", false);
    completeInput(node);
    clearPopup(node);
  };

  const popup = (node) => {
    const child = node.childNodes[1];

    const regExp = new RegExp("^" + node.childNodes[1].innerText, "i");

    const fragment = document.createDocumentFragment();

    let flag = false;

    for (let x = 0; x < draggableList.length; x++) {
      if (regExp.test(draggableList[x].content)) {
        flag = true;
        // console.log("done");

        const choices = document.createElement("p");
        choices.innerText = draggableList[x].content;
        choices.setAttribute("class", "choices");
        // choices.addEventListener("mouseover", () => {
        //   node.childNodes[2].innerHTML = choices.innerText;
        // });

        choices.addEventListener("click", () => clickChoice(node, choices));
        fragment.appendChild(choices);
      }
    }

    if (!flag) {
      clearPopup(node);
    }
    node.childNodes[3].innerHTML = "";
    node.childNodes[3].style.display = "block";
    node.childNodes[3].appendChild(fragment);
  };

  const deleteInput = (node) => {
    node.parentNode.removeChild(node);

    div1.setAttribute("contentEditable", true);

    setTimeout(() => {
      div1.focus();
    }, 0);

    document.execCommand("selectAll", false, null);

    document.getSelection().collapseToEnd();
  };

  const checkKeyPressedDropDown = (evt, dropdown) => {
    //console.log("a" + dropdown.childNodes[1].innerText + "a")
    if (evt.key === "Backspace" && dropdown.childNodes[1].innerText === "") {
      evt.preventDefault();

      deleteInput(dropdown);
    } else if (
      dropdown.childNodes[1].innerText === "" &&
      evt.which === 32 // work?
    ) {
      completeInput(dropdown);
    } else if (evt.key === "Enter" || evt.key === "Tab") {
      // work on this more, make it more seemless
      // add an on key down for search text
      evt.preventDefault();
      completeInput(dropdown);
    } else if (evt.key === "ArrowDown") {
      //  NEED TO FIX WHEN USER STARTS TYPING BUT THEN USES ARROWS
      evt.preventDefault();
      if (choice < 3) choice++;
      selectChoice(dropdown, choice);
    } else if (evt.key === "ArrowUp") {
      evt.preventDefault();
      if (choice > 0) choice--;
      selectChoice(dropdown, choice);
    }
  };

  const selectChoice = (node, choice) => {
    // console.log("run?");
    const child = node.childNodes[3].children[choice];
    child.style.backgroundColor = "pink";
    node.childNodes[2].innerText = child.innerText;
    // node.childNodes[1].onkeydown = (event) => {

    //   console.log("what");
    //   node.childNodes[2].innerText = "";
    //  };
  };

  const replace = (node) => {
    if (
      node.childNodes[2].innerText !== "" &&
      node.childNodes[1].innerText === ""
    ) {
      console.log("WORK");
      // node.childNodes[2].innerText = "";
    }
  };

  const createInput = (evt) => {
    const dropdown = document.createElement("span");
    choice = -1;

    dropdown.setAttribute("class", "DropDown");
    dropdown.setAttribute("id", create_UUID());
    dropdown.setAttribute("contentEditable", false);

    const sign = document.createElement("span");
    sign.innerText += "@";
    dropdown.appendChild(sign);

    const searchText = document.createElement("span");

    dropdown.appendChild(searchText);
    searchText.setAttribute("onkeydown", "");

    const hiddenText = document.createElement("span");
    dropdown.appendChild(hiddenText);

    const dropdown_result = document.createElement("span");
    dropdown_result.setAttribute("class", "DropDown_Result");
    dropdown.appendChild(dropdown_result);

    insertNode(dropdown);

    div1.setAttribute("contentEditable", false);
    dropdown.childNodes[1].setAttribute("contentEditable", true);
    dropdown.setAttribute("draggable", true);

    setTimeout(() => {
      dropdown.childNodes[1].focus();
    }, 0);

    dropdown.addEventListener("keyup", () => popup(dropdown)); // passing in the node argument breaks it
    //  dropdown.addEventListener("change", () => popup(dropdown));
    dropdown.addEventListener("keydown", (e) =>
      checkKeyPressedDropDown(e, dropdown)
    );
    // Small brain implementation for replacement, when you do the arrow key but start typing
    if (evt.key !== "ArrowUp" || evt.key !== "ArrowDown")
      // can I shorten code?
      dropdown.childNodes[1].addEventListener("keydown", () =>
        replace(dropdown)
      );
  };

  const addSpan = () => {
    const spaceSpan = document.createElement("span");

    // this doesnt work?
    if (spaceSpan === document.activeElement) {
      setTimeout(function () {
        div1.focus();
      }, 0);
      addSpan();
    }
    spaceSpan.innerText += " ";
  
    spaceSpan.setAttribute("class", "newSpan");
    spaceSpan.addEventListener("drop", drop);

    insertNode(spaceSpan);
    div1.setAttribute("contentEditable", false);
    spaceSpan.setAttribute("contentEditable", true);

    setTimeout(() => {
      spaceSpan.focus();
    }, 0);

    setTimeout(function () {
      div1.focus();
    }, 0);

    placeIbeamAfterNode(spaceSpan);
    div1.setAttribute("contentEditable", true);
    spaceSpan.setAttribute("contentEditable", false);
  };
  const checkKeyPressedDiv = (evt) => {
    // YOU HAVE TO BE TYPING INSIDE THE RED
    if (div1 === document.activeElement) {
      if (evt.key === "@") {
        createInput(evt);
      } else if (evt.which === 32) {
        // need to make sure its
        //evt.preventDefault();
       
        addSpan();
      }
    }
  };

  div1.addEventListener("keydown", (e) => checkKeyPressedDiv(e), false);

  //add controlZ
});
