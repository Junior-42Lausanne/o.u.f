import MainStage from '../stages/MainStage';
import TransformBox from './TransformBox';
import BitmapEditable from './BitmapEditable';
const createjs = window.createjs;

export default class TextureEditable extends createjs.Container {
	static parent: createjs.Container;
	static _boundingBox: TransformBox | null;

	type: string;
	x: number;
	y: number;
	image: HTMLImageElement | undefined;
	customMask: createjs.Shape;
	mouseDifferenceToOrigin: { x: number; y: number } = { x: 0, y: 0 };
	crossOrigin: string = '';

	constructor(imageOrUri: string, instructions?: any[]) {
		super();

		this.type = 'TextureEditable';
		this.x = 0;
		this.y = 0;

		var image = new Image();
		image.src = imageOrUri;
		image.onload = () => {
			var shape = new createjs.Shape();
			shape.graphics.beginBitmapFill(image, 'repeat-x');
			shape.graphics.drawRect(0, 0, MainStage.currentStage!.totalWidth, 600);
			this.image = image;
			this.addChild(shape);
		};

		this.customMask = new createjs.Shape();
		this.customMask.graphics.setStrokeStyle(1);

		if (instructions) {
			instructions.map((elt, index) => {
				if (index === 0) {
					this.customMask.graphics.moveTo(elt.x, elt.y);
				} else {
					this.customMask.graphics.lineTo(elt.x, elt.y);
				}
				return elt;
			});
			TextureEditable.parent.addChild(this);
			this.mask = this.customMask;
		}

		this.mask = this.customMask;
		this.on('mousedown', this.onMousedown);
		this.on('pressmove', this.onPressmove);
		this.on('pressup', this.onPressup);
	}

	/* INSTANCE METHODS */

	// @ts-ignore
	onMousedown(e) {
		this.mouseDifferenceToOrigin = {
			x: e.stageX - this.customMask.x,
			y: e.stageY - this.customMask.y
		};

		let stage = TextureEditable.parent;
		stage.setChildIndex(this, stage.getNumChildren() - 1);
		TextureEditable.boundingBox = null;
		BitmapEditable.boundingBox = null;
	}

	// @ts-ignore
	onPressmove(e) {
		const positionX = e.rawX - this.mouseDifferenceToOrigin.x;
		const positionY = e.rawY - this.mouseDifferenceToOrigin.y;

		this.customMask.x = positionX;
		this.customMask.y = positionY;

		if (e.rawX < 5 || e.rawX > 795 || e.rawY < 5 || e.rawY > 595) {
			this.alpha = 0.3;
		} else {
			this.alpha = 1;
		}
	}

	// @ts-ignore
	onPressup(e) {
		if (e.rawX < 5 || e.rawX > 795 || e.rawY < 5 || e.rawY > 595) {
			this.parent.removeChild(this);
			MainStage.currentStage!.saveSerializedStage();
		} else {
			MainStage.currentStage!.saveSerializedStage();
			TextureEditable.displayBoundingBox(this);
		}
	}

	// @ts-ignore
	drawTexture(e) {
		e.stopPropagation();

		// @ts-ignore
		const instructionLength = this.customMask.graphics._activeInstructions.length;

		const xOffset = -MainStage.currentStage!.x + MainStage.currentStage!.regX;
		if (instructionLength > 1) {
			// @ts-ignore
			let closePoint = this.customMask.graphics._activeInstructions.pop();
			this.customMask.graphics.lineTo(e.stageX + xOffset, e.stageY);
			// @ts-ignore
			this.customMask.graphics._activeInstructions.push(closePoint);
		} else {
			this.customMask.graphics.moveTo(e.stageX + xOffset, e.stageY);
			this.customMask.graphics.lineTo(e.stageX + xOffset, e.stageY);

			TextureEditable.parent.addChild(this);
		}
	}

	draw(ctx: CanvasRenderingContext2D, ignoreCache?: boolean) {
		super.draw(ctx, ignoreCache);
		return true;
	}

	/* STATIC METHODS */

	static get boundingBox() {
		return TextureEditable._boundingBox;
	}

	static set boundingBox(box) {
		if (TextureEditable._boundingBox) {
			BitmapEditable.parent.removeChild(TextureEditable._boundingBox);
		}

		TextureEditable._boundingBox = box;
		TextureEditable.parent.addChild(box!);
	}

	static displayBoundingBox(object: TextureEditable) {
		let transformBox = new TransformBox(object);
		TextureEditable.boundingBox = transformBox;
		BitmapEditable.parent.addChild(transformBox);
	}
}
