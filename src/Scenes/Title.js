class Title extends Phaser.Scene {
    constructor() {
        super('titleScene');
    }

    create() {
        
        const { width, height } = this.scale;

    // Game title
    this.add.text(width / 2, height / 2 - 50, 'Alien World', {
        fontFamily: "Titan One",
        fontSize: "100px",
        color: "#ffffff",
        stroke: "#00c271",
        strokeThickness: 8
    }).setOrigin(0.5);

    // Prompt
    let startText = this.add.text(width / 2, height / 2 + 50, 'Press SPACE to Start', {
        fontFamily: "Titan One",
        fontSize: "64px",
        color: "#eeeeee",
        stroke: "#00c271",
        strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
        targets: startText,
        alpha: { from: 1, to: 0.3 },
        duration: 800,
        yoyo: true,
        repeat: -1
    });

    // Start game on SPACE
    this.input.keyboard.once('keydown-SPACE', () => {
      this.scene.start('platformerScene');
    });
  }
}

