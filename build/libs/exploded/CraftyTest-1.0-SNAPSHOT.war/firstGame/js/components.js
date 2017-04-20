/**
 * Created by Mati on 3/31/2017.
 */

// The Grid component allows an element to be located
//  on a grid of tiles
Crafty.c('Grid', {
    init: function() {
        this.attr({
            w: Game.map_grid.tile.width,
            h: Game.map_grid.tile.height
        })
    },

    // Locate this entity at the given position on the grid
    at: function(x, y) {
        if (x === undefined && y === undefined) {
            return { x: this.x/Game.map_grid.tile.width, y: this.y/Game.map_grid.tile.height }
        } else {
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height });
            return this;
        }
    }
});

// An "Actor" is an entity that is drawn in 2D on canvas
//  via our logical coordinate grid
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

// A Tree is just an Actor with a certain color
Crafty.c('Tree', {
    init: function() {
        this.requires('Actor, Solid, spr_tree');
    }
});

// A Bush is just an Actor with a certain color
Crafty.c('Bush', {
    init: function() {
        this.requires('Actor, Solid, spr_bush');
    }
});

// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function() {
        var animation_speed = 8;

        this.requires('Actor, Fourway, Collision, spr_player, SpriteAnimation')
            .fourway(200)
            .stopOnSolids()
            .onHit('Village', this.visitVillage)
            // These next lines define our four animations
            //  each call to .animate specifies:
            //  - the name of the animation
            //  - the x and y coordinates within the sprite
            //     map at which the animation set begins
            //  - the number of animation frames *in addition to* the first one
            .reel('PlayerMovingUp',    animation_speed, 0, 0, 2)
            .reel('PlayerMovingRight', animation_speed, 0, 1, 2)
            .reel('PlayerMovingDown',  animation_speed, 0, 2, 2)
            .reel('PlayerMovingLeft',  animation_speed, 0, 3, 2);


        // Watch for a change of direction and switch animations accordingly
        this.bind('NewDirection', function(data) {
            if (data.x > 0) {
                this.animate('PlayerMovingRight', -1);
            } else if (data.x < 0) {
                this.animate('PlayerMovingLeft', -1);
            } else if (data.y > 0) {
                this.animate('PlayerMovingDown', -1);
            } else if (data.y < 0) {
                this.animate('PlayerMovingUp', -1);
            } else {
                this.pauseAnimation();
            }
        });
    },

    // Registers a stop-movement function to be called when
    //  this entity hits an entity with the "Solid" component
    stopOnSolids: function() {
        this.bind('Moved', function(evt){
            if (this.hit('Solid'))
                this[evt.axis] = evt.oldValue;
        });

        return this;
    },

    // Respond to this player visiting a village
    visitVillage: function(data) {
        villlage = data[0].obj;
        villlage.visit();
    }
});

// A village is a tile on the grid that the PC must visit in order to win the game
Crafty.c('Village', {
    init: function() {
        this.requires('Actor, spr_village');
    },

    // Process a visitation with this village
    visit: function() {
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('VillageVisited', this);
    }
});