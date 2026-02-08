/** 
 * @file huskylens2_app2.ts
 * @brief DFRobot's huskylens 2 makecode library.
 * @n [Get the module here](https://github.com/DFRobot/pxt-DFRobot_huskylens2)
 * @copyright    [DFRobot](http://www.dfrobot.com), 2026
 * @license The MIT License (MIT)
 * @author [email](rong.li@dfrobot.com)
 * @date  2026-2-2
*/
// line tracking properties
enum LineTrackingProperty {
    //% block="x component"
    XComponent,
    //% block="y component"
    YComponent,
    //% block="angle"
    Angle,
    //% block="length"
    Length,
}

/**
 * HuskyLens 2 
 */
//% weight=100 color=#0fbc11 icon="\uf083" block="huskylens2"
//% groups='["communication","algorithm switch"]'
namespace huskylens2 {

    // ======================================================= license plate recognition ======================================
    function getPlatePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case BasePropertyContentId.Id: return res.Id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            default: return 0;
        }
    }

    /** Get one-time license plate recognition result and cache it */
    //% block="get license plate recognition result"
    //% weight=129
    //% subcategory="license plate recognition"
    export function getResultPlateRecognition(): void {
        getResultInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /** Whether license plate detected */
    //% block="license plate detected?"
    //% weight=128
    //% subcategory="license plate recognition"
    export function availablePlateRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /**
     * The license plate attributes close to the center
     * @param property The property to retrieve.
     */
    //% block="plate near center %property"
    //% weight=127
    //% subcategory="license plate recognition"
    export function cachedCenterPlateResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmLicenseRecognition);
        return getPlatePropertyValue(r, property);
    }

    /** Total number of detected license plates */
    //% block="number of detected plates"
    //% weight=126
    //% subcategory="license plate recognition"
    export function cachedResultNumPlate(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /**
     * The attributes of the No.N license plate
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="plate %index %property"
    //% weight=125
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function cachedResultPlateProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmLicenseRecognition, index - 1);
        return getPlatePropertyValue(r, property);
    }

    /** Total number of learned license plate Ids */
    //% block="number of learned plate Ids"
    //% weight=124
    //% subcategory="license plate recognition"
    export function totalLearnedPlateIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /**
     * Check if a specific Id's license plate exists
     * @param index The index (1-based).
     */
    //% block="does plate Id %index exist?"
    //% weight=123
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function plateIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmLicenseRecognition, index);
        return r != null;
    }

    /**
     * The number of license plates with the specified Id
     * @param index The index (1-based).
     */
    //% block="number of plates with Id %index"
    //% weight=122
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function totalPlateById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmLicenseRecognition, index);
    }

    /**
     * The license plate attribute with the specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="plate Id %index %property"
    //% weight=121
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function platePropertyById(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmLicenseRecognition, index);
        return getPlatePropertyValue(r, property);
    }

    /**
     * The attribute of the No.N license plate with the specified Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="plate Id %Id No. %index %property"
    //% weight=120
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="license plate recognition"
    export function platePropertyByIdNth(Id: number, index: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmLicenseRecognition, Id, index - 1);
        return getPlatePropertyValue(r, property);
    }

    // ========================================================== optical char recognition ==============================================
    function getTextPropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;

        switch (property) {
            case BasePropertyContentId.Id: return res.Id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }


    /** Obtain a text recognition result and cache it */
    //% block="get optical char recognition result"
    //% weight=119
    //% subcategory="optical char recognition"
    export function getResultTextRecognition(): void {
        getResultInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /** Whether a text area has been detected */
    //% block="whether text region detected"
    //% weight=118
    //% subcategory="optical char recognition"
    export function availableTextRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /**
     * Attributes of the text area close to the center
     * @param property The property to retrieve.
     */
    //% block="text region near center %property"
    //% weight=117
    //% subcategory="optical char recognition"
    export function cachedCenterTextResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmOcrRecognition);
        return getTextPropertyValue(r, property);
    }

    /** Total number of learned text areas */
    //% block="number of learned text region Ids"
    //% weight=114
    //% subcategory="optical char recognition"
    export function totalLearnedTextIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /**
     * Check if the text area with the specified Id exists
     * @param index The index (1-based).
     */
    //% block="does text region Id %index exist?"
    //% weight=113
    //% index.min=1 index.defl=1
    //% subcategory="optical char recognition"
    export function textIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmOcrRecognition, index);
        return r != null;
    }

    /**
     * Text area attribute with specified Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="text region Id %index %property"
    //% weight=111
    //% index.min=1 index.defl=1
    //% subcategory="optical char recognition"
    export function textPropertyById(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmOcrRecognition, index);
        return getTextPropertyValue(r, property);
    }

    // ============================================================= line tracking ====================================================
    // Helper function to convert unsigned 16-bit to signed 16-bit integer
    function toSigned16(val: number): number {
        // If value is greater than 32767, it's a negative number in signed 16-bit representation
        return val > 32767 ? val - 65536 : val;
    }

    function getLineTrackingPropertyValue(result: ResultVariant, property: LineTrackingProperty): number {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case LineTrackingProperty.XComponent: return toSigned16(res.xCenter);
            case LineTrackingProperty.YComponent: return toSigned16(res.yCenter);
            case LineTrackingProperty.Angle: return toSigned16(res.angle);
            case LineTrackingProperty.Length: return res.length;
            default: return 0;
        }
    }



    /** Request one-time line tracking data and store in result */
    //% block="request line tracking data and store result"
    //% weight=109
    //% subcategory="line tracking"
    export function getResultLineTracking(): void {
        getResultInternal(Algorithm.AlgorithmLineTracking);
    }

    /** Whether a route is detected */
    //% block="whether line detected"
    //% weight=108
    //% subcategory="line tracking"
    export function availableLineTracking(): boolean {
        return availableInternal(Algorithm.AlgorithmLineTracking);
    }

    /**
     * Attributes of the current route
     * @param property The property to retrieve.
     */
    //% block="current line %property"
    //% weight=107
    //% subcategory="line tracking"
    export function cachedLineTrackingResult(property: LineTrackingProperty): number {
        const r = getCurrentBranchInternal(Algorithm.AlgorithmLineTracking);
        return getLineTrackingPropertyValue(r, property);
    }

    /** Number of branches at the upcoming intersection */
    //% block="number of branches at intersection ahead"
    //% weight=106
    //% subcategory="line tracking"
    export function lineTrackingBranchCount(): number {
        return getUpcomingBranchCountInternal(Algorithm.AlgorithmLineTracking);
    }

    /**
     * Attributes of the Nth branch route counterclockwise
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="branch %index counterclockwise %property"
    //% weight=105
    //% index.min=1 index.defl=1
    //% subcategory="line tracking"
    export function lineTrackingBranchProperty(index: number, property: LineTrackingProperty): number {
        const r = getBranchInternal(Algorithm.AlgorithmLineTracking, index - 1);
        return getLineTrackingPropertyValue(r, property);
    }

    // ======================================================== face emotion recognition ==============================================
    function getEmotionPropertyValue(result: ResultVariant, property: BasePropertyId): number {
        return getBasePropertyValueInternal(result, property as any);
    }

    function getEmotionPropertyValueId(result: ResultVariant, property: BaseProperty): number {
        return getBasePropertyValueInternal(result, property as any);
    }

        /** Get one-time face emotion recognition result and cache it */
    //% block="get face emotion recognition result"
    //% weight=104
    //% subcategory="face emotion recognition"
    export function getResultEmotionRecognition(): void {
        getResultInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /** Whether an emotion is detected */
    //% block="whether emotion detected"
    //% weight=103
    //% subcategory="face emotion recognition"
    export function availableEmotionRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /**
     * Emotion attributes near the center
     * @param property The property to retrieve.
     */
    //% block="emotion near center %property"
    //% weight=102
    //% subcategory="face emotion recognition"
    export function cachedCenterEmotionResult(property: BasePropertyId): number {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmEmotionRecognition);
        return getEmotionPropertyValue(r, property);
    }

    /** Total number of detected emotions */
    //% block="number of detected emotions"
    //% weight=101
    //% subcategory="face emotion recognition"
    export function cachedResultNumEmotion(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /**
     * Attributes of the Nth emotion
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="emotion %index %property"
    //% weight=100
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function cachedResultEmotionProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmEmotionRecognition, index - 1);
        return getEmotionPropertyValue(r, property);
    }

    /** Total number of learned emotion Ids */
    //% block="number of learned emotion Ids"
    //% weight=99
    //% subcategory="face emotion recognition"
    export function totalLearnedEmotionIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /**
     * Check if an emotion with a specific Id exists
     * @param index The index (1-based).
     */
    //% block="does emotion Id %index exist?"
    //% weight=98
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function emotionIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmEmotionRecognition, index);
        return r != null;
    }

    /**
     * Number of emotions with a specific Id
     * @param index The index (1-based).
     */
    //% block="number of emotions with Id %index"
    //% weight=97
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function totalEmotionById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmEmotionRecognition, index);
    }

    /**
     * Attributes of an emotion with a specific Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="emotion Id %index %property"
    //% weight=96
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function emotionPropertyById(index: number, property: BaseProperty): number {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmEmotionRecognition, index);
        return getEmotionPropertyValueId(r, property);
    }

    /**
     * Attributes of the Nth emotion with a specific Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="emotion Id %Id No. %index %property"
    //% weight=95
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="face emotion recognition"
    export function emotionPropertyByIdNth(Id: number, index: number, property: BaseProperty): number {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmEmotionRecognition, Id, index - 1);
        return getEmotionPropertyValueId(r, property);
    }

    // =========================================================== tag recognition ====================================================

    function getTagPropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case BasePropertyContentId.Id: return res.Id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }

    /** Request one-time tag recognition result and store it */
    //% block="get tag recognition result"
    //% weight=94
    //% subcategory="tag recognition"
    export function getResultTagRecognition(): void {
        getResultInternal(Algorithm.AlgorithmTagRecognition);
    }

    /** Whether a tag is detected */
    //% block="whether tag detected"
    //% weight=93
    //% subcategory="tag recognition"
    export function availableTagRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmTagRecognition);
    }

    /**
     * Tag attributes near the center
     * @param property The property to retrieve.
     */
    //% block="tag near center %property"
    //% weight=92
    //% subcategory="tag recognition"
    export function cachedCenterTagResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmTagRecognition);
        return getTagPropertyValue(r, property);
    }

    /** Total number of detected tags */
    //% block="number of detected tags"
    //% weight=91
    //% subcategory="tag recognition"
    export function cachedResultNumTag(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmTagRecognition);
    }

    /**
     * Attributes of the Nth tag
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="tag %index %property"
    //% weight=90
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function cachedResultTagProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmTagRecognition, index - 1);
        return getTagPropertyValue(r, property);
    }

    /** Total number of learned tag Ids */
    //% block="number of learned tag Ids"
    //% weight=89
    //% subcategory="tag recognition"
    export function totalLearnedTagIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmTagRecognition);
    }

    /**
     * Check if a tag with a specific Id exists
     * @param index The index (1-based).
     */
    //% block="does tag Id %index exist?"
    //% weight=88
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function tagIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmTagRecognition, index);
        return r != null;
    }

    /**
     * Number of tags with a specific Id
     * @param index The index (1-based).
     */
    //% block="number of tags with Id %index"
    //% weight=87
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function totalTagById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmTagRecognition, index);
    }

    /**
     * Attributes of a tag with a specific Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="tag Id %index %property"
    //% weight=86
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function tagPropertyById(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmTagRecognition, index);
        return getTagPropertyValue(r, property);
    }

    /**
     * Attributes of the Nth tag with a specific Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="tag Id %Id No. %index %property"
    //% weight=85
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="tag recognition"
    export function tagPropertyByIdNth(Id: number, index: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmTagRecognition, Id, index - 1);
        return getTagPropertyValue(r, property);
    }

    // =================================================================== QR code recognition =====================================
    function getQRCodePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case BasePropertyContentId.Id: return res.Id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }


    /** Request one-time QR code recognition result and store it */
    //% block="get QR code recognition result"
    //% weight=84
    //% subcategory="QR code recognition"
    export function getResultQRCodeRecognition(): void {
        getResultInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /** Whether a QR code is detected */
    //% block="whether QR code detected"
    //% weight=83
    //% subcategory="QR code recognition"
    export function availableQRCodeRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /**
     * QR code attributes near the center
     * @param property The property to retrieve.
     */
    //% block="QR code near center %property"
    //% weight=82
    //% subcategory="QR code recognition"
    export function cachedCenterQRCodeResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmQrCodeRecognition);
        return getQRCodePropertyValue(r, property);
    }

    /** Total number of detected QR codes */
    //% block="number of detected QR codes"
    //% weight=81
    //% subcategory="QR code recognition"
    export function cachedResultNumQRCode(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /**
     * Attributes of the Nth QR code
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="QR code %index %property"
    //% weight=80
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function cachedResultQRCodeProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmQrCodeRecognition, index - 1);
        return getQRCodePropertyValue(r, property);
    }

    /** Total number of learned QR code Ids */
    //% block="number of learned QR code Ids"
    //% weight=79
    //% subcategory="QR code recognition"
    export function totalLearnedQRCodeIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /**
     * Check if a QR code with a specific Id exists
     * @param index The index (1-based).
     */
    //% block="does QR code Id %index exist?"
    //% weight=78
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function qrcodeIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmQrCodeRecognition, index);
        return r != null;
    }

    /**
     * Number of QR codes with a specific Id
     * @param index The index (1-based).
     */
    //% block="number of QR codes with Id %index"
    //% weight=77
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function totalQRCodeById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmQrCodeRecognition, index);
    }

    /**
     * Attributes of a QR code with a specific Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="QR code Id %index %property"
    //% weight=76
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function QRCodePropertyById(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmQrCodeRecognition, index);
        return getQRCodePropertyValue(r, property);
    }

    /**
     * Attributes of the Nth QR code with a specific Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="QR code Id %Id No. %index %property"
    //% weight=75
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="QR code recognition"
    export function QRCodePropertyByIdNth(Id: number, index: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmQrCodeRecognition, Id, index - 1);
        return getQRCodePropertyValue(r, property);
    }

    // ===================================================== barcode recognition" ==============================================



    function getBarcodePropertyValue(result: ResultVariant, property: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (property) {
            case BasePropertyContentId.Id: return res.Id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }


    /** Request one-time barcode recognition result and store it */
    //% block="get barcode recognition result"
    //% weight=74
    //% subcategory="barcode recognition"
    export function getResultBarcodeRecognition(): void {
        getResultInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /** Whether a barcode is detected */
    //% block="whether barcode detected"
    //% weight=73
    //% subcategory="barcode recognition"
    export function availableBarcodeRecognition(): boolean {
        return availableInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /**
     * Barcode attributes near the center
     * @param property The property to retrieve.
     */
    //% block="barcode near center %property"
    //% weight=72
    //% subcategory="barcode recognition"
    export function cachedCenterBarcodeResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmBarcodeRecognition);
        return getBarcodePropertyValue(r, property);
    }

    /** Total number of detected barcodes */
    //% block="number of detected barcodes"
    //% weight=71
    //% subcategory="barcode recognition"
    export function cachedResultNumBarcode(): number {
        return cachedResultNumInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /**
     * Attributes of the Nth barcode
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="barcode %index %property"
    //% weight=70
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function cachedResultBarcodeProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmBarcodeRecognition, index - 1);
        return getBarcodePropertyValue(r, property);
    }

    /** Total number of learned barcode Ids */
    //% block="number of learned barcode Ids"
    //% weight=69
    //% subcategory="barcode recognition"
    export function totalLearnedBarcodeIds(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /**
     * Check if a barcode with a specific Id exists
     * @param index The index (1-based).
     */
    //% block="does barcode Id %index exist?"
    //% weight=68
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function barcodeIdExists(index: number): boolean {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmBarcodeRecognition, index);
        return r != null;
    }

    /**
     * Number of barcodes with a specific Id
     * @param index The index (1-based).
     */
    //% block="number of barcodes with Id %index"
    //% weight=67
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function totalBarcodeById(index: number): number {
        return cachedResultNumByIdInternal(Algorithm.AlgorithmBarcodeRecognition, index);
    }

    /**
     * Attributes of a barcode with a specific Id
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="barcode Id %index %property"
    //% weight=66
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function barcodePropertyById(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIdInternal(Algorithm.AlgorithmBarcodeRecognition, index);
        return getBarcodePropertyValue(r, property);
    }

    /**
     * Attributes of the Nth barcode with a specific Id
     * @param Id The Id (1-based).
     * @param n The nth item (1-based).
     * @param property The property to retrieve.
     */
    //% block="barcode Id %Id No. %index %property"
    //% weight=65
    //% Id.min=1 Id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="barcode recognition"
    export function barcodePropertyByIdNth(Id: number, index: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIdInternal(Algorithm.AlgorithmBarcodeRecognition, Id, index - 1);
        return getBarcodePropertyValue(r, property);
    }

    // ================= Custom Model =================

    function getCustomModelPropertyValue(result: ResultVariant, property: BaseProperty): number {
        return getBasePropertyValueInternal(result, property as any);
    }

    function getCustomModelPropertyValueId(result: ResultVariant, property: BasePropertyId): number {
        return getBasePropertyValueInternal(result, property as any);
    }



    /**
     * HUSKYLENS 2 switching algorithm Id until successful
     * @param algorithmId The custom algorithm Id (1-based).
     */
    //% block="switch algorithm Id %algorithmId until success"
    //% blockHidden=true
    //% weight=64
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function switchCustomModelAlgorithm(algorithmId: number): void {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        switchAlgorithmInternal(tempAlgorithmId);
    }

    /**
     * Request for algorithm Id to store data once
     * @param algorithmId The custom algorithm Id (1-based).
     */
    //% block="algorithm Id %algorithmId request data and store result"
    //% blockHidden=true
    //% weight=63
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function getResultCustomModel(algorithmId: number): void {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        getResultInternal(tempAlgorithmId);
    }

    /**
     * Algorithm Id detects the target
     * @param algorithmId The custom algorithm Id (1-based).
     */
    //% block="algorithm Id %algorithmId target detected?"
    //% blockHidden=true
    //% weight=62
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function availableCustomModel(algorithmId: number): boolean {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return availableInternal(tempAlgorithmId);
    }

    /**
     * Target attribute with algorithm Id close to the center
     * @param algorithmId The custom algorithm Id (1-based).
     * @param property The property to retrieve.
     */
    //% block="algorithm Id %algorithmId target near center %property"
    //% blockHidden=true
    //% weight=61
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function cachedCenterCustomModelResult(algorithmId: number, property: BasePropertyId): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedCenterResultInternal(tempAlgorithmId);
        return getCustomModelPropertyValueId(r, property);
    }

    /**
     * The total number of targets detected by the algorithm Id
     * @param algorithmId The custom algorithm Id (1-based).
     */
    //% block="algorithm Id %algorithmId number of detected targets"
    //% blockHidden=true
    //% weight=60
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function cachedResultNumCustomModel(algorithmId: number): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultNumInternal(tempAlgorithmId);
    }

    /**
     * The attribute of the num-th target of the algorithm Id
     * @param algorithmId The custom algorithm Id (1-based).
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="algorithm Id %algorithmId target %index %property"
    //% blockHidden=true
    //% weight=59
    //% algorithmId.min=1 algorithmId.defl=128
    //% index.min=1 index.defl=1
    //% subcategory="custom model"
    export function cachedResultCustomModelProperty(algorithmId: number, index: number, property: BasePropertyId): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIndexInternal(tempAlgorithmId, index - 1);
        return getCustomModelPropertyValueId(r, property);
    }

    /**
     * The total number of target Ids that the algorithm has learned
     * @param algorithmId The custom algorithm Id (1-based).
     */
    //% block="algorithm Id %algorithmId number of learned target Ids"
    //% blockHidden=true
    //% weight=58
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function totalLearnedCustomModelIds(algorithmId: number): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultLearnedNumInternal(tempAlgorithmId);
    }

    /**
     * The objective of Algorithm Id exists.
     * @param algorithmId The custom algorithm Id (1-based).
     * @param targetId The target Id (1-based).
     */
    //% block="algorithm Id %algorithmId target Id %targetId exists?"
    //% blockHidden=true
    //% weight=57
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function customModelIdExists(algorithmId: number, targetId: number): boolean {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIdInternal(tempAlgorithmId, targetId);
        return r != null;
    }

    /**
     * The total target number of Algorithm Id Id
     * @param algorithmId The custom algorithm Id (1-based).
     * @param targetId The target Id (1-based).
     */
    //% block="algorithm Id %algorithmId number of targets with Id %targetId"
    //% blockHidden=true
    //% weight=56
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function totalCustomModelById(algorithmId: number, targetId: number): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultNumByIdInternal(tempAlgorithmId, targetId);
    }

    /**
     * The target attribute of Algorithm Id Id
     * @param algorithmId The custom algorithm Id (1-based).
     * @param targetId The target Id (1-based).
     * @param property The property to retrieve.
     */
    //% block="algorithm Id %algorithmId target Id %targetId %property"
    //% blockHidden=true
    //% weight=55
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function customModelPropertyById(algorithmId: number, targetId: number, property: BaseProperty): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIdInternal(tempAlgorithmId, targetId);
        return getCustomModelPropertyValue(r, property);
    }

    /**
     * The attribute of the num-th target of algorithm Id Id
     * @param algorithmId The custom algorithm Id (1-based).
     * @param targetId The target Id (1-based).
     * @param index The index (1-based).
     * @param property The property to retrieve.
     */
    //% block="algorithm %algorithmId Id %targetId No. %index %property"
    //% blockHidden=true
    //% inlineInputMode=inline
    //% weight=54
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% index.min=1 index.defl=1
    //% subcategory="custom model"
    export function customModelPropertyByIdNth(algorithmId: number, targetId: number, index: number, property: BaseProperty): number {
        const tempAlgorithmId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedIndexResultByIdInternal(tempAlgorithmId, targetId, index - 1);
        return getCustomModelPropertyValue(r, property);
    }
}
