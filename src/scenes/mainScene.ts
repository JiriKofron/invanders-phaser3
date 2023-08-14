import Tile = Phaser.Tilemaps.Tile;
import {Howl} from 'howler'

export class MainScene extends Phaser.Scene {
    constructor () {
        super({ key: 'MainScene' });
    }

    ship: any;
    invaders!: Phaser.Physics.Arcade.Group[];
    cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    keySpace?: Phaser.Input.Keyboard.Key;
    bullet!: Phaser.Physics.Arcade.Image;
    stopBullet!: boolean
    gameOverText!: Phaser.GameObjects.Text
    invadersCount!: number
    winText!: Phaser.GameObjects.Text
    restartButton!: Phaser.GameObjects.Text
    laserShotSound!: Howl
    invaderDestroyedSound!: Howl
    shipDestroyedSound!: Howl

    shoot() {
        if(this.keySpace?.isDown) {
            if(!this.stopBullet) {
                this.bullet = this.physics.add.image(this.ship.x, 670, "bullet")
                this.bullet.setVelocityY(-500)
                this.stopBullet = true
                this.laserShotSound.play()


                this.physics.add.overlap(this.bullet, this.invaders, this.destroyInvader, undefined, this)
            }
        }

        if (this.keySpace?.isUp) {
            this.stopBullet = false
        }
    }

    destroyInvader(bullet: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tile, invader: Phaser.Types.Physics.Arcade.GameObjectWithBody | Tile) {
        (invader as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody)
            .disableBody(true, true);
        (bullet as Phaser.Types.Physics.Arcade.SpriteWithDynamicBody)
            .disableBody(true, true);
        this.invadersCount--;

        this.invaderDestroyedSound.play();
    }

    gameOver(ship: any) {
        ship.disableBody(true, true)
        this.invaders.forEach((invader: Phaser.Physics.Arcade.Group) => invader.setVelocityY(0));
        this.gameOverText.visible = true;
        this.restartButton.visible = true;

        this.shipDestroyedSound.play();
    }

    invadersProgress() {
        this.physics.add.overlap(this.ship, this.invaders, this.gameOver, undefined, this)
    }

    invaderMovement() {
       this.invaders.forEach((invader: any) => {
           invader.setVelocityY(20)
       })
    }

    gameTexts() {
        const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
        const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;

        this.gameOverText = this.add.text( screenCenterX, screenCenterY, "Game Over")
            .setFont("50px Arial")
            .setColor('#ffffff').setOrigin(0.5);
        this.gameOverText.visible = false

        this.winText = this.add.text( screenCenterX, screenCenterY, "Good job!")
            .setFont("50px Arial")
            .setColor('#ffffff').setOrigin(0.5);
        this.winText.visible = false

        this.restartButton = this.add.text(screenCenterX, screenCenterY + 60, 'Restart')
            .setFont("30px Arial")
            .setColor('#ffffff')
            .setOrigin(0.5)
            .setPadding(10)
            .setStyle({
                backgroundColor: '#111',
                border: '10px solid #111'
                })
            .setInteractive({useHandCursor: true})
            .on('pointerdown', () => this.scene.restart())
        this.restartButton.visible = false
    }

    sounds() {
        this.laserShotSound = new Howl({
            src: ['./assets/shoot.wav']
        })

        this.invaderDestroyedSound = new Howl({
            src: ['./assets/invaderkilled.wav']
        })

        this.shipDestroyedSound = new Howl({
            src: ['./assets/explosion.wav']
        })
    }

    preload() {
        this.load.svg('ship', './assets/ship.svg');
        this.load.svg('bullet', './assets/bullet.svg')
        this.load.svg('invader', './assets/invader.svg')
    }

    create() {
        this.ship = this.physics.add.sprite(100,700,'ship').setCollideWorldBounds(true);
        this.invaders = []

        for(let i = 1; i < 4; i++) {
            this.invaders.push(this.physics.add.group(
                {
                    key: 'invader',
                    repeat: 10,
                    setXY: {x: 100, y: 75 * i, stepX: 100},
                }))
        }

        this.cursors = this.input.keyboard?.createCursorKeys();
        this.keySpace = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.gameTexts()
        this.sounds()

        this.invadersCount = 0
        this.invaders.forEach((invader: Phaser.Physics.Arcade.Group) => {
            this.invadersCount += invader.getChildren().length
        })

        this.invaderMovement()
    }

    update() {
        if (this.cursors?.left.isDown) {
            this.ship.setVelocityX(-200)
        } else if (this.cursors?.right.isDown) {
            this.ship.setVelocityX(200)
        } else this.ship.setVelocityX(0)

        this.shoot()
        this.invadersProgress()

        if(this.invadersCount === 0) {
            this.invaders.forEach((invader: Phaser.Physics.Arcade.Group) => invader.setVelocityY(0))
            this.winText.visible = true
            this.restartButton.visible = true
        }
    }
}
