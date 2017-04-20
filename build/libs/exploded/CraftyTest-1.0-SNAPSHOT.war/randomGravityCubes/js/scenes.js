/**
 * Created by Mati on 4/1/2017.
 */


var maxFaces = 10;
var faceGenerationIntervalID;

Crafty.scene('Game', function() {

    Crafty.audio.stop('victory');
    Crafty.audio.stop('gameover');
    // Create Player character
    this.player = Crafty.e('PlayerCharacter').at(8, 19);

    // Create Happy Faces Counter Text
    Crafty.e('2D, Canvas, Text')
        .attr({ x: 11 * Game.map_grid.tile.width, y: Game.map_grid.tile.height})
        .text("Happy Faces left: " + (maxFaces-this.player.grabbedFaces))
        .textColor('#FFF')
        .textFont({size: '15px', family: 'Arial'})
        .dynamicTextGeneration(true);

    // Create Lives Text
    Crafty.e('2D, Canvas, Text')
        .attr({ x: 11 * Game.map_grid.tile.width, y: 2 * Game.map_grid.tile.height})
        .text("Lives: ")
        .textColor('#FFF')
        .textFont({size: '15px', family: 'Arial'});

    //Create Lives
    Crafty.e('Life').at(12.5, 2);
    Crafty.e('Life').at(13, 2);
    Crafty.e('Life').at(13.5, 2);

    // Create Game Walls
    // this.leftWall = Crafty.e('Wall').at(1, 19).attr({w: 1, h: 20}).color('#FFF');
    this.leftWall = Crafty.e('Wall').at(0,19).color('#000');
    this.leftWall.w = 1;
    this.rightWall = Crafty.e('Wall').at(16,19).color('#000');
    this.rightWall.w = 1;

    // Faces fabric
    faceGenerationIntervalID = setInterval(function(){
        Crafty(Crafty('Text')[0]).text("Happy Faces left: " + (maxFaces-Crafty(Crafty('PlayerCharacter')[0]).grabbedFaces));
        if(Crafty(Crafty('PlayerCharacter')[0]).lives == 2) Crafty(Crafty('Life')[2]).destroy();
        if(Crafty(Crafty('PlayerCharacter')[0]).lives == 1) Crafty(Crafty('Life')[1]).destroy();
        if(Crafty(Crafty('PlayerCharacter')[0]).lives == 0) Crafty(Crafty('Life')[0]).destroy();
        if(Crafty.math.randomInt(1,2) == 1) Crafty.e('HappyFace').at(Crafty.math.randomInt(1,15), 0);
        else Crafty.e('SadFace').at(Crafty.math.randomInt(1,15), 0);
    },1000);


    // Show the victory screen once all the faces were collected
    this.show_victory = this.bind('HappyFaceGrabbed', function() {
        if (this.player.grabbedFaces == maxFaces) {
            Crafty.scene('Victory');
        }
    });

    // Show the victory screen once all the faces were collected
    this.show_gameover = this.bind('SadFaceGrabbed', function() {
        if (this.player.lives == 0) {
            Crafty.scene('GameOver');
        }
    });

}, function() {
    // Remove our event binding from above so that we don't
    //  end up having multiple redundant event watchers after
    //  multiple restarts of the game
    this.unbind('HappyFaceGrabbed', this.show_victory);
    this.unbind('SadFaceGrabbed', this.show_gameover);
});


// Victory scene
// -------------
// Tells the player when they've won and lets them start a new game
Crafty.scene('Victory', function() {
    clearInterval(faceGenerationIntervalID);
    Crafty.audio.play('victory');
    // Display some text in celebration of the victory
    Crafty.e('2D, DOM, Text')
        .attr({ x: 5.5 * Game.map_grid.tile.width, y: 9 * Game.map_grid.tile.height})
        .text("Victory")
        .textColor('#FFF')
        .textFont({size: '50px', family: 'Arial'});

    // Watch for the player to press a key, then restart the game
    //  when a key is pressed
    this.restart_game = this.bind('KeyDown', function() {
        Crafty.scene('Game');
    });
}, function() {
    // Remove our event binding from above so that we don't
    //  end up having multiple redundant event watchers after
    //  multiple restarts of the game
    this.unbind('KeyDown', this.restart_game);
});

// GameOver scene
// -------------
// Tells the player when they've lost and lets them start a new game
Crafty.scene('GameOver', function() {
    clearInterval(faceGenerationIntervalID);
    Crafty.audio.play('gameover');
    // Display some text in celebration of the victory
    Crafty.e('2D, DOM, Text')
        .attr({ x: 4.2 * Game.map_grid.tile.width, y: 9 * Game.map_grid.tile.height})
        .text("GameOver")
        .textColor('#FFF')
        .textFont({size: '50px', family: 'Arial'});

    // Watch for the player to press a key, then restart the game
    //  when a key is pressed
    this.restart_game = this.bind('KeyDown', function() {
        Crafty.scene('Game');
    });
}, function() {
    // Remove our event binding from above so that we don't
    //  end up having multiple redundant event watchers after
    //  multiple restarts of the game
    this.unbind('KeyDown', this.restart_game);
});

// Loading scene
// -------------
// Handles the loading of binary assets such as images and audio files
Crafty.scene('Loading', function(){
    // Draw some text for the player to see in case the file
    //  takes a noticeable amount of time to load
    Crafty.e('2D, DOM, Text')
        .attr({ x: 0, y: Game.height()/2 - 24, w: Game.width() })
        .text('Loading...');

    // Load our assets
    Crafty.load({
        "audio": {
            "knock":'../assets/CoinSound.mp3',
            "victory": '../assets/GuileTheme.mp3',
            "loseLife": '../assets/OhNo.mp3',
            "gameover": '../assets/GameOver.mp3'

        },
        "sprites": {
            '../assets/HappyFace 32x32.png': {
                "tile": 32,
                "tileh": 32,
                "map": {
                    "spr_HappyFace32": [0,0]
                }
            },
            '../assets/HappyFace 16x16.png': {
                "tile": 16,
                "tileh": 16,
                "map": {
                    "spr_HappyFace16": [0,0]
                }
            },
            '../assets/SadFace 32x32.png': {
                "tile": 32,
                "tileh": 32,
                "map": {
                    "spr_SadFace32": [0,0]
                }
            },
            '../assets/SadFace 16x16.png': {
                "tile": 16,
                "tileh": 16,
                "map": {
                    "spr_SadFace16": [0,0]
                }
            },
            '../assets/Heart 16x16.png': {
                "tile": 16,
                "tileh": 16,
                "map": {
                    "spr_life16": [0,0]
                }
            },
            '../assets/Characters.png': {
                "tile": 32,
                "tileh": 32,
                "map": {
                    "spr_player": [1,7]
                }
            }
        }
    }, function(){
        // Once the assets are loaded and setup, start the game
        Crafty.scene('Game');
    })
});
