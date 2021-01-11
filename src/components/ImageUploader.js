import {useRef, useState} from 'react';

const ImageUploader = () =>  {
    const [file, setFile] = useState(null);
    const [file_encrypted] = useState(null);
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
            c.drawImage(img1, 0,0,img.width, img.height);
            var imgData = c.getImageData(0, 0, img.width, img.height);

            // get color pixels rgba
            var pixels = []
            for (var i = 0; i < imgData.data.length; i += 4) {
                const pixel = {
                    r: imgData.data[i],
                    g: imgData.data[i+1]+10,
                    b: imgData.data[i+2],
                    a: imgData.data[i+3]
                };
                pixels.push(pixel);
            }
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
                    <div style={{alignItems:'unset'}}> 
                        <img id="image" className="App-logo" src={file?.url}  alt="" />
                        <img id="image2" className="App-logo" src={file_encrypted}  alt="" />
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
                </div>
            {/*  */}
        </div>
    );
}

export default ImageUploader;
