
import sourceMap from "source-map";

window.addEventListener("error", function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    getMap(errorMessage.filename + ".map", function (data) {
        let smc = new sourceMap.SourceMapConsumer(data);
        let originPos = smc.originalPositionFor({
            line: errorMessage.lineno,
            column: errorMessage.lineno
        });
        let xhr = errorMessage.error.xhr || {};
        let errMes = {
            message: errorMessage.message,
            filename: errorMessage.filename,
            scriptURI: scriptURI,
            lineNo: originPos.line,
            colNo: originPos.column,
            errorObj: errorObj,
            xhr:{
                ...xhr,
                status:xhr.status,
                statusText:xhr.statusText,
                withCredentials:xhr.withCredentials
            }
        };
        console.log(errMes);
    });
});

function getMap(path,fn) {
    fetch(path, {method: "GET"}).then(function (res) {
        res.json().then(fn)
    });
}