import { Enemy } from './enemy';
import { Player } from './player';
import { Context } from '../context';
import { Vector, Rectangle, Tile, Meele, Animation, SpellType, DebugElement, ProjectileType } from '../model';
import { TextureMapper } from '../render/textureMapper';
import { AnimationHandler } from '../handler/animationHandler';
import { ProjectileHandler } from '../handler/projectileHandler';
import { ParticleHandler } from '../handler/particleHandler';
import { DebugHandler } from '../handler/debugHandler';
import { DeathType } from './deathType';
import { State } from './state';

export class Apprentice extends Enemy {

    protected hitAreaOffset: number = 500;
    protected searchAreaOffset: number = 500;
    protected hp = 50;
    protected trackingSpeed = 0.05;
    protected idleSpeed = 0.05;
    protected minDistance = 30;
    private textureMapper = TextureMapper.getInstance();
    private projectileHandler: ProjectileHandler;
    private animationHandler: AnimationHandler;
    private projectileVelocity = 0.5;
    private shoot = false;
    private onBlackFireUpdate = (area: Rectangle, inverse: boolean, offsetX: number) => {
         this.particleHandler.createNecroFireBall(new Vector(area.x, area.y), area.width, inverse, offsetX);
    };

    public debugHandler = DebugHandler.getInstance();

    constructor(position: Vector, width: number, height: number, projectileHandler: ProjectileHandler, animationHandler: AnimationHandler, private particleHandler: ParticleHandler) {
        super(position, width, height);
        this.projectileHandler = projectileHandler;
        this.animationHandler = animationHandler;

        this.idleAnimation = new Animation([139, 140, 141, 142, 143]);
        this.idleAnimation.timeToChange = 175;

        this.trackingAnimation = new Animation([139, 140, 141, 142, 143]);

        this.trackingAnimation.timeToChange = 175;

        this.hitAnimation = new Animation([139, 140, 141, 142, 143]);

        this.hitAnimation.timeToChange = 250;

        this.currentAnimation = this.hitAnimation;


    }

    public update(delta: number, tiles: Tile[], player: Player) {
        super.update(delta, tiles, player);

        this.currentAnimation.next(delta);

        this.npcAction(delta, player, tiles);
    }

    public getCollisionArea() {
        let collisionArea: Rectangle;

        collisionArea = new Rectangle(this.position.x + 25, this.position.y + 15, this.width - 50, this.height - 20);

        return collisionArea;
    }

    public takeDamage(damage: number, type: SpellType) {
        super.takeDamage(damage, type);
        if(this.damageAudioTimer <= 0) {
            this.animationHandler.audioHandler.playSound("ogre2.wav", 1, 0, 0.1);
            this.damageAudioTimer = this.damageAudioTimerValue;
        }
    }

    protected hit(delta: number, player: Player, tiles: Tile[]) {
        super.hit(delta, player, tiles);
        if (this.hitAnimation.frameIndex == 3) {
            if (!this.shoot) {
                let velocity = this.getDeltaPosition(player, 0, 0);
                velocity.y = velocity.y + 20; 
                velocity.normalize();
                velocity.multiply(this.projectileVelocity);
                let pos = new Vector(this.position.x, this.position.y);
                this.projectileHandler.createNecroBall(pos, 40, this.inverse, velocity, 100, 40, ProjectileType.NecroBall, this.onBlackFireUpdate);
                this.shoot = true;
            }

        } else {
            this.shoot = false;
        }
    }

    protected idle(delta: number, player: Player, tiles: Tile[]) {
        super.idle(delta, player, tiles);
        this.actualSpeed = this.maxSpeed;
    }

    protected idleToTrackingTransition(delta: number) {
        this.currentState = State.Tracking;
    }

    protected trackingToInRangeTransition(delta: number) {
        this.currentState = State.InHitRange;
    }

    protected trackingToIdleTransition(delta: number) {
        this.currentState = State.Idle;
    }

    protected inRange(player: Player, offset: number, tiles: Tile[]) {

        let deltaPos = this.getDeltaPosition(player, 10, 0);
        let magnitude = deltaPos.magnitude();

        if (magnitude < offset) {
            if (this.clearShoot(deltaPos, tiles)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }
}