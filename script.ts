const modal = document.querySelector('dialog')!
modal.addEventListener("close", () => {
    addBookModal.eraseInput()
    editBookModal.eraseInput()
})

interface BookManager {
    books: Book[],
    currentBook: Book | null,
    setBooks: (books: Book[]) => void,
    updateBooks: (newBook: Book) => Book[],
    findBook: (event: Event) => Book,
    setCurrentBook: (book: Book) => void,
    getCurrentBook: () => Book,
    editBooks: (newBook: Book) => void
}

interface IDCounter {
    idNumber: number,
    assignIdCounter: () => number,
    incrementIdCounter: () => void
}

interface Modal {
    modal: HTMLDialogElement,
    form: HTMLFormElement,
    getInput?: () => Book,
    eraseInput?: () => void
}

interface ViewBookModal extends Modal {
    seeBookInfo: (book: Book) => void
}

interface EditBookModal extends Modal {
    currentImage:File | null,
    openEditBookModal: (book: Book) => void,
    getInput: () => Book,
    eraseInput: () => void
}

interface AddBookModal extends Modal {
    openAddBookModal: () => void,
    getInput: () => Book,
    eraseInput: () => void
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
    image: File | null;
    status: ReadingStatus;
    id: number
}

const DialogForm = () => {
    const dialogForm = document.createElement('form')
    dialogForm.method = "dialog"

    return dialogForm
}

const InputSection = () => {
    const fragment = new DocumentFragment()
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
        fragment.appendChild(para)
    }
    return fragment
}

const RadioButtons = () => {
    // Create radio buttons setting reading status
    const radioButtons = document.createElement('div')
    radioButtons.className = "radioButtons"
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

    return radioButtons
}

const BookInfoSection = () => {
    const fragment = new DocumentFragment()
    const classNames: string[] = ['titleBox', 'authorBox', 'pageBox', 'statusBox']

    for (let index = 0; index < 4; index++) {
        const p = document.createElement('p')
        p.className = classNames[index]
        fragment.append(p)
    }

    return fragment
}

const Buttons = (firstName: string, callBack: EventListener) => {
    const buttons = document.createElement('div')
    buttons.className = 'buttons'

    const firstButton = document.createElement('button')
    firstButton.textContent = firstName
    if (callBack) firstButton.addEventListener('click', callBack)
    const secondButton = document.createElement('button')
    secondButton.textContent = "Close"
    buttons.appendChild(firstButton)
    buttons.appendChild(secondButton)

    return buttons
}

const FilePicker = () => {
    const filePicker = document.createElement("input")
    filePicker.type = "file"

    const filePickerLabel = document.createElement("label")
    filePickerLabel.textContent = "Upload an Image"
    filePickerLabel.appendChild(filePicker)
    filePickerLabel.className = "filePickerLabel"

    filePicker.addEventListener("change", (e) => {
        const imageName = (e.currentTarget! as HTMLInputElement).files![0].name
        filePickerLabel.dataset.imageName = imageName
    })

    return filePickerLabel
}

interface DialogForm {
    (firstButtonName: string, firstButtonCallBack: () => void): HTMLFormElement
}


const ViewBookModal: DialogForm = (firstButtonName, firstButtonCallBack) => {
    const dialogForm = DialogForm()
    dialogForm.appendChild(BookInfoSection())
    dialogForm.appendChild(Buttons(firstButtonName, firstButtonCallBack))
    return dialogForm
}

const BookModal: DialogForm = (firstButtonName, firstButtonCallBack) => {
    const dialogForm = DialogForm()
    dialogForm.appendChild(InputSection())
    dialogForm.appendChild(FilePicker())
    dialogForm.appendChild(RadioButtons())
    dialogForm.appendChild(Buttons(firstButtonName, firstButtonCallBack))
    return dialogForm
}


const InputBookModal = () => {
    const dialogForm = DialogForm()
    dialogForm.appendChild(InputSection())
    dialogForm.appendChild(FilePicker())
    dialogForm.appendChild(RadioButtons())
    dialogForm.appendChild(Buttons("Finish", () => {
        const book = addBookModal.getInput()
        const books = bookManager.updateBooks(book)
        bookManager.setBooks(books)
        renderBooks(bookManager.books, viewBookModal)
    }))
    return dialogForm
}

const EditBookModal: DialogForm = () => {
    const dialogForm = DialogForm()
    dialogForm.appendChild(InputSection())
    dialogForm.appendChild(FilePicker())
    dialogForm.appendChild(RadioButtons())
    dialogForm.appendChild(Buttons("Finish", () => {
        const book = editBookModal.getInput()
        bookManager.editBooks(book)
        renderBooks(bookManager.books, viewBookModal)
    }))
    return dialogForm
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

const bookManager: BookManager = {
    books: [
        { title: "We are light of the world!", pageNum: 12, author: "Brian Lop", image: null, status: ReadingStatus.Finished, id: idCounter.assignIdCounter() },
        { title: "Star and Spills", pageNum: 122, author: "Jeff Loppy", image: null, status: ReadingStatus.NotStarted, id: idCounter.assignIdCounter() }
    ],
    currentBook: null,
    setBooks(books: Book[]) {
        this.books = [...books]
    },
    updateBooks(newBook: Book) {
        return [...this.books, newBook]
    },
    findBook(e: Event) {
        // Turn the string dataset value to a number
        const bookId = +(e.target as HTMLElement).dataset.bookId!
        return this.books.find(book => book.id === bookId)
    },
    setCurrentBook(book: Book) {
        this.currentBook = book
    },
    getCurrentBook() {
        return this.currentBook
    },
    editBooks(newBook: Book) {
        const newBooks = this.books.map(book => {
            if (newBook.id === book.id) {
                return newBook
            }
            else return book
        })
        this.books = [...newBooks]
    }
}

function addBook() {
    const book = addBookModal.getInput()
    const books = bookManager.updateBooks(book)
    bookManager.setBooks(books)
    renderBooks(bookManager.books, viewBookModal)
}

const addBookModal: AddBookModal = {
    modal: modal,
    form: BookModal("Finish", addBook),
    getInput() {
        const title: string = this.form.querySelector("#Title").value
        const author: string = this.form.querySelector("#Author").value
        const pageNum: number = Number(this.form.querySelector("#PageNumber").value)
        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        const id: number = idCounter.assignIdCounter()
        let image: File | null = this.form.querySelector('input[type="file"]').files[0] || null
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
    openAddBookModal() {
        if (this.modal.hasChildNodes()) {
            this.modal.firstChild.replaceWith(this.form)
        }
        else
            modal.appendChild(this.form)

        modal.showModal()
    },
    eraseInput() {
        this.form.querySelector("#Title").value = ""
        this.form.querySelector("#Author").value = ""
        this.form.querySelector("#PageNumber").value = ""
        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        this.form.querySelector(".filePickerLabel").dataset.imageName = ""
        radioButtons.forEach(radioButton => {
            radioButton.checked = false
        })
        this.form.querySelector('input[type="file"]').files[0] = ""
    }
}

function editBook() {
    const book = editBookModal.getInput()
    bookManager.editBooks(book)
    renderBooks(bookManager.books, viewBookModal)
}

const editBookModal: EditBookModal = {
    modal: modal,
    form: BookModal("Finish", editBook),
    currentImage:null,
    getInput() {
        const title: string = this.form.querySelector("#Title").value
        const author: string = this.form.querySelector("#Author").value
        const pageNum: number = Number(this.form.querySelector("#PageNumber").value)
        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        const id: number = Number(this.form.dataset.bookId)
        let image: File | null = this.form.querySelector('input[type="file"]').files[0] || this.currentImage
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
        this.currentImage = book.image
        if (book.image === null) this.form.querySelector('.filePickerLabel').dataset.imageName = ""
        else this.form.querySelector('.filePickerLabel').dataset.imageName = book.image.name

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
    },
    eraseInput() {
        this.form.querySelector("#Title").value = ""
        this.form.querySelector("#Author").value = ""
        this.form.querySelector("#PageNumber").value = ""
        const radioButtons: HTMLInputElement[] = Array.from(this.form.querySelectorAll(".radioButtons label input"))
        this.form.querySelector(".filePickerLabel").dataset.imageName = ""
        radioButtons.forEach(radioButton => {
            radioButton.checked = false
        })
        this.form.querySelector('input[type="file"]').files[0] = ""
    }
}

function openEditBookModal() {
    const book = bookManager.getCurrentBook()
    editBookModal.openEditBookModal(book)
}

const viewBookModal: ViewBookModal = {
    modal: modal,
    form: ViewBookModal("Edit", openEditBookModal),
    seeBookInfo(book: Book) {
        if (this.modal.hasChildNodes()) {
            this.modal.firstChild?.replaceWith(this.form)
        }
        else
            modal.appendChild(this.form)

        this.form.dataset.bookId = book.id
        this.form.children[0].textContent = book.title
        this.form.children[1].textContent = 'Author: ' + book.author
        this.form.children[2].textContent = `${book.pageNum} pages`
        this.form.children[3].textContent = 'Status: ' + (book.status === ReadingStatus.NotStarted ? "Haven't read yet" : book.status === ReadingStatus.Reading ? "Reading Now" : "Finished")

        modal.showModal()
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

function renderBooks(books: Book[], viewBookModal: ViewBookModal) {
    const booksContainer = document.querySelector('.booksContainer')!
    booksContainer.textContent = ""

    books.forEach(book => {
        const bookImage = document.createElement("img")
        bookImage.className = "bookImage"
        if (book.image) {
            bookImage.src = URL.createObjectURL(book.image);
            bookImage.onload = () => {
                URL.revokeObjectURL(bookImage.src);
            };
        }
        else bookImage.src = "./assets/bookcover.jpg"
        bookImage.dataset.bookId = book.id.toString()
        bookImage.addEventListener("click", (e) => {
            const bookInfo = bookManager.findBook(e)!
            bookManager.setCurrentBook(bookInfo)
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

function initialize() {
    modal.addEventListener("click", cancelModalOutside)

    renderBooks(bookManager.books, viewBookModal)

    const addButton = document.querySelector('.addButton')
    addButton?.addEventListener("click", () => {
        addBookModal.openAddBookModal()
    })
}

initialize()
