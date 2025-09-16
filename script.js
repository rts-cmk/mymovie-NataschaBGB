const body = document.querySelector("body")
// console.log(body);

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

header.insertAdjacentHTML("afterbegin", headerTemplate);

// MARK: Dark Mode
const button = header.querySelector("input")
button.addEventListener("click", darkMode)

function darkMode() {
   var element = document.body;
   element.classList.toggle("dark-mode");
}


// MARK: Fetch Now Showing
fetch("https://api.themoviedb.org/3/movie/now_playing", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(movies => {

    // console.log(movies);
    displayNowShowing(movies);

})

// MARK: Display Now Showing
function displayNowShowing(movies) {

    const container = document.querySelector("#container")
    // console.log(container);
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
    ${movies.results.map(movie => {
        return /*html*/`
            <figure class="movie">
                <img src="${imgBaseUrl + movie.poster_path}" alt="${movie.title}_poster">
                <figcaption>
                    <a href="movie.html?id=${movie.id}" target="_blank">
                        <h3>${movie.title}</h3>
                    </a>
                    <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
                </figcaption>
            </figure>`;
        
    }).join("")}
    </section>`;
    nowShowing.insertAdjacentHTML("beforeend", movieWrapper);

}


// MARK: Fetch Popular
fetch("https://api.themoviedb.org/3/movie/popular", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(movies => {

    console.log(movies);
    displayPopular(movies);

})

// MARK: Display Popular
function displayPopular(movies) {

    const container = document.querySelector("#container")
    // console.log(container);
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
    ${movies.results.map(movie => {
        return /*html*/`
            <figure class="movie">
                <img src="${imgBaseUrl + movie.poster_path}" alt="${movie.title}_poster">
                <figcaption>
                    <a href="movie.html?id=${movie.id}" target="_blank">
                        <h3>${movie.title}</h3>
                    </a>
                    <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
                    <p></p>
                    <!-- <p><i class="fa fa-clock"> </i></p> -->
                </figcaption>
            </figure>`;

        
    }).join("")}
    </section>`;
    popular.insertAdjacentHTML("beforeend", movieWrapper);

}