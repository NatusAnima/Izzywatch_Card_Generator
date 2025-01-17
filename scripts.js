// Function to enable editing on double-click
function makeEditable(event) {
  const element = event.target;

  // Check if the parent container (element's ancestor) has the 'static' class
  const container = element.closest(".static");

  // Prevent editing if the parent container has the 'static' class
  if (!container && !element.classList.contains("footer")) {
    element.setAttribute("contenteditable", "true");
    element.focus();

    // Remove editable state on blur
    element.addEventListener(
      "blur",
      () => {
        element.removeAttribute("contenteditable");
      },
      { once: true }
    );
  }
}

// Initialize event listeners on DOM content loaded
document.addEventListener("DOMContentLoaded", () => {
  // Add the double-click event to all text-containing elements
  document
    .querySelectorAll(".container, .container-stratagems *")
    .forEach((el) => {
      if (el.innerText.trim() !== "" && !el.classList.contains("static")) {
        el.addEventListener("dblclick", makeEditable);
      }
    });

  // Add click listener to the "Save as PNG" button
  document.getElementById("save-as-png").addEventListener("click", () => {
    const container = document.querySelector(
      ".container, .container-stratagems"
    );

    // Select all buttons (add and delete buttons)
    const addButtons = document.querySelectorAll(
      ".add-row-btn, .inverted-add-row-btn"
    );
    const deleteButtons = document.querySelectorAll(
      ".delete-row-btn, .delete-ability-btn"
    );
    const th = document.querySelectorAll(".extra");

    // Hide all add and delete buttons
    addButtons.forEach((btn) => (btn.style.display = "none"));
    deleteButtons.forEach((btn) => (btn.style.display = "none"));
    th.forEach((th) => (th.style.display = "none"));

    // Use html2canvas to capture the container div
    html2canvas(container, {
      backgroundColor: null, // Preserve transparency
      useCORS: true, // Handle cross-origin issues for images
      scale: 2, // Higher scale for better resolution
    })
      .then((canvas) => {
        // Create a download link and trigger it
        const link = document.createElement("a");
        link.download = "warhammer-unit-stats.png";
        link.href = canvas.toDataURL("image/png");
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing the card:", error);
        alert("Failed to save the card. Please try again.");
      })
      .finally(() => {
        // Restore the visibility of add and delete buttons after the screenshot is taken
        addButtons.forEach((btn) => (btn.style.display = ""));
        deleteButtons.forEach((btn) => (btn.style.display = ""));
        th.forEach((th) => (th.style.display = ""));
      });
  });
});

// add row function
document.addEventListener("DOMContentLoaded", function () {
  // Initialize tables with their specific settings
  setupTable({
    tableId: "rangedWeaponTable",
    addButtonId: "addRangedRowButton",
    maxRows: 5,
    defaultRowData: [
      "New Ranged Weapon [TYPE]", // Weapon Name
      '0"', // Range
      "0", // A
      "0+", // BS
      "0", // S
      "0", // AP
      "0", // D
    ],
  });

  setupTable({
    tableId: "meleeWeaponTable",
    addButtonId: "addMeleeRowButton", // Assume another button for melee table
    maxRows: 5,
    defaultRowData: [
      "New Melee Weapon [TYPE]", // Weapon Name
      "Melee", // Range (specific for melee weapons)
      "0", // A
      "0+", // BS
      "0", // S
      "0", // AP
      "0", // D
    ],
  });

  // Reusable setup function for a table
  function setupTable({ tableId, addButtonId, maxRows, defaultRowData }) {
    const table = document.getElementById(tableId);
    const addButton = document.getElementById(addButtonId);
    const tableBody = table?.querySelector("tbody");

    // Event delegation for delete functionality
    tableBody?.addEventListener("click", function (event) {
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "X"
      ) {
        const row = event.target.closest("tr");
        row.remove(); // Remove the row

        // Re-enable the add button if rows are below the limit
        const currentRowCount = tableBody.querySelectorAll("tr").length;
        if (currentRowCount < maxRows) {
          addButton.disabled = false;
        }
      }
    });

    // Add row functionality
    if (addButton) {
      addButton.addEventListener("click", function () {
        const currentRowCount = tableBody.querySelectorAll("tr").length;

        if (currentRowCount >= maxRows) {
          alert("Maximum row limit reached!");
          addButton.disabled = true;
          return;
        }

        // Create a new row
        const newRow = document.createElement("tr");

        // Add cells to the row
        defaultRowData.forEach((data) => {
          const cell = document.createElement("td");
          cell.textContent = data;
          newRow.appendChild(cell);
        });

        // Add a cell with a delete button
        const deleteCell = document.createElement("td");
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "X";
        deleteButton.className = "delete-row-btn";
        deleteCell.className = "static";
        deleteCell.appendChild(deleteButton);
        newRow.appendChild(deleteCell);

        // Append the row to the table body
        tableBody.appendChild(newRow);

        // Disable the button if the limit is reached
        if (currentRowCount + 1 >= maxRows) {
          addButton.disabled = true;
        }
      });
    }
  }
});

// wargear options add delete
document.addEventListener("DOMContentLoaded", function () {
  function setupListManager({ addButtonId, listContainerClass, defaultText }) {
    const addButton = document.getElementById(addButtonId);
    const optionsList = document.querySelector(`.${listContainerClass}`);

    if (!addButton || !optionsList) return; // Ensure elements exist

    // Function to add a new list item
    function addListItem() {
      const outerDiv = document.createElement("div");
      const newOption = document.createElement("li");
      const optionContainer = document.createElement("div");

      const optionText = document.createElement("span");
      optionText.textContent = defaultText; // Customizable default text
      optionContainer.appendChild(optionText);

      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-row-btn", "static");
      optionContainer.appendChild(deleteButton);

      newOption.appendChild(optionContainer);
      outerDiv.appendChild(newOption);
      optionsList.appendChild(outerDiv);
    }

    // Attach click event to the add button
    addButton.addEventListener("click", addListItem);

    // Use event delegation for delete buttons
    optionsList.addEventListener("click", function (event) {
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "X"
      ) {
        const listItem = event.target.closest("li");
        if (listItem) listItem.remove();
      }
    });
  }

  // ✅ Setup for Wargear Section
  setupListManager({
    addButtonId: "addWargearRowButton",
    listContainerClass: "options-list",
    defaultText: "New wargear option",
  });

  // ✅ Setup for Weapon Stats Section
  setupListManager({
    addButtonId: "addWeaponStats",
    listContainerClass: "options-list",
    defaultText: "New weapon stat",
  });
});

// add delete ability
document.addEventListener("DOMContentLoaded", function () {
  const abilitiesContainer = document.querySelector(".other-abilities");
  const addAbilitiesBtn = document.getElementById("addAbilitiesBtn");
  const maxAbilities = 4; // Max abilities allowed

  // Function to update the button state
  function updateButtonState() {
    const abilitiesCount = document.querySelectorAll(
      ".abilities-column-section"
    ).length;
    if (addAbilitiesBtn) {
      addAbilitiesBtn.disabled = abilitiesCount >= maxAbilities;
    }
  }

  // Function to delete an ability
  function deleteAbility(event) {
    event.target.closest(".abilities-column-section").remove();
    updateButtonState(); // Update button state after deletion
  }

  // Attach delete event listener to existing abilities
  document.querySelectorAll(".delete-ability-btn").forEach((button) => {
    button.addEventListener("click", deleteAbility);
  });

  // Function to add a new ability
  function addAbility() {
    if (
      document.querySelectorAll(".abilities-column-section").length >=
      maxAbilities
    ) {
      return; // Prevent adding more than the limit
    }

    const newAbility = document.createElement("div");
    newAbility.classList.add("abilities-column-section");
    newAbility.innerHTML = `
      <div class="abilities-title-row">
        <strong>New Ability:</strong>
        <button class="delete-ability-btn static">X</button>
      </div>
      <p>Enter ability description here...</p>
    `;

    // Attach delete event to the new button
    newAbility
      .querySelector(".delete-ability-btn")
      .addEventListener("click", deleteAbility);

    // Append the new ability section to the container
    abilitiesContainer.appendChild(newAbility);
    updateButtonState(); // Update button state after addition
  }

  // Attach event listener to the add button
  if (addAbilitiesBtn) {
    addAbilitiesBtn.addEventListener("click", addAbility);
  }

  // Initial check to disable the button if needed
  updateButtonState();
});

// image onclick
document.addEventListener("DOMContentLoaded", function () {
  // Array of images
  const images = [
    "./icons/stratAny.svg",
    "./icons/stratCharge.svg",
    "./icons/stratCommand.svg",
    "./icons/stratFight.svg",
    "./icons/stratMovement.svg",
    "./icons/stratShooting.svg",
  ];

  let currentImageIndex = 0;

  // Get the image element and the container
  const imageElement = document.getElementById("diamondImage");
  const imageContainer = document.getElementById("imageContainer");

  // Function to change the image when the container is clicked
  imageContainer.addEventListener("click", function () {
    // Increment the index and wrap around using the modulo operator
    currentImageIndex = (currentImageIndex + 1) % images.length;

    // Set the new image src
    imageElement.src = images[currentImageIndex];
  });
});

// change color
document.addEventListener("DOMContentLoaded", function () {
  const bgColors = ["bg-green", "bg-red", "bg-blue"];
  const textColors = ["color-green", "color-red", "color-blue"];
  const borderColors = ["border-green", "border-red", "border-blue"];
  const filterClasses = ["icon-green", "icon-red", "icon-blue"]; // Image filters

  // Select all elements with background, text, border, and image filters
  const bgElements = document.querySelectorAll(".bg-green, .bg-red, .bg-blue");
  const textElements = document.querySelectorAll(
    ".color-green, .color-red, .color-blue"
  );
  const borderElements = document.querySelectorAll(
    ".border-green, .border-red, .border-blue"
  );
  const filterElements = document.querySelectorAll(
    ".icon-green, .icon-red, .icon-blue"
  );

  const colorContainer = document.getElementById("colorContainer");

  if (
    !colorContainer ||
    (!bgElements.length &&
      !textElements.length &&
      !borderElements.length &&
      !filterElements.length)
  ) {
    console.error("Elements not found!"); // Check if elements exist
    return;
  }

  colorContainer.addEventListener("click", function () {
    // Update background color elements
    bgElements.forEach((element) => {
      let currentClass = bgColors.find((c) => element.classList.contains(c));
      let currentIndex = bgColors.indexOf(currentClass);

      if (currentClass) element.classList.remove(currentClass);
      let newIndex = (currentIndex + 1) % bgColors.length;
      element.classList.add(bgColors[newIndex]);
    });

    // Update text color elements
    textElements.forEach((element) => {
      let currentClass = textColors.find((c) => element.classList.contains(c));
      let currentIndex = textColors.indexOf(currentClass);

      if (currentClass) element.classList.remove(currentClass);
      let newIndex = (currentIndex + 1) % textColors.length;
      element.classList.add(textColors[newIndex]);
    });

    // Update border color elements
    borderElements.forEach((element) => {
      let currentClass = borderColors.find((c) =>
        element.classList.contains(c)
      );
      let currentIndex = borderColors.indexOf(currentClass);

      if (currentClass) element.classList.remove(currentClass);
      let newIndex = (currentIndex + 1) % borderColors.length;
      element.classList.add(borderColors[newIndex]);
    });

    // Update image filters
    filterElements.forEach((element) => {
      let currentClass = filterClasses.find((c) =>
        element.classList.contains(c)
      );
      let currentIndex = filterClasses.indexOf(currentClass);

      if (currentClass) element.classList.remove(currentClass);
      let newIndex = (currentIndex + 1) % filterClasses.length;
      element.classList.add(filterClasses[newIndex]);
    });
  });
});
