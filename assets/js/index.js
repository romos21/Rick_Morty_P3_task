const getBtn = document.getElementById('get-characters'),
    result = document.getElementById('result-content'),
    inputName = document.getElementById('name'),
    pageNumber = document.getElementById('page-number'),
    showNextBtn = document.getElementById('show-next'),
    showPrevBtn = document.getElementById('show-prev'),
    statusSelect = document.getElementById('status'),
    genderSelect = document.getElementById('gender'),
    speciesSelect = document.getElementById('species'),
    pagesCount = document.getElementById('page-count');
    loader = document.getElementById('loader');
    submitForm=document.getElementById('submit-form');


(async function () {
    try {
        let arrayToInit = [],
            response = await fetch('https://rickandmortyapi.com/api/character');
            if(!response.ok){
                throw new Error('Not find');
            }
            let result = await response.json();
        arrayToInit = result.results;
        while (result.info.next) {
            response = await fetch(result.info.next);
            result = await response.json();
            result.results.forEach(el => arrayToInit.push(el));
        }
        return arrayToInit
    } catch (err) {
        console.log(err + ' caught');
    }
}()).then((arrayToInit) => initializeSelectOptions(arrayToInit));

function initializeSelectOptions(arr) {
    let genderValues = [],
        speciesValues = [],
        statusValues = [];
    arr.forEach(el => {
        if (!genderValues.includes(el.gender)) {
            genderValues.push(el.gender);
        }
        if (!speciesValues.includes(el.species)) {
            speciesValues.push(el.species);
        }
        if (!statusValues.includes(el.status)) {
            statusValues.push(el.status);
        }
    })

    optionElAdd(statusValues, statusSelect);
    optionElAdd(speciesValues, speciesSelect);
    optionElAdd(genderValues, genderSelect);
};

function optionElAdd(array, block) {
    array.forEach(el => {
        const root = document.createElement('option');
        root.textContent = el;
        block.appendChild(root);
    })
}

function notSpecifiedCheck(selectOption) {
    return selectOption === 'Not specified' ? '' : selectOption;
}

async function getStatus(page = 1, name, status, species, gender) {
    status = notSpecifiedCheck(status);
    species = notSpecifiedCheck(species);
    gender = notSpecifiedCheck(gender);
    result.innerHTML = ``;
    const response = await fetch(`https://rickandmortyapi.com/api/character?page=${page}&name=${name}&status=${status}&species=${species}&gender=${gender}`);
    if(!response.ok){
        throw new Error('Not find');
    }
    const resultRes = await response.json();
    return resultRes;
}

function searchListener(pageAttr) {
    loader.style.display='block';
    getStatus(pageAttr, inputName.value, statusSelect.value, speciesSelect.value, genderSelect.value)
        .then(resultRes => {
            addCharactersCards(resultRes);
        })
        .catch(err => {
            result.innerHTML=
                `<div class="not-found-block">
                    <img class="not-found-img" src="https://avatanplus.com/files/resources/original/574c38ddcaad315501be2286.png"/>
                    <br/>
                    <span>not found!!!</span>
                </div>`;
            pagesCount.textContent = '';
            result.style.color = '#fff';
            showPrevBtn.style.display = 'none';
            showNextBtn.style.display = 'none';
            console.log(err + ' caught');
        })
        .finally(()=>{
            loader.style.display='none';
        })
}

const addCharactersCards = (resultRes) => {
    let resultArr = [];
    pagesCount.textContent = 'of ' + resultRes.info.pages;
    if (resultRes.info.next) {
        showNextBtn.style.display = 'block';
    } else {
        showNextBtn.style.display = 'none';
    }

    if (resultRes.info.prev) {
        showPrevBtn.style.display = 'block';
    } else {
        showPrevBtn.style.display = 'none';
    }
    resultRes.results.forEach(el => resultArr.push(el));
    resultArr.forEach(el => {
        const root = document.createElement('div');
        root.className = "result-element";
        root.innerHTML = `
            <img alt="${el.name} ${el.status} ${el.species} ${el.gender}" src="${el.image}">
            <div>
                <div><span>Name: </span><span>${el.name}</span></div>
                <div><span>Status: </span><span>${el.status}</span></div>
                <div><span>Species: </span><span>${el.species}</span></div>
                <div><span>Gender: </span><span>${el.gender}</span></div>
            </div>
        `;

        result.appendChild(root);
    })
    console.log(resultArr);
}


submitForm.onsubmit=(event)=>{
    event.preventDefault();
    pageNumber.textContent = '1';
    searchListener(pageNumber.textContent);
}

showNextBtn.onclick = () => {
    searchListener(++pageNumber.textContent);
}

showPrevBtn.onclick = () => {
    searchListener(--pageNumber.textContent);
}