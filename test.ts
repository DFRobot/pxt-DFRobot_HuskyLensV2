huskylensV2.I2CInit()
huskylensV2.switchAlgorithm(huskylensV2.Algorithm.ALGORITHM_FACE_RECOGNITION)
basic.forever(function () {
    huskylensV2.getResultFaceRecogtion()
    if (huskylensV2.availableFaceRecogtion()) {
        serial.writeLine("ID:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.ID))
        serial.writeLine("NAME:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.Name))
        serial.writeLine("X:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.XCenter))
        serial.writeLine("Y:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.YCenter))
        serial.writeLine("W:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.Width))
        serial.writeLine("H:" + huskylensV2.getCachedCenterResult(huskylensV2.BasePropertyID.Height))
        serial.writeLine("----")
    }
})