const BASE_URL = 'https://movie-list.alphacamp.io'
const INDEX_URL = BASE_URL + '/api/v1/movies/'
const POSTER_URL = BASE_URL + '/posters/'
const movies = JSON.parse(localStorage.getItem('favoriteMovies'))


console.log(movies)

const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector("#search-form")
const searchInput = document.querySelector('#search-input')
const wizzardList = document.querySelector('#wizards-list')

function renderMovieList(data) {
    let rawHTML = ''
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
            <button class="btn btn-danger btn-remove-favorite" data-id="${item.id}">-</button>
          </div>
        </div>
      </div>
    </div>`
    })
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

function removeFromFavorite(id){
    if (!movies){return}
    const movieIndex = movies.findIndex(movie => id === movie.id)
    if(movieIndex === -1) return
    // console.log(movieIdex)
    movies.splice(movieIndex, 1)
    localStorage.setItem('favoriteMovies', JSON.stringify(movies))
    renderMovieList(movies)
}

const filterMoviesFunction = (movies, keyword) => {
    return movies.filter(movie => movie.title.toLowerCase().trim().includes(keyword))
}

dataPanel.addEventListener('click', function onPanelClicked(event){
    if (event.target.matches(".btn-show-movie")){
        // console.log(event.target.dataset.id)
        showMovieModal(Number(event.target.dataset.id))
    } else if ((event.target.matches(".btn-remove-favorite"))){
        removeFromFavorite(Number(event.target.dataset.id))
    }
})

renderMovieList(movies)