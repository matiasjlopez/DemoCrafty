/**
 * Created by Mati on 4/1/2017.
 */

var tileWidth = 32;

if(window.matchMedia('screen and (min-width: 758px)').matches) tileWidth = 32;
else tileWidth = 16;

Game = {

    // This defines our grid's size and the size of each of its tiles
    map_grid: {
        width:  16,
        height: 20,
        tile: {
            width:  tileWidth,
            height: 32
        }
    },

    // Total width of the game screen -> number of horizontal tiles * tile width
    width: function() {
        return this.map_grid.width * this.map_grid.tile.width;
    },

    // Total height of the game screen -> number of vertical tiles * tile height
    height: function() {
        return this.map_grid.height * this.map_grid.tile.height;
    },

    // Initialize and start our game
    start: function() {
        // Start crafty and set a background color
        Crafty.init(Game.width(), Game.height(), document.getElementById('game')).background('rgb(0, 0, 0)');

        // Loading scene
        Crafty.scene('Loading');
    }
};

window.addEventListener('load', Game.start);