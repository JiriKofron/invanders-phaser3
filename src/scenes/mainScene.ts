export class MainScene extends Phaser.Scene {
    constructor () {
        super({ key: 'MainScene' });
    }

    ship: any;
    invader: any;
    cursors: any;
    keySpace: any;
    bullet: any;
    stopBullet: any

    shoot() {
        if(this.keySpace.isDown) {
            if(!this.stopBullet) {
                this.bullet = this.physics.add.image(((this.ship.x + 13) + (this.ship.width/2)), 750, "bullet")
                this.bullet.setVelocityY(-400)
                this.stopBullet = true
            }
        }

        if (this.keySpace.isUp) {
            this.stopBullet = false
        }
    }

    preload() {
        this.load.svg('ship', './assets/ship.svg');
        this.load.svg('bullet', './assets/bullet.svg')
        this.load.svg('invader', './assets/invader.svg')
    }

    create() {
        this.ship = this.physics.add.sprite(100,700,"ship").setCollideWorldBounds(true);
        this.invader = this.physics.add.sprite(100,100,"invader").setCollideWorldBounds(true);
        this.cursors = this.input.keyboard?.createCursorKeys();
        this.keySpace = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if (this.cursors?.left.isDown) {
            this.ship.setVelocityX(-200)
        } else if (this.cursors?.right.isDown) {
            this.ship.setVelocityX(200)
        } else this.ship.setVelocityX(0)

        this.shoot()

    }
}
