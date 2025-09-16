let params = new URLSearchParams(window.location.search)

const movieId = params.get("id")
console.log(movieId);

/* MARK: FETCH
*/
fetch(`https://api.themoviedb.org/3/movie/${movieId}`, {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(movie => {

    console.log(movie);
    // set header background to movie poster
    header.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500/${movie.backdrop_path}")`;
    displayMovieDetails(movie)
    document.title = movie.title;

})


// MARK: Create Header
const body = document.querySelector("body")

const createHeader = /*html*/`
    <header>
        <div class="buttons">
            <div class="back"><--</div>
            <label class="switch">
                <input type="checkbox">
                <span class="slider"></span>
            </label>
        </div>
        <div class="trailer">
            <button>
                <i class="fa fa-play"></i>
            </button>
            Play Trailer
        </div>
    </header>`;

body.insertAdjacentHTML("afterbegin", createHeader);


// MARK: Dark Mode
const container = document.querySelector("#container")
const header = body.querySelector("header")

const button = header.querySelector("input")
button.addEventListener("click", darkMode)

function darkMode() {
    container.classList.toggle("light-mode");
    container.classList.toggle("dark-mode");
}


// MARK: Display Movie

function displayMovieDetails(movie) {

    const movieTemplate = /*html*/`
        <section class="movieDetails">
            <h1>${movie.title}</h1>
            <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
        </section>
        <!-- <p>${movie.overview}</p> -->
    `
    container.insertAdjacentHTML("afterbegin", movieTemplate);

}