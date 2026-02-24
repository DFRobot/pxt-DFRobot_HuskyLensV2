/** 
 * @file huskylens2_app1.ts
 * @brief DFRobot's huskylens 2 makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_huskylens2)
 * @copyright    [DFRobot](http://www.dfrobot.com), 2026
 * @license The MIT License (MIT)
 * @author [email](rong.li@dfrobot.com)
 * @date  2026-2-2
*/


// ==================== Algorithm selection enum ====================
enum AlgorithmLearnSetNameOfId {
    //% blockHidden=true
    AlgorithmAny = 0,                      // 0
    //% block="face recognition"
    AlgorithmFaceRecognition = 1,         // 1
    //% block="object tracking"
    AlgorithmObjectTracking = 3,          // 3
    //% block="color recognition"
    AlgorithmColorRecognition = 4,        // 4
    //% block="self learning classification"
    AlgorithmSelfLearningClassification = 6, // 6
    //% block="hand recognition"
    AlgorithmHandRecognition = 8,        // 8
    //% block="pose recognition"
    AlgorithmPoseRecognition = 9,        // 9
    //% block="license plate recognition"
    AlgorithmLicenseRecognition = 10,      // 10
    //% block="OCR recognition"
    AlgorithmOcrRecognition = 11,          // 11
    //% block="gaze recognition"
    AlgorithmGazeRecognition = 14,            // 14
    //% block="face Orientation"
    AlgorithmFaceOrientation = 15,             // 15
        //% block="tag recognition"
    AlgorithmTagRecognition = 16,              // 16
    //% block="barcode recognition"
    AlgorithmBarcodeRecognition = 17,        // 17
    //% block="QR code recognition"
    AlgorithmQrCodeRecognition = 18,       // 18
}

    enum AlgorithmLearnObjectAtCenter {
    //% blockHidden=true
    AlgorithmAny = 0,                      // 0
    //% block="face recognition"
    AlgorithmFaceRecognition = 1,         // 1
    //% block="object recognition"
    AlgorithmObjectRecognition = 2,       // 2
    //% block="color recognition"
    AlgorithmColorRecognition = 4,        // 4
    //% block="object classification"
    AlgorithmObjectClassification = 5,   // 5
    //% block="self learning classification"
    AlgorithmSelfLearningClassification = 6, // 6
    //% block="instance segmentation"
    AlgorithmSegment = 7,                 // 7
    //% block="hand recognition"
    AlgorithmHandRecognition = 8,        // 8
    //% block="pose recognition"
    AlgorithmPoseRecognition = 9,        // 9
    //% block="license plate recognition"
    AlgorithmLicenseRecognition = 10,      // 10
    //% block="OCR recognition"
    AlgorithmOcrRecognition = 11,          // 11

    //% block="gaze recognition"
    AlgorithmGazeRecognition = 14,            // 14
    //% block="face Orientation"
    AlgorithmFaceOrientation = 15,             // 15
        //% block="tag recognition"
    AlgorithmTagRecognition = 16,              // 16
    //% block="barcode recognition"
    AlgorithmBarcodeRecognition = 17,        // 17
    //% block="QR code recognition"
    AlgorithmQrCodeRecognition = 18,       // 18
}

    enum AlgorithmLearnObjectInBox {
    //% blockHidden=true
    AlgorithmAny = 0,                      // 0
    //% block="face recognition"
    AlgorithmFaceRecognition = 1,         // 1
    //% block="object recognition"
    AlgorithmObjectRecognition = 2,       // 2
    //% block="object tracking"
    AlgorithmObjectTracking = 3,          // 3
    //% block="color recognition"
    AlgorithmColorRecognition = 4,        // 4
    //% block="instance segmentation"
    AlgorithmSegment = 7,                 // 7
    //% block="hand recognition"
    AlgorithmHandRecognition = 8,        // 8
    //% block="pose recognition"
    AlgorithmPoseRecognition = 9,        // 9
    //% block="license plate recognition"
    AlgorithmLicenseRecognition = 10,      // 10
    //% block="OCR recognition"
    AlgorithmOcrRecognition = 11,          // 11


    //% block="gaze recognition"
    AlgorithmGazeRecognition = 14,            // 14
    //% block="face Orientation"
    AlgorithmFaceOrientation = 15,             // 15
        //% block="tag recognition"
    AlgorithmTagRecognition = 16,              // 16
    //% block="barcode recognition"
    AlgorithmBarcodeRecognition = 17,        // 17
    //% block="QR code recognition"
    AlgorithmQrCodeRecognition = 18,       // 18
}

    enum Algorithm {
    //% blockHidden=true
    AlgorithmAny = 0,                      // 0
    //% block="face recognition"
    AlgorithmFaceRecognition = 1,         // 1
    //% block="object recognition"
    AlgorithmObjectRecognition = 2,       // 2
    //% block="object tracking"
    AlgorithmObjectTracking = 3,          // 3
    //% block="color recognition"
    AlgorithmColorRecognition = 4,        // 4
    //% block="object classification"
    AlgorithmObjectClassification = 5,   // 5
    //% block="self learning classification"
    AlgorithmSelfLearningClassification = 6, // 6
    //% block="instance segmentation"
    AlgorithmSegment = 7,                 // 7
    //% block="hand recognition"
    AlgorithmHandRecognition = 8,        // 8
    //% block="pose recognition"
    AlgorithmPoseRecognition = 9,        // 9
    //% block="license plate recognition"
    AlgorithmLicenseRecognition = 10,      // 10
    //% block="OCR recognition"
    AlgorithmOcrRecognition = 11,          // 11
    //% block="line tracking"
    AlgorithmLineTracking = 12,            // 12
    //% block="face emotion recognition"
    AlgorithmEmotionRecognition = 13,     // 13

    //% block="gaze recognition"
    AlgorithmGazeRecognition = 14,            // 14
    //% block="face Orientation"
    AlgorithmFaceOrientation = 15,             // 15
    //% block="tag recognition"
    AlgorithmTagRecognition = 16,              // 16
    //% block="barcode recognition"
    AlgorithmBarcodeRecognition = 17,        // 17
    //% block="QR code recognition"
    AlgorithmQrCodeRecognition = 18,       // 18
    //% block="fall detection property"
    AlgorithmFallDownRecognition = 19,        // 19

    //% blockHidden=true
    AlgorithmCustom0 = 20,                 // 20
    //% blockHidden=true
    AlgorithmCustom1 = 21,                 // 21
    //% blockHidden=true
    AlgorithmCustom2 = 22,                 // 22
    //% blockHidden=true
    AlgorithmBuiltinCount = 23,           // 23
    //% blockHidden=true
    AlgorithmCustomBegin = 128,           // 128
}

enum BaseProperty {
    //% block="name"
    Name=1,
    //% block="x center"
    XCenter,
    //% block="y center"
    YCenter,
    //% block="width"
    Width,
    //% block="height"
    Height
}
enum BasePropertyId {
    //% block="Id"
    Id,
    //% block="name"
    Name,
    //% block="x center"
    XCenter,
    //% block="y center"
    YCenter,
    //% block="width"
    Width,
    //% block="height"
    Height
}

enum BasePropertyContent {
    //% block="name"
    Name=1,
    //% block="x center"
    XCenter,
    //% block="y center"
    YCenter,
    //% block="width"
    Width,
    //% block="height"
    Height,
    //% block="content"
    Content
}

enum BasePropertyContentId {
    //% block="Id"
    Id,
    //% block="name"
    Name,
    //% block="x center"
    XCenter,
    //% block="y center"
    YCenter,
    //% block="width"
    Width,
    //% block="height"
    Height,
    //% block="content"
    Content
}
// object classification properties (only Id and Name)
enum ObjectClassificationProperty {
    //% block="Id"
    Id,
    //% block="name"
    Name,
}
// self learning classification properties (only Id and Name)
enum SelfLearningClassificationProperty {
    //% block="Id"
    Id,
    //% block="name"
    Name,
}

/**
 * HuskyLens 2 
 */
//% weight=100 color=#0fbc11 icon="\uf083" block="huskylens2"
//% groups='["communication","algorithm switch"]'
namespace huskylens2 {
    // ================= Block =================
    /**
     * Initialize I2C and keep trying until the sensor responds.
     */
    //% weight=200
    //%block="initialize I2C until success"
    //% group="communication"
    export function I2CInit(): void {
        let res = beginInternal();
        while (!res) {
            basic.showLeds(`
                # . . . #
                . # . # .
                . . # . .
                . # . # .
                # . . . #
                `, 10)
            basic.pause(500);
            res = beginInternal();
            basic.clearScreen()
        }
        basic.showLeds(`
                . . . . .
                . . . . #
                . . . # .
                # . # . .
                . # . . .
                `, 10)
        basic.pause(500);
        basic.clearScreen()
    }

    /**
     * Switch algorithm
     * @param algorithmId The algorithm to switch to.
     */
    //% block="switch algorithm %algorithmId "
    //% weight=199
    //% group="algorithm switch"
    export function switchAlgorithm(algorithmId : Algorithm): void {
        let s = switchAlgorithmInternal(algorithmToId(algorithmId));
        while (!s) { 
            basic.pause(1000);
            s = switchAlgorithmInternal(algorithmToId(algorithmId));
        }
        basic.pause(5000);// Wait 5 seconds for model loading
    }

    // ========================================================== face recognition ==================================================
    /**
     * Request one-time face recognition result and store it
     */
    //% block="get face recognition result"
    //% weight=198
    //% subcategory="face recognition"
    export function getResultFaceRecognition(): void {
        getResultInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Check if at least one face is currently detected.
     */
    //% block="available face recogtion"
    //% weight=197
    //% subcategory="face recognition"
    export function availableFaceRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Get cached result of the face nearest to the center
     * @param property face property to query
     */
    //% block="face nearest to center %property"
    //% weight=196
    //% subcategory="face recognition"
    export function cachedCenterResult(property: BasePropertyId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmFaceRecognition);
        return getBasePropertyValueInternal(r, property);
    }

    /**
     * Get number of detected faces from cache
     */
    //% block="number of detected faces"
    //% weight=195
    //% subcategory="face recognition"
    export function cachedResultNumFace(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Get a specific face's property by index from cache
     * @param index The face index (1-based).
     * @param property The face property to retrieve.
     */
    //% block="face %index %property"
    //% weight=194
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function cachedResultFaceProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmFaceRecognition, index - 1);
        return getBasePropertyValueInternal(r, property);
    }

    /**
     * Get number of learned face Ids
     */
    //% block="number of learned face Ids"
    //% weight=193
    //% subcategory="face recognition"
    export function totalLearnedFaceIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Whether face with given Id exists
     * @param index face Id index (number)
     */
    //% block="face Id %index exists?"
    //% weight=192
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function faceIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmFaceRecognition, index);
        return r != null;
    }

    /**
     * Get number of faces with a given Id
     * @param index face Id index (number)
     */
    //% block="number of faces with Id %index"
    //% weight=191
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function totalFaceById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmFaceRecognition, index);
    }

    /**
     * Get a property for faces with a given Id
     * @param index The index of the learned Id (1-based).
     * @param property The property to retrieve (excluding Id).
     */
    //% block="face Id %index %property"
    //% weight=190
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function facePropertyById(index: number, property: BaseProperty): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmFaceRecognition, index);
        return getBasePropertyValueInternal(r, property);
    }

    /**
     * Get a property for the No.N face of a given Id
     * @param Id The face Id.
     * @param n The nth face (1-based).
     * @param property The property to retrieve (excluding Id).
     */
    //% block="face Id %Id No. %index %property"
    //% weight=189
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="face recognition"
    export function facePropertyByIdNth(Id: number, index: number, property: BaseProperty): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmFaceRecognition, Id, index - 1);
        return getBasePropertyValueInternal(r, property);
    }

    
    

    // Helper function: Convert Algorithm enum to algorithm Id
    function algorithmToId(algorithmId : Algorithm): number {
        return algorithmId  as number;
    }


    /**
     * Internal function: get a property value from a cached result.
     * @param result The cached result to read from.
     * @param property The property identifier.
     */
    //% blockHidden=true
    export function getBasePropertyValueInternal(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case BasePropertyId.Id: return res.Id;
            case BasePropertyId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyId.XCenter: return res.xCenter;
            case BasePropertyId.YCenter: return res.yCenter;
            case BasePropertyId.Width: return res.width;
            case BasePropertyId.Height: return res.height;
            default: return 0;
        }
    }


    // ====================================================== object recognition ===============================================

    /** Get one-time object recognition result and cache it */
    //% block="get object recognition result"
    //% weight=188
    //% subcategory="object recognition"
    export function getResultObjectRecognition(): void {
        getResultInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /** Whether object detected */
    //% block="object detected?"
    //% weight=187
    //% subcategory="object recognition"
    export function availableObjectRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /**
     * Object property nearest to center
     * @param property The property to retrieve.
     */
    //% block="object nearest to center %property"
    //% weight=186
    //% subcategory="object recognition"
    export function cachedCenterObjectResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmObjectRecognition);
        return getBasePropertyValueInternal(r, property);
    }

    /** Total number of detected objects */
    //% block="number of detected objects"
    //% weight=185
    //% subcategory="object recognition"
    export function cachedResultNumObject(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /**
     * Property of No.N object
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="object %index %property"
    //% weight=184
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function cachedResultObjectProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmObjectRecognition, index - 1);
        return getBasePropertyValueInternal(r, property);
    }

    /** Total number of learned object Ids */
    //% block="number of learned object Ids"
    //% weight=183
    //% subcategory="object recognition"
    export function totalLearnedObjectIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /**
     * Whether object with specified Id exists
     * @param index The index (1-based).
     */
    //% block="object Id %index exists?"
    //% weight=182
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function objectIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmObjectRecognition, index);
        return r != null;
    }

    /**
     * Number of objects with specified Id
     * @param index The index (1-based).
     */
    //% block="number of objects with Id %index"
    //% weight=181
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function totalObjectById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmObjectRecognition, index);
    }

    /**
     * Property of object with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="object Id %index %property"
    //% weight=180
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function objectPropertyById(index: number, property: BaseProperty): number {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmObjectRecognition, index);
        return getBasePropertyValueInternal(r, property);
    }

    /**
     * Property of No.N object with specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="object Id %Id No. %index %property"
    //% weight=179
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="object recognition"
    export function objectPropertyByIdNth(Id: number, index: number, property: BaseProperty): number {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmObjectRecognition, Id, index - 1);
        return getBasePropertyValueInternal(r, property);
    }

    // =============================================================== object tracking ========================================
    /** Request one-time object tracking data and store in result */
    //% block="get object tracking result"
    //% weight=178
    //% subcategory="object tracking"
    export function getResultObjectTracking(): void {
        getResultInternal(Algorithm.AlgorithmObjectTracking);
    }

    /** Whether tracked object detected */
    //% block="tracked object detected?"
    //% weight=177
    //% subcategory="object tracking"
    export function availableObjectTracking(): boolean {
        return availableInternal(Algorithm.AlgorithmObjectTracking);
    }

    /**
     * Property of tracked object
     * @param property The property to retrieve.
     */
    //% block="tracked object %property"
    //% weight=176
    //% subcategory="object tracking"
    export function cachedObjectTrackingResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmObjectTracking);
        return getBasePropertyValueInternal(r, property);
    }

    // ================= color recognition =================
    function getColorPropertyValue(result: ResultVariant, property: number): number {
        return getBasePropertyValueInternal(result, property as any);
    }

    /** Get one-time color recognition result and cache it */
    //% block="get color recognition result"
    //% weight=175
    //% subcategory="color recognition"
    export function getResultColorRecognition(): void {
        getResultInternal(Algorithm.AlgorithmColorRecognition);
    }

    /** Whether color block detected */
    //% block="color block detected?"
    //% weight=174
    //% subcategory="color recognition"
    export function availableColorRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmColorRecognition);
    }

    /**
     * Color block property nearest to center
     * @param property The property to retrieve.
     */
    //% block="color block nearest to center %property"
    //% weight=173
    //% subcategory="color recognition"
    export function cachedCenterColorResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmColorRecognition);
        return getColorPropertyValue(r, property);
    }

    /** Total number of detected color blocks */
    //% block="number of detected color blocks"
    //% weight=172
    //% subcategory="color recognition"
    export function cachedResultNumColor(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmColorRecognition);
    }

    /**
     * Property of No.N color block
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="color block %index %property"
    //% weight=171
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function cachedResultColorProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmColorRecognition, index - 1);
        return getColorPropertyValue(r, property);
    }

    /** Total number of learned color block Ids */
    //% block="number of learned color block Ids"
    //% weight=170
    //% subcategory="color recognition"
    export function totalLearnedColorIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmColorRecognition);
    }

    /**
     * Whether color block with specified Id exists
     * @param index The index (1-based).
     */
    //% block="color block Id %index exists?"
    //% weight=169
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function colorIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmColorRecognition, index);
        return r != null;
    }

    /**
     * Number of color blocks with specified Id
     * @param index The index (1-based).
     */
    //% block="number of color blocks with Id %index"
    //% weight=168
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function totalColorById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmColorRecognition, index);
    }

    /**
     * Property of color block with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="color block Id %index %property"
    //% weight=167
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function colorPropertyById(index: number, property: BaseProperty): number {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmColorRecognition, index);
        return getColorPropertyValue(r, property);
    }

    /**
     * Property of No.N color block with specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="color block Id %Id No. %index %property"
    //% weight=166
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="color recognition"
    export function colorPropertyByIdNth(Id: number, index: number, property: BaseProperty): number {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmColorRecognition, Id, index - 1);
        return getColorPropertyValue(r, property);
    }


    // ============================================== object classification============================================================


    function getObjectClassificationPropertyValue(result: ResultVariant, property: ObjectClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case ObjectClassificationProperty.Id: return res.classId;
            case ObjectClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time object classification data and store in result */
    //% block="get object classification result"
    //% weight=4
    //% subcategory="object classification"
    export function getResultObjectClassification(): void {
        getResultInternal(Algorithm.AlgorithmObjectClassification);
    }
    /** Whether classified object detected */
    //% block="classified object detected?"
    //% weight=3
    //% subcategory="object classification"
    export function availableObjectClassification(): boolean {
        return availableInternal(Algorithm.AlgorithmObjectClassification);
    }

    /** Total number of detected classified objects */
    //% block="number of detected classified objects"
    //% weight=2
    //% subcategory="object classification"
    export function cachedResultNumObjectClassification(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmObjectClassification);
    }

    /**
     * Property of No.N classified object
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="classified object %index %property"
    //% weight=1
    //% index.min=1 index.defl=1
    //% subcategory="object classification"
    export function cachedObjectClassificationResult(index: number, property: ObjectClassificationProperty): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmObjectClassification, index - 1);
        return getObjectClassificationPropertyValue(r, property);
    }



    // ==================================================== self learning classification ========================================


    function getSelfLearningClassificationPropertyValue(result: ResultVariant, property: SelfLearningClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case SelfLearningClassificationProperty.Id: return res.Id;
            case SelfLearningClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time self learning classification data and store in result */
    //% block="get self learning classification result"
    //% weight=162
    //% subcategory="self learning classification"
    export function getResultSelfLearningClassification(): void {
        getResultInternal(Algorithm.AlgorithmSelfLearningClassification);
    }

    /** Whether self learning classification detected */
    //% block="self learning classification detected?"
    //% weight=161
    //% subcategory="self learning classification"
    export function availableSelfLearningClassification(): boolean {
        return availableInternal(Algorithm.AlgorithmSelfLearningClassification);
    }

    /**
     * Property of self learning classification
     * @param property The property to retrieve.
     */
    //% block="self learning classification %property"
    //% weight=160
    //% subcategory="self learning classification"
    export function cachedSelfLearningClassificationResult(property: SelfLearningClassificationProperty): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmSelfLearningClassification);
        return getSelfLearningClassificationPropertyValue(r, property);
    }

    // =================================================== instance segmentation ===================================================
    function getInstancePropertyValue(result: ResultVariant, property: BasePropertyId): number {
        return getBasePropertyValueInternal(result, property as any);
    }

    function getInstancePropertyValueId(result: ResultVariant, property: BaseProperty): number {
        return getBasePropertyValueInternal(result, property as any);
    }

    /** Get one-time instance segmentation result and cache it */
    //% block="get instance segmentation result"
    //% weight=159
    //% subcategory="instance segmentation"
    export function getResultInstanceRecognition(): void {
        getResultInternal(Algorithm.AlgorithmSegment);
    }

    /** Whether instance detected */
    //% block="instance detected?"
    //% weight=158
    //% subcategory="instance segmentation"
    export function availableInstanceRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmSegment);
    }

    /**
     * Instance property nearest to center
     * @param property The property to retrieve.
     */
    //% block="instance nearest to center %property"
    //% weight=157
    //% subcategory="instance segmentation"
    export function cachedCenterInstanceResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmSegment);
        return getInstancePropertyValue(r, property);
    }

    /** Total number of detected instances */
    //% block="number of detected instances"
    //% weight=156
    //% subcategory="instance segmentation"
    export function cachedResultNumInstance(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmSegment);
    }

    /**
     * Property of No.N instance
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="instance %index %property"
    //% weight=155
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function cachedResultInstanceProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmSegment, index - 1);
        return getInstancePropertyValue(r, property);
    }

    /** Total number of learned instance Ids */
    //% block="number of learned instance Ids"
    //% weight=154
    //% subcategory="instance segmentation"
    export function totalLearnedInstanceIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmSegment);
    }

    /**
     * Whether instance with specified Id exists
     * @param index The index (1-based).
     */
    //% block="instance Id %index exists?"
    //% weight=153
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function instanceIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmSegment, index);
        return r != null;
    }

    /**
     * Number of instances with specified Id
     * @param index The index (1-based).
     */
    //% block="number of instances with Id %index"
    //% weight=152
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function totalInstanceById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmSegment, index);
    }

    /**
     * Property of instance with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="instance Id %index %property"
    //% weight=151
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function instancePropertyById(index: number, property: BaseProperty): number {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmSegment, index);
        return getInstancePropertyValueId(r, property);
    }

    /**
     * Property of No.N instance with specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="instance Id %Id No. %index %property"
    //% weight=150
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="instance segmentation"
    export function instancePropertyByIdNth(Id: number, index: number, property: BaseProperty): number {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmSegment, Id, index - 1);
        return getInstancePropertyValueId(r, property);
    }

    // ================================== hand recognition ==================================
    function getGesturePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        return getBasePropertyValueInternal(result, property as any);
    }

    /** Get one-time hand recognition result and cache it */
    //% block="get hand recognition result"
    //% weight=149
    //% subcategory="hand recognition"
    export function getResultGestureRecognition(): void {
        getResultInternal(Algorithm.AlgorithmHandRecognition);
    }

    /** Whether gesture detected */
    //% block="gesture detected?"
    //% weight=148
    //% subcategory="hand recognition"
    export function availableGestureRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmHandRecognition);
    }

    /**
     * Gesture property nearest to center
     * @param property The property to retrieve.
     */
    //% block="gesture nearest to center %property"
    //% weight=147
    //% subcategory="hand recognition"
    export function cachedCenterGestureResult(property: BasePropertyId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmHandRecognition);
        return getGesturePropertyValue(r, property);
    }

    /** Total number of detected gestures */
    //% block="number of detected gestures"
    //% weight=146
    //% subcategory="hand recognition"
    export function cachedResultNumGesture(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmHandRecognition);
    }

    /**
     * Property of No.N gesture
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="gesture %index %property"
    //% weight=145
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function cachedResultGestureProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmHandRecognition, index - 1);
        return getGesturePropertyValue(r, property);
    }

    /** Total number of learned gesture Ids */
    //% block="number of learned gesture Ids"
    //% weight=144
    //% subcategory="hand recognition"
    export function totalLearnedGestureIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmHandRecognition);
    }

    /**
     * Whether gesture with specified Id exists
     * @param index The index (1-based).
     */
    //% block="gesture Id %index exists?"
    //% weight=143
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function gestureIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmHandRecognition, index);
        return r != null;
    }

    /**
     * Number of gestures with specified Id
     * @param index The index (1-based).
     */
    //% block="number of gestures with Id %index"
    //% weight=142
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function totalGestureById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmHandRecognition, index);
    }

    /**
     * Property of gesture with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="gesture Id %index %property"
    //% weight=141
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function gesturePropertyById(index: number, property: BaseProperty): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmHandRecognition, index);
        return getGesturePropertyValue(r, property);
    }

    /**
     * Property of No.N gesture with specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="gesture Id %Id No. %index %property"
    //% weight=140
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="hand recognition"
    export function gesturePropertyByIdNth(Id: number, index: number, property: BaseProperty): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmHandRecognition, Id, index - 1);
        return getGesturePropertyValue(r, property);
    }

    // ================================================================ pose recognition (Human Pose) ========================
    function getPosePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        return getBasePropertyValueInternal(result, property as any);
    }

    /** Get one-time pose recognition result and cache it */
    //% block="get pose recognition result"
    //% weight=139
    //% subcategory="pose recognition"
    export function getResultPoseRecognition(): void {
        getResultInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /** Whether pose detected */
    //% block="pose detected?"
    //% weight=138
    //% subcategory="pose recognition"
    export function availablePoseRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /**
     * Pose property nearest to center
     * @param property The property to retrieve.
     */
    //% block="pose nearest to center %property"
    //% weight=137
    //% subcategory="pose recognition"
    export function cachedCenterPoseResult(property: BasePropertyId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmPoseRecognition);
        return getPosePropertyValue(r, property);
    }

    /** Total number of detected poses */
    //% block="number of detected poses"
    //% weight=136
    //% subcategory="pose recognition"
    export function cachedResultNumPose(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /**
     * Property of No.N pose
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="pose %index %property"
    //% weight=135
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function cachedResultPoseProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmPoseRecognition, index - 1);
        return getPosePropertyValue(r, property);
    }

    /** Total number of learned pose Ids */
    //% block="number of learned pose Ids"
    //% weight=134
    //% subcategory="pose recognition"
    export function totalLearnedPoseIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /**
     * Whether pose with specified Id exists
     * @param index The index (1-based).
     */
    //% block="pose Id %index exists?"
    //% weight=133
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function poseIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmPoseRecognition, index);
        return r != null;
    }

    /**
     * Number of poses with specified Id
     * @param index The index (1-based).
     */
    //% block="number of poses with Id %index"
    //% weight=132
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function totalPoseById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmPoseRecognition, index);
    }

    /**
     * Property of pose with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="pose Id %index %property"
    //% weight=131
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function posePropertyById(index: number, property: BaseProperty): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmPoseRecognition, index);
        return getPosePropertyValue(r, property);
    }

    /**
     * Property of No.N pose with specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="pose Id %Id No. %index %property"
    //% weight=130
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="pose recognition"
    export function posePropertyByIdNth(Id: number, index: number, property: BaseProperty): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmPoseRecognition, Id, index - 1);
        return getPosePropertyValue(r, property);
    }}

