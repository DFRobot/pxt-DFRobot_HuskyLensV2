/** 
 * @file pxt-DFRobot_HuskyLensV2/huskylensV2_app2.ts
 * @brief DFRobot's huskylens 2 makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_HuskyLensV2)
 * @n HUSKYLENS 2 is an easy-to-play AI vision sensor that provides a variety of AI vision functions, such as object detection, pose recognition, and instance segmentation.
 * 
 * @copyright    [DFRobot](http://www.dfrobot.com), 2026
 * @copyright    MIT Lesser General Public License
 * 
 * @author [email](rong.li@dfrobot.com)
 * @date  2026-2-2
*/

//% weight=100 color=#0fbc11 icon="\uf083" block="HuskylensV2"
//% groups='["Communication","Algorithm Switch","Face Recognition","Object Recognition","Object Tracking","Color Recognition","Object Classification","Self-learning Classification","Instance Segmentation","Hand Recognition","Pose Recognition","License Plate Recognition","Optical Char Recognition","Line Tracking","Face Emotion Recognition","Tag Recognition","QR Code Recognition","Barcode Recognition"]'
namespace huskylensV2 {

    // ======================================================= License Plate Recognition ======================================
    function getPlatePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentID.ID: return res.ID;
            case BasePropertyContentID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentID.XCenter: return res.xCenter;
            case BasePropertyContentID.YCenter: return res.yCenter;
            case BasePropertyContentID.Width: return res.width;
            case BasePropertyContentID.Height: return res.height;
            case BasePropertyContentID.Content: return res.content.length > 0 ? res.content : "";
            default: return 0;
        }
    }

    /** Get one-time license plate recognition result and cache it */
    //% block="get license plate recognition result"
    //% weight=129
    //% subcategory="License Plate Recognition"
    export function getResultPlateRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION);
    }

    /** Whether license plate detected */
    //% block="license plate detected?"
    //% weight=128
    //% subcategory="License Plate Recognition"
    export function availablePlateRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION);
    }

    /** The license plate attributes close to the center */
    //% block="Plate near center %alg"
    //% weight=127
    //% subcategory="License Plate Recognition"
    export function getCachedCenterPlateResult(alg: BasePropertyContentID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION);
        return getPlatePropertyValue(r, alg);
    }

    /** Total number of detected license plates */
    //% block="Number of detected plates"
    //% weight=126
    //% subcategory="License Plate Recognition"
    export function getCachedResultNumPlate(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION);
    }

    /** The attributes of the Nth license plate */
    //% block="Plate %index %alg"
    //% weight=125
    //% index.min=1 index.defl=1
    //% subcategory="License Plate Recognition"
    export function getCachedResultPlateProperty(index: number, alg: BasePropertyContentID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION, index - 1);
        return getPlatePropertyValue(r, alg);
    }

    /** Total number of learned license plate IDs */
    //% block="Number of learned plate IDs"
    //% weight=124
    //% subcategory="License Plate Recognition"
    export function getNumLearnedPlateIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION);
    }

    /** Check if a specific ID's license plate exists */
    //% block="Does plate ID %index exist?"
    //% weight=123
    //% index.min=1 index.defl=1
    //% subcategory="License Plate Recognition"
    export function plateIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION, index);
        return r != null;
    }

    /** The number of license plates with the specified ID */
    //% block="Number of plates with ID %index"
    //% weight=122
    //% index.min=1 index.defl=1
    //% subcategory="License Plate Recognition"
    export function getNumPlateByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION, index);
    }

    /** The license plate attribute with the specified ID */
    //% block="Plate ID %index %alg"
    //% weight=121
    //% index.min=1 index.defl=1
    //% subcategory="License Plate Recognition"
    export function getPlatePropertyByID(index: number, alg: BasePropertyContent): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION, index);
        return getPlatePropertyValue(r, alg);
    }

    /** The attribute of the Nth license plate with the specified ID */
    //% block="Plate ID %id No.%n %alg"
    //% weight=120
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="License Plate Recognition"
    export function getPlatePropertyByIDNth(id: number, n: number, alg: BasePropertyContent): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_LICENSE_RECOGNITION, id, n - 1);
        return getPlatePropertyValue(r, alg);
    }

    // ========================================================== Optical Char Recognition ==============================================
    function getTextPropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;

        switch (prop) {
            case BasePropertyContentID.ID: return res.ID;
            case BasePropertyContentID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentID.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentID.XCenter: return res.xCenter;
            case BasePropertyContentID.YCenter: return res.yCenter;
            case BasePropertyContentID.Width: return res.width;
            case BasePropertyContentID.Height: return res.height;
            default: return 0;
        }
    }


    /** Obtain a text recognition result and cache it */
    //% block="Get Optical Char Recognition result"
    //% weight=119
    //% subcategory="Optical Char Recognition"
    export function getResultTextRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_OCR_RECOGNITION);
    }

    /** Whether a text area has been detected */
    //% block="Whether text region detected"
    //% weight=118
    //% subcategory="Optical Char Recognition"
    export function availableTextRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_OCR_RECOGNITION);
    }

    /** Attributes of the text area close to the center */
    //% block="Text region near center %alg"
    //% weight=117
    //% subcategory="Optical Char Recognition"
    export function getCachedCenterTextResult(alg: BasePropertyContentID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_OCR_RECOGNITION);
        return getTextPropertyValue(r, alg);
    }

    /** Total number of learned text areas */
    //% block="Number of learned text region IDs"
    //% weight=114
    //% subcategory="Optical Char Recognition"
    export function getNumLearnedTextIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_OCR_RECOGNITION);
    }

    /** Check if the text area with the specified ID exists */
    //% block="Does text region ID %index exist?"
    //% weight=113
    //% index.min=1 index.defl=1
    //% subcategory="Optical Char Recognition"
    export function textIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_OCR_RECOGNITION, index);
        return r != null;
    }

    /** Text area attribute with specified ID */
    //% block="Text region ID %index %alg"
    //% weight=111
    //% index.min=1 index.defl=1
    //% subcategory="Optical Char Recognition"
    export function getTextPropertyByID(index: number, alg: BasePropertyContent): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_OCR_RECOGNITION, index);
        return getTextPropertyValue(r, alg);
    }

    // ============================================================= Line Tracking ====================================================
    // Helper function to convert unsigned 16-bit to signed 16-bit integer
    function toSigned16(val: number): number {
        // If value is greater than 32767, it's a negative number in signed 16-bit representation
        return val > 32767 ? val - 65536 : val;
    }

    function getLineTrackingPropertyValue(result: ResultVariant, prop: LineTrackingProperty): number {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case LineTrackingProperty.XComponent: return toSigned16(res.xCenter);
            case LineTrackingProperty.YComponent: return toSigned16(res.yCenter);
            case LineTrackingProperty.Angle: return toSigned16(res.angle);
            case LineTrackingProperty.Length: return res.length;
            default: return 0;
        }
    }

    // Line tracking properties
    export enum LineTrackingProperty {
        //% block="X Component"
        XComponent,
        //% block="Y Component"
        YComponent,
        //% block="Angle"
        Angle,
        //% block="Length"
        Length,
    }

    /** 请求一次巡线数据存入结果 */
    //% block="Request line tracking data and store result"
    //% weight=109
    //% subcategory="Line Tracking"
    export function getResultLineTracking(): void {
        getResultInternal(Algorithm.ALGORITHM_LINE_TRACKING);
    }

    /** 是否检测到路线 */
    //% block="Whether line detected"
    //% weight=108
    //% subcategory="Line Tracking"
    export function availableLineTracking(): boolean {
        return availableInternal(Algorithm.ALGORITHM_LINE_TRACKING);
    }

    /** 当前路线的属性 */
    //% block="Current line %alg"
    //% weight=107
    //% subcategory="Line Tracking"
    export function getCachedLineTrackingResult(alg: LineTrackingProperty): number {
        const r = getCurrentBranchInternal(Algorithm.ALGORITHM_LINE_TRACKING);
        return getLineTrackingPropertyValue(r, alg);
    }

    /** 前方路口分支数量 */
    //% block="Number of branches at intersection ahead"
    //% weight=106
    //% subcategory="Line Tracking"
    export function getLineTrackingBranchCount(): number {
        return getUpcomingBranchCountInternal(Algorithm.ALGORITHM_LINE_TRACKING);
    }

    /** 逆时针第index条分支路线的属性 */
    //% block="Branch %index counterclockwise %alg"
    //% weight=105
    //% index.min=1 index.defl=1
    //% subcategory="Line Tracking"
    export function getLineTrackingBranchProperty(index: number, alg: LineTrackingProperty): number {
        const r = getBranchInternal(Algorithm.ALGORITHM_LINE_TRACKING, index - 1);
        return getLineTrackingPropertyValue(r, alg);
    }

    // ======================================================== Face Emotion Recognition ==============================================
    function getEmotionPropertyValue(result: ResultVariant, prop: BasePropertyID): number {
        return getBasePropertyValue(result, prop as any);
    }

    function getEmotionPropertyValueID(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

    //% block="Get Face Emotion Recognition result"
    //% weight=104
    //% subcategory="Face Emotion Recognition"
    export function getResultEmotionRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Whether emotion detected"
    //% weight=103
    //% subcategory="Face Emotion Recognition"
    export function availableEmotionRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Emotion near center %alg"
    //% weight=102
    //% subcategory="Face Emotion Recognition"
    export function getCachedCenterEmotionResult(alg: BasePropertyID): number {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION);
        return getEmotionPropertyValue(r, alg);
    }

    //% block="Number of detected emotions"
    //% weight=101
    //% subcategory="Face Emotion Recognition"
    export function getCachedResultNumEmotion(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Emotion %index %alg"
    //% weight=100
    //% index.min=1 index.defl=1
    //% subcategory="Face Emotion Recognition"
    export function getCachedResultEmotionProperty(index: number, alg: BasePropertyID): number {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION, index - 1);
        return getEmotionPropertyValue(r, alg);
    }

    //% block="Number of learned emotion IDs"
    //% weight=99
    //% subcategory="Face Emotion Recognition"
    export function getNumLearnedEmotionIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Does emotion ID %index exist?"
    //% weight=98
    //% index.min=1 index.defl=1
    //% subcategory="Face Emotion Recognition"
    export function emotionIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of emotions with ID %index"
    //% weight=97
    //% index.min=1 index.defl=1
    //% subcategory="Face Emotion Recognition"
    export function getNumEmotionByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION, index);
    }

    //% block="Emotion ID %index %alg"
    //% weight=96
    //% index.min=1 index.defl=1
    //% subcategory="Face Emotion Recognition"
    export function getEmotionPropertyByID(index: number, alg: BaseProperty): number {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION, index);
        return getEmotionPropertyValueID(r, alg);
    }

    //% block="Emotion ID %id No.%n %alg"
    //% weight=95
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Face Emotion Recognition"
    export function getEmotionPropertyByIDNth(id: number, n: number, alg: BaseProperty): number {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_EMOTION_RECOGNITION, id, n - 1);
        return getEmotionPropertyValueID(r, alg);
    }

    // =========================================================== Tag Recognition ====================================================

    function getTagPropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentID.ID: return res.ID;
            case BasePropertyContentID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentID.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentID.XCenter: return res.xCenter;
            case BasePropertyContentID.YCenter: return res.yCenter;
            case BasePropertyContentID.Width: return res.width;
            case BasePropertyContentID.Height: return res.height;
            default: return 0;
        }
    }

    //% block="Get tag recognition result"
    //% weight=94
    //% subcategory="Tag Recognition"
    export function getResultTagRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Whether tag detected"
    //% weight=93
    //% subcategory="Tag Recognition"
    export function availableTagRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Tag near center %alg"
    //% weight=92
    //% subcategory="Tag Recognition"
    export function getCachedCenterTagResult(alg: BasePropertyContentID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_TAG_RECOGNITION);
        return getTagPropertyValue(r, alg);
    }

    //% block="Number of detected tags"
    //% weight=91
    //% subcategory="Tag Recognition"
    export function getCachedResultNumTag(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Tag %index %alg"
    //% weight=90
    //% index.min=1 index.defl=1
    //% subcategory="Tag Recognition"
    export function getCachedResultTagProperty(index: number, alg: BasePropertyContentID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_TAG_RECOGNITION, index - 1);
        return getTagPropertyValue(r, alg);
    }

    //% block="Number of learned tag IDs"
    //% weight=89
    //% subcategory="Tag Recognition"
    export function getNumLearnedTagIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Does tag ID %index exist?"
    //% weight=88
    //% index.min=1 index.defl=1
    //% subcategory="Tag Recognition"
    export function tagIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_TAG_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of tags with ID %index"
    //% weight=87
    //% index.min=1 index.defl=1
    //% subcategory="Tag Recognition"
    export function getNumTagByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_TAG_RECOGNITION, index);
    }

    //% block="Tag ID %index %alg"
    //% weight=86
    //% index.min=1 index.defl=1
    //% subcategory="Tag Recognition"
    export function getTagPropertyByID(index: number, alg: BasePropertyContent): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_TAG_RECOGNITION, index);
        return getTagPropertyValue(r, alg);
    }

    //% block="Tag ID %id No.%n %alg"
    //% weight=85
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Tag Recognition"
    export function getTagPropertyByIDNth(id: number, n: number, alg: BasePropertyContent): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_TAG_RECOGNITION, id, n - 1);
        return getTagPropertyValue(r, alg);
    }

    // =================================================================== QR Code Recognition =====================================
    function getQRCodePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentID.ID: return res.ID;
            case BasePropertyContentID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentID.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentID.XCenter: return res.xCenter;
            case BasePropertyContentID.YCenter: return res.yCenter;
            case BasePropertyContentID.Width: return res.width;
            case BasePropertyContentID.Height: return res.height;
            default: return 0;
        }
    }


    //% block="Get QR code recognition result"
    //% weight=84
    //% subcategory="QR Code Recognition"
    export function getResultQRCodeRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="Whether QR code detected"
    //% weight=83
    //% subcategory="QR Code Recognition"
    export function availableQRCodeRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="QR code near center %alg"
    //% weight=82
    //% subcategory="QR Code Recognition"
    export function getCachedCenterQRCodeResult(alg: BasePropertyContentID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION);
        return getQRCodePropertyValue(r, alg);
    }

    //% block="Number of detected QR codes"
    //% weight=81
    //% subcategory="QR Code Recognition"
    export function getCachedResultNumQRCode(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="QR code %index %alg"
    //% weight=80
    //% index.min=1 index.defl=1
    //% subcategory="QR Code Recognition"
    export function getCachedResultQRCodeProperty(index: number, alg: BasePropertyContentID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION, index - 1);
        return getQRCodePropertyValue(r, alg);
    }

    //% block="Number of learned QR code IDs"
    //% weight=79
    //% subcategory="QR Code Recognition"
    export function getNumLearnedQRCodeIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="Does QR code ID %index exist?"
    //% weight=78
    //% index.min=1 index.defl=1
    //% subcategory="QR Code Recognition"
    export function qrcodeIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of QR codes with ID %index"
    //% weight=77
    //% index.min=1 index.defl=1
    //% subcategory="QR Code Recognition"
    export function getNumQRCodeByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION, index);
    }

    //% block="QR code ID %index %alg"
    //% weight=76
    //% index.min=1 index.defl=1
    //% subcategory="QR Code Recognition"
    export function getQRCodePropertyByID(index: number, alg: BasePropertyContent): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION, index);
        return getQRCodePropertyValue(r, alg);
    }

    //% block="QR code ID %id No.%n %alg"
    //% weight=75
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="QR Code Recognition"
    export function getQRCodePropertyByIDNth(id: number, n: number, alg: BasePropertyContent): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_QRCODE_RECOGNITION, id, n - 1);
        return getQRCodePropertyValue(r, alg);
    }

    // ===================================================== Barcode Recognition" ==============================================



    function getBarcodePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentID.ID: return res.ID;
            case BasePropertyContentID.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentID.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentID.XCenter: return res.xCenter;
            case BasePropertyContentID.YCenter: return res.yCenter;
            case BasePropertyContentID.Width: return res.width;
            case BasePropertyContentID.Height: return res.height;
            default: return 0;
        }
    }


    //% block="Get barcode recognition result"
    //% weight=74
    //% subcategory="Barcode Recognition"
    export function getResultBarcodeRecogtion(): void {
        getResultInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Whether barcode detected"
    //% weight=73
    //% subcategory="Barcode Recognition"
    export function availableBarcodeRecogtion(): boolean {
        return availableInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Barcode near center %alg"
    //% weight=72
    //% subcategory="Barcode Recognition"
    export function getCachedCenterBarcodeResult(alg: BasePropertyContentID): any {
        const r = getCachedCenterResultInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION);
        return getBarcodePropertyValue(r, alg);
    }

    //% block="Number of detected barcodes"
    //% weight=71
    //% subcategory="Barcode Recognition"
    export function getCachedResultNumBarcode(): number {
        return getCachedResultNumInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Barcode %index %alg"
    //% weight=70
    //% index.min=1 index.defl=1
    //% subcategory="Barcode Recognition"
    export function getCachedResultBarcodeProperty(index: number, alg: BasePropertyContentID): any {
        const r = getCachedResultByIndexInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION, index - 1);
        return getBarcodePropertyValue(r, alg);
    }

    //% block="Number of learned barcode IDs"
    //% weight=69
    //% subcategory="Barcode Recognition"
    export function getNumLearnedBarcodeIDs(): number {
        return getCachedResultLearnedNumInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Does barcode ID %index exist?"
    //% weight=68
    //% index.min=1 index.defl=1
    //% subcategory="Barcode Recognition"
    export function barcodeIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of barcodes with ID %index"
    //% weight=67
    //% index.min=1 index.defl=1
    //% subcategory="Barcode Recognition"
    export function getNumBarcodeByID(index: number): number {
        return getCachedResultNumByIDInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION, index);
    }

    //% block="Barcode ID %index %alg"
    //% weight=66
    //% index.min=1 index.defl=1
    //% subcategory="Barcode Recognition"
    export function getBarcodePropertyByID(index: number, alg: BasePropertyContent): any {
        const r = getCachedResultByIDInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION, index);
        return getBarcodePropertyValue(r, alg);
    }

    //% block="Barcode ID %id No.%n %alg"
    //% weight=65
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="Barcode Recognition"
    export function getBarcodePropertyByIDNth(id: number, n: number, alg: BasePropertyContent): any {
        const r = getCachedIndexResultByIDInternal(Algorithm.ALGORITHM_BARCODE_RECOGNITION, id, n - 1);
        return getBarcodePropertyValue(r, alg);
    }

    // ================= Custom Model =================

    function getCustomModelPropertyValue(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

    function getCustomModelPropertyValueID(result: ResultVariant, prop: BasePropertyID): number {
        return getBasePropertyValue(result, prop as any);
    }



    /** HUSKYLENS 2 switching algorithm ID until successful */
    //% blockHidden=true
    //% block="HUSKYLENS 2 switch algorithm ID %algorithmId until success"
    //% weight=64
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function switchCustomModelAlgorithm(algorithmId: number): void {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        switchAlgorithmInternal(algoId);
    }

    /** Request for algorithm ID to store data once */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId request data and store result"
    //% weight=63
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function getResultCustomModel(algorithmId: number): void {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        getResultInternal(algoId);
    }

    /** Algorithm ID detects the target */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target detected?"
    //% weight=62
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function availableCustomModel(algorithmId: number): boolean {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return availableInternal(algoId);
    }

    /** Target attribute with algorithm ID close to the center */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target near center %alg1"
    //% weight=61
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function getCachedCenterCustomModelResult(algorithmId: number, alg1: BasePropertyID): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedCenterResultInternal(algoId);
        return getCustomModelPropertyValueID(r, alg1);
    }

    /** The total number of targets detected by the algorithm ID */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of detected targets"
    //% weight=60
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function getCachedResultNumCustomModel(algorithmId: number): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultNumInternal(algoId);
    }

    /** The attribute of the num-th target of the algorithm ID */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target %num %alg1"
    //% weight=59
    //% algorithmId.min=1 algorithmId.defl=128
    //% num.min=1 num.defl=1
    //% subcategory="Custom Model"
    export function getCachedResultCustomModelProperty(algorithmId: number, num: number, alg1: BasePropertyID): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIndexInternal(algoId, num - 1);
        return getCustomModelPropertyValueID(r, alg1);
    }

    /** The total number of target IDs that the algorithm has learned */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of learned target IDs"
    //% weight=58
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="Custom Model"
    export function getNumLearnedCustomModelIDs(algorithmId: number): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultLearnedNumInternal(algoId);
    }

    /** The objective of Algorithm ID exists. */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target ID %targetId exists?"
    //% weight=57
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="Custom Model"
    export function customModelIdExists(algorithmId: number, targetId: number): boolean {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIDInternal(algoId, targetId);
        return r != null;
    }

    /** The total target number of Algorithm ID ID */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of targets with ID %targetId"
    //% weight=56
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="Custom Model"
    export function getNumCustomModelByID(algorithmId: number, targetId: number): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultNumByIDInternal(algoId, targetId);
    }

    /** The target attribute of Algorithm ID ID */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target ID %targetId %alg2"
    //% weight=55
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="Custom Model"
    export function getCustomModelPropertyByID(algorithmId: number, targetId: number, alg2: BaseProperty): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIDInternal(algoId, targetId);
        return getCustomModelPropertyValue(r, alg2);
    }

    /** The attribute of the num-th target of algorithm ID ID */
    //% blockHidden=true
    //% block="Algorithm %algorithmId ID%targetId No.%num %alg2"
    //% inlineInputMode=inline
    //% weight=54
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% num.min=1 num.defl=1
    //% subcategory="Custom Model"
    export function getCustomModelPropertyByIDNth(algorithmId: number, targetId: number, num: number, alg2: BaseProperty): number {
        const algoId = Algorithm.ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedIndexResultByIDInternal(algoId, targetId, num - 1);
        return getCustomModelPropertyValue(r, alg2);
    }
}