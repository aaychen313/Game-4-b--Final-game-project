class CreditsScreen extends Phaser.Scene {
    constructor() {
        super("creditsScreen");
    }

    create() {
        this.cameras.main.setBackgroundColor('#000000');

        // title text
        this.titleText = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY - 80, 
            'Alien World', 
            {
                fontSize: '70px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                align: 'center'
            }
        ).setOrigin(0.5);

        // credits text
        this.creditsText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY,
            'Game Created by Aaron Chen\nCode Base by Jim Whitehead',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'normal',
                align: 'center'
            }
        ).setOrigin(0.5);

        // restart instruction text
        this.restartText = this.add.text(
            this.cameras.main.centerX,
            this.cameras.main.centerY + 100,
            'Press SPACE to restart',
            {
                fontSize: '24px',
                fill: '#ffffff',
                fontFamily: 'Arial',
                fontStyle: 'normal',
                align: 'center'
            }
        ).setOrigin(0.5);

        this.blinkTween = this.tweens.add({
            targets: this.restartText,
            alpha: { from: 1, to: 0.3 },
            ease: 'Linear',
            duration: 500,
            yoyo: true,
            repeat: -1
        });

        // fade out
        this.fadeRect = this.add.rectangle(
            0, 0,
            this.cameras.main.width,
            this.cameras.main.height,
            0x000000
        )
        .setOrigin(0)
        .setAlpha(0)
        .setDepth(1000);

        // wait for space key to restart
        this.input.keyboard.once('keydown-SPACE', () => {
            this.blinkTween.stop();
            this.restartText.setAlpha(1);

            this.tweens.add({
                targets: this.fadeRect,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.scene.start("titleScene");
                }
            });
        });
    }
}