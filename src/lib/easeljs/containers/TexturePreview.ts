import ToolsStage from '../stages/ToolsStage';
import MainStage from '../stages/MainStage';
import TextureEditable from './TextureEditable';

export default class TexturePreview extends createjs.Container {
	constructor(imagePath: string) {
		super();

		this.x = 0;
		this.y = 0;

		let previewImage = new Image();
		previewImage.src = `${imagePath}.png`;
		previewImage.crossOrigin = 'Anonymous';

		previewImage.onload = (e) => {
			let bitmap = new createjs.Bitmap(previewImage);

			bitmap.y = 300;
			bitmap.x = 400;

			bitmap.regY = 300;
			bitmap.regX = 400;

			let mask = new createjs.Shape();
			mask.graphics.beginFill('#000').drawCircle(400, 250, 135);

			this.addChild(bitmap);
			bitmap.mask = mask;

			let toolStage = ToolsStage.currentStage;

			// @ts-ignore
			bitmap.on('mousedown', (e) => {
				toolStage!.removeAllChildren();

				// @ts-ignore
				let texture = new TextureEditable(e.target.image.src);
				let poly = texture.customMask;

				toolStage!.addChild(poly);

				const HANDLES_SIZE = 8;
				const HANDLES_HIT = 18;
				const HANDLES_STROKE_COLOR = 'white';
				const HANDLES_FILL_COLORS = '#838383';

				let handle_idx = 0;

				let hit = new createjs.Shape();
				hit.graphics.beginFill('#000').drawCircle(0, 0, HANDLES_HIT);

				let handleModel = new createjs.Shape();
				handleModel.graphics
					.setStrokeStyle(1)
					.beginStroke(HANDLES_STROKE_COLOR)
					.beginFill(HANDLES_FILL_COLORS)
					.drawCircle(0, 0, HANDLES_SIZE);
				handleModel.hitArea = hit;

				// @ts-ignore
				toolStage.on('stagemousedown', (e: any) => {
					if (e.relatedTarget) {
						return null;
					}

					let handle = handleModel.clone();
					handle.x = e.stageX;
					handle.y = e.stageY;
					// @ts-ignore
					handle.idx = handle_idx++;

					const xOffset = -MainStage.currentStage!.x + MainStage.currentStage!.regX;

					handle.on('pressmove', (e: any) => {
						handle.x = e.stageX;
						handle.y = e.stageY;

						// @ts-ignore
						const instructionLength = texture.customMask.graphics._activeInstructions.length;
						// @ts-ignore
						texture.customMask.graphics._activeInstructions[handle.idx].x = e.stageX + xOffset;
						// @ts-ignore
						texture.customMask.graphics._activeInstructions[handle.idx].y = e.stageY;

						// @ts-ignore
						if (handle.idx === 0) {
							// @ts-ignore
							texture.customMask.graphics._activeInstructions[instructionLength - 1].x =
								e.stageX + xOffset;
							// @ts-ignore
							texture.customMask.graphics._activeInstructions[instructionLength - 1].y = e.stageY;
						}
					});

					toolStage!.addChild(handle);
					texture.drawTexture(e);
				});
			});
		};
	}
}
