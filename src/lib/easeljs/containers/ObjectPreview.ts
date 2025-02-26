import MainStage from '../stages/MainStage';

import ToolsStage from '../stages/ToolsStage';
import BitmapEditable from '../containers/BitmapEditable';

const marginTop = 85;

export default class ObjectPreview extends createjs.Container {
	filename: string;

	constructor(
		imagePath: string,
		title: { [lang: string]: string },
		description: { [lang: string]: string },
		metricTags: string[] = []
	) {
		super();

		// store.dispatch(
		// 	setObjectActive({
		// 		title,
		// 		description,
		// 		metricTags
		// 	})
		// );

		this.x = 0;
		this.y = marginTop;
		this.filename = imagePath;

		let previewImage = new Image();
		previewImage.src = `${imagePath}.png`;

		previewImage.onload = (e: any) => {
			let bitmap = new createjs.Bitmap(previewImage);
			const { width, height } = previewImage;
			const maxWidthAndHeight = ObjectPreview.maxWidthAndHeight;

			// RESIZE IMAGE IF TOO BIG
			let scale = 1;

			if (height * scale > maxWidthAndHeight) {
				scale = maxWidthAndHeight / height;
			}

			if (width * scale > maxWidthAndHeight) {
				scale = maxWidthAndHeight / width;
			}

			bitmap.scaleY = scale;
			bitmap.scaleX = scale;

			bitmap.regY = height / 2;
			bitmap.regX = width / 2;
			bitmap.y = 354 / 2;
			bitmap.x = 400;

			const language = 'en'; // TODO: Replace with current language

			if (title[language] || description[language] || metricTags.length) {
				bitmap.x = 65 + 354 / 2;
			}

			this.addChild(bitmap);

			let toolStage = ToolsStage.currentStage!;

			bitmap.on('pressmove', (e: any) => {
				// @ts-ignore
				bitmap.x = e.stageX - bitmap.mouseDifferenceToOrigin.x;
				// @ts-ignore
				bitmap.y = e.stageY - bitmap.mouseDifferenceToOrigin.y;
			});

			bitmap.on('mousedown', (e) => {
				// store.dispatch(
				// 	setObjectActive({
				// 		title: '',
				// 		description: '',
				// 		metricTags: []
				// 	})
				// );

				// @ts-ignore
				bitmap.mouseDifferenceToOrigin = {
					// @ts-ignore
					x: e.stageX - bitmap.x,
					// @ts-ignore
					y: e.stageY - bitmap.y
				};

				const oldScaleX = bitmap.scaleX;
				const oldScaleY = bitmap.scaleY;

				createjs.Tween.get(bitmap).to({ scaleX: oldScaleX * 0.8, scaleY: oldScaleY * 0.8 }, 200);

				toolStage.removeChild(toolStage.listObjectThumbnail!, toolStage.backgroundContainer!);
			});

			bitmap.on('pressup', (e) => {
				let bitmapEditable = new BitmapEditable((bitmap.image as HTMLImageElement).src);
				bitmapEditable.x = bitmap.x - MainStage.currentStage!.x + MainStage.currentStage!.regX;
				bitmapEditable.y = bitmap.y + marginTop;
				bitmapEditable.scaleX = bitmap.scaleX;
				bitmapEditable.scaleY = bitmap.scaleY;
				bitmapEditable.regX = bitmap.regX;
				bitmapEditable.regY = bitmap.regY;
				bitmapEditable.filename = this.filename.substring(this.filename.lastIndexOf('/') + 1);

				var image = new Image();
				image.src = (bitmap.image as HTMLImageElement).src;
				image.onload = (e) => {
					BitmapEditable.displayBoundingBox(bitmapEditable);
				};

				MainStage.currentStage!.saveSerializedStage();
				// @ts-ignore
				toolStage!.closeToolStage();
			});
		};
	}

	static get maxWidthAndHeight() {
		return 354;
	}
}
