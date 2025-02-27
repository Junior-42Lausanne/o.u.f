import BitmapView from '../containers/BitmapView';
import TextureView from '../containers/TextureView';
const createjs = window.createjs;

export default class GalleryStage extends createjs.Stage {
	serialized: any;
	containerTextures: createjs.Container | undefined;
	containerObjects: createjs.Container | undefined;
	totalWidth: number = 0;
	static _currentStage: GalleryStage | null;

	constructor(
		canvasId: string | Object | HTMLCanvasElement,
		backgroundDataURI: any,
		serialized: any,
		callback: any
	) {
		super(canvasId);
		if (GalleryStage._currentStage) {
			GalleryStage._currentStage.removeAllChildren();
			GalleryStage._currentStage.removeAllEventListeners();
			// @ts-ignore
			GalleryStage._currentStage.canvas = null;
			GalleryStage._currentStage.enableDOMEvents(false);
			GalleryStage._currentStage = null;
		}

		this.serialized = serialized;

		createjs.Ticker.on('tick', (e) => {
			this.update(e);
		});

		createjs.Touch.enable(this);

		// 	getImageDataUrlFromUrl(backgroundDataURI).then((data) => {
		// 		const { dataURL, width } = data;
		// 		this.regX = width / 2;
		// 		this.totalWidth = width;
		// 		store.dispatch(setMixTotalWidth(width));

		// 		const image = new Image();
		// 		image.crossOrigin = 'anonymous';
		// 		image.src = dataURL;
		// 		image.onload = () => {
		// 			let bitmap = new createjs.Bitmap(image);
		// 			this.addChild(bitmap);

		// 			this.containerTextures = new createjs.Container();
		// 			this.containerObjects = new createjs.Container();
		// 			this.addChild(this.containerTextures);
		// 			this.addChild(this.containerObjects);

		// 			TextureView.parent = this.containerTextures;
		// 			BitmapView.parent = this.containerObjects;

		// 			let background = new createjs.Shape();
		// 			background.graphics.beginFill('rgba(255,255,255,0.8)').drawRect(0, 0, width, 600);
		// 			background.visible = false;
		// 			BitmapView.background = background;

		// 			this.containerObjects.addChild(background);
		// 			this.init(callback);
		// 			GalleryStage.currentStage = this;
		// 		};
		// 	});
	}

	init(callback: () => void) {
		if (this.serialized) {
			this.drawSerializedStage(this.serialized, callback);
		} else if (callback) {
			callback();
		}
	}

	changePositionX(value: number) {
		this.x = value;
		this.update();
		// store.dispatch(setMixPositionX(value));
	}

	drawSerializedStage(
		data: { textures: any[]; objects: any[]; positionX: number },
		callback: { (): void; (): void }
	) {
		if (data.textures) {
			data.textures.map((txtr) => {
				let texture = new TextureView('/img/textures/' + txtr.filename + '.png', txtr.instructions);
				texture.crossOrigin = 'anonymous';
				texture.customMask.x = txtr.position.x;
				texture.customMask.y = txtr.position.y;
				return txtr;
			});
		}

		if (data.objects) {
			data.objects.map((obj) => {
				let bitmap = new BitmapView('/img/objects/' + obj.filename + '.png');
				bitmap.crossOrigin = 'anonymous';
				bitmap.filename = obj.filename;
				bitmap.x = obj.position.x;
				bitmap.y = obj.position.y;
				bitmap.scaleX = obj.scale.x;
				bitmap.scaleY = obj.scale.y;
				return obj;
			});
		}

		if (data.positionX) {
			this.changePositionX(data.positionX);
		}

		if (callback) {
			callback();
		}
	}

	getDataUrl() {
		this.cache(0, 0, this.totalWidth, 600);
		return this.getCacheDataURL();
	}

	static resetChildIndex(childIndex: number) {
		let containerObjects = BitmapView.parent;
		containerObjects.setChildIndex(
			containerObjects.getChildAt(containerObjects.getNumChildren() - 1),
			childIndex - 1
		);
	}

	static set currentStage(stage) {
		GalleryStage._currentStage = stage;
	}

	static get currentStage() {
		return GalleryStage._currentStage;
	}
}
