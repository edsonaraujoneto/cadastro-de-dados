const buttonAddPet = document.getElementsByClassName("card-add")[0]
const modal = document.getElementById("modal-add-pet")
const buttonCancel = document.getElementById("button-cancel")
const buttonSave = document.getElementById("button-send")
const buttonEdit = document.getElementById("button-edit")

buttonAddPet.addEventListener('click', () => {
    cleanInputs()
    modal.showModal()
    document.body.style.overflow = 'hidden' /*bloquear o scroll */
})

function cleanInputs() {
    const race = document.getElementById("irace")
    const size = document.getElementById("isize")
    const state = document.getElementById("istate")
    const city = document.getElementById("icity")
    const photo = document.getElementById("iphoto")
    const gender = document.querySelectorAll('input[name="gender"]')

    race.value = ''
    size.value = ''
    state.value = ''
    city.value = ''
    photo.value = ''

    gender.forEach(radio => {
        radio.checked = false
    })
}

buttonCancel.addEventListener('click', () => {
    modal.close()
    cleanInputs()
    document.body.style.overflow = ''
    buttonEdit.style.display = 'none'
    buttonSave.style.display = 'block'
})

// prevenir o recarregamento mas ainda usar as verificações default do forms.
buttonSave.addEventListener('click', (e) => {
    const race = document.getElementById("irace")
    const size = document.getElementById("isize")
    const state = document.getElementById("istate")
    const city = document.getElementById("icity")
    const photo = document.getElementById("iphoto").files[0]
    const gender = document.querySelectorAll('input[name="gender"]')

    if(race.value != '' && size.value != '' && state.value != '' && city.value != '' && gender.value != '' && photo.value != '') {
        e.preventDefault()
        modal.close()
        document.body.style.overflow = ''

        let genderSelected

        gender.forEach(radio => {
            if (radio.checked) {
                genderSelected = radio.value
            }
        })

        const reader = new FileReader(); 

        reader.onload = function(event) {
            const photoURL = event.target.result; 
            addNewPet(race.value, genderSelected, size.value, state.value, city.value, photoURL); 
        };

        reader.readAsDataURL(photo); 

    }   
})

/* ___________________________________________________________________ */

const sectionPets = document.getElementsByClassName("pets")[0]
const filter = document.getElementsByClassName("filter")[0]
var petAvailable = []

class Pet {
    constructor(race, gender, size, state, city, photo) {
        this.race = race;
        this.gender = gender;
        this.size = size;
        this.state = state;
        this.city = city;
        this.photo = photo;
    }
}

function addNewPet (race, gender, size, state, city, photo) {
    const newPet = new Pet(race, gender, size, state, city, photo)
    petAvailable.push( newPet )

    createNewCard(newPet)
    localStorage.setItem("petAvailable", JSON.stringify(petAvailable)) /* salva o array no storage do navegador */
}

function createNewCard (newPet) {
    filter.style.display = 'block'
    createElementsCard(newPet)
}

function createElementsCard(newPet) {

    let div = document.createElement("div")
    div.classList.add("card")
    
    const spanRace = document.createElement("span")
    spanRace.innerHTML = newPet.race

    const spanGender = document.createElement("span")
    spanGender.innerHTML = newPet.gender

    const spanSize = document.createElement("span")
    spanSize.innerHTML = newPet.size

    const spanState = document.createElement("span")
    spanState.innerHTML = newPet.state

    const spanCity = document.createElement("span")
    spanCity.innerHTML = newPet.city

    const imgImage = document.createElement("img");
    imgImage.src = newPet.photo; 
    imgImage.style.maxWidth = '250px'
    imgImage.style.maxHeight = '100px'

    const divButtons = document.createElement("div")
    divButtons.classList.add("card-button")

    const buttonWantAdopt = document.createElement("button")
    buttonWantAdopt.innerHTML = 'Quero Adotar'
    buttonWantAdopt.classList.add("buttonAdote")

    buttonWantAdopt.addEventListener('click', function() {
        wantAdopt(div, newPet)
    })

    const buttonSetPet = document.createElement("button")
    buttonSetPet.innerHTML = 'Editar'
    buttonSetPet.classList.add("button-setUp")  

    buttonSetPet.addEventListener('click', function () {
        const objectElement =  { spanRace, spanGender, spanSize, spanState, spanCity, imgImage }
        setup(objectElement, newPet)
    })

    divButtons.appendChild(buttonSetPet)
    divButtons.appendChild(buttonWantAdopt)
    
    sectionPets.appendChild(div)
    div.appendChild(imgImage)
    div.appendChild(spanRace)
    div.appendChild(spanGender)
    div.appendChild(spanSize)
    div.appendChild(spanState)
    div.appendChild(spanCity)
    div.appendChild(divButtons)
}

function wantAdopt(div, petAdopt) {
    getArrayPet = localStorage.getItem("petAvailable")
    arrayPet = JSON.parse(getArrayPet)

    const indexToRemove = arrayPet.findIndex(pet => {
        return pet.race ===  petAdopt.race && pet.gender === petAdopt.gender && pet.size === petAdopt.size &&
        pet.state === petAdopt.state && pet.city === petAdopt.city
    })

    petAvailable.splice(indexToRemove, 1) 
    localStorage.setItem("petAvailable", JSON.stringify(petAvailable)); // atualiza o local storage
    sectionPets.removeChild(div)
    if (petAvailable.length === 0) {
        filter.style.display = 'none'
    }

}

console.log(petAvailable.length)

function setup(objectElement, pet) {  // essa funcao recupera os valores cadastrados e coloca nos newInputs

    // só não consegui recuperar a foto selecionada
    const newElementRace = document.getElementById("irace")
    const newElementSize = document.getElementById("isize")
    const newElementState = document.getElementById("istate")
    const newElementCity = document.getElementById("icity")
    const newElementGender = document.querySelectorAll('input[name="gender"]')

    for (let i = 0; i < newElementSize.options.length; i++) {
        if (newElementSize.options[i].value === pet.size) {
            newElementSize.options[i].selected = true
            break;
        } 
    }

    newElementGender.forEach(radio => {
        if(radio.value === pet.gender) {
            radio.checked = true
        }
    })

    newElementRace.value = pet.race
    newElementState.value = pet.state
    newElementCity.value = pet.city

    document.body.style.overflow = 'hidden'
    buttonEdit.style.display = 'block'

    buttonEdit.addEventListener('click', function (event) {
        const newObjectElement = { 
            race: newElementRace.value, 
            size: newElementSize.value, 
            state: newElementState.value, 
            city: newElementCity.value, 
            gender: document.querySelectorAll('input[name="gender"]'),
            photo: document.getElementById("iphoto")
        }
        editCard( objectElement, pet, event, newObjectElement)
    })

    buttonSave.style.display = 'none'
    modal.showModal()

}

function editCard(objectElement, pet, event, newObjectElement) {

    // verificar se tem algum genero selecionado
    let isSelectedGender = false
    newObjectElement.gender.forEach(radio => {
        if (radio.checked) {
            isSelectedGender = true
        }
    })

    // verificar se tem imagem selecionada
    let isSelectedImage;
    if (newObjectElement.photo.files.length === 0 ) {
        isSelectedImage = false
    } else {
        isSelectedImage = true
    }

    if(newObjectElement.race.length >= 3 && newObjectElement.state.length >= 3 && newObjectElement.city.length >= 3 && isSelectedGender && isSelectedImage) {
        event.preventDefault()
        modal.close()
        document.body.style.overflow = ''
        buttonEdit.style.display = 'none'
        buttonSave.style.display = 'block'

        // achar o index do pet escolhido para editar. Precisa estar aqui pois ja nas linhas seguintes, alteramos o valor do pet
        const index = petAvailable.findIndex(petIndex => {
            return petIndex.race ===  pet.race && petIndex.gender === pet.gender && petIndex.size === pet.size &&
            petIndex.state === pet.state && petIndex.city === pet.city
        })

        newObjectElement.photo = document.getElementById("iphoto").files[0]

        const reader = new FileReader(); 

        reader.onload = function(event) {
            const photoURL = event.target.result; 
            objectElement.imgImage.src = photoURL
            pet.photo = photoURL
            console.log(pet.photo)
            localStorage.setItem("petAvailable", JSON.stringify(petAvailable))
        };

        reader.readAsDataURL(newObjectElement.photo); 

        newObjectElement.gender.forEach(radio => {
            if (radio.checked) {
                objectElement.spanGender.innerHTML = radio.value
                objectElement.spanGender.value = radio.value
                pet.gender = radio.value
            }
        })

        objectElement.spanRace.innerHTML = newObjectElement.race
        objectElement.spanState.innerHTML = newObjectElement.state
        objectElement.spanCity.innerHTML = newObjectElement.city
        objectElement.spanSize.innerHTML = newObjectElement.size

        objectElement.spanRace.value = newObjectElement.race
        objectElement.spanState.value = newObjectElement.state
        objectElement.spanCity.value = newObjectElement.city
        objectElement.spanSize.value = newObjectElement.size

        pet.race = newObjectElement.race
        pet.state = newObjectElement.state
        pet.city = newObjectElement.city
        pet.size = newObjectElement.size

        petAvailable[index] = pet // substituir no array e colocar o novo pet.
        
        localStorage.setItem("petAvailable", JSON.stringify(petAvailable)) /* salva o array no storage do navegador */
    }
}

window.onload = () => {
    
    if (localStorage.getItem("petAvailable")) {

        /* recuperar os pets salvos no navegador */
        const amountPet = localStorage.getItem("petAvailable")
        var arrayPet = JSON.parse(amountPet) 

        for (var i = 0; i < arrayPet.length; i++) {

            createElementsCard(arrayPet[i])
            /* enviar para o array novamente, pois ele esta vazio após recarregar */
            petAvailable.push( new Pet(arrayPet[i].race,arrayPet[i].gender,arrayPet[i].size,arrayPet[i].state,arrayPet[i].city, arrayPet[i].photo) )

        }

        if (petAvailable.length === 0) {
            filter.style.display = 'none'
        } else {
            filter.style.display = 'block'
        }
    }
    
}

