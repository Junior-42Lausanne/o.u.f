import type ListObjectThumbnail from './ListObjectThumbnail';
import ObjectPreview from './ObjectPreview';
import TexturePreview from './TexturePreview';
const createjs = window.createjs;

export default class ObjectThumbnail extends createjs.Bitmap {
	static _currentSelected: ObjectThumbnail;
	static _container: ListObjectThumbnail;
	static _objectPreview: ObjectPreview | TexturePreview | null;
	static _hasMoved: boolean;
	static indicator: createjs.Shape;
	static mode: string;

	title: { [key: string]: string };
	description: { [key: string]: string };
	metricTags: string[];
	srcBase: string;
	index: number;
	listObjectThumbnail: ListObjectThumbnail;

	constructor(
		imageOrUri: string | Object | HTMLImageElement | HTMLCanvasElement | HTMLVideoElement,
		item: {
			title: { [key: string]: string };
			description: { [key: string]: string };
			index: number;
			srcBase: string;
			metricTags?: string[];
		},
		listObjectThumbnail: ListObjectThumbnail
	) {
		super(imageOrUri);
		const { title, description, index, srcBase, metricTags = [] } = item;
		let width = 0;
		let height = 0;
		if (
			imageOrUri instanceof HTMLImageElement ||
			imageOrUri instanceof HTMLCanvasElement ||
			imageOrUri instanceof HTMLVideoElement
		) {
			width = imageOrUri.width;
			height = imageOrUri.height;
		}

		// ATTACH INFOS OF OBJECT
		this.title = title;
		this.description = description;
		this.metricTags = metricTags;
		this.srcBase = srcBase;
		this.index = index;
		this.listObjectThumbnail = listObjectThumbnail;

		// HIT AREA
		let hit = new createjs.Shape();
		hit.graphics.beginFill('black').drawRect(0, 0, width, height);
		this.hitArea = hit;

		// EVENTS
		this.on('pressup', this.onPressup);
	}

	/* INSTANCE METHODS */

	// @ts-ignore
	onPressup(e) {
		if (!ObjectThumbnail.hasMoved) {
			ObjectThumbnail.currentSelected = this;
			// this.listObjectThumbnail.saveState(this.index);

			if (ObjectThumbnail.mode !== 'textures') {
				ObjectThumbnail.objectPreview = new ObjectPreview(
					this.srcBase,
					this.title,
					this.description,
					this.metricTags
				);
			} else {
				ObjectThumbnail.objectPreview = new TexturePreview(this.srcBase);
			}
		}
	}

	/* STATIC METHODS */

	static get currentSelected() {
		return ObjectThumbnail._currentSelected;
	}

	static set currentSelected(selected) {
		if (ObjectThumbnail._currentSelected !== selected) {
			ObjectThumbnail._currentSelected = selected;
			ObjectThumbnail.indicator.x = selected.x;
		}
	}

	static get container() {
		return ObjectThumbnail._container;
	}

	static set container(container) {
		ObjectThumbnail._container = container;
	}

	static get objectPreview() {
		return ObjectThumbnail._objectPreview;
	}

	static set objectPreview(objectPreview) {
		if (ObjectThumbnail._objectPreview) {
			let _objectPreview = ObjectThumbnail._objectPreview;
			let parent = _objectPreview.parent;
			if (parent) {
				parent.removeChild(_objectPreview);
				parent.addChild(objectPreview!);
			}
		}
		ObjectThumbnail._objectPreview = objectPreview;
	}

	static get hasMoved() {
		return ObjectThumbnail._hasMoved;
	}

	static set hasMoved(value) {
		ObjectThumbnail._hasMoved = value;
	}
}
