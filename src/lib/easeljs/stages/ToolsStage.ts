import ListObjectThumbnail from '../containers/ListObjectThumbnail';
import BitmapEditable from '../containers/BitmapEditable';
import TextureEditable from '../containers/TextureEditable';
const createjs = window.createjs;

export default class ToolsStage extends createjs.Stage {
	private _listObjectThumbnail: ListObjectThumbnail | undefined;
	private _backgroundContainer: createjs.Container | undefined;
	private canvasId: string;
	static _currentStage: ToolsStage | null;

	constructor(canvasId: string, categoryIndex: string | number) {
		super(canvasId);
		this.canvasId = canvasId;
		createjs.Touch.enable(this);
		createjs.Ticker.on('tick', (e) => {
			this.update(e);
		});

		BitmapEditable.boundingBox = null;
		TextureEditable.boundingBox = null;

		let rectangle = new createjs.Shape();
		rectangle.graphics.beginFill('black').drawRect(0, 0, 800, 600);

		let backgroundContainer = new createjs.Container();
		backgroundContainer.addChild(rectangle);

		this.addChild(backgroundContainer);

		let background_img = new Image();
		// @ts-ignore
		background_img.src = document.getElementById('mainStage')!.toDataURL();
		background_img.onload = () => {
			let background = new createjs.Bitmap(background_img);
			let blurFilter = new createjs.BlurFilter(30, 30, 2);
			let bounds = blurFilter.getBounds();
			background.filters = [blurFilter];
			background.cache(bounds.x, bounds.y, 800 + bounds.width, 600 + bounds.height);
			backgroundContainer.addChild(background);

			// let data = store.getState().library.data;

			// const path = data[categoryIndex].type === 'objects' ? 'objects' : 'textures';

			// const manifest = data[categoryIndex].collection.map((elt) => {
			// 	elt.src = path + '/' + elt.filename;
			// 	elt.mode = path;
			// 	return elt;
			// });

			let listObjectThumbnail = new ListObjectThumbnail([], 'objects', categoryIndex);
			this.addChild(listObjectThumbnail);
			this.init();

			this.listObjectThumbnail = listObjectThumbnail;

			this.backgroundContainer = backgroundContainer;
			ToolsStage.currentStage = this;
		};
	}

	init() {
		document.getElementById(this.canvasId)!.style.display = 'block';
		document.getElementById(this.canvasId)!.style.animation = 'showTools 0.5s 1';
	}

	set listObjectThumbnail(list) {
		this._listObjectThumbnail = list;
	}

	get listObjectThumbnail() {
		return this._listObjectThumbnail;
	}

	set backgroundContainer(backgroundContainer) {
		this._backgroundContainer = backgroundContainer;
	}

	get backgroundContainer() {
		return this._backgroundContainer;
	}

	static set currentStage(stage) {
		ToolsStage._currentStage = stage;
	}

	static get currentStage() {
		return ToolsStage._currentStage;
	}
}
