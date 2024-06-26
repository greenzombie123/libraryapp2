var idCounter = 1;
var modal = document.querySelector('dialog');
var viewBookModal = createViewBookModal();
// modal.addEventListener("click", ()=>modal.close())
// modal.addEventListener('click', (e)=>e.stopPropagation())
var ReadingStatus;
(function (ReadingStatus) {
    ReadingStatus[ReadingStatus["NotStarted"] = 0] = "NotStarted";
    ReadingStatus[ReadingStatus["Reading"] = 1] = "Reading";
    ReadingStatus[ReadingStatus["Finished"] = 2] = "Finished";
})(ReadingStatus || (ReadingStatus = {}));
var books = [
    { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter },
    { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: incrementIDCounter() }
];
function incrementIDCounter() {
    idCounter = ++idCounter;
    return idCounter;
}
function Book(title, pageNum, author, image, status) {
    this.title = title;
    this.pageNum = pageNum;
    this.author = author;
    this.image = image;
    this.status = status;
    this.id = incrementIDCounter();
}
Book.prototype.setValues = function (newValues) {
    this.title = newValues.title;
    this.pageNum = newValues.pageNum;
    this.author = newValues.author;
    this.image = newValues.image;
    this.status = newValues.status;
};
function createViewBookModal() {
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
    var cancelButton = document.createElement('button');
    cancelButton.className = "cancelButton";
    cancelButton.textContent = "Cancel";
    buttons.appendChild(editButton);
    buttons.appendChild(cancelButton);
    viewBookModal.appendChild(buttons);
    return viewBookModal;
}
function renderBooks(books) {
    var booksContainer = document.querySelector('.booksContainer');
    books.forEach(function (book) {
        var bookImage = document.createElement("img");
        bookImage.className = "bookImage";
        bookImage.src = book.image || "./assets/bookcover.jpg";
        bookImage.dataset.bookId = book.id.toString();
        bookImage.addEventListener("click", function (e) {
            var bookInfo = findBook(e);
            seeBookInfo(bookInfo, viewBookModal, modal);
        });
        booksContainer.appendChild(bookImage);
    });
}
function cancelModalOutside(e) {
    if (e.target === modal) {
        modal.close();
    }
}
function seeBookInfo(book, viewBookModal, modal) {
    var _a;
    if (modal.hasChildNodes()) {
        (_a = modal.firstChild) === null || _a === void 0 ? void 0 : _a.replaceWith(viewBookModal);
    }
    else
        modal.appendChild(viewBookModal);
    viewBookModal.children[0].textContent = book.title;
    viewBookModal.children[1].textContent = 'Author: ' + book.author;
    viewBookModal.children[2].textContent = "".concat(book.pageNum, " pages");
    viewBookModal.children[3].textContent = 'Status: ' + (book.status === ReadingStatus.NotStarted ? "Haven't read yet" : book.status === ReadingStatus.Reading ? "Reading Now" : "Finished");
    modal.showModal();
}
function findBook(e) {
    // Turn the string dataset value to a number
    var bookId = +e.target.dataset.bookId;
    return books.find(function (book) { return book.id === bookId; });
}
function initialize() {
    modal.addEventListener("click", cancelModalOutside);
    renderBooks(books);
}
initialize();
