import MainStage from '../stages/MainStage';
import BitmapEditable from './BitmapEditable';
import type TextureEditable from './TextureEditable';
const createjs = window.createjs;

export default class TransformBox extends createjs.Container {
	object: BitmapEditable | TextureEditable;
	box: createjs.Shape | undefined;
	handles:
		| {
				topLeft: createjs.Shape;
				topRight: createjs.Shape;
				bottomRight: createjs.Shape;
				bottomLeft: createjs.Shape;
		  }
		| undefined;

	constructor(object: BitmapEditable | TextureEditable) {
		super();
		this.object = object;
		this.makeBoxAndHandles();
	}

	makeBoxAndHandles() {
		const HANDLES_SIZE = 8;
		const HANDLES_HIT = 18;
		const HANDLES_STROKE_COLOR = 'white';
		const HANDLES_FILL_COLORS = ['#569DD3', '#4A86CD'];
		const BOX_STROKE_COLOR = '#2470C8';

		let hit = new createjs.Shape();
		hit.graphics.beginFill('#000').drawCircle(0, 0, HANDLES_HIT);

		let handleModel = new createjs.Shape();
		handleModel.graphics
			.setStrokeStyle(1)
			.beginStroke(HANDLES_STROKE_COLOR)
			.beginLinearGradientFill(HANDLES_FILL_COLORS, [0, 1], 0, 0, HANDLES_SIZE, HANDLES_SIZE)
			.drawCircle(0, 0, HANDLES_SIZE);
		handleModel.hitArea = hit;

		let object = this.object;

		if (object instanceof BitmapEditable) {
			const { image } = object;

			const width = image!.width * object.scaleX;
			const height = image!.height * object.scaleY;
			const x = object.x - width / 2;
			const y = object.y - height / 2;

			// CREATE BOX

			let rect = new createjs.Shape();
			rect.graphics.setStrokeStyle(1).beginStroke(BOX_STROKE_COLOR).drawRect(0, 0, width, height);
			rect.x = x;
			rect.y = y;
			this.addChild(rect);

			let topLeft = handleModel.clone();
			topLeft.x = x;
			topLeft.y = y;
			topLeft.on('pressmove', (e) => {
				this.onPressmoveHorizontalAndVerticalHandles(e);
			});
			topLeft.on('pressup', (e) => {
				this.onPressup(e);
			});
			this.addChild(topLeft);

			let topRight = handleModel.clone();
			topRight.x = x + width;
			topRight.y = y;
			topRight.on('pressmove', (e) => {
				this.onPressmoveHorizontalAndVerticalHandles(e);
			});
			topRight.on('pressup', (e) => {
				this.onPressup(e);
			});
			this.addChild(topRight);

			let bottomRight = handleModel.clone();
			bottomRight.x = x + width;
			bottomRight.y = y + height;
			bottomRight.on('pressmove', (e) => {
				this.onPressmoveHorizontalAndVerticalHandles(e);
			});
			bottomRight.on('pressup', (e) => {
				this.onPressup(e);
			});
			this.addChild(bottomRight);

			let bottomLeft = handleModel.clone();
			bottomLeft.x = x;
			bottomLeft.y = y + height;
			bottomLeft.on('pressmove', (e) => {
				this.onPressmoveHorizontalAndVerticalHandles(e);
			});
			bottomLeft.on('pressup', (e) => {
				this.onPressup(e);
			});
			this.addChild(bottomLeft);

			this.handles = {
				topLeft,
				topRight,
				bottomRight,
				bottomLeft
			};

			this.box = rect;
		} else if (object.type === 'TextureEditable') {
			let xOffset = -MainStage.currentStage!.x + MainStage.currentStage!.regX;
			let customMask = object.customMask;
			this.addChild(customMask);

			// @ts-ignore
			const instructionLength = customMask.graphics._activeInstructions.length;
			// @ts-ignore
			customMask.graphics._activeInstructions.map((elt, idx) => {
				if (idx === 0) {
					return elt;
				}

				let handle = handleModel.clone();
				handle.x = elt.x + customMask.x;
				handle.y = elt.y + customMask.y;
				// @ts-ignore
				handle.idx = idx;

				handle.on('mousedown', (e) => {
					xOffset = -MainStage.currentStage!.x + MainStage.currentStage!.regX;
				});

				handle.on('pressmove', (e: any) => {
					handle.x = e.stageX + xOffset;
					handle.y = e.stageY;
					// @ts-ignore
					if (handle.idx === instructionLength - 1) {
						// @ts-ignore
						customMask.graphics._activeInstructions[0].x = e.stageX - customMask.x + xOffset;
						// @ts-ignore
						customMask.graphics._activeInstructions[0].y = e.stageY - customMask.y;
					}
					// @ts-ignore
					customMask.graphics._activeInstructions[idx].x = e.stageX - customMask.x + xOffset;
					// @ts-ignore
					customMask.graphics._activeInstructions[idx].y = e.stageY - customMask.y;
				});

				this.addChild(handle);
				return elt;
			});
		}
	}

	onPressup(e: any) {
		MainStage.currentStage!.saveSerializedStage();
	}

	onPressmoveHorizontalAndVerticalHandles(e: any) {
		const xOffset = -MainStage.currentStage!.x + MainStage.currentStage!.regX;

		let object = this.object;
		let target = e.target;
		let handles = this.handles!;

		target.x = e.stageX + xOffset;
		target.y = e.stageY;

		switch (target) {
			case handles.topLeft:
				handles.topRight.y = handles.topLeft.y;
				handles.bottomLeft.x = handles.topLeft.x;
				break;
			case handles.topRight:
				handles.topLeft.y = handles.topRight.y;
				handles.bottomRight.x = handles.topRight.x;
				break;
			case handles.bottomRight:
				handles.bottomLeft.y = handles.bottomRight.y;
				handles.topRight.x = handles.bottomRight.x;
				break;
			case handles.bottomLeft:
				handles.bottomRight.y = handles.bottomLeft.y;
				handles.topLeft.x = handles.bottomLeft.x;
				break;
			default:
				return;
		}

		const distanceX = handles.topRight.x - handles.topLeft.x;
		const distanceY = handles.bottomRight.y - handles.topLeft.y;

		const scaleX = distanceX / object.image!.width;
		const scaleY = distanceY / object.image!.height;

		object.scaleX = scaleX;
		object.scaleY = scaleY;

		object.x = distanceX / 2 + handles.topLeft.x;
		object.y = distanceY / 2 + handles.topLeft.y;

		// @ts-ignore
		this.box!.graphics.command.w = distanceX;
		// @ts-ignore
		this.box!.graphics.command.h = distanceY;

		this.box!.x = handles.topLeft.x;
		this.box!.y = handles.topLeft.y;
	}
}
