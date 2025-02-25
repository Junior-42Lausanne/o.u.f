import ObjectThumbnail from './ObjectThumbnail';
import ObjectPreview from './ObjectPreview';
import TexturePreview from './TexturePreview';
import { METRIC_TAG_COLORS } from '../../config';

let createjs = window.createjs;

export default class ListObjectThumbnail extends createjs.Container {
	static state = {};

	constructor(manifest, path, categoryIndex) {
		super();
		this.padding = 16;
		this.categoryIndex = categoryIndex;
		this.hasMoved = false;
		this.regY = 110;
		this.y = 600 - this.padding;
		this.x = this.previousX || this.padding;

		ObjectThumbnail.container = this;

		this.on('mousedown', this.onMousedown);
		this.on('pressmove', this.onPressmove);
		this.on('pressup', this.onPressup);

		let background = new createjs.Shape();
		background.graphics.beginFill('rgba(255,255,255,0.6)').drawRoundRect(0, 0, 0, 110, 8);
		ListObjectThumbnail._background = background;
		this.addChild(background);

		this.init(manifest, path);

		ListObjectThumbnail.currentListObjectThumbnail = this;
	}

	init(manifest, path) {
		let preload = new createjs.LoadQueue('true', '/img/');

		const imageExtensions = path === 'objects' ? 'png' : 'jpg';

		let manifestIcons = manifest.map((elt) => ({
			...elt,
			src: `${elt.src}_icon.png`
		}));
		let manifestImages = manifest.map((elt) => ({
			...elt,
			src: `${elt.src}.${imageExtensions}`
		}));

		const errors = [];

		preload.loadManifest(manifestIcons);
		preload.on('fileload', (e) => {
			this.onFileload(e);
		});
		preload.on('error', (e) => {
			errors.push(e.data.filename);
		});
		preload.on('complete', () => {
			let preloadBigImages = new createjs.LoadQueue('true', '/img/');
			preloadBigImages.loadManifest(manifestImages);
			preloadBigImages.on('error', (e) => {
				console.log(errors);
			});
			preloadBigImages.on('complete', (e) => {
				console.log('preloadBigImages completed');
			});
		});
	}

	onMousedown(e) {
		ObjectThumbnail.hasMoved = false;
		this.mouseDifferenceToOrigin = {
			x: e.stageX - this.x
		};
	}

	onPressmove(e) {
		if (Math.abs(e.stageX - this.mouseDifferenceToOrigin.x) > 30) {
			ObjectThumbnail.hasMoved = true;
		}
		this.x = e.stageX - this.mouseDifferenceToOrigin.x;
	}

	onPressup(e) {
		if (ObjectThumbnail.hasMoved || Math.abs(e.stageX - this.mouseDifferenceToOrigin.x) > 0) {
			const x = this.x;

			if (x > this.padding) {
				createjs.Tween.get(this).to({ x: this.padding }, 300, createjs.Ease.circOut);
			} else {
				const width = this.getBounds().width;
				const max = -width + 800 - this.padding;

				if (width > 800 - this.padding * 2) {
					if (x < max) {
						createjs.Tween.get(this).to({ x: max }, 300, createjs.Ease.circOut);
					}
				} else {
					createjs.Tween.get(this).to({ x: this.padding }, 300, createjs.Ease.circOut);
				}
			}
		}

		const descriptionDiv = document.getElementById('descriptionOfObject');
		if (descriptionDiv) {
			descriptionDiv.scrollTop = 0;
		}
	}

	onFileload(e) {
		let background = ListObjectThumbnail._background;

		let item = e.item;
		item.index = e.target._numItemsLoaded - 1;

		if (!item.srcBase) {
			item.id = item.id.substr(0, item.id.length - 9);
			item.srcBase = item.path + item.id;
		}

		let bitmap = new ObjectThumbnail(e.result, item, this);

		bitmap.x = background.graphics.command.w + 10;
		bitmap.y = 10;

		background.graphics.command.w += 100;
		this.addChild(bitmap);

		if (item.index === (this.previousSelectedItemIndex || 0)) {
			ObjectThumbnail.objectPreview = null;

			let shape = new createjs.Shape();
			shape.graphics.beginFill('#292929').drawRoundRectComplex(15, 105, 50, 5, 4, 4, 0, 0);
			this.addChild(shape);

			ObjectThumbnail.mode = item.mode;

			if (item.mode === 'objects') {
				const objectPreview = new ObjectPreview(
					item.srcBase,
					item.title,
					item.description,
					item.metricTags
				);
				this.parent.addChild(objectPreview);
				ObjectThumbnail.objectPreview = objectPreview;
			}

			if (item.mode === 'textures') {
				const texturePreview = new TexturePreview(item.srcBase);
				this.parent.addChild(texturePreview);
				ObjectThumbnail.objectPreview = texturePreview;
			}

			ObjectThumbnail.indicator = shape;
			ObjectThumbnail.currentSelected = bitmap;
		}

		const metricTags = item.metricTags || [];
		for (let i = 0; i < metricTags.length; i++) {
			const metricIndicatorWidth = 5;
			const metricIndicatorX =
				bitmap.x + 40 - (metricTags.length * metricIndicatorWidth) / 2 + i * metricIndicatorWidth;
			const metricTagIndicator = new createjs.Shape();
			metricTagIndicator.graphics
				.beginFill(METRIC_TAG_COLORS[metricTags[i]])
				.drawRoundRectComplex(metricIndicatorX, 105, metricIndicatorWidth, 5, 3, 3, 0, 0);
			this.addChild(metricTagIndicator);
		}
	}

	saveState(itemIndex) {
		ListObjectThumbnail.state[this.categoryIndex] = {
			x: this.x,
			itemIndex
		};
	}

	static resetState() {
		ListObjectThumbnail.state = {};
	}

	get previousX() {
		return (ListObjectThumbnail.state[this.categoryIndex] || {}).x;
	}

	get previousSelectedItemIndex() {
		return (ListObjectThumbnail.state[this.categoryIndex] || {}).itemIndex;
	}

	static set currentListObjectThumbnail(list) {
		ListObjectThumbnail._currentListObjectThumbnail = list;
	}

	static get currentListObjectThumbnail() {
		return ListObjectThumbnail._currentListObjectThumbnail;
	}
}
