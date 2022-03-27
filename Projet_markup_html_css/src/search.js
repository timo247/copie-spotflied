export function manageSearchBar(){
let searchIcon = document.querySelector(".searchIcon");
let searchBar = document.querySelector("#search-input")
searchIcon.addEventListener("click", ()=> {
    searchBar.classList.add("active")
    searchBar.focus();
})   

searchBar.addEventListener('blur', () => {
    searchBar.classList.remove('active')
    searchBar.value = ''
  })

searchBar.addEventListener("input", ()=> {
    window.location.hash = `#search-${encodeURIComponent(searchBar.value)}`
})
}
