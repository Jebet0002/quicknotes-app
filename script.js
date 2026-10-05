// ---------- 1. Select elements ----------
const form = document.querySelector("#note-form");
const input = document.querySelector("#note-input");
const categorySelect = document.querySelector("#note-category");
const list = document.querySelector("#notes-list");
const count = document.querySelector("#note-count");
const errorMessage = document.querySelector("#error-message");
const searchInput = document.querySelector("#search-input");
const clearAllBtn = document.querySelector("#clear-all-btn");

const STORAGE_KEY = "quicknotes_data";

// ---------- 2. Load saved notes ----------
let notes = loadNotes();

function loadNotes() {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved ? JSON.parse(saved) : [];
}

function saveNotes() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// ---------- 3. Render function ----------
function render(filteredNotes = notes) {
  list.innerHTML = ""; // Clear existing list

  if (filteredNotes.length === 0) {
    if (notes.length > 0) {
      const emptyMsg = document.createElement("p");
      emptyMsg.textContent = "No notes match your search.";
      list.appendChild(emptyMsg);
    }
  } else {
    filteredNotes.forEach((note) => {
      const li = document.createElement("li");
      li.classList.add("note-card", `category-${note.category.toLowerCase()}`);

      // Safe text insertion
      const textPara = document.createElement("p");
      textPara.textContent = note.text;

      const footerDiv = document.createElement("div");
      footerDiv.classList.add("note-footer");

      const metaDiv = document.createElement("div");
      metaDiv.classList.add("note-meta");

      const badge = document.createElement("span");
      badge.classList.add("category-badge");
      badge.textContent = note.category;

      const dateSpan = document.createElement("span");
      dateSpan.classList.add("created-at");
      dateSpan.textContent = note.createdAt;

      metaDiv.appendChild(badge);
      metaDiv.appendChild(dateSpan);

      const delBtn = document.createElement("button");
      delBtn.textContent = "Delete";
      delBtn.classList.add("delete-btn");
      delBtn.addEventListener("click", () => deleteNote(note.id));

      footerDiv.appendChild(metaDiv);
      footerDiv.appendChild(delBtn);

      li.appendChild(textPara);
      li.appendChild(footerDiv);

      list.appendChild(li);
    });
  }

  updateCount();
}

// ---------- 4. Helper function for note count ----------
function updateCount() {
  const total = notes.length;
  if (total === 0) {
    count.textContent = "You have no notes yet.";
  } else if (total === 1) {
    count.textContent = "You have 1 note.";
  } else {
    count.textContent = `You have ${total} notes.`;
  }
}

// ---------- 5. Add note function ----------
function addNote(text, category) {
  const now = new Date();
  const formattedDate = now.toLocaleDateString() + " " + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newNote = {
    id: Date.now(),
    text: text,
    category: category,
    createdAt: formattedDate
  };

  notes.push(newNote);
  saveNotes();
  render();
}

// ---------- 6. Delete note function ----------
function deleteNote(id) {
  notes = notes.filter((note) => note.id !== id);
  saveNotes();
  render();
}

// ---------- 7. Form submission and validation ----------
form.addEventListener("submit", (event) => {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    errorMessage.textContent = "Please type a note first.";
    return;
  }

  if (text.length > 200) {
    errorMessage.textContent = "Notes must be 200 characters or fewer.";
    return;
  }

  // Clear any existing error message on success
  errorMessage.textContent = "";

  addNote(text, categorySelect.value);

  input.value = "";
  input.focus();
});

// ---------- 8. Search functionality ----------
searchInput.addEventListener("input", (event) => {
  const searchTerm = event.target.value.toLowerCase();
  const filtered = notes.filter((note) =>
    note.text.toLowerCase().includes(searchTerm)
  );
  render(filtered);
});

// ---------- 9. Optional Bonus: Clear all notes ----------
clearAllBtn.addEventListener("click", () => {
  if (notes.length === 0) return;

  if (confirm("Delete all notes?")) {
    notes = [];
    saveNotes();
    render();
  }
});

// ---------- 10. Initial render on page load ----------
render();