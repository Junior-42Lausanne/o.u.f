/*
Path : /src/easeljs/containers

Copyright (C) 2019 | Unlimited Cities® | Alain Renk | <alain.renk@7-bu.org>

Developer: Nicoals Ancel <email@adress>
Supported by: https://7billion-urbanists.org/ and https://freeit.world

This file is part of Unlimited Cities® software.

Unlimited Cities® is free software: you can redistribute it and/or modify
it under the terms of the GNU Affero General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Unlimited Cities® is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU Affero General Public License for more details.

You should have received a copy of the GNU Affero General Public License
along with Unlimited Cities®. If not, see <http://www.gnu.org/licenses/>.
*/

import MainStage from "../stages/MainStage";
import TransformBox from "./TransformBox";
import BitmapEditable from "./BitmapEditable";

let createjs = window.createjs;
export default class TextureEditable extends createjs.Container {
  constructor(imageOrUri, instructions) {
    super();

    this.type = "TextureEditable";
    this.x = 0;
    this.y = 0;

    var image = new Image();
    image.src = imageOrUri;
    image.onload = () => {
      var shape = new createjs.Shape();
      shape.graphics.beginBitmapFill(image, "repeat-x");
      shape.graphics.drawRect(0, 0, MainStage.currentStage.totalWidth, 600);
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
      TextureEditable.parent.addChild(this);
      this.mask = this.customMask;
    }

    this.mask = this.customMask;
    this.on("mousedown", this.onMousedown);
    this.on("pressmove", this.onPressmove);
    this.on("pressup", this.onPressup);
  }

  /* INSTANCE METHODS */

  onMousedown(e) {
    this.mouseDifferenceToOrigin = {
      x: e.stageX - this.customMask.x,
      y: e.stageY - this.customMask.y,
    };

    let stage = TextureEditable.parent;
    stage.setChildIndex(this, stage.getNumChildren() - 1);
    TextureEditable.boundingBox = null;
    BitmapEditable.boundingBox = null;
  }

  onPressmove(e) {
    const positionX = e.rawX - this.mouseDifferenceToOrigin.x;
    const positionY = e.rawY - this.mouseDifferenceToOrigin.y;

    this.customMask.x = positionX;
    this.customMask.y = positionY;

    if (e.rawX < 5 || e.rawX > 795 || e.rawY < 5 || e.rawY > 595) {
      this.alpha = 0.3;
    } else {
      this.alpha = 1;
    }
  }

  onPressup(e) {
    if (e.rawX < 5 || e.rawX > 795 || e.rawY < 5 || e.rawY > 595) {
      this.parent.removeChild(this);
      MainStage.currentStage.saveSerializedStage();
    } else {
      MainStage.currentStage.saveSerializedStage();
      TextureEditable.displayBoundingBox(this);
    }
  }

  drawTexture(e) {
    e.stopPropagation();

    const instructionLength =
      this.customMask.graphics._activeInstructions.length;

    const xOffset = -MainStage.currentStage.x + MainStage.currentStage.regX;
    if (instructionLength > 1) {
      let closePoint = this.customMask.graphics._activeInstructions.pop();
      this.customMask.graphics.lineTo(e.stageX + xOffset, e.stageY);
      this.customMask.graphics._activeInstructions.push(closePoint);
    } else {
      this.customMask.graphics.moveTo(e.stageX + xOffset, e.stageY);
      this.customMask.graphics.lineTo(e.stageX + xOffset, e.stageY);

      TextureEditable.parent.addChild(this);
    }
  }

  draw(ctx, ignoreCache) {
    super.draw(ctx, ignoreCache);
  }

  /* STATIC METHODS */

  static get boundingBox() {
    return TextureEditable._boundingBox;
  }

  static set boundingBox(box) {
    if (TextureEditable._boundingBox) {
      BitmapEditable.parent.removeChild(TextureEditable._boundingBox);
    }

    TextureEditable._boundingBox = box;
    TextureEditable.parent.addChild(box);
  }

  static displayBoundingBox(object) {
    let transformBox = new TransformBox(object);
    TextureEditable.boundingBox = transformBox;
    BitmapEditable.parent.addChild(transformBox);
  }
}
