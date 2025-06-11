class WinScreen extends Phaser.Scene {
    constructor() {
        super("winScreen");
        
        this.text = {};  
    }

    create() {
        this.restartGame = this.input.keyboard.addKey("R");

        this.add.text(320, 300, "Level complete!", {
            fontFamily: 'Brush, serif',
            fontSize: "100px",
            wordWrap: {
                width: 0
            }
        });

        this.add.text(320, 400, "Off to the next world! (Press R)", {
            fontFamily: 'Brush, serif',
            fontSize: "50px",
            wordWrap: {
                width: 0
            }
        });
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(this.restartGame)) {
            this.scene.stop("winScreen");
            this.scene.start("platformerScene2");
        }
    }
}