// Reserved Seats
var reservedSeats = {
  record1: {
    seat: "b19",
    owner: {
      fname: "joe",
      lname: "smith",
    },
  },
  record2: {
    seat: "b20",
    owner: {
      fname: "joe",
      lname: "smith",
    },
  },
  record3: {
    seat: "b21",
    owner: {
      fname: "joe",
      lname: "smith",
    },
  },
  record4: {
    seat: "b22",
    owner: {
      fname: "joe",
      lname: "smith",
    },
  },
};

(function () {
  // Array to store clicked div IDs
  let selectedSeats = [];
  // Define rows from A to T
  const rows = "abcdefghijklmnopqrst".split("");

  // Define 15 columns per row
  const columns = Array.from({ length: 15 }, (_, i) => i + 1);

  // Function to create div elements
  const createDiv = (parentId, id, text, className = "") => {
    const div = document.createElement("div");
    if (className) {
      div.classList.add(className);
      div.textContent = text;
    } else {
      div.classList.add("a");
      div.id = id;
      div.textContent = text;
    }
    document.getElementById(parentId).appendChild(div);
  };

  // Function to generate seating layout
  const generateSeatingLayout = () => {
    let seatNumber = 1; // Initialize seat number
    // Loop through each row
    // Begin with creating the label for left hand seating.
    rows.forEach((row) => {
      createDiv("left", (id = ""), row, "label"); // Add label for left section

      // Loop through each column for seats
      columns.forEach((column) => {
        const id = row + seatNumber;
        const sectionId =
          column <= 3 ? "left" : column > 12 ? "right" : "middle";
        createDiv(sectionId, id, seatNumber); // Add seat number in respective section
        seatNumber++; // Increment seat number
      });

      createDiv("right", (id = ""), row, "label"); // Add label for right section
    });
  };

  // Call the function to generate seating layout
  generateSeatingLayout();

  for (const key in reservedSeats) {
    // The hasOwnProperty method ensures you are only accesing properties directly on this object and not an inherited one further up the pototypical chain
    if (reservedSeats.hasOwnProperty(key)) {
      const obj = reservedSeats[key];
      myDiv = document.getElementById(obj.seat);
      myDiv.className = "r";
      myDiv.innerHTML = "R";
    }
  }

  var seats = document.querySelectorAll(".a");

  // Loop through each seat and attach a click event listener
  seats.forEach((seat) => {
    seat.addEventListener("click", (event) => {
      seatSelectionProcess(event.target.id);
    });
  });

  // Function to handle seat selection
  function seatSelectionProcess(seatId) {
    // Prevent reserved seats from getting selcted a second time
    if (!document.getElementById(seatId).classList.contains("r")) {
      // Check if the div ID is already in the array
      const index = selectedSeats.indexOf(seatId);
      // Using a ternary operator to add or remove seats based on their presence in the array
      index === -1
        ? (selectedSeats.push(seatId),
          (document.getElementById(seatId).className = "s"))
        : (selectedSeats.splice(index, 1),
          (document.getElementById(seatId).className = "a"));

      console.log(index === -1 ? `Added: ${seatId}` : `Removed: ${seatId}`);
      console.log("Clicked divs:", selectedSeats);

      // Update UI based on selected seats
      updateUI(selectedSeats);
    }
  }

  // Adding an event listener to the element with ID "reserve"
  document.getElementById("reserve").addEventListener("click", (event) => {
    // Display the reservation form when the "reserve" element is clicked
    document.getElementById("resform").style.display = "block";
    clearFormFields();
    event.preventDefault();
  });

  document.getElementById("cancel").addEventListener("click", (event) => {
    document.getElementById("resform").style.display = "none";
    event.preventDefault();
  });

  // Function to update UI based on selected seats
  function updateUI(selectedSeats) {
    if (selectedSeats.length === 0) {
      // If no seats are selected, hide the confirmation and display an error message
      document.getElementById("confirmres").style.display = "none"; // Hide confirmation
      document.getElementById("error").style.display = "block"; // Show error message
    } else {
      // If seats are selected
      if (selectedSeats.length === 1) {
        // Display the singular seat message and hide the error message
        document.getElementById("confirmres").style.display = "block"; // Hide confirmation
        document.getElementById(
          "selectedseats"
        ).innerHTML = `You have selected seat<br>${selectedSeats}`;
        document.getElementById("error").style.display = "none"; // Hide error message
      } else {
        // If multiple seats are selected
        // Create a string representation of selected seats with proper formatting
        let seatString = selectedSeats.join(", "); // Join selected seats with commas
        seatString = seatString.replace(/,([^,]*)$/, " and$1"); // Replace last comma with 'and'

        // Display the plural seat message and show confirmation
        document.getElementById(
          "selectedseats"
        ).innerHTML = `You have selected seats<br>${seatString}`;
        document.getElementById("confirmres").style.display = "block"; // Show confirmation
        document.getElementById("error").style.display = "none"; // Hide error message
      }
    }
  }
  updateUI(selectedSeats);

  document.getElementById("error").addEventListener("click", (event) => {
    document.getElementById("resform").style.display = "none";
    event.preventDefault();
  });

  // Function to process the reservation and save data to the dictionary
  function processReservation(fname, lname) {
    // Loop through the seatSelected array and create records for each seat
    selectedSeats.forEach((seat, index) => {
      document.getElementById(seat).className = "r";
      document.getElementById(seat).innerHTML = "R";
      // Get the keys of existing records
      const existingRecordKeys = Object.keys(reservedSeats);
      // Find the next available index for the new record
      const nextIndex = existingRecordKeys.length + 1;
      // Begin record of new reservation in sequence to previous reseration
      const newRecordKey = `record${nextIndex + index}`;
      // Create an object for the current seat with owner information
      reservedSeats[newRecordKey] = {
        seat: seat,
        owner: {
          fname: fname,
          lname: lname,
        },
      };
    });

    document.getElementById("resform").style.display = "none";
    selectedSeats = [];
    updateUI(selectedSeats);
    // Perform any further processing or actions with the reservedSeats object here
    console.log("Reservation data:", reservedSeats);
    // You can send this data to a server, store it locally, or perform any other operations.
  } // End processReservation

  // Function to clear form fields
  function clearFormFields() {
    document.getElementById("fname").value = ""; // Clear first name field
    document.getElementById("lname").value = ""; // Clear last name field
  }

  // Add event listener to the submit button
  document.getElementById("confirmres").addEventListener("submit", (event) => {
    event.preventDefault(); // Prevent the default form submission behavior

    // Get the fname and lname values from the form fields
    const firstName = document.getElementById("fname").value;
    const lastName = document.getElementById("lname").value;

    // Call the processReservation function with the retrieved values
    processReservation(firstName, lastName);
  });
})();
