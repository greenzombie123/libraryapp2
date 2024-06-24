let idCounter = 1
const modal = document.querySelector('dialog')!

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
        const bookImage = document.createElement("img")
        bookImage.className = "bookImage"
        bookImage.src = book.image || "./assets/bookcover.jpg"
        bookImage.dataset.bookId = book.id.toString()
        bookImage.addEventListener("click", (e)=>{
            const bookInfo = findBook(e)
            console.log(bookInfo)
        })
        booksContainer.appendChild(bookImage)
    })
}

function seeBookInfo(book:Book){

}

function findBook(e:Event){
    // Turn the string dataset value to a number
    const bookId = +(e.target as HTMLElement).dataset.bookId!
    return books.find(book=>book.id === bookId)
}

function initialize(){
    renderBooks(books)
}

initialize()