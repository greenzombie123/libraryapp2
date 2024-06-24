var idCounter = 1;
var modal = document.querySelector('dialog');
var ReadingStatus;
(function (ReadingStatus) {
    ReadingStatus[ReadingStatus["NotStarted"] = 0] = "NotStarted";
    ReadingStatus[ReadingStatus["Reading"] = 1] = "Reading";
    ReadingStatus[ReadingStatus["Finished"] = 2] = "Finished";
})(ReadingStatus || (ReadingStatus = {}));
var books = [
    { title: "WOw", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter }
];
function incrementIDCounter() {
    idCounter = +idCounter;
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
function renderBooks(books) {
    var booksContainer = document.querySelector('.booksContainer');
    books.forEach(function (book) {
        var bookImage = document.createElement("img");
        bookImage.className = "bookImage";
        bookImage.src = book.image || "./assets/bookcover.jpg";
        bookImage.dataset.bookId = book.id.toString();
        bookImage.addEventListener("click", function (e) {
            var bookInfo = findBook(e);
            console.log(bookInfo);
        });
        booksContainer.appendChild(bookImage);
    });
}
function seeBookInfo(book) {
}
function findBook(e) {
    // Turn the string dataset value to a number
    var bookId = +e.target.dataset.bookId;
    return books.find(function (book) { return book.id === bookId; });
}
function initialize() {
    renderBooks(books);
}
initialize();
