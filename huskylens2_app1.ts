/** 
 * @file huskylens2_app1.ts
 * @brief DFRobot's huskylens 2 makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_huskylens2)
 * @copyright    [DFRobot](http://www.dfrobot.com), 2026
 * @license The MIT License (MIT)
 * @author [email](rong.li@dfrobot.com)
 * @date  2026-2-2
*/

/**
 * HuskyLens 2 
 */
//% weight=100 color=#0fbc11 icon="\uf083" block="huskylens2"
//% groups='["communication","algorithm switch"]'
namespace huskylens2 {
    // ================= Block =================
    /**
     *  Init I2C until success
     */
    //% weight=200
    //%block="initialize via I2C until success"
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
     * @param property select algorithm
     */
    //% block="switch algorithm %property"
    //% weight=199
    //% group="algorithm switch"
    export function switchAlgorithm(property: Algorithm): void {
        let s = switchAlgorithmInternal(algorithmToID(property));
        while (!s) { 
            basic.pause(1000);
            s = switchAlgorithmInternal(algorithmToID(property));
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
    export function getResultFaceRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Whether face recognized
     * Return true if a face is detected
     */
    //% block="available face recogtion"
    //% weight=197
    //% subcategory="face recognition"
    export function availableFaceRecogtion(): boolean {
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
        return getBasePropertyValue(r, property);
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
     * @param index face index (1-based)
     * @param property face property to query
     */
    //% block="face %index %property"
    //% weight=194
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function cachedResultFaceProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmFaceRecognition, index - 1);
        return getBasePropertyValue(r, property);
    }

    /**
     * Get number of learned face IDs
     */
    //% block="number of learned face IDs"
    //% weight=193
    //% subcategory="face recognition"
    export function totalLearnedFaceIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmFaceRecognition);
    }

    /**
     * Whether face with given id exists
     * @param index face id index (number)
     */
    //% block="face id %index exists?"
    //% weight=192
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function faceIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmFaceRecognition, index);
        return r != null;
    }

    /**
     * Get number of faces with a given id
     * @param index face id index (number)
     */
    //% block="number of faces with id %index"
    //% weight=191
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function totalFaceByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmFaceRecognition, index);
    }

    /**
     * Get a property for faces with a given id
     * @param index face id index (number)
     * @param property face property (without id)
     */
    //% block="face id %index %property"
    //% weight=190
    //% index.min=1 index.defl=1
    //% subcategory="face recognition"
    export function facePropertyByID(index: number, property: BaseProperty): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmFaceRecognition, index);
        return getBasePropertyValue(r, property);
    }

    /**
     * Get a property for the No.N face of a given id
     * @param id face id (number)
     * @param n No.N face (1-based)
     * @param property face property (without id)
     */
    //% block="face id %id No.%n %property"
    //% weight=189
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="face recognition"
    export function facePropertyByIDNth(id: number, n: number, property: BaseProperty): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmFaceRecognition, id, n - 1);
        return getBasePropertyValue(r, property);
    }

    
    // ==================== Algorithm selection enum ====================
    export enum AlgorithmLearnSetNameOfId {
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

        export enum AlgorithmLearnObjectAtCenter {
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

     export enum AlgorithmLearnObjectInBox {
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

        export enum Algorithm {
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

    export enum BaseProperty {
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
    export enum BasePropertyId {
        //% block="id"
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

    export enum BasePropertyContent {
        //% block="name"
        Name=1,
        //% block="x Center"
        XCenter,
        //% block="y Center"
        YCenter,
        //% block="width"
        Width,
        //% block="height"
        Height,
        //% block="content"
        Content
    }

    export enum BasePropertyContentId {
        //% block="id"
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

    // Helper export function: Convert Algorithm enum to algorithm id
    export function algorithmToID(property: Algorithm): number {
        return property as number;
    }

    export function getBasePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyId.Id: return res.id;
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
    export function getResultObjectRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /** Whether object detected */
    //% block="object detected?"
    //% weight=187
    //% subcategory="object recognition"
    export function availableObjectRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /** Object property nearest to center */
    //% block="object nearest to center %property"
    //% weight=186
    //% subcategory="object recognition"
    export function cachedCenterObjectResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmObjectRecognition);
        return getBasePropertyValue(r, property);
    }

    /** Total number of detected objects */
    //% block="number of detected objects"
    //% weight=185
    //% subcategory="object recognition"
    export function cachedResultNumObject(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /** Property of No.N object */
    //% block="object %index %property"
    //% weight=184
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function cachedResultObjectProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmObjectRecognition, index - 1);
        return getBasePropertyValue(r, property);
    }

    /** Total number of learned object IDs */
    //% block="number of learned object IDs"
    //% weight=183
    //% subcategory="object recognition"
    export function totalLearnedObjectIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmObjectRecognition);
    }

    /** Whether object with specified id exists */
    //% block="object id %index exists?"
    //% weight=182
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function objectIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmObjectRecognition, index);
        return r != null;
    }

    /** Number of objects with specified id */
    //% block="number of objects with id %index"
    //% weight=181
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function totalObjectByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmObjectRecognition, index);
    }

    /** Property of object with specified id */
    //% block="object id %index %property"
    //% weight=180
    //% index.min=1 index.defl=1
    //% subcategory="object recognition"
    export function objectPropertyByID(index: number, property: BaseProperty): number {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmObjectRecognition, index);
        return getBasePropertyValue(r, property);
    }

    /** Property of No.N object with specified id */
    //% block="object id %id No. %n %property"
    //% weight=179
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="object recognition"
    export function objectPropertyByIDNth(id: number, n: number, property: BaseProperty): number {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmObjectRecognition, id, n - 1);
        return getBasePropertyValue(r, property);
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

    /** Property of tracked object */
    //% block="tracked object %property"
    //% weight=176
    //% subcategory="object tracking"
    export function cachedObjectTrackingResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmObjectTracking);
        return getBasePropertyValue(r, property);
    }

    // ================= color recognition =================
    export function getColorPropertyValue(result: ResultVariant, prop: number): number {
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time color recognition result and cache it */
    //% block="get color recognition result"
    //% weight=175
    //% subcategory="color recognition"
    export function getResultColorRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmColorRecognition);
    }

    /** Whether color block detected */
    //% block="color block detected?"
    //% weight=174
    //% subcategory="color recognition"
    export function availableColorRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmColorRecognition);
    }

    /** Color block property nearest to center */
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

    /** Property of No.N color block */
    //% block="color block %index %property"
    //% weight=171
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function cachedResultColorProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmColorRecognition, index - 1);
        return getColorPropertyValue(r, property);
    }

    /** Total number of learned color block IDs */
    //% block="number of learned color block IDs"
    //% weight=170
    //% subcategory="color recognition"
    export function totalLearnedColorIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmColorRecognition);
    }

    /** Whether color block with specified id exists */
    //% block="color block id %index exists?"
    //% weight=169
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function colorIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmColorRecognition, index);
        return r != null;
    }

    /** Number of color blocks with specified id */
    //% block="number of color blocks with id %index"
    //% weight=168
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function totalColorByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmColorRecognition, index);
    }

    /** Property of color block with specified id */
    //% block="color block id %index %property"
    //% weight=167
    //% index.min=1 index.defl=1
    //% subcategory="color recognition"
    export function colorPropertyByID(index: number, property: BaseProperty): number {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmColorRecognition, index);
        return getColorPropertyValue(r, property);
    }

    /** Property of No.N color block with specified id */
    //% block="color block id %id No. %n %property"
    //% weight=166
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="color recognition"
    export function colorPropertyByIDNth(id: number, n: number, property: BaseProperty): number {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmColorRecognition, id, n - 1);
        return getColorPropertyValue(r, property);
    }


    // ============================================== object classification============================================================
    // object classification properties (only id and Name)
    export enum ObjectClassificationProperty {
        //% block="id"
        Id,
        //% block="Name"
        Name,
    }

    function getObjectClassificationPropertyValue(result: ResultVariant, prop: ObjectClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case ObjectClassificationProperty.Id: return res.classID;
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

    /** Property of No.N classified object */
    //% block="classified object %num %property"
    //% weight=1
    //% num.min=1 num.defl=1
    //% subcategory="object classification"
    export function cachedObjectClassificationResult(num: number, property: ObjectClassificationProperty): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmObjectClassification, num - 1);
        return getObjectClassificationPropertyValue(r, property);
    }



    // ==================================================== self learning classification ========================================
    // self learning classification properties (only id and Name)
    export enum SelfLearningClassificationProperty {
        //% block="id"
        Id,
        //% block="Name"
        Name,
    }

    export function getSelfLearningClassificationPropertyValue(result: ResultVariant, prop: SelfLearningClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case SelfLearningClassificationProperty.Id: return res.id;
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

    /** Property of self learning classification */
    //% block="self learning classification %property"
    //% weight=160
    //% subcategory="self learning classification"
    export function cachedSelfLearningClassificationResult(property: SelfLearningClassificationProperty): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmSelfLearningClassification);
        return getSelfLearningClassificationPropertyValue(r, property);
    }

    // =================================================== instance segmentation ===================================================
    export function getInstancePropertyValue(result: ResultVariant, prop: BasePropertyId): number {
        return getBasePropertyValue(result, prop as any);
    }

    export function getInstancePropertyValueID(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time instance segmentation result and cache it */
    //% block="get instance segmentation result"
    //% weight=159
    //% subcategory="instance segmentation"
    export function getResultInstanceRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmSegment);
    }

    /** Whether instance detected */
    //% block="instance detected?"
    //% weight=158
    //% subcategory="instance segmentation"
    export function availableInstanceRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmSegment);
    }

    /** Instance property nearest to center */
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

    /** Property of No.N instance */
    //% block="instance %index %property"
    //% weight=155
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function cachedResultInstanceProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmSegment, index - 1);
        return getInstancePropertyValue(r, property);
    }

    /** Total number of learned instance IDs */
    //% block="number of learned instance IDs"
    //% weight=154
    //% subcategory="instance segmentation"
    export function totalLearnedInstanceIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmSegment);
    }

    /** Whether instance with specified id exists */
    //% block="instance id %index exists?"
    //% weight=153
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function instanceIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmSegment, index);
        return r != null;
    }

    /** Number of instances with specified id */
    //% block="number of instances with id %index"
    //% weight=152
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function totalInstanceByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmSegment, index);
    }

    /** Property of instance with specified id */
    //% block="instance id %index %property"
    //% weight=151
    //% index.min=1 index.defl=1
    //% subcategory="instance segmentation"
    export function instancePropertyByID(index: number, property: BaseProperty): number {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmSegment, index);
        return getInstancePropertyValueID(r, property);
    }

    /** Property of No.N instance with specified id */
    //% block="instance id %id No. %n %property"
    //% weight=150
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="instance segmentation"
    export function instancePropertyByIDNth(id: number, n: number, property: BaseProperty): number {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmSegment, id, n - 1);
        return getInstancePropertyValueID(r, property);
    }

    // ================================== hand recognition ==================================
    function getGesturePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time hand recognition result and cache it */
    //% block="get hand recognition result"
    //% weight=149
    //% subcategory="hand recognition"
    export function getResultGestureRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmHandRecognition);
    }

    /** Whether gesture detected */
    //% block="gesture detected?"
    //% weight=148
    //% subcategory="hand recognition"
    export function availableGestureRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmHandRecognition);
    }

    /** Gesture property nearest to center */
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

    /** Property of No.N gesture */
    //% block="gesture %index %property"
    //% weight=145
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function cachedResultGestureProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmHandRecognition, index - 1);
        return getGesturePropertyValue(r, property);
    }

    /** Total number of learned gesture IDs */
    //% block="number of learned gesture IDs"
    //% weight=144
    //% subcategory="hand recognition"
    export function totalLearnedGestureIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmHandRecognition);
    }

    /** Whether gesture with specified id exists */
    //% block="gesture id %index exists?"
    //% weight=143
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function gestureIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmHandRecognition, index);
        return r != null;
    }

    /** Number of gestures with specified id */
    //% block="number of gestures with id %index"
    //% weight=142
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function totalGestureByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmHandRecognition, index);
    }

    /** Property of gesture with specified id */
    //% block="gesture id %index %property"
    //% weight=141
    //% index.min=1 index.defl=1
    //% subcategory="hand recognition"
    export function gesturePropertyByID(index: number, property: BaseProperty): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmHandRecognition, index);
        return getGesturePropertyValue(r, property);
    }

    /** Property of No.N gesture with specified id */
    //% block="gesture id %id No. %n %property"
    //% weight=140
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="hand recognition"
    export function gesturePropertyByIDNth(id: number, n: number, property: BaseProperty): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmHandRecognition, id, n - 1);
        return getGesturePropertyValue(r, property);
    }

    // ================================================================ pose recognition (Human Pose) ========================
    function getPosePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time pose recognition result and cache it */
    //% block="get pose recognition result"
    //% weight=139
    //% subcategory="pose recognition"
    export function getResultPoseRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /** Whether pose detected */
    //% block="pose detected?"
    //% weight=138
    //% subcategory="pose recognition"
    export function availablePoseRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /** Pose property nearest to center */
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

    /** Property of No.N pose */
    //% block="pose %index %property"
    //% weight=135
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function cachedResultPoseProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmPoseRecognition, index - 1);
        return getPosePropertyValue(r, property);
    }

    /** Total number of learned pose IDs */
    //% block="number of learned pose IDs"
    //% weight=134
    //% subcategory="pose recognition"
    export function totalLearnedPoseIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmPoseRecognition);
    }

    /** Whether pose with specified id exists */
    //% block="pose id %index exists?"
    //% weight=133
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function poseIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmPoseRecognition, index);
        return r != null;
    }

    /** Number of poses with specified id */
    //% block="number of poses with id %index"
    //% weight=132
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function totalPoseByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmPoseRecognition, index);
    }

    /** Property of pose with specified id */
    //% block="pose id %index %property"
    //% weight=131
    //% index.min=1 index.defl=1
    //% subcategory="pose recognition"
    export function posePropertyByID(index: number, property: BaseProperty): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmPoseRecognition, index);
        return getPosePropertyValue(r, property);
    }

    /** Property of No.N pose with specified id */
    //% block="pose id %id No. %n %property"
    //% weight=130
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="pose recognition"
    export function posePropertyByIDNth(id: number, n: number, property: BaseProperty): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmPoseRecognition, id, n - 1);
        return getPosePropertyValue(r, property);
    }
}
