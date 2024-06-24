/* Book Object */
var idCounter = 1;
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
        var image = document.createElement("div");
        image.className = "book";
        booksContainer.appendChild(image);
    });
}
function initialize() {
    renderBooks(books);
}
initialize();
