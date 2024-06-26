var modal = document.querySelector('dialog');
// const viewBookModal: HTMLFormElement = createViewBookModal()
var editBookModal = createEditBookModal();
var viewBookModal = {
    modal: modal,
    form: null,
    createForm: function () {
        var viewBookModal = document.createElement('form');
        viewBookModal.method = "dialog";
        viewBookModal.className = "viewBookModal";
        var boxes = [];
        var classNames = ['titleBox', 'authorBox', 'pageBox', 'statusBox'];
        for (var index = 0; index < 4; index++) {
            boxes.push(document.createElement('p'));
            boxes[index].className = classNames[index];
            viewBookModal.appendChild(boxes[index]);
        }
        var buttons = document.createElement('div');
        buttons.className = 'buttons';
        var editButton = document.createElement('button');
        editButton.className = "editButton";
        editButton.textContent = "Edit";
        editButton.addEventListener("click", function () { return openEditBookModal(editBookModal, modal); });
        var cancelButton = document.createElement('button');
        cancelButton.className = "cancelButton";
        cancelButton.textContent = "Cancel";
        buttons.appendChild(editButton);
        buttons.appendChild(cancelButton);
        viewBookModal.appendChild(buttons);
        return viewBookModal;
    },
    seeBookInfo: function (book) {
        var _a;
        if (this.modal.hasChildNodes()) {
            (_a = this.modal.firstChild) === null || _a === void 0 ? void 0 : _a.replaceWith(this.form);
        }
        else
            modal.appendChild(this.form);
        this.form.children[0].textContent = book.title;
        this.form.children[1].textContent = 'Author: ' + book.author;
        this.form.children[2].textContent = "".concat(book.pageNum, " pages");
        this.form.children[3].textContent = 'Status: ' + (book.status === ReadingStatus.NotStarted ? "Haven't read yet" : book.status === ReadingStatus.Reading ? "Reading Now" : "Finished");
        modal.showModal();
    }
};
var idCounter = {
    idNumber: 0,
    assignIdCounter: function () {
        this.incrementIdCounter();
        return this.idNumber;
    },
    incrementIdCounter: function () {
        this.idNumber = ++this.idNumber;
    }
};
var ReadingStatus;
(function (ReadingStatus) {
    ReadingStatus[ReadingStatus["NotStarted"] = 0] = "NotStarted";
    ReadingStatus[ReadingStatus["Reading"] = 1] = "Reading";
    ReadingStatus[ReadingStatus["Finished"] = 2] = "Finished";
})(ReadingStatus || (ReadingStatus = {}));
var books = [
    { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
    { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
];
function Book(title, pageNum, author, image, status) {
    this.title = title;
    this.pageNum = pageNum;
    this.author = author;
    this.image = image;
    this.status = status;
    this.id = idCounter.assignIdCounter();
}
Book.prototype.setValues = function (newValues) {
    this.title = newValues.title;
    this.pageNum = newValues.pageNum;
    this.author = newValues.author;
    this.image = newValues.image;
    this.status = newValues.status;
};
function createEditBookModal() {
    var editBookModal = document.createElement('form');
    editBookModal.method = "dialog";
    editBookModal.className = "editBookModal";
    var labelNames = ['Title', 'Author', 'Page Number', 'Status'];
    for (var index = 0; index < 4; index++) {
        var para = document.createElement('p');
        var label = document.createElement('label');
        label.textContent = labelNames[index];
        label.htmlFor = labelNames[index];
        var input = document.createElement('input');
        input.id = labelNames[index];
        para.appendChild(label);
        para.appendChild(input);
        editBookModal.appendChild(para);
    }
    var buttons = document.createElement('div');
    buttons.className = 'buttons';
    var okButton = document.createElement('button');
    okButton.textContent = "ok";
    okButton.className = "okButton";
    var cancelButton = document.createElement('button');
    cancelButton.className = "cancelButton";
    cancelButton.textContent = "Cancel";
    buttons.appendChild(okButton);
    buttons.appendChild(cancelButton);
    editBookModal.appendChild(buttons);
    return editBookModal;
}
function renderBooks(books, viewBookModal) {
    var booksContainer = document.querySelector('.booksContainer');
    books.forEach(function (book) {
        var bookImage = document.createElement("img");
        bookImage.className = "bookImage";
        bookImage.src = book.image || "./assets/bookcover.jpg";
        bookImage.dataset.bookId = book.id.toString();
        bookImage.addEventListener("click", function (e) {
            var bookInfo = findBook(e);
            viewBookModal.seeBookInfo(bookInfo);
        });
        booksContainer.appendChild(bookImage);
    });
}
function cancelModalOutside(e) {
    if (e.target === modal) {
        modal.close();
    }
}
function openEditBookModal(editBookModal, modal) {
    var _a;
    if (modal.hasChildNodes()) {
        (_a = modal.firstChild) === null || _a === void 0 ? void 0 : _a.replaceWith(editBookModal);
    }
    else
        modal.appendChild(editBookModal);
    modal.showModal;
}
function fillEditBookModal() {
}
function findBook(e) {
    // Turn the string dataset value to a number
    var bookId = +e.target.dataset.bookId;
    return books.find(function (book) { return book.id === bookId; });
}
function initialize() {
    modal.addEventListener("click", cancelModalOutside);
    viewBookModal.form = viewBookModal.createForm();
    renderBooks(books, viewBookModal);
}
initialize();
