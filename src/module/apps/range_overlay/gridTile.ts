import CONSTANTS from "../../constants.js";
import { TokenInfo } from "./tokenInfo.js";

export class GridTile {
	gx: number;
	gy: number;
	distance: number;
	visited = false;
	upstreams: GridTile[];
	_upstreamCache: Map<string, GridTile>;

	constructor(gx, gy) {
		this.gx = gx;
		this.gy = gy;
		this.distance = CONSTANTS.MAX_DIST;
		this.visited = false;
		this.upstreams = [];
		this._upstreamCache = new Map<string, GridTile>();
	}

	get centerPt() {
		const pixels = <PointArray>canvas.grid?.grid?.getPixelsFromGridPosition(this.gx, this.gy);
		return { x: pixels[0] + <number>canvas.grid?.size / 2, y: pixels[1] + <number>canvas.grid?.size / 2 };
	}

	get pt() {
		const pixels = <PointArray>canvas.grid?.grid?.getPixelsFromGridPosition(this.gx, this.gy);
		return { x: pixels[0], y: pixels[1] };
	}

	get key() {
		return `${this.gx}-${this.gy}`;
	}

	get cost() {
		if (TokenInfo.current.isIgnoreDifficultTerrain) {
			return 1;
		} else {
			//@ts-ignore
			return canvas.terrain?.cost({ x: this.gy, y: this.gx }) ?? 1;
		}
	}

	get allUpstreams(): Map<string, GridTile> {
		if (this._upstreamCache === undefined) {
			this._upstreamCache = new Map<string, GridTile>();
			if (this.upstreams !== undefined) {
				for (const upstream of this.upstreams) {
					this._upstreamCache.set(upstream.key, upstream);
					for (const upstream2 of upstream.allUpstreams.values()) {
						this._upstreamCache.set(upstream2.key, upstream2);
					}
				}
			}
		}
		return this._upstreamCache;
	}

	static fromPixels(x, y) {
		const [gx, gy] = <PointArray>canvas.grid?.grid?.getGridPositionFromPixels(x, y);
		return new GridTile(gx, gy);
	}

	upstreamOf(tile) {
		return tile.allUpstreams.has(this.key);
	}

	isDiagonal(neighbor) {
		return this.gx !== neighbor.gx && this.gy !== neighbor.gy;
	}
}
