"use strict";

let notes = [];

function loadAllNotes() {
    notes = JSON.parse(localStorage.getItem("notes")) || [];

    const notesList = document.querySelector("#notesList");
    const noteTemplate = document.querySelector("#noteTemplate").content;

    for (const note of notes) {
        const fragment = noteTemplate.cloneNode(true);
        const el = fragment.querySelector(".Note");

        el.setAttribute("note-id", note.id);
        el.querySelector(".noteName h1").textContent = note.name;
        el.querySelector(".noteDate h1").textContent = note.date;

        notesList.prepend(fragment);
    }

    const noteId = location.search.startsWith("?note=") && location.search.slice(6);
    const el = noteId && document.querySelector(".Note[note-id=\"" + noteId + "\"]");
    noteSel(el);
}

function saveAllNotes() {
    localStorage.setItem("notes", JSON.stringify(notes));
}

function noteAdd() {
    const nextId = Number(localStorage.getItem("nextId")) || 1;
    localStorage.setItem("nextId", nextId + 1);

    const d = new Date();
    const date = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + " " +
        ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2);

    const note = { id: nextId, name: "", text: "", date };
    notes.push(note);

    const notesList = document.querySelector("#notesList");
    const noteTemplate = document.querySelector("#noteTemplate").content;
    const fragment = noteTemplate.cloneNode(true);
    const el = fragment.querySelector(".Note");

    el.setAttribute("note-id", note.id);
    el.querySelector(".noteName h1").textContent = note.name;
    el.querySelector(".noteDate h1").textContent = note.date;

    notesList.prepend(fragment);

    noteSel(el);
}

function noteDel() {
    const el = document.querySelector(".Note-Selected");

    if (!el) {
        return;
    }

    const noteId = el.getAttribute("note-id");
    const index = notes.findIndex(note => note.id == noteId);
    notes.splice(index, 1);

    noteSel(el.nextElementSibling || el.previousElementSibling);
    el.remove();
    saveAllNotes()
}

function noteSel(el) {
    if (!el) {
        history.replaceState("", "", location.pathname);
        return;
    }

    if (el.classList.contains("Note-Selected")) {
        return;
    }

    const noteId = el.getAttribute("note-id");
    const note = notes.find(note => note.id == noteId);

    const inputTitle = document.querySelector("#title");
    const elName = el.querySelector(".noteName h1");
    inputTitle.value = note.name;
    inputTitle.oninput = ((e) => elName.textContent = note.name = e.target.value);

    const inputContent = document.querySelector("#content");
    inputContent.value = note.text;
    inputContent.oninput = ((e) => note.text = e.target.value);

    el.parentElement.querySelectorAll(".Note-Selected").forEach(x => x.classList.remove("Note-Selected"));
    el.classList.add("Note-Selected");

    history.replaceState("", "", "?note=" + noteId);
}
