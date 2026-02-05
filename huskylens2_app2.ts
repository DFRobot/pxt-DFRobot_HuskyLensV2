/** 
 * @file huskylens2_app2.ts
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

    // ======================================================= license plate recognition ======================================
    function getPlatePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentId.Id: return res.id;
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
    export function getResultPlateRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /** Whether license plate detected */
    //% block="license plate detected?"
    //% weight=128
    //% subcategory="license plate recognition"
    export function availablePlateRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /** The license plate attributes close to the center */
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

    /** The attributes of the No.N license plate */
    //% block="plate %index %property"
    //% weight=125
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function cachedResultPlateProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmLicenseRecognition, index - 1);
        return getPlatePropertyValue(r, property);
    }

    /** Total number of learned license plate IDs */
    //% block="number of learned plate IDs"
    //% weight=124
    //% subcategory="license plate recognition"
    export function totalLearnedPlateIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmLicenseRecognition);
    }

    /** Check if a specific id's license plate exists */
    //% block="does plate id %index exist?"
    //% weight=123
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function plateIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmLicenseRecognition, index);
        return r != null;
    }

    /** The number of license plates with the specified id */
    //% block="number of plates with id %index"
    //% weight=122
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function totalPlateByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmLicenseRecognition, index);
    }

    /** The license plate attribute with the specified id */
    //% block="plate id %index %property"
    //% weight=121
    //% index.min=1 index.defl=1
    //% subcategory="license plate recognition"
    export function platePropertyByID(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmLicenseRecognition, index);
        return getPlatePropertyValue(r, property);
    }

    /** The attribute of the No.N license plate with the specified id */
    //% block="plate id %id No.%n %property"
    //% weight=120
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="license plate recognition"
    export function platePropertyByIDNth(id: number, n: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmLicenseRecognition, id, n - 1);
        return getPlatePropertyValue(r, property);
    }

    // ========================================================== optical char recognition ==============================================
    function getTextPropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;

        switch (prop) {
            case BasePropertyContentId.Id: return res.id;
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
    export function getResultTextRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /** Whether a text area has been detected */
    //% block="whether text region detected"
    //% weight=118
    //% subcategory="optical char recognition"
    export function availableTextRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /** Attributes of the text area close to the center */
    //% block="text region near center %property"
    //% weight=117
    //% subcategory="optical char recognition"
    export function cachedCenterTextResult(property: BasePropertyContentId): any {
        const r = cachedCenterResultInternal(Algorithm.AlgorithmOcrRecognition);
        return getTextPropertyValue(r, property);
    }

    /** Total number of learned text areas */
    //% block="number of learned text region IDs"
    //% weight=114
    //% subcategory="optical char recognition"
    export function totalLearnedTextIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmOcrRecognition);
    }

    /** Check if the text area with the specified id exists */
    //% block="does text region id %index exist?"
    //% weight=113
    //% index.min=1 index.defl=1
    //% subcategory="optical char recognition"
    export function textIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmOcrRecognition, index);
        return r != null;
    }

    /** Text area attribute with specified id */
    //% block="text region id %index %property"
    //% weight=111
    //% index.min=1 index.defl=1
    //% subcategory="optical char recognition"
    export function textPropertyByID(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmOcrRecognition, index);
        return getTextPropertyValue(r, property);
    }

    // ============================================================= line tracking ====================================================
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

    // line tracking properties
    export enum LineTrackingProperty {
        //% block="x component"
        XComponent,
        //% block="y component"
        YComponent,
        //% block="angle"
        Angle,
        //% block="length"
        Length,
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

    /** Attributes of the current route */
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

    /** Attributes of the Nth branch route counterclockwise */
    //% block="branch %index counterclockwise %property"
    //% weight=105
    //% index.min=1 index.defl=1
    //% subcategory="line tracking"
    export function lineTrackingBranchProperty(index: number, property: LineTrackingProperty): number {
        const r = getBranchInternal(Algorithm.AlgorithmLineTracking, index - 1);
        return getLineTrackingPropertyValue(r, property);
    }

    // ======================================================== face emotion recognition ==============================================
    function getEmotionPropertyValue(result: ResultVariant, prop: BasePropertyId): number {
        return getBasePropertyValue(result, prop as any);
    }

    function getEmotionPropertyValueID(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

        /** Get one-time face emotion recognition result and cache it */
    //% block="get face emotion recognition result"
    //% weight=104
    //% subcategory="face emotion recognition"
    export function getResultEmotionRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /** Whether an emotion is detected */
    //% block="whether emotion detected"
    //% weight=103
    //% subcategory="face emotion recognition"
    export function availableEmotionRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /** Emotion attributes near the center */
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

    /** Attributes of the Nth emotion */
    //% block="emotion %index %property"
    //% weight=100
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function cachedResultEmotionProperty(index: number, property: BasePropertyId): number {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmEmotionRecognition, index - 1);
        return getEmotionPropertyValue(r, property);
    }

    /** Total number of learned emotion IDs */
    //% block="number of learned emotion IDs"
    //% weight=99
    //% subcategory="face emotion recognition"
    export function totalLearnedEmotionIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmEmotionRecognition);
    }

    /** Check if an emotion with a specific ID exists */
    //% block="does emotion id %index exist?"
    //% weight=98
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function emotionIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmEmotionRecognition, index);
        return r != null;
    }

    /** Number of emotions with a specific ID */
    //% block="number of emotions with id %index"
    //% weight=97
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function totalEmotionByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmEmotionRecognition, index);
    }

    /** Attributes of an emotion with a specific ID */
    //% block="emotion id %index %property"
    //% weight=96
    //% index.min=1 index.defl=1
    //% subcategory="face emotion recognition"
    export function emotionPropertyByID(index: number, property: BaseProperty): number {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmEmotionRecognition, index);
        return getEmotionPropertyValueID(r, property);
    }

    /** Attributes of the Nth emotion with a specific ID */
    //% block="emotion id %id No.%n %property"
    //% weight=95
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="face emotion recognition"
    export function emotionPropertyByIDNth(id: number, n: number, property: BaseProperty): number {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmEmotionRecognition, id, n - 1);
        return getEmotionPropertyValueID(r, property);
    }

    // =========================================================== tag recognition ====================================================

    function getTagPropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentId.Id: return res.id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }

    //% block="get tag recognition result"
    //% weight=94
    //% subcategory="tag recognition"
    export function getResultTagRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmTagRecognition);
    }

    /** Whether a tag is detected */
    //% block="whether tag detected"
    //% weight=93
    //% subcategory="tag recognition"
    export function availableTagRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmTagRecognition);
    }

    /** Tag attributes near the center */
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

    /** Attributes of the Nth tag */
    //% block="tag %index %property"
    //% weight=90
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function cachedResultTagProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmTagRecognition, index - 1);
        return getTagPropertyValue(r, property);
    }

    /** Total number of learned tag IDs */
    //% block="number of learned tag IDs"
    //% weight=89
    //% subcategory="tag recognition"
    export function totalLearnedTagIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmTagRecognition);
    }

    /** Check if a tag with a specific ID exists */
    //% block="does tag id %index exist?"
    //% weight=88
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function tagIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmTagRecognition, index);
        return r != null;
    }

    /** Number of tags with a specific ID */
    //% block="number of tags with id %index"
    //% weight=87
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function totalTagByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmTagRecognition, index);
    }

    /** Attributes of a tag with a specific ID */
    //% block="tag id %index %property"
    //% weight=86
    //% index.min=1 index.defl=1
    //% subcategory="tag recognition"
    export function tagPropertyByID(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmTagRecognition, index);
        return getTagPropertyValue(r, property);
    }

    /** Attributes of the Nth tag with a specific ID */
    //% block="tag id %id No.%n %property"
    //% weight=85
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="tag recognition"
    export function tagPropertyByIDNth(id: number, n: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmTagRecognition, id, n - 1);
        return getTagPropertyValue(r, property);
    }

    // =================================================================== QR code recognition =====================================
    function getQRCodePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentId.Id: return res.id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }


    //% block="get QR code recognition result"
    //% weight=84
    //% subcategory="QR code recognition"
    export function getResultQRCodeRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /** Whether a QR code is detected */
    //% block="whether QR code detected"
    //% weight=83
    //% subcategory="QR code recognition"
    export function availableQRCodeRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /** QR code attributes near the center */
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

    /** Attributes of the Nth QR code */
    //% block="QR code %index %property"
    //% weight=80
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function cachedResultQRCodeProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmQrCodeRecognition, index - 1);
        return getQRCodePropertyValue(r, property);
    }

    /** Total number of learned QR code IDs */
    //% block="number of learned QR code IDs"
    //% weight=79
    //% subcategory="QR code recognition"
    export function totalLearnedQRCodeIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmQrCodeRecognition);
    }

    /** Check if a QR code with a specific ID exists */
    //% block="does QR code id %index exist?"
    //% weight=78
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function qrcodeIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmQrCodeRecognition, index);
        return r != null;
    }

    /** Number of QR codes with a specific ID */
    //% block="number of QR codes with id %index"
    //% weight=77
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function totalQRCodeByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmQrCodeRecognition, index);
    }

    /** Attributes of a QR code with a specific ID */
    //% block="QR code id %index %property"
    //% weight=76
    //% index.min=1 index.defl=1
    //% subcategory="QR code recognition"
    export function QRCodePropertyByID(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmQrCodeRecognition, index);
        return getQRCodePropertyValue(r, property);
    }

    /** Attributes of the Nth QR code with a specific ID */
    //% block="QR code id %id No.%n %property"
    //% weight=75
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="QR code recognition"
    export function QRCodePropertyByIDNth(id: number, n: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmQrCodeRecognition, id, n - 1);
        return getQRCodePropertyValue(r, property);
    }

    // ===================================================== barcode recognition" ==============================================



    function getBarcodePropertyValue(result: ResultVariant, prop: number): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BasePropertyContentId.Id: return res.id;
            case BasePropertyContentId.Name: return res.name.length > 0 ? res.name : "";
            case BasePropertyContentId.Content: return res.content.length > 0 ? res.content : "";
            case BasePropertyContentId.XCenter: return res.xCenter;
            case BasePropertyContentId.YCenter: return res.yCenter;
            case BasePropertyContentId.Width: return res.width;
            case BasePropertyContentId.Height: return res.height;
            default: return 0;
        }
    }


    //% block="get barcode recognition result"
    //% weight=74
    //% subcategory="barcode recognition"
    export function getResultBarcodeRecogtion(): void {
        getResultInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /** Whether a barcode is detected */
    //% block="whether barcode detected"
    //% weight=73
    //% subcategory="barcode recognition"
    export function availableBarcodeRecogtion(): boolean {
        return availableInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /** Barcode attributes near the center */
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

    /** Attributes of the Nth barcode */
    //% block="barcode %index %property"
    //% weight=70
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function cachedResultBarcodeProperty(index: number, property: BasePropertyContentId): any {
        const r = cachedResultByIndexInternal(Algorithm.AlgorithmBarcodeRecognition, index - 1);
        return getBarcodePropertyValue(r, property);
    }

    /** Total number of learned barcode IDs */
    //% block="number of learned barcode IDs"
    //% weight=69
    //% subcategory="barcode recognition"
    export function totalLearnedBarcodeIDs(): number {
        return cachedResultLearnedNumInternal(Algorithm.AlgorithmBarcodeRecognition);
    }

    /** Check if a barcode with a specific ID exists */
    //% block="does barcode id %index exist?"
    //% weight=68
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function barcodeIdExists(index: number): boolean {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmBarcodeRecognition, index);
        return r != null;
    }

    /** Number of barcodes with a specific ID */
    //% block="number of barcodes with id %index"
    //% weight=67
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function totalBarcodeByID(index: number): number {
        return cachedResultNumByIDInternal(Algorithm.AlgorithmBarcodeRecognition, index);
    }

    /** Attributes of a barcode with a specific ID */
    //% block="barcode id %index %property"
    //% weight=66
    //% index.min=1 index.defl=1
    //% subcategory="barcode recognition"
    export function barcodePropertyByID(index: number, property: BasePropertyContent): any {
        const r = cachedResultByIDInternal(Algorithm.AlgorithmBarcodeRecognition, index);
        return getBarcodePropertyValue(r, property);
    }

    /** Attributes of the Nth barcode with a specific ID */
    //% block="barcode id %id No.%n %property"
    //% weight=65
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% subcategory="barcode recognition"
    export function barcodePropertyByIDNth(id: number, n: number, property: BasePropertyContent): any {
        const r = cachedIndexResultByIDInternal(Algorithm.AlgorithmBarcodeRecognition, id, n - 1);
        return getBarcodePropertyValue(r, property);
    }

    // ================= Custom Model =================

    function getCustomModelPropertyValue(result: ResultVariant, prop: BaseProperty): number {
        return getBasePropertyValue(result, prop as any);
    }

    function getCustomModelPropertyValueID(result: ResultVariant, prop: BasePropertyId): number {
        return getBasePropertyValue(result, prop as any);
    }



    /** HUSKYLENS 2 switching algorithm id until successful */
    //% blockHidden=true
    //% block="HUSKYLENS 2 switch algorithm id %algorithmId until success"
    //% weight=64
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function switchCustomModelAlgorithm(algorithmId: number): void {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        switchAlgorithmInternal(algoId);
    }

    /** Request for algorithm id to store data once */
    //% blockHidden=true
    //% block="algorithm id %algorithmId request data and store result"
    //% weight=63
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function getResultCustomModel(algorithmId: number): void {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        getResultInternal(algoId);
    }

    /** Algorithm id detects the target */
    //% blockHidden=true
    //% block="algorithm id %algorithmId target detected?"
    //% weight=62
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function availableCustomModel(algorithmId: number): boolean {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return availableInternal(algoId);
    }

    /** Target attribute with algorithm id close to the center */
    //% blockHidden=true
    //% block="algorithm id %algorithmId target near center %alg1"
    //% weight=61
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function cachedCenterCustomModelResult(algorithmId: number, alg1: BasePropertyId): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedCenterResultInternal(algoId);
        return getCustomModelPropertyValueID(r, alg1);
    }

    /** The total number of targets detected by the algorithm id */
    //% blockHidden=true
    //% block="algorithm id %algorithmId number of detected targets"
    //% weight=60
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function cachedResultNumCustomModel(algorithmId: number): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultNumInternal(algoId);
    }

    /** The attribute of the num-th target of the algorithm id */
    //% blockHidden=true
    //% block="algorithm id %algorithmId target %num %alg1"
    //% weight=59
    //% algorithmId.min=1 algorithmId.defl=128
    //% num.min=1 num.defl=1
    //% subcategory="custom model"
    export function cachedResultCustomModelProperty(algorithmId: number, num: number, alg1: BasePropertyId): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIndexInternal(algoId, num - 1);
        return getCustomModelPropertyValueID(r, alg1);
    }

    /** The total number of target IDs that the algorithm has learned */
    //% blockHidden=true
    //% block="algorithm id %algorithmId number of learned target IDs"
    //% weight=58
    //% algorithmId.min=1 algorithmId.defl=128
    //% subcategory="custom model"
    export function totalLearnedCustomModelIDs(algorithmId: number): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultLearnedNumInternal(algoId);
    }

    /** The objective of Algorithm id exists. */
    //% blockHidden=true
    //% block="algorithm id %algorithmId target id %targetId exists?"
    //% weight=57
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function customModelIdExists(algorithmId: number, targetId: number): boolean {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIDInternal(algoId, targetId);
        return r != null;
    }

    /** The total target number of Algorithm id id */
    //% blockHidden=true
    //% block="algorithm id %algorithmId number of targets with id %targetId"
    //% weight=56
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function totalCustomModelByID(algorithmId: number, targetId: number): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        return cachedResultNumByIDInternal(algoId, targetId);
    }

    /** The target attribute of Algorithm id id */
    //% blockHidden=true
    //% block="algorithm id %algorithmId target id %targetId %alg2"
    //% weight=55
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% subcategory="custom model"
    export function customModelPropertyByID(algorithmId: number, targetId: number, alg2: BaseProperty): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedResultByIDInternal(algoId, targetId);
        return getCustomModelPropertyValue(r, alg2);
    }

    /** The attribute of the num-th target of algorithm id id */
    //% blockHidden=true
    //% block="algorithm %algorithmId id%targetId No.%num %alg2"
    //% inlineInputMode=inline
    //% weight=54
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% num.min=1 num.defl=1
    //% subcategory="custom model"
    export function customModelPropertyByIDNth(algorithmId: number, targetId: number, num: number, alg2: BaseProperty): number {
        const algoId = Algorithm.AlgorithmCustomBegin + (algorithmId - 1);
        const r = cachedIndexResultByIDInternal(algoId, targetId, num - 1);
        return getCustomModelPropertyValue(r, alg2);
    }
}