/**
 * Created by Mati on 4/1/2017.
 */

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
            this.attr({ x: x * Game.map_grid.tile.width, y: y * Game.map_grid.tile.height});
            return this;
        }
    }
});

// Actor is an 2d Entity in the canvas system grid
Crafty.c('Actor', {
    init: function() {
        this.requires('2D, Canvas, Grid');
    }
});

// Face is an actor with a sprite
Crafty.c('Face', {
    init: function() {
        this.requires('Actor, Gravity')
            .gravity('Floor');
    }
});

Crafty.c('HappyFace', {
    init: function() {
        this.requires('Face, spr_HappyFace32');
    },

    // Process HappyFace grab
    grab: function() {
        this.destroy();
        Crafty.audio.play('knock');
        Crafty.trigger('HappyFaceGrabbed', this);
    }
});

Crafty.c('SadFace', {
    init: function() {
        this.requires('Face, spr_SadFace32');
    },

    // Process HapyyFace grab
    grab: function() {
        this.destroy();
        Crafty.audio.play('loseLife');
        Crafty.trigger('SadFaceGrabbed', this);
    }
});

Crafty.c('Wall', {
    init: function () {
        this.requires('Actor, Color, Solid');
    }
});

Crafty.c('Life', {
    init: function () {
        this.requires('Actor, Color, spr_life16');
    }
});


// This is the player-controlled character
Crafty.c('PlayerCharacter', {
    init: function() {
        var animation_speed = 8;

        this.requires('Actor, Twoway, Collision, spr_player, SpriteAnimation')
            .twoway(500)
            .attr({grabbedFaces: 0, lives: 3})
            .stopOnWalls()
            .onHit('Face', this.grabFace)
            .reel('PlayerMovingRight', animation_speed, 0, 6, 2)
            .reel('PlayerMovingLeft',  animation_speed, 0, 5, 2);


        // Watch for a change of direction and switch animations accordingly
        this.bind('NewDirection', function(data) {
            if (data.x > 0) {
                this.animate('PlayerMovingRight', -1);
            } else if (data.x < 0) {
                this.animate('PlayerMovingLeft', -1);
            } else {
                this.pauseAnimation();
            }
        });
    },

    // Respond to this player grabing a face
    grabFace: function(data) {
        face = data[0].obj;
        if(face.has("HappyFace")) this.grabbedFaces = this.grabbedFaces + 1;
        if(face.has("SadFace")) this.lives = this.lives - 1;
        face.grab();
    },
    stopOnWalls: function() {
        this.bind('Moved', function(evt){
            if (this.hit('Wall'))
                this[evt.axis] = evt.oldValue;
        });

        return this;
    }
});
