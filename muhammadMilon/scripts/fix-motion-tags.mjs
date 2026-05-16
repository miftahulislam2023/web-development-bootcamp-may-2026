import fs from "fs";
import path from "path";

const BAD_OPEN = "<" + "m" + "o" + "t" + "i" + "o" + "n";
const GOOD_OPEN = "<" + "d" + "i" + "v";
const BAD_CLOSE = "</" + "m" + "o" + "t" + "i" + "o" + "n" + ">";
const GOOD_CLOSE = "</" + "d" + "i" + "v" + ">";

function walk(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) walk(p);
    else if (p.endsWith(".jsx")) {
      let t = fs.readFileSync(p, "utf8");
      if (!t.includes("motion")) continue;
      const n = t.split(BAD_OPEN).join(GOOD_OPEN).split(BAD_CLOSE).join(GOOD_CLOSE);
      fs.writeFileSync(p, n);
      console.log("fixed", p);
    }
  }
}

walk("components/builder");
