import BitmapEditable from '../containers/BitmapEditable';
import ListObjectThumbnail from '../containers/ListObjectThumbnail';
import TextureEditable from '../containers/TextureEditable';

export default class MainStage extends createjs.Stage {
	serialized: any;
	containerTextures: createjs.Container | undefined;
	containerObjects: createjs.Container | undefined;
	totalWidth: number = 0;
	static _currentStage: MainStage | null;

	constructor(
		canvasId: string | Object | HTMLCanvasElement,
		backgroundDataURI: string,
		serialized: any
	) {
		super(canvasId);

		this.serialized = serialized;

		createjs.Ticker.framerate = 60;
		createjs.Ticker.on('tick', (e) => {
			this.update(e);
		});

		this.on('stagemouseup', function (event) {
			// @ts-ignore
			if (!event.relatedTarget) {
				BitmapEditable.boundingBox = null;
				TextureEditable.boundingBox = null;
			}
		});

		createjs.Touch.enable(this);

		const backgroundImage = new Image();
		backgroundImage.src = backgroundDataURI;
		backgroundImage.onload = () => {
			let bitmap = new createjs.Bitmap(backgroundImage);
			const width = backgroundImage.width;
			this.regX = width / 2;
			this.totalWidth = width;
			this.changePositionX(400);
			// store.dispatch(setMixTotalWidth(width));
			this.addChild(bitmap);
			this.init();
			MainStage.currentStage = this;
			ListObjectThumbnail.resetState();
		};
	}

	init() {
		this.containerTextures = new createjs.Container();
		this.containerObjects = new createjs.Container();

		this.addChild(this.containerTextures);
		this.addChild(this.containerObjects);

		BitmapEditable.parent = this.containerObjects;
		TextureEditable.parent = this.containerTextures;

		if (this.serialized) {
			this.drawSerializedStage(this.serialized);
		}
	}

	changePositionX(value: number) {
		this.x = value;
		this.update();
		// store.dispatch(setMixPositionX(value));
	}

	toDataURL() {
		BitmapEditable.boundingBox = null;
		TextureEditable.boundingBox = null;
		this.update();
		return (this.canvas as HTMLCanvasElement).toDataURL('image/jpeg', 0.8);
	}

	serializeStage() {
		const objectsChildren = this.containerObjects!.children;
		const texturesChildren = this.containerTextures!.children;

		const textures = texturesChildren
			// @ts-ignore
			.filter((obj): obj is TextureEditable => obj.type === 'TextureEditable')
			.map((obj) => ({
				filename: obj.image!.src.substring(
					obj.image!.src.lastIndexOf('/') + 1,
					obj.image!.src.lastIndexOf('.png')
				),
				// @ts-ignore
				instructions: obj.customMask.graphics._activeInstructions,
				position: {
					x: obj.customMask.x,
					y: obj.customMask.y
				}
			}));

		const objects = objectsChildren
			// @ts-ignore
			.filter((obj): obj is BitmapEditable => obj.type === 'BitmapEditable')
			.map((obj) => ({
				filename: obj.filename,
				position: {
					x: obj.x,
					y: obj.y
				},
				scale: {
					x: obj.scaleX,
					y: obj.scaleY
				}
			}));

		return {
			objects,
			textures,
			positionX: parseInt(this.x.toString(), 10)
		};
	}

	saveSerializedStage() {
		// store.dispatch(setMixSerialized(this.serializeStage()));
	}

	drawSerializedStage(data: { textures: any[]; objects: any[]; positionX: number }) {
		if (data.textures) {
			data.textures.map((txtr) => {
				let texture = new TextureEditable(
					'/img/textures/' + txtr.filename + '.png',
					txtr.instructions
				);
				texture.crossOrigin = 'anonymous';
				texture.customMask.x = txtr.position.x;
				texture.customMask.y = txtr.position.y;
				return txtr;
			});
		}
		if (data.objects) {
			data.objects.map((obj) => {
				let bitmap = new BitmapEditable('/img/objects/' + obj.filename + '.png');
				// @ts-ignore
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
	}

	static set currentStage(stage) {
		MainStage._currentStage = stage;
	}

	static get currentStage() {
		return MainStage._currentStage;
	}
}
