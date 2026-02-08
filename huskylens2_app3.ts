/** 
 * @file huskylens2_app3.ts
 * @brief DFRobot's huskylens 2 makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_huskylens2)
 * @copyright    [DFRobot](http://www.dfrobot.com), 2026
 * @license The MIT License (MIT)
 * @author [email](rong.li@dfrobot.com)
 * @date  2026-2-2
*/

// Face Orientation Detection Properties
enum FaceOrientationProperty {
    //% block="Id"
    Id = 0,
    //% block="name"
    Name,
    //% block="roll angle"
    Roll,
    //% block="yaw angle"
    Yaw,
    //% block="pitch angle"
    Pitch,

}
// Face Orientation Detection Properties
enum FaceOrientationPropertyId {
    //% block="name"
    Name = 1,
    //% block="roll angle"
    Roll,
    //% block="yaw angle"
    Yaw,
    //% block="pitch angle"
    Pitch,
}
// gaze direction detection Properties (Include Id)
enum EyeGazeProperty {
    //% block="Id"
    Id = 0,
    //% block="name"
    Name,
    //% block="projected angle"
    Angle,
    //% block="projected length"
    Length,
    //% block="pitch angle"
    Pitch,
    //% block="yaw angle"
    Yaw
}

// gaze direction detection Properties (excluding Id)
enum EyeGazePropertyId {
    //% block="name"
    Name = 1,
    //% block="projected angle"
    Angle,
    //% block="projected length"
    Length,
    //% block="pitch angle"
    Pitch,
    //% block="yaw angle"
    Yaw
}


/**
 * HuskyLens 2 
 */
//% weight=100 color=#0fbc11 icon="\uf083" block="huskylens2"
//% groups='["communication","algorithm switch"]'
namespace huskylens2 {

    // ================================================== fall detection ========================================
    /**
     * Get fall detection Property Value (Include Id)
     * @param result The result object to read from.
     * @param property The fall-detection property to retrieve.
     */
    function getFallDetectionPropertyValue(result: ResultVariant, property: BasePropertyId): any {
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


    /**
     * Request fall detection data and store in results
     */
    //% block="request fall detection data and store in results"
    //% weight=149
    //% subcategory="fall detection"
    export function requestFallDetectionData(): void {
        getResultInternal(Algorithm.AlgorithmFallDownRecognition);
    }

    /**
     * Is fall detected?
     */
    //% block="is fall detected?"
    //% weight=148
    //% subcategory="fall detection"
    export function fallDetected(): boolean {
        return availableInternal(Algorithm.AlgorithmFallDownRecognition);
    }

    /**
     * Closest fall detection property
     * @param property The fall-detection property to retrieve.
     */
    //% block="closest fall detection %property"
    //% weight=147
    //% subcategory="fall detection"
    export function nearestFallDetection(property: BasePropertyId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmFallDownRecognition);
        return getFallDetectionPropertyValue(r, property);
    }

    /**
     * Total number of fall detections
     */
    //% block="total number of fall detections"
    //% weight=146
    //% subcategory="fall detection"
    export function totalFallDetections(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmFallDownRecognition);
    }

    /**
     * property of the [index]th fall detection
     * @param index The index (1-based).
     * @param property The fall-detection property to retrieve.
     */

    //% block=" the %index th fall detection %property"
    //% weight=145
    //% index.min=1 index.defl=1
    //% subcategory="fall detection"
    export function fallDetectionProperty(index: number, property: BasePropertyId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmFallDownRecognition, index - 1);
        return getFallDetectionPropertyValue(r, property);
    }

    // ================================ Face Orientation Detection Related Enums ==================================================

    // ================================= Face Orientation Detection Property Get Function ===========================================


    /**
     * Get Face Orientation Detection Property Value (Include Id)
     * @param result The result object to read from.
     * @param property The face-orientation property to retrieve.
     */
    function getFaceOrientationPropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        const p = property | 0; // Ensure it's an integer
        switch (property) {
            case FaceOrientationProperty.Id: return res.Id || 0;
            case FaceOrientationProperty.Name: return res.name || "";
            case FaceOrientationProperty.Yaw: return res.yaw || 0;
            case FaceOrientationProperty.Pitch: return res.pitch || 0;
            case FaceOrientationProperty.Roll: return res.roll || 0;
            default: return 0;
        }
    }
    /**
     * Request face orientation data and store in results
     */
    //% block="request face orientation data and store in results"
    //% weight=139
    //% subcategory="faceorientation recognition"
    export function requestFaceOrientationData(): void {
        getResultInternal(Algorithm.AlgorithmFaceOrientation);
    }

    /**
     * Is face orientation detected?
     */
    //% block="is face orientation detected?"
    //% weight=138
    //% subcategory="faceorientation recognition"
    export function faceOrientationDetected(): boolean {
        return availableInternal(Algorithm.AlgorithmFaceOrientation);
    }

    /**
     * Closest face orientation property
     * @param property The face-orientation property to retrieve.
     */
    //% block="closest face orientation %property"
    //% weight=137
    //% subcategory="faceorientation recognition"
    export function nearestFaceOrientation(property: FaceOrientationProperty): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmFaceOrientation);
        return getFaceOrientationPropertyValue(r, property);
    }

    /**
     * Total number of face orientations detected
     */
    //% block="total number of face orientations detected"
    //% weight=136
    //% subcategory="faceorientation recognition"
    export function totalFaceOrientations(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmFaceOrientation);
    }

    /**
     * Total number of learned face orientation Ids
     */
    //% block="total number of learned face orientation Ids"
    //% weight=135
    //% subcategory="faceorientation recognition"
    export function totalLearnedFaceOrientations(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmFaceOrientation);
    }

    /**
     * property of the [index]th face orientation
     * @param index The index (1-based).
     * @param property The face-orientation property to retrieve.
     */
    //% block="face orientation Id %index %property"
    //% weight=134
    //% index.min=1 index.defl=1
    //% subcategory="faceorientation recognition"
    export function faceOrientationProperty(index: number, property: FaceOrientationProperty): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmFaceOrientation, index - 1);
        return getFaceOrientationPropertyValue(r, property);
    }

    /**
     * Does face orientation with Id %Id exist?
     * @param Id The face-orientation Id.
     */
    //% block="does face orientation with Id %Id exist?"
    //% weight=133
    //% Id.min=1 Id.defl=1
    //% subcategory="faceorientation recognition"
    export function faceOrientationIdExists(Id: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmFaceOrientation, Id);
        return r != null;
    }

    /**
     * Total number of face orientations with Id %Id
     * @param Id The face-orientation Id.
     */
    //% block="total number of face orientations with Id %Id"
    //% weight=132
    //% Id.min=1 Id.defl=1
    //% subcategory="faceorientation recognition"
    export function totalFaceOrientationsWithId(Id: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmFaceOrientation, Id);
    }

    /**
     * property of face orientation with Id 
     * @param Id The face-orientation Id.
     * @param property The face-orientation property to retrieve. (excluding Id)
     */
    //% block="Id %Id face orientation %property"
    //% weight=131
    //% Id.min=1 Id.defl=1
    //% subcategory="faceorientation recognition"
    export function faceOrientationWithId(Id: number, property: FaceOrientationPropertyId): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmFaceOrientation, Id);
        return getFaceOrientationPropertyValue(r, property);
    }

    /**
     * property of the [index]th face orientation with Id 
     * @param Id The face-orientation Id.
     * @param index The index (1-based).
     * @param property The face-orientation property to retrieve. (excluding Id)
     */
    //% block="Id %Id No. %index face orientation %property "
    //% weight=130
    //% Id.min=1 Id.defl=1
    //% index.min=1 index.defl=1

    //% subcategory="faceorientation recognition"
    export function faceOrientationWithIdProperty(Id: number, index: number, property: FaceOrientationPropertyId): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmFaceOrientation, Id, index - 1);
        return getFaceOrientationPropertyValue(r, property);
    }

    // ==================================== gaze direction detection Related Enums ===============================

    /**
     * Get gaze direction detection Property Value (Include Id)
     * @param result The result object to read from.
     * @param property The eye-gaze property to retrieve.
     * 
     */
    function getEyeGazePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case EyeGazeProperty.Id: return res.Id;
            case EyeGazeProperty.Name: return res.name || "";
            case EyeGazeProperty.Angle: return res.angle;        // Projected angle
            case EyeGazeProperty.Length: return res.length;      // Projected length
            case EyeGazeProperty.Pitch: return res.pitch;        // Pitch angle
            case EyeGazeProperty.Yaw: return res.yaw;           // Yaw angle
            default: return 0;
        }
    }

    /**
     * Request gaze direction data and store in results
     */
    //% block="request gaze direction data and store in results"
    //% weight=129
    //% subcategory="gaze direction detection"
    export function requestEyeGazeData(): void {
        getResultInternal(Algorithm.AlgorithmGazeRecognition);
    }

    /**
     * Is gaze direction detected?
     */
    //% block="is gaze direction detected?"
    //% weight=128
    //% subcategory="gaze direction detection"
    export function eyeGazeDetected(): boolean {
        return availableInternal(Algorithm.AlgorithmGazeRecognition);
    }

    /**
     * Closest gaze direction property
     * @param property The eye-gaze property to retrieve.
     */
    //% block="closest gaze direction %property"
    //% weight=127
    //% subcategory="gaze direction detection"
    export function nearestEyeGaze(property: EyeGazeProperty): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmGazeRecognition);
        return getEyeGazePropertyValue(r, property);
    }

    /**
     * Total number of gaze directions detected
     */
    //% block="total number of gaze directions detected"
    //% weight=126
    //% subcategory="gaze direction detection"
    export function totalEyeGazes(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmGazeRecognition);
    }

    /**
     * Total number of learned gaze direction Ids
     */
    //% block="total number of learned gaze direction Ids"
    //% weight=125
    //% subcategory="gaze direction detection"
    export function totalLearnedEyeGazes(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmGazeRecognition);
    }

    /**
     * property of the [index]th gaze direction
     * @param index The index (1-based).
     * @param property The eye-gaze property to retrieve.
     */
    //% block="gaze direction Id %index %property"
    //% weight=124
    //% index.min=1 index.defl=1
    //% subcategory="gaze direction detection"
    export function eyeGazeProperty(index: number, property: EyeGazeProperty): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmGazeRecognition, index - 1);
        return getEyeGazePropertyValue(r, property);
    }

    /**
     * Does gaze direction with Id %Id exist?
     * @param Id The eye-gaze Id.
     */
    //% block="does gaze direction with Id %Id exist?"
    //% weight=123
    //% Id.min=1 Id.defl=1
    //% subcategory="gaze direction detection"
    export function gazeIdExists(Id: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmGazeRecognition, Id);
        return r != null;
    }

    /**
     * Total number of gaze directions with Id %Id
     * @param Id The eye-gaze Id.
     */
    //% block="total number of gaze directions with Id %Id"
    //% weight=122
    //% Id.min=1 Id.defl=1
    //% subcategory="gaze direction detection"
    export function totalEyeGazesWithId(Id: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmGazeRecognition, Id);
    }

    /**
     * property of gaze direction with Id 
     * @param Id The eye-gaze Id.
     * @param property The eye-gaze property to retrieve. (excluding Id)
     */
    //% block="Id %Id gaze direction %property "
    //% weight=121
    //% Id.min=1 Id.defl=1
    //% subcategory="gaze direction detection"
    export function gazeWithId(Id: number, property: EyeGazePropertyId): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmGazeRecognition, Id);
        return getEyeGazePropertyValue(r, property);
    }

    /**
     * property of the [index]th gaze direction with Id 
     * @param Id The eye-gaze Id.
     * @param index The index (1-based).
     * @param property The eye-gaze property to retrieve. (excluding Id)
     */
    //% block="Id %Id No. %index gaze direction %property"
    //% weight=120
    //% Id.min=1 Id.defl=1
    //% index.min=1 index.defl=1
    //% subcategory="gaze direction detection"
    export function gazeWithIdProperty(Id: number, index: number, property: EyeGazePropertyId): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmGazeRecognition, Id, index - 1);
        return getEyeGazePropertyValue(r, property);
    }


    // ==================================== Self-trained model related enums ========================================

    /**
     * Switch to a custom-trained model by specifying the model Id.
     * @param num Model Id (range: 128-255, default: 128)
     */
    //% block="switch to custom-trained model, model Id%num"
    //% weight=119
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    export function selfTrainedModelSwitchAlgorithm(num: number): void {
        // Switch to self-trained model
        switchAlgorithmInternal(num);
        basic.pause(5000); // Wait 5 seconds for model loading
    }

    /**
     * Request data from the specified model Id and save it to the results cache.
     * @param num Model Id (range: 128-255, default: 128)
     */
    //% block="model Id%num request data and save to results"
    //% weight=118
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    export function requestData(num: number): void {
        // Request data and save to result cache
        getResultInternal(num);
    }

    /**
     * Check if a target is detected by the specified model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @returns True if a target is detected, false otherwise.
     */
    //% block="model Id%num target detected?"
    //% weight=117
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    export function detected(num: number): boolean {
        return availableInternal(num);
    }

    /**
     * Get the property of the target closest to the center for the specified model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param property Property to retrieve (e.g., Id, Name, XCenter, etc.)
     * @returns The requested property value.
     */
    //% block="model Id%num target closest to center%property"
    //% weight=116
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% property.defl=BasePropertyId.Id
    export function nearest(num: number, property: BasePropertyId): any {
        const res = cachedCenterResultInternal(num);
        const result = res as Result;
        if (!result) return 0;
        
        switch (property) {
            case BasePropertyId.Id: return result.Id || 0;
            case BasePropertyId.Name:return result.name|| "";
            case BasePropertyId.XCenter:return result.xCenter|| 0;
            case BasePropertyId.YCenter:return result.yCenter|| 0;
            case BasePropertyId.Width:return result.width|| 0;
            case BasePropertyId.Height: return result.height|| 0;

            default:
                return 0;
        }
    }

    /**
     * Get the total number of detected targets for the specified model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @returns Total number of detected targets.
     */
    //% block="model Id%num total number of detected targets"
    //% weight=115
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    export function total(num: number): number {
        return cachedResultNumInternal(num);
    }

    /**
     * Get the total number of learned target Ids for the specified model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @returns Total number of learned target Ids.
     */
    //% block="model Id%num total number of learned target Ids"
    //% weight=114
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    export function totalLearned(num: number): number {
        return cachedResultMaxIdInternal(num);
    }

    /**
     * Get the property of the Nth target for the specified model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param index The target index (1-based, range: 1-6, default: 1).
     * @param property Property to retrieve (e.g., Id, Name, XCenter, etc.)
     * @returns The requested property value.
     */
    //% block="model Id %num No. %index target %property"
    //% weight=113
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% index.min=1 index.max=6 index.defl=1
    //% property.defl=BasePropertyId.Id
    export function targetProperty(num: number, index: number, property: BasePropertyId): any {
        const res = cachedResultByIndexInternal(num, index - 1);
        const result = res as Result;
        if (!result) {
            if (property === BasePropertyId.Name ) {
                return "";
            }
            return 0;
        }
        
        switch (property) {
            case BasePropertyId.Id: return result.Id || 0;
            case BasePropertyId.Name:return result.name || "";
            case BasePropertyId.XCenter:return result.xCenter|| 0;
            case BasePropertyId.YCenter:return result.yCenter|| 0;
            case BasePropertyId.Width:return result.width|| 0;
            case BasePropertyId.Height:return result.height|| 0;
            default:
                return 0;
        }
    }

    /**
     * Check if a target with the specified Id exists for the given model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param Id Target Id (range: 1-100, default: 1)
     * @returns True if the target exists, false otherwise.
     */
    //% block="model Id%num target Id%Id exists?"
    //% weight=112
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% Id.min=1 Id.max=100 Id.defl=1
    export function IdExists(num: number, Id: number): boolean {
        return cachedResultByIdInternal(num, Id) !== null;
    }

    /**
     * Get the total number of targets with the specified Id for the given model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param Id Target Id (range: 1-100, default: 1)
     * @returns Total number of targets with the specified Id.
     */
    //% block="model Id%num total number of targets with Id%Id"
    //% weight=111
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% Id.min=1 Id.max=100 Id.defl=1
    export function totalWithId(num: number, Id: number): number {
        return cachedResultNumByIdInternal(num, Id);
    }

    /**
     * Get the property of a target with the specified Id for the given model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param Id Target Id (range: 1-100, default: 1)
     * @param property Property to retrieve (e.g., Name, XCenter, etc.)
     * @returns The requested property value.
     */
    //% block="model Id%num target with Id%Id%property"
    //% weight=110
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% Id.min=1 Id.max=100 Id.defl=1
    //% property.defl=BaseProperty.Name
    export function withId(num: number, Id: number, property: BaseProperty): any {
        const res = cachedResultByIdInternal(num, Id);
        const result = res as Result;
        if (!result) {
            if (property === BaseProperty.Name ) {
                return "";
            }
            return 0;
        }
        
        switch (property) {
            case BaseProperty.Name: return result.name|| "";
            case BaseProperty.XCenter:return result.xCenter|| 0;
            case BaseProperty.YCenter:return result.yCenter|| 0;
            case BaseProperty.Width:return result.width|| 0;
            case BaseProperty.Height:return result.height|| 0;
            default:return 0;
        }
    }

    /**
     * Get the property of the Nth target with the specified Id for the given model Id.
     * @param num Model Id (range: 128-255, default: 128)
     * @param Id Target Id (range: 1-100, default: 1)
     * @param index Index of the target (1-based, range: 1-6, default: 1)
     * @param property Property to retrieve (e.g., Name, XCenter, etc.)
     * @returns The requested property value.
     */
    //% block="model Id %num Id %Id the %index target of %property""
    //% weight=109
    //% subcategory="self training"
    //% num.min=128 num.max=255 num.defl=128
    //% Id.min=1 Id.max=100 Id.defl=1
    //% index.min=1 index.max=6 index.defl=1
    //% property.defl=BaseProperty.Name
    export function withIdProperty(num: number, Id: number, index: number, property: BaseProperty): any {
        const res = cachedIndexResultByIdInternal(num, Id, index - 1);
        const result = res as Result;
       
        if (!result) return 0;
        
        switch (property) {
            case BaseProperty.Name: return result.name|| "";
            case BaseProperty.XCenter:return result.xCenter;
            case BaseProperty.YCenter:return result.yCenter;
            case BaseProperty.Width:return result.width;
            case BaseProperty.Height: return result.height;
            default:
                return 0;
        }
    }

}
