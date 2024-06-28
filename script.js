var modal = document.querySelector('dialog');
var editBookModal = {
    modal: modal,
    form: null,
    inputData: null,
    changeBooks: function (updatedBook, books) {
        return books.map(function (book) {
            if (book.id === updatedBook.id) {
                return updatedBook;
            }
            else
                return book;
        });
    },
    setBooks: function (newBooks, books) {
        books.setBooks(newBooks);
    },
    getInputData: function () {
        var title = this.form.querySelector("#Title").value;
        var author = this.form.querySelector("#Author").value;
        var pageNum = Number(this.form.querySelector("#PageNumber").value);
        var radioButtons = Array.from(this.form.querySelectorAll(".radioButtons label input"));
        var id = Number(this.form.dataset.bookId);
        var image = null;
        var status;
        if (radioButtons[0].checked) {
            status = ReadingStatus.NotStarted;
        }
        else if (radioButtons[1].checked) {
            status = ReadingStatus.Reading;
        }
        else
            status = ReadingStatus.Finished;
        return { title: title, author: author, pageNum: pageNum, status: status, id: id, image: image };
    },
    createForm: function () {
        var editBookModal = document.createElement('form');
        editBookModal.method = "dialog";
        editBookModal.className = "editBookModal";
        var labelNames = ['Title', 'Author', 'PageNumber'];
        for (var index = 0; index < 3; index++) {
            var para = document.createElement('p');
            var label = document.createElement('label');
            label.textContent = labelNames[index];
            label.htmlFor = labelNames[index];
            var input = void 0;
            if (index === 2) {
                input = document.createElement('input');
                input.type = "number";
            }
            else
                input = document.createElement('input');
            input.id = labelNames[index];
            para.appendChild(label);
            para.appendChild(input);
            editBookModal.appendChild(para);
        }
        // Create radio buttons setting reading status
        var radioButtons = document.createElement('div');
        radioButtons.className = "radioButtons";
        editBookModal.appendChild(radioButtons);
        var radioButtonLabels = ["Haven't Started", "Reading Now", "Finished"];
        for (var index = 0; index < 3; index++) {
            var label = document.createElement('label');
            label.textContent = radioButtonLabels[index];
            var radioButton = document.createElement('input');
            radioButton.type = "radio";
            radioButton.name = "radio";
            var span = document.createElement('span');
            radioButtons.appendChild(label);
            label.appendChild(radioButton);
            label.appendChild(span);
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
    },
    openEditBookModal: function (book) {
        var _this = this;
        var _a;
        if (this.modal.hasChildNodes()) {
            (_a = this.modal.firstChild) === null || _a === void 0 ? void 0 : _a.replaceWith(this.form);
        }
        else
            modal.appendChild(this.form);
        this.form.dataset.bookId = book.id;
        this.form.querySelector("#Title").value = book.title;
        this.form.querySelector("#Author").value = book.author;
        this.form.querySelector("#PageNumber").value = book.pageNum;
        this.form.querySelector("button").addEventListener("click", function () {
            var inputData = _this.getInputData();
            var newBooks = _this.changeBooks(inputData, books.books);
            books.setBooks(newBooks);
        });
        var radioButtons = Array.from(this.form.querySelectorAll(".radioButtons label input"));
        if (book.status === ReadingStatus.NotStarted) {
            radioButtons[0].checked = true;
        }
        else if (book.status === ReadingStatus.Reading) {
            radioButtons[1].checked = true;
        }
        else
            radioButtons[2].checked = true;
        modal.showModal();
    }
};
var viewBookModal = {
    modal: modal,
    form: null,
    currentBook: null,
    setCurrentBook: function (book) {
        this.currentBook = book;
    },
    createForm: function () {
        var _this = this;
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
        editButton.addEventListener("click", function () { return editBookModal.openEditBookModal(_this.currentBook); });
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
        this.setCurrentBook(book);
        this.form.children[0].textContent = this.currentBook.title;
        this.form.children[1].textContent = 'Author: ' + this.currentBook.author;
        this.form.children[2].textContent = "".concat(this.currentBook.pageNum, " pages");
        this.form.children[3].textContent = 'Status: ' + (this.currentBook.status === ReadingStatus.NotStarted ? "Haven't read yet" : this.currentBook.status === ReadingStatus.Reading ? "Reading Now" : "Finished");
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
var books = {
    books: [
        { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
        { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
    ],
    setBooks: function (books) {
        this.books = books;
    }
};
function Book(title, pageNum, author, image, status) {
    this.title = title;
    this.pageNum = pageNum;
    this.author = author;
    this.image = image;
    this.status = status;
    this.id = idCounter.assignIdCounter();
}
// Book.prototype.setValues = function (newValues: Book) {
//     this.title = newValues.title
//     this.pageNum = newValues.pageNum
//     this.author = newValues.author
//     this.image = newValues.image
//     this.status = newValues.status
// }
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
    okButton.textContent = "Ok";
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
            var _a;
            var bookInfo = findBook(e);
            (_a = viewBookModal.seeBookInfo) === null || _a === void 0 ? void 0 : _a.call(viewBookModal, bookInfo);
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
    return books.books.find(function (book) { return book.id === bookId; });
}
function initialize() {
    modal.addEventListener("click", cancelModalOutside);
    viewBookModal.form = viewBookModal.createForm();
    editBookModal.form = editBookModal.createForm();
    renderBooks(books.books, viewBookModal);
}
initialize();
