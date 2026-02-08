huskylens2.I2CInit()
huskylens2.switchAlgorithm(Algorithm.AlgorithmFaceRecognition)
basic.forever(function () {
    huskylens2.getResultFaceRecognition()
    if (huskylens2.availableFaceRecognition()) {
        serial.writeLine("Id:" + huskylens2.cachedCenterResult(BasePropertyId.Id))
        serial.writeLine("NAME:" + huskylens2.cachedCenterResult(BasePropertyId.Name))
        serial.writeLine("X:" + huskylens2.cachedCenterResult(BasePropertyId.XCenter))
        serial.writeLine("Y:" + huskylens2.cachedCenterResult(BasePropertyId.YCenter))
        serial.writeLine("W:" + huskylens2.cachedCenterResult(BasePropertyId.Width))
        serial.writeLine("H:" + huskylens2.cachedCenterResult(BasePropertyId.Height))
        serial.writeLine("----")
    }
})