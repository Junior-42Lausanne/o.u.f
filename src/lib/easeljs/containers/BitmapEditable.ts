import MainStage from '../stages/MainStage';
import TransformBox from './TransformBox';
import TextureEditable from './TextureEditable';

export default class BitmapEditable extends createjs.Bitmap {
	private static _boundingBox: TransformBox | null;
	type: string;
	mouseDifferenceToOrigin:
		| {
				x: number;
				y: number;
		  }
		| undefined;
	static parent: createjs.Container;

	constructor(imageOrUri: string | Object) {
		super(imageOrUri);

		this.type = 'BitmapEditable';

		this.on('mousedown', this.onMousedown);
		this.on('pressmove', this.onPressmove);
		this.on('pressup', this.onPressup);

		BitmapEditable.parent.addChild(this);
	}

	/* INSTANCE METHODS */

	// @ts-ignore
	onMousedown(e) {
		this.mouseDifferenceToOrigin = {
			x: e.stageX - this.x,
			y: e.stageY - this.y
		};

		let stage = BitmapEditable.parent;
		stage.setChildIndex(this, stage.getNumChildren() - 1);
		BitmapEditable.boundingBox = null;
		TextureEditable.boundingBox = null;
	}

	// @ts-ignore
	onPressmove(e) {
		this.x = e.rawX - this.mouseDifferenceToOrigin!.x;
		this.y = e.rawY - this.mouseDifferenceToOrigin!.y;
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
			MainStage.currentStage.saveSerializedStage();
		} else {
			MainStage.currentStage.saveSerializedStage();
			BitmapEditable.displayBoundingBox(this);
		}
	}

	draw(ctx: CanvasRenderingContext2D, ignoreCache?: boolean): boolean {
		super.draw(ctx, ignoreCache);
		this.regX = this.image.width / 2;
		this.regY = this.image.height / 2;
		return true;
	}

	/* STATIC METHODS */

	static get boundingBox(): TransformBox {
		if (!BitmapEditable._boundingBox) {
			throw new Error('BoundingBox is null');
		}
		return BitmapEditable._boundingBox;
	}

	static set boundingBox(box: TransformBox | null) {
		if (BitmapEditable._boundingBox) {
			BitmapEditable.parent.removeChild(BitmapEditable._boundingBox);
		}

		BitmapEditable._boundingBox = box;
		if (box) BitmapEditable.parent.addChild(box);
	}

	static displayBoundingBox(bitmap: createjs.Bitmap) {
		let transformBox = new TransformBox(bitmap);
		BitmapEditable.boundingBox = transformBox;
		BitmapEditable.parent.addChild(transformBox);
	}
}
