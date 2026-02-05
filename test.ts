huskylens2.I2CInit()
huskylens2.switchAlgorithm(huskylens2.Algorithm.AlgorithmFaceRecognition)
huskylens2.playMusic("music.mp3", 50)
huskylens2.takePhoto()
basic.showString(huskylens2.storedPhotoName())
huskylens2.takeScreenshot()
basic.showString(huskylens2.storedScreenshotName())
huskylens2.drawBox(
0,
0,
0,
0,
0,
0
)
basic.forever(function () {
    basic.showNumber(huskylens2.getLearnedID())
    huskylens2.learnObjectAtCenter(huskylens2.AlgorithmLearnObjectAtCenter.AlgorithmFaceRecognition)
    huskylens2.learnObjectAtCenterNUM(128)
    huskylens2.learnObjectInBox(
    huskylens2.AlgorithmLearnObjectInBox.AlgorithmFaceRecognition,
    0,
    0,
    0,
    0
    )
    huskylens2.learnObjectInBoxNUM(
    128,
    0,
    0,
    0,
    0
    )
    huskylens2.forgetAllIDs(huskylens2.Algorithm.AlgorithmFaceRecognition)
    huskylens2.forgetAllIDsNUM(128)
    huskylens2.setNameOfID(huskylens2.AlgorithmLearnSetNameOfId.AlgorithmFaceRecognition, 1, "object")
})
basic.forever(function () {
    huskylens2.getResultFaceRecogtion()
    basic.showString("" + (huskylens2.availableFaceRecogtion()))
    basic.showNumber(huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumFace())
    basic.showNumber(huskylens2.cachedResultFaceProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedFaceIDs())
    basic.showString("" + (huskylens2.faceIdExists(1)))
    basic.showNumber(huskylens2.totalFaceByID(1))
    basic.showNumber(huskylens2.facePropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.facePropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultObjectRecogtion()
    basic.showString("" + (huskylens2.availableObjectRecogtion()))
    basic.showNumber(huskylens2.cachedCenterObjectResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumObject())
    basic.showNumber(huskylens2.cachedResultObjectProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedObjectIDs())
    basic.showString("" + (huskylens2.objectIdExists(1)))
    basic.showNumber(huskylens2.totalObjectByID(1))
    basic.showNumber(huskylens2.objectPropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.objectPropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultColorRecogtion()
    basic.showString("" + (huskylens2.availableColorRecogtion()))
    basic.showNumber(huskylens2.cachedCenterColorResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumColor())
    basic.showNumber(huskylens2.totalLearnedColorIDs())
    basic.showNumber(huskylens2.cachedResultColorProperty(1, huskylens2.BasePropertyId.Id))
    basic.showString("" + (huskylens2.colorIdExists(1)))
    basic.showNumber(huskylens2.totalColorByID(1))
    basic.showNumber(huskylens2.colorPropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.colorPropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultObjectTracking()
    basic.showString("" + (huskylens2.availableObjectTracking()))
    basic.showNumber(huskylens2.cachedObjectTrackingResult(huskylens2.BasePropertyId.Id))
})
basic.forever(function () {
    huskylens2.getResultInstanceRecogtion()
    basic.showString("" + (huskylens2.availableInstanceRecogtion()))
    basic.showNumber(huskylens2.cachedCenterInstanceResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumInstance())
    basic.showNumber(huskylens2.cachedResultInstanceProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedInstanceIDs())
    basic.showString("" + (huskylens2.instanceIdExists(1)))
    basic.showNumber(huskylens2.totalInstanceByID(1))
    basic.showNumber(huskylens2.instancePropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.instancePropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultGestureRecogtion()
    basic.showString("" + (huskylens2.availableGestureRecogtion()))
    basic.showNumber(huskylens2.cachedCenterGestureResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumGesture())
    basic.showNumber(huskylens2.cachedResultGestureProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedGestureIDs())
    basic.showString("" + (huskylens2.gestureIdExists(1)))
    basic.showNumber(huskylens2.totalGestureByID(1))
    basic.showNumber(huskylens2.gesturePropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.gesturePropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultObjectClassification()
    basic.showString("" + (huskylens2.availableObjectClassification()))
    basic.showNumber(huskylens2.cachedResultNumObjectClassification())
    basic.showNumber(huskylens2.cachedObjectClassificationResult(1, huskylens2.ObjectClassificationProperty.Id))
    huskylens2.getResultSelfLearningClassification()
    basic.showString("" + (huskylens2.availableSelfLearningClassification()))
    basic.showNumber(huskylens2.cachedSelfLearningClassificationResult(huskylens2.SelfLearningClassificationProperty.Id))
})
basic.forever(function () {
    huskylens2.getResultPoseRecogtion()
    basic.showString("" + (huskylens2.availablePoseRecogtion()))
    basic.showNumber(huskylens2.cachedCenterPoseResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumPose())
    basic.showNumber(huskylens2.cachedResultPoseProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedPoseIDs())
    basic.showString("" + (huskylens2.poseIdExists(1)))
    basic.showNumber(huskylens2.totalPoseByID(1))
    basic.showNumber(huskylens2.posePropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.posePropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultPlateRecogtion()
    basic.showString("" + (huskylens2.availablePlateRecogtion()))
    basic.showNumber(huskylens2.cachedCenterPlateResult(huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.cachedResultNumPlate())
    basic.showNumber(huskylens2.cachedResultPlateProperty(1, huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.totalLearnedPlateIDs())
    basic.showString("" + (huskylens2.plateIdExists(1)))
    basic.showNumber(huskylens2.totalPlateByID(1))
    basic.showNumber(huskylens2.platePropertyByID(1, huskylens2.BasePropertyContent.Name))
    basic.showNumber(huskylens2.platePropertyByIDNth(1, 1, huskylens2.BasePropertyContent.Name))
})
basic.forever(function () {
    huskylens2.getResultTextRecogtion()
    basic.showString("" + (huskylens2.availableTextRecogtion()))
    basic.showNumber(huskylens2.cachedCenterTextResult(huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.totalLearnedTextIDs())
    basic.showString("" + (huskylens2.textIdExists(1)))
    basic.showNumber(huskylens2.textPropertyByID(1, huskylens2.BasePropertyContent.Name))
    huskylens2.getResultLineTracking()
    basic.showString("" + (huskylens2.availableLineTracking()))
    basic.showNumber(huskylens2.cachedLineTrackingResult(huskylens2.LineTrackingProperty.XComponent))
    basic.showNumber(huskylens2.lineTrackingBranchCount())
    basic.showNumber(huskylens2.lineTrackingBranchProperty(1, huskylens2.LineTrackingProperty.XComponent))
})
basic.forever(function () {
    huskylens2.getResultEmotionRecogtion()
    basic.showString("" + (huskylens2.availableEmotionRecogtion()))
    basic.showNumber(huskylens2.cachedCenterEmotionResult(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.cachedResultNumEmotion())
    basic.showNumber(huskylens2.cachedResultEmotionProperty(1, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalLearnedEmotionIDs())
    basic.showString("" + (huskylens2.emotionIdExists(1)))
    basic.showNumber(huskylens2.totalEmotionByID(1))
    basic.showNumber(huskylens2.emotionPropertyByID(1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.emotionPropertyByIDNth(1, 1, huskylens2.BaseProperty.Name))
})
basic.forever(function () {
    huskylens2.getResultTagRecogtion()
    basic.showString("" + (huskylens2.availableTagRecogtion()))
    basic.showNumber(huskylens2.cachedCenterTagResult(huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.cachedResultNumTag())
    basic.showNumber(huskylens2.cachedResultTagProperty(1, huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.totalLearnedTagIDs())
    basic.showString("" + (huskylens2.tagIdExists(1)))
    basic.showNumber(huskylens2.totalTagByID(1))
    basic.showNumber(huskylens2.tagPropertyByID(1, huskylens2.BasePropertyContent.Name))
    basic.showNumber(huskylens2.tagPropertyByIDNth(1, 1, huskylens2.BasePropertyContent.Name))
})
basic.forever(function () {
    huskylens2.getResultQRCodeRecogtion()
    basic.showString("" + (huskylens2.availableQRCodeRecogtion()))
    basic.showNumber(huskylens2.cachedCenterQRCodeResult(huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.cachedResultNumQRCode())
    basic.showNumber(huskylens2.cachedResultQRCodeProperty(1, huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.totalLearnedQRCodeIDs())
    basic.showString("" + (huskylens2.qrcodeIdExists(1)))
    basic.showNumber(huskylens2.totalQRCodeByID(1))
    basic.showNumber(huskylens2.QRCodePropertyByID(1, huskylens2.BasePropertyContent.Name))
    basic.showNumber(huskylens2.QRCodePropertyByIDNth(1, 1, huskylens2.BasePropertyContent.Name))
})
basic.forever(function () {
    huskylens2.getResultBarcodeRecogtion()
    basic.showString("" + (huskylens2.availableBarcodeRecogtion()))
    basic.showNumber(huskylens2.cachedCenterBarcodeResult(huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.cachedResultNumBarcode())
    basic.showNumber(huskylens2.cachedResultBarcodeProperty(1, huskylens2.BasePropertyContentId.Id))
    basic.showNumber(huskylens2.totalLearnedBarcodeIDs())
    basic.showString("" + (huskylens2.barcodeIdExists(1)))
    basic.showNumber(huskylens2.totalBarcodeByID(1))
    basic.showNumber(huskylens2.barcodePropertyByID(1, huskylens2.BasePropertyContent.Name))
    basic.showNumber(huskylens2.barcodePropertyByIDNth(1, 1, huskylens2.BasePropertyContent.Name))
})
basic.forever(function () {
    huskylens2.requestFallDetectionData()
    basic.showString("" + (huskylens2.fallDetected()))
    basic.showNumber(huskylens2.nearestFallDetection(huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.totalFallDetections())
    basic.showNumber(huskylens2.fallDetectionProperty(1, huskylens2.BasePropertyId.Id))
})
basic.forever(function () {
    huskylens2.requestFaceOrientationData()
    basic.showString("" + (huskylens2.faceOrientationDetected()))
    basic.showNumber(huskylens2.nearestFaceOrientation(huskylens2.FaceOrientationProperty.Id))
    basic.showNumber(huskylens2.totalFaceOrientations())
    basic.showNumber(huskylens2.totalLearnedFaceOrientations())
    basic.showNumber(huskylens2.faceOrientationProperty(1, huskylens2.FaceOrientationProperty.Id))
    basic.showString("" + (huskylens2.faceOrientationIDExists(1)))
    basic.showNumber(huskylens2.totalFaceOrientationsWithID(1))
    basic.showNumber(huskylens2.faceOrientationWithID(1, huskylens2.FaceOrientationPropertyId.Name))
    basic.showNumber(huskylens2.faceOrientationWithIDProperty(1, 1, huskylens2.FaceOrientationPropertyId.Name))
})
basic.forever(function () {
    huskylens2.selfTrainedModelswitchAlgorithm(128)
    huskylens2.requestData(128)
    basic.showString("" + (huskylens2.Detected(128)))
    basic.showNumber(huskylens2.nearest(128, huskylens2.BasePropertyId.Id))
    basic.showNumber(huskylens2.total(128))
    basic.showNumber(huskylens2.totalLearned(128))
    basic.showNumber(huskylens2.Property(128, 1, huskylens2.BasePropertyId.Id))
    basic.showString("" + (huskylens2.IDExists(128, 1)))
    basic.showNumber(huskylens2.totalWithID(128, 1))
    basic.showNumber(huskylens2.WithID(128, 1, huskylens2.BaseProperty.Name))
    basic.showNumber(huskylens2.WithIDProperty(
    128,
    1,
    1,
    huskylens2.BaseProperty.Name
    ))
})
basic.forever(function () {
    huskylens2.requestEyeGazeData()
    basic.showString("" + (huskylens2.eyeGazeDetected()))
    basic.showNumber(huskylens2.nearestEyeGaze(huskylens2.EyeGazeProperty.Id))
    basic.showNumber(huskylens2.totalEyeGazes())
    basic.showNumber(huskylens2.totalLearnedEyeGazes())
    basic.showNumber(huskylens2.eyeGazeProperty(1, huskylens2.EyeGazeProperty.Id))
    basic.showString("" + (huskylens2.gazeIDExists(1)))
    basic.showNumber(huskylens2.totalEyeGazesWithID(1))
    basic.showNumber(huskylens2.gazeWithID(1, huskylens2.EyeGazePropertyId.Name))
    basic.showNumber(huskylens2.gazeWithIDProperty(1, 1, huskylens2.EyeGazePropertyId.Name))
})
basic.forever(function () {
    huskylens2.showText(
    0,
    huskylens2.FontSize.Font20,
    0,
    0,
    ""
    )
    huskylens2.drawNewBox(
    0,
    0,
    0,
    0,
    0,
    0
    )
    huskylens2.clearText()
    huskylens2.clearBoxes()
    basic.showNumber(huskylens2.setRGB(0, 0, 0))
})
