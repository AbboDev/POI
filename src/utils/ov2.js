const Buffer = require('buffer/').Buffer;

export function ascii2utf8(buffer) {
  let c;
  let i;
  let j;

  // New buffer with utf8 string:
  const utf8 = Buffer.alloc(buffer.length * 2);

  // Convert:
  j = 0;
  for (i = 0; i < buffer.length; i++) {
    c = buffer.readUInt8(i, 1);

    if (c < 0x80) {
      utf8.writeUInt8(buffer.readUInt8(i, 1), j += 1);
    } else if (c < 0xc0) {
      utf8.writeUInt8(0xc2, j += 1);
      utf8.writeUInt8(buffer.readUInt8(i, 1), j += 1);
    } else {
      utf8.writeUInt8(0xc3, j += 1);
      utf8.writeUInt8(buffer.readUInt8(i, 1) - 0x40, j += 1);
    }
  }

  return utf8.toString('utf8', 0, j);
}

export function importOV2(input) {
  return new Promise((resolve, reject) => {
    const ov2 = Buffer.from(input);
    const records = [];

    let type;
    let rlength;

    let record = 0;
    let i = 0;

    record = 0;
    i = 0;

    try {
      do {
        type = ov2.readUInt8(i + 0);
        rlength = ov2.readUInt32LE(i + 1);

        switch (type) {
        // Deleted record:
        case 0:
          throw new Error(`The type "${type}" is not yet decoded!`);

        // Skipper Record:
        case 1: {
          const west = ov2.readInt32LE(i + 5) / 100000;
          const south = ov2.readInt32LE(i + 9) / 100000;
          const east = ov2.readInt32LE(i + 13) / 100000;
          const north = ov2.readInt32LE(i + 17) / 100000;

          records[record] = {
            record,
            type,
            bytes: rlength,
            lng: west + (east - west),
            lat: south + (north - south),
          };

          i += 21;
          record += 1;
          break;
        }

        // Simple POI Record:
        case 2:
          records[record] = {
            record,
            type,
            length: rlength,
            lng: ov2.readInt32LE(i + 5) / 100000,
            lat: ov2.readInt32LE(i + 9) / 100000,
            info: ascii2utf8(ov2.slice(i + 13, i + (rlength)))
              .replace(/\0/g, '')
          };

          i += ov2.readUInt32LE(i + 1);
          record += 1;
          break;

        // Extended POI Record:
        case 3:
          throw new Error(`The type "${type}" is not yet decoded!`);

        default:
          throw new Error(`The type "${type}" is unknown!`);
        }
      } while (i < ov2.length);
    } catch (error) {
      reject(error);
    }

    resolve(records);
  });
}
