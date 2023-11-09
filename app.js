class Note {
    constructor(id, title, text) {
        this.id = id;
        this.title = title;
        this.text = text;
    }
}

class App {
    constructor() {
        this.notes = JSON.parse(localStorage.getItem("notes")) || [];

        this.selectedNoteId = "";
        this.miniSidebar = true;

        this.$activeForm = document.querySelector(".active-form");
        this.$inactiveForm = document.querySelector(".inactive-form");
        this.$noteTitle = document.querySelector("#note-title");
        this.$noteText = document.querySelector("#note-text");
        this.$notes = document.querySelector(".notes");
        this.$form = document.querySelector("#form");
        this.$modal = document.querySelector(".modal");
        this.$modalForm = document.querySelector("#modal-form");
        this.$modalTitle = document.querySelector("#modal-title");
        this.$modalText = document.querySelector("#modal-text");
        this.$closeModalForm = document.querySelector("#modal-btn");
        this.$sideBar = document.querySelector(".sidebar");

        this.addEventListeners();
        this.displayNotes();
    }

    addEventListeners() {
        document.body.addEventListener("click", (event) => {
            this.handleFormClick(event);
            this.closeModal(event);
            this.openModal(event);
            this.handleArchiving(event);
        });

        this.$form.addEventListener("submit", (event) => {
            event.preventDefault();
            const title = this.$noteTitle.value;
            const text = this.$noteText.value;
            this.addNote({title, text});
            this.closeActiveForm();
        })

        this.$modalForm.addEventListener("submit", (event) => {
            event.preventDefault();
        })

        this.$sideBar.addEventListener("mouseover", (event) => {
            this.handleToggleSidebar();
        })

        this.$sideBar.addEventListener("mouseout", (event) => {
            this.handleToggleSidebar();
        })
    }

    handleFormClick(event) {
        const isActiveFormClicked = this.$activeForm.contains(event.target);
        const isInactiveFormClicked = this.$inactiveForm.contains(event.target);

        const title = this.$noteTitle.value;
        const text = this.$noteText.value;

        if(isInactiveFormClicked) {
            this.openActiveForm();
        }
        else if(!isInactiveFormClicked && !isActiveFormClicked){
            this.addNote({title, text});
            this.closeActiveForm();
        }

    }

    openActiveForm() {
        this.$inactiveForm.style.display = "none";
        this.$activeForm.style.display = "block";
        this.$noteText.focus();
    }
    closeActiveForm() {
        this.$inactiveForm.style.display = "block";
        this.$activeForm.style.display = "none"; 
        this.$noteTitle.value = "";
        this.$noteText.value = "";
    }

    openModal(event) {
        const $selectedNote = event.target.closest(".note");
        if($selectedNote && !event.target.closest(".archive")) {
            this.selectedNoteId = $selectedNote.id;
            this.$modalTitle.value = $selectedNote.children[1].innerHTML;
            this.$modalText.value = $selectedNote.children[2].innerHTML;
            this.$modal.classList.add("open-modal");
        }
        else{
            return;
        }
    }

    closeModal(event) {
        const isModalFormClicked = this.$modalForm.contains(event.target);
        const isModalBtnClicked = this.$closeModalForm.contains(event.target);
        if ((!isModalFormClicked || isModalBtnClicked) && this.$modal.classList.contains("open-modal")) {
            this.editNote(this.selectedNoteId, {
                title: this.$modalTitle.value,
                text: this.$modalText.value,
            });
            this.$modal.classList.remove("open-modal");
        }
    }

    handleArchiving(event) {
        const $selectedNote = event.target.closest(".note");
        if($selectedNote && event.target.closest(".archive")) {
            this.selectedNoteId = $selectedNote.id;
            this.deleteNote(this.selectedNoteId)
        }
        else{
            return;
        }
    }

    addNote({ title, text }) {
        if (text != "") {
            const newNote = new Note(cuid(), title, text);
            this.notes = [...this.notes, newNote];
            this.render();
        }
    }

    editNote(id, { title, text }) {
        this.notes = this.notes.map((note) => {
        if (note.id == id) {
            note.title = title;
            note.text = text;
        }
        return note;
        });
        this.render();
    }
    handleMouseOverNote(element) {
        const $note = document.querySelector("#"+element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");

        $checkNote.style.visibility = "visible";
        $noteFooter.style.visibility = "visible";
    }

    handleMouseOutNote(element) {
        const $note = document.querySelector("#"+element.id);
        const $checkNote = $note.querySelector(".check-circle");
        const $noteFooter = $note.querySelector(".note-footer");

        $checkNote.style.visibility = "hidden";
        $noteFooter.style.visibility = "hidden";
    }

    handleToggleSidebar() {
        if(this.miniSidebar) {
            this.$sideBar.style.width = "250px";
            this.$sideBar.classList.add("sidebar-hover");
            this.$sideBar.querySelector(".active-item").classList.add("sidebar-active-item");
            this.miniSidebar = false;
        }
        else{
            this.$sideBar.style.width = "80px";
            this.$sideBar.classList.remove("sidebar-hover");
            this.$sideBar.querySelector(".active-item").classList.remove("sidebar-active-item");
            this.miniSidebar = true;
        }
    }

    saveNotes() {
        localStorage.setItem("notes", JSON.stringify(this.notes));
    }

    render() {
        this.saveNotes();
        this.displayNotes();
    }

        displayNotes() {
            this.$notes.innerHTML = this.notes.map((note) => 
            `
                <div class="note" id="${note.id}" onmouseover="app.handleMouseOverNote(this)" onmouseout="app.handleMouseOutNote(this)">
                    <span class="material-symbols-outlined check-circle">check_circle</span>
                    <div class="note-item-title">${note.title}</div>
                    <div class="note-item-text">${note.text}</div>
                    <div class="note-footer">
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">add_alert</span>
                            <span class="tooltip-text">Remind me</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">person_add</span>
                            <span class="tooltip-text">Collaborator</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">palette</span>
                            <span class="tooltip-text">Background options</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">image</span>
                            <span class="tooltip-text">Add image</span>
                        </div>
                        <div class="tooltip archive">
                            <span class="material-symbols-outlined hover footer-icon">archive</span>
                            <span class="tooltip-text">Archive</span>
                        </div>
                        <div class="tooltip">
                            <span class="material-symbols-outlined hover footer-icon">more_vert</span>
                            <span class="tooltip-text">More</span>
                        </div>
                    </div>
                </div>
            `
            ).join("");
        }


    deleteNote(id) {
        this.notes = this.notes.filter(note => note.id != id);
        this.render();
    }
}

const app = new App();