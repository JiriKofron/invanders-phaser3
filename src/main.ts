import './style.css'
import 'phaser'
import {MainScene} from "./scenes/mainScene.ts";

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    },
    scene: [MainScene]
}

export const game = new Phaser.Game(config);
