/**
 * Custom graphic block
 */
//% weight=100 color=#0fbc11 icon="\uf067" block="HuskylensV2"
//% groups='["Communication","Algorithm Switch","Face Recognition","Object Recognition","Object Tracking","Color Recognition","Object Classification","Self-learning Classification","Instance Segmentation","Hand Recognition","Pose Recognition","License Plate Recognition","Optical Char Recognition","Line Tracking","Face Emotion Recognition","Tag Recognition","QR Code Recognition","Barcode Recognition"]'
namespace huskylensV2 {
    // ================= Block =================
    /**
     *  Init I2C until success
     */
    //% weight=200
    //%block="initialize via I2C until success"
    //% group="Communication"
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
     * @param alg select algorithm
     */
    //% block="switch algorithm %alg"
    //% weight=199
    //% group="Algorithm Switch"
    export function switchAlgorithm(alg: Algorithm): void {
        let s = switchAlgorithmInternal(algorithmToID(alg));
        while (!s) { 
            basic.pause(1000);
            s = switchAlgorithmInternal(algorithmToID(alg));
        }
        basic.pause(5000);// Wait 5 seconds for model loading
    }

    // ========================================================== Face recognition ==================================================
    /**
     * Request one-time face recognition result and store it
     */
    //% block="get face recognition result"
    //% weight=198
    //% subcategory="Face Recognition"
    export function getResultFaceRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Whether face recognized
     * Return true if a face is detected
     */
    //% block="available face recogtion"
    //% weight=197
    //% subcategory="Face Recognition"
    export function availableFaceRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Get cached result of the face nearest to the center
     * @param alg face property to query
     */
    //% block="face nearest to center %alg"
    //% weight=196
    //% subcategory="Face Recognition"
    export function getCachedCenterResult(alg: BasePropertyID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_FACE_RECOGNITION);
        return getBasePropertyValue(r, alg);
    }

    /**
     * Get number of detected faces from cache
     */
    //% block="number of detected faces"
    //% weight=195
    //% subcategory="Face Recognition"
    export function getCachedResultNumFace(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Get a specific face's property by index from cache
     * @param index face index (1-based)
     * @param alg face property to query
     */
    //% block="face %index %alg"
    //% weight=194
    //% index.min=1 index.defl=1
    //% subcategory="Face Recognition"
    export function getCachedResultFaceProperty(index: number, alg: BasePropertyID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_FACE_RECOGNITION, index - 1);
        return getBasePropertyValue(r, alg);
    }

    /**
     * Get number of learned face IDs
     */
    //% block="number of learned face IDs"
    //% weight=193
    //% subcategory="Face Recognition"
    export function getNumLearnedFaceIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Whether face with given ID exists
     * @param index face ID index (number)
     */
    //% block="face ID %index exists?"
    //% weight=192
    //% index.min=1 index.defl=1
    //% subcategory="Face Recognition"
    export function faceIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_FACE_RECOGNITION, index);
        return r != null;
    }

    /**
     * Get number of faces with a given ID
     * @param index face ID index (number)
     */
    //% block="number of faces with ID %index"
    //% weight=191
    //% index.min=1 index.defl=1
    //% subcategory="Face Recognition"
    export function getNumFaceByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_FACE_RECOGNITION, index);
    }

    /**
     * Get a property for faces with a given ID
     * @param index face ID index (number)
     * @param alg face property (without ID)
     */
    //% block="face ID %index %alg"
    //% weight=190
    //% index.min=1 index.defl=1
    //% subcategory="Face Recognition"
    export function getFacePropertyByID(index: number, alg: BaseProperty): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_FACE_RECOGNITION, index);
        return getBasePropertyValue(r, alg);
    }

    /**
     * Get a property for the Nth face of a given ID
     * @param id face ID (number)
     * @param n Nth face (1-based)
     * @param alg face property (without ID)
     */
    //% block="face ID %id nth %n %alg"
    //% weight=189
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Face Recognition"
    export function getFacePropertyByIDNth(id: number, n: number, alg: BaseProperty): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_FACE_RECOGNITION, id, n - 1);
        return getBasePropertyValue(r, alg);
    }

    
    // ==================== Algorithm selection enum ====================
    export enum AlgorithmLearn_setNameOfID {
        //% blockHidden=true
        ALGORITHM_ANY = 0,                      // 0
        //% block="Face recognition"
        ALGORITHM_FACE_RECOGNITION = 1,         // 1
        //% block="Object tracking"
        ALGORITHM_OBJECT_TRACKING = 3,          // 3
        //% block="Color recognition"
        ALGORITHM_COLOR_RECOGNITION = 4,        // 4
        //% block="Self-learning classification"
        ALGORITHM_SELF_LEARNING_CLASSIFICATION = 6, // 6
        //% block="Hand recognition"
        ALGORITHM_HAND_RECOGNITION = 8,        // 8
        //% block="Pose recognition"
        ALGORITHM_POSE_RECOGNITION = 9,        // 9
        //% block="License plate recognition"
        ALGORITHM_LICENSE_RECOGNITION = 10,      // 10
        //% block="OCR recognition"
        ALGORITHM_OCR_RECOGNITION = 11,          // 11
        //% block="Gaze recognition"
        ALGORITHM_GAZE_RECOGNITION = 14,            // 14
        //% block="Face Orientation"
        ALGORITHM_FACE_ORIENTATION = 15,             // 15
         //% block="Tag recognition"
        ALGORITHM_TAG_RECOGNITION = 16,              // 16
        //% block="Barcode recognition"
        ALGORITHM_BARCODE_RECOGNITION = 17,        // 17
        //% block="QR code recognition"
        ALGORITHM_QRCODE_RECOGNITION = 18,       // 18
    }

        export enum Algorithm_learnObjectAtCenter {
        //% blockHidden=true
        ALGORITHM_ANY = 0,                      // 0
        //% block="Face recognition"
        ALGORITHM_FACE_RECOGNITION = 1,         // 1
        //% block="Object recognition"
        ALGORITHM_OBJECT_RECOGNITION = 2,       // 2
        //% block="Color recognition"
        ALGORITHM_COLOR_RECOGNITION = 4,        // 4
        //% block="Object classification"
        ALGORITHM_OBJECT_CLASSIFICATION = 5,   // 5
        //% block="Self-learning classification"
        ALGORITHM_SELF_LEARNING_CLASSIFICATION = 6, // 6
        //% block="Instance Segmentation"
        ALGORITHM_SEGMENT = 7,                 // 7
        //% block="Hand recognition"
        ALGORITHM_HAND_RECOGNITION = 8,        // 8
        //% block="Pose recognition"
        ALGORITHM_POSE_RECOGNITION = 9,        // 9
        //% block="License plate recognition"
        ALGORITHM_LICENSE_RECOGNITION = 10,      // 10
        //% block="OCR recognition"
        ALGORITHM_OCR_RECOGNITION = 11,          // 11

        //% block="Gaze recognition"
        ALGORITHM_GAZE_RECOGNITION = 14,            // 14
        //% block="Face Orientation"
        ALGORITHM_FACE_ORIENTATION = 15,             // 15
         //% block="Tag recognition"
        ALGORITHM_TAG_RECOGNITION = 16,              // 16
        //% block="Barcode recognition"
        ALGORITHM_BARCODE_RECOGNITION = 17,        // 17
        //% block="QR code recognition"
        ALGORITHM_QRCODE_RECOGNITION = 18,       // 18
    }

     export enum Algorithm_learnObjectInBox {
        //% blockHidden=true
        ALGORITHM_ANY = 0,                      // 0
        //% block="Face recognition"
        ALGORITHM_FACE_RECOGNITION = 1,         // 1
        //% block="Object recognition"
        ALGORITHM_OBJECT_RECOGNITION = 2,       // 2
        //% block="Object tracking"
        ALGORITHM_OBJECT_TRACKING = 3,          // 3
        //% block="Color recognition"
        ALGORITHM_COLOR_RECOGNITION = 4,        // 4
        //% block="Instance Segmentation"
        ALGORITHM_SEGMENT = 7,                 // 7
        //% block="Hand recognition"
        ALGORITHM_HAND_RECOGNITION = 8,        // 8
        //% block="Pose recognition"
        ALGORITHM_POSE_RECOGNITION = 9,        // 9
        //% block="License plate recognition"
        ALGORITHM_LICENSE_RECOGNITION = 10,      // 10
        //% block="OCR recognition"
        ALGORITHM_OCR_RECOGNITION = 11,          // 11


        //% block="Gaze recognition"
        ALGORITHM_GAZE_RECOGNITION = 14,            // 14
        //% block="Face Orientation"
        ALGORITHM_FACE_ORIENTATION = 15,             // 15
         //% block="Tag recognition"
        ALGORITHM_TAG_RECOGNITION = 16,              // 16
        //% block="Barcode recognition"
        ALGORITHM_BARCODE_RECOGNITION = 17,        // 17
        //% block="QR code recognition"
        ALGORITHM_QRCODE_RECOGNITION = 18,       // 18
    }

        export enum Algorithm {
        //% blockHidden=true
        ALGORITHM_ANY = 0,                      // 0
        //% block="Face recognition"
        ALGORITHM_FACE_RECOGNITION = 1,         // 1
        //% block="Object recognition"
        ALGORITHM_OBJECT_RECOGNITION = 2,       // 2
        //% block="Object tracking"
        ALGORITHM_OBJECT_TRACKING = 3,          // 3
        //% block="Color recognition"
        ALGORITHM_COLOR_RECOGNITION = 4,        // 4
        //% block="Object classification"
        ALGORITHM_OBJECT_CLASSIFICATION = 5,   // 5
        //% block="Self-learning classification"
        ALGORITHM_SELF_LEARNING_CLASSIFICATION = 6, // 6
        //% block="Instance Segmentation"
        ALGORITHM_SEGMENT = 7,                 // 7
        //% block="Hand recognition"
        ALGORITHM_HAND_RECOGNITION = 8,        // 8
        //% block="Pose recognition"
        ALGORITHM_POSE_RECOGNITION = 9,        // 9
        //% block="License plate recognition"
        ALGORITHM_LICENSE_RECOGNITION = 10,      // 10
        //% block="OCR recognition"
        ALGORITHM_OCR_RECOGNITION = 11,          // 11
        //% block="Line tracking"
        ALGORITHM_LINE_TRACKING = 12,            // 12
        //% block="Face Emotion Recognition"
        ALGORITHM_EMOTION_RECOGNITION = 13,     // 13

        //% block="Gaze recognition"
        ALGORITHM_GAZE_RECOGNITION = 14,            // 14
        //% block="Face Orientation"
        ALGORITHM_FACE_ORIENTATION = 15,             // 15
            //% block="Tag recognition"
        ALGORITHM_TAG_RECOGNITION = 16,              // 16
        //% block="Barcode recognition"
        ALGORITHM_BARCODE_RECOGNITION = 17,        // 17
        //% block="QR code recognition"
        ALGORITHM_QRCODE_RECOGNITION = 18,       // 18
        //% block="Fall detection property"
        ALGORITHM_FALLDOWN_RECOGNITION = 19,        // 19

        //% blockHidden=true
        ALGORITHM_CUSTOM0 = 20,                 // 20
        //% blockHidden=true
        ALGORITHM_CUSTOM1 = 21,                 // 21
        //% blockHidden=true
        ALGORITHM_CUSTOM2 = 22,                 // 22
        //% blockHidden=true
        ALGORITHM_BUILTIN_COUNT = 23,           // 23
        //% blockHidden=true
        ALGORITHM_CUSTOM_BEGIN = 128,           // 128
    }

    export enum BaseProperty {
        //% block="Name"
        Name=1,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height
    }
    export enum BasePropertyID {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height
    }

    export enum BasePropertyContent {
        //% block="Name"
        Name=1,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content
    }

    export enum BasePropertyContentID {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content
    }

    // Helper export function: Convert Algorithm enum to algorithm ID
    export function algorithmToID(alg: Algorithm): number {
        return alg as number;
    }

    export function getBasePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyID.ID: return res.ID;
            case BasePropertyID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyID.XCenter: return res.xCenter;
            case BasePropertyID.YCenter: return res.yCenter;
            case BasePropertyID.Width: return res.width;
            case BasePropertyID.Height: return res.height;
            default: return 0;
        }
    }


    // ====================================================== Object Recognition ===============================================

    /** Get one-time object recognition result and cache it */
    //% block="get object recognition result"
    //% weight=188
    //% subcategory="Object Recognition"
    export function getResultObjectRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Whether object detected */
    //% block="object detected?"
    //% weight=187
    //% subcategory="Object Recognition"
    export function availableObjectRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Object property nearest to center */
    //% block="object nearest to center %alg"
    //% weight=186
    //% subcategory="Object Recognition"
    export function getCachedCenterObjectResult(alg: BasePropertyID): number {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION);
        return getBasePropertyValue(r, alg);
    }

    /** Total number of detected objects */
    //% block="number of detected objects"
    //% weight=185
    //% subcategory="Object Recognition"
    export function getCachedResultNumObject(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Property of Nth object */
    //% block="object %index %alg"
    //% weight=184
    //% index.min=1 index.defl=1
    //% subcategory="Object Recognition"
    export function getCachedResultObjectProperty(index: number, alg: BasePropertyID): number {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION, index - 1);
        return getBasePropertyValue(r, alg);
    }

    /** Total number of learned object IDs */
    //% block="number of learned object IDs"
    //% weight=183
    //% subcategory="Object Recognition"
    export function getNumLearnedObjectIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Whether object with specified ID exists */
    //% block="object ID %index exists?"
    //% weight=182
    //% index.min=1 index.defl=1
    //% subcategory="Object Recognition"
    export function objectIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION, index);
        return r != null;
    }

    /** Number of objects with specified ID */
    //% block="number of objects with ID %index"
    //% weight=181
    //% index.min=1 index.defl=1
    //% subcategory="Object Recognition"
    export function getNumObjectByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION, index);
    }

    /** Property of object with specified ID */
    //% block="object ID %index %alg"
    //% weight=180
    //% index.min=1 index.defl=1
    //% subcategory="Object Recognition"
    export function getObjectPropertyByID(index: number, alg: BaseProperty): number {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION, index);
        return getBasePropertyValue(r, alg);
    }

    /** Property of Nth object with specified ID */
    //% block="object ID %id nth %n %alg"
    //% weight=179
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Object Recognition"
    export function getObjectPropertyByIDNth(id: number, n: number, alg: BaseProperty): number {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_OBJECT_RECOGNITION, id, n - 1);
        return getBasePropertyValue(r, alg);
    }

    // =============================================================== Object Tracking ========================================
    /** Request one-time object tracking data and store in result */
    //% block="get object tracking result"
    //% weight=178
    //% subcategory="Object Tracking"
    export function getResultObjectTracking(): void {
        getResultInternal(Algorithm.ALGORITHM_OBJECT_TRACKING);
    }

    /** Whether tracked object detected */
    //% block="tracked object detected?"
    //% weight=177
    //% subcategory="Object Tracking"
    export function availableObjectTracking(): boolean {
        return availableInternal(Algorithm.ALGORITHM_OBJECT_TRACKING);
    }

    /** Property of tracked object */
    //% block="tracked object %alg"
    //% weight=176
    //% subcategory="Object Tracking"
    export function getCachedObjectTrackingResult(alg: BasePropertyID): number {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_OBJECT_TRACKING);
        return getBasePropertyValue(r, alg);
    }

    // ================= Color Recognition =================
    export function getColorPropertyValue(result: ResultVariant, prop: number): number {
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time color recognition result and cache it */
    //% block="get color recognition result"
    //% weight=175
    //% subcategory="Color Recognition"
    export function getResultColorRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION);
    }

    /** Whether color block detected */
    //% block="color block detected?"
    //% weight=174
    //% subcategory="Color Recognition"
    export function availableColorRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION);
    }

    /** Color block property nearest to center */
    //% block="color block nearest to center %alg"
    //% weight=173
    //% subcategory="Color Recognition"
    export function getCachedCenterColorResult(alg: BasePropertyID): number {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION);
        return getColorPropertyValue(r, alg);
    }

    /** Total number of detected color blocks */
    //% block="number of detected color blocks"
    //% weight=172
    //% subcategory="Color Recognition"
    export function getCachedResultNumColor(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION);
    }

    /** Property of Nth color block */
    //% block="color block %index %alg"
    //% weight=171
    //% index.min=1 index.defl=1
    //% subcategory="Color Recognition"
    export function getCachedResultColorProperty(index: number, alg: BasePropertyID): number {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION, index - 1);
        return getColorPropertyValue(r, alg);
    }

    /** Total number of learned color block IDs */
    //% block="number of learned color block IDs"
    //% weight=170
    //% subcategory="Color Recognition"
    export function getNumLearnedColorIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION);
    }

    /** Whether color block with specified ID exists */
    //% block="color block ID %index exists?"
    //% weight=169
    //% index.min=1 index.defl=1
    //% subcategory="Color Recognition"
    export function colorIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION, index);
        return r != null;
    }

    /** Number of color blocks with specified ID */
    //% block="number of color blocks with ID %index"
    //% weight=168
    //% index.min=1 index.defl=1
    //% subcategory="Color Recognition"
    export function getNumColorByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION, index);
    }

    /** Property of color block with specified ID */
    //% block="color block ID %index %alg"
    //% weight=167
    //% index.min=1 index.defl=1
    //% subcategory="Color Recognition"
    export function getColorPropertyByID(index: number, alg: BaseProperty): number {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION, index);
        return getColorPropertyValue(r, alg);
    }

    /** Property of Nth color block with specified ID */
    //% block="color block ID %id nth %n %alg"
    //% weight=166
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Color Recognition"
    export function getColorPropertyByIDNth(id: number, n: number, alg: BaseProperty): number {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_COLOR_RECOGNITION, id, n - 1);
        return getColorPropertyValue(r, alg);
    }


    // ============================================== Object Classification============================================================
    // Object classification properties (only ID and Name)
    export enum ObjectClassificationProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
    }

    function getObjectClassificationPropertyValue(result: ResultVariant, prop: ObjectClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case ObjectClassificationProperty.ID: return res.classID;
            case ObjectClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time object classification data and store in result */
    //% block="get object classification result"
    //% weight=4
    //% subcategory="Object Classification"
    export function getResultObjectClassification(): void {
        getResultInternal(Algorithm.ALGORITHM_OBJECT_CLASSIFICATION);
    }
    /** Whether classified object detected */
    //% block="classified object detected?"
    //% weight=3
    //% subcategory="Object Classification"
    export function availableObjectClassification(): boolean {
        return availableInternal(Algorithm.ALGORITHM_OBJECT_CLASSIFICATION);
    }

    /** Total number of detected classified objects */
    //% block="number of detected classified objects"
    //% weight=2
    //% subcategory="Object Classification"
    export function getCachedResultNumObjectClassification(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_OBJECT_CLASSIFICATION);
    }

    /** Property of Nth classified object */
    //% block="classified object %num %alg"
    //% weight=1
    //% num.min=1 num.defl=1
    //% subcategory="Object Classification"
    export function getCachedObjectClassificationResult(num: number, alg: ObjectClassificationProperty): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_OBJECT_CLASSIFICATION, num - 1);
        return getObjectClassificationPropertyValue(r, alg);
    }



    // ==================================================== Self-Learning Classification ========================================
    // Self-learning classification properties (only ID and Name)
    export enum SelfLearningClassificationProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
    }

    export function getSelfLearningClassificationPropertyValue(result: ResultVariant, prop: SelfLearningClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case SelfLearningClassificationProperty.ID: return res.ID;
            case SelfLearningClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time self-learning classification data and store in result */
    //% block="get self-learning classification result"
    //% weight=162
    //% subcategory="Self-learning Classification"
    export function getResultSelfLearningClassification(): void {
        getResultInternal(Algorithm.ALGORITHM_SELF_LEARNING_CLASSIFICATION);
    }

    /** Whether self-learning classification detected */
    //% block="self-learning classification detected?"
    //% weight=161
    //% subcategory="Self-learning Classification"
    export function availableSelfLearningClassification(): boolean {
        return availableInternal(Algorithm.ALGORITHM_SELF_LEARNING_CLASSIFICATION);
    }

    /** Property of self-learning classification */
    //% block="self-learning classification %alg"
    //% weight=160
    //% subcategory="Self-learning Classification"
    export function getCachedSelfLearningClassificationResult(alg: SelfLearningClassificationProperty): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_SELF_LEARNING_CLASSIFICATION);
        return getSelfLearningClassificationPropertyValue(r, alg);
    }

    // =================================================== Instance Segmentation ===================================================
    export function getInstancePropertyValue(result: ResultVariant, prop: BasePropertyID): number {
        return getBasePropertyValue(result, prop as any);
    }

    export function getInstancePropertyValueID(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time instance segmentation result and cache it */
    //% block="get instance segmentation result"
    //% weight=159
    //% subcategory="Instance Segmentation"
    export function getResultInstanceRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_SEGMENT);
    }

    /** Whether instance detected */
    //% block="instance detected?"
    //% weight=158
    //% subcategory="Instance Segmentation"
    export function availableInstanceRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_SEGMENT);
    }

    /** Instance property nearest to center */
    //% block="instance nearest to center %alg"
    //% weight=157
    //% subcategory="Instance Segmentation"
    export function getCachedCenterInstanceResult(alg: BasePropertyID): number {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_SEGMENT);
        return getInstancePropertyValue(r, alg);
    }

    /** Total number of detected instances */
    //% block="number of detected instances"
    //% weight=156
    //% subcategory="Instance Segmentation"
    export function getCachedResultNumInstance(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_SEGMENT);
    }

    /** Property of Nth instance */
    //% block="instance %index %alg"
    //% weight=155
    //% index.min=1 index.defl=1
    //% subcategory="Instance Segmentation"
    export function getCachedResultInstanceProperty(index: number, alg: BasePropertyID): number {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_SEGMENT, index - 1);
        return getInstancePropertyValue(r, alg);
    }

    /** Total number of learned instance IDs */
    //% block="number of learned instance IDs"
    //% weight=154
    //% subcategory="Instance Segmentation"
    export function getNumLearnedInstanceIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_SEGMENT);
    }

    /** Whether instance with specified ID exists */
    //% block="instance ID %index exists?"
    //% weight=153
    //% index.min=1 index.defl=1
    //% subcategory="Instance Segmentation"
    export function instanceIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_SEGMENT, index);
        return r != null;
    }

    /** Number of instances with specified ID */
    //% block="number of instances with ID %index"
    //% weight=152
    //% index.min=1 index.defl=1
    //% subcategory="Instance Segmentation"
    export function getNumInstanceByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_SEGMENT, index);
    }

    /** Property of instance with specified ID */
    //% block="instance ID %index %alg"
    //% weight=151
    //% index.min=1 index.defl=1
    //% subcategory="Instance Segmentation"
    export function getInstancePropertyByID(index: number, alg: BaseProperty): number {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_SEGMENT, index);
        return getInstancePropertyValueID(r, alg);
    }

    /** Property of Nth instance with specified ID */
    //% block="instance ID %id nth %n %alg"
    //% weight=150
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Instance Segmentation"
    export function getInstancePropertyByIDNth(id: number, n: number, alg: BaseProperty): number {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_SEGMENT, id, n - 1);
        return getInstancePropertyValueID(r, alg);
    }

    // ================================== Hand Recognition ==================================
    function getGesturePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time Hand Recognition result and cache it */
    //% block="get Hand Recognition result"
    //% weight=149
    //% subcategory="Hand Recognition"
    export function getResultGestureRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_HAND_RECOGNITION);
    }

    /** Whether gesture detected */
    //% block="gesture detected?"
    //% weight=148
    //% subcategory="Hand Recognition"
    export function availableGestureRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_HAND_RECOGNITION);
    }

    /** Gesture property nearest to center */
    //% block="gesture nearest to center %alg"
    //% weight=147
    //% subcategory="Hand Recognition"
    export function getCachedCenterGestureResult(alg: BasePropertyID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_HAND_RECOGNITION);
        return getGesturePropertyValue(r, alg);
    }

    /** Total number of detected gestures */
    //% block="number of detected gestures"
    //% weight=146
    //% subcategory="Hand Recognition"
    export function getCachedResultNumGesture(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_HAND_RECOGNITION);
    }

    /** Property of Nth gesture */
    //% block="gesture %index %alg"
    //% weight=145
    //% index.min=1 index.defl=1
    //% subcategory="Hand Recognition"
    export function getCachedResultGestureProperty(index: number, alg: BasePropertyID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_HAND_RECOGNITION, index - 1);
        return getGesturePropertyValue(r, alg);
    }

    /** Total number of learned gesture IDs */
    //% block="number of learned gesture IDs"
    //% weight=144
    //% subcategory="Hand Recognition"
    export function getNumLearnedGestureIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_HAND_RECOGNITION);
    }

    /** Whether gesture with specified ID exists */
    //% block="gesture ID %index exists?"
    //% weight=143
    //% index.min=1 index.defl=1
    //% subcategory="Hand Recognition"
    export function gestureIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_HAND_RECOGNITION, index);
        return r != null;
    }

    /** Number of gestures with specified ID */
    //% block="number of gestures with ID %index"
    //% weight=142
    //% index.min=1 index.defl=1
    //% subcategory="Hand Recognition"
    export function getNumGestureByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_HAND_RECOGNITION, index);
    }

    /** Property of gesture with specified ID */
    //% block="gesture ID %index %alg"
    //% weight=141
    //% index.min=1 index.defl=1
    //% subcategory="Hand Recognition"
    export function getGesturePropertyByID(index: number, alg: BaseProperty): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_HAND_RECOGNITION, index);
        return getGesturePropertyValue(r, alg);
    }

    /** Property of Nth gesture with specified ID */
    //% block="gesture ID %id nth %n %alg"
    //% weight=140
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Hand Recognition"
    export function getGesturePropertyByIDNth(id: number, n: number, alg: BaseProperty): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_HAND_RECOGNITION, id, n - 1);
        return getGesturePropertyValue(r, alg);
    }

    // ================================================================ Pose Recognition (Human Pose) ========================
    function getPosePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        return getBasePropertyValue(result, prop as any);
    }

    /** Get one-time pose recognition result and cache it */
    //% block="get pose recognition result"
    //% weight=139
    //% subcategory="Pose Recognition"
    export function getResultPoseRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_POSE_RECOGNITION);
    }

    /** Whether pose detected */
    //% block="pose detected?"
    //% weight=138
    //% subcategory="Pose Recognition"
    export function availablePoseRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_POSE_RECOGNITION);
    }

    /** Pose property nearest to center */
    //% block="pose nearest to center %alg"
    //% weight=137
    //% subcategory="Pose Recognition"
    export function getCachedCenterPoseResult(alg: BasePropertyID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_POSE_RECOGNITION);
        return getPosePropertyValue(r, alg);
    }

    /** Total number of detected poses */
    //% block="number of detected poses"
    //% weight=136
    //% subcategory="Pose Recognition"
    export function getCachedResultNumPose(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_POSE_RECOGNITION);
    }

    /** Property of Nth pose */
    //% block="pose %index %alg"
    //% weight=135
    //% index.min=1 index.defl=1
    //% subcategory="Pose Recognition"
    export function getCachedResultPoseProperty(index: number, alg: BasePropertyID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_POSE_RECOGNITION, index - 1);
        return getPosePropertyValue(r, alg);
    }

    /** Total number of learned pose IDs */
    //% block="number of learned pose IDs"
    //% weight=134
    //% subcategory="Pose Recognition"
    export function getNumLearnedPoseIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_POSE_RECOGNITION);
    }

    /** Whether pose with specified ID exists */
    //% block="pose ID %index exists?"
    //% weight=133
    //% index.min=1 index.defl=1
    //% subcategory="Pose Recognition"
    export function poseIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_POSE_RECOGNITION, index);
        return r != null;
    }

    /** Number of poses with specified ID */
    //% block="number of poses with ID %index"
    //% weight=132
    //% index.min=1 index.defl=1
    //% subcategory="Pose Recognition"
    export function getNumPoseByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_POSE_RECOGNITION, index);
    }

    /** Property of pose with specified ID */
    //% block="pose ID %index %alg"
    //% weight=131
    //% index.min=1 index.defl=1
    //% subcategory="Pose Recognition"
    export function getPosePropertyByID(index: number, alg: BaseProperty): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_POSE_RECOGNITION, index);
        return getPosePropertyValue(r, alg);
    }

    /** Property of Nth pose with specified ID */
    //% block="pose ID %id nth %n %alg"
    //% weight=130
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Pose Recognition"
    export function getPosePropertyByIDNth(id: number, n: number, alg: BaseProperty): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_POSE_RECOGNITION, id, n - 1);
        return getPosePropertyValue(r, alg);
    }
}