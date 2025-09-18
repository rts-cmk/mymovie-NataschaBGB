// search window location
let params = new URLSearchParams(window.location.search)

// get the movie id
// (set in script.js when clicking a movie title)
const movieId = params.get("id")


/* MARK: FETCH
*/
// fetch data from api and get credits and videos from other api
// movie id defines what info is shown (only credits and videos from movie that matches the id)
fetch(`https://api.themoviedb.org/3/movie/${movieId}?append_to_response=credits,videos,release_dates`, {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
// convert fetched response to json
.then(response => response.json())
.then(movie => {

    // call header function to insert header
    insertHeader(movie)
    // call display function to show movie details
    displayMovieDetails(movie)
    document.title = movie.title;

})


// select body element for later use
const body = document.querySelector("body")
// select container element for later use
const container = document.querySelector("#container")


// MARK: CREATE HEADER
// variable to use later outside header function
let videoPath;
function insertHeader(movie) {

    const createHeader = /*html*/`
        <header>
            <div class="buttons">
                <div class="back">
                    <img src="img/arrowleft.png" alt="arrowleft">
                </div>
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

    // insert header in body before container
    body.insertAdjacentHTML("afterbegin", createHeader);

    // select header element
    const header = body.querySelector("header")

    // set header background to movie poster
    header.style.backgroundImage = `url("https://image.tmdb.org/t/p/w500/${movie.backdrop_path}")`;



    // MARK: SET DARK MODE
    const themeSwitch = header.querySelector("input");
    // when page loads > check localstorage
    const savedTheme = localStorage.getItem("theme");
    // if savedTheme is in storage
    if (savedTheme) {
        // clear classes from container element
        container.classList.remove("light-mode", "dark-mode");
        // and add the saved theme
        container.classList.add(savedTheme);

        // if saved theme is dark-mode
        if (savedTheme === "dark-mode") {
            // set the switch to true (set it to be checked)
            themeSwitch.checked = true;
        }
    }
    // add event listener to switch
    themeSwitch.addEventListener("click", toggleDarkLight);



    // MARK: TRAILER
    // find the official trailer video in array
    const findTrailer = movie.videos.results.find(trailer => trailer.name == "Official Trailer").key
    // set the found trailer key in youtube link
    let video = moviepath = `https://www.youtube.com/watch?v=${findTrailer}`
    // add event listener to play button
    const playButton = header.querySelector(".trailer")
    playButton.addEventListener("click", playTrailer)
    // set videoPath equal to video variable to use outside function
    videoPath = video

}

// MARK: CALL DARK MODE
// call this function if switch is clicked
function toggleDarkLight() {
    // if light-mode is active - set dark-mode
    container.classList.toggle("light-mode");
    // if dark-mode is active - set light-mode
    container.classList.toggle("dark-mode");

    // find the current class on container element
    const currentTheme = container.classList.contains("dark-mode") 
        ? "dark-mode" 
        : "light-mode";

    // and save the current class in localstorage (this is the new value in getItem("theme") above)
    localStorage.setItem("theme", currentTheme);
}
// MARK: PLAY TRAILER
// activate this when play button in header is clicked
function playTrailer() {
    // if videoPath exists
    if(videoPath) {
        // open new window with youtube trailer
        window.open(`${videoPath}`);
    }
    // if it does not exist
    else {
        // pop up alert message
        alert("It looks like we can't find a trailer for this movie");
    }
}



// MARK: DISPLAY MOVIE
function displayMovieDetails(movie) {

    const movieTemplate = /*html*/`
        <article>
            <section class="movie">
                <h1>${movie.title}</h1>
                <p><i class="fa fa-star"></i> ${movie.vote_average.toFixed(1)}/10 IMDb</p>
                <ul>
                    ${movie.genres.map(genre => 
                        /*html*/`<li>${genre.name}</li>`
                    ).join("")}
                </ul>
            </section>
            <section class="details">
                <div class="runtime">
                    <div class="runtime_title">
                        <img src="img/runtime.png" alt="runtime_logo">
                        <p>Length</p>
                    </div>
                    <p>${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}min</p>
                </div>
                <div class="language">
                    <div class="language_title">
                        <img src="img/language.png" alt="language_logo">
                        <p>Language</p>
                    </div>
                    <p>${movie.spoken_languages[0]["english_name"]}</p>
                </div>
                <div class="rating">
                    <div class="rating_title">
                        <img src="img/rating.png" alt="rating_logo">
                        <p>Rating</p>
                    </div>
                    <p>${findRating(movie.release_dates)}</p>
                </div>
            </section>
            <section class="overview">
                <h2>Description</h2>
                <p>${movie.overview}</p>
            </section>
            <section class="cast">
                <div class="title">
                    <h2>Cast</h2>
                    <a href="#">See more</a>
                </div>
                <div class="actors">
                ${movie.credits.cast.map(castmember => {
                    return /*html*/`
                        <div class="actor">
                            <img src="https://image.tmdb.org/t/p/w500/${castmember.profile_path}" alt="${castmember["name"]}">
                            <p>${castmember["name"]}</p>
                        </div>`
                }).slice(0, 4).join("")}
                </div>
            </section>
        </article>`

    // insert movies in container
    container.insertAdjacentHTML("afterbegin", movieTemplate);

}

// function to display rating
function findRating(release_dates) {

    // loop through release_dates array and find "US"
    let us_dates = release_dates.results.find(result => result.iso_3166_1 == "US")
    // loop through new release_dates array inside "US" and find "certification" that is not empty
    let rating = us_dates.release_dates.find(result => result.certification != "")
    
    // return certification value
    return rating.certification

}