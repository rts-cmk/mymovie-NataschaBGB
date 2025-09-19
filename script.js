const body = document.querySelector("body");

// MARK: Create Header
const createHeader = /*html*/`<header></header>`;
body.insertAdjacentHTML("afterbegin", createHeader);
const header = body.querySelector("header");

const headerTemplate = /*html*/`
    <h1>My Movies</h1>
    <label class="switch">
        <input type="checkbox">
        <span class="slider"></span>
    </label>`
// insert headerTemplate in header div
header.insertAdjacentHTML("afterbegin", headerTemplate);



// MARK: Dark Mode
const themeSwitch = header.querySelector("input");
// when page loads > check localstorage
const savedTheme = localStorage.getItem("theme");
// if savedTheme is in storage
if (savedTheme) {
    // clear classes from body element
    body.classList.remove("light-mode", "dark-mode");
    // and add the saved theme
    body.classList.add(savedTheme);

    // Hvis vi er i dark-mode, sæt checkbox til checked
    // if saved theme is dark-mode
    if (savedTheme === "dark-mode") {
        // set the switch to true (set it to be checked)
        themeSwitch.checked = true;
    }
}
// add event listener to switch
themeSwitch.addEventListener("click", toggleDarkLight);
// call this function if switch is clicked
function toggleDarkLight() {
    // if light-mode is active - set dark-mode
    body.classList.toggle("light-mode");
    // if dark-mode is active - set light-mode
    body.classList.toggle("dark-mode");

    // find the current class on body element
    const currentTheme = body.classList.contains("dark-mode") 
        ? "dark-mode" 
        : "light-mode";

    // and save the current class in localstorage (this is the new value in getItem("theme") above)
    localStorage.setItem("theme", currentTheme);
}





// -------------------------------------------
// MARK: FETCH



// object to save genres in
let genresObject;
// MARK: Now Showing
const nowPlayingFetch = fetch("https://api.themoviedb.org/3/movie/now_playing", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
// MARK: Genres
const genresFetch = fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
// MARK: Popular
const popularFetch = fetch("https://api.themoviedb.org/3/movie/popular", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())

Promise.all([nowPlayingFetch, popularFetch, genresFetch])
.then(([nowPlayingData, popularFetchData, genreData]) => {
    
    const moviesPlaying = nowPlayingData.results
    const moviesPopular = popularFetchData.results
    genresObject = genreData.genres

    displayNowShowing(moviesPlaying);
    displayPopular(moviesPopular);

})








// ---------------------------------------------------
// MARK: DISPLAY






// MARK: Now Showing
function displayNowShowing(movies) {

    const container = document.querySelector("#container")
    const createNowShowing = /*html*/`<section class="nowShowing"></section>`;
    container.insertAdjacentHTML("beforeend", createNowShowing);
    const nowShowing = container.querySelector(".nowShowing");

    const title = /*html*/`
        <div class="title">    
            <h2>Now Showing</h2>
            <a href="#">See more</a>
        </div>`;
    nowShowing.insertAdjacentHTML("afterbegin", title);

    const imgBaseUrl = "https://image.tmdb.org/t/p/w500/";

    const movieWrapper = /*html*/`<section class="movieWrapper">
    ${movies.map(movie => {
        return /*html*/`
            <figure class="movie" id="${movie.id}">
                <img src="${imgBaseUrl + movie.poster_path}" alt="${movie.title}_poster">
                <figcaption>
                    <a href="movie.html?id=${movie.id}" aria-label="${movie.title}" target="_blank">
                        <h3>${movie.title}</h3>
                    </a>
                    <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
                </figcaption>
            </figure>`;
        
    }).join("")}
    </section>`;
    nowShowing.insertAdjacentHTML("beforeend", movieWrapper);

}


// MARK: Popular
function displayPopular(movies) {

    const container = document.querySelector("#container")
    const createPopular = /*html*/`<section class="popular"></section>`;
    container.insertAdjacentHTML("beforeend", createPopular);
    const popular = container.querySelector(".popular");

    const title = /*html*/`
        <div class="title">    
            <h2>Popular</h2>
            <a href="#">See more</a>
        </div>`;
    popular.insertAdjacentHTML("afterbegin", title);

    const imgBaseUrl = "https://image.tmdb.org/t/p/w500/";

    const movieWrapper = /*html*/`<section class="movieWrapper">
    ${movies.map(movie => {
        return /*html*/`
            <figure class="movie"  id="${movie.id}">
                <img src="${imgBaseUrl + movie.poster_path}" alt="${movie.title}_poster">
                <figcaption>
                    <a href="movie.html?id=${movie.id}" aria-label="${movie.title}" target="_blank">
                        <h3>${movie.title}</h3>
                    </a>
                    <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
                    <ul>
                        ${movie.genre_ids.map(id=> 
                            `<li>${genresObject.find(genre => genre.id == id).name}</li>`
                        ).join("")}
                    </ul>
                    <div class="release_date">
                        <p>Release Date:</p>
                        <p>${movie.release_date}</p>
                    </div>
                </figcaption>
            </figure>`;
    }).join("")}
    </section>`;
    popular.insertAdjacentHTML("beforeend", movieWrapper);

}