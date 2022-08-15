import { draggableList } from "./dragdrop.js";

const create_UUID = () => {
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

document.addEventListener("DOMContentLoaded", () => {
  const insertDropDown = () => {
    let sel, range;
    const fragment = document.createDocumentFragment();

   

    if (window.getSelection) {
      sel = window.getSelection();

      if (sel.getRangeAt && sel.rangeCount) {
        range = sel.getRangeAt(0);
        range.deleteContents();

        fragment.appendChild(sign);
        if (dropdown.classList.contains("DropDown"))
          fragment.appendChild(dropdown);
        fragment.appendChild(searchText);

        range.insertNode(fragment);

        range.collapse(true);
        setTimeout(() => {
          dropdown.focus();
        }, 0);
      }
    }
    dropdown.addEventListener("keydown", checkKeyPressedDropDown, false);
  };

  const checkKeyPressedDropDown = (evt) => {
    if (
      evt.key === "Backspace" &&
      div1.contains(document.getElementById("dropdown")) &&
      dropdown.innerText === ""
    ) {
      deleteInput();
    } else if (
      evt.key === "Enter" && // need to add tab
      div1.contains(document.getElementById("dropdown"))
    ) {
      completeInput();
    } else if (
      evt.key === "ArrowDown" &&
      div1.contains(document.getElementById("dropdown"))
    ) {
      choice++;
      selectChoice();
    } else if (
      evt.key === "ArrowUp" &&
      div1.contains(document.getElementById("dropdown"))
    ) {
      choice--;
      selectChoice();
    }
  };

  const checkKeyPressedDiv = (evt) => {
    if (evt.key === "@") {
      insertDropDown();

      // moveAutocompleteResult(evt, div1);
    }
  };

  div1.addEventListener("keydown", checkKeyPressedDiv, false);
});
