 (function() {
     function SongPlayer($rootScope, Fixtures) {
          var SongPlayer = {};

          /**
           * @desc use getAlbum method to store currentAlbum data
           * @param {Object}
           */
          var currentAlbum = Fixtures.getAlbum();

         /**
          * @desc Buzz object audio file
          * @type {Object}
          */
         var currentBuzzObject = null;

        /**
         * @function playSong
         * @desc private function to play song object
         * @param {Object} song 
         */
        var playSong = function (song){
            currentBuzzObject.play();
            song.playing = true;
        };

        /**
         * @function stopSong
         * @desc stops the currently playing song
         */

        var stopSong = function (song) {
            currentBuzzObject.stop();
            song.playing = null;
        };

        /**
         * @function setSong
         * @desc Stops currently playing song and loads new audio file as currentBuzzObject
         * @param {Object} song
         */
        var setSong = function(song) {
            if (currentBuzzObject) {
                currentBuzzObject.stop();
                SongPlayer.currentSong.playing = null;
            }

            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });

            currentBuzzObject.bind('timeupdate', function(){
                $rootScope.$apply(function(){
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });

            SongPlayer.currentSong = song;
        };

        /**
         * @function getSongIndex
         * @desc get index of song from album
         * @param {Object} song 
         */
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };


       // setSong(song);

//Did I screw this up by taking it out of scope?
        /**
         * @desc Active song object from list of songs
         * @type {Object}
         */
        SongPlayer.currentSong = null;


        /**
         * @desc Current playback time in seconds of currently playing song
         * @type {number}
         */
        SongPlayer.currentTime = null;

        /**
         * @desc Volume of current song being played
         * @type {number}
         */
        SongPlayer.volume = 75;

 

        /**
         *  @function SongPlayer.play
         *  @desc Allows song to played
         *  @param {Object} song
         */
          SongPlayer.play = function(song) {

              console.log("play");
            //   if (SongPlayer.currentSong !== song) {
            //       console.log("not the song");
              
            //       song = song || SongPlayer.currentSong;
            //   }
            song = song || SongPlayer.currentSong;
              if (SongPlayer.currentSong !== song) {

                setSong(song);
                playSong(song);

             }  else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                    song.playing = true; // set to true so that the pause button renders
                 }
             }     
        };

        /**
         *  @function SongPlayer.pause
         *  @desc pauses the song
         *  @param {Object} song
         */

        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };

        /**
         * @function SongPlayer.previous
         * @desc goes back to the previous track
         * @param {Object} song
         */
        SongPlayer.previous = function () {
            var currentSongIndex = getSongIndex(SongPlayer.curentSong);
            currentSongIndex--; 

            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };

         /**
         * @function SongPlayer.next
         * @desc goes back to the next track
         * @param {Object} song
         */
        SongPlayer.next = function () {
            var currentSongIndex = getSongIndex(SongPlayer.curentSong);
            currentSongIndex++; 

            var lastSongIndex = currentAlbum.songs.length - 1;

            if (currentSongIndex > lastSongIndex) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        

        /**
         * @function setCurrentTime
         * @desc Set current time (in seconds) of currently playing song
         * @param {Number} time
         */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };

        /**
         * @function setVolume
         * @desc Set volume for song
         * @param {Number} volume
         */

        SongPlayer.setVolume = function(volume){
            if (currentBuzzObject){
                currentBuzzObject.setVolume(volume);
            }
        };


         return SongPlayer;
 }
 
     angular
         .module('blocJams')
         .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
 })();