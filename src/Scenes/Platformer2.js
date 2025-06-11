class Platformer2 extends Phaser.Scene {
    constructor() {
        super("platformerScene2");
    }

    init() {
        // variables and settings
        this.ACCELERATION = 400;
        this.DRAG = 1500;    // DRAG < ACCELERATION = icy slide
        this.JUMP_VELOCITY = -650;
        this.PARTICLE_VELOCITY = 50;
        this.SCALE = 2.0;
        this.waitingForRestart = false;
    }

    preload() {
        this.load.setPath("./assets/");
        this.load.audio('jumpSound', 'Jump.wav');
        this.load.audio('coinSound', 'Coin.wav');
        this.load.audio('walkSound', 'Walk.mp3');
        this.load.audio('finishSound', 'Finish.wav');
        this.load.scenePlugin('AnimatedTiles', './lib/AnimatedTiles.js', 'animatedTiles', 'animatedTiles');
    }

    create() {
        // tilemap w: 155 tiles, h: 25 tiles, 18x18 px tiles
        this.map = this.add.tilemap("platformer-level-2", 18, 18, 45, 25);

        this.tileset = this.map.addTilesetImage("food_tilemap_packed", "food_tilemap_tiles");

        this.groundLayer = this.map.createLayer("Ground-n-Platforms", this.tileset, 0, 0);
        this.finishLayer = this.map.createLayer("Finish", this.tileset, 0, 0);

        this.groundLayer.setCollisionByProperty({
            collides: true
        });
        this.finishLayer.setCollisionByProperty({
             collides: true
        });

        this.coins = this.map.createFromObjects("Objects", {
            name: "coin",
            key: "tilemap_sheet",
            frame: 151
        });
        this.flag = this.map.createFromObjects("Objects", {
            name: "flag",
            key: "tilemap_sheet",
            frame: 111
        });
        

        this.anims.create({
            key: 'coinAnim', // Animation key
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                {start: 151, end: 152}
            ),
            frameRate: 10,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });
        this.anims.create({
            key: 'flagAnim', // Animation key
            frames: this.anims.generateFrameNumbers('tilemap_sheet', 
                {start: 111, end: 112}
            ),
            frameRate: 10,  // Higher is faster
            repeat: -1      // Loop the animation indefinitely
        });

        this.anims.play('coinAnim', this.coins);
        this.anims.play('flagAnim', this.flag);

        this.physics.world.enable(this.coins, Phaser.Physics.Arcade.STATIC_BODY);
        this.physics.world.enable(this.flag, Phaser.Physics.Arcade.STATIC_BODY);

        this.coinGroup = this.add.group(this.coins);
        this.flagGroup = this.add.group(this.flag);

        my.sprite.player = this.physics.add.sprite(30, 345, "platformer_characters", "tile_0000.png");
        my.sprite.player.setCollideWorldBounds(true);

        // Enable collision handling
        this.physics.add.collider(my.sprite.player, this.groundLayer);
        this.physics.add.collider(my.sprite.player, this.finishLayer, () =>{
             this.finishCollide();
        });



        this.coinParticles = this.add.particles(0, 0, "kenny-particles", {
            frame: ['star_01.png','star_02.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            quantity: 1,          
        });
        this.coinParticles.stop();

        // Coin collision handler
        this.physics.add.overlap(my.sprite.player, this.coinGroup, (obj1, obj2) => {
            obj2.destroy(); // remove coin on overlap
            this.coinParticles.setPosition(obj2.x, obj2.y);
            this.coinParticles.emitParticle(10);
            this.sound.play("coinSound");
        });
        this.physics.add.overlap(my.sprite.player, this.flagGroup, (obj1, obj2) => {
            obj2.destroy(); // remove flag on overlap
            this.sound.play("finishSound");
            this.scene.start("winScreen");
        });

        cursors = this.input.keyboard.createCursorKeys();

        this.rKey = this.input.keyboard.addKey('R');

        // debug key listener (assigned to D key)
        this.input.keyboard.on('keydown-D', () => {
            this.physics.world.drawDebug = this.physics.world.drawDebug ? false : true
            this.physics.world.debugGraphic.clear()
        }, this);

        my.vfx.walking = this.add.particles(0, 0, "kenny-particles", {
            frame: ['smoke_03.png', 'smoke_09.png'],
            scale: {start: 0.03, end: 0.1},
            lifespan: 350,
            alpha: {start: 1, end: 0.1}, 
        });
        my.vfx.walking.stop();

        // Simple camera to follow player
        this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.cameras.main.startFollow(my.sprite.player, true, 0.25, 0.25); // (target, [,roundPixels][,lerpX][,lerpY])
        this.cameras.main.setDeadzone(50, 50);
        this.cameras.main.setZoom(this.SCALE);
        //this.animatedTiles.init(this.map);
    }

    finishCollide() {
        this.sound.play("finishSound");
        this.scene.start("winScreen");
    }

    update() {
        if(cursors.left.isDown) {
            my.sprite.player.setAccelerationX(-this.ACCELERATION);
            my.sprite.player.resetFlip();
            my.sprite.player.anims.play('walk', true);
            
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else if(cursors.right.isDown) {
            my.sprite.player.setAccelerationX(this.ACCELERATION);
            my.sprite.player.setFlip(true, false);
            my.sprite.player.anims.play('walk', true);
            my.vfx.walking.startFollow(my.sprite.player, my.sprite.player.displayWidth/2-10, my.sprite.player.displayHeight/2-5, false);
            my.vfx.walking.setParticleSpeed(this.PARTICLE_VELOCITY, 0);
            if (my.sprite.player.body.blocked.down) {
                my.vfx.walking.start();
            }

        } else {
            my.sprite.player.setAccelerationX(0);
            my.sprite.player.setDragX(this.DRAG);
            my.sprite.player.anims.play('idle');
            my.vfx.walking.stop();
        }

        // player jump
        if(!my.sprite.player.body.blocked.down) {
            my.sprite.player.anims.play('jump');
        }
        if(my.sprite.player.body.blocked.down && Phaser.Input.Keyboard.JustDown(cursors.up)) {
            my.sprite.player.body.setVelocityY(this.JUMP_VELOCITY);
            this.sound.play("jumpSound");
        }

        if(Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }

        // kill player if they exit world bounds
        if (my.sprite.player.y > this.map.heightInPixels) {
            this.handlePlayerDeath();
        }
        if (this.waitingForRestart && Phaser.Input.Keyboard.JustDown(this.rKey)) {
            this.scene.restart();
        }
    }

    handlePlayerDeath() {
        // Stop player input
        this.physics.world.pause();
        my.sprite.player.setTint(0xff0000); 
        my.sprite.player.anims.stop();
    
        // Show "You Died" text
        this.deathText = this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'YOU DIED\nPress R to Restart', {
            fontSize: '48px',
            fill: '#ffffff',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        this.deathText.setScrollFactor(0);
        this.deathText.setDepth(9999);
    
        // Set flag to wait for restart key
        this.waitingForRestart = true;
    }
}