import './css/index.css'
import { initPlayer } from './player.mjs';
import { manageSearchBar } from './search.js'
window.location.hash = '#home-section'

import JsonStorage from './lib/jsonStorage.js' // ou autre chemin que vous aurez choisi
const favoriteStorage = new JsonStorage({ name: 'favorites', eventName: 'playlist_update'})
window.addEventListener('playlist_update',() => { console.log("c'est à jour!") })

window.addEventListener('offline',(e) => console.log('offline'))
window.addEventListener('online', (e) => console.log('online'))


/* VERSION TEMPORAIRE */
/*
  Le code que nous allons faire sera clairement différent, il s'agit juste d'un micro exemple pour vous permettre
  de tester les liens.
*/

let noSpecificArtist = true
let favouritePlaylist = [];


const links = document.querySelectorAll('nav a')
let artistListDisplayed = false;

links.forEach((link) => {
  link.addEventListener('click', (e) => {
    document.querySelector('nav a.active').classList.remove('active')
    link.classList.add('active')
    document.querySelectorAll('section').forEach((section) => section.id == link.href.split('#')[1] ? section.classList.add('active') : section.classList.remove('active'))
  })
})
/*
window.addEventListener("popstate", () => { 
    //Changer la page
  let sectionToDisplay = window.location.href.split('#')[1];
  console.log(sectionToDisplay);     
  document.querySelectorAll('section').forEach((section) => section.id == sectionToDisplay ? section.classList.add('active') : section.classList.remove('active'))

  console.log('refresh')
  //sélectionner le bon lien
  links.forEach(link => {
    let linkSection = link.href.split('#')[1];
    linkSection == sectionToDisplay ? link.classList.add('active') : link.classList.remove('active')     
  });
})
*/
async function adaptSectionDisplay() {

  //Récupération de la vue actuelle
  let sectionToDisplay = window.location.href.split('#')[1];
  //console.log('section to display', sectionToDisplay);
  document.querySelectorAll('section').forEach((section) => section.id == sectionToDisplay ? section.classList.add('active') : section.classList.remove('active'))
  //sélectionner le bon lien
  let links = document.querySelectorAll('nav a');
  //console.log(links)
  links.forEach(link => {
    let linkSection = link.href.split('#')[1];
    linkSection == sectionToDisplay ? link.classList.add('active') : link.classList.remove('active')
  });

  //Initialisation d'un artiste et d'une chanson de base
  let artistId = 2;
  let urlForInitSongsList = `${WS_URL}/${artistId}/songs`;
  //console.log(urlForInitSongsList)
  let chansonsList = await jsonFetch(urlForInitSongsList);
  //console.log('chansonsList', chansonsList)
  let chanson = chansonsList[0];

  //Gestion du cas particulier de la vue des chansons par artistes
  let artistSongsSection = false;
  //console.log('coucou', sectionToDisplay.split('-'))
  sectionToDisplay.split('-')[2] != undefined ? artistSongsSection = true : artistSongsSection = false;


  manageSearchBar();








  //Vue chansons par artistes
  if (artistSongsSection) {
    //Affichage de la vue
    document.querySelector('#artists-section-').classList.add('active');
    afficherChansons(sectionToDisplay.split('-')[2]);

    const chansonList = document.querySelector('.songs-list');
    const chansonListTemplate = document.querySelector('#chanson-list-item-template')

    async function afficherChanson(chanson) {
      const newChanson = chansonListTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
      newChanson.querySelector('.list-item-title').innerText = chanson.title;

      //gestion du bouton play
      newChanson.querySelector('.chanson-list-play-button').addEventListener('click', async e => {
        let currentArtistId = window.location.href.split('-')[2];
        let newChansonsList = await getChansonsList(currentArtistId);

        noSpecificArtist = false;
        //Initialiser le player  
        console.log("newappel", chanson, newChansonsList)
        initPlayer(chanson, newChansonsList, true, favouritePlaylist);
      })
      /*newChanson.querySelector('button').addEventListener('click', e => {
      let  urlToLoad = '#play-section'+ chanson.autdo_url;
      })*/
      chansonList.append(newChanson)
    }

    function getChansonsList(artistId) {
      let url = `${WS_URL}/${artistId}/songs`;
      return jsonFetch(url)
    }

    async function afficherChansons(artistId) {
      let chansons = await getChansonsList(artistId);
      chansons.forEach(chanson => {
        afficherChanson(chanson);
      });
    }
  }





  //vue search
  if (sectionToDisplay.split('-')[0] == 'search') {
    console.log(document.querySelector("#search-section"))
    document.querySelector("#search-section").classList.add("active");
    let stringForSongs = sectionToDisplay.split('-')[1];
    console.log(stringForSongs)

    const chansonListDeux = document.querySelector('.songs-list-search');
    const chansonListTemplate = document.querySelector('#chanson-list-item-template-2')

    let songsList = {};
    songsList = await jsonFetch(`https://webmob-ui-22-spotlified.herokuapp.com/api/songs/search/${stringForSongs}`)
    //console.log("urlRecupéré",stringForSongs, songsList)

    //console.log(chansonListDeux)
    let songsToRemove = chansonListDeux.querySelectorAll('li');
    songsToRemove.forEach(songLi => {
      songLi.parentElement.removeChild(songLi);
    });
    songsList.forEach(chanson => {
      console.log("newchansonICi")
      const newChanson = chansonListTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
      newChanson.querySelector('.list-item-title').innerText = chanson.title;

      //gestion du bouton play
      newChanson.querySelector('.chanson-list-play-button-search').addEventListener('click', async e => {
        let newChansonsList = await jsonFetch(`https://webmob-ui-22-spotlified.herokuapp.com/api/artists/${artistId}/songs`)
        noSpecificArtist = false;
        //Initialiser le player  
        console.log("newappel", chanson, newChansonsList)
        initPlayer(chanson, newChansonsList, true, favouritePlaylist, favouriteStorage);
        //console.log(newChanson)
      })
      chansonListDeux.append(newChanson)
    });
  }






  //Vue artistes
  if (sectionToDisplay == 'artists-section' && !artistListDisplayed && !artistSongsSection) {

    artistListDisplayed = true;
    afficherArtistes();

    function getArtistsList() {
      return jsonFetch(WS_URL)
    }

    const artistList = document.querySelector('.artist-list')
    const artistListItemTemplate = document.querySelector('#artist-list-item-template')

    function afficherArtiste(artiste) {
      const newArtist = artistListItemTemplate.content.cloneNode(true) // true pour cloner également les enfants du node
      newArtist.querySelector('a').href = '#artists-section-' + artiste.id
      newArtist.querySelector('img').src = artiste.image_url
      newArtist.querySelector('.artist-list-item-title').innerText = artiste.name
      artistList.append(newArtist)
    }

    async function afficherArtistes() {
      let artistes = await getArtistsList();
      artistes.forEach(artiste => {
        afficherArtiste(artiste);
      });
    }
  }

  console.log(sectionToDisplay);
  //Vue Player
  if (sectionToDisplay == 'player-section') {
    if (noSpecificArtist) {
      console.log(sectionToDisplay)
      console.log("ici")
      initPlayer(chanson, chansonsList, true, favouritePlaylist);
    }
    // console.log(chansonsList, chanson)
  }

  if (sectionToDisplay == 'list-section') {
    console.log( document.querySelector("#list-section"))
    document.querySelector("#list-section").classList.remove("hidden");
    let favoriteSongsArray = favoriteStorage.toArray(); 
    console.log(favoriteSongsArray)

    favoriteSongsArray.forEach(chanson => {
      let chansonListTemplate = document.querySelector('#chanson-list-item-template')
      const newChanson = chansonListTemplate.content.cloneNode(true)

      console.log("newChanson", chansonListTemplate) // true pour cloner également les enfants du node
      newChanson.querySelector('.list-item-title').innerText = chanson[1].title;
      
      console.log(document.querySelector(".songs-list-2"), newChanson)
      document.querySelector(".songs-list-2").append(newChanson);
      //gestion du bouton play
      console.log(chanson[1])
      newChanson.querySelector('.playButton').addEventListener('click', async e => {
      let currentArtistId = chanson.artist.id
      let newChansonsList = await getChansonsList(currentArtistId);
      noSpecificArtist = false;
      initPlayer(chanson, newChansonsList, true, favouritePlaylist);      
    })
    });
  }
}

//gestion du refresh case
window.addEventListener("DOMContentLoaded", (event) => {
  adaptSectionDisplay();
});

window.addEventListener("hashchange", () => {
  adaptSectionDisplay();
})

const WS_URL = 'https://webmob-ui-22-spotlified.herokuapp.com/api/artists';
async function jsonFetch(apiUrl) {
  const url = `${apiUrl}`;
  const response = await fetch(url);
  const txt = await response.text();
  const jsonData = JSON.parse(txt);
  //console.log(jsonData)
  return jsonData;
}

//Ajout du service worker
//navigator.serviceWorker.register('/workerCacheFetched.js')

/*
async function getNombreFilms() {
  const url = `${WS_Starwars}`;
  const response = await fetch(url);
  document.querySelector('#fetch-loader').classList.toggle('hidden');
  const txt = await response.text();
  document.querySelector('#fetch-loader').classList.toggle('hidden');
  const jsonData = JSON.parse(txt);
  return jsonData.count;
}
*/
