# HuskyLens 2

[HUSKYLENS 2 is an easy-to-play AI vision sensor that provides a variety of AI vision functions, such as object detection, pose recognition, and instance segmentation.](https://www.dfrobot.com/product-2995.html)
## Basic usage

## Example
HuskyLens 2 offers a very detailed tutorial on using MakeCode.(https://wiki.dfrobot.com/Tutorial%20for%20HUSKYLENS%202%20and%20micro:bit%20Graphical%20Programming(MakeCode))

* HuskyLens 2 Init I2C and select pattern.

```blocks
    huskylens2.I2CInit()
    huskylens2.switchAlgorithm(huskylens2.Algorithm.AlgorithmFaceRecognition)

```

* HuskyLens 2 collects data for facial recognition and outputs it.

```blocks
    basic.forever(function () {
        huskylens2.getResultFaceRecogtion()
        if (huskylens2.availableFaceRecogtion()) {
            serial.writeLine("id:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Id))
            serial.writeLine("NAME:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Name))
            serial.writeLine("X:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.XCenter))
            serial.writeLine("Y:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.YCenter))
            serial.writeLine("W:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Width))
            serial.writeLine("H:" + huskylens2.cachedCenterResult(huskylens2.BasePropertyId.Height))
            serial.writeLine("----")
        }
    })

```


## License

MIT

Copyright (c) 2020, microbit/micropython Chinese community  

## Supported targets

* for PXT/microbit