export default class DistanceTools {
    //a quick way to map dimensions to their specific [D]imensions [S]ize [K]eys
    static DSK = {
        x: "width",
        y: "height",
        z: "depth",
    };

    static DEGtoRAD = Math.pi / 180;

    /**
     * Work out all relevant x and y related information (x, y, width, height) (in scene units)
     *
     * @param {document} ObjectDoc 		the document of a placeable object
     *
     * @returns {object}					containing the x, y, width, height, and rotation information (if available, undefined otherwise)
     */
    static xyData(ObjectDoc) {
        let data = {};

        if (ObjectDoc.c?.length == 4) {
            //for walls
            data.x = (ObjectDoc.c[0] + ObjectDoc.c[2]) / 2;
            data.y = (ObjectDoc.c[1] + ObjectDoc.c[3]) / 2;
            data.width = 0;
            data.height = 0;
            //data.width = Math.abs(ObjectDoc.c[2] - ObjectDoc.c[0]);
            //data.height = Math.abs(ObjectDoc.c[3] - ObjectDoc.c[1]);
        } else {
            for (let key of ["x", "y", "width", "height", "rotation"]) {
                data[key] = ObjectDoc[key] ?? 0;
            }
        }

        let Scene = ObjectDoc.parent;

        let xyScale = 1 / Scene?.dimensions.distancePixels ?? 1;
        let sizeScale = (ObjectDoc.documentName == "Token" ? Scene?.dimensions.distance : xyScale) ?? 1; //tokens need a different size scale factor

        for (let key of ["x", "y"]) {
            data[key] = data[key] * xyScale;

            data[DistanceTools.DSK[key]] = data[DistanceTools.DSK[key]] * sizeScale;

            if (data[DistanceTools.DSK[key]]) {
                data[key] = data[key] + data[DistanceTools.DSK[key]] / 2;
            }
        }

        if (data.rotation) {
            data.width = Math.sqrt(
                (Math.cos(DistanceTools.DEGtoRAD * data.rotation) * data.width) ** 2 +
                    (Math.sin(DistanceTools.DEGtoRAD * data.rotation) * data.height) ** 2,
            );
            data.height = Math.sqrt(
                (Math.cos(DistanceTools.DEGtoRAD * data.rotation) * data.height) ** 2 +
                    (Math.sin(DistanceTools.DEGtoRAD * data.rotation) * data.width) ** 2,
            );
        }

        return data;
    }

    /**
     * Work out all relevant z related information (z, bottom, top, depth) (including for wall height and levels)
     *
     * @param {document} ObjectDoc 		the document of a placeable object
     *
     * @returns {object} 				containing the top, bottom, z, and depth information if available or undefined otherwise
     */
    static zData(ObjectDoc) {
        if (game.modules.get("wall-height")?.active) {
            let bottom;
            let top;

            if (game.modules.get("levels")?.active) {
                let range = CONFIG.Levels.helpers.getRangeForDocument(ObjectDoc);
                bottom = range.rangeBottom;
                top = range.rangeTop;
            }

            if (bottom == undefined && top == undefined && ObjectDoc.documentName == "Wall") {
                bottom = ObjectDoc.getFlag("wall-height", "bottom") ?? -Infinity;
                top = ObjectDoc.getFlag("wall-height", "top") ?? Infinity;
            }

            if (bottom != undefined || top != undefined) {
                bottom = bottom ?? -Infinity;
                top = top ?? Infinity;

                let z = (bottom + top) / 2;
                let depth = top - bottom;

                if (isNaN(z) || !isFinite(z)) {
                    //either top or bottom is undefined, set z to defined value
                    if (isFinite(bottom)) {
                        z = bottom;
                    } else {
                        if (isFinite(top)) {
                            z = top;
                        } else {
                            z = 0;
                        }
                    }
                }

                if (isNaN(depth)) {
                    //either top or bottom is undefined, assume infinite depth
                    depth = Infinity;
                }

                if (top < bottom) {
                    //why is this valid?
                    let buffer = top;
                    top = bottom;
                    bottom = top;
                }

                return { bottom, top, z, depth };
            }
        }

        if (ObjectDoc.elevation != undefined) {
            //simple default case
            return { z: ObjectDoc.elevation, bottom: ObjectDoc.elevation, top: ObjectDoc.elevation, depth: 0 };
        }

        return undefined;
    }

    /**
     * Determine all informations regarding x,y, and z of a document
     *
     * @param {document} ObjectDoc 		the document of a placeable object
     *
     * @returns {object}					containing the x, y, width, height, top, bottom, z, and depth information (if available, undefined otherwise)
     */
    static xyzData(ObjectDoc) {
        return { ...DistanceTools.xyData(ObjectDoc), ...DistanceTools.zData(ObjectDoc) };
    }

    /**
     * Make sure a document is used for other function
     *
     * @param {object} Object 			any type of object or document
     *
     * @returns {document}				returns a document (as used by most other functions in this file)
     */
    static documentof(Object) {
        if (Object.documentName) {
            //is a document, just return it
            return Object;
        }

        if (Object.document) {
            return Object.document;
        }

        if (Object.wall?.document) {
            return Object.wall.document;
        }

        //well, crap
        return undefined;
    }

    /**
     * Calculate the distance between two positions, including the z distance if both objects have a z position
     * normally uses the center points, can be set to calculate the distance of the closest points of both positions (assuming boxes)
     *
     * @param {document} position1 		position data of object 1
     * @param {document} position2 		position data of object 2
     * @param {Object} [settings]
     * @param {boolean} [settings.closestPoint=false] if the closest points of object1 and object2 to one another should be used
     *
     * @returns {number}					the distance between position1 and position2
     */
    static distance(position1, position2, settings = { closestPoint: false }) {
        let distance = [];

        for (let key of ["x", "y", "z"]) {
            distance.push(position1[key] - position2[key]);

            if (settings.closestPoint) {
                let reduction = (position1[DistanceTools.DSK[key]] + position2[DistanceTools.DSK[key]]) / 2;

                if (key == "z" && !isFinite(reduction)) {
                    //treat some special cases for the z level
                    if (position1[key] < position2[key]) {
                        reduction = (position1.top ?? 0) - position1.z + position2.z - (position2.bottom ?? 0);
                    }

                    if (position1[key] == position2[key]) {
                        reduction = 0;
                    }

                    if (position1[key] > position2[key]) {
                        reduction = position1.z - (position1.bottom ?? 0) + (position2.top ?? 0) - position2.z;
                    }
                }

                reduction = reduction ?? 0;

                distance[distance.length - 1] = Math.max(
                    Math.abs(distance[distance.length - 1]) - Math.max(reduction, 0),
                    0,
                );
            }
        }

        const calculatedDistance = Math.hypot(...distance.filter((value) => value));
        return calculatedDistance;
    }

    /**
     * Calculates the distance between two placeables objects
     *
     * @param {object} object1 			placeable object 1
     * @param {object} object2 			placeable object 2
     * @param {Object} [settings]
     * @param {boolean} [settings.closestPoint=false] if the closest points of object1 and object2 to one another should be used
     * @param {boolean} [settings.includez=true]      if the z coordinate should be included in the calculations
     *
     * @returns {number}					calculated distance
     */
    static distancebetween(object1, object2, settings = { closestPoint: false, includez: true }) {
        let document1 = DistanceTools.documentof(object1);
        let document2 = DistanceTools.documentof(object2);

        if (document1 && document2) {
            let position1 = settings.includez ? DistanceTools.xyzData(document1) : DistanceTools.xyData(document1);
            let position2 = settings.includez ? DistanceTools.xyzData(document2) : DistanceTools.xyData(document2);

            const calculatedDistance = DistanceTools.distance(position1, position2, settings);
            return calculatedDistance;
        }

        return undefined;
    }

    /**
     * Calculate if object1 and object2 are close enough to interact with one another
     *
     * @param {object} object1 			              placeable object 1
     * @param {object} object2 			              placeable object 2
     * @param {number} distance 			          interaction distance to be checked
     * @param {Object} [settings]
     * @param {boolean} [settings.closestPoint=false] if the closest points of object1 and object2 to one another should be used
     * @param {boolean} [settings.includez=true]      if the z coordinate should be included in the calculations
     *
     * @returns {boolean}				              if interaction is possible
     */
    static canInteract(object1, object2, distance, settings = { closestPoint: false, includez: true }) {
        const calculatedDistance = DistanceTools.distancebetween(object1, object2, settings);
        return calculatedDistance <= distance;
    }
}
