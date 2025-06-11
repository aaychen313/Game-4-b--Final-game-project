class Load extends Phaser.Scene {
    constructor() {
        super("loadScene");
    }

    preload() {
        this.load.setPath("./assets/");

        //load character spritesheet
        this.load.atlas("platformer_characters", "tilemap-characters-packed.png", "tilemap-characters-packed.json");

        //load tilemap spritesheet
        this.load.image("background_tiles", "tilemap_background_packed.png");
        this.load.image("tilemap_tiles", "tilemap_packed.png");                         // Packed tilemap
        this.load.image("food_tilemap_tiles", "food_tilemap_packed.png");                     // Packed tilemap 2
        this.load.tilemapTiledJSON("platformer-level-1", "platformer-level-1.tmj");   // Tilemap in JSON
        this.load.tilemapTiledJSON("platformer-level-2", "platformer-level-2.tmj");

        this.load.spritesheet("tilemap_sheet", "tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.spritesheet("food_tilemap_sheet", "food_tilemap_packed.png", {
            frameWidth: 18,
            frameHeight: 18
        });

        this.load.multiatlas("kenny-particles", "kenny-particles.json");

    }

    create() {
        this.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNames('platformer_characters', {
                prefix: "tile_",
                start: 0,
                end: 1,
                suffix: ".png",
                zeroPad: 4
            }),
            frameRate: 15,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0000.png" }
            ],
            repeat: -1
        });

        this.anims.create({
            key: 'jump',
            defaultTextureKey: "platformer_characters",
            frames: [
                { frame: "tile_0001.png" }
            ],
        });

         this.scene.start("titleScene");
    }

    update() {
    }
}