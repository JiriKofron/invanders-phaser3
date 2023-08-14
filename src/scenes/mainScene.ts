
export class MainScene extends Phaser.Scene {
    constructor () {
        super({ key: 'MainScene' });
    }

    ship: any;
    invaders: any;
    cursors: any;
    keySpace: any;
    bullet: any;
    stopBullet: any
    gameOverText: any
    invadersCount: any
    winText: any

    shoot() {
        if(this.keySpace.isDown) {
            if(!this.stopBullet) {
                this.bullet = this.physics.add.image(this.ship.x, 670, "bullet")
                this.bullet.setVelocityY(-500)
                this.stopBullet = true


                this.physics.add.overlap(this.bullet, this.invaders, this.destroyInvader, null, this)
            }
        }

        if (this.keySpace.isUp) {
            this.stopBullet = false
        }
    }

    destroyInvader(bullet: any, invader: any) {
        invader.disableBody(true, true);
        bullet.disableBody(true, true);
        this.invadersCount--
    }

    gameOver(ship: any) {
        ship.disableBody(true, true)
        this.invaders.forEach(invader => invader.setVelocityY(0))
        this.gameOverText.visible = true
    }

    invadersProgress() {
        this.physics.add.overlap(this.ship, this.invaders, this.gameOver, null, this)
    }

    invaderMovement() {
       this.invaders.forEach((invader: any) => {
           invader.setVelocityY(20)
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

        this.invadersCount = 0
        this.invaders.forEach(invader => {
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
            this.winText.visible = true
            this.invaders.forEach(invader => invader.setVelocityY(0))
        }
    }
}
