import { useReducer, useRef } from "react";
import jpeg from "jpeg-js";
import {encryptKeys, generateEncryptionKeys} from "../util/encrypt";

const ImageUploader = () => {
    const N = 2;
    const [state, setState] = useReducer((oldState, newState) => ({ ...oldState, ...newState }), {
        file: null,
        fileEncrypted: null,
        inProgressEncrypt: false,
        inProgressDecrypt: false,
    });
    const { file, fileEncrypted, inProgressEncrypt, inProgressDecrypt } = state;

    const file_ref = useRef();

    const handleChange = event => {
        const data = {
            url: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0],
        };
        setState({ file: data });
    };

    const imageEncrypt = () => {

        setState({ inProgressEncrypt: true });
        const cv = document.querySelector("#cv");
        const img1 = document.querySelector("#normal_image");

        let c = cv.getContext("2d");

        let img = new Image();
        img.src = window.URL.createObjectURL(file.data);
        img.onload = () => {
            console.log("Ucitao sliku u canvas...");
            const w = img.width;
            const h = img.height;

            c.canvas.width = w;
            c.canvas.height = h;
            c.drawImage(img1, 0, 0, w, h);

            var imgData = c.getImageData(0, 0, w, h);
            var frameData = new Buffer(w * 2 * (h * 2) * 4);

            // get color pixels rgba
            var pixels = [];
            for (var i = 0; i < imgData.data.length; i += 4) {
                const pixel = {
                    r: imgData.data[i],
                    g: imgData.data[i + 1],
                    b: imgData.data[i + 2],
                    a: imgData.data[i + 3],
                };
                pixels.push(pixel);
            }
            console.log("Kreirao pixel buffer...");
            let frameCounter = 0;
            const wh = w * h;
            for (const i in pixels) {
                const points_r = generateEncryptionKeys(pixels[i].r, N);
                const points_g = generateEncryptionKeys(pixels[i].g, N);
                const points_b = generateEncryptionKeys(pixels[i].b, N);
                const points_a = generateEncryptionKeys(pixels[i].a, N);
                for (let imageId = 0; imageId < N + 2; imageId++) {
                    frameData[imageId * wh + (i * 4) + 0] = points_r[imageId];
                    frameData[imageId * wh + (i + 4) * 1] = points_g[imageId];
                    frameData[imageId * wh + (i + 4) * 2] = points_b[imageId];
                    frameData[imageId * wh + (i + 4) * 3] = points_a[imageId];
                }
            }
            console.log("Dobio sve nove pixele...");

            console.log(`FrameCounter: ${frameCounter} \t FrameData length: ${frameData.length}`);

            var rawImageData = {
                data: frameData,
                width: w * 2,
                height: h * 2,
            };

            var jpegImageData = jpeg.encode(rawImageData);
            const src = URL.createObjectURL(new Blob([jpegImageData.data], { type: file.data.type } /* (1) */));
            setState({ fileEncrypted: src });
            setState({ inProgressEncrypt: false });
        };
    };


    const imageDecrypt = () => {
        setState({ inProgressEncrypt: true });
        const cv = document.querySelector("#cv");
        const img1 = document.querySelector("#encrypted_image");

        let c = cv.getContext("2d");

        let img = new Image();
        img.src = window.URL.createObjectURL(file.data);
        img.onload = () => {
            const w = img.width;
            const h = img.height;

            c.canvas.width = w;
            c.canvas.height = h;
            c.drawImage(img1, 0, 0, w, h);

            var imgData = c.getImageData(0, 0, w, h);
            var frameData = new Buffer(w/2 * h/2  * 4);

            let frameCounter = 0;
            const wh = w * h / 4; // dimenzije slike

            for (var pixelId = 0; pixelId < imgData.data.length / 4; pixelId += 4) {
                const pixelKeys_r = [];
                const pixelKeys_g = [];
                const pixelKeys_b = [];
                const pixelKeys_a = [];
                for(let imageId = 0; imageId< 4; imageId++){
                    pixelKeys_r.push(imgData.data[imageId * wh + pixelId])
                    pixelKeys_g.push(imgData.data[imageId * wh + pixelId + 1])
                    pixelKeys_b.push(imgData.data[imageId * wh + pixelId + 2])
                    pixelKeys_a.push(imgData.data[imageId * wh + pixelId + 3])
                }
                frameData[frameCounter++] = encryptKeys(pixelKeys_r);
                frameData[frameCounter++] = encryptKeys(pixelKeys_g);
                frameData[frameCounter++] = encryptKeys(pixelKeys_b);
                frameData[frameCounter++] = encryptKeys(pixelKeys_a);
            }
            
            var rawImageData = {
                data: frameData,
                width: w * 2,
                height: h * 2,
            };

            var jpegImageData = jpeg.encode(rawImageData);
            const src = URL.createObjectURL(new Blob([jpegImageData.data], { type: file.data.type } /* (1) */));
            const data = {
                data: file.data,
                url: src
            }
            setState({ file: data });
            setState({ inProgressEncrypt: false });
        };
    }

    const pressInput = () => {
        console.log("Input click!");
        const button = file_ref.current;
        button.click();
    };

    const removeImage = () => {
        file_ref.current.value = null;
        setState({ file: false, fileEncrypted: false });
    };

    const _generate = () => {
        const points = generateEncryptionKeys();
        var frameData = new Buffer(3);
        for (const i in points) {
            frameData[i] = points[i].y;
        }
        console.log(frameData);
    };

    return (
        <div style={{ flex: 1 }}>
            {file && (
                <div style={{ flexDirection: "row" }}>
                    <div>
                        <img id="normal_image" className="App-logo" src={file?.url} alt="" />
                        <img id="encrypted_image" className="App-logo" src={fileEncrypted} alt="" />
                    </div>

                    <div style={{ flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                        <button style={{ marginRight: 5 }} onClick={removeImage}>
                            Remove image
                        </button>
                        <button style={{ marginLeft: 5, marginRight: 5 }} onClick={imageEncrypt} disabled={inProgressEncrypt}>
                            {inProgressEncrypt ? "In progress" : "Encrypt image"}
                        </button>
                        <button style={{ marginLeft: 5, marginRight: 5 }} onClick={imageDecrypt} disabled={inProgressDecrypt}>
                            {inProgressDecrypt ? "In progress" : "Dencrypt image"}
                        </button>
                        <button style={{ marginLeft: 5 }} onClick={_generate}>
                            Generate polynomial
                        </button>
                    </div>
                </div>
            )}

            {!file && (
                <div
                    onClick={pressInput}
                    style={{ padding: 100, borderRadius: 16, borderWidth: 3, borderColor: "#ffffff80", borderStyle: "dashed", cursor: "pointer" }}>
                    <label style={{ cursor: "pointer" }}>Upload image</label>
                </div>
            )}

            {/* Hidden content */}
            <div>
                <input ref={file_ref} type="file" onChange={handleChange} style={{ display: "none" }} />
                <canvas id="cv" style={{display: "none", position:'absolute'}} />
                <canvas id="cv2" style={{display: "none", position:'absolute'}} />
            </div>
            {/*  */}
        </div>
    );
};

export default ImageUploader;
