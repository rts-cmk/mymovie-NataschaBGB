fetch("https://api.themoviedb.org/3/genre/movie/list", {
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
    }
})
.then(response => response.json())
.then(genres => {

    console.log(genres);

})