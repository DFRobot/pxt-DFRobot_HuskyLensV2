/**
 * Custom graphic block
 */
//% weight=100 color=#0fbc11 icon="\uf067" block="HuskylensV2"
//% groups='["Communication","Algorithm Switch","Face Recognition","Object Recognition","Object Tracking","Color Recognition","Object Classification","Self-learning Classification","Instance Segmentation","Hand Recognition","Pose Recognition","License Plate Recognition","Optical Char Recognition","Line Tracking","Face Emotion Recognition","Tag Recognition","QR Code Recognition","Barcode Recognition"]'
namespace huskylensV2 {
    // MakeCode global types are automatically injected, these declarations are only to suppress IDE warnings
    // These declarations are not needed in the actual MakeCode compilation environment
    // ==================== Low-level Communication Code ====================
    export const enum Macro {
        I2CADDR = 0x50,
        // ===================== Commands ====================
        COMMAND_KNOCK = 0x00,
        COMMAND_GET_RESULT = 0x01,
        COMMAND_GET_ALGO_PARAM = 0x02,
        COMMAND_GET_RESULT_BY_ID = 0x03,
        COMMAND_GET_BLOCKS_BY_ID = 0x04,
        COMMAND_GET_ARROWS_BY_ID = 0x05,
        // RFU 0x06 - 0x09
        COMMAND_SET_ALGORITHM = 0x0A,
        COMMAND_SET_NAME_BY_ID = 0x0B,
        COMMAND_SET_MULTI_ALGORITHM = 0x0C,
        COMMAND_SET_MULTI_ALGORITHM_RATIO = 0x0D,
        COMMAND_SET_ALGO_PARAMS = 0x0E,
        COMMAND_UPDATE_ALGORITHM_PARAMS = 0x0F,
        // RFU 0x0F - 0x19
        COMMAND_RETURN_ARGS = 0x1A,
        COMMAND_RETURN_INFO = 0x1B,
        COMMAND_RETURN_BLOCK = 0x1C,
        COMMAND_RETURN_ARROW = 0x1D,
        // RFU 0x1E - 0x1F
        COMMAND_ACTION_TAKE_PHOTO = 0x20,
        COMMAND_ACTION_TAKE_SCREENSHOT = 0x21,
        COMMAND_ACTION_LEARN = 0x22,
        COMMAND_ACTION_FORGET = 0x23,
        COMMAND_ACTION_SAVE_KNOWLEDGES = 0x24,
        COMMAND_ACTION_LOAD_KNOWLEDGES = 0x25,
        COMMAND_ACTION_DRAW_RECT = 0x26,
        COMMAND_ACTION_CLEAR_RECT = 0x27,
        COMMAND_ACTION_DRAW_TEXT = 0x28,
        COMMAND_ACTION_CLEAR_TEXT = 0x29,
        COMMAND_ACTION_PLAY_MUSIC = 0x2A,
        COMMAND_EXIT = 0x2B,
        COMMAND_ACTION_LEARN_BLOCK = 0x2C,
        COMMAND_ACTION_DRAW_UNIQUE_RECT = 0x2D,
        COMMAND_ACTION_START_RECORDING = 0x2E,
        COMMAND_ACTION_STOP_RECORDING = 0x2F,
        // RFU 0x30 - 0x3F

        // ===================== Memory Layout ====================
        FRAME_BUFFER_SIZE = 128,
        MAX_RESULT_NUM = 6,
        CMD_BUFFER_SIZE = 32,
        ALGORITHM_COUNT = 1,
        CUSTOM_ALGORITHM_COUNT = 1,
        // ===================== LCD Screen ====================
        LCD_WIDTH = 640,
        LCD_HEIGHT = 480,
        //===================== Packet Head ====================
        HEADER_0_INDEX = 0,
        HEADER_1_INDEX = 1,
        COMMAND_INDEX = 2,
        ALGO_INDEX = 3,
        CONTENT_SIZE_INDEX = 4,
        CONTENT_INDEX = 5,
        PROTOCOL_SIZE = 6,
        //===================== Time out ====================
        TIMEOUT = 2000
    }

    class PacketHead {
        static readonly HEADER_SIZE = 5;

        head55: number;
        headaa: number;
        cmd: number;
        algo_id: number;
        data_length: number;
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
            this.algo_id = buffer.length > 3 ? buffer[3] : 0;
            this.data_length = buffer.length > 4 ? buffer[4] : 0;

            const expectedLength = PacketHead.HEADER_SIZE + this.data_length + 1;
            if (buffer.length < expectedLength) {
                // If buffer is incomplete, use empty Buffer
                this.data = Buffer.create(0);
                this.cs = 0;
            } else {
                this.data = buffer.slice(5, 5 + this.data_length);
                this.cs = buffer[5 + this.data_length];
            }
        }

        static fromFields(fields: {
            head55?: number;
            headaa?: number;
            cmd: number;
            algo_id: number;
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
            buf[3] = fields.algo_id;
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
            const buf = Buffer.create(PacketHead.HEADER_SIZE + this.data_length);
            buf[0] = this.head55;
            buf[1] = this.headaa;
            buf[2] = this.cmd;
            buf[3] = this.algo_id;
            buf[4] = this.data_length;
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

        // 第一个union - uint8_t类型
        get ID() { return this.buffer[0] }
        set ID(v: number) { this.buffer[0] = v & 0xff; }

        get maxID() { return this.buffer[0] }
        set maxID(v: number) { this.buffer[0] = v & 0xff; }

        get rfu0() { return this.buffer[0] }
        set rfu0(v: number) { this.buffer[0] = v & 0xff; }

        get resolution() { return this.buffer[0] }  // 新增：分辨率
        set resolution(v: number) { this.buffer[0] = v & 0xff; }

        get boardType() { return this.buffer[0] }
        set boardType(v: number) { this.buffer[0] = v & 0xff; }

        get multiAlgoNum() { return this.buffer[0] }
        set multiAlgoNum(v: number) { this.buffer[0] = v & 0xff; }

        // 第二个union - int8_t类型
        get rfu1() { return this.buffer[1]; }
        set rfu1(v: number) { this.buffer[1] = v & 0xff; }

        get level() { return this.buffer[1]; }
        set level(v: number) { this.buffer[1] = v & 0xff; }

        get mediaType() { return this.buffer[1]; }  // 新增：媒体类型
        set mediaType(v: number) { this.buffer[1] = v & 0xff; }

        get retValue() { return this.buffer[1]; }  // 新增：返回值
        set retValue(v: number) { this.buffer[1] = v & 0xff; }

        get lineWidth() { return this.buffer[1]; }  // 新增：线宽
        set lineWidth(v: number) { this.buffer[1] = v & 0xff; }

        get confidence() { return this.buffer[1]; }
        set confidence(v: number) { this.buffer[1] = v & 0xff; }
        // 第三个 union - int16_t（buffer[2], buffer[3]）
        get first() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set first(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get xCenter() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set xCenter(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get xTarget() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set xTarget(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get duration() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set duration(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get algorithmType() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set algorithmType(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get classID() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set classID(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get total_results() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set total_results(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        get pitch() { const value = this.buffer[2] + this.buffer[3] * 256; return value > 32767 ? value - 65536 : value; }
        set pitch(v: number) { v = Math.max(-32768, Math.min(32767, v)); if (v < 0) v += 65536; this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }

        // 第四个 union - int16_t（buffer[4], buffer[5]）
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

        // 第五个 union - int16_t（buffer[6], buffer[7]）
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

        // 第六个 union - int16_t（buffer[8], buffer[9]）
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
    export function bufferToHex(buf: Buffer, maxLen: number = 50): string {
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
    export function decodeUTF8(buf: Buffer, start: number, length: number): string {
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
    export function bufferToString(buf: Buffer): string {
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
    export function bufferToStringAtOffset(buf: Buffer, offset: number, maxLength: number): string {
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

    let maxID: number[] = [];
    for (let i = 0; i < Macro.ALGORITHM_COUNT; i++) {
        maxID.push(0);
    }

    // Use loop to initialize array to ensure ES5 compatibility
    let i2c_cached_data: number[] = []
    let receive_buffer: number[] = [];
    for (let i = 0; i < Macro.FRAME_BUFFER_SIZE; i++) {
        receive_buffer.push(0);
    }
    let receive_index = 0
    let timeOutTimer = 0
    export function timerBegin() { timeOutTimer = control.millis(); }
    export function timerAvailable(): boolean {
        return (control.millis() - timeOutTimer > Macro.TIMEOUT);
    }

    // Helper function: Convert number to hexadecimal string (ES5 compatible)
    export function toHex(num: number): string {
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

    export function protocolAvailable(): boolean {
        const response = pins.i2cReadBuffer(Macro.I2CADDR, 32);
        if (response.length > 0) {
            for (let k = 0; k < response.length; k++) {
                i2c_cached_data.push(response[k]);
            }
        }
        while (i2c_cached_data.length) {
            const data = i2c_cached_data.shift();  
            if (data != null && husky_lens_protocol_receive(data)) {
                return true;
            }
        }
        return false;
    }

    export function husky_lens_protocol_receive(data: number): boolean {
        switch (receive_index) {
            case Macro.HEADER_0_INDEX:
                if (data != 0x55) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.HEADER_0_INDEX] = 0x55;
                break;
            case Macro.HEADER_1_INDEX:
                if (data != 0xaa) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.HEADER_1_INDEX] = 0xaa;
                break;
            case Macro.COMMAND_INDEX:
                receive_buffer[Macro.COMMAND_INDEX] = data;
                break;
            case Macro.ALGO_INDEX:
                receive_buffer[Macro.ALGO_INDEX] = data;
                break;
            case Macro.CONTENT_SIZE_INDEX:
                if (receive_index >= Macro.FRAME_BUFFER_SIZE - Macro.PROTOCOL_SIZE) {
                    receive_index = 0;
                    return false;
                }
                receive_buffer[Macro.CONTENT_SIZE_INDEX] = data;
                break;
            default:
                receive_buffer[receive_index] = data;
                let expectedLen = receive_buffer[Macro.CONTENT_SIZE_INDEX] + Macro.CONTENT_INDEX;
                if (receive_index == expectedLen) {
                    receive_index = 0;
                    return validateCheckSum();
                }
                break;
        }
        receive_index++;
        return false;
    }

    export function validateCheckSum(): boolean {
        const stackSumIndex = receive_buffer[Macro.CONTENT_SIZE_INDEX] + Macro.CONTENT_INDEX;
        let sum = 0;
        for (let i = 0; i < stackSumIndex; i++) {
            sum += receive_buffer[i];
        }
        sum = sum & 0xff;
        const expected = receive_buffer[stackSumIndex];
        return sum === expected;
    }

    /**
     * 等待指定命令的响应
     * @param expectedCommand 期望收到的命令
     * @param retry 重试次数，默认为3
     * @param pkt 可选的数据包，如果提供则每次重试前会发送
     * @param pauseMs 每次重试之间的暂停时间（毫秒），默认为100
     * @returns 是否收到期望的命令
     */
    function waitForResponse(expectedCommand: number, retry: number = 3, pkt?: Buffer, pauseMs: number = 100): boolean {
        for (let i = 0; i < retry; i++) {
            // 如果提供了数据包，在每次重试前发送
            if (pkt) {
                protocolWrite(pkt);
                if (pauseMs > 0) {
                    basic.pause(pauseMs);
                }
            }

            // 等待响应
            timerBegin();
            while (!timerAvailable()) {
                if (protocolAvailable()) {
                    const receivedCmd = receive_buffer[Macro.COMMAND_INDEX];
                    if (expectedCommand === receivedCmd) {
                        return true;
                    }
                    // 如果收到其他命令，继续等待
                }
                basic.pause(10);
            }
        }
        return false;
    }

    export function protocolWrite(buffer: Buffer) {
        pins.i2cWriteBuffer(Macro.I2CADDR, buffer);
    }

    /**
     * 创建并初始化10字节的Buffer（第一个字节为指定值，其余为0）
     * @param firstByte 第一个字节的值
     * @returns 初始化后的Buffer
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
     * 发送命令并等待响应，检查返回值
     * @param cmd 命令类型
     * @param algoId 算法ID
     * @param data 数据缓冲区
     * @param retry 重试次数，默认为3
     * @param pauseMs 每次重试之间的暂停时间（毫秒），默认为100
     * @param expectedRetValue 期望的返回值，默认为0
     * @returns 是否成功（收到响应且返回值匹配）
     */
    function sendCommandAndCheckResponse(cmd: number, algoId: number, data: Buffer, retry: number = 3, pauseMs: number = 100, expectedRetValue: number = 0): boolean {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algo_id: algoId,
            data: data,
        });
        if (waitForResponse(Macro.COMMAND_RETURN_ARGS, retry, pkt, pauseMs)) {
            const packetData = getPacketDataFromResponse();
            return packetData.retValue === expectedRetValue;
        }
        return false;
    }

    /**
     * 发送命令并等待响应（不检查返回值）
     * @param cmd 命令类型
     * @param algoId 算法ID
     * @param data 数据缓冲区
     * @param retry 重试次数，默认为3
     * @param pauseMs 每次重试之间的暂停时间（毫秒），默认为100
     * @returns 是否收到响应
     */
    function sendCommandAndWait(cmd: number, algoId: number, data: Buffer, retry: number = 3, pauseMs: number = 100): boolean {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algo_id: algoId,
            data: data,
        });
        return waitForResponse(Macro.COMMAND_RETURN_ARGS, retry, pkt, pauseMs);
    }

    /**
     * 发送命令并获取响应数据（用于需要提取payload的情况）
     * @param cmd 命令类型
     * @param algoId 算法ID
     * @param data 数据缓冲区
     * @param retry 重试次数，默认为3
     * @param pauseMs 每次重试之间的暂停时间（毫秒），默认为100
     * @returns PacketData对象，如果失败返回null
     */
    function sendCommandAndGetResponse(cmd: number, algoId: number, data: Buffer, retry: number = 3, pauseMs: number = 100): PacketData | null {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algo_id: algoId,
            data: data,
        });
        if (waitForResponse(Macro.COMMAND_RETURN_ARGS, retry, pkt, pauseMs)) {
            const packetData = getPacketDataFromResponse();
            if (packetData.retValue === 0) {
                return packetData;
            }
        }
        return null;
    }

    /**
     * 发送学习命令并获取学习ID
     * @param cmd 命令类型（LEARN 或 LEARN_BLOCK）
     * @param algoId 算法ID
     * @param data 数据缓冲区
     * @returns 学习到的ID，失败返回0
     */
    function sendLearnCommand(cmd: number, algoId: number, data: Buffer): number {
        const pkt = PacketHead.fromFields({
            cmd: cmd,
            algo_id: algoId,
            data: data,
        });
        if (waitForResponse(Macro.COMMAND_RETURN_ARGS, 3, pkt, 100)) {
            const packetData = getPacketDataFromResponse();
            return packetData.first;
        }
        return 0;
    }

    /**
     * 创建包含坐标和尺寸的10字节Buffer（用于LEARN_BLOCK命令）
     * @param X X坐标
     * @param Y Y坐标
     * @param W 宽度
     * @param H 高度
     * @returns 初始化后的Buffer
     */
    function createBoxBuffer(X: number, Y: number, W: number, H: number): Buffer {
        const dataBuf = Buffer.create(10);
        dataBuf[0] = 0;   // reserved
        dataBuf[1] = 0;   // reserved
        dataBuf[2] = X & 0xFF;
        dataBuf[3] = (X >> 8) & 0xFF;
        dataBuf[4] = Y & 0xFF;
        dataBuf[5] = (Y >> 8) & 0xFF;
        dataBuf[6] = W & 0xFF;
        dataBuf[7] = (W >> 8) & 0xFF;
        dataBuf[8] = H & 0xFF;
        dataBuf[9] = (H >> 8) & 0xFF;
        return dataBuf;
    }

    export function beginInternal(): boolean {
        const dataBuf = createInitializedBuffer(1);
        const pkt = PacketHead.fromFields({
            cmd: Macro.COMMAND_KNOCK,
            algo_id: Algorithm.ALGORITHM_ANY,
            data: dataBuf,
        });
        return waitForResponse(Macro.COMMAND_RETURN_ARGS, 20, pkt, 100);
    }

    export function switchAlgorithmInternal(algo: number): boolean {
        const dataBuf = createInitializedBuffer(algo);
        const pkt = PacketHead.fromFields({
            cmd: Macro.COMMAND_SET_ALGORITHM,
            algo_id: Algorithm.ALGORITHM_ANY,
            data: dataBuf,
        });
        return waitForResponse(Macro.COMMAND_RETURN_ARGS, 3, pkt, 1000);
    }

    export type ResultVariant = Result |  null;
    let result: ResultVariant[][] = [];
    for (let i = 0; i < Macro.ALGORITHM_COUNT; i++) {
        result[i] = [];
        for (let j = 0; j < Macro.MAX_RESULT_NUM; j++) {
            result[i][j] = null;
        }
    }
    let customId: number[] = [Algorithm.ALGORITHM_ANY, Algorithm.ALGORITHM_ANY, Algorithm.ALGORITHM_ANY];

    export function toRealID(id: number): number {
        let algo = id;
        if (id >= Algorithm.ALGORITHM_CUSTOM_BEGIN) {
            for (let i = 0; i < Macro.CUSTOM_ALGORITHM_COUNT; i++)
                if (customId[i] == algo) {
                    algo = (Algorithm.ALGORITHM_CUSTOM0 + i);
                    break;
                }
        }
        return algo;
    }

    export function availableInternal(algo: number): boolean {
        const cacheAlgo = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
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

    export function getCachedResultMaxID(algo: number): number {
        const cacheAlgo = 0;
        return maxID[cacheAlgo] || 0;
    }

    export function getResultInternal(algo: number): number {
        const dataBuf = Buffer.create(0);
        const retry = 3;
        const pkt = PacketHead.fromFields({
            cmd: Macro.COMMAND_GET_RESULT,
            algo_id: algo,
            data: dataBuf,
        });

        // Normalize algorithm ID to 0 for caching
        const cacheAlgo = 0;

        // Clear previous results
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            result[cacheAlgo][i] = null;
        }

        // Request result info with retry
        let info: PacketData | null = null;
        if (waitForResponse(Macro.COMMAND_RETURN_INFO, retry, pkt, 0)) {
            info = getPacketDataFromResponse();
            maxID[cacheAlgo] = info.maxID;
            if (info.total_blocks > Macro.MAX_RESULT_NUM) {
                info.total_blocks = Macro.MAX_RESULT_NUM;
            }
        }

        if (!info) {
            return -1;
        }

        // Process blocks
        let count = 0;
        for (let i = 0; i < info.total_blocks; i++) {
            if (waitForResponse(Macro.COMMAND_RETURN_BLOCK)) {
                const buf = createBufferFromReceive();
                result[cacheAlgo][i] = new Result(buf.slice(5, buf.length - 1));
                count++;
            }
        }

        // Process arrows
        for (let i = info.total_blocks; i < info.total_results; i++) {
            if (waitForResponse(Macro.COMMAND_RETURN_ARROW)) {
                const buf = createBufferFromReceive();
                result[cacheAlgo][i] = new Result(buf.slice(5, buf.length - 1));
                count++;
            }
        }

        return count;
    }

export function getCachedCenterResultInternal(algo: number): ResultVariant | null {
    const cacheAlgo = 0;
    let centerIndex = -1;
    let minLen = 0x7FFFFFFF;
    const centerX = Macro.LCD_WIDTH / 2;
    const centerY = Macro.LCD_HEIGHT / 2;

    for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
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

    export function getCachedResultByIndexInternal(algo: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        if (index < 0 || index >= Macro.MAX_RESULT_NUM) {
            return null;
        }
        return result[cacheAlgo][index];
    }

    export function getCachedResultByIDInternal(algo: number, ID: number): ResultVariant | null {
        const cacheAlgo = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            const r = result[cacheAlgo][i];
            if (r != null) {
                const res = r as Result;
                if (res.ID === ID) {
                    return r;
                }
            }
        }
        return null;
    }

    export function getCachedResultNumInternal(algo: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            if (result[cacheAlgo][i] != null) {
                count++;
            }
        }
        return count;
    }

    export function getCachedResultLearnedNumInternal(algo: number): number {
        return getCachedResultMaxID(algo);
    }

    export function getCachedResultNumByIDInternal(algo: number, ID: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            const r = result[cacheAlgo][i];
            if (r) {
                const res = r as Result;
                if (ID === res.ID) {
                    count++;
                }
            }
        }
        return count;
    }

    export function getCachedIndexResultByIDInternal(algo: number, ID: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        let currentIndex = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            const r = result[cacheAlgo][i];
            if (r) {
                const res = r as Result;
                if (ID === res.ID) {
                    if (currentIndex === index) {
                        return r;
                    }
                    currentIndex++;
                }
            }
        }
        return null;
    }

    export function getCurrentBranchInternal(algo: number): ResultVariant | null {
        const cacheAlgo = 0;
        const item = result[cacheAlgo] && result[cacheAlgo][0];
        return (item && item.level === 1) ? item : null;
    }

    export function getUpcomingBranchCountInternal(algo: number): number {
        const cacheAlgo = 0;
        let count = 0;
        for (let i = 0; i < Macro.MAX_RESULT_NUM; i++) {
            if (result[cacheAlgo][i] != null) {
                count++;
            }
        }
        return count > 0 ? count - 1 : 0;
    }

    export function getBranchInternal(algo: number, index: number): ResultVariant | null {
        const cacheAlgo = 0;
        const targetIndex = index + 1;
        for (let i = 1; i < Macro.MAX_RESULT_NUM; i++) {
            if (result[cacheAlgo][i] != null && i === targetIndex) {
                return result[cacheAlgo][i];
            }
        }
        return null;
    }

    //---------------------------------------------------------------multimedia----------------------------------------
    //% block="play music %name at volume %volume"
    //% name.shadow="text"
    //% name.defl="music.mp3"
    //% weight=119
    //% volume.min=0 volume.max=100 volume.defl=50
    //% subcategory="multimedia"
    export function playMusic(name: string, volume: number): void {
        if (volume < 0) volume = 0;
        if (volume > 100) volume = 100;

        // 创建命令包
        const dataBuf = Buffer.create(10);
        dataBuf[0] = 0;  // 保留字节
        dataBuf[1] = 0;  // 保留字节
        // 设置音量（16位整数）
        dataBuf[2] = volume & 0xFF;
        dataBuf[3] = (volume >> 8) & 0xFF;
        // 添加6个零字节
        for (let i = 4; i < 10; i++) {
            dataBuf[i] = 0;
        }

        // 创建包头，包含字符串数据
        const nameBuf = Buffer.fromUTF8(name);
        const totalBuf = Buffer.create(11 + nameBuf.length); // 10字节数据 + 1字节长度 + 名称长度
        for (let i = 0; i < 10; i++) {
            totalBuf[i] = dataBuf[i];
        }
        totalBuf[10] = nameBuf.length; // 名称长度
        for (let i = 0; i < nameBuf.length; i++) {
            totalBuf[11 + i] = nameBuf[i];
        }

        // 发送命令并等待响应
        sendCommandAndCheckResponse(Macro.COMMAND_ACTION_PLAY_MUSIC, Algorithm.ALGORITHM_ANY, totalBuf);
    }

    let photoName: string = "";
    //% block="take Photo"
    //% weight=118
    //% subcategory="multimedia"
    export function takePhoto(): void {
        const dataBuf = createInitializedBuffer(2);  // 设置分辨率2： RESOLUTION_1280x720
        const packetData = sendCommandAndGetResponse(Macro.COMMAND_ACTION_TAKE_PHOTO, Algorithm.ALGORITHM_ANY, dataBuf);
        if (packetData) {
            photoName = bufferToString(packetData.payload);
        }
    }
    let screenshotName: string = "";
    //% block="Take a screenshot"
    //% weight=116
    //% subcategory="multimedia"
    export function takeScreenshot(): void {
        const dataBuf = Buffer.create(0);
        const pkt = PacketHead.fromFields({
            cmd: Macro.COMMAND_ACTION_TAKE_SCREENSHOT,
            algo_id: Algorithm.ALGORITHM_ANY,
            data: dataBuf,
        });

        const packetData = sendCommandAndGetResponse(Macro.COMMAND_ACTION_TAKE_SCREENSHOT, Algorithm.ALGORITHM_ANY, dataBuf);
        if (packetData) {
            screenshotName = bufferToString(packetData.payload);
        }
    }

    //% block="Obtain the name of the saved screenshot"
    //% weight=115
    //% subcategory="multimedia"
    export function getStoredScreenshotName(): string {
        return screenshotName;
    }

    //% block="Obtain the names of the stored photos"
    //% weight=117
    //% subcategory="multimedia"
    export function getStoredPhotoName(): string {
        return photoName;
    }

    //-------------------------------------------------Screen Display-----------------------------------
    /**
     * 内部函数：绘制矩形框（通用实现）
     * @param cmd 命令类型（DRAW_RECT 或 DRAW_UNIQUE_RECT）
     * @param color 颜色值
     * @param lineWidth 线宽
     * @param x X坐标
     * @param y Y坐标
     * @param w 宽度
     * @param h 高度
     */
    function drawBoxInternal(cmd: number, color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        const dataBuf = Buffer.create(16);
        dataBuf[0] = 0;  // 保留字节
        dataBuf[1] = lineWidth;  // 线宽

        // 设置坐标和尺寸 (int16_t)
        dataBuf[2] = x & 0xFF;
        dataBuf[3] = (x >> 8) & 0xFF;
        dataBuf[4] = y & 0xFF;
        dataBuf[5] = (y >> 8) & 0xFF;
        dataBuf[6] = w & 0xFF;
        dataBuf[7] = (w >> 8) & 0xFF;
        dataBuf[8] = h & 0xFF;
        dataBuf[9] = (h >> 8) & 0xFF;
        dataBuf[10] = 0;  // 保留
        dataBuf[11] = 0;  // 保留

        // 设置颜色 (int32_t)
        dataBuf[12] = color & 0xFF;
        dataBuf[13] = (color >> 8) & 0xFF;
        dataBuf[14] = (color >> 16) & 0xFF;
        dataBuf[15] = (color >> 24) & 0xFF;

        // 发送命令并等待响应
        sendCommandAndCheckResponse(cmd, Algorithm.ALGORITHM_ANY, dataBuf);
    }

    //% block="Draw or update indicator box Color%color Line width%lineWidth x%x y%y width%w height%h"
    //% subcategory="Screen Display"
    //% weight=90
    //% color.min=0 
    //% lineWidth.min=1 lineWidth.max=10
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=1 w.max=640
    //% h.min=1 h.max=480
    export function drawBox(color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        drawBoxInternal(Macro.COMMAND_ACTION_DRAW_UNIQUE_RECT, color, lineWidth, x, y, w, h);
    }

    //% block="Draw new rectangle color%color Line width%lineWidth x%x y%y width%w height%h"
    //% subcategory="Screen Display"
    //% weight=89
    //% color.min=0 
    //% lineWidth.min=1 lineWidth.max=10
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    //% w.min=1 w.max=640
    //% h.min=1 h.max=480
    export function drawNewBox(color: number, lineWidth: number, x: number, y: number, w: number, h: number): void {
        drawBoxInternal(Macro.COMMAND_ACTION_DRAW_RECT, color, lineWidth, x, y, w, h);
    }
    export const enum fontSize {
        FONT_20 = 20,
        FONT_24 = 24,
        FONT_26 = 26,
        FONT_27 = 27,
        FONT_28 = 28,
        FONT_32 = 32,
        FONT_36 = 36,
        FONT_40 = 40,
        FONT_48 = 48,
    }
    //% block="Display text color%color fontSize%fontSize x%x y%y content%content"
    //% subcategory="Screen Display"
    //% weight=91
    //% color.min=0
    //% x.min=0 x.max=640
    //% y.min=0 y.max=480
    export function showText(color: number, fontSize: fontSize, x: number, y: number, content: string): void {
        const textBuf = Buffer.fromUTF8(content);
        const dataBuf = Buffer.create(20 + textBuf.length);

        dataBuf[0] = 0;  // 保留字节
        dataBuf[1] = fontSize;  // 字体大小

        // 设置坐标 (int16_t)
        dataBuf[2] = x & 0xFF;
        dataBuf[3] = (x >> 8) & 0xFF;
        dataBuf[4] = y & 0xFF;
        dataBuf[5] = (y >> 8) & 0xFF;

        // 保留字段
        dataBuf[6] = 0;  // 保留
        dataBuf[7] = 0;  // 保留
        dataBuf[8] = 0;  // 保留
        dataBuf[9] = 0;  // 保留

        // 文字长度
        dataBuf[10] = textBuf.length;

        // 文字内容
        for (let i = 0; i < textBuf.length; i++) {
            dataBuf[11 + i] = textBuf[i];
        }

        // 结束符和颜色
        dataBuf[11 + textBuf.length] = 0;  // 结束符

        // 设置颜色 (int32_t)
        dataBuf[12 + textBuf.length] = color & 0xFF;
        dataBuf[13 + textBuf.length] = (color >> 8) & 0xFF;
        dataBuf[14 + textBuf.length] = (color >> 16) & 0xFF;
        dataBuf[15 + textBuf.length] = (color >> 24) & 0xFF;

        // 发送命令并等待响应
        sendCommandAndCheckResponse(Macro.COMMAND_ACTION_DRAW_TEXT, Algorithm.ALGORITHM_ANY, dataBuf);
    }
    /**
     * Clear text
     */
    //% block="Clear text"
    //% subcategory="Screen Display"
    //% weight=88
    export function clearText(): void {
        sendCommandAndCheckResponse(Macro.COMMAND_ACTION_CLEAR_TEXT, Algorithm.ALGORITHM_ANY, Buffer.create(0));
    }

    /**
     * Clear indicator boxes and rectangles
     */
    //% block="Clear indicator boxes and rectangles"
    //% subcategory="Screen Display"
    //% weight=87
    export function clearBoxes(): void {
        sendCommandAndCheckResponse(Macro.COMMAND_ACTION_CLEAR_RECT, Algorithm.ALGORITHM_ANY, Buffer.create(0));
    }

    //% block="set color red%red green%green blue%blue"
    //% subcategory="Screen Display"
    //% weight=86
    //% red.min=0 red.max=255
    //% green.min=0 green.max=255
    //% blue.min=0 blue.max=255
    export function setRGB(red: number, green: number, blue: number): number {
        red = Math.max(0, Math.min(255, red));
        green = Math.max(0, Math.min(255, green));
        blue = Math.max(0, Math.min(255, blue));
        return ( red<< 16) + (green << 8) + blue;
    }

    //************************************* Learning /Forgetting   ********************************* */
    let learn_id = 0;
    //% block="Get learned ID"
    //% weight=100
    //% subcategory="Learning /Forgetting"
    export function getLearnedID(): number {
        return learn_id || 0;
    }

    //% block="Built-in model %alg learn target at center of screen"
    //% weight=95
    //% subcategory="Learning /Forgetting"
    //% alg.defl=Algorithm_learnObjectAtCenter.ALGORITHM_OBJECT_RECOGNITION
    export function learnObjectAtCenter(alg: Algorithm_learnObjectAtCenter): void {
        learn_id = sendLearnCommand(Macro.COMMAND_ACTION_LEARN, alg, createInitializedBuffer(0));
    }

    //% block="Built-in model %alg learn target at center of screen"
    //% weight=94
    //% subcategory="Learning /Forgetting"
    //% alg.defl=128
    export function learnObjectAtCenterNUM(alg: number): void {
        learn_id = sendLearnCommand(Macro.COMMAND_ACTION_LEARN, alg, createInitializedBuffer(0));
    }

    //% block="Built-in model %alg learn target in specified box X%X Y%Y W%W H%H"
    //% weight=90
    //% subcategory="Learning /Forgetting"
    //% alg.defl=Algorithm_learnObjectInBox.ALGORITHM_FACE_RECOGNITION
    //% X.min=0 X.max=640
    //% Y.min=0 Y.max=480
    //% W.min=10 W.max=100
    //% H.min=10 H.max=100
    export function learnObjectInBox(alg: Algorithm_learnObjectInBox, X: number, Y: number, W: number, H: number): void {
        learn_id = sendLearnCommand(Macro.COMMAND_ACTION_LEARN_BLOCK, alg, createBoxBuffer(X, Y, W, H));
    }

    //% block="Self-trained model %alg learn target in specified box X%X Y%Y W%W H%H"
    //% weight=89
    //% subcategory="Learning /Forgetting"
    //% alg.defl=128
    //% X.min=0 X.max=640
    //% Y.min=0 Y.max=480
    //% W.min=10 W.max=100
    //% H.min=10 H.max=100
    export function learnObjectInBoxNUM(alg: number, X: number, Y: number, W: number, H: number): void {
        learn_id = sendLearnCommand(Macro.COMMAND_ACTION_LEARN_BLOCK, alg, createBoxBuffer(X, Y, W, H));
    }

    //% block="Set built-in model %alg id%id name to %name"
    //% weight=70
    //% subcategory="Learning /Forgetting"
    //% alg.defl=AlgorithmLearn_setNameOfID.ALGORITHM_FACE_RECOGNITION
    //% id.min=1 id.max=100 id.defl=1
    //% name.defl="Object"
    export function setNameOfID(alg: AlgorithmLearn_setNameOfID, id: number, name: string): void {
        // 创建包含ID和名称的Buffer
        const nameBuf = Buffer.fromUTF8(name);
        const dataBuf = Buffer.create(10 + 1 + nameBuf.length); // 10字节 + 1字节长度 + 名称

        dataBuf[0] = id; // id
        // 填充剩余9个字节为0
        for (let i = 1; i < 10; i++) {
            dataBuf[i] = 0;
        }
        // 名称长度
        dataBuf[10] = nameBuf.length;
        // 名称内容
        for (let i = 0; i < nameBuf.length; i++) {
            dataBuf[11 + i] = nameBuf[i];
        }

        sendCommandAndWait(Macro.COMMAND_SET_NAME_BY_ID, alg, dataBuf);
    }

    //% block="Forget built-in model %alg all IDs"
    //% weight=80
    //% subcategory="Learning /Forgetting"
    //% alg.defl=Algorithm.ALGORITHM_OBJECT_RECOGNITION
    export function forgetAllIDs(alg: Algorithm): void {
        sendCommandAndWait(Macro.COMMAND_ACTION_FORGET, alg, createInitializedBuffer(alg));
    }

    //% block="Forget self-trained model %alg all IDs"
    //% weight=79
    //% subcategory="Learning /Forgetting"
    //% alg.defl=128
    export function forgetAllIDsNUM(alg: number): void {
        sendCommandAndWait(Macro.COMMAND_ACTION_FORGET, alg, createInitializedBuffer(alg));
    }

}