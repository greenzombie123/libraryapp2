const modal = document.querySelector('dialog')!
// const viewBookModal: HTMLFormElement = createViewBookModal()
const editBookModal: HTMLFormElement = createEditBookModal()


interface IDCounter {
    idNumber: number,
    assignIdCounter: () => number,
    incrementIdCounter: () => void
}

interface ViewBookModal {
    modal: HTMLDialogElement,
    form: HTMLFormElement | null,
    createForm: () => HTMLFormElement,
    seeBookInfo: (book: Book) => void
}

const viewBookModal: ViewBookModal = {
    modal: modal,
    form: null,
    createForm() {

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
        editButton.addEventListener("click", () => openEditBookModal(editBookModal, modal))
        const cancelButton = document.createElement('button')
        cancelButton.className = "cancelButton"
        cancelButton.textContent = "Cancel"

        buttons.appendChild(editButton)
        buttons.appendChild(cancelButton)
        viewBookModal.appendChild(buttons)

        return viewBookModal
    },

    seeBookInfo(book: Book) {
        if (this.modal.hasChildNodes()) {
            this.modal.firstChild?.replaceWith(this.form)
        }
        else
            modal.appendChild(this.form)
    
        this.form.children[0].textContent = book.title
        this.form.children[1].textContent = 'Author: ' + book.author
        this.form.children[2].textContent = `${book.pageNum} pages`
        this.form.children[3].textContent = 'Status: ' + (book.status === ReadingStatus.NotStarted ? "Haven't read yet" : book.status === ReadingStatus.Reading ? "Reading Now" : "Finished")
    
        modal.showModal()
    }
}

const idCounter: IDCounter = {
    idNumber: 0,
    assignIdCounter() {
        this.incrementIdCounter()
        return this.idNumber
    },
    incrementIdCounter() {
        this.idNumber = ++this.idNumber
    }
}

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
    { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
    { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
]

function Book(title: string, pageNum: number, author: string, image: string | null, status: ReadingStatus) {
    this.title = title
    this.pageNum = pageNum
    this.author = author
    this.image = image
    this.status = status
    this.id = idCounter.assignIdCounter()
}

Book.prototype.setValues = function (newValues: Book) {
    this.title = newValues.title
    this.pageNum = newValues.pageNum
    this.author = newValues.author
    this.image = newValues.image
    this.status = newValues.status
}


function createEditBookModal() {

    const editBookModal = document.createElement('form')
    editBookModal.method = "dialog"
    editBookModal.className = "editBookModal"
    const labelNames: string[] = ['Title', 'Author', 'Page Number', 'Status']

    for (let index = 0; index < 4; index++) {
        const para = document.createElement('p')
        const label = document.createElement('label')
        label.textContent = labelNames[index];
        label.htmlFor = labelNames[index];
        const input = document.createElement('input')
        input.id = labelNames[index]

        para.appendChild(label)
        para.appendChild(input)
        editBookModal.appendChild(para)
    }

    const buttons = document.createElement('div')
    buttons.className = 'buttons'

    const okButton = document.createElement('button')
    okButton.textContent = "ok"
    okButton.className = "okButton"
    const cancelButton = document.createElement('button')
    cancelButton.className = "cancelButton"
    cancelButton.textContent = "Cancel"

    buttons.appendChild(okButton)
    buttons.appendChild(cancelButton)
    editBookModal.appendChild(buttons)

    return editBookModal
}

function renderBooks(books: Book[], viewBookModal:ViewBookModal) {
    const booksContainer = document.querySelector('.booksContainer')!

    books.forEach(book => {
        const bookImage = document.createElement("img")
        bookImage.className = "bookImage"
        bookImage.src = book.image || "./assets/bookcover.jpg"
        bookImage.dataset.bookId = book.id.toString()
        bookImage.addEventListener("click", (e) => {
            const bookInfo = findBook(e)!
            viewBookModal.seeBookInfo(bookInfo)
        })
        booksContainer.appendChild(bookImage)
    })
}

function cancelModalOutside(e: Event) {
    if (e.target === modal) {
        modal.close()
    }
}

function openEditBookModal(editBookModal: HTMLFormElement, modal: HTMLDialogElement) {
    if (modal.hasChildNodes()) {
        modal.firstChild?.replaceWith(editBookModal)
    }
    else
        modal.appendChild(editBookModal)
    modal.showModal
}

function fillEditBookModal() {

}

function findBook(e: Event) {
    // Turn the string dataset value to a number
    const bookId = +(e.target as HTMLElement).dataset.bookId!
    return books.find(book => book.id === bookId)
}

function initialize() {
    modal.addEventListener("click", cancelModalOutside)

    viewBookModal.form = viewBookModal.createForm()

    renderBooks(books, viewBookModal)
}

initialize()
