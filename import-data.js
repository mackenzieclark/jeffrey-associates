var bloomfilter = require("./extension/bloomfilter.js");
var fs = require('fs');

function importFile(txt, name) {
    var b = new bloomfilter.BloomFilter(/*bits*/ 2300415, 20);

    for (var line of fs.readFileSync(txt).toString().split('\n')) {
        line = line.trim().toLowerCase();
        if (line) b.add(line);
    }
    var bucketsAsBytes = new Uint8Array(b.buckets.buffer);
    fs.writeFileSync("extension/data/" + name + ".dat", new Buffer(bucketsAsBytes));
}

importFile("data/associates.txt", "associate");
