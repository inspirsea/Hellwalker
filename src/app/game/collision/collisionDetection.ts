import { Vector, Tile, Rectangle, Projectile } from '../model';
import { CollisionData } from './';
import { Player } from '../player/player';

export class CollisionDetection {

	private static instance: CollisionDetection = new CollisionDetection();

	constructor() {
		if(CollisionDetection.instance) {
			throw new Error("Static class cant be instanced!");
		}

		CollisionDetection.instance = this;
	}

	public static getInstance() {
		return CollisionDetection.instance;
	}

	private pushNull(tile: Tile, tilesToCheck: Tile[]) {
		if(tile != null) {
			tilesToCheck.push(tile);
		}
	}

	public collisionDetection(tiles: Tile[], player: Player) {

		let collisionData = this.checkCollision(tiles, player, player.toMove);

		if(collisionData.wallCollision) {
			let position = new Vector(player.position.x, player.position.y);
			collisionData.wallCollision = false;
			collisionData = this.checkCollision(tiles, player, new Vector((player.toMove.x * (1 - collisionData.collisionTimeX)) ,-5));
			if(collisionData.wallCollision) {
				player.position = position;
			}
		}

		return collisionData;
	}

	public checkProjectileCollision(collidables: Rectangle[], projectile: Projectile, frameVelocity: Vector) {

		let broadphasebox = this.getSweptBroadphaseBoxX(projectile.collisionArea, frameVelocity);

		let collisionData: CollisionData = new CollisionData();

		for(let collidable of collidables) {
			if(this.aabbCheck(broadphasebox, collidable)) {
				collisionData = this.aabbCollisionX(projectile.collisionArea, collidable, frameVelocity, collisionData);
			}
		}

		projectile.area.x += frameVelocity.x * collisionData.collisionTimeX;

		return collisionData;
	}

	public checkCollision(tiles: Tile[], player: Player, frameVelocity: Vector) {

		let tilesToCheck = tiles;
		let collisionData: CollisionData = new CollisionData();
		let rect1 = player.getCollisionArea();
		let broadphasebox = this.getSweptBroadphaseBoxY(rect1, frameVelocity);
		for(let tile of tilesToCheck) {
			if(this.aabbCheck(broadphasebox, tile)) {
				collisionData = this.aabbCollisionY(player.getCollisionArea(), tile, frameVelocity, collisionData);
			}
		}

		player.position.y += frameVelocity.y * collisionData.collisionTimeY;

		rect1 = player.getCollisionArea();
		broadphasebox = this.getSweptBroadphaseBoxX(rect1, frameVelocity);

		for(let tile of tilesToCheck) {
			if(tile.tileTextureType != 0) {
				if(this.aabbCheck(broadphasebox, tile)) {
					collisionData = this.aabbCollisionX(player.getCollisionArea(), tile, frameVelocity, collisionData);
				}
			}
		}

		player.position.x += frameVelocity.x * collisionData.collisionTimeX;
		
		collisionData.remainingTime = 1 - collisionData.collisionTimeY;

		return collisionData;
	}

	public checkCoutOfBounds(player: Player, area: Rectangle) {
		if(!this.aabbCheck(player.getCollisionArea(), area)) {
			player.dead = true;
		}
	}

	public aabbCheck(rect1: Rectangle, rect2: Rectangle) {
		return (rect1.x < rect2.x + rect2.width && rect1.x + rect1.width > rect2.x && rect1.y < rect2.y + rect2.height && rect1.height + rect1.y > rect2.y)
	}

	private checkStep(tiles: Tile[], player: Player, collisionData: CollisionData) {

	}

	private getSweptBroadphaseBoxX(rect: Rectangle, velocity: Vector)
	{
		let x = rect.x + velocity.x;
    	let y = rect.y;
    	let width = rect.width + Math.abs(velocity.x);
    	let height = rect.height;

    	return new Rectangle(x, y, width, height);
	}

	private getSweptBroadphaseBoxY(rect: Rectangle, velocity: Vector)
	{
    	let x = rect.x;
    	let y = rect.y + velocity.y;
    	let width = rect.width;
    	let height = rect.height + Math.abs(velocity.y);

    	return new Rectangle(x, y, width, height);
	}

	private aabbCollisionY(rect1: Rectangle, rect2: Tile, velocity: Vector, collisionData: CollisionData) {
		let yInvEntry: number;
		let yInvExit: number;

		if(velocity.y > 0) {
			yInvEntry = (rect2.y) - (rect1.y + rect1.height);
			yInvExit = (rect2.y + rect2.height) - (rect1.y);
		} else {
			yInvEntry = (rect2.y + rect2.height) - (rect1.y);
			yInvExit = (rect2.y) - (rect1.y + rect1.height);
		}

		let yEntry: number;
		let yExit: number;

		if(velocity.y == 0) {
			yEntry = -Number.MAX_SAFE_INTEGER;
			yExit = Number.MAX_SAFE_INTEGER;
		} else {
			yEntry = yInvEntry / velocity.y;
			yExit = yInvExit / velocity.y;
		}

		let entryTime = yEntry;
		let exitTime = yExit;

		if (entryTime > exitTime || yEntry < 0 || yEntry > 1) {
        	return collisionData;
    	} else {
    		if (velocity.y < 0) {
                	collisionData.normalY = 1;
            	}
	        	else {
		        	collisionData.normalY = -1;
            	}

            	if(collisionData.collisionTimeY > entryTime) {
            		collisionData.collisionTimeY = entryTime;	
            	}

				if(rect2.tileTextureType == 25 && velocity.y > 5) {
					collisionData.fallDeath = true;
				}
            	
				if(velocity.y > 18) {
					collisionData.fallDeath = true;
				}

            	collisionData.groundCollision = true;

		}
        return collisionData;
	}

	private aabbCollisionX(rect1: Rectangle, rect2: Rectangle, velocity: Vector, collisionData: CollisionData) {
		let xInvEntry: number;
		let xInvExit: number;

		if(velocity.x > 0) {
			xInvEntry = (rect2.x) - (rect1.x + rect1.width);
			xInvExit = (rect2.x + rect2.width) - (rect1.x);
		} else {
			xInvEntry = (rect2.x + rect2.width) - (rect1.x);
			xInvExit = (rect2.x) - (rect1.x + rect1.width);
		}

		let xEntry: number;
		let xExit: number;

		if(velocity.x == 0) {
			xEntry = -Number.MAX_SAFE_INTEGER;
			xExit = Number.MAX_SAFE_INTEGER;
		} else {
			xEntry = xInvEntry / velocity.x;
			xExit = xInvExit / velocity.x;
		}

		let entryTime = xEntry;
		let exitTime = xExit;

		if (entryTime > exitTime || xEntry < 0 || xEntry > 1) {
        		return collisionData;
    	} else {
    		if (xInvEntry < 0) {
            	collisionData.normalX = 1;
            } else {
                collisionData.normalX = -1;
            }

            if(collisionData.collisionTimeX > entryTime) {
            	collisionData.collisionTimeX = entryTime;	
            }

            collisionData.wallCollision = true;
    	}

        return collisionData;
    }

}