const deviceSize = 70e6;
const spaceNeededToUpdate = 30e6;

class FsItem {
    constructor(name) {
        this.name = name;
    }
}
class FsDir extends FsItem {
    constructor(parentDir, name, content = []) {
        super(name);
        this.parentDir = parentDir;
        this.content = content;
    }
    addItems(items) {
        this.content.push(...items);
    }
    getItem(name, type = FsItem) {
        return this.content.find(item => item instanceof type && item.name === name);
    }
    getSize() {
        return this.content.reduce(
            (res, curr) => res + (
                curr instanceof FsDir
                    ? curr.getSize()
                    : curr instanceof FsFile
                        ? curr.size
                        : 0
            ),
            0
        );
    }
}
class FsFile extends FsItem {
    constructor(name, size = 0) {
        super(name);
        this.size = size;
    }
}

class FileSys {
    fs = new FsDir(null, '');
    _cwd = this.fs; // Current Working Directory
    mkDir(path, dirname) {
        const placeDir = this._getDirByPath(path);
        return this.mkItem(placeDir, new FsDir(placeDir, dirname));
    }
    mkFile(path, filename, size = 0) {
        const placeDir = this._getDirByPath(path);
        return this.mkItem(placeDir, new FsFile(filename, size));
    }
    mkItem(placeDir, item) {
        if (!placeDir || placeDir.getItem(item.name, item.constructor)) return false;

        placeDir.addItems([item]);
        return true;
    }
    chDir(path) {
        const desDir = this._getDirByPath(path);
        if (!desDir) return false;

        this._cwd = desDir;
        return true;
    }
    _getDirByPath(path) {
        return path
            .split('/')
            .filter(Boolean)
            .reduce((res, curr) =>
                res && curr !== '.'
                    ? curr === '..'
                        ? res.parentDir || res // If we have reached the root we'll not be able to exit it (cd ../)
                        : res.getItem(curr, FsDir)
                    : res,
                path[0] === '/' ? this.fs : this._cwd
            );
    }
    pwDir() {
        const getSeq = dir => [...(dir.parentDir ? getSeq(dir.parentDir) : []), dir];
        return getSeq(this._cwd)
            .map(el => el.name)
            .join('/') || '/';
    }
    lsDir(path = '.') {
        return (this._getDirByPath(path) || {}).content;
    }
}

function buildFSByCLIOutput(cli) {
    return cli
        .split('\n')
        .filter(Boolean)
        .reduce((res, curr) => {
            const parts = curr.split(' ');
            if (parts[0] === '$') {
                res.lsMode = false;
                switch(parts[1]) {
                    case 'cd':
                        res.files.chDir(parts[2]);
                        break;
                    case 'ls':
                        res.lsMode = true;
                        break;
                }
            } else if (res.lsMode) {
                if (parts[0] === 'dir') res.files.mkDir('.', parts[1]);
                else res.files.mkFile('.', parts[1], +parts[0]);
            }
            return res;
        }, {files: new FileSys(), lsMode: false}).files;
}

function calcTotalDelCandidateSize(cli) {
    const {fs: rootDir} = buildFSByCLIOutput(cli);

    let totalSize = 0;
    const scanStack = [rootDir];
    while (scanStack.length) {
        const curr = scanStack.pop();
        if (curr instanceof FsDir) {
            const currSum = curr.getSize();
            if (currSum <= 100000) totalSize += currSum;
            scanStack.push(...curr.content);
        }
    }

    return totalSize;
}
function getDelSize(cli) {
    const {fs: rootDir} = buildFSByCLIOutput(cli);

    const candidates = [];
    const scanStack = [rootDir];
    while (scanStack.length) {
        const curr = scanStack.pop();
        if (curr instanceof FsDir) {
            candidates.push(curr.getSize());
            scanStack.push(...curr.content);
        }
    }

    const delSizeNeeded = spaceNeededToUpdate - (deviceSize - rootDir.getSize());
    return candidates
        .sort((a, b) => a - b)
        .find(el => el >= delSizeNeeded);
}
