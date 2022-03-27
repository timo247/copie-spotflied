import JsonStorage from './lib/jsonStorage.js' // ou autre chemin que vous aurez choisi
const favoriteStorage = new JsonStorage({ name: 'favorites', eventName: 'playlist_update'})
window.addEventListener('playlist_update',() => { console.log("c'est à jour!") })



export function initPlayer (chanson, listeChansons, playSong, favouritePlaylist, favouriteStorage){
    const player = document.querySelector('#audio-player')
    const playButton = document.querySelector('#player-control-play')
    const nextPlayButton = document.querySelector('#player-control-next')
    const previousPlayButton = document.querySelector('#player-control-previous')
    const playerImage = document.querySelector('#player-thumbnail-image');
    const playerArtistInfo = document.querySelector("#player-infos-artist-name")
    const playerSongInfo = document.querySelector("#player-infos-song-title")
    const progressBar = document.querySelector("#player-progress-bar")
    const playerTimeCurrent = document.querySelector('#player-time-current')
    const playerTimeDuration = document.querySelector('#player-time-duration')
    const addToFavouriteButton = document.querySelector(".add-to-favourite")


    let hasPlayedOnce = false

    playerImage.src = chanson.artist.image_url;
    player.src = chanson.audio_url;

    playerArtistInfo.textContent = chanson.artist.name
    playerSongInfo.textContent = chanson.title


    if(playSong){
        //console.log("player", player)   
        player.play();
        console.log(chanson, listeChansons, playSong);
        hasPlayedOnce = true;
        console.log( playButton.querySelector('span'))
        playButton.querySelector('span').textContent = "pause";
    }


    player.addEventListener('play', e => {
        playerArtistInfo.textContent = chanson.artist.name
        playerSongInfo.textContent = chanson.title
       if(!hasPlayedOnce){
        if(player.paused){
            player.play()

        } else {
            player.pause()
        }
       }  else {
        if(player.paused){
            player.pause()
        } else {
            player.play()
        }
       }  
    })

    playButton.addEventListener('click', e => {
        if(player.paused){
            player.play()
            console.log( playButton.querySelector('span'))
            playButton.querySelector('span').textContent = "pause";
        } else {
            player.pause()
            console.log( playButton.querySelector('span'))
            playButton.querySelector('span').textContent = "play_arrow";
        }
    })


     nextPlayButton.addEventListener('click', e=>{
         //console.log("next", listeChansons);
        let currentSongId = listeChansons.indexOf(chanson);
            if(currentSongId != listeChansons.length -1){
                chanson = listeChansons[currentSongId + 1];
                player.src = chanson.audio_url;
                player.play();
            }
    })


    
    previousPlayButton.addEventListener('click', e=>{
        //console.log("next", listeChansons);
       let currentSongId = listeChansons.indexOf(chanson);
           if(currentSongId != 0){
               chanson = listeChansons[currentSongId - 1];
               player.src = chanson.audio_url;
               player.play();
           }
   })

   function avancerPlayer(event) {
    player.currentTime = event.currentTarget.value
    }
    document.querySelector('#player-progress-bar').addEventListener('change', avancerPlayer)


    function mettreAJourValeurSlider(event){
        progressBar.currentTime = event.currentTarget.value       
    }
    player.addEventListener('timeupdate', mettreAJourValeurSlider)

    //n'a lieu qu'une seule fois
    player.addEventListener("durationchange", () =>{
        progressBar.max = player.duration;
        console.log(playerTimeDuration)
        playerTimeDuration.innerText = (player.duration)
    })


    //A lieu au fur et à mesures que le temps avance
    player.addEventListener("timeupdate", () => {
        progressBar.value = player.currentTime;
        playerTimeCurrent.innerText = player.currentTime
    })

    addToFavouriteButton.addEventListener("click",  (e) => {
        console.log("favouriteClicked", e.target.textContent );
        if(e.target.textContent == "favorite_border"){
            e.target.textContent = "favorite"
            favouritePlaylist.push(chanson);
            favoriteStorage.addItem(chanson)
            if(favoriteStorage.toArray().find((entry) => entry[1].id == chanson.id)) {
                console.log("C'est dedans!")
                } else {
                console.log("ça n'y est pas…")
                }
        } else {
            e.target.textContent = "favorite_border"            
            favouritePlaylist.splice(favouritePlaylist.length -1, 1);
        }
        console.log(favouritePlaylist)
     })

}

