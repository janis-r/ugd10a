const fs = require('fs');

fs.readFile("package.json", {encoding: "utf8"}, (err: Error, data: string) => {
    if (err) {
        throw err;
    }

    const packageData: { [key: string]: any } = JSON.parse(data);
    delete packageData.scripts;
    delete packageData.devDependencies;

    fs.writeFile("build/package.json", JSON.stringify(packageData, null, 2), {encoding: "utf8"}, (err: Error) => {
        if (err) {
            throw err;
        }
    });
});