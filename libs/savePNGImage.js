function savePNGImage(imageElement, fileName){
    function rand(max, min){
        return min + Math.floor(Math.random()*(max-min));
    }
    fileName = typeof fileName == 'string' ? fileName : 'Image-'+[rand(333), rand(333), rand(333)].join('-');
    fileName = fileName.search(/\.png$/i) > -1 ? fileName : fileName + '.png';

    if(typeof imageElement.toDataURL == 'function'){
        var ImageDataURI = require('image-data-uri');
        var data = imageElement.toDataURL('image/png');
        return ImageDataURI.outputFile(data, fileName);
    }else{
        throw new Error('the first argument must be an HTMLImageElement or HTMLCanvasElement');
    }

}

if(typeof module == 'object') module.exports = savePNGImage;