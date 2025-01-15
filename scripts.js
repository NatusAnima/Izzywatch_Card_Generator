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
  document.querySelectorAll(".container *").forEach((el) => {
    if (el.innerText.trim() !== "" && !el.classList.contains("static")) {
      el.addEventListener("dblclick", makeEditable);
    }
  });

  // Add click listener to the "Save as PNG" button
  document.getElementById("save-as-png").addEventListener("click", () => {
    const container = document.querySelector(".container");

    // Select all buttons (add and delete buttons)
    const addButtons = document.querySelectorAll(
      ".add-row-btn, .inverted-add-row-btn"
    );
    const deleteButtons = document.querySelectorAll(".delete-row-btn");
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
    const tableBody = table.querySelector("tbody");

    // Event delegation for delete functionality
    tableBody.addEventListener("click", function (event) {
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

document.addEventListener("DOMContentLoaded", function () {
  const addWargearButton = document.getElementById("addWargearRowButton");
  const optionsList = document.querySelector(".options-list");

  if (addWargearButton && optionsList) {
    addWargearButton.addEventListener("click", function () {
      // Create a new <div> element (outer container)
      const outerDiv = document.createElement("div");

      // Create a <li> element
      const newOption = document.createElement("li");

      // Create a <div> to contain the content and the delete button
      const optionContainer = document.createElement("div");

      // Create the text content for the <li>
      const optionText = document.createElement("span");
      optionText.textContent = "New wargear option"; // Default content for new option
      optionContainer.appendChild(optionText);

      // Create the delete button
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "X";
      deleteButton.classList.add("delete-row-btn", "static"); // Optional: add a class for styling
      optionContainer.appendChild(deleteButton);

      // Append the <div> container to the <li>
      newOption.appendChild(optionContainer);

      // Append the <li> to the outer <div>
      outerDiv.appendChild(newOption);

      // Append the outer <div> to the options list
      optionsList.appendChild(outerDiv);
    });

    // Use event delegation to handle delete button clicks
    optionsList.addEventListener("click", function (event) {
      if (
        event.target.tagName === "BUTTON" &&
        event.target.textContent === "X"
      ) {
        const listItem = event.target.closest("li");
        listItem.remove(); // Remove the <li> from the list
      }
    });
  }
});
