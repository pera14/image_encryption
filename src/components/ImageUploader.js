import {useRef, useState} from 'react';
import jpeg from 'jpeg-js';


const ImageUploader = () =>  {
    const [file, setFile] = useState(null);
    const [file_encrypted,setFileEncrypted] = useState(null);
    const file_ref = useRef();


    const handleChange = (event) => {
        const data = {
            url: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0]
        };

        setFile(data);

    }

    const imageProcess = () => {
        const cv = document.querySelector("#cv");
        const img1 = document.querySelector("#image");
    
        let c = cv.getContext("2d");

        let img = new Image()
        img.src = window.URL.createObjectURL(file.data);
        img.onload = () => {
            const w = img.width;
            const h = img.height;
            c.canvas.width = w;
            c.canvas.height = h;
            c.drawImage(img1, 0,0,w, h);
            // c2.createImageData(img.width, img.height);
            var imgData = c.getImageData(0, 0, w, h);
            var frameData = new Buffer(w * h * 4);
            // get color pixels rgba
            var pixels = []
            for (var i = 0; i < imgData.data.length; i += 4) {
                const pixel = {
                    r: imgData.data[i] + Math.floor(Math.random() * 100) - 50,
                    g: imgData.data[i+1] + Math.floor(Math.random() * 100) - 50 ,
                    b: imgData.data[i+2] + Math.floor(Math.random() * 100) - 50,
                    a: imgData.data[i+3]
                };
                pixels.push(pixel);
            }


           for(const i in pixels){
               frameData[i*4 ]     = pixels[i].r;
               frameData[i*4 + 1] = pixels[i].g;
               frameData[i*4 + 2] = pixels[i].b;
               frameData[i*4 + 3] = pixels[i].a;
           }

           var rawImageData = {
            data: frameData,
            width: w,
            height:h,
          };
          console.log(file.data);

          var jpegImageData = jpeg.encode(rawImageData);
          const src  = URL.createObjectURL(
            new Blob([jpegImageData.data], { type: file.data.type } /* (1) */)
          );
          console.log(src);
          setFileEncrypted(src)



            console.log(pixels);
        }
    }

    const pressInput = () => {
        console.log('Input click!');
        const button = file_ref.current;
        button.click();
    }

    const removeImage = () => {
        file_ref.current.value= null;
        setFile(false);
    }

    return (
        <div style={{flex: 1}}>
            { file && (
                <div style={{flexDirection: 'row'}}>
                    <div > 
                        <img id="image" className="App-logo" src={file?.url}  alt="" />
                        <img id="image" className="App-logo" src={file_encrypted}  alt="" />
                    </div>
                    
                    <div style={{flexDirection: 'column', justifyContent:'space-between', flex: 1}}>
                        <button style={{marginRight: 5}} onClick={removeImage}>Remove image</button>
                        <button style={{marginLeft: 5}} onClick={imageProcess}>Encrypt image</button>
                    </div>
                </div>
            )}

            { !file && 
                <div onClick={pressInput} style={{padding: 100, borderRadius: 16, borderWidth: 3, borderColor: '#ffffff80', borderStyle: 'dashed', cursor: 'pointer'}}>
                    <label style={{ cursor: 'pointer'}}>Upload image</label>
                </div>
            }


            {/* Hidden content */}
                <div> 
                    <input ref={file_ref} type="file" onChange={handleChange} style={{display: 'none'}}/>
                    <canvas id="cv" style={{display: 'none'}} />
                    <canvas id="cv2" style={{display: 'none'}} />
                </div>
            {/*  */}
        </div>
    );
}

export default ImageUploader;
