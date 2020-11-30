let myLibrary = [];

const cardContainer = document.createElement("div")

function Book(title, author, pages) {
    this.Title = title
    this.Author = author
    this.Pages = pages
}


initializePageElements()


function initializePageElements(){
    // Create container div
    const container = document.createElement("div")
    container.classList.add("container")


    // Create page title
    const pageTitle = document.createElement("h1")
    pageTitle.classList.add("title")
    pageTitle.innerHTML = "Book Library"


    // Create add book button
    const addNewBookButton = document.createElement("button")
    addNewBookButton.classList.add("add-book-button")
    addNewBookButton.innerHTML = "Add new Book"
    addNewBookButton.addEventListener("click", function(){
        createForm()
    })

    // Initialize card container
    cardContainer.classList.add("card-container")


    // Call function to append all elements to page
    addElementsToPage(container, pageTitle, addNewBookButton)

}


function createForm(){
    // Create and initialize form
    const inputForm = document.createElement("div")
    inputForm.classList.add("form-container")

    // Create form title
    const formTitle = document.createElement("h3")
    formTitle.innerHTML = "Add new book"

    // Create form input fields
    const bookTitleInput = document.createElement("input")
    bookTitleInput.classList.add("form-input")
    bookTitleInput.setAttribute("placeholder", "Enter the book title")

    const bookAuthorInput = document.createElement("input")
    bookAuthorInput.classList.add("form-input")
    bookAuthorInput.setAttribute("placeholder", "Enter the book author")

    const bookPagesInput = document.createElement("input")
    bookPagesInput.classList.add("form-input")
    bookPagesInput.setAttribute("placeholder", "Enter the book pages")


    // Add read slider
    const readStatusDiv = document.createElement("div")
    readStatusDiv.classList.add("form-input")

    const readStatusLabel = document.createElement("p")
    readStatusLabel.innerHTML = "Have you completed the book?"

    const sliderRead = document.createElement("label")
    sliderRead.classList.add("switch")

    const sliderInput = document.createElement("input")
    sliderInput.classList.add("slider", "round")
    sliderInput.setAttribute("type", "checkbox")

    const spanClass = document.createElement("span")
    spanClass.classList.add("slider", "round")

    sliderRead.appendChild(sliderInput)
    sliderRead.appendChild(spanClass)

    readStatusDiv.appendChild(readStatusLabel)
    readStatusDiv.appendChild(sliderRead)

    // Add submit button
    const submitButton = document.createElement("button")
    submitButton.classList.add("form-submit")
    submitButton.innerHTML = "Save Book"
    submitButton.addEventListener("click", function(){
        let bookTitle = bookTitleInput.value, bookAuthor = bookAuthorInput.value, bookPages = bookPagesInput.value
        if (bookTitle && bookAuthor && bookPages){
            console.log("Not null")
            addBookToLibrary(bookTitle, bookAuthor, bookPages)
            document.body.removeChild(inputForm)
        } else {
            console.log("Please fill in the form")
            alert("Please fill in all the fields")
        }
    })

    // Create cancel button
    const cancelButton = document.createElement("button")
    cancelButton.classList.add("form-cancel")
    cancelButton.innerHTML = "Cancel"
    cancelButton.addEventListener("click", function(){
        document.body.removeChild(inputForm)
    })


    // Append children to form
    inputForm.appendChild(formTitle)
    inputForm.appendChild(bookTitleInput)
    inputForm.appendChild(bookAuthorInput)
    inputForm.appendChild(bookPagesInput)
    inputForm.appendChild(readStatusDiv)
    inputForm.appendChild(submitButton)
    inputForm.appendChild(cancelButton)

    document.body.appendChild(inputForm)
}


function addElementsToPage(container, pageTitle, addBookButton){
    // Add elements to container
    container.appendChild(pageTitle)
    container.appendChild(addBookButton)
    container.appendChild(cardContainer)

    document.body.appendChild(container)

    // Retrieve library from local storage
    if (storageAvailable('localStorage')) {
        // Retrieve stored books
        myLibrary = JSON.parse(localStorage.getItem("books"))
        if (myLibrary != null){
            console.log("Storage is not empty")
            for (let i = 0; i < myLibrary.length; i ++){
                addNewBookToDOM(myLibrary[i])
            }
        } else {
            console.log("Storage is empty")
        }
    }    
}

function addBookToLibrary(bookTitle, bookAuthor, bookPages) {
    console.log("Adding books to library...");
    // do stuff here
    let newBook = new Book(bookTitle, bookAuthor, bookPages)
    myLibrary.push(newBook)
    console.table(myLibrary)

    addNewBookToDOM(newBook)

    // Store library to local storage
    if (storageAvailable('localStorage')) {
        // Yippee! We can use localStorage awesomeness
        let storage = window.localStorage
        storage.setItem("books", JSON.stringify(myLibrary));
    } else {
        // Too bad, no localStorage for us
        alert("Could not save books to your local storage. Your browser does not support local storage.")
    }
}

function addNewBookToDOM(bookItem){
    // Create and initialize a card-item div
    var cardItem = document.createElement("div")
    cardItem.classList.add("card-item")

    // Create book icon
    const bookIcon = document.createElement("i")
    bookIcon.classList.add("fa", "fa-book")

    cardItem.appendChild(bookIcon)

    // Create and add children to the card item
    for (const [key, value] of Object.entries(bookItem)) {
        var paragraph = document.createElement("p")
        paragraph.innerHTML = `<span style="font-weight: bold;">${key}</span> : ${value}`
        cardItem.appendChild(paragraph)
    }

    // Create delete button
    const deleteButton = document.createElement("button")
    deleteButton.classList.add("form-delete")
    deleteButton.innerHTML = "Delete"
    deleteButton.setAttribute("id", `${myLibrary.indexOf(bookItem)}`)
    deleteButton.addEventListener("click", function(){
        myLibrary.splice(deleteButton.id, 1)
        cardContainer.removeChild(cardItem)
        console.table(myLibrary);
        // Store library to local storage
        if (storageAvailable('localStorage')) {
            // Yippee! We can use localStorage awesomeness
            let storage = window.localStorage
            storage.setItem("books", JSON.stringify(myLibrary));
        } else {
            // Too bad, no localStorage for us
            alert("Could not save books to your local storage. Your browser does not support local storage.")
        }
    })

    cardItem.appendChild(deleteButton)

    // Add the new div to the card-container
    cardContainer.appendChild(cardItem)
}

function storageAvailable(type) {
    var storage;
    try {
        storage = window[type];
        var x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return true;
    }
    catch(e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            (storage && storage.length !== 0);
    }
}

