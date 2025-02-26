import GalleryStage from '../stages/GalleryStage';

export default class TextureView extends createjs.Container {
	static parent: createjs.Container;
	static background: createjs.Shape = new createjs.Shape();
	static oldObject: createjs.Bitmap | null = null;

	x: number;
	y: number;
	image: HTMLImageElement | undefined;
	customMask: createjs.Shape;
	crossOrigin: string = '';

	constructor(imageOrUri: string, instructions: any[]) {
		super();

		this.x = 0;
		this.y = 0;

		var image = new Image();
		image.src = imageOrUri;
		image.onload = () => {
			var shape = new createjs.Shape();
			shape.graphics.beginBitmapFill(image, 'repeat-x');
			shape.graphics.drawRect(0, 0, GalleryStage.currentStage!.totalWidth, 600);
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
			TextureView.parent.addChild(this);
			this.mask = this.customMask;
		}
	}
}
