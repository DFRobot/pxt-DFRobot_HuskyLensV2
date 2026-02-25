/** 
 * @file huskylens2_protocol.ts
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
    // ==================== Low-level communication Code ====================
    
    //For internal use only
    export const enum Macro {
        I2cAddr = 0x50,
        // ===================== Commands ====================
        CommandKnock = 0x00,
        CommandGetResult = 0x01,
        CommandGetAlgoParam = 0x02,
        CommandGetResultById = 0x03,
        CommandGetBlocksById = 0x04,
        CommandGetArrowsById = 0x05,
        // RFU 0x06 - 0x09
        CommandSetAlgorithm = 0x0A,
        CommandSetNameById = 0x0B,
        CommandSetMultiAlgorithm = 0x0C,
        CommandSetMultiAlgorithmRatio = 0x0D,
        CommandSetAlgoParams = 0x0E,
        CommandUpdateAlgorithmParams = 0x0F,
        // RFU 0x0F - 0x19
        CommandReturnArgs = 0x1A,
        CommandReturnInfo = 0x1B,
        CommandReturnBlock = 0x1C,
        CommandReturnArrow = 0x1D,
        // RFU 0x1E - 0x1F
        CommandActionTakePhoto = 0x20,
        CommandActionTakeScreenshot = 0x21,
        CommandActionLearn = 0x22,
        CommandActionForget = 0x23,
        CommandActionSaveKnowledges = 0x24,
        CommandActionLoadKnowledges = 0x25,
        CommandActionDrawRect = 0x26,
        CommandActionClearRect = 0x27,
        CommandActionDrawText = 0x28,
        CommandActionClearText = 0x29,
        CommandActionPlayMusic = 0x2A,
        CommandExit = 0x2B,
        CommandActionLearnBlock = 0x2C,
        CommandActionDrawUniqueRect = 0x2D,
        CommandActionStartRecording = 0x2E,
        CommandActionStopRecording = 0x2F,
        // RFU 0x30 - 0x3F

        // ===================== Memory Layout ====================
        FrameBufferSize = 128,
        MaxResultNum = 6,
        CmdBufferSize = 32,
        AlgorithmCount = 1,
        CustomAlgorithmCount = 1,
        // ===================== LCD Screen ====================
        LcdWidth = 640,
        LcdHeight = 480,
        //===================== Packet Head ====================
        Header0Index = 0,
        Header1Index = 1,
        CommandIndex = 2,
        AlgoIndex = 3,
        ContentSizeIndex = 4,
        ContentIndex = 5,
        ProtocolSize = 6,
        //===================== Time out ====================
        Timeout = 2000
    }
    
    class PacketHead {
        static readonly HEADER_SIZE = 5;

        head55: number;
        headaa: number;
        cmd: number;
        algorithmId: number;
        dataLength: number;
        data: Buffer;
        name?: string;
        cs: number;
        static checksum(buf: Buffer): number {
            let sum = 0;
            for (let i = 0; i < buf.length; i++) {
                sum = (sum + buf[i]) & 0xFF;
            }
            return sum;
        }

        constructor(buffer: Buffer) {
            // In MakeCode, don't use throw, initialize directly (if buffer is too short, it will cause read errors)
            this.head55 = buffer.length > 0 ? buffer[0] : 0;
            this.headaa = buffer.length > 1 ? buffer[1] : 0;
            this.cmd = buffer.length > 2 ? buffer[2] : 0;
            this.algorithmId = buffer.length > 3 ? buffer[3] : 0;
            this.dataLength = buffer.length > 4 ? buffer[4] : 0;

            const expectedLength = PacketHead.HEADER_SIZE + this.dataLength + 1;
            if (buffer.length < expectedLength) {
                // If buffer is incomplete, use empty Buffer
                this.data = Buffer.create(0);
                this.cs = 0;
            } else {
                this.data = buffer.slice(5, 5 + this.dataLength);
                this.cs = buffer[5 + this.dataLength];
            }
        }

        static fromFields(fields: {
            head55?: number;
            headaa?: number;
            cmd: number;
            algorithmId: number;
            data?: Buffer;
            name?: string;
        }): Buffer {
            const data = fields.data ? fields.data : Buffer.create(0);
            const name_data = fields.name ? Buffer.fromUTF8(fields.name) : Buffer.create(0);
            let length = PacketHead.HEADER_SIZE + data.length + 1;

            let total_length = PacketHead.HEADER_SIZE + data.length + 1;
            if (name_data.length > 0) {
                total_length += name_data.length + 1;
            }
            const buf = Buffer.create(total_length);

            buf[0] = fields.head55 !== undefined ? fields.head55 : 0x55;
            buf[1] = fields.headaa !== undefined ? fields.headaa : 0xaa;
            buf[2] = fields.cmd;
            buf[3] = fields.algorithmId;
            buf[4] = data.length;
            if (name_data.length > 0) {
                buf[4] += name_data.length + 1;
            }
            for (let i = 0; i < data.length; i++) {
                buf[5 + i] = data[i];
            }
            if (name_data.length > 0) {
                buf[5 + data.length] = name_data.length;
                for (let i = 0; i < name_data.length; i++) {
                    buf[5 + data.length + 1 + i] = name_data[i];
                }
            }

            const cs = PacketHead.checksum(buf.slice(0, PacketHead.HEADER_SIZE + total_length - 1));
            buf[total_length - 1] = cs;

            return buf;
        }

        verifyChecksum(): boolean {
            const buf = Buffer.create(PacketHead.HEADER_SIZE + this.dataLength);
            buf[0] = this.head55;
            buf[1] = this.headaa;
            buf[2] = this.cmd;
            buf[3] = this.algorithmId;
            buf[4] = this.dataLength;
            for (let i = 0; i < this.data.length; i++) {
                buf[5 + i] = this.data[i];
            }

            const cs = PacketHead.checksum(buf);
            return cs === this.cs;
        }
    }

    class PacketData {
        buffer: Buffer;
        constructor(sizeOrBuffer: number | Buffer = 10) {
            if (typeof sizeOrBuffer === "number") {
                this.buffer = Buffer.create(sizeOrBuffer);
            } else {
                this.buffer = sizeOrBuffer;
            }
        }

        static from(buffer: Buffer): PacketData {
            return new PacketData(buffer);
        }

        // First union - uint8_t type
        get Id() { return this.buffer[0] }
        set Id(v: number) { this.buffer[0] = v & 0xff; }

        get maxId() { return this.buffer[0] }
        set maxId(v: number) { this.buffer[0] = v & 0xff; }

        get rfu0() { return this.buffer[0] }
        set rfu0(v: number) { this.buffer[0] = v & 0xff; }

        get resolution() { return this.buffer[0] }  // Added: resolution
        set resolution(v: number) { this.buffer[0] = v & 0xff; }

        get boardType() { return this.buffer[0] }
        set boardType(v: number) { this.buffer[0] = v & 0xff; }

        get multiAlgoNum() { return this.buffer[0] }
        set multiAlgoNum(v: number) { this.buffer[0] = v & 0xff; }

        // Second union - int8_t type
        get rfu1() { return this.buffer[1]; }
        set rfu1(v: number) { this.buffer[1] = v & 0xff; }

        get level() { return this.buffer[1]; }
        set level(v: number) { this.buffer[1] = v & 0xff; }

        get mediaType() { return this.buffer[1]; }  // Added: media type
        set mediaType(v: number) { this.buffer[1] = v & 0xff; }

        get retValue() { return this.buffer[1]; }  // Added: return value
        set retValue(v: number) { this.buffer[1] = v & 0xff; }

        get lineWidth() { return this.buffer[1]; }  // Added: line width
        set lineWidth(v: number) { this.buffer[1] = v & 0xff; }

        get confidence() { return this.buffer[1]; }
        set confidence(v: number) { this.buffer[1] = v & 0xff; }
        // Third union - int16_t (buffer[2], buffer[3])
        get first() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set first(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get xCenter() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set xCenter(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get xTarget() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set xTarget(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get duration() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set duration(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get algorithmId() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set algorithmId(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get classId() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set classId(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get total_results() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set total_results(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get pitch() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set pitch(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        // Fourth union - int16_t (buffer[4], buffer[5])
        get second() { const value = this.buffer[4] + this.buffer[5] * 256; return value > 32767 ? value - 65536 : value; }
        set second(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }

        get yCenter() { const value = this.buffer[4] + this.buffer[5] * 256; return value > 32767 ? value - 65536 : value; }
        set yCenter(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }

        get yTarget() { const value = this.buffer[4] + this.buffer[5] * 256; return value > 32767 ? value - 65536 : value; }
        set yTarget(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }

        get total_results_learned() { const value = this.buffer[4] + this.buffer[5] * 256; return value > 32767 ? value - 65536 : value; }
        set total_results_learned(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }

        get yaw() { const value = this.buffer[4] + this.buffer[5] * 256; return value > 32767 ? value - 65536 : value; }
        set yaw(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }

        // Fifth union - int16_t (buffer[6], buffer[7])
        get third() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set third(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        get width() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set width(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        get angle() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set angle(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        get azimuth() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set azimuth(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        get total_blocks() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set total_blocks(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        get roll() { const value = this.buffer[6] + this.buffer[7] * 256; return value > 32767 ? value - 65536 : value; }
        set roll(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }

        // Sixth union - int16_t (buffer[8], buffer[9])
        get fourth() { const value = this.buffer[8] + this.buffer[9] * 256; return value > 32767 ? value - 65536 : value; }
        set fourth(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }

        get height() { const value = this.buffer[8] + this.buffer[9] * 256; return value > 32767 ? value - 65536 : value; }
        set height(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }

        get length() { const value = this.buffer[8] + this.buffer[9] * 256; return value > 32767 ? value - 65536 : value; }
        set length(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }

        get total_blocks_learned() { const value = this.buffer[8] + this.buffer[9] * 256; return value > 32767 ? value - 65536 : value; }
        set total_blocks_learned(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }
        get payload() {
            return this.buffer.slice(10);
        }
    }
    // Helper function: Convert Buffer to hexadecimal string (for debugging)
    function bufferToHex(buf: Buffer, maxLen: number = 50): string {
        let hex = "";
        const len = buf.length > maxLen ? maxLen : buf.length;
        for (let i = 0; i < len; i++) {
            const val = buf[i] & 0xff;
            const high = (val >> 4) & 0x0f;
            const low = val & 0x0f;
            hex += (high < 10 ? String.fromCharCode(48 + high) : String.fromCharCode(87 + high));
            hex += (low < 10 ? String.fromCharCode(48 + low) : String.fromCharCode(87 + low));
            hex += " ";
        }
        if (buf.length > maxLen) {
            hex += "...";
        }
        return hex;
    }

    // Helper function: Decode UTF-8 bytes to string (simplified: ASCII + 3-byte UTF-8 for Chinese)
    function decodeUTF8(buf: Buffer, start: number, length: number): string {
        let result = "";
        let i = start;
        let end = start + length;

        while (i < end && i < buf.length) {
            let byte1 = buf[i];

            // ASCII character (0x00-0x7F)
            if (byte1 < 0x80) {
                if (byte1 === 0) break; // Stop at null terminator
                result += String.fromCharCode(byte1);
                i++;
            }
            // 3-byte UTF-8 character (0xE0-0xEF) - Chinese characters typically use this
            else if ((byte1 & 0xF0) === 0xE0 && i + 2 < end && i + 2 < buf.length) {
                let byte2 = buf[i + 1];
                let byte3 = buf[i + 2];
                if ((byte2 & 0xC0) === 0x80 && (byte3 & 0xC0) === 0x80) {
                    let codePoint = ((byte1 & 0x0F) << 12) | ((byte2 & 0x3F) << 6) | (byte3 & 0x3F);
                    result += String.fromCharCode(codePoint);
                    i += 3;
                } else {
                    i++; // Skip invalid byte
                }
            }
            else {
                i++; // Skip invalid or unsupported byte
            }
        }

        return result;
    }

    // Helper function: Extract string from Buffer, using \0 as terminator, supports UTF-8 encoding (including Chinese)
    function bufferToString(buf: Buffer): string {
        // Find the position of the first null character (\0), which is the string terminator
        let validLength = buf.length;
        for (let i = 0; i < buf.length; i++) {
            if (buf[i] === 0) {
                validLength = i;
                break;
            }
        }
        // Only extract the valid part (before the first \0), preserving spaces that may be included in the name
        if (validLength > 0) {
            // Use UTF-8 decoder to properly handle multi-byte characters
            return decodeUTF8(buf, 0, validLength);
        }
        return "";
    }

    // Helper function: Extract string from Buffer at specific offset and length, using \0 as terminator
    function bufferToStringAtOffset(buf: Buffer, offset: number, maxLength: number): string {
        // Find the position of the first null character (\0), which is the string terminator
        let validLength = maxLength;
        for (let i = 0; i < maxLength && (offset + i) < buf.length; i++) {
            if (buf[offset + i] === 0) {
                validLength = i;
                break;
            }
        }
        // Only extract the valid part (before the first \0)
        if (validLength > 0) {
            // Use UTF-8 decoder to properly handle multi-byte characters
            return decodeUTF8(buf, offset, validLength);
        }
        return "";
    }
    //For internal use only
    export class Result extends PacketData {
        used: number = 0;
        name: string = "";
        content: string = "";

        constructor(buffer: Buffer) {
            super(buffer);

            const name_length = buffer[10];

            // Check if name_length is 0, if so, there is no name field
            if (name_length === 0) {
                this.name = "";
                // For license plate and OCR recognition, content may still exist even when name_length is 0
                // Try to parse content from buffer[11] if buffer is long enough
                if (buffer.length > 11) {
                    const content_length = buffer[11];
                    if (content_length > 0 && buffer.length > 12 + content_length) {
                        this.content = bufferToStringAtOffset(buffer, 12, content_length);
                    } else {
                        this.content = "";
                    }
                } else {
                    this.content = "";
                }
                return;
            }

            const content_length = buffer[11 + name_length];

            // Directly decode from buffer at specific offsets, avoiding slice() which may have issues in MakeCode
            this.name = bufferToStringAtOffset(buffer, 11, name_length);
            this.content = bufferToStringAtOffset(buffer, 12 + name_length, content_length);
        }

        printInfo() {
            // console.log(`(${this.xCenter}, ${this.yCenter}) size=(${this.width}x${this.height})`);
        }
    }

    let maxId: number[] = [];
    for (let i = 0; i < Macro.AlgorithmCount; i++) {
        maxId.push(0);
    }

    // Use loop to initialize array to ensure ES5 compatibility
    let i2c_cached_data: number[] = []
    let receive_buffer: number[] = [];
    for (let i = 0; i < Macro.FrameBufferSize; i++) {
        receive_buffer.push(0);
    }
    let receive_index = 0
    let timeOutTimer = 0
    function timerBegin() { timeOutTimer = control.millis(); }
    function timerAvailable(): boolean {
        return (control.millis() - timeOutTimer > Macro.Timeout);
    }

    // Helper function: Convert number to hexadecimal string (ES5 compatible)
    function toHex(num: number): string {
        let hex = "";
        let val = num & 0xff;
        let high = (val >> 4) & 0x0f;
        let low = val & 0x0f;
        hex += high < 10 ? String.fromCharCode(48 + high) : String.fromCharCode(87 + high);
        hex += low < 10 ? String.fromCharCode(48 + low) : String.fromCharCode(87 + low);
        return hex;
    }

    // Helper function: Create Buffer from receive_buffer (optimized)
    function createBufferFromReceive(): Buffer {
        const buf = Buffer.create(receive_buffer.length);
        for (let j = 0; j < receive_buffer.length; j++) {
            buf[j] = receive_buffer[j];
        }
        return buf;
    }

    // Helper function: Get PacketData from response
    function getPacketDataFromResponse(): PacketData {
        const buf = createBufferFromReceive();
        return new PacketData(buf.slice(5, buf.length - 1));
    }

    function protocolAvailable(): boolean {
        const response = pins.i2cReadBuffer(Macro.I2cAddr, 32);
        if (response.length > 0) {
            for (let k = 0; k < response.length; k++) {
                i2c_cached_data.push(response[k]);
            }
        }
        while (i2c_cached_data.length) {
            const data = i2c_cached_data.shift();
            if (data != null && huskyLensProtocolReceive(data)) {
                return true;
            }
        }
        return false;
    }

    function huskyLensProtocolReceive(data: number): boolean {
        switch (receive_index) {
            case Macro.Header0Index:
                if (data != 0x55) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.Header0Index] = 0x55;
                break;
            case Macro.Header1Index:
                if (data != 0xaa) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.Header1Index] = 0xaa;
                break;
            case Macro.CommandIndex:
                receive_buffer[Macro.CommandIndex] = data;
                break;
            case Macro.AlgoIndex:
                receive_buffer[Macro.AlgoIndex] = data;
                break;
            case Macro.ContentSizeIndex:
                if (receive_index >= Macro.FrameBufferSize - Macro.ProtocolSize) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.ContentSizeIndex] = data;
                break;
            default:
                receive_buffer[receive_index] = data;
                let expectedLen = receive_buffer[Macro.ContentSizeIndex] + Macro.ContentIndex;
                if (receive_index == expectedLen) {
                    receive_index = 0;
                    return validateCheckSum();
                }
                break;
        }
        receive_index++;
        return false;
    }

    function validateCheckSum(): boolean {
        const stackSumIndex = receive_buffer[Macro.ContentSizeIndex] + Macro.ContentIndex;
        let sum = 0;
        for (let i = 0; i < stackSumIndex; i++) {
            sum += receive_buffer[i];
        }
        sum = sum & 0xff;
        const expected = receive_buffer[stackSumIndex];
        return sum === expected;
    }

    /**
     * Wait for the response to the specified command
     * @param expectedCommand Expected command to receive
     * @param retry Retry count, default is 3
     * @param pkt Optional packet; if provided, it is sent before each retry
     * @param pauseMs Pause between retries (ms), default is 100
     */
    function waitForResponse(expectedCommand: number, retry: number = 3, pkt?: Buffer, pauseMs: number = 100): boolean {
        for (let i = 0; i < retry; i++) {
            // If a packet is provided, send it before each retry
            if (pkt) {
                protocolWrite(pkt);
                if (pauseMs > 0) {
                    basic.pause(pauseMs);
                }
            }

            // Wait for response
            timerBegin();
            while (!timerAvailable()) {
                if (protocolAvailable()) {
                    const receivedCmd = receive_buffer[Macro.CommandIndex];
                    if (expectedCommand === receivedCmd) {
                        return true;
                    }
                    // If another command is received, keep waiting
                }
                basic.pause(10);
            }
        }
        return false;
    }

    function protocolWrite(buffer: Buffer) {
        pins.i2cWriteBuffer(Macro.I2cAddr, buffer);
    }

    /**
     * Create and initialize a 10-byte Buffer (first byte set to the specified value, rest are 0)
     * @param firstByte Value of the first byte
     */
    function createInitializedBuffer(firstByte: number): Buffer {
        const buf = Buffer.create(10);
        buf[0] = firstByte;
        for (let i = 1; i < 10; i++) {
            buf[i] = 0;
        }
        return buf;
    }

    /**
     * Send command and wait for response, checking return value
     * @param cmd Command type
     * @param algorithmId Algorithm Id
     * @param data Data buffer
     * @param retry Retry count, default is 3
     * @param pauseMs Pause between retries (ms), default is 100
     * @param expectedRetValue Expected return value, default is 0
     */
    function sendCommandAndCheckResponse(cmd: number, algorithmId: number, data: Buffer, retry: number = 3, pauseMs: number = 100, expectedRetValue: number = 0): boolean {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algorithmId: algorithmId,
            data: data,
        });
        if (waitForResponse(Macro.CommandReturnArgs, retry, pkt, pauseMs)) {
            const packetData = getPacketDataFromResponse();
            return packetData.retValue === expectedRetValue;
        }
        return false;
    }

    /**
     * Send command and wait for response (without checking return value)
     * @param cmd Command type
     * @param algorithmId Algorithm Id
     * @param data Data buffer
     * @param retry Retry count, default is 3
     * @param pauseMs Pause between retries (ms), default is 100
     */
    function sendCommandAndWait(cmd: number, algorithmId: number, data: Buffer, retry: number = 3, pauseMs: number = 100): boolean {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algorithmId: algorithmId,
            data: data,
        });
        return waitForResponse(Macro.CommandReturnArgs, retry, pkt, pauseMs);
    }

    /**
     * Send command and get response data (for cases where payload is needed)
     * @param cmd Command type
     * @param algorithmId Algorithm Id
     * @param data Data buffer
     * @param retry Retry count, default is 3
     * @param pauseMs Pause between retries (ms), default is 100
     */
    function sendCommandAndGetResponse(cmd: number, algorithmId: number, data: Buffer, retry: number = 3, pauseMs: number = 100): PacketData | null {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algorithmId: algorithmId,
            data: data,
        });
        if (waitForResponse(Macro.CommandReturnArgs, retry, pkt, pauseMs)) {
            const packetData = getPacketDataFromResponse();
            if (packetData.retValue === 0) {
                return packetData;
            }
        }
        return null;
    }

    /**
     * Send learn command and get learned Id
     * @param cmd Command type (CommandActionLearn or CommandActionLearnBlock)
     * @param algorithmId Algorithm Id
     * @param data Data buffer
     */
    function sendLearnCommand(cmd: number, algorithmId: number, data: Buffer): number {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algorithmId: algorithmId,
            data: data,
        });
        if (waitForResponse(Macro.CommandReturnArgs, 3, pkt, 100)) {
            const packetData = getPacketDataFromResponse();
            return packetData.first;
        }
        return 0;
    }

    /**
     * Create a 10-byte Buffer with coordinates and size (for CommandActionLearnBlock)
     * @param x x Coordinate
     * @param y y Coordinate
     * @param w Width
     * @param h Height
     */
    function createBoxBuffer(x: number, y: number, w: number, h: number): Buffer {
        const dataBuf = Buffer.create(10);
        dataBuf[0] = 0;   // reserved
        dataBuf[1] = 0;   // reserved
        dataBuf[2] = x & 0xFF;
        dataBuf[3] = (x >> 8) & 0xFF;
        dataBuf[4] = y & 0xFF;
        dataBuf[5] = (y >> 8) & 0xFF;
        dataBuf[6] = w & 0xFF;
        dataBuf[7] = (w >> 8) & 0xFF;
        dataBuf[8] = h & 0xFF;
        dataBuf[9] = (h >> 8) & 0xFF;
        return dataBuf;
    }

    /**
     * Internal function: initialize HUSKYLENS 2 over I2C and wait until it responds.
     */
    //% blockHidden=true
    export function beginInternal(): boolean {
        const dataBuf = createInitializedBuffer(1);
        const pkt = PacketHead.fromFields({
            cmd: Macro.CommandKnock,
            algorithmId: Algorithm.AlgorithmAny,
            data: dataBuf,
        });
        return waitForResponse(Macro.CommandReturnArgs, 20, pkt, 100);
    }

    /**
     * Internal function: switch the current algorithm on HUSKYLENS 2.
     */
    //% blockHidden=true
    export function switchAlgorithmInternal(algorithmId: number): boolean {
        const dataBuf = createInitializedBuffer(algorithmId);
        const pkt = PacketHead.fromFields({
            cmd: Macro.CommandSetAlgorithm,
            algorithmId: Algorithm.AlgorithmAny,
            data: dataBuf,
        });
        return waitForResponse(Macro.CommandReturnArgs, 3, pkt, 1000);
    }
    //For internal use only
    export type ResultVariant = Result |  null;
    let result: ResultVariant[][] = [];
    for (let i = 0; i < Macro.AlgorithmCount; i++) {
        result[i] = [];
        for (let j = 0; j < Macro.MaxResultNum; j++) {
            result[i][j] = null;
        }
    }
    let customId: number[] = [Algorithm.AlgorithmAny, Algorithm.AlgorithmAny, Algorithm.AlgorithmAny];

    function toRealId(Id: number): number {
        let algorithmId = Id;
        if (Id >= Algorithm.AlgorithmCustomBegin) {
            for (let i = 0; i < Macro.CustomAlgorithmCount; i++)
                if (customId[i] == algorithmId) {
                    algorithmId = (Algorithm.AlgorithmCustom0 + i);
                    break;
                }
        }
        return algorithmId;
    }

    /**
     * Internal function: check whether there is at least one unused cached result.
     */
    //% blockHidden=true
    export function availableInternal(algorithmId: number): boolean {
        const cacheAlgo = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            const r = result[cacheAlgo][i];
            if (r != null) {
                const res = r as Result;
                if (!res.used) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Internal function: get the maximum learned Id value from the cache.
     * @param algorithmId The algorithm Id (normalized internally).
     */
    //% blockHidden=true
    export function cachedResultMaxIdInternal(algorithmId: number): number {
        const cacheAlgo = 0;
        return maxId[cacheAlgo] || 0;
    }

    /**
     * Internal function: request results from device and update the result cache.
     */
    //% blockHidden=true
    export function getResultInternal(algorithmId: number): number {
        const dataBuf = Buffer.create(0);
        const retry = 3;
        const pkt = PacketHead.fromFields({
            cmd: Macro.CommandGetResult,
            algorithmId: algorithmId,
            data: dataBuf,
        });

        // Normalize algorithm Id to 0 for caching
        const cacheAlgo = 0;

        // Clear previous results
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            result[cacheAlgo][i] = null;
        }

        // Request result info with retry
        let info: PacketData | null = null;
        if (waitForResponse(Macro.CommandReturnInfo, retry, pkt, 0)) {
            info = getPacketDataFromResponse();
            maxId[cacheAlgo] = info.maxId;
            if (info.total_blocks > Macro.MaxResultNum) {
                info.total_blocks = Macro.MaxResultNum;
            }
        }

        if (!info) {
            return -1;
        }

        // Process blocks
        let count = 0;
        for (let i = 0; i < info.total_blocks; i++) {
            if (waitForResponse(Macro.CommandReturnBlock)) {
                const buf = createBufferFromReceive();
                result[cacheAlgo][i] = new Result(buf.slice(5, buf.length - 1));
                count++;
            }
        }

        // Process arrows
        for (let i = info.total_blocks; i < info.total_results; i++) {
            if (waitForResponse(Macro.CommandReturnArrow)) {
                const buf = createBufferFromReceive();
                result[cacheAlgo][i] = new Result(buf.slice(5, buf.length - 1));
                count++;
            }
        }

        return count;
    }

    /**
     * Internal function: get the cached result that is closest to screen center.
     */
    //% blockHidden=true
    export function cachedCenterResultInternal(algorithmId: number): ResultVariant | null {
        const cacheAlgo = 0;
        let centerIndex = -1;
        let minLen = 0x7FFFFFFF;
        const centerX = Macro.LcdWidth / 2;
        const centerY = Macro.LcdHeight / 2;

        for (let i = 0; i < Macro.MaxResultNum; i++) {
            const r = result[cacheAlgo][i];
            if (r) {
                const res = r as Result;
                const len = (res.xCenter - centerX) ** 2 + (res.yCenter - centerY) ** 2;
                if (len < minLen) {
                    minLen = len;
                    centerIndex = i;
                }
            }
        }
    
        return centerIndex !== -1 ? result[cacheAlgo][centerIndex] : null;
    }

    /**
     * Internal function: get a cached result by index.
     */
    //% blockHidden=true
    export function cachedResultByIndexInternal(algorithmId: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        if (index < 0 || index >= Macro.MaxResultNum) {
            return null;
        }
        return result[cacheAlgo][index];
    }

    /**
     * Internal function: get the first cached result that matches a specific Id.
     */
    //% blockHidden=true
    export function cachedResultByIdInternal(algorithmId: number, Id: number): ResultVariant | null {
        const cacheAlgo = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            const r = result[cacheAlgo][i];
            if (r != null) {
                const res = r as Result;
                if (res.Id === Id) {
                    return r;
                }
            }
        }
        return null;
    }

    /**
     * Internal function: count how many cached results are available.
     */
    //% blockHidden=true
    export function cachedResultNumInternal(algorithmId: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            if (result[cacheAlgo][i] != null) {
                count++;
            }
        }
        return count;
    }

    /**
     * Internal function: get the number of learned Ids (max Id in cache).
     */
    //% blockHidden=true
    export function cachedResultLearnedNumInternal(algorithmId: number): number {
        return cachedResultMaxIdInternal(algorithmId);
    }

    /**
     * Internal function: count how many cached results share the specified Id.
     */
    //% blockHidden=true
    export function cachedResultNumByIdInternal(algorithmId: number, Id: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            const r = result[cacheAlgo][i];
            if (r) {
                const res = r as Result;
                if (Id === res.Id) {
                    count++;
                }
            }
        }
        return count;
    }

    /**
     * Internal function: get the nth cached result that matches the specified Id.
     */
    //% blockHidden=true
    export function cachedIndexResultByIdInternal(algorithmId: number, Id: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        let currentIndex = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            const r = result[cacheAlgo][i];
            if (r) {
                const res = r as Result;
                if (Id === res.Id) {
                    if (currentIndex === index) {
                        return r;
                    }
                    currentIndex++;
                }
            }
        }
        return null;
    }

    /**
     * Internal function: get the current main branch result for line tracking.
     */
    //% blockHidden=true
    export function getCurrentBranchInternal(algorithmId: number): ResultVariant | null {
        const cacheAlgo = 0;
        const item = result[cacheAlgo] && result[cacheAlgo][0];
        return (item && item.level === 1) ? item : null;
    }

    /**
     * Internal function: get the number of upcoming branches in line tracking.
     */
    //% blockHidden=true
    export function getUpcomingBranchCountInternal(algorithmId: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MaxResultNum; i++) {
            if (result[cacheAlgo][i] != null) {
                count++;
            }
        }
        return count > 0 ? count - 1 : 0;
    }

    /**
     * Internal function: get a specific branch in line tracking by index.
     */
    //% blockHidden=true
    export function getBranchInternal(algorithmId: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        const targetIndex = index + 1;
        for (let i = 1; i < Macro.MaxResultNum; i++) {
            if (result[cacheAlgo][i] != null && i === targetIndex) {
                return result[cacheAlgo][i];
            }
        }
        return null;
    }

    //---------------------------------------------------------------multimedia----------------------------------------

    /**
     * Play an audio file stored on HUSKYLENS 2.
     * @param name Audio file name (e.g. "music.mp3").
     * @param volume Playback volume (0~100).
     */
    //% block="play music %name at volume %volume"
    //% name.shadow="text"
    //% name.defl="music.mp3"
    //% weight=119
    //% volume.min=0 volume.max=100 volume.defl=50
    //% subcategory="multimedia"
    export function playMusic(name: string, volume: number): void {
        if (volume < 0) volume = 0;
        if (volume > 100) volume = 100;

        // Create command packet
        const dataBuf = Buffer.create(10);
        dataBuf[0] = 0;  // Reserved byte
        dataBuf[1] = 0;  // Reserved byte
        // Set volume (16-bit integer)
        dataBuf[2] = volume & 0xFF;
        dataBuf[3] = (volume >> 8) & 0xFF;
        // Add six zero bytes
        for (let i = 4; i < 10; i++) {
            dataBuf[i] = 0;
        }

        // Create packet header including string data
        const nameBuf = Buffer.fromUTF8(name);
        const totalBuf = Buffer.create(11 + nameBuf.length); // 10-byte data + 1-byte length + name length
        for (let i = 0; i < 10; i++) {
            totalBuf[i] = dataBuf[i];
        }
        totalBuf[10] = nameBuf.length; // Name length
        for (let i = 0; i < nameBuf.length; i++) {
            totalBuf[11 + i] = nameBuf[i];
        }

        // Send command and wait for response
        sendCommandAndCheckResponse(Macro.CommandActionPlayMusic, Algorithm.AlgorithmAny, totalBuf);
    }

    let photoName: string = "";
    /**
     * Take a photo on HUSKYLENS 2 and cache the returned file name.
     */
    //% block="take photo"
    //% weight=118
    //% subcategory="multimedia"
    export function takePhoto(): void {
        const dataBuf = createInitializedBuffer(2);  // Set resolution 2: RESOLUTION_1280x720
        const packetData = sendCommandAndGetResponse(Macro.CommandActionTakePhoto, Algorithm.AlgorithmAny, dataBuf);
        if (packetData) {
            photoName = bufferToString(packetData.payload);
        }
    }
    let screenshotName: string = "";
    /**
     * Take a screenshot on HUSKYLENS 2 and cache the returned file name.
     */
    //% block="take a screenshot"
    //% weight=116
    //% subcategory="multimedia"
    export function takeScreenshot(): void {
        const dataBuf = Buffer.create(0);
        const pkt = PacketHead.fromFields({
            cmd: Macro.CommandActionTakeScreenshot,
            algorithmId: Algorithm.AlgorithmAny,
            data: dataBuf,
        });

        const packetData = sendCommandAndGetResponse(Macro.CommandActionTakeScreenshot, Algorithm.AlgorithmAny, dataBuf);
        if (packetData) {
            screenshotName = bufferToString(packetData.payload);
        }
    }

    /**
     * Get the file name of the last captured screenshot.
     */
    //% block="obtain the name of the saved screenshot"
    //% weight=115
    //% subcategory="multimedia"
    export function storedScreenshotName(): string {
        return screenshotName;
    }

    /**
     * Get the file name of the last captured photo.
     */
    //% block="obtain the names of the stored photos"
    //% weight=117
    //% subcategory="multimedia"
    export function storedPhotoName(): string {
        return photoName;
    }

    //-------------------------------------------------screen display-----------------------------------
/**
     * Internal function: draw rectangle (common implementation)
     * @param cmd Command type (CommandActionDrawRect or CommandActionDrawUniqueRect)
     * @param color Color value
     * @param lineWidth Line width
     * @param x x Coordinate
     * @param y y Coordinate
     * @param w Width
     * @param h Height
     */
    //% blockHidden=true
    export function drawBoxInternal(cmd: number, color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        const dataBuf = Buffer.create(16);
        dataBuf[0] = 0;  // Reserved byte
        dataBuf[1] = lineWidth;  // Line width

        // Set coordinates and size (int16_t)
        dataBuf[2] = x & 0xFF;
        dataBuf[3] = (x >> 8) & 0xFF;
        dataBuf[4] = y & 0xFF;
        dataBuf[5] = (y >> 8) & 0xFF;
        dataBuf[6] = w & 0xFF;
        dataBuf[7] = (w >> 8) & 0xFF;
        dataBuf[8] = h & 0xFF;
        dataBuf[9] = (h >> 8) & 0xFF;
        dataBuf[10] = 0;  // Reserved
        dataBuf[11] = 0;  // Reserved

        // Set color (int32_t)
        dataBuf[12] = color & 0xFF;
        dataBuf[13] = (color >> 8) & 0xFF;
        dataBuf[14] = (color >> 16) & 0xFF;
        dataBuf[15] = (color >> 24) & 0xFF;

        // Send command and wait for response
        sendCommandAndCheckResponse(cmd, Algorithm.AlgorithmAny, dataBuf);
    }

    /**
     * Draw or update an indicator box on the screen.
     * @param color RGB color value. You can generate it with setRGB(red, green, blue).
     * @param lineWidth Line width (1~10).
     * @param x X Coordinate in pixels (0~640).
     * @param y Y Coordinate in pixels (0~480).
     * @param w Box width in pixels (1~640).
     * @param h Box height in pixels (1~480).
     */
    //% block="draw or update indicator box color%color line width%lineWidth x%x y%y width%w height%h"
    //% subcategory="screen display"
    //% weight=90
    //% color.min=0 
    //% lineWidth.min=1 lineWidth.max=10
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=1 w.max=640
    //% h.min=1 h.max=480
    export function drawBox(color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        drawBoxInternal(Macro.CommandActionDrawUniqueRect, color, lineWidth, x, y, w, h);
    }

    /**
     * Draw a new rectangle box on the screen.
     * @param color RGB color value. You can generate it with setRGB(red, green, blue).
     * @param lineWidth Line width (1~10).
     * @param x X Coordinate in pixels (0~640).
     * @param y Y Coordinate in pixels (0~480).
     * @param w Box width in pixels (1~640).
     * @param h Box height in pixels (1~480).
     */
    //% block="draw new rectangle color%color line width%lineWidth x%x y%y width%w height%h"
    //% subcategory="screen display"
    //% weight=89
    //% color.min=0 
    //% lineWidth.min=1 lineWidth.max=10
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=1 w.max=640
    //% h.min=1 h.max=480
    export function drawNewBox(color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        drawBoxInternal(Macro.CommandActionDrawRect, color, lineWidth, x, y, w, h);
    }
    export const enum FontSize {
        //% block="font20"
        Font20 = 20,
        //% block="font24"
        Font24 = 24,
        //% block="font26"
        Font26 = 26,
        //% block="font27"
        Font27 = 27,
        //% block="font28"
        Font28 = 28,
        //% block="font32"
        Font32 = 32,
        //% block="font36"
        Font36 = 36,
        //% block="font40"
        Font40 = 40,
        //% block="font48"
        Font48 = 48,
    }
    /**
     * Display text on the screen at the specified coordinates.
     * @param color RGB color value. You can generate it with setRGB(red, green, blue).
     * @param fontSize Font size (px).
     * @param x X Coordinate in pixels (0~640).
     * @param y Y Coordinate in pixels (0~480).
     * @param content Text content to display (UTF-8 supported).
     */
    //% block="display text color%color fontSize%fontSize x%x y%y content%content"
    //% subcategory="screen display"
    //% weight=91
    //% color.min=0
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    export function showText(color: number, fontSize: FontSize, x: number, y: number, content: string): void {
        const textBuf = Buffer.fromUTF8(content);
        const dataBuf = Buffer.create(20 + textBuf.length);

        dataBuf[0] = 0;  // Reserved byte
        dataBuf[1] = fontSize;  // Font size

        // Set coordinates (int16_t)
        dataBuf[2] = x & 0xFF;
        dataBuf[3] = (x >> 8) & 0xFF;
        dataBuf[4] = y & 0xFF;
        dataBuf[5] = (y >> 8) & 0xFF;

        // Reserved fields
        dataBuf[6] = 0;  // Reserved
        dataBuf[7] = 0;  // Reserved
        dataBuf[8] = 0;  // Reserved
        dataBuf[9] = 0;  // Reserved

        // Text length
        dataBuf[10] = textBuf.length;

        // Text content
        for (let i = 0; i < textBuf.length; i++) {
            dataBuf[11 + i] = textBuf[i];
        }

        // Terminator and color
        dataBuf[11 + textBuf.length] = 0;  // Terminator

        // Set color (int32_t)
        dataBuf[12 + textBuf.length] = color & 0xFF;
        dataBuf[13 + textBuf.length] = (color >> 8) & 0xFF;
        dataBuf[14 + textBuf.length] = (color >> 16) & 0xFF;
        dataBuf[15 + textBuf.length] = (color >> 24) & 0xFF;

        // Send command and wait for response
        sendCommandAndCheckResponse(Macro.CommandActionDrawText, Algorithm.AlgorithmAny, dataBuf);
    }

    /**
     * Clear all text previously drawn on the screen.
     */
    //% block="clear text"
    //% subcategory="screen display"
    //% weight=88
    export function clearText(): void {
        sendCommandAndCheckResponse(Macro.CommandActionClearText, Algorithm.AlgorithmAny, Buffer.create(0));
    }

    /**
     * Clear all indicator boxes and rectangle boxes previously drawn on the screen.
     */
    //% block="clear indicator boxes and rectangles"
    //% subcategory="screen display"
    //% weight=87
    export function clearBoxes(): void {
        sendCommandAndCheckResponse(Macro.CommandActionClearRect, Algorithm.AlgorithmAny, Buffer.create(0));
    }

    /**
     * Generate a 24-bit color value from Red, Green, and Blue components.
     * @param red Intensity of red (0~255).
     * @param green Intensity of green (0~255).
     * @param blue Intensity of blue (0~255).
     */
    //% block="set color red%red green%green blue%blue"
    //% subcategory="screen display"
    //% weight=86
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    export function setRGB(red: number, green: number, blue: number): number {
        red = Math.max(0, Math.min(255, red));
        green = Math.max(0, Math.min(255, green));
        blue = Math.max(0, Math.min(255, blue));
        return (red << 16) + (green << 8) + blue;
    }

    //************************************* learning /forgetting   ********************************* */
    let learn_id = 0;
    /**
     * Get the Id returned by the last "learn" operation.
     */
    //% block="get learned Id"
    //% weight=100
    //% subcategory="learning /forgetting"
    export function getLearnedId(): number {
        return learn_id || 0;
    }

    /**
     * Learn a target at the center of the screen using a built-in model.
     * @param algorithmId Built-in model algorithm.
     */
    //% block="built-in model %algorithmId learn target at center of screen"
    //% weight=95
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=huskylens2.AlgorithmLearnObjectAtCenter.AlgorithmFaceRecognition
    export function learnObjectAtCenter(algorithmId: AlgorithmLearnObjectAtCenter): void {
        learn_id = sendLearnCommand(Macro.CommandActionLearn, algorithmId, createInitializedBuffer(0));
    }

    /**
     * Learn a target at the center of the screen using a self-trained model.
     * @param algorithmId Self-trained model Id.（>=128）
     */
    //% block="built-in model %algorithmId learn target at center of screen"
    //% weight=94
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=128
    export function learnObjectAtCenterNUM(algorithmId: number): void {
        learn_id = sendLearnCommand(Macro.CommandActionLearn, algorithmId, createInitializedBuffer(0));
    }

    /**
     * Learn a target within a specified box using a built-in model.
     * @param algorithmId Built-in model algorithm.
     * @param x X Coordinate of the box's top-left corner (0~640).
     * @param y Y Coordinate of the box's top-left corner (0~480).
     * @param w Width of the box (10~100).
     * @param h Height of the box (10~100).
     */
    //% block="built-in model %algorithmId learn target in specified box x%x y%y w%w h%h"
    //% weight=90
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=huskylens2.AlgorithmLearnObjectInBox.AlgorithmFaceRecognition
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=10 w.max=100
    //% h.min=10 h.max=100
    export function learnObjectInBox(algorithmId: AlgorithmLearnObjectInBox, x: number, y: number, w: number, h: number): void {
        learn_id = sendLearnCommand(Macro.CommandActionLearnBlock, algorithmId, createBoxBuffer(x, y, w, h));
    }

    /**
     * Learn a target within a specified box using a self-trained model.
     * @param algorithmId Self-trained model Id (128~255).
     * @param x X Coordinate of the box's top-left corner (0~640).
     * @param y Y Coordinate of the box's top-left corner (0~480).
     * @param w Width of the box (10~100).
     * @param h Height of the box (10~100).
     */
    //% block="self-trained model %algorithmId learn target in specified box x%x y%y w%w h%h"
    //% weight=89
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=128
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=10 w.max=100
    //% h.min=10 h.max=100
    export function learnObjectInBoxNUM(algorithmId: number, x: number, y: number, w: number, h: number): void {
        learn_id = sendLearnCommand(Macro.CommandActionLearnBlock, algorithmId, createBoxBuffer(x, y, w, h));
    }

    /**
     * Set a name for a learned Id under a built-in model.
     * @param algorithmId Built-in model algorithm.
     * @param Id Target Id (1~100).
     * @param name Name to set.
     */
    //% block="set built-in model %algorithmId Id%Id name to %name"
    //% weight=70
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=huskylens2.AlgorithmLearnSetNameOfId.AlgorithmFaceRecognition
    //% Id.min=1 Id.max=100 Id.defl=1
    //% name.defl="object"
    export function setNameOfId(algorithmId: AlgorithmLearnSetNameOfId, Id: number, name: string): void {
        // Create a Buffer containing Id and name
        const nameBuf = Buffer.fromUTF8(name);
        const dataBuf = Buffer.create(10 + 1 + nameBuf.length); // 10 bytes + 1-byte length + name

        dataBuf[0] = Id; // Id
        // Fill the remaining 9 bytes with 0
        for (let i = 1; i < 10; i++) {
            dataBuf[i] = 0;
        }
        // Name length
        dataBuf[10] = nameBuf.length;
        // Name content
        for (let i = 0; i < nameBuf.length; i++) {
            dataBuf[11 + i] = nameBuf[i];
        }

        sendCommandAndWait(Macro.CommandSetNameById, algorithmId, dataBuf);
    }

    /**
     * Forget (clear) all learned Ids under the specified built-in model.
     * @param algorithmId Built-in model algorithm.
     */
    //% block="forget built-in model %algorithmId all Ids"
    //% weight=80
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=huskylens2.Algorithm.AlgorithmFaceRecognition
    export function forgetAllIds(algorithmId: Algorithm): void {
        sendCommandAndWait(Macro.CommandActionForget, algorithmId, createInitializedBuffer(algorithmId));
    }

    /**
     * Forget (clear) all learned Ids under the specified self-trained model.
     * @param algorithmId Self-trained model Id (128~255).
     */
    //% block="forget self-trained model %algorithmId all Ids"
    //% weight=79
    //% subcategory="learning /forgetting"
    //% algorithmId.defl=128
    export function forgetAllIdsNUM(algorithmId: number): void {
        sendCommandAndWait(Macro.CommandActionForget, algorithmId, createInitializedBuffer(algorithmId));
    }

}
