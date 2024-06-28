const modal = document.querySelector('dialog')!

interface IDCounter {
    idNumber: number,
    assignIdCounter: () => number,
    incrementIdCounter: () => void
}

interface ViewBookModal {
    modal: HTMLDialogElement,
    form: HTMLFormElement | null,
    currentBook?: Book | null,
    setCurrentBook?: (book: Book) => void,
    createForm: () => HTMLFormElement,
    seeBookInfo?: (book: Book) => void
}

interface EditBookModal extends ViewBookModal {
    inputData: Book | null,
    openEditBookModal: (book: Book) => void,
    changeBooks: (book: Book, books: Book[]) => Book[],
    setBooks: (newBooks: Book[], books: Books) => void,
    getInputData: () => Book
}

const editBookModal: EditBookModal = {
    modal: modal,
    form: null,
    inputData: null,
    changeBooks(updatedBook: Book, books: Book[]) {
        return books.map(book => {
            if (book.id === updatedBook.id) {
                return updatedBook
            }
            else
                return book
        })
    },
    setBooks(newBooks: Book[], books: Books) {
        books.setBooks(newBooks)
    },
    getInputData() {
        const title: string = this.form.querySelector("#Title").value
        const author: string = this.form.querySelector("#Author").value
        const pageNum: number = Number(this.form.querySelector("#PageNumber").value)
        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        const id: number = Number(this.form.dataset.bookId)
        const image: string | null = null
        let status: ReadingStatus;

        if (radioButtons[0].checked) {
            status = ReadingStatus.NotStarted
        }
        else if (radioButtons[1].checked) {
            status = ReadingStatus.Reading
        }
        else
            status = ReadingStatus.Finished

        return { title, author, pageNum, status, id, image }
    },
    createForm() {
        const editBookModal = document.createElement('form')
        editBookModal.method = "dialog"
        editBookModal.className = "editBookModal"
        const labelNames: string[] = ['Title', 'Author', 'PageNumber']

        for (let index = 0; index < 3; index++) {
            const para = document.createElement('p')
            const label = document.createElement('label')
            label.textContent = labelNames[index];
            label.htmlFor = labelNames[index];
            let input
            if (index === 2) {
                input = document.createElement('input')
                input.type = "number"
            }
            else input = document.createElement('input')
            input.id = labelNames[index]

            para.appendChild(label)
            para.appendChild(input)
            editBookModal.appendChild(para)
        }

        // Create radio buttons setting reading status
        const radioButtons = document.createElement('div')
        radioButtons.className = "radioButtons"
        editBookModal.appendChild(radioButtons)
        const radioButtonLabels = ["Haven't Started", "Reading Now", "Finished"]

        for (let index = 0; index < 3; index++) {
            const label = document.createElement('label')
            label.textContent = radioButtonLabels[index]
            const radioButton = document.createElement('input')
            radioButton.type = "radio";
            radioButton.name = "radio"
            const span = document.createElement('span')

            radioButtons.appendChild(label)
            label.appendChild(radioButton)
            label.appendChild(span)
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
    },
    openEditBookModal(book: Book) {
        if (this.modal.hasChildNodes()) {
            this.modal.firstChild?.replaceWith(this.form)
        }
        else
            modal.appendChild(this.form)

        this.form.dataset.bookId = book.id
        this.form.querySelector("#Title").value = book.title
        this.form.querySelector("#Author").value = book.author
        this.form.querySelector("#PageNumber").value = book.pageNum
        this.form.querySelector("button").addEventListener("click", () => {
            const inputData = this.getInputData()
            const newBooks = this.changeBooks(inputData, books.books)
            books.setBooks(newBooks)
        })

        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        if (book.status === ReadingStatus.NotStarted) {
            radioButtons[0].checked = true
        }
        else if (book.status === ReadingStatus.Reading) {
            radioButtons[1].checked = true
        }
        else
            radioButtons[2].checked = true
        modal.showModal()
    }
}

const viewBookModal: ViewBookModal = {
    modal: modal,
    form: null,
    currentBook: null,
    setCurrentBook(book: Book) {
        this.currentBook = book
    },
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
        editButton.addEventListener("click", () => editBookModal.openEditBookModal(this.currentBook))
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

        this.setCurrentBook(book)

        this.form.children[0].textContent = this.currentBook.title
        this.form.children[1].textContent = 'Author: ' + this.currentBook.author
        this.form.children[2].textContent = `${this.currentBook.pageNum} pages`
        this.form.children[3].textContent = 'Status: ' + (this.currentBook.status === ReadingStatus.NotStarted ? "Haven't read yet" : this.currentBook.status === ReadingStatus.Reading ? "Reading Now" : "Finished")

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

interface Books {
    books: Book[],
    setBooks: (books: Book[]) => void
}

const books: Books = {
    books: [
        { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
        { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
    ],
    setBooks(books: Book[]) {
        this.books = books
    }
}

function Book(title: string, pageNum: number, author: string, image: string | null, status: ReadingStatus) {
    this.title = title
    this.pageNum = pageNum
    this.author = author
    this.image = image
    this.status = status
    this.id = idCounter.assignIdCounter()
}

// Book.prototype.setValues = function (newValues: Book) {
//     this.title = newValues.title
//     this.pageNum = newValues.pageNum
//     this.author = newValues.author
//     this.image = newValues.image
//     this.status = newValues.status
// }


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
    okButton.textContent = "Ok"
    okButton.className = "okButton"
    const cancelButton = document.createElement('button')
    cancelButton.className = "cancelButton"
    cancelButton.textContent = "Cancel"

    buttons.appendChild(okButton)
    buttons.appendChild(cancelButton)
    editBookModal.appendChild(buttons)

    return editBookModal
}

function renderBooks(books: Book[], viewBookModal: ViewBookModal) {
    const booksContainer = document.querySelector('.booksContainer')!

    books.forEach(book => {
        const bookImage = document.createElement("img")
        bookImage.className = "bookImage"
        bookImage.src = book.image || "./assets/bookcover.jpg"
        bookImage.dataset.bookId = book.id.toString()
        bookImage.addEventListener("click", (e) => {
            const bookInfo = findBook(e)!
            viewBookModal.seeBookInfo?.(bookInfo)
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
    return books.books.find(book => book.id === bookId)
}

function initialize() {
    modal.addEventListener("click", cancelModalOutside)

    viewBookModal.form = viewBookModal.createForm()
    editBookModal.form = editBookModal.createForm()

    renderBooks(books.books, viewBookModal)
}

initialize()
