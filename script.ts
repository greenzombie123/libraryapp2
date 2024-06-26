let idCounter = 1
const modal = document.querySelector('dialog')!
const viewBookModal: HTMLFormElement = createViewBookModal()

// modal.addEventListener("click", ()=>modal.close())
// modal.addEventListener('click', (e)=>e.stopPropagation())

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
    id: number
}

const books: Book[] = [
    { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter }, 
    { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: incrementIDCounter() }
]

function incrementIDCounter() {
    idCounter = ++idCounter
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

function createViewBookModal() {

    const viewBookModal = document.createElement('form')
    viewBookModal.method = "dialog"
    viewBookModal.className = "viewBookModal"
    const boxes: HTMLParagraphElement[] = []
    const classNames: string[] = ['titleBox', 'authorBox', 'pageBox', 'statusBox']

    for (let index = 0; index < 4; index++) {
        boxes.push(document.createElement('p'))
        boxes[index].className = classNames[index]
        viewBookModal.appendChild(boxes[index])
    }

    const buttons = document.createElement('div')
    buttons.className = 'buttons'

    const editButton = document.createElement('button')
    editButton.className = "editButton"
    editButton.textContent = "Edit"
    const cancelButton = document.createElement('button')
    cancelButton.className = "cancelButton"
    cancelButton.textContent = "Cancel"

    buttons.appendChild(editButton)
    buttons.appendChild(cancelButton)
    viewBookModal.appendChild(buttons)

    return viewBookModal
}

function renderBooks(books: Book[]) {
    const booksContainer = document.querySelector('.booksContainer')!

    books.forEach(book => {
        const bookImage = document.createElement("img")
        bookImage.className = "bookImage"
        bookImage.src = book.image || "./assets/bookcover.jpg"
        bookImage.dataset.bookId = book.id.toString()
        bookImage.addEventListener("click", (e) => {
            const bookInfo = findBook(e)!
            seeBookInfo(bookInfo, viewBookModal, modal)
        })
        booksContainer.appendChild(bookImage)
    })
}

function cancelModalOutside(e: Event) {
    if (e.target === modal) {
        modal.close()
    }
}

function seeBookInfo(book: Book, viewBookModal: HTMLFormElement, modal: HTMLDialogElement) {
    if (modal.hasChildNodes()) {
        modal.firstChild?.replaceWith(viewBookModal)
    }
    else
        modal.appendChild(viewBookModal)

    viewBookModal.children[0].textContent = book.title
    viewBookModal.children[1].textContent = 'Author: ' + book.author
    viewBookModal.children[2].textContent = `${book.pageNum} pages`
    viewBookModal.children[3].textContent = 'Status: ' + (book.status === ReadingStatus.NotStarted ? "Haven't read yet" : book.status === ReadingStatus.Reading ? "Reading Now" : "Finished")

    modal.showModal()
}

function findBook(e: Event) {
    // Turn the string dataset value to a number
    const bookId = +(e.target as HTMLElement).dataset.bookId!
    return books.find(book => book.id === bookId)
}

function initialize() {
    modal.addEventListener("click", cancelModalOutside)

    renderBooks(books)
}

initialize()
