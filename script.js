var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var modal = document.querySelector('dialog');
modal.addEventListener("close", function () {
    addBookModal.eraseInput();
});
var ReadingStatus;
(function (ReadingStatus) {
    ReadingStatus[ReadingStatus["NotStarted"] = 0] = "NotStarted";
    ReadingStatus[ReadingStatus["Reading"] = 1] = "Reading";
    ReadingStatus[ReadingStatus["Finished"] = 2] = "Finished";
})(ReadingStatus || (ReadingStatus = {}));
var DialogForm = function () {
    var dialogForm = document.createElement('form');
    dialogForm.method = "dialog";
    return dialogForm;
};
var InputSection = function () {
    var fragment = new DocumentFragment();
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
        fragment.appendChild(para);
    }
    return fragment;
};
var RadioButtons = function () {
    // Create radio buttons setting reading status
    var radioButtons = document.createElement('div');
    radioButtons.className = "radioButtons";
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
    return radioButtons;
};
var BookInfoSection = function () {
    var fragment = new DocumentFragment();
    var classNames = ['titleBox', 'authorBox', 'pageBox', 'statusBox'];
    for (var index = 0; index < 4; index++) {
        var p = document.createElement('p');
        p.className = classNames[index];
        fragment.append(p);
    }
    return fragment;
};
var Buttons = function (firstName, secondName, callBack) {
    if (callBack === void 0) { callBack = null; }
    var buttons = document.createElement('div');
    buttons.className = 'buttons';
    var firstButton = document.createElement('button');
    firstButton.textContent = firstName;
    if (callBack)
        firstButton.addEventListener('click', callBack);
    var secondButton = document.createElement('button');
    secondButton.textContent = secondName;
    buttons.appendChild(firstButton);
    buttons.appendChild(secondButton);
    return buttons;
};
var FilePicker = function () {
    var filePicker = document.createElement("input");
    filePicker.type = "file";
    var filePickerLabel = document.createElement("label");
    filePickerLabel.textContent = "Upload an Image";
    filePickerLabel.appendChild(filePicker);
    filePickerLabel.className = "filePickerLabel";
    filePicker.addEventListener("change", function (e) {
        var imageName = e.currentTarget.files[0].name;
        filePickerLabel.dataset.imageName = imageName;
    });
    return filePickerLabel;
};
var ViewBookModal = function () {
    var dialogForm = DialogForm();
    dialogForm.appendChild(BookInfoSection());
    dialogForm.appendChild(Buttons("Edit", "Cancel"));
    return dialogForm;
};
var InputBookModal = function () {
    var dialogForm = DialogForm();
    dialogForm.appendChild(InputSection());
    dialogForm.appendChild(FilePicker());
    dialogForm.appendChild(RadioButtons());
    dialogForm.appendChild(Buttons("Finish", "Cancel", function () {
        var book = addBookModal.getInput();
        var books = bookManager.updateBooks(book);
        bookManager.setBooks(books);
        renderBooks(bookManager.books, viewBookModal);
    }));
    return dialogForm;
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
var bookManager = {
    books: [
        { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
        { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
    ],
    currentBook: null,
    setBooks: function (books) {
        this.books = __spreadArray([], books, true);
    },
    updateBooks: function (newBook) {
        return __spreadArray(__spreadArray([], this.books, true), [newBook], false);
    },
    findBook: function (e) {
        // Turn the string dataset value to a number
        var bookId = +e.target.dataset.bookId;
        return this.books.find(function (book) { return book.id === bookId; });
    },
    setCurrentBook: function (book) {
        this.currentBook = book;
    },
    getCurrentBook: function () {
        return this.currentBook;
    },
};
var addBookModal = {
    modal: modal,
    form: InputBookModal(),
    getInput: function () {
        var title = this.form.querySelector("#Title").value;
        var author = this.form.querySelector("#Author").value;
        var pageNum = Number(this.form.querySelector("#PageNumber").value);
        var radioButtons = Array.from(this.form.querySelectorAll(".radioButtons label input"));
        var id = idCounter.assignIdCounter();
        var image = this.form.querySelector('input[type="file"]').files[0];
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
    openAddBookModal: function () {
        if (this.modal.hasChildNodes()) {
            this.modal.firstChild.replaceWith(this.form);
        }
        else
            modal.appendChild(this.form);
        modal.showModal();
    },
    eraseInput: function () {
        this.form.querySelector("#Title").value = "";
        this.form.querySelector("#Author").value = "";
        this.form.querySelector("#PageNumber").value = "";
        var radioButtons = Array.from(this.form.querySelectorAll(".radioButtons label input"));
        this.form.querySelector(".filePickerLabel").dataset.imageName = "";
        radioButtons.forEach(function (radioButton) {
            radioButton.checked = false;
        });
        this.form.querySelector('input[type="file"]').fileList = "";
    }
};
// const editBookModal: EditBookModal = {
//     modal: modal,
//     form: null,
//     inputData: null,
//     changeBooks(updatedBook: Book, books: Book[]) {
//         return books.map(book => {
//             if (book.id === updatedBook.id) {
//                 return updatedBook
//             }
//             else
//                 return book
//         })
//     },
//     setBooks(newBooks: Book[], books: Books) {
//         books.setBooks(newBooks)
//     },
//     getInputData() {
//         const title: string = this.form.querySelector("#Title").value
//         const author: string = this.form.querySelector("#Author").value
//         const pageNum: number = Number(this.form.querySelector("#PageNumber").value)
//         const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
//         const id: number = Number(this.form.dataset.bookId)
//         const image: string | null = null
//         let status: ReadingStatus;
//         if (radioButtons[0].checked) {
//             status = ReadingStatus.NotStarted
//         }
//         else if (radioButtons[1].checked) {
//             status = ReadingStatus.Reading
//         }
//         else
//             status = ReadingStatus.Finished
//         return { title, author, pageNum, status, id, image }
//     },
//     createForm() {
//         const editBookModal = document.createElement('form')
//         editBookModal.method = "dialog"
//         editBookModal.className = "editBookModal"
//         const labelNames: string[] = ['Title', 'Author', 'PageNumber']
//         for (let index = 0; index < 3; index++) {
//             const para = document.createElement('p')
//             const label = document.createElement('label')
//             label.textContent = labelNames[index];
//             label.htmlFor = labelNames[index];
//             let input
//             if (index === 2) {
//                 input = document.createElement('input')
//                 input.type = "number"
//             }
//             else input = document.createElement('input')
//             input.id = labelNames[index]
//             para.appendChild(label)
//             para.appendChild(input)
//             editBookModal.appendChild(para)
//         }
//         // Create radio buttons setting reading status
//         const radioButtons = document.createElement('div')
//         radioButtons.className = "radioButtons"
//         editBookModal.appendChild(radioButtons)
//         const radioButtonLabels = ["Haven't Started", "Reading Now", "Finished"]
//         for (let index = 0; index < 3; index++) {
//             const label = document.createElement('label')
//             label.textContent = radioButtonLabels[index]
//             const radioButton = document.createElement('input')
//             radioButton.type = "radio";
//             radioButton.name = "radio"
//             const span = document.createElement('span')
//             radioButtons.appendChild(label)
//             label.appendChild(radioButton)
//             label.appendChild(span)
//         }
//         const buttons = document.createElement('div')
//         buttons.className = 'buttons'
//         const okButton = document.createElement('button')
//         okButton.textContent = "ok"
//         okButton.className = "okButton"
//         const cancelButton = document.createElement('button')
//         cancelButton.className = "cancelButton"
//         cancelButton.textContent = "Cancel"
//         buttons.appendChild(okButton)
//         buttons.appendChild(cancelButton)
//         editBookModal.appendChild(buttons)
//         return editBookModal
//     },
//     openEditBookModal(book: Book) {
//         if (this.modal.hasChildNodes()) {
//             this.modal.firstChild?.replaceWith(this.form)
//         }
//         else
//             modal.appendChild(this.form)
//         this.form.dataset.bookId = book.id
//         this.form.querySelector("#Title").value = book.title
//         this.form.querySelector("#Author").value = book.author
//         this.form.querySelector("#PageNumber").value = book.pageNum
//         this.form.querySelector("button").addEventListener("click", () => {
//             const inputData = this.getInputData()
//             const newBooks = this.changeBooks(inputData, books.books)
//             books.setBooks(newBooks)
//         })
//         const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
//         if (book.status === ReadingStatus.NotStarted) {
//             radioButtons[0].checked = true
//         }
//         else if (book.status === ReadingStatus.Reading) {
//             radioButtons[1].checked = true
//         }
//         else
//             radioButtons[2].checked = true
//         modal.showModal()
//     }
// }
var viewBookModal = {
    modal: modal,
    form: ViewBookModal(),
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
function Book(title, pageNum, author, image, status) {
    this.title = title;
    this.pageNum = pageNum;
    this.author = author;
    this.image = image;
    this.status = status;
    this.id = idCounter.assignIdCounter();
}
function renderBooks(books, viewBookModal) {
    var booksContainer = document.querySelector('.booksContainer');
    booksContainer.textContent = "";
    books.forEach(function (book) {
        var bookImage = document.createElement("img");
        bookImage.className = "bookImage";
        if (book.image) {
            bookImage.src = URL.createObjectURL(book.image);
            bookImage.onload = function () {
                URL.revokeObjectURL(bookImage.src);
            };
        }
        else
            bookImage.src = "./assets/bookcover.jpg";
        bookImage.dataset.bookId = book.id.toString();
        bookImage.addEventListener("click", function (e) {
            var bookInfo = bookManager.findBook(e);
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
function initialize() {
    modal.addEventListener("click", cancelModalOutside);
    renderBooks(bookManager.books, viewBookModal);
    var addButton = document.querySelector('.addButton');
    addButton === null || addButton === void 0 ? void 0 : addButton.addEventListener("click", function () {
        addBookModal.openAddBookModal();
    });
}
initialize();
