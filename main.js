const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = []
let   filterMovies = []
const MOVIES_PER_PAGE = 12  //新增這行
let   showMoviesByCard = true
let   page = 1

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const wizzardList = document.querySelector('#wizards-list')
const paginator = document.querySelector('#paginator')
const displaySwitch = document.querySelector("#display-switch")

function renderMovieList(data) {
    // console.log(showMoviesByCard)
    let rawHTML = ''
    if (showMoviesByCard){
        data.forEach((item) => {
            // title, image
            rawHTML += `<div class="col-sm-3">
            <div class="mb-2">
              <div class="card">
                <img src="${POSTER_URL + item.image}" class="card-img-top" alt="Movie Poster">
                <div class="card-body">
                  <h5 class="card-title">${item.title}</h5>
                </div>
                <div class="card-footer">
                  <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                  <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
                </div>
              </div>
            </div>
          </div>`
        })
    }else {
        rawHTML += `<ul class="list-group container-fluid">`;
        data.forEach((item) => {
            rawHTML += `
            <li class="list-group-item d-flex">
                <h5 class="card-title col-9">${item.title}</h5>
                <div class='wrap'>
                    <button class="btn btn-primary btn-show-movie" data-toggle="modal" data-target="#movie-modal" data-id="${item.id}">More</button>
                    <button class="btn btn-info btn-add-favorite"data-id="${item.id}">+</button>
                </div>
            </li>
            `
        })
        rawHTML += `</ul>`;
    }
    dataPanel.innerHTML = rawHTML
}

function showMovieModal(id){
    const modalTitle = document.querySelector("#movie-modal-title")
    const modalDate = document.querySelector("#movie-modal-date")
    const modalDescription = document.querySelector("#movie-modal-description")
    const modalImage = document.querySelector("#movie-modal-image")

    axios.get(INDEX_URL + id).then((response) => {
        const data = response.data.results
        console.log(data)
        modalTitle.innerText = data.title
        modalDate.innerText = 'Release date: ' + data.release_date
        modalDescription.innerText = data.description
        modalImage.innerHTML = `
        <img    src="${POSTER_URL + data.image}"
                alt="movie-poster" 
                class="img-fluid">
        `
    })
}

function addToFavorite(id){
    // console.log(id)
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = movies.find(movie => id === movie.id)
    // console.log(list)
    // console.log(movie)

    if (list.some(movie => id === movie.id))
        return alert('Movie exist in favorite list')
    list.push(movie)
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
    // console.log('JSON.stringfy:', JSON.stringify(list))
    // console.log('JSON.parse:', JSON.parse(JSON.stringify(list)))
}

function getMoviesByPages(page){
    const data = filterMovies.length? filterMovies : movies
    // console.log(data)
    const startIndex = (page-1) * MOVIES_PER_PAGE
    return data.slice(startIndex, startIndex + MOVIES_PER_PAGE)
}

function renderPaginator(amount){
    const numberOfPages = Math.ceil(amount / MOVIES_PER_PAGE)
    let rawHTML=''
    for (let page = 1; page <=numberOfPages; page++){
        rawHTML += `
        <li class="page-item"><a class="page-link" href="#" data-page="${page}">${page}</a></li>
        `
    }
    paginator.innerHTML = rawHTML
}

const filterMoviesFunction = (movies, keyword) => {
    return movies.filter(movie => movie.title.toLowerCase().trim().includes(keyword))
}
// function filterMoviesFunction(movie) {
//     return movie.title.toLowerCase().trim().includes(keyword)
// }

axios
    .get(INDEX_URL) // 修改這裡
    .then((response) => {
        for (const movie of response.data.results) {
            movies.push(movie)
        }
        // console.log(movies) 
        renderPaginator(movies.length)
        renderMovieList(getMoviesByPages(1))
    })
    .catch((err) => console.log(err))

dataPanel.addEventListener('click', function onPanelClicked(event){
    if (event.target.matches(".btn-show-movie")){
        // console.log(event.target.dataset.id)
        showMovieModal(Number(event.target.dataset.id))
    } else if ((event.target.matches(".btn-add-favorite"))){
        addToFavorite(Number(event.target.dataset.id))
    }
})

searchForm.addEventListener('submit', function onSearchFormSubmitted(event){
    event.preventDefault()
    // console.log(event.target)
    // console.log(searchInput.value.toLowerCase().trim())
    const keyword = searchInput.value.toLowerCase().trim()

    // for (const movie of movies){
    //     if (movie.title.toLowerCase().includes(keyword))
    //         filterMovies.push(movie)
    // }
    // filterMovies = movies.filter(movie => movie.title
    //     .toLowerCase().trim().includes(keyword))

    // filterMovies = movies.filter(movie => {
    //     return movie.title.toLowerCase().trim().includes(keyword)
    // })

    filterMovies = filterMoviesFunction(movies, keyword)
    renderPaginator(filterMovies.length)
    renderMovieList(getMoviesByPages(1))
})

searchInput.addEventListener('keyup', function onKeyInPartialWord(event){
    event.preventDefault()
    rawHTML = ''
    // console.log(searchInput.value.toLowerCase().trim())
    // if (event.keyCode >= 65 && event.keyCode <= 90){

    let keyword = searchInput.value.toLowerCase().trim()
    // console.log(keyword)
    
    movies.find( movie =>{
        // return movie.title.toLowerCase().trim().search(keyword)
        if (movie.title.toLowerCase().trim().search(keyword) >= 0){
            rawHTML += `
                <option>${movie.title}</option>
            `
        }
    })
    // console.log(rawHTML)
    wizzardList.innerHTML = rawHTML
})

paginator.addEventListener('click', function onPaginatorClicked(event){
    if (event.target.matches(".page-link")){
        page = Number(event.target.dataset.page)
        renderMovieList(getMoviesByPages(page))
    }
})

displaySwitch.addEventListener('click', function onDisplaySwitch(event){
    if (event.target.matches(".fa-bars"))showMoviesByCard = false
    else showMoviesByCard = true
    // console.log(showMoviesByCard)
    renderMovieList(getMoviesByPages(page))
})