import GalleryStage from '../stages/GalleryStage';

export default class BitmapView extends createjs.Bitmap {
	static parent: createjs.Container;
	static background: createjs.Shape = new createjs.Shape();
	static oldObject: createjs.Bitmap | null = null;
	static oldObjectIndex: number | null = null;

	filename: string = '';
	crossOrigin: string = '';

	constructor(imageOrUri: string | Object) {
		super(imageOrUri);
		this.on('mousedown', this.onMousedown);
		BitmapView.parent.addChild(this);
	}

	/* INSTANCE METHODS */

	// @ts-ignore
	onMousedown(e) {
		let stage = BitmapView.parent;
		stage.setChildIndex(BitmapView.background, 0);

		if (BitmapView.oldObject && BitmapView.oldObjectIndex) {
			stage.setChildIndex(BitmapView.oldObject, BitmapView.oldObjectIndex);
		}

		BitmapView.oldObject = this;
		BitmapView.oldObjectIndex = BitmapView.parent.getChildIndex(this);

		const childIndex = BitmapView.parent.getChildIndex(this);

		stage.setChildIndex(this, stage.getNumChildren() - 1);
		stage.setChildIndex(BitmapView.background, stage.getNumChildren() - 2);
		BitmapView.background.visible = true;

		const filename = e.target.filename;
		let dataUniqueSrc: any[] = [];

		// let data = store.getState().library.data;
		// data.map((elt) => {
		// 	dataUniqueSrc.push(...elt.collection);
		// 	return elt;
		// });

		dataUniqueSrc = dataUniqueSrc.filter(BitmapView.onlyUniqueSrc);

		let found = dataUniqueSrc.find(function (element) {
			return element.filename === filename;
		});

		// GalleryStage.currentStage!.onObjectClick();

		// store.dispatch(
		// 	setObjectActive({
		// 		title: found.title,
		// 		description: found.description,
		// 		childIndex,
		// 		metricTags: found.metricTags
		// 	})
		// );
	}

	draw(ctx: CanvasRenderingContext2D, ignoreCache?: boolean) {
		super.draw(ctx, ignoreCache);
		this.regX = this.image.width / 2;
		this.regY = this.image.height / 2;
		return true;
	}

	static onlyUniqueSrc(value: { filename: any }, index: any, self: any[]) {
		return index === self.findIndex((t) => t.filename === value.filename);
	}
}
