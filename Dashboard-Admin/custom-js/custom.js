
// ------sidebar--toggle-------

const $button = document.querySelector('#sidebar-toggle');
const $wrapper = document.querySelector('#wrapper');

$button.addEventListener('click', (e) => {
    e.preventDefault();
    $wrapper.classList.toggle('toggled');
});


//--background---color--mode--change-
function toggleBackground() {
    // Select all elements to change
    const elements = document.querySelectorAll(' .header-bg, .sidebar-bg, .logo, .footer, a, i, .bg-light-color');

    // Toggle the 'dark-mode' class for each element
    elements.forEach(element => {
        element.classList.toggle('dark-mode');
    });
}


// -----------right--side-list-box-----------  

function toggleListBox() {
    const listBox = document.getElementById('listBox');
    listBox.classList.toggle('open');
}


//---------sticky--right--side------------ 

document.addEventListener('DOMContentLoaded', loadNotes);

function addNote(text = '', x = 50, y = 50) {
    const note = document.createElement('div');
    note.classList.add('note');
    note.setAttribute('draggable', true);

    // Set note position
    note.style.left = `${x}px`;
    note.style.top = `${y}px`;

    note.innerHTML = `
            <button class="delete-btn" onclick="deleteNote(this)">×</button>
            <textarea oninput="saveNotes()">${text}</textarea>
        `;

    note.addEventListener('mousedown', startDrag);
    document.body.appendChild(note);
    saveNotes();
}

function deleteNote(button) {
    button.parentElement.remove();
    saveNotes();
}

function saveNotes() {
    const notes = document.querySelectorAll('.note');
    const data = [];

    notes.forEach(note => {
        const textarea = note.querySelector('textarea');
        const position = note.getBoundingClientRect();
        data.push({
            text: textarea.value,
            x: position.left,
            y: position.top
        });
    });

    localStorage.setItem('stickyNotes', JSON.stringify(data));
}

function loadNotes() {
    const savedNotes = JSON.parse(localStorage.getItem('stickyNotes')) || [];
    savedNotes.forEach(note => addNote(note.text, note.x, note.y));
}

let draggedNote = null;
let offsetX = 0;
let offsetY = 0;

function startDrag(event) {
    draggedNote = event.currentTarget;
    offsetX = event.clientX - draggedNote.getBoundingClientRect().left;
    offsetY = event.clientY - draggedNote.getBoundingClientRect().top;

    draggedNote.classList.add('dragging');

    document.addEventListener('mousemove', moveNote);
    document.addEventListener('mouseup', stopDrag);
}

function moveNote(event) {
    if (draggedNote) {
        draggedNote.style.left = `${event.clientX - offsetX}px`;
        draggedNote.style.top = `${event.clientY - offsetY}px`;
    }
}

function stopDrag() {
    if (draggedNote) {
        draggedNote.classList.remove('dragging');
        saveNotes();
        draggedNote = null;
        document.removeEventListener('mousemove', moveNote);
        document.removeEventListener('mouseup', stopDrag);
    }
}


//------Calendar---------

let date = new Date();
let currentMonth = date.getMonth();
let currentYear = date.getFullYear();

const monthYear = document.getElementById('monthYear');
const calendarBody = document.getElementById('calendarBody');

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

function renderCalendar() {
    calendarBody.innerHTML = '';
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    monthYear.textContent = `${months[currentMonth]} ${currentYear}`;

    // Empty slots for days before the first day
    for (let i = 0; i < firstDay; i++) {
        const emptyDiv = document.createElement('div');
        calendarBody.appendChild(emptyDiv);
    }

    // Days in month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.textContent = day;

        if (
            day === date.getDate() &&
            currentMonth === date.getMonth() &&
            currentYear === date.getFullYear()
        ) {
            dayDiv.classList.add('current-day');
        }

        calendarBody.appendChild(dayDiv);
    }
}

function prevMonth() {
    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar();
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

// Initialize calendar
renderCalendar();


  

