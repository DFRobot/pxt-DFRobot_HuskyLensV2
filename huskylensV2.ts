/**
 * Custom graphic block
 */
//% weight=100 color=#0fbc11 icon="\uf067" block="HuskylensV2"
//% groups='["Communication","Algorithm Switch","Face Recognition","Object Recognition","Object Tracking","Color Recognition","Object Classification","Self-learning Classification","Instance Segmentation","Hand Recognition","Pose Recognition","License Plate Recognition","Optical Char Recognition","Line Tracking","Face Emotion Recognition","Tag Recognition","QR Code Recognition","Barcode Recognition"]'
namespace huskylensV2 {
    // MakeCode global types are automatically injected, these declarations are only to suppress IDE warnings
    // These declarations are not needed in the actual MakeCode compilation environment
    // ==================== Low-level Communication Code ====================
    const I2CADDR = 0x50;
   
    const COMMAND_KNOCK = 0x20
    const COMMAND_GET_RESULT = 0x21
    const COMMAND_GET_INFO = 0x22
    const COMMAND_GET_RESULT_BY_ID = 0x23
    const COMMAND_GET_BLOCKS_BY_ID = 0x24
    const COMMAND_GET_ARROWS_BY_ID = 0x25
    const COMMAND_GET_SENSOR_LIST = 0x26
    const COMMAND_GET_RESULT_BY_INDEX = 0x27
    const COMMAND_GET_BLOCKS_BY_INDEX = 0x28
    const COMMAND_GET_ARROWS_BY_INDEX = 0x29

    const COMMAND_SET_ALGORITHM = 0x30
    const COMMAND_SET_NAME_BY_ID = 0x31
    const COMMAND_SET_MULTI_ALGORITHM = 0x32
    const COMMAND_SET_MULTI_ALGORITHM_RATIO = 0x33
    const COMMAND_SET_LEARN_BLOCK_POSITION = 0x34

    const COMMAND_RETURN_OK = 0x40
    const COMMAND_RETURN_ERROR = 0x41
    const COMMAND_RETURN_INFO = 0x42
    const COMMAND_RETURN_BLOCK = 0x43
    const COMMAND_RETURN_ARROW = 0x44
    const COMMAND_RETURN_SENSOR_LIST = 0x45

    const COMMAND_ACTION_TAKE_PHOTO = 0x50
    const COMMAND_ACTION_TAKE_SCREENSHOT = 0x51
    const COMMAND_ACTION_LEARN = 0x52
    const COMMAND_ACTION_FORGOT = 0x53

    const COMMAND_ACTION_SAVE_KNOWLEDGES = 0x54
    const COMMAND_ACTION_LOAD_KNOWLEDGES = 0x55

    const COMMAND_ACTION_DRAW_RECT = 0x56
    const COMMAND_ACTION_CLEAN_RECT = 0x57
    const COMMAND_ACTION_DRAW_TEXT = 0x58
    const COMMAND_ACTION_CLEAR_TEXT = 0x59
    const COMMAND_ACTION_PLAY_MUSIC = 0x5A

    const ALGORITHM_ANY = 0                     
    const ALGORITHM_FACE_RECOGNITION = 1         
    const ALGORITHM_OBJECT_TRACKING  = 2         
    const ALGORITHM_OBJECT_RECOGNITION = 3        
    const ALGORITHM_LINE_TRACKING = 4              
    const ALGORITHM_COLOR_RECOGNITION = 5          
    const ALGORITHM_TAG_RECOGNITION    =6       
    const ALGORITHM_SELF_LEARNING_CLASSIFICATION = 7
    const ALGORITHM_OCR_RECOGNITION          =   8
    const ALGORITHM_LICENSE_RECOGNITION      =   9
    const ALGORITHM_QRCODE_RECOGNITION       =  10
    const ALGORITHM_BARCODE_RECOGNITION      =   11
    const ALGORITHM_EMOTION_RECOGNITION      =   12
    const ALGORITHM_POSE_RECOGNITION         =   13
    const ALGORITHM_HAND_RECOGNITION         =   14
    const ALGORITHM_OBJECT_CLASSIFICATION    =   15
    const ALGORITHM_BLINK_RECOGNITION        =   16
    const ALGORITHM_GAZE_RECOGNITION         =   17
    const ALGORITHM_FACE_ORIENTATION         =   18
    const ALGORITHM_FALLDOWN_RECOGNITION     =   19
    const ALGORITHM_SEGMENT                  =   20
    const ALGORITHM_FACE_ACTION_RECOGNITION =    21
    const ALGORITHM_CUSTOM0                 =    22
    const ALGORITHM_CUSTOM1                 =    23
    const ALGORITHM_CUSTOM2                 =    24
    const ALGORITHM_BUILTIN_COUNT           =    25
    const ALGORITHM_CUSTOM_BEGIN = 128

    const FRAME_BUFFER_SIZE = 128
    const MAX_RESULT_NUM = 6
    const CMD_BUFFER_SIZE = 32
    const LCD_WIDTH = 640
    const LCD_HEIGHT = 480

    const HEADER_0_INDEX = 0
    const HEADER_1_INDEX = 1
    const COMMAND_INDEX = 2
    const ALGO_INDEX = 3
    const CONTENT_SIZE_INDEX = 4
    const CONTENT_INDEX = 5
    const PROTOCOL_SIZE = 6

    const ALGORITHM_COUNT = ALGORITHM_BUILTIN_COUNT
    const CUSTOM_ALGORITHM_COUNT = 3

    const timeOutDuration = 2000

    function checksum(buf: Buffer): number {
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
            sum = (sum + buf[i]) & 0xFF;
        }
        return sum;
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
    
            let total_length = PacketHead.HEADER_SIZE + data.length  + 1;
            if(name_data.length > 0){
                total_length += name_data.length + 1;
            }
            const buf = Buffer.create(total_length);
    
            buf[0] = fields.head55 !== undefined ? fields.head55 : 0x55;
            buf[1] = fields.headaa !== undefined ? fields.headaa : 0xaa;
            buf[2] = fields.cmd;
            buf[3] = fields.algo_id;
            buf[4] = data.length;
            if(name_data.length > 0){
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
    
            const cs = checksum(buf.slice(0, PacketHead.HEADER_SIZE + total_length - 1));
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
    
            const cs = checksum(buf);
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
    
      get ID() { return this.buffer[0] }
      set ID(v: number) { this.buffer[0] = v & 0xff; }
    
      get maxID() { return this.buffer[0] }
      set maxID(v: number) { this.buffer[0] = v & 0xff; }
    
      get rfu0() { return this.buffer[0] }
      set rfu0(v: number) { this.buffer[0] = v & 0xff; }
    
      get boardType() { return this.buffer[0] }
      set boardType(v: number) { this.buffer[0] = v & 0xff; }
    
      get totalSensors() { return this.buffer[0] }
      set totalSensors(v: number) { this.buffer[0] = v & 0xff; }
    
      get multiAlgoNum() { return this.buffer[0] }
      set multiAlgoNum(v: number) { this.buffer[0] = v & 0xff; }
    
      get rfu1() { return this.buffer[1]; }
      set rfu1(v: number) { this.buffer[1] = v & 0xff; }
    
      get level() { return this.buffer[1]; }
      set level(v: number) { this.buffer[1] = v & 0xff; }
    
      get confidence() { return this.buffer[1]; }
      set confidence(v: number) { this.buffer[1] = v & 0xff; }
    
      get currSensorIndex() { return this.buffer[1]; }
      set currSensorIndex(v: number) { this.buffer[1] = v & 0xff; }
    
      get first() { return this.buffer[2] + this.buffer[3] * 256; }
      set first(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get xCenter() { return this.buffer[2] + this.buffer[3] * 256; }
      set xCenter(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get xTarget() { return this.buffer[2] + this.buffer[3] * 256; }
      set xTarget(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get algorithmType() { return this.buffer[2] + this.buffer[3] * 256; }
      set algorithmType(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get classID() { return this.buffer[2] + this.buffer[3] * 256; }
      set classID(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get sensor0ID() { return this.buffer[2] + this.buffer[3] * 256; }
      set sensor0ID(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get total_results() { return this.buffer[2] + this.buffer[3] * 256; }
      set total_results(v: number) { this.buffer[2] = v & 0xff; this.buffer[3] = (v >> 8) & 0xff; }
    
      get second() { return this.buffer[4] + this.buffer[5] * 256; }
      set second(v: number) { this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }
    
      get yCenter() { return this.buffer[4] + this.buffer[5] * 256; }
      set yCenter(v: number) { this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }
    
      get yTarget() { return this.buffer[4] + this.buffer[5] * 256; }
      set yTarget(v: number) { this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }
    
      get sensor1ID() { return this.buffer[4] + this.buffer[5] * 256; }
      set sensor1ID(v: number) { this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }
    
      get total_results_learned() { return this.buffer[4] + this.buffer[5] * 256; }
      set total_results_learned(v: number) { this.buffer[4] = v & 0xff; this.buffer[5] = (v >> 8) & 0xff; }
    
      get third() { return this.buffer[6] + this.buffer[7] * 256; }
      set third(v: number) { this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }
    
      get width() { return this.buffer[6] + this.buffer[7] * 256; }
      set width(v: number) { this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }
    
      get angle() { return this.buffer[6] + this.buffer[7] * 256; }
      set angle(v: number) { this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }
    
      get sensor2ID() { return this.buffer[6] + this.buffer[7] * 256; }
      set sensor2ID(v: number) { this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }
    
      get total_blocks() { return this.buffer[6] + this.buffer[7] * 256; }
      set total_blocks(v: number) { this.buffer[6] = v & 0xff; this.buffer[7] = (v >> 8) & 0xff; }
    
      get fourth() { return this.buffer[8] + this.buffer[9] * 256; }
      set fourth(v: number) { this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }
    
      get height() { return this.buffer[8] + this.buffer[9] * 256; }
      set height(v: number) { this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }
    
      get length() { return this.buffer[8] + this.buffer[9] * 256; }
      set length(v: number) { this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }
    
      get total_blocks_learned() { return this.buffer[8] + this.buffer[9] * 256; }
      set total_blocks_learned(v: number) { this.buffer[8] = v & 0xff; this.buffer[9] = (v >> 8) & 0xff; }
    
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

    class Result extends PacketData {
      used: number = 0;
      name: string = "";
      content: string = "";
    
      constructor(buffer: Buffer) {
        super(buffer);
        
        // Debug info: First check the first 20 bytes of buffer
        //console.log("=== Result constructor debug ===");
        //console.log("buffer length: " + buffer.length);
        //console.log("buffer[0-19] hex: " + bufferToHex(buffer.slice(0, 20), 20));
        //console.log("buffer[10] (name_length): " + buffer[10] + " (0x" + toHex(buffer[10]) + ")");
        
        let name_length = buffer[10];
        //console.log("name_length: " + name_length);
        
        // Check if name_length is 0, if so, there is no name field
        if (name_length === 0) {
            this.name = "";
            // For license plate and OCR recognition, content may still exist even when name_length is 0
            // Try to parse content from buffer[11] if buffer is long enough
            if (buffer.length > 11) {
                let content_length = buffer[11];
                if (content_length > 0 && buffer.length > 12 + content_length) {
                    this.content = bufferToStringAtOffset(buffer, 12, content_length);
                } else {
                    this.content = "";
                }
            } else {
                this.content = "";
            }
            //console.log("name_length is 0, skipping name and content");
            //console.log("================================");
            return;
        }
        
        let content_length = buffer[11 + name_length];
        
        // Directly decode from buffer at specific offsets, avoiding slice() which may have issues in MakeCode
        this.name = bufferToStringAtOffset(buffer, 11, name_length);
        this.content = bufferToStringAtOffset(buffer, 12 + name_length, content_length);
        
        // Debug info: Print final result
        //console.log("final name: [" + this.name + "]");
        //console.log("final name length: " + this.name.length);
        //console.log("================================");
      }
    
      printInfo() {
        // console.log(`(${this.xCenter}, ${this.yCenter}) size=(${this.width}x${this.height})`);
      }
    }  
    
    class FaceResult extends Result {
      leye_x: number = 0; leye_y: number = 0;
      reye_x: number = 0; reye_y: number = 0;
      nose_x: number = 0; nose_y: number = 0;
      lmouth_x: number = 0; lmouth_y: number = 0;
      rmouth_x: number = 0; rmouth_y: number = 0;
    
      constructor(buf: Buffer) {
        super(buf);
        let name_length = buf[10];
        let content_length = buf[11 + name_length];
        
        let offset = 12 + content_length + name_length;
    
        this.leye_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.leye_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.reye_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.reye_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.nose_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.nose_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lmouth_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lmouth_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rmouth_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rmouth_y = buf[offset]+buf[offset+1]*256; offset += 2;
      }
    }
    
    class HandResult extends Result {
      wrist_x: number = 0; wrist_y: number = 0;
      thumb_cmc_x: number = 0; thumb_cmc_y: number = 0;
      thumb_mcp_x: number = 0; thumb_mcp_y: number = 0;
      thumb_ip_x: number = 0; thumb_ip_y: number = 0;
      thumb_tip_x: number = 0; thumb_tip_y: number = 0;
      index_finger_mcp_x: number = 0; index_finger_mcp_y: number = 0;
      index_finger_pip_x: number = 0; index_finger_pip_y: number = 0;
      index_finger_dip_x: number = 0; index_finger_dip_y: number = 0;
      index_finger_tip_x: number = 0; index_finger_tip_y: number = 0;
      middle_finger_mcp_x: number = 0; middle_finger_mcp_y: number = 0;
      middle_finger_pip_x: number = 0; middle_finger_pip_y: number = 0;
      middle_finger_dip_x: number = 0; middle_finger_dip_y: number = 0;
      middle_finger_tip_x: number = 0; middle_finger_tip_y: number = 0;
      ring_finger_mcp_x: number = 0; ring_finger_mcp_y: number = 0;
      ring_finger_pip_x: number = 0; ring_finger_pip_y: number = 0;
      ring_finger_dip_x: number = 0; ring_finger_dip_y: number = 0;
      ring_finger_tip_x: number = 0; ring_finger_tip_y: number = 0;
      pinky_finger_mcp_x: number = 0; pinky_finger_mcp_y: number = 0;
      pinky_finger_pip_x: number = 0; pinky_finger_pip_y: number = 0;
      pinky_finger_dip_x: number = 0; pinky_finger_dip_y: number = 0;
      pinky_finger_tip_x: number = 0; pinky_finger_tip_y: number = 0;
    
      constructor(buf: Buffer) {
        super(buf);
        let name_length = buf[10];
        let content_length = buf[11 + name_length];
        let offset = 12 + content_length + name_length;
        
        this.wrist_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.wrist_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_cmc_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_cmc_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_mcp_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_mcp_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_ip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_ip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_tip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.thumb_tip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_mcp_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_mcp_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_pip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_pip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_dip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_dip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_tip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.index_finger_tip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_mcp_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_mcp_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_pip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_pip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_dip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_dip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_tip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.middle_finger_tip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_mcp_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_mcp_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_pip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_pip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_dip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_dip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_tip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.ring_finger_tip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_mcp_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_mcp_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_pip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_pip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_dip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_dip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_tip_x = buf[offset]+buf[offset+1]*256; offset += 2;
        this.pinky_finger_tip_y = buf[offset]+buf[offset+1]*256; offset += 2;
      }
    }
    
    class PoseResult extends Result {
      nose_x: number = 0; nose_y: number = 0;
      leye_x: number = 0; leye_y: number = 0;
      reye_x: number = 0; reye_y: number = 0;
      lear_x: number = 0; lear_y: number = 0;
      rear_x: number = 0; rear_y: number = 0;
      lshoulder_x: number = 0; lshoulder_y: number = 0;
      rshoulder_x: number = 0; rshoulder_y: number = 0;
      lelbow_x: number = 0; lelbow_y: number = 0;
      relbow_x: number = 0; relbow_y: number = 0;
      lwrist_x: number = 0; lwrist_y: number = 0;
      rwrist_x: number = 0; rwrist_y: number = 0;
      lhip_x: number = 0; lhip_y: number = 0;
      rhip_x: number = 0; rhip_y: number = 0;
      lknee_x: number = 0; lknee_y: number = 0;
      rknee_x: number = 0; rknee_y: number = 0;
      lankle_x: number = 0; lankle_y: number = 0;
      rankle_x: number = 0; rankle_y: number = 0;
    
      constructor(buf: Buffer) {
        super(buf);
        let name_length = buf[10];
        let content_length = buf[11 + name_length];
        let offset = 12 + content_length + name_length;

        this.nose_x = buf[offset]+buf[offset+1]*256; offset += 2; this.nose_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.leye_x = buf[offset]+buf[offset+1]*256; offset += 2; this.leye_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.reye_x = buf[offset]+buf[offset+1]*256; offset += 2; this.reye_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lear_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lear_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rear_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rear_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lshoulder_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lshoulder_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rshoulder_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rshoulder_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lelbow_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lelbow_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.relbow_x = buf[offset]+buf[offset+1]*256; offset += 2; this.relbow_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lwrist_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lwrist_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rwrist_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rwrist_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lhip_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lhip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rhip_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rhip_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lknee_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lknee_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rknee_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rknee_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.lankle_x = buf[offset]+buf[offset+1]*256; offset += 2; this.lankle_y = buf[offset]+buf[offset+1]*256; offset += 2;
        this.rankle_x = buf[offset]+buf[offset+1]*256; offset += 2; this.rankle_y = buf[offset]+buf[offset+1]*256; offset += 2;
      }
    }

    let retry = 3
    let maxID: number[] = [];
    for (let i = 0; i < ALGORITHM_COUNT; i++) {
        maxID.push(0);
    }
    let timeOutTimer = 0
    // Use loop to initialize array to ensure ES5 compatibility
    let i2c_cached_data: number[] = []
    let receive_buffer: number[] = [];
    for (let i = 0; i < FRAME_BUFFER_SIZE; i++) {
        receive_buffer.push(0);
    }
    let receive_index = 0
    
    function timerBegin() { timeOutTimer = control.millis(); }
    function timerAvailable() : boolean {
      return (control.millis() - timeOutTimer > timeOutDuration);
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

    function protocolAvailable() : boolean{
          let response = pins.i2cReadBuffer(I2CADDR, 32);
          if (response.length > 0) {
            // console.log("protocolAvailable: Received " + response.length + " bytes");
            // Print received raw data
            for (let k = 0; k < response.length; k++) {
                i2c_cached_data.push(response[k]);
            }
          }
          while(i2c_cached_data.length){
            let data = i2c_cached_data.shift();
            if (data != null) {
              if (husky_lens_protocol_receive(data)) {
                return true;
              }
            }
          }

          return false;
    }

    function husky_lens_protocol_receive(data: number): boolean {
        //console.log("receive_index=" + receive_index + "  data=0x" + toHex(data));
        switch (receive_index) {
        case HEADER_0_INDEX:
          if (data != 0x55) {
            receive_index = 0;
            return false;
          }
          receive_buffer[HEADER_0_INDEX] = 0x55;
          break;
        case HEADER_1_INDEX:
          if (data != 0xaa) {
            receive_index = 0;
            return false;
          }
          receive_buffer[HEADER_1_INDEX] = 0xaa;
          break;
        case COMMAND_INDEX:
          receive_buffer[COMMAND_INDEX] = data;
          break;
        case ALGO_INDEX:
          receive_buffer[ALGO_INDEX] = data;
          break;
        case CONTENT_SIZE_INDEX:
          if (receive_index >= FRAME_BUFFER_SIZE - PROTOCOL_SIZE) {
            receive_index = 0;
            return false;
          }
          receive_buffer[CONTENT_SIZE_INDEX] = data;
          break;
        default:
          receive_buffer[receive_index] = data;
          let expectedLen = receive_buffer[CONTENT_SIZE_INDEX] + CONTENT_INDEX;
          if (receive_index == expectedLen) {
            receive_index = 0;
            return validateCheckSum();
          }
          break;
        }
        receive_index++;
        return false;
    }

    function validateCheckSum() : boolean {
        let stackSumIndex = receive_buffer[CONTENT_SIZE_INDEX] + CONTENT_INDEX;
        let sum = 0;
        let i;
        for (i = 0; i < stackSumIndex; i++) {
          sum += receive_buffer[i];
        }
        sum = sum&0xff;
        let expected = receive_buffer[stackSumIndex];
        let isValid = (sum == expected);
        return isValid;
    }

    function wait(cmd: number, command: number): boolean {
        //console.log("wait: Waiting for command 0x" + toHex(command));
        timerBegin();    
        while (!timerAvailable()) {
            if (protocolAvailable()) {
                let receivedCmd = receive_buffer[COMMAND_INDEX];
                if (command === receivedCmd) {
                    return true;
                } else {
                    return false;
                }
            }
            basic.pause(10);
        }
        return false;
    }

    function protocolWrite(buffer: Buffer) {
          pins.i2cWriteBuffer(I2CADDR, buffer);
    }

    function beginInternal(): boolean {
        const dataBuf = Buffer.create(10);
        dataBuf[0] = 1;
        const pkt = PacketHead.fromFields({
          cmd: COMMAND_KNOCK,
          algo_id: ALGORITHM_ANY,
          data: dataBuf,
        });
        
        for (let i = 0; i < 3; i++) {
            protocolWrite(pkt);
            basic.pause(100);
            if (wait(COMMAND_KNOCK, COMMAND_RETURN_OK)) {
              return true;
            }
        }
        return false;
    }

    function switchAlgorithmInternal(algo : number): boolean {
        const dataBuf = Buffer.create(10);
        dataBuf[0] = algo;
        const pkt = PacketHead.fromFields({
          cmd: COMMAND_SET_ALGORITHM,
          algo_id: ALGORITHM_ANY,
          data: dataBuf,
        });

        for (let i = 0; i < 3; i++) {
            protocolWrite(pkt);
            basic.pause(100);
            if (wait(COMMAND_SET_ALGORITHM, COMMAND_RETURN_OK)) {
              return true;
            }
        }
        return false;
    }

    type ResultVariant = Result | FaceResult | HandResult | PoseResult | null;
    let result: ResultVariant[][] = [];
    for (let i = 0; i < ALGORITHM_COUNT; i++) {
        result[i] = [];
        for (let j = 0; j < MAX_RESULT_NUM; j++) {
            result[i][j] = null;
        }
    }
    let customId: number[] = [ALGORITHM_ANY, ALGORITHM_ANY, ALGORITHM_ANY];
    
    function toRealID(id: number) : number {
      let algo = id;
      if (id >= ALGORITHM_CUSTOM_BEGIN) {
        for (let i = 0; i < CUSTOM_ALGORITHM_COUNT; i++)
          if (customId[i] == algo) {
            algo = (ALGORITHM_CUSTOM0 + i);
            break;
          }
      }
      return algo;
    }

    function availableInternal(algo: number): boolean {
      let ret = false;
      algo = toRealID(algo);
    
      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        const r = result[algo][i];
        if (r != null) {
          const res = r as Result;
          if (!res.used) {
            ret = true;
            break;
          }
        }
      }
    
      return ret;
    }

    function getCachedResultMaxID(algo:number): number { 
        algo = toRealID(algo);
        return maxID[algo] || 0; 
    }

    function getResultInternal(algo:number) : number {
        const dataBuf = Buffer.create(0);
        let pkt = PacketHead.fromFields({
          cmd: COMMAND_GET_RESULT,
          algo_id: algo,
          data: dataBuf,
        });

        let i = 0
        let _count = 0
        let info = new PacketData(Buffer.create(10));
        algo = toRealID(algo);
        for (i = 0; i < MAX_RESULT_NUM; i++) {
          result[algo][i] = null;
        }
        for (i = 0; i < retry; i++) {
            protocolWrite(pkt)
            if (wait(COMMAND_GET_RESULT, COMMAND_RETURN_INFO)) {
                  let buf = Buffer.create(receive_buffer.length);
                  for (let j = 0; j < receive_buffer.length; j++) {
                      buf[j] = receive_buffer[j];
                  }
                  info = new PacketData(buf.slice(5, buf.length - 1));
                  maxID[algo] = info.maxID;
                  if (info.total_results > MAX_RESULT_NUM) {
                    info.total_results = MAX_RESULT_NUM;
                  }
                  if (info.total_blocks > MAX_RESULT_NUM) {
                    info.total_blocks = MAX_RESULT_NUM;
                  }
                  break;
            }
        }
        if (i == retry) {
          return -1;
        }
        for (i = 0; i < info.total_blocks; i++) {
          if (wait(0, COMMAND_RETURN_BLOCK)) {
            _count++;
            let buf = Buffer.create(receive_buffer.length);
            for (let j = 0; j < receive_buffer.length; j++) {
                buf[j] = receive_buffer[j];
            }
            let dataBuf = buf.slice(5, buf.length - 1);
            if (algo == ALGORITHM_FACE_RECOGNITION) {
              result[algo][i] = new FaceResult(dataBuf);
            } else if (algo == ALGORITHM_HAND_RECOGNITION) {
              result[algo][i] = new HandResult(dataBuf);
            } else if (algo == ALGORITHM_POSE_RECOGNITION) {
              result[algo][i] = new PoseResult(dataBuf);
            } else {
              result[algo][i] = new Result(dataBuf);
            }
          }
        }
        for (i = info.total_blocks; i < info.total_results; i++) {
          if (wait(0,COMMAND_RETURN_ARROW)) {
            _count++;
            let buf = Buffer.create(receive_buffer.length);
            for (let j = 0; j < receive_buffer.length; j++) {
                buf[j] = receive_buffer[j];
            }
            result[algo][i] = new Result(buf.slice(5, buf.length - 1));     
          }
        }
        return _count;
    }

    function getCachedCenterResultInternal(algo: number): ResultVariant | null {
      algo = toRealID(algo);
      let centerIndex = -1;
      let minLen = 999999999;
      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        const r = result[algo][i];
        if (r) {
          const res = r as Result;
          const len = (res.xCenter - LCD_WIDTH / 2) ** 2 +
                      (res.yCenter - LCD_HEIGHT / 2) ** 2;
          if (len < minLen) {
            minLen = len;
            centerIndex = i;
          }
        }
      }
      if (centerIndex != -1) {
        return result[algo][centerIndex];
      }
      return null;
    }

    function getCachedResultByIndexInternal(algo: number, index: number): ResultVariant | null {
        algo = toRealID(algo);

        if (index >= MAX_RESULT_NUM) {
              return null;
        }
        return result[algo][index];
    }

    function getCachedResultByIDInternal(algo: number, ID: number): ResultVariant | null {
      algo = toRealID(algo);

      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        const r = result[algo][i];
        if (r == null) {
          continue;
        }
        const res = r as Result;
        if (res.ID == ID) {
          return r;
        }
      }
      return null;
    }

    function getCachedResultNumInternal(algo: number): number {
      let count = 0;
      algo = toRealID(algo);
    
      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        if (result[algo][i] != null) {
          count++;
        }
      }
      return count;
    }

    function getCachedResultLearnedNumInternal(algo: number): number {
        algo = toRealID(algo);
        return getCachedResultMaxID(algo);
    }

    function getCachedResultNumByIDInternal(algo: number, ID: number): number {
      let count = 0;
      algo = toRealID(algo);

      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        const r = result[algo][i];
        if (r) {
          const res = r as Result;
          if (ID == res.ID) {
            count++;
          }
        }
      }
      return count;
    }

    function getCachedIndexResultByIDInternal(algo: number, ID: number, index: number): ResultVariant | null {
      let rlt: ResultVariant | null = null;
      let _index = 0;
      algo = toRealID(algo);
      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        const r = result[algo][i];
        if (r) {
          const res = r as Result;
          if (ID == res.ID) {
            if (_index == index) {
              return r;
            }
            _index++;
          }
        }
      }
      return rlt;
    }

    function getCurrentBranchInternal(algo: number): ResultVariant | null {
      algo = toRealID(algo);
    
      const item = result[algo] && result[algo][0];
    
      if (item && item.level === 1) {
        return item;
      }
    
      return null;
    }

    function getUpcomingBranchCountInternal(algo: number): number {
      let count  = 0;
      algo = toRealID(algo);
    
      for (let i = 0; i < MAX_RESULT_NUM; i++) {
        if (result[algo][i] != null) {
          count++;
        }
      }
      return count>0 ? count-1 : 0;
    }

    function getBranchInternal(algo: number, index: number): ResultVariant | null {
        let rlt: ResultVariant | null = null;
        index++;
        algo = toRealID(algo);
 
        for (let i = 1; i < MAX_RESULT_NUM; i++) {
            if (result[algo][i] != null) {
                if(i == index){
                  rlt = result[algo][i];
                  break;
                }
            }
        }
        return rlt;
    }
    // ==================== End of Low-level Communication Code ====================

    // Algorithm selection enum
    export enum Algorithm {
        //% blockHidden=true
        ALGORITHM_ANY = 0,                      // 0
        //% block="Face recognition"
        ALGORITHM_FACE_RECOGNITION = 1,         // 1
        //% block="Object recognition"
        ALGORITHM_OBJECT_RECOGNITION = 3,       // 3
        //% block="Object tracking"
        ALGORITHM_OBJECT_TRACKING = 2,          // 2
        //% block="Color recognition"
        ALGORITHM_COLOR_RECOGNITION = 5,        // 5
        //% block="Object classification"
        ALGORITHM_OBJECT_CLASSIFICATION = 15,   // 15
        //% block="Self-learning classification"
        ALGORITHM_SELF_LEARNING_CLASSIFICATION = 7, // 7
        //% block="Instance Segmentation"
        ALGORITHM_SEGMENT = 20,                 // 20
        //% block="Hand recognition"
        ALGORITHM_HAND_RECOGNITION = 14,        // 14
        //% block="Pose recognition"
        ALGORITHM_POSE_RECOGNITION = 13,        // 13
        //% block="License plate recognition"
        ALGORITHM_LICENSE_RECOGNITION = 9,      // 9
        //% block="OCR recognition"
        ALGORITHM_OCR_RECOGNITION = 8,          // 8
        //% block="Line tracking"
        ALGORITHM_LINE_TRACKING = 4,            // 4
        //% block="Face Emotion Recognition"
        ALGORITHM_EMOTION_RECOGNITION = 12,     // 12
        //% block="Tag recognition"
        ALGORITHM_TAG_RECOGNITION = 6,          // 6
        //% block="QR code recognition"
        ALGORITHM_QRCODE_RECOGNITION = 10,      // 10
        //% block="Barcode recognition"
        ALGORITHM_BARCODE_RECOGNITION = 11,     // 11
        //% blockHidden=true
        ALGORITHM_BLINK_RECOGNITION = 16,       // 16
        //% blockHidden=true
        ALGORITHM_GAZE_RECOGNITION = 17,        // 17
        //% blockHidden=true
        ALGORITHM_FACE_ORIENTATION = 18,        // 18
        //% blockHidden=true
        ALGORITHM_FALLDOWN_RECOGNITION = 19,    // 19
        //% blockHidden=true
        ALGORITHM_FACE_ACTION_RECOGNITION = 21, // 21
        //% blockHidden=true
        ALGORITHM_CUSTOM0 = 22,                 // 22
        //% blockHidden=true
        ALGORITHM_CUSTOM1 = 23,                 // 23
        //% blockHidden=true
        ALGORITHM_CUSTOM2 = 24,                 // 24
        //% blockHidden=true
        ALGORITHM_BUILTIN_COUNT = 25,           // 25
        //% blockHidden=true
        ALGORITHM_CUSTOM_BEGIN = 128,           // 128
    }

    // Face properties (with ID)
    export enum FaceProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Left Eye X"
        LeftEyeX,
        //% block="Left Eye Y"
        LeftEyeY,
        //% block="Right Eye X"
        RightEyeX,
        //% block="Right Eye Y"
        RightEyeY,
        //% block="Left Mouth X"
        LeftMouthX,
        //% block="Left Mouth Y"
        LeftMouthY,
        //% block="Right Mouth X"
        RightMouthX,
        //% block="Right Mouth Y"
        RightMouthY,
        //% block="Nose X"
        NoseX,
        //% block="Nose Y"
        NoseY,
    }

    // Face properties (without ID)
    export enum FacePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Left Eye X"
        LeftEyeX,
        //% block="Left Eye Y"
        LeftEyeY,
        //% block="Right Eye X"
        RightEyeX,
        //% block="Right Eye Y"
        RightEyeY,
        //% block="Left Mouth X"
        LeftMouthX,
        //% block="Left Mouth Y"
        LeftMouthY,
        //% block="Right Mouth X"
        RightMouthX,
        //% block="Right Mouth Y"
        RightMouthY,
        //% block="Nose X"
        NoseX,
        //% block="Nose Y"
        NoseY,
    }

    // Object properties (with ID)
    export enum ObjectProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    // Object properties (without ID)
    export enum ObjectPropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    // Color properties (with ID)
    export enum ColorProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    // Color properties (without ID)
    export enum ColorPropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    // Instance properties (with ID)
    export enum InstanceProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    // Instance properties (without ID)
    export enum InstancePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }


    // Helper function: Convert Algorithm enum to algorithm ID
    function algorithmToID(alg: Algorithm): number {
        return alg as number;
    }

    // Helper function: Get FaceResult property value
    function getFacePropertyValue(result: ResultVariant, prop: FaceProperty): any {
        if (!result) return 0;
        if (result instanceof FaceResult) {
            const fr = result as FaceResult;
            switch (prop) {
                case FaceProperty.ID: return fr.ID;
                case FaceProperty.Name: return fr.name; // Return name length or existence flag
                case FaceProperty.XCenter: return fr.xCenter;
                case FaceProperty.YCenter: return fr.yCenter;
                case FaceProperty.Width: return fr.width;
                case FaceProperty.Height: return fr.height;
                case FaceProperty.LeftEyeX: return fr.leye_x;
                case FaceProperty.LeftEyeY: return fr.leye_y;
                case FaceProperty.RightEyeX: return fr.reye_x;
                case FaceProperty.RightEyeY: return fr.reye_y;
                case FaceProperty.LeftMouthX: return fr.lmouth_x;
                case FaceProperty.LeftMouthY: return fr.lmouth_y;
                case FaceProperty.RightMouthX: return fr.rmouth_x;
                case FaceProperty.RightMouthY: return fr.rmouth_y;
                case FaceProperty.NoseX: return fr.nose_x;
                case FaceProperty.NoseY: return fr.nose_y;
                default: return 0;
            }
        }
        // Regular Result also supports basic properties
        const res = result as Result;
        switch (prop) {
            case FaceProperty.ID: return res.ID;
            case FaceProperty.Name: return res.name; // Return name string
            case FaceProperty.XCenter: return res.xCenter;
            case FaceProperty.YCenter: return res.yCenter;
            case FaceProperty.Width: return res.width;
            case FaceProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getFacePropertyValueID(result: ResultVariant, prop: FacePropertyID): any {
        if (!result) return 0;
        if (result instanceof FaceResult) {
            const fr = result as FaceResult;
            switch (prop) {
                case FacePropertyID.Name: return fr.name;
                case FacePropertyID.XCenter: return fr.xCenter;
                case FacePropertyID.YCenter: return fr.yCenter;
                case FacePropertyID.Width: return fr.width;
                case FacePropertyID.Height: return fr.height;
                case FacePropertyID.LeftEyeX: return fr.leye_x;
                case FacePropertyID.LeftEyeY: return fr.leye_y;
                case FacePropertyID.RightEyeX: return fr.reye_x;
                case FacePropertyID.RightEyeY: return fr.reye_y;
                case FacePropertyID.LeftMouthX: return fr.lmouth_x;
                case FacePropertyID.LeftMouthY: return fr.lmouth_y;
                case FacePropertyID.RightMouthX: return fr.rmouth_x;
                case FacePropertyID.RightMouthY: return fr.rmouth_y;
                case FacePropertyID.NoseX: return fr.nose_x;
                case FacePropertyID.NoseY: return fr.nose_y;
                default: return 0;
            }
        }
        const res = result as Result;
        switch (prop) {
            case FacePropertyID.Name: return res.name;
            case FacePropertyID.XCenter: return res.xCenter;
            case FacePropertyID.YCenter: return res.yCenter;
            case FacePropertyID.Width: return res.width;
            case FacePropertyID.Height: return res.height;
            default: return 0;
        }
    }

    function getObjectPropertyValue(result: ResultVariant, prop: ObjectProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case ObjectProperty.ID: return res.ID;
            case ObjectProperty.Name: return res.name.length > 0 ? res.name : "";
            case ObjectProperty.XCenter: return res.xCenter;
            case ObjectProperty.YCenter: return res.yCenter;
            case ObjectProperty.Width: return res.width;
            case ObjectProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getObjectPropertyValueID(result: ResultVariant, prop: ObjectPropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case ObjectPropertyID.Name: return res.name.length > 0 ? res.name : "";
            case ObjectPropertyID.XCenter: return res.xCenter;
            case ObjectPropertyID.YCenter: return res.yCenter;
            case ObjectPropertyID.Width: return res.width;
            case ObjectPropertyID.Height: return res.height;
            default: return 0;
        }
    }

    /**
     *  Init I2C until success
     */

    //% weight=200
    //%block="initialize via I2C until success"
    //% group="Communication"
    export function I2CInit(): void {
        beginInternal();
    }

    /**
     * Switch algorithm
     * @param alg select algorithm
     */
    //% block="switch algorithm %alg"
    //% weight=199
    //% group="Algorithm Switch"
    export function switchAlgorithm(alg: Algorithm): void {
        switchAlgorithmInternal(algorithmToID(alg));
    }

    /**
     * Request one-time face recognition result and store it
     */
    //% block="get face recognition result"
    //% weight=198
    //% group="Face Recognition"
    export function getResultFaceRecogtion(): void {
        getResultInternal(ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Whether face recognized
     * Return true if a face is detected
     */
    //% block="available face recogtion"
    //% weight=197
    //% group="Face Recognition"
    export function availableFaceRecogtion(): boolean {
        return availableInternal(ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Get cached result of the face nearest to the center
     * @param alg face property to query
     */
    //% block="face nearest to center %alg"
    //% weight=196
    //% group="Face Recognition"
    export function getCachedCenterResult(alg: FaceProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_FACE_RECOGNITION);
        return getFacePropertyValue(r, alg);
    }

    /**
     * Get number of detected faces from cache
     */
    //% block="number of detected faces"
    //% weight=195
    //% group="Face Recognition"
    export function getCachedResultNumFace(): number {
        return getCachedResultNumInternal(ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Get a specific face's property by index from cache
     * @param index face index (1-based)
     * @param alg face property to query
     */
    //% block="face %index %alg"
    //% weight=194
    //% index.min=1 index.defl=1
    //% group="Face Recognition"
    export function getCachedResultFaceProperty(index: number, alg: FaceProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_FACE_RECOGNITION, index - 1);
        return getFacePropertyValue(r, alg);
    }

    /**
     * Get number of learned face IDs
     */
    //% block="number of learned face IDs"
    //% weight=193
    //% group="Face Recognition"
    export function getNumLearnedFaceIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_FACE_RECOGNITION);
    }

    /**
     * Whether face with given ID exists
     * @param index face ID index (number)
     */
    //% block="face ID %index exists?"
    //% weight=192
    //% index.min=1 index.defl=1
    //% group="Face Recognition"
    export function faceIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_FACE_RECOGNITION, index);
        return r != null;
    }

    /**
     * Get number of faces with a given ID
     * @param index face ID index (number)
     */
    //% block="number of faces with ID %index"
    //% weight=191
    //% index.min=1 index.defl=1
    //% group="Face Recognition"
    export function getNumFaceByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_FACE_RECOGNITION, index);
    }

    /**
     * Get a property for faces with a given ID
     * @param index face ID index (number)
     * @param alg face property (without ID)
     */
    //% block="face ID %index %alg"
    //% weight=190
    //% index.min=1 index.defl=1
    //% group="Face Recognition"
    export function getFacePropertyByID(index: number, alg: FacePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_FACE_RECOGNITION, index);
        return getFacePropertyValueID(r, alg);
    }

    /**
     * Get a property for the Nth face of a given ID
     * @param id face ID (number)
     * @param n Nth face (1-based)
     * @param alg face property (without ID)
     */
    //% block="face ID %id nth %n %alg"
    //% weight=189
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Face Recognition"
    export function getFacePropertyByIDNth(id: number, n: number, alg: FacePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_FACE_RECOGNITION, id, n - 1);
        return getFacePropertyValueID(r, alg);
    }
    
    // ================= Object Recognition =================
    /** Get one-time object recognition result and cache it */
    //% block="get object recognition result"
    //% weight=188
    //% group="Object Recognition"
    export function getResultObjectRecogtion(): void {
        getResultInternal(ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Whether object detected */
    //% block="object detected?"
    //% weight=187
    //% group="Object Recognition"
    export function availableObjectRecogtion(): boolean {
        return availableInternal(ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Object property nearest to center */
    //% block="object nearest to center %alg"
    //% weight=186
    //% group="Object Recognition"
    export function getCachedCenterObjectResult(alg: ObjectProperty): number {
        const r = getCachedCenterResultInternal(ALGORITHM_OBJECT_RECOGNITION);
        return getObjectPropertyValue(r, alg);
    }

    /** Total number of detected objects */
    //% block="number of detected objects"
    //% weight=185
    //% group="Object Recognition"
    export function getCachedResultNumObject(): number {
        return getCachedResultNumInternal(ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Property of Nth object */
    //% block="object %index %alg"
    //% weight=184
    //% index.min=1 index.defl=1
    //% group="Object Recognition"
    export function getCachedResultObjectProperty(index: number, alg: ObjectProperty): number {
        const r = getCachedResultByIndexInternal(ALGORITHM_OBJECT_RECOGNITION, index - 1);
        return getObjectPropertyValue(r, alg);
    }

    /** Total number of learned object IDs */
    //% block="number of learned object IDs"
    //% weight=183
    //% group="Object Recognition"
    export function getNumLearnedObjectIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_OBJECT_RECOGNITION);
    }

    /** Whether object with specified ID exists */
    //% block="object ID %index exists?"
    //% weight=182
    //% index.min=1 index.defl=1
    //% group="Object Recognition"
    export function objectIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_OBJECT_RECOGNITION, index);
        return r != null;
    }

    /** Number of objects with specified ID */
    //% block="number of objects with ID %index"
    //% weight=181
    //% index.min=1 index.defl=1
    //% group="Object Recognition"
    export function getNumObjectByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_OBJECT_RECOGNITION, index);
    }

    /** Property of object with specified ID */
    //% block="object ID %index %alg"
    //% weight=180
    //% index.min=1 index.defl=1
    //% group="Object Recognition"
    export function getObjectPropertyByID(index: number, alg: ObjectPropertyID): number {
        const r = getCachedResultByIDInternal(ALGORITHM_OBJECT_RECOGNITION, index);
        return getObjectPropertyValueID(r, alg);
    }

    /** Property of Nth object with specified ID */
    //% block="object ID %id nth %n %alg"
    //% weight=179
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Object Recognition"
    export function getObjectPropertyByIDNth(id: number, n: number, alg: ObjectPropertyID): number {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_OBJECT_RECOGNITION, id, n - 1);
        return getObjectPropertyValueID(r, alg);
    }

    // ================= Object Tracking =================
    /** Request one-time object tracking data and store in result */
    //% block="get object tracking result"
    //% weight=178
    //% group="Object Tracking"
    export function getResultObjectTracking(): void {
        getResultInternal(ALGORITHM_OBJECT_TRACKING);
    }

    /** Whether tracked object detected */
    //% block="tracked object detected?"
    //% weight=177
    //% group="Object Tracking"
    export function availableObjectTracking(): boolean {
        return availableInternal(ALGORITHM_OBJECT_TRACKING);
    }

    /** Property of tracked object */
    //% block="tracked object %alg"
    //% weight=176
    //% group="Object Tracking"
    export function getCachedObjectTrackingResult(alg: ObjectProperty): number {
        const r = getCachedCenterResultInternal(ALGORITHM_OBJECT_TRACKING);
        return getObjectPropertyValue(r, alg);
    }

    // ================= Color Recognition =================
    function getColorPropertyValue(result: ResultVariant, prop: ColorProperty): number {
        return getObjectPropertyValue(result, prop as any);
    }

    function getColorPropertyValueID(result: ResultVariant, prop: ColorPropertyID): number {
        return getObjectPropertyValueID(result, prop as any);
    }

    /** Get one-time color recognition result and cache it */
    //% block="get color recognition result"
    //% weight=175
    //% group="Color Recognition"
    export function getResultColorRecogtion(): void {
        getResultInternal(ALGORITHM_COLOR_RECOGNITION);
    }

    /** Whether color block detected */
    //% block="color block detected?"
    //% weight=174
    //% group="Color Recognition"
    export function availableColorRecogtion(): boolean {
        return availableInternal(ALGORITHM_COLOR_RECOGNITION);
    }

    /** Color block property nearest to center */
    //% block="color block nearest to center %alg"
    //% weight=173
    //% group="Color Recognition"
    export function getCachedCenterColorResult(alg: ColorProperty): number {
        const r = getCachedCenterResultInternal(ALGORITHM_COLOR_RECOGNITION);
        return getColorPropertyValue(r, alg);
    }

    /** Total number of detected color blocks */
    //% block="number of detected color blocks"
    //% weight=172
    //% group="Color Recognition"
    export function getCachedResultNumColor(): number {
        return getCachedResultNumInternal(ALGORITHM_COLOR_RECOGNITION);
    }

    /** Property of Nth color block */
    //% block="color block %index %alg"
    //% weight=171
    //% index.min=1 index.defl=1
    //% group="Color Recognition"
    export function getCachedResultColorProperty(index: number, alg: ColorProperty): number {
        const r = getCachedResultByIndexInternal(ALGORITHM_COLOR_RECOGNITION, index - 1);
        return getColorPropertyValue(r, alg);
    }

    /** Total number of learned color block IDs */
    //% block="number of learned color block IDs"
    //% weight=170
    //% group="Color Recognition"
    export function getNumLearnedColorIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_COLOR_RECOGNITION);
    }

    /** Whether color block with specified ID exists */
    //% block="color block ID %index exists?"
    //% weight=169
    //% index.min=1 index.defl=1
    //% group="Color Recognition"
    export function colorIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_COLOR_RECOGNITION, index);
        return r != null;
    }

    /** Number of color blocks with specified ID */
    //% block="number of color blocks with ID %index"
    //% weight=168
    //% index.min=1 index.defl=1
    //% group="Color Recognition"
    export function getNumColorByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_COLOR_RECOGNITION, index);
    }

    /** Property of color block with specified ID */
    //% block="color block ID %index %alg"
    //% weight=167
    //% index.min=1 index.defl=1
    //% group="Color Recognition"
    export function getColorPropertyByID(index: number, alg: ColorPropertyID): number {
        const r = getCachedResultByIDInternal(ALGORITHM_COLOR_RECOGNITION, index);
        return getColorPropertyValueID(r, alg);
    }

    /** Property of Nth color block with specified ID */
    //% block="color block ID %id nth %n %alg"
    //% weight=166
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Color Recognition"
    export function getColorPropertyByIDNth(id: number, n: number, alg: ColorPropertyID): number {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_COLOR_RECOGNITION, id, n - 1);
        return getColorPropertyValueID(r, alg);
    }


    // ================= Object Classification =================
    // Object classification properties (only ID and Name)
    export enum ObjectClassificationProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
    }

    function getObjectClassificationPropertyValue(result: ResultVariant, prop: ObjectClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case ObjectClassificationProperty.ID: return res.classID;
            case ObjectClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time object classification data and store in result */
    //% block="get object classification result"
    //% weight=4
    //% group="Object Classification"
    export function getResultObjectClassification(): void {
        getResultInternal(ALGORITHM_OBJECT_CLASSIFICATION);
    }
    /** Whether classified object detected */
    //% block="classified object detected?"
    //% weight=3
    //% group="Object Classification"
    export function availableObjectClassification(): boolean {
        return availableInternal(ALGORITHM_OBJECT_CLASSIFICATION);
    }

    /** Total number of detected classified objects */
    //% block="number of detected classified objects"
    //% weight=2
    //% group="Object Classification"
    export function getCachedResultNumObjectClassification(): number {
        return getCachedResultNumInternal(ALGORITHM_OBJECT_CLASSIFICATION);
    }

    /** Property of Nth classified object */
    //% block="classified object %num %alg"
    //% weight=1
    //% num.min=1 num.defl=1
    //% group="Object Classification"
    export function getCachedObjectClassificationResult(num: number, alg: ObjectClassificationProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_OBJECT_CLASSIFICATION, num - 1);
        return getObjectClassificationPropertyValue(r, alg);
    }



    // ================= Self-Learning Classification =================
    // Self-learning classification properties (only ID and Name)
    export enum SelfLearningClassificationProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
    }

    function getSelfLearningClassificationPropertyValue(result: ResultVariant, prop: SelfLearningClassificationProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case SelfLearningClassificationProperty.ID: return res.ID;
            case SelfLearningClassificationProperty.Name: return res.name.length > 0 ? res.name : "";
            default: return 0;
        }
    }

    /** Request one-time self-learning classification data and store in result */
    //% block="get self-learning classification result"
    //% weight=162
    //% group="Self-learning Classification"
    export function getResultSelfLearningClassification(): void {
        getResultInternal(ALGORITHM_SELF_LEARNING_CLASSIFICATION);
    }

    /** Whether self-learning classification detected */
    //% block="self-learning classification detected?"
    //% weight=161
    //% group="Self-learning Classification"
    export function availableSelfLearningClassification(): boolean {
        return availableInternal(ALGORITHM_SELF_LEARNING_CLASSIFICATION);
    }

    /** Property of self-learning classification */
    //% block="self-learning classification %alg"
    //% weight=160
    //% group="Self-learning Classification"
    export function getCachedSelfLearningClassificationResult(alg: SelfLearningClassificationProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_SELF_LEARNING_CLASSIFICATION);
        return getSelfLearningClassificationPropertyValue(r, alg);
    }

    // ================= Instance Segmentation =================
    function getInstancePropertyValue(result: ResultVariant, prop: InstanceProperty): number {
        return getObjectPropertyValue(result, prop as any);
    }

    function getInstancePropertyValueID(result: ResultVariant, prop: InstancePropertyID): number {
        return getObjectPropertyValueID(result, prop as any);
    }

    /** Get one-time instance segmentation result and cache it */
    //% block="get instance segmentation result"
    //% weight=159
    //% group="Instance Segmentation"
    export function getResultInstanceRecogtion(): void {
        getResultInternal(ALGORITHM_SEGMENT);
    }

    /** Whether instance detected */
    //% block="instance detected?"
    //% weight=158
    //% group="Instance Segmentation"
    export function availableInstanceRecogtion(): boolean {
        return availableInternal(ALGORITHM_SEGMENT);
    }

    /** Instance property nearest to center */
    //% block="instance nearest to center %alg"
    //% weight=157
    //% group="Instance Segmentation"
    export function getCachedCenterInstanceResult(alg: InstanceProperty): number {
        const r = getCachedCenterResultInternal(ALGORITHM_SEGMENT);
        return getInstancePropertyValue(r, alg);
    }

    /** Total number of detected instances */
    //% block="number of detected instances"
    //% weight=156
    //% group="Instance Segmentation"
    export function getCachedResultNumInstance(): number {
        return getCachedResultNumInternal(ALGORITHM_SEGMENT);
    }

    /** Property of Nth instance */
    //% block="instance %index %alg"
    //% weight=155
    //% index.min=1 index.defl=1
    //% group="Instance Segmentation"
    export function getCachedResultInstanceProperty(index: number, alg: InstanceProperty): number {
        const r = getCachedResultByIndexInternal(ALGORITHM_SEGMENT, index - 1);
        return getInstancePropertyValue(r, alg);
    }

    /** Total number of learned instance IDs */
    //% block="number of learned instance IDs"
    //% weight=154
    //% group="Instance Segmentation"
    export function getNumLearnedInstanceIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_SEGMENT);
    }

    /** Whether instance with specified ID exists */
    //% block="instance ID %index exists?"
    //% weight=153
    //% index.min=1 index.defl=1
    //% group="Instance Segmentation"
    export function instanceIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_SEGMENT, index);
        return r != null;
    }

    /** Number of instances with specified ID */
    //% block="number of instances with ID %index"
    //% weight=152
    //% index.min=1 index.defl=1
    //% group="Instance Segmentation"
    export function getNumInstanceByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_SEGMENT, index);
    }

    /** Property of instance with specified ID */
    //% block="instance ID %index %alg"
    //% weight=151
    //% index.min=1 index.defl=1
    //% group="Instance Segmentation"
    export function getInstancePropertyByID(index: number, alg: InstancePropertyID): number {
        const r = getCachedResultByIDInternal(ALGORITHM_SEGMENT, index);
        return getInstancePropertyValueID(r, alg);
    }

    /** Property of Nth instance with specified ID */
    //% block="instance ID %id nth %n %alg"
    //% weight=150
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Instance Segmentation"
    export function getInstancePropertyByIDNth(id: number, n: number, alg: InstancePropertyID): number {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_SEGMENT, id, n - 1);
        return getInstancePropertyValueID(r, alg);
    }

    // ================= Hand Recognition =================
    function getGesturePropertyValue(result: ResultVariant, prop: GestureProperty): any {
        if (!result) return 0;
        if (result instanceof HandResult) {
            const hr = result as HandResult;
            switch (prop) {
                case GestureProperty.ID: return hr.ID;
                case GestureProperty.Name: return hr.name.length > 0 ? hr.name : "";
                case GestureProperty.XCenter: return hr.xCenter;
                case GestureProperty.YCenter: return hr.yCenter;
                case GestureProperty.Width: return hr.width;
                case GestureProperty.Height: return hr.height;
                case GestureProperty.ThumbBaseX: return hr.thumb_cmc_x;
                case GestureProperty.ThumbBaseY: return hr.thumb_cmc_y;
                case GestureProperty.ThumbMiddleJointX: return hr.thumb_mcp_x;
                case GestureProperty.ThumbMiddleJointY: return hr.thumb_mcp_y;
                case GestureProperty.ThumbSecondJointX: return hr.thumb_ip_x;
                case GestureProperty.ThumbSecondJointY: return hr.thumb_ip_y;
                case GestureProperty.ThumbTipX: return hr.thumb_tip_x;
                case GestureProperty.ThumbTipY: return hr.thumb_tip_y;
                case GestureProperty.IndexFingerBaseX: return hr.index_finger_mcp_x;
                case GestureProperty.IndexFingerBaseY: return hr.index_finger_mcp_y;
                case GestureProperty.IndexFingerFirstJointX: return hr.index_finger_pip_x;
                case GestureProperty.IndexFingerFirstJointY: return hr.index_finger_pip_y;
                case GestureProperty.IndexFingerSecondJointX: return hr.index_finger_dip_x;
                case GestureProperty.IndexFingerSecondJointY: return hr.index_finger_dip_y;
                case GestureProperty.IndexFingerTipX: return hr.index_finger_tip_x;
                case GestureProperty.IndexFingerTipY: return hr.index_finger_tip_y;
                case GestureProperty.MiddleFingerBaseX: return hr.middle_finger_mcp_x;
                case GestureProperty.MiddleFingerBaseY: return hr.middle_finger_mcp_y;
                case GestureProperty.MiddleFingerFirstJointX: return hr.middle_finger_pip_x;
                case GestureProperty.MiddleFingerFirstJointY: return hr.middle_finger_pip_y;
                case GestureProperty.MiddleFingerSecondJointX: return hr.middle_finger_dip_x;
                case GestureProperty.MiddleFingerSecondJointY: return hr.middle_finger_dip_y;
                case GestureProperty.MiddleFingerTipX: return hr.middle_finger_tip_x;
                case GestureProperty.MiddleFingerTipY: return hr.middle_finger_tip_y;
                case GestureProperty.RingFingerBaseX: return hr.ring_finger_mcp_x;
                case GestureProperty.RingFingerBaseY: return hr.ring_finger_mcp_y;
                case GestureProperty.RingFingerFirstJointX: return hr.ring_finger_pip_x;
                case GestureProperty.RingFingerFirstJointY: return hr.ring_finger_pip_y;
                case GestureProperty.RingFingerSecondJointX: return hr.ring_finger_dip_x;
                case GestureProperty.RingFingerSecondJointY: return hr.ring_finger_dip_y;
                case GestureProperty.RingFingerTipX: return hr.ring_finger_tip_x;
                case GestureProperty.RingFingerTipY: return hr.ring_finger_tip_y;
                case GestureProperty.PinkyFingerBaseX: return hr.pinky_finger_mcp_x;
                case GestureProperty.PinkyFingerBaseY: return hr.pinky_finger_mcp_y;
                case GestureProperty.PinkyFingerFirstJointX: return hr.pinky_finger_pip_x;
                case GestureProperty.PinkyFingerFirstJointY: return hr.pinky_finger_pip_y;
                case GestureProperty.PinkyFingerSecondJointX: return hr.pinky_finger_dip_x;
                case GestureProperty.PinkyFingerSecondJointY: return hr.pinky_finger_dip_y;
                case GestureProperty.PinkyFingerTipX: return hr.pinky_finger_tip_x;
                case GestureProperty.PinkyFingerTipY: return hr.pinky_finger_tip_y;
                default: return 0;
            }
        }
        return getObjectPropertyValue(result, prop as any);
    }

    function getGesturePropertyValueID(result: ResultVariant, prop: GesturePropertyID): any {
        if (!result) return 0;
        if (result instanceof HandResult) {
            const hr = result as HandResult;
            switch (prop) {
                case GesturePropertyID.Name: return hr.name.length > 0 ? hr.name : "";
                case GesturePropertyID.XCenter: return hr.xCenter;
                case GesturePropertyID.YCenter: return hr.yCenter;
                case GesturePropertyID.Width: return hr.width;
                case GesturePropertyID.Height: return hr.height;
                case GesturePropertyID.confidence: return hr.confidence;
                case GesturePropertyID.WristX: return hr.wrist_x;
                case GesturePropertyID.WristY: return hr.wrist_y;
                case GesturePropertyID.ThumbBaseX: return hr.thumb_cmc_x;
                case GesturePropertyID.ThumbBaseY: return hr.thumb_cmc_y;
                case GesturePropertyID.ThumbMiddleJointX: return hr.thumb_mcp_x;
                case GesturePropertyID.ThumbMiddleJointY: return hr.thumb_mcp_y;
                case GesturePropertyID.ThumbSecondJointX: return hr.thumb_ip_x;
                case GesturePropertyID.ThumbSecondJointY: return hr.thumb_ip_y;
                case GesturePropertyID.ThumbTipX: return hr.thumb_tip_x;
                case GesturePropertyID.ThumbTipY: return hr.thumb_tip_y;
                case GesturePropertyID.IndexFingerBaseX: return hr.index_finger_mcp_x;
                case GesturePropertyID.IndexFingerBaseY: return hr.index_finger_mcp_y;
                case GesturePropertyID.IndexFingerFirstJointX: return hr.index_finger_pip_x;
                case GesturePropertyID.IndexFingerFirstJointY: return hr.index_finger_pip_y;
                case GesturePropertyID.IndexFingerSecondJointX: return hr.index_finger_dip_x;
                case GesturePropertyID.IndexFingerSecondJointY: return hr.index_finger_dip_y;
                case GesturePropertyID.IndexFingerTipX: return hr.index_finger_tip_x;
                case GesturePropertyID.IndexFingerTipY: return hr.index_finger_tip_y;
                case GesturePropertyID.MiddleFingerBaseX: return hr.middle_finger_mcp_x;
                case GesturePropertyID.MiddleFingerBaseY: return hr.middle_finger_mcp_y;
                case GesturePropertyID.MiddleFingerFirstJointX: return hr.middle_finger_pip_x;
                case GesturePropertyID.MiddleFingerFirstJointY: return hr.middle_finger_pip_y;
                case GesturePropertyID.MiddleFingerSecondJointX: return hr.middle_finger_dip_x;
                case GesturePropertyID.MiddleFingerSecondJointY: return hr.middle_finger_dip_y;
                case GesturePropertyID.MiddleFingerTipX: return hr.middle_finger_tip_x;
                case GesturePropertyID.MiddleFingerTipY: return hr.middle_finger_tip_y;
                case GesturePropertyID.RingFingerBaseX: return hr.ring_finger_mcp_x;
                case GesturePropertyID.RingFingerBaseY: return hr.ring_finger_mcp_y;
                case GesturePropertyID.RingFingerFirstJointX: return hr.ring_finger_pip_x;
                case GesturePropertyID.RingFingerFirstJointY: return hr.ring_finger_pip_y;
                case GesturePropertyID.RingFingerSecondJointX: return hr.ring_finger_dip_x;
                case GesturePropertyID.RingFingerSecondJointY: return hr.ring_finger_dip_y;
                case GesturePropertyID.RingFingerTipX: return hr.ring_finger_tip_x;
                case GesturePropertyID.RingFingerTipY: return hr.ring_finger_tip_y;
                case GesturePropertyID.PinkyFingerBaseX: return hr.pinky_finger_mcp_x;
                case GesturePropertyID.PinkyFingerBaseY: return hr.pinky_finger_mcp_y;
                case GesturePropertyID.PinkyFingerFirstJointX: return hr.pinky_finger_pip_x;
                case GesturePropertyID.PinkyFingerFirstJointY: return hr.pinky_finger_pip_y;
                case GesturePropertyID.PinkyFingerSecondJointX: return hr.pinky_finger_dip_x;
                case GesturePropertyID.PinkyFingerSecondJointY: return hr.pinky_finger_dip_y;
                case GesturePropertyID.PinkyFingerTipX: return hr.pinky_finger_tip_x;
                case GesturePropertyID.PinkyFingerTipY: return hr.pinky_finger_tip_y;
                default: return 0;
            }
        }
        return getObjectPropertyValueID(result, prop as any);
    }

    // Gesture properties (with ID)
    export enum GestureProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Thumb Base X"
        ThumbBaseX,
        //% block="Thumb Base Y"
        ThumbBaseY,
        //% block="Thumb Middle Joint X"
        ThumbMiddleJointX,
        //% block="Thumb Middle Joint Y"
        ThumbMiddleJointY,
        //% block="Thumb Second Joint X"
        ThumbSecondJointX,
        //% block="Thumb Second Joint Y"
        ThumbSecondJointY,
        //% block="Thumb Tip X"
        ThumbTipX,
        //% block="Thumb Tip Y"
        ThumbTipY,
        //% block="Index Finger Base X"
        IndexFingerBaseX,
        //% block="Index Finger Base Y"
        IndexFingerBaseY,
        //% block="Index Finger First Joint X"
        IndexFingerFirstJointX,
        //% block="Index Finger First Joint Y"
        IndexFingerFirstJointY,
        //% block="Index Finger Second Joint X"
        IndexFingerSecondJointX,
        //% block="Index Finger Second Joint Y"
        IndexFingerSecondJointY,
        //% block="Index Finger Tip X"
        IndexFingerTipX,
        //% block="Index Finger Tip Y"
        IndexFingerTipY,
        //% block="Middle Finger Base X"
        MiddleFingerBaseX,
        //% block="Middle Finger Base Y"
        MiddleFingerBaseY,
        //% block="Middle Finger First Joint X"
        MiddleFingerFirstJointX,
        //% block="Middle Finger First Joint Y"
        MiddleFingerFirstJointY,
        //% block="Middle Finger Second Joint X"
        MiddleFingerSecondJointX,
        //% block="Middle Finger Second Joint Y"
        MiddleFingerSecondJointY,
        //% block="Middle Finger Tip X"
        MiddleFingerTipX,
        //% block="Middle Finger Tip Y"
        MiddleFingerTipY,
        //% block="Ring Finger Base X"
        RingFingerBaseX,
        //% block="Ring Finger Base Y"
        RingFingerBaseY,
        //% block="Ring Finger First Joint X"
        RingFingerFirstJointX,
        //% block="Ring Finger First Joint Y"
        RingFingerFirstJointY,
        //% block="Ring Finger Second Joint X"
        RingFingerSecondJointX,
        //% block="Ring Finger Second Joint Y"
        RingFingerSecondJointY,
        //% block="Ring Finger Tip X"
        RingFingerTipX,
        //% block="Ring Finger Tip Y"
        RingFingerTipY,
        //% block="Pinky Finger Base X"
        PinkyFingerBaseX,
        //% block="Pinky Finger Base Y"
        PinkyFingerBaseY,
        //% block="Pinky Finger First Joint X"
        PinkyFingerFirstJointX,
        //% block="Pinky Finger First Joint Y"
        PinkyFingerFirstJointY,
        //% block="Pinky Finger Second Joint X"
        PinkyFingerSecondJointX,
        //% block="Pinky Finger Second Joint Y"
        PinkyFingerSecondJointY,
        //% block="Pinky Finger Tip X"
        PinkyFingerTipX,
        //% block="Pinky Finger Tip Y"
        PinkyFingerTipY,
    }

    // Gesture properties (without ID)
    export enum GesturePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="confidence"
        confidence,
        //% block="Wrist X"
        WristX,
        //% block="Wrist Y"
        WristY,
        //% block="Thumb Base X"
        ThumbBaseX,
        //% block="Thumb Base Y"
        ThumbBaseY,
        //% block="Thumb Middle Joint X"
        ThumbMiddleJointX,
        //% block="Thumb Middle Joint Y"
        ThumbMiddleJointY,
        //% block="Thumb Second Joint X"
        ThumbSecondJointX,
        //% block="Thumb Second Joint Y"
        ThumbSecondJointY,
        //% block="Thumb Tip X"
        ThumbTipX,
        //% block="Thumb Tip Y"
        ThumbTipY,
        //% block="Index Finger Base X"
        IndexFingerBaseX,
        //% block="Index Finger Base Y"
        IndexFingerBaseY,
        //% block="Index Finger First Joint X"
        IndexFingerFirstJointX,
        //% block="Index Finger First Joint Y"
        IndexFingerFirstJointY,
        //% block="Index Finger Second Joint X"
        IndexFingerSecondJointX,
        //% block="Index Finger Second Joint Y"
        IndexFingerSecondJointY,
        //% block="Index Finger Tip X"
        IndexFingerTipX,
        //% block="Index Finger Tip Y"
        IndexFingerTipY,
        //% block="Middle Finger Base X"
        MiddleFingerBaseX,
        //% block="Middle Finger Base Y"
        MiddleFingerBaseY,
        //% block="Middle Finger First Joint X"
        MiddleFingerFirstJointX,
        //% block="Middle Finger First Joint Y"
        MiddleFingerFirstJointY,
        //% block="Middle Finger Second Joint X"
        MiddleFingerSecondJointX,
        //% block="Middle Finger Second Joint Y"
        MiddleFingerSecondJointY,
        //% block="Middle Finger Tip X"
        MiddleFingerTipX,
        //% block="Middle Finger Tip Y"
        MiddleFingerTipY,
        //% block="Ring Finger Base X"
        RingFingerBaseX,
        //% block="Ring Finger Base Y"
        RingFingerBaseY,
        //% block="Ring Finger First Joint X"
        RingFingerFirstJointX,
        //% block="Ring Finger First Joint Y"
        RingFingerFirstJointY,
        //% block="Ring Finger Second Joint X"
        RingFingerSecondJointX,
        //% block="Ring Finger Second Joint Y"
        RingFingerSecondJointY,
        //% block="Ring Finger Tip X"
        RingFingerTipX,
        //% block="Ring Finger Tip Y"
        RingFingerTipY,
        //% block="Pinky Finger Base X"
        PinkyFingerBaseX,
        //% block="Pinky Finger Base Y"
        PinkyFingerBaseY,
        //% block="Pinky Finger First Joint X"
        PinkyFingerFirstJointX,
        //% block="Pinky Finger First Joint Y"
        PinkyFingerFirstJointY,
        //% block="Pinky Finger Second Joint X"
        PinkyFingerSecondJointX,
        //% block="Pinky Finger Second Joint Y"
        PinkyFingerSecondJointY,
        //% block="Pinky Finger Tip X"
        PinkyFingerTipX,
        //% block="Pinky Finger Tip Y"
        PinkyFingerTipY,
    }

    /** Get one-time Hand Recognition result and cache it */
    //% block="get Hand Recognition result"
    //% weight=149
    //% group="Hand Recognition"
    export function getResultGestureRecogtion(): void {
        getResultInternal(ALGORITHM_HAND_RECOGNITION);
    }

    /** Whether gesture detected */
    //% block="gesture detected?"
    //% weight=148
    //% group="Hand Recognition"
    export function availableGestureRecogtion(): boolean {
        return availableInternal(ALGORITHM_HAND_RECOGNITION);
    }

    /** Gesture property nearest to center */
    //% block="gesture nearest to center %alg"
    //% weight=147
    //% group="Hand Recognition"
    export function getCachedCenterGestureResult(alg: GestureProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_HAND_RECOGNITION);
        return getGesturePropertyValue(r, alg);
    }

    /** Total number of detected gestures */
    //% block="number of detected gestures"
    //% weight=146
    //% group="Hand Recognition"
    export function getCachedResultNumGesture(): number {
        return getCachedResultNumInternal(ALGORITHM_HAND_RECOGNITION);
    }

    /** Property of Nth gesture */
    //% block="gesture %index %alg"
    //% weight=145
    //% index.min=1 index.defl=1
    //% group="Hand Recognition"
    export function getCachedResultGestureProperty(index: number, alg: GestureProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_HAND_RECOGNITION, index - 1);
        return getGesturePropertyValue(r, alg);
    }

    /** Total number of learned gesture IDs */
    //% block="number of learned gesture IDs"
    //% weight=144
    //% group="Hand Recognition"
    export function getNumLearnedGestureIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_HAND_RECOGNITION);
    }

    /** Whether gesture with specified ID exists */
    //% block="gesture ID %index exists?"
    //% weight=143
    //% index.min=1 index.defl=1
    //% group="Hand Recognition"
    export function gestureIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_HAND_RECOGNITION, index);
        return r != null;
    }

    /** Number of gestures with specified ID */
    //% block="number of gestures with ID %index"
    //% weight=142
    //% index.min=1 index.defl=1
    //% group="Hand Recognition"
    export function getNumGestureByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_HAND_RECOGNITION, index);
    }

    /** Property of gesture with specified ID */
    //% block="gesture ID %index %alg"
    //% weight=141
    //% index.min=1 index.defl=1
    //% group="Hand Recognition"
    export function getGesturePropertyByID(index: number, alg: GesturePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_HAND_RECOGNITION, index);
        return getGesturePropertyValueID(r, alg);
    }

    /** Property of Nth gesture with specified ID */
    //% block="gesture ID %id nth %n %alg"
    //% weight=140
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Hand Recognition"
    export function getGesturePropertyByIDNth(id: number, n: number, alg: GesturePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_HAND_RECOGNITION, id, n - 1);
        return getGesturePropertyValueID(r, alg);
    }

    // ================= Pose Recognition (Human Pose) =================
    function getPosePropertyValue(result: ResultVariant, prop: PoseProperty): any {
        if (!result) return 0;
        if (result instanceof PoseResult) {
            const pr = result as PoseResult;
            switch (prop) {
                case PoseProperty.ID: return pr.ID;
                case PoseProperty.Name: return pr.name.length > 0 ? pr.name : "";
                case PoseProperty.XCenter: return pr.xCenter;
                case PoseProperty.YCenter: return pr.yCenter;
                case PoseProperty.Width: return pr.width;
                case PoseProperty.Height: return pr.height;
                case PoseProperty.NoseX: return pr.nose_x;
                case PoseProperty.NoseY: return pr.nose_y;
                case PoseProperty.LeftEyeX: return pr.leye_x;
                case PoseProperty.LeftEyeY: return pr.leye_y;
                case PoseProperty.RightEyeX: return pr.reye_x;
                case PoseProperty.RightEyeY: return pr.reye_y;
                case PoseProperty.LeftEarX: return pr.lear_x;
                case PoseProperty.LeftEarY: return pr.lear_y;
                case PoseProperty.RightEarX: return pr.rear_x;
                case PoseProperty.RightEarY: return pr.rear_y;
                case PoseProperty.LeftShoulderX: return pr.lshoulder_x;
                case PoseProperty.LeftShoulderY: return pr.lshoulder_y;
                case PoseProperty.RightShoulderX: return pr.rshoulder_x;
                case PoseProperty.RightShoulderY: return pr.rshoulder_y;
                case PoseProperty.LeftElbowX: return pr.lelbow_x;
                case PoseProperty.LeftElbowY: return pr.lelbow_y;
                case PoseProperty.RightElbowX: return pr.relbow_x;
                case PoseProperty.RightElbowY: return pr.relbow_y;
                case PoseProperty.LeftWristX: return pr.lwrist_x;
                case PoseProperty.LeftWristY: return pr.lwrist_y;
                case PoseProperty.RightWristX: return pr.rwrist_x;
                case PoseProperty.RightWristY: return pr.rwrist_y;
                case PoseProperty.LeftHipX: return pr.lhip_x;
                case PoseProperty.LeftHipY: return pr.lhip_y;
                case PoseProperty.RightHipX: return pr.rhip_x;
                case PoseProperty.RightHipY: return pr.rhip_y;
                case PoseProperty.LeftKneeX: return pr.lknee_x;
                case PoseProperty.LeftKneeY: return pr.lknee_y;
                case PoseProperty.RightKneeX: return pr.rknee_x;
                case PoseProperty.RightKneeY: return pr.rknee_y;
                case PoseProperty.LeftAnkleX: return pr.lankle_x;
                case PoseProperty.LeftAnkleY: return pr.lankle_y;
                case PoseProperty.RightAnkleX: return pr.rankle_x;
                case PoseProperty.RightAnkleY: return pr.rankle_y;
                default: return 0;
            }
        }
        return getObjectPropertyValue(result, prop as any);
    }

    function getPosePropertyValueID(result: ResultVariant, prop: PosePropertyID): any {
        if (!result) return 0;
        if (result instanceof PoseResult) {
            const pr = result as PoseResult;
            switch (prop) {
                case PosePropertyID.Name: return pr.name.length > 0 ? pr.name : "";
                case PosePropertyID.XCenter: return pr.xCenter;
                case PosePropertyID.YCenter: return pr.yCenter;
                case PosePropertyID.Width: return pr.width;
                case PosePropertyID.Height: return pr.height;
                case PosePropertyID.NoseX: return pr.nose_x;
                case PosePropertyID.NoseY: return pr.nose_y;
                case PosePropertyID.LeftEyeX: return pr.leye_x;
                case PosePropertyID.LeftEyeY: return pr.leye_y;
                case PosePropertyID.RightEyeX: return pr.reye_x;
                case PosePropertyID.RightEyeY: return pr.reye_y;
                case PosePropertyID.LeftEarX: return pr.lear_x;
                case PosePropertyID.LeftEarY: return pr.lear_y;
                case PosePropertyID.RightEarX: return pr.rear_x;
                case PosePropertyID.RightEarY: return pr.rear_y;
                case PosePropertyID.LeftShoulderX: return pr.lshoulder_x;
                case PosePropertyID.LeftShoulderY: return pr.lshoulder_y;
                case PosePropertyID.RightShoulderX: return pr.rshoulder_x;
                case PosePropertyID.RightShoulderY: return pr.rshoulder_y;
                case PosePropertyID.LeftElbowX: return pr.lelbow_x;
                case PosePropertyID.LeftElbowY: return pr.lelbow_y;
                case PosePropertyID.RightElbowX: return pr.relbow_x;
                case PosePropertyID.RightElbowY: return pr.relbow_y;
                case PosePropertyID.LeftWristX: return pr.lwrist_x;
                case PosePropertyID.LeftWristY: return pr.lwrist_y;
                case PosePropertyID.RightWristX: return pr.rwrist_x;
                case PosePropertyID.RightWristY: return pr.rwrist_y;
                case PosePropertyID.LeftHipX: return pr.lhip_x;
                case PosePropertyID.LeftHipY: return pr.lhip_y;
                case PosePropertyID.RightHipX: return pr.rhip_x;
                case PosePropertyID.RightHipY: return pr.rhip_y;
                case PosePropertyID.LeftKneeX: return pr.lknee_x;
                case PosePropertyID.LeftKneeY: return pr.lknee_y;
                case PosePropertyID.RightKneeX: return pr.rknee_x;
                case PosePropertyID.RightKneeY: return pr.rknee_y;
                case PosePropertyID.LeftAnkleX: return pr.lankle_x;
                case PosePropertyID.LeftAnkleY: return pr.lankle_y;
                case PosePropertyID.RightAnkleX: return pr.rankle_x;
                case PosePropertyID.RightAnkleY: return pr.rankle_y;
                default: return 0;
            }
        }
        return getObjectPropertyValueID(result, prop as any);
    }

    // Pose properties (with ID)
    export enum PoseProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Nose X"
        NoseX,
        //% block="Nose Y"
        NoseY,
        //% block="Left Eye X"
        LeftEyeX,
        //% block="Left Eye Y"
        LeftEyeY,
        //% block="Right Eye X"
        RightEyeX,
        //% block="Right Eye Y"
        RightEyeY,
        //% block="Left Ear X"
        LeftEarX,
        //% block="Left Ear Y"
        LeftEarY,
        //% block="Right Ear X"
        RightEarX,
        //% block="Right Ear Y"
        RightEarY,
        //% block="Left Shoulder X"
        LeftShoulderX,
        //% block="Left Shoulder Y"
        LeftShoulderY,
        //% block="Right Shoulder X"
        RightShoulderX,
        //% block="Right Shoulder Y"
        RightShoulderY,
        //% block="Left Elbow X"
        LeftElbowX,
        //% block="Left Elbow Y"
        LeftElbowY,
        //% block="Right Elbow X"
        RightElbowX,
        //% block="Right Elbow Y"
        RightElbowY,
        //% block="Left Wrist X"
        LeftWristX,
        //% block="Left Wrist Y"
        LeftWristY,
        //% block="Right Wrist X"
        RightWristX,
        //% block="Right Wrist Y"
        RightWristY,
        //% block="Left Hip X"
        LeftHipX,
        //% block="Left Hip Y"
        LeftHipY,
        //% block="Right Hip X"
        RightHipX,
        //% block="Right Hip Y"
        RightHipY,
        //% block="Left Knee X"
        LeftKneeX,
        //% block="Left Knee Y"
        LeftKneeY,
        //% block="Right Knee X"
        RightKneeX,
        //% block="Right Knee Y"
        RightKneeY,
        //% block="Left Ankle X"
        LeftAnkleX,
        //% block="Left Ankle Y"
        LeftAnkleY,
        //% block="Right Ankle X"
        RightAnkleX,
        //% block="Right Ankle Y"
        RightAnkleY,
    }

    // Pose properties (without ID)
    export enum PosePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Nose X"
        NoseX,
        //% block="Nose Y"
        NoseY,
        //% block="Left Eye X"
        LeftEyeX,
        //% block="Left Eye Y"
        LeftEyeY,
        //% block="Right Eye X"
        RightEyeX,
        //% block="Right Eye Y"
        RightEyeY,
        //% block="Left Ear X"
        LeftEarX,
        //% block="Left Ear Y"
        LeftEarY,
        //% block="Right Ear X"
        RightEarX,
        //% block="Right Ear Y"
        RightEarY,
        //% block="Left Shoulder X"
        LeftShoulderX,
        //% block="Left Shoulder Y"
        LeftShoulderY,
        //% block="Right Shoulder X"
        RightShoulderX,
        //% block="Right Shoulder Y"
        RightShoulderY,
        //% block="Left Elbow X"
        LeftElbowX,
        //% block="Left Elbow Y"
        LeftElbowY,
        //% block="Right Elbow X"
        RightElbowX,
        //% block="Right Elbow Y"
        RightElbowY,
        //% block="Left Wrist X"
        LeftWristX,
        //% block="Left Wrist Y"
        LeftWristY,
        //% block="Right Wrist X"
        RightWristX,
        //% block="Right Wrist Y"
        RightWristY,
        //% block="Left Hip X"
        LeftHipX,
        //% block="Left Hip Y"
        LeftHipY,
        //% block="Right Hip X"
        RightHipX,
        //% block="Right Hip Y"
        RightHipY,
        //% block="Left Knee X"
        LeftKneeX,
        //% block="Left Knee Y"
        LeftKneeY,
        //% block="Right Knee X"
        RightKneeX,
        //% block="Right Knee Y"
        RightKneeY,
        //% block="Left Ankle X"
        LeftAnkleX,
        //% block="Left Ankle Y"
        LeftAnkleY,
        //% block="Right Ankle X"
        RightAnkleX,
        //% block="Right Ankle Y"
        RightAnkleY,
    }

    /** Get one-time pose recognition result and cache it */
    //% block="get pose recognition result"
    //% weight=139
    //% group="Pose Recognition"
    export function getResultPoseRecogtion(): void {
        getResultInternal(ALGORITHM_POSE_RECOGNITION);
    }

    /** Whether pose detected */
    //% block="pose detected?"
    //% weight=138
    //% group="Pose Recognition"
    export function availablePoseRecogtion(): boolean {
        return availableInternal(ALGORITHM_POSE_RECOGNITION);
    }

    /** Pose property nearest to center */
    //% block="pose nearest to center %alg"
    //% weight=137
    //% group="Pose Recognition"
    export function getCachedCenterPoseResult(alg: PoseProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_POSE_RECOGNITION);
        return getPosePropertyValue(r, alg);
    }

    /** Total number of detected poses */
    //% block="number of detected poses"
    //% weight=136
    //% group="Pose Recognition"
    export function getCachedResultNumPose(): number {
        return getCachedResultNumInternal(ALGORITHM_POSE_RECOGNITION);
    }

    /** Property of Nth pose */
    //% block="pose %index %alg"
    //% weight=135
    //% index.min=1 index.defl=1
    //% group="Pose Recognition"
    export function getCachedResultPoseProperty(index: number, alg: PoseProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_POSE_RECOGNITION, index - 1);
        return getPosePropertyValue(r, alg);
    }

    /** Total number of learned pose IDs */
    //% block="number of learned pose IDs"
    //% weight=134
    //% group="Pose Recognition"
    export function getNumLearnedPoseIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_POSE_RECOGNITION);
    }

    /** Whether pose with specified ID exists */
    //% block="pose ID %index exists?"
    //% weight=133
    //% index.min=1 index.defl=1
    //% group="Pose Recognition"
    export function poseIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_POSE_RECOGNITION, index);
        return r != null;
    }

    /** Number of poses with specified ID */
    //% block="number of poses with ID %index"
    //% weight=132
    //% index.min=1 index.defl=1
    //% group="Pose Recognition"
    export function getNumPoseByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_POSE_RECOGNITION, index);
    }

    /** Property of pose with specified ID */
    //% block="pose ID %index %alg"
    //% weight=131
    //% index.min=1 index.defl=1
    //% group="Pose Recognition"
    export function getPosePropertyByID(index: number, alg: PosePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_POSE_RECOGNITION, index);
        return getPosePropertyValueID(r, alg);
    }

    /** Property of Nth pose with specified ID */
    //% block="pose ID %id nth %n %alg"
    //% weight=130
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Pose Recognition"
    export function getPosePropertyByIDNth(id: number, n: number, alg: PosePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_POSE_RECOGNITION, id, n - 1);
        return getPosePropertyValueID(r, alg);
    }

    // ================= License Plate Recognition =================
    function getPlatePropertyValue(result: ResultVariant, prop: PlateProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case PlateProperty.ID: return res.ID;
            case PlateProperty.Name: return res.name.length > 0 ? res.name : "";
            case PlateProperty.Content: return res.content.length > 0 ? res.content : "";
            case PlateProperty.XCenter: return res.xCenter;
            case PlateProperty.YCenter: return res.yCenter;
            case PlateProperty.Width: return res.width;
            case PlateProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getPlatePropertyValueID(result: ResultVariant, prop: PlatePropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case PlatePropertyID.Name: return res.name.length > 0 ? res.name : "";
            case PlatePropertyID.Content: return res.content.length > 0 ? res.content : "";
            case PlatePropertyID.XCenter: return res.xCenter;
            case PlatePropertyID.YCenter: return res.yCenter;
            case PlatePropertyID.Width: return res.width;
            case PlatePropertyID.Height: return res.height;
            default: return 0;
        }
    }

    // 车牌属性（含ID）
    export enum PlateProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    // 车牌属性（不含ID）
    export enum PlatePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    /** Get one-time license plate recognition result and cache it */
    //% block="get license plate recognition result"
    //% weight=129
    //% group="License Plate Recognition"
    export function getResultPlateRecogtion(): void {
        getResultInternal(ALGORITHM_LICENSE_RECOGNITION);
    }

    /** Whether license plate detected */
    //% block="license plate detected?"
    //% weight=128
    //% group="License Plate Recognition"
    export function availablePlateRecogtion(): boolean {
        return availableInternal(ALGORITHM_LICENSE_RECOGNITION);
    }

    /** 靠近中心的车牌属性 */
    //% block="Plate near center %alg"
    //% weight=127
    //% group="License Plate Recognition"
    export function getCachedCenterPlateResult(alg: PlateProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_LICENSE_RECOGNITION);
        return getPlatePropertyValue(r, alg);
    }

    /** 检测到的车牌总数 */
    //% block="Number of detected plates"
    //% weight=126
    //% group="License Plate Recognition"
    export function getCachedResultNumPlate(): number {
        return getCachedResultNumInternal(ALGORITHM_LICENSE_RECOGNITION);
    }

    /** 第N个车牌的属性 */
    //% block="Plate %index %alg"
    //% weight=125
    //% index.min=1 index.defl=1
    //% group="License Plate Recognition"
    export function getCachedResultPlateProperty(index: number, alg: PlateProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_LICENSE_RECOGNITION, index - 1);
        return getPlatePropertyValue(r, alg);
    }

    /** 已学习的车牌ID总数 */
    //% block="Number of learned plate IDs"
    //% weight=124
    //% group="License Plate Recognition"
    export function getNumLearnedPlateIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_LICENSE_RECOGNITION);
    }

    /** 指定ID的车牌是否存在 */
    //% block="Does plate ID %index exist?"
    //% weight=123
    //% index.min=1 index.defl=1
    //% group="License Plate Recognition"
    export function plateIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_LICENSE_RECOGNITION, index);
        return r != null;
    }

    /** 指定ID的车牌数量 */
    //% block="Number of plates with ID %index"
    //% weight=122
    //% index.min=1 index.defl=1
    //% group="License Plate Recognition"
    export function getNumPlateByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_LICENSE_RECOGNITION, index);
    }

    /** 指定ID的车牌属性 */
    //% block="Plate ID %index %alg"
    //% weight=121
    //% index.min=1 index.defl=1
    //% group="License Plate Recognition"
    export function getPlatePropertyByID(index: number, alg: PlatePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_LICENSE_RECOGNITION, index);
        return getPlatePropertyValueID(r, alg);
    }

    /** 指定ID第N个车牌的属性 */
    //% block="Plate ID %id No.%n %alg"
    //% weight=120
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="License Plate Recognition"
    export function getPlatePropertyByIDNth(id: number, n: number, alg: PlatePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_LICENSE_RECOGNITION, id, n - 1);
        return getPlatePropertyValueID(r, alg);
    }

    // ================= Optical Char Recognition =================
    function getTextPropertyValue(result: ResultVariant, prop: TextProperty): any {
        if (!result) return 0;
        const res = result as Result;
        
        switch (prop) {
            case TextProperty.ID: return res.ID;
            case TextProperty.Name: return res.name.length > 0 ? res.name : "";
            case TextProperty.Content: return res.content.length > 0 ? res.content : "";
            case TextProperty.XCenter: return res.xCenter;
            case TextProperty.YCenter: return res.yCenter;
            case TextProperty.Width: return res.width;
            case TextProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getTextPropertyValueID(result: ResultVariant, prop: TextPropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        
        switch (prop) {
            case TextPropertyID.Name: return res.name.length > 0 ? res.name : "";
            case TextPropertyID.Content: return res.content.length > 0 ? res.content : "";
            case TextPropertyID.XCenter: return res.xCenter;
            case TextPropertyID.YCenter: return res.yCenter;
            case TextPropertyID.Width: return res.width;
            case TextPropertyID.Height: return res.height;
            default: return 0;
        }
    }

    // 文字属性（含ID）
    export enum TextProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    // 文字属性（不含ID）
    export enum TextPropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    /** 获取一次文字识别结果并缓存 */
    //% block="Get Optical Char Recognition result"
    //% weight=119
    //% group="Optical Char Recognition"
    export function getResultTextRecogtion(): void {
        getResultInternal(ALGORITHM_OCR_RECOGNITION);
    }

    /** 是否检测到文字区域 */
    //% block="Whether text region detected"
    //% weight=118
    //% group="Optical Char Recognition"
    export function availableTextRecogtion(): boolean {
        return availableInternal(ALGORITHM_OCR_RECOGNITION);
    }

    /** 靠近中心的文字区域属性 */
    //% block="Text region near center %alg"
    //% weight=117
    //% group="Optical Char Recognition"
    export function getCachedCenterTextResult(alg: TextProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_OCR_RECOGNITION);
        return getTextPropertyValue(r, alg);
    }

    /** 已学习的文字区域ID总数 */
    //% block="Number of learned text region IDs"
    //% weight=114
    //% group="Optical Char Recognition"
    export function getNumLearnedTextIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_OCR_RECOGNITION);
    }

    /** 指定ID的文字区域是否存在 */
    //% block="Does text region ID %index exist?"
    //% weight=113
    //% index.min=1 index.defl=1
    //% group="Optical Char Recognition"
    export function textIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_OCR_RECOGNITION, index);
        return r != null;
    }

    /** 指定ID的文字区域属性 */
    //% block="Text region ID %index %alg"
    //% weight=111
    //% index.min=1 index.defl=1
    //% group="Optical Char Recognition"
    export function getTextPropertyByID(index: number, alg: TextPropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_OCR_RECOGNITION, index);
        return getTextPropertyValueID(r, alg);
    }

    // ================= Line Tracking =================
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
    //% group="Line Tracking"
    export function getResultLineTracking(): void {
        getResultInternal(ALGORITHM_LINE_TRACKING);
    }

    /** 是否检测到路线 */
    //% block="Whether line detected"
    //% weight=108
    //% group="Line Tracking"
    export function availableLineTracking(): boolean {
        return availableInternal(ALGORITHM_LINE_TRACKING);
    }

    /** 当前路线的属性 */
    //% block="Current line %alg"
    //% weight=107
    //% group="Line Tracking"
    export function getCachedLineTrackingResult(alg: LineTrackingProperty): number {
        const r = getCurrentBranchInternal(ALGORITHM_LINE_TRACKING);
        return getLineTrackingPropertyValue(r, alg);
    }

    /** 前方路口分支数量 */
    //% block="Number of branches at intersection ahead"
    //% weight=106
    //% group="Line Tracking"
    export function getLineTrackingBranchCount(): number {
        return getUpcomingBranchCountInternal(ALGORITHM_LINE_TRACKING);
    }

    /** 逆时针第index条分支路线的属性 */
    //% block="Branch %index counterclockwise %alg"
    //% weight=105
    //% index.min=1 index.defl=1
    //% group="Line Tracking"
    export function getLineTrackingBranchProperty(index: number, alg: LineTrackingProperty): number {
        const r = getBranchInternal(ALGORITHM_LINE_TRACKING, index - 1);
        return getLineTrackingPropertyValue(r, alg);
    }

    // ================= Face Emotion Recognition =================
    function getEmotionPropertyValue(result: ResultVariant, prop: EmotionProperty): number {
        return getObjectPropertyValue(result, prop as any);
    }

    function getEmotionPropertyValueID(result: ResultVariant, prop: EmotionPropertyID): number {
        return getObjectPropertyValueID(result, prop as any);
    }

    export enum EmotionProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    export enum EmotionPropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
    }

    //% block="Get Face Emotion Recognition result"
    //% weight=104
    //% group="Face Emotion Recognition"
    export function getResultEmotionRecogtion(): void {
        getResultInternal(ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Whether emotion detected"
    //% weight=103
    //% group="Face Emotion Recognition"
    export function availableEmotionRecogtion(): boolean {
        return availableInternal(ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Emotion near center %alg"
    //% weight=102
    //% group="Face Emotion Recognition"
    export function getCachedCenterEmotionResult(alg: EmotionProperty): number {
        const r = getCachedCenterResultInternal(ALGORITHM_EMOTION_RECOGNITION);
        return getEmotionPropertyValue(r, alg);
    }

    //% block="Number of detected emotions"
    //% weight=101
    //% group="Face Emotion Recognition"
    export function getCachedResultNumEmotion(): number {
        return getCachedResultNumInternal(ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Emotion %index %alg"
    //% weight=100
    //% index.min=1 index.defl=1
    //% group="Face Emotion Recognition"
    export function getCachedResultEmotionProperty(index: number, alg: EmotionProperty): number {
        const r = getCachedResultByIndexInternal(ALGORITHM_EMOTION_RECOGNITION, index - 1);
        return getEmotionPropertyValue(r, alg);
    }

    //% block="Number of learned emotion IDs"
    //% weight=99
    //% group="Face Emotion Recognition"
    export function getNumLearnedEmotionIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_EMOTION_RECOGNITION);
    }

    //% block="Does emotion ID %index exist?"
    //% weight=98
    //% index.min=1 index.defl=1
    //% group="Face Emotion Recognition"
    export function emotionIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_EMOTION_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of emotions with ID %index"
    //% weight=97
    //% index.min=1 index.defl=1
    //% group="Face Emotion Recognition"
    export function getNumEmotionByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_EMOTION_RECOGNITION, index);
    }

    //% block="Emotion ID %index %alg"
    //% weight=96
    //% index.min=1 index.defl=1
    //% group="Face Emotion Recognition"
    export function getEmotionPropertyByID(index: number, alg: EmotionPropertyID): number {
        const r = getCachedResultByIDInternal(ALGORITHM_EMOTION_RECOGNITION, index);
        return getEmotionPropertyValueID(r, alg);
    }

    //% block="Emotion ID %id No.%n %alg"
    //% weight=95
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Face Emotion Recognition"
    export function getEmotionPropertyByIDNth(id: number, n: number, alg: EmotionPropertyID): number {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_EMOTION_RECOGNITION, id, n - 1);
        return getEmotionPropertyValueID(r, alg);
    }

    // ================= Tag Recognition =================
    function getTagPropertyValue(result: ResultVariant, prop: TagProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case TagProperty.ID: return res.ID;
            case TagProperty.Name: return res.name.length > 0 ? res.name : "";
            case TagProperty.Content: return res.content.length > 0 ? res.content : "";
            case TagProperty.XCenter: return res.xCenter;
            case TagProperty.YCenter: return res.yCenter;
            case TagProperty.Width: return res.width;
            case TagProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getTagPropertyValueID(result: ResultVariant, prop: TagPropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case TagPropertyID.Name: return res.name.length > 0 ? res.name : "";
            case TagPropertyID.Content: return res.content.length > 0 ? res.content : "";
            case TagPropertyID.XCenter: return res.xCenter;
            case TagPropertyID.YCenter: return res.yCenter;
            case TagPropertyID.Width: return res.width;
            case TagPropertyID.Height: return res.height;
            default: return 0;
        }
    }

    export enum TagProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    export enum TagPropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    //% block="Get tag recognition result"
    //% weight=94
    //% group="Tag Recognition"
    export function getResultTagRecogtion(): void {
        getResultInternal(ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Whether tag detected"
    //% weight=93
    //% group="Tag Recognition"
    export function availableTagRecogtion(): boolean {
        return availableInternal(ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Tag near center %alg"
    //% weight=92
    //% group="Tag Recognition"
    export function getCachedCenterTagResult(alg: TagProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_TAG_RECOGNITION);
        return getTagPropertyValue(r, alg);
    }

    //% block="Number of detected tags"
    //% weight=91
    //% group="Tag Recognition"
    export function getCachedResultNumTag(): number {
        return getCachedResultNumInternal(ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Tag %index %alg"
    //% weight=90
    //% index.min=1 index.defl=1
    //% group="Tag Recognition"
    export function getCachedResultTagProperty(index: number, alg: TagProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_TAG_RECOGNITION, index - 1);
        return getTagPropertyValue(r, alg);
    }

    //% block="Number of learned tag IDs"
    //% weight=89
    //% group="Tag Recognition"
    export function getNumLearnedTagIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_TAG_RECOGNITION);
    }

    //% block="Does tag ID %index exist?"
    //% weight=88
    //% index.min=1 index.defl=1
    //% group="Tag Recognition"
    export function tagIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_TAG_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of tags with ID %index"
    //% weight=87
    //% index.min=1 index.defl=1
    //% group="Tag Recognition"
    export function getNumTagByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_TAG_RECOGNITION, index);
    }

    //% block="Tag ID %index %alg"
    //% weight=86
    //% index.min=1 index.defl=1
    //% group="Tag Recognition"
    export function getTagPropertyByID(index: number, alg: TagPropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_TAG_RECOGNITION, index);
        return getTagPropertyValueID(r, alg);
    }

    //% block="Tag ID %id No.%n %alg"
    //% weight=85
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Tag Recognition"
    export function getTagPropertyByIDNth(id: number, n: number, alg: TagPropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_TAG_RECOGNITION, id, n - 1);
        return getTagPropertyValueID(r, alg);
    }

    // ================= QR Code Recognition =================
    function getQRCodePropertyValue(result: ResultVariant, prop: QRCodeProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case QRCodeProperty.ID: return res.ID;
            case QRCodeProperty.Name: return res.name.length > 0 ? res.name : "";
            case QRCodeProperty.Content: return res.content.length > 0 ? res.content : "";
            case QRCodeProperty.XCenter: return res.xCenter;
            case QRCodeProperty.YCenter: return res.yCenter;
            case QRCodeProperty.Width: return res.width;
            case QRCodeProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getQRCodePropertyValueID(result: ResultVariant, prop: QRCodePropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case QRCodePropertyID.Name: return res.name.length > 0 ? res.name : "";
            case QRCodePropertyID.Content: return res.content.length > 0 ? res.content : "";
            case QRCodePropertyID.XCenter: return res.xCenter;
            case QRCodePropertyID.YCenter: return res.yCenter;
            case QRCodePropertyID.Width: return res.width;
            case QRCodePropertyID.Height: return res.height;
            default: return 0;
        }
    }

    export enum QRCodeProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    export enum QRCodePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    //% block="Get QR code recognition result"
    //% weight=84
    //% group="QR Code Recognition"
    export function getResultQRCodeRecogtion(): void {
        getResultInternal(ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="Whether QR code detected"
    //% weight=83
    //% group="QR Code Recognition"
    export function availableQRCodeRecogtion(): boolean {
        return availableInternal(ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="QR code near center %alg"
    //% weight=82
    //% group="QR Code Recognition"
    export function getCachedCenterQRCodeResult(alg: QRCodeProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_QRCODE_RECOGNITION);
        return getQRCodePropertyValue(r, alg);
    }

    //% block="Number of detected QR codes"
    //% weight=81
    //% group="QR Code Recognition"
    export function getCachedResultNumQRCode(): number {
        return getCachedResultNumInternal(ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="QR code %index %alg"
    //% weight=80
    //% index.min=1 index.defl=1
    //% group="QR Code Recognition"
    export function getCachedResultQRCodeProperty(index: number, alg: QRCodeProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_QRCODE_RECOGNITION, index - 1);
        return getQRCodePropertyValue(r, alg);
    }

    //% block="Number of learned QR code IDs"
    //% weight=79
    //% group="QR Code Recognition"
    export function getNumLearnedQRCodeIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_QRCODE_RECOGNITION);
    }

    //% block="Does QR code ID %index exist?"
    //% weight=78
    //% index.min=1 index.defl=1
    //% group="QR Code Recognition"
    export function qrcodeIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_QRCODE_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of QR codes with ID %index"
    //% weight=77
    //% index.min=1 index.defl=1
    //% group="QR Code Recognition"
    export function getNumQRCodeByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_QRCODE_RECOGNITION, index);
    }

    //% block="QR code ID %index %alg"
    //% weight=76
    //% index.min=1 index.defl=1
    //% group="QR Code Recognition"
    export function getQRCodePropertyByID(index: number, alg: QRCodePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_QRCODE_RECOGNITION, index);
        return getQRCodePropertyValueID(r, alg);
    }

    //% block="QR code ID %id No.%n %alg"
    //% weight=75
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="QR Code Recognition"
    export function getQRCodePropertyByIDNth(id: number, n: number, alg: QRCodePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_QRCODE_RECOGNITION, id, n - 1);
        return getQRCodePropertyValueID(r, alg);
    }

    // ================= Barcode Recognition" =================
    function getBarcodePropertyValue(result: ResultVariant, prop: BarcodeProperty): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BarcodeProperty.ID: return res.ID;
            case BarcodeProperty.Name: return res.name.length > 0 ? res.name : "";
            case BarcodeProperty.Content: return res.content.length > 0 ? res.content : "";
            case BarcodeProperty.XCenter: return res.xCenter;
            case BarcodeProperty.YCenter: return res.yCenter;
            case BarcodeProperty.Width: return res.width;
            case BarcodeProperty.Height: return res.height;
            default: return 0;
        }
    }

    function getBarcodePropertyValueID(result: ResultVariant, prop: BarcodePropertyID): any {
        if (!result) return 0;
        const res = result as Result;
        switch (prop) {
            case BarcodePropertyID.Name: return res.name.length > 0 ? res.name : "";
            case BarcodePropertyID.Content: return res.content.length > 0 ? res.content : "";
            case BarcodePropertyID.XCenter: return res.xCenter;
            case BarcodePropertyID.YCenter: return res.yCenter;
            case BarcodePropertyID.Width: return res.width;
            case BarcodePropertyID.Height: return res.height;
            default: return 0;
        }
    }

    export enum BarcodeProperty {
        //% block="ID"
        ID,
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    export enum BarcodePropertyID {
        //% block="Name"
        Name,
        //% block="X Center"
        XCenter,
        //% block="Y Center"
        YCenter,
        //% block="Width"
        Width,
        //% block="Height"
        Height,
        //% block="Content"
        Content,
    }

    //% block="Get barcode recognition result"
    //% weight=74
    //% group="Barcode Recognition"
    export function getResultBarcodeRecogtion(): void {
        getResultInternal(ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Whether barcode detected"
    //% weight=73
    //% group="Barcode Recognition"
    export function availableBarcodeRecogtion(): boolean {
        return availableInternal(ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Barcode near center %alg"
    //% weight=72
    //% group="Barcode Recognition"
    export function getCachedCenterBarcodeResult(alg: BarcodeProperty): any {
        const r = getCachedCenterResultInternal(ALGORITHM_BARCODE_RECOGNITION);
        return getBarcodePropertyValue(r, alg);
    }

    //% block="Number of detected barcodes"
    //% weight=71
    //% group="Barcode Recognition"
    export function getCachedResultNumBarcode(): number {
        return getCachedResultNumInternal(ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Barcode %index %alg"
    //% weight=70
    //% index.min=1 index.defl=1
    //% group="Barcode Recognition"
    export function getCachedResultBarcodeProperty(index: number, alg: BarcodeProperty): any {
        const r = getCachedResultByIndexInternal(ALGORITHM_BARCODE_RECOGNITION, index - 1);
        return getBarcodePropertyValue(r, alg);
    }

    //% block="Number of learned barcode IDs"
    //% weight=69
    //% group="Barcode Recognition"
    export function getNumLearnedBarcodeIDs(): number {
        return getCachedResultLearnedNumInternal(ALGORITHM_BARCODE_RECOGNITION);
    }

    //% block="Does barcode ID %index exist?"
    //% weight=68
    //% index.min=1 index.defl=1
    //% group="Barcode Recognition"
    export function barcodeIdExists(index: number): boolean {
        const r = getCachedResultByIDInternal(ALGORITHM_BARCODE_RECOGNITION, index);
        return r != null;
    }

    //% block="Number of barcodes with ID %index"
    //% weight=67
    //% index.min=1 index.defl=1
    //% group="Barcode Recognition"
    export function getNumBarcodeByID(index: number): number {
        return getCachedResultNumByIDInternal(ALGORITHM_BARCODE_RECOGNITION, index);
    }

    //% block="Barcode ID %index %alg"
    //% weight=66
    //% index.min=1 index.defl=1
    //% group="Barcode Recognition"
    export function getBarcodePropertyByID(index: number, alg: BarcodePropertyID): any {
        const r = getCachedResultByIDInternal(ALGORITHM_BARCODE_RECOGNITION, index);
        return getBarcodePropertyValueID(r, alg);
    }

    //% block="Barcode ID %id No.%n %alg"
    //% weight=65
    //% id.min=1 id.defl=1
    //% n.min=1 n.defl=1
    //% group="Barcode Recognition"
    export function getBarcodePropertyByIDNth(id: number, n: number, alg: BarcodePropertyID): any {
        const r = getCachedIndexResultByIDInternal(ALGORITHM_BARCODE_RECOGNITION, id, n - 1);
        return getBarcodePropertyValueID(r, alg);
    }

    // ================= Custom Model =================
    function getCustomModelPropertyValue(result: ResultVariant, prop: CustomModelProperty): number {
        return getObjectPropertyValue(result, prop as any);
    }

    function getCustomModelPropertyValueID(result: ResultVariant, prop: CustomModelPropertyID): number {
        return getObjectPropertyValueID(result, prop as any);
    }

    // Custom model properties (with ID)
    export enum CustomModelProperty {
        //% blockHidden=true
        //% block="ID"
        ID,
        //% blockHidden=true
        //% block="Name"
        Name,
        //% blockHidden=true
        //% block="X Center"
        XCenter,
        //% blockHidden=true
        //% block="Y Center"
        YCenter,
        //% blockHidden=true
        //% block="Width"
        Width,
        //% blockHidden=true
        //% block="Height"
        Height,
    }

    // Custom model properties (without ID)
    export enum CustomModelPropertyID {
        //% blockHidden=true
        //% block="Name"
        Name,
        //% blockHidden=true
        //% block="X Center"
        XCenter,
        //% blockHidden=true
        //% block="Y Center"
        YCenter,
        //% blockHidden=true
        //% block="Width"
        Width,
        //% blockHidden=true
        //% block="Height"
        Height,
    }

    /** HUSKYLENS 2切换算法ID直到成功 */
    //% blockHidden=true
    //% block="HUSKYLENS 2 switch algorithm ID %algorithmId until success"
    //% weight=64
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function switchCustomModelAlgorithm(algorithmId: number): void {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        switchAlgorithmInternal(algoId);
    }

    /** 算法ID请求一次数据存入结果 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId request data and store result"
    //% weight=63
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function getResultCustomModel(algorithmId: number): void {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        getResultInternal(algoId);
    }

    /** 算法ID检测到目标 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target detected?"
    //% weight=62
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function availableCustomModel(algorithmId: number): boolean {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return availableInternal(algoId);
    }

    /** 算法ID靠近中心的目标属性 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target near center %alg1"
    //% weight=61
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function getCachedCenterCustomModelResult(algorithmId: number, alg1: CustomModelProperty): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedCenterResultInternal(algoId);
        return getCustomModelPropertyValue(r, alg1);
    }

    /** 算法ID检测到的目标总数 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of detected targets"
    //% weight=60
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function getCachedResultNumCustomModel(algorithmId: number): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultNumInternal(algoId);
    }

    /** 算法ID第num个目标的属性 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target %num %alg1"
    //% weight=59
    //% algorithmId.min=1 algorithmId.defl=128
    //% num.min=1 num.defl=1
    //% group="Custom Model"
    export function getCachedResultCustomModelProperty(algorithmId: number, num: number, alg1: CustomModelProperty): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIndexInternal(algoId, num - 1);
        return getCustomModelPropertyValue(r, alg1);
    }

    /** 算法ID已学习的目标ID总数 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of learned target IDs"
    //% weight=58
    //% algorithmId.min=1 algorithmId.defl=128
    //% group="Custom Model"
    export function getNumLearnedCustomModelIDs(algorithmId: number): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultLearnedNumInternal(algoId);
    }

    /** 算法ID ID的目标存在 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target ID %targetId exists?"
    //% weight=57
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% group="Custom Model"
    export function customModelIdExists(algorithmId: number, targetId: number): boolean {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIDInternal(algoId, targetId);
        return r != null;
    }

    /** 算法ID ID的目标总数 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId number of targets with ID %targetId"
    //% weight=56
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% group="Custom Model"
    export function getNumCustomModelByID(algorithmId: number, targetId: number): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        return getCachedResultNumByIDInternal(algoId, targetId);
    }

    /** 算法ID ID的目标属性 */
    //% blockHidden=true
    //% block="Algorithm ID %algorithmId target ID %targetId %alg2"
    //% weight=55
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% group="Custom Model"
    export function getCustomModelPropertyByID(algorithmId: number, targetId: number, alg2: CustomModelPropertyID): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedResultByIDInternal(algoId, targetId);
        return getCustomModelPropertyValueID(r, alg2);
    }

    /** 算法ID ID的第num个目标的属性 */
    //% blockHidden=true
    //% block="Algorithm %algorithmId ID%targetId No.%num %alg2"
    //% inlineInputMode=inline
    //% weight=54
    //% algorithmId.min=1 algorithmId.defl=128
    //% targetId.min=1 targetId.defl=1
    //% num.min=1 num.defl=1
    //% group="Custom Model"
    export function getCustomModelPropertyByIDNth(algorithmId: number, targetId: number, num: number, alg2: CustomModelPropertyID): number {
        const algoId = ALGORITHM_CUSTOM_BEGIN + (algorithmId - 1);
        const r = getCachedIndexResultByIDInternal(algoId, targetId, num - 1);
        return getCustomModelPropertyValueID(r, alg2);
    }

}
