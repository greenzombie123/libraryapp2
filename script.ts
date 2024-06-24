/* Book Object */
let idCounter = 1

enum ReadingStatus {
    NotStarted,
    Reading,
    Finished
}

interface Book {
    title: string;
    pageNum: number;
    author: string;
    image: string | null;
    status: ReadingStatus;
    id:number
}

const books: Book[] = [
    { title: "WOw", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id:idCounter }
]

function incrementIDCounter(){
    idCounter = +idCounter
    return idCounter
}

function Book(title: string, pageNum: number, author: string, image: string | null, status: ReadingStatus) {
    this.title = title
    this.pageNum = pageNum
    this.author = author
    this.image = image
    this.status = status
    this.id = incrementIDCounter()
}

Book.prototype.setValues = function (newValues: Book) {
    this.title = newValues.title
    this.pageNum = newValues.pageNum
    this.author = newValues.author
    this.image = newValues.image
    this.status = newValues.status
}

function renderBooks(books: Book[]) {
    const booksContainer = document.querySelector('.booksContainer')!

    books.forEach(book => {
        const image = document.createElement("div")
        image.className = "book"

        booksContainer.appendChild(image)
    })
}

function initialize(){
    renderBooks(books)
}

initialize()