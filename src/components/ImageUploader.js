import { useReducer, useRef } from "react";
import jpeg from "jpeg-js";
import { encryptKeys, generateEncryptionKeys } from "../util/encrypt";
import "react-circular-progressbar/dist/styles.css";

const ImageUploader = () => {
    const N = 2;
    const [state, setState] = useReducer((oldState, newState) => ({ ...oldState, ...newState }), {
        file: null,
        fileEncrypted: null,
        inProgressEncrypt: false,
        inProgressDecrypt: false,
        percentage: 0,
        nextStage: "encryption",
    });
    const { file, fileEncrypted, inProgressEncrypt, nextStage } = state;

    const file_ref = useRef();

    const handleChange = event => {
        const data = {
            url: URL.createObjectURL(event.target.files[0]),
            data: event.target.files[0],
        };
        setState({ file: data });
    };

    const imageEncrypt = () => {
        console.log('Pocetak');
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
            var frameData = new Buffer(w * h * 4 * 4);
            console.log("Frame data length: ", imgData.data.length);
            // get color pixels rgba
            var pixels = [];
            for (var i = 0; i < imgData.data.length; i += 4) {
                const pixel = {
                    r: imgData.data[i + 0],
                    g: imgData.data[i + 1],
                    b: imgData.data[i + 2],
                    a: imgData.data[i + 3],
                };
                pixels.push(pixel);
            }
            console.log("Kreirao pixel buffer...");
            const wh = w * h;
            console.log(`wh: ${wh} - w: ${w}, h: ${h}`);
            console.log(`Numebr of pixels: ${pixels.length}`);
            for (const i in pixels) {
                const index = parseInt(i);
                const points_r = generateEncryptionKeys(pixels[i].r, N);
                const points_g = generateEncryptionKeys(pixels[i].g, N);
                const points_b = generateEncryptionKeys(pixels[i].b, N);
                const points_a = [0, 0, 0, 0];
                if (index === 14) {
                    console.log(points_r, pixels[i].r);
                    console.log(points_g, pixels[i].g);
                    console.log(points_b, pixels[i].b);
                    console.log(points_a, pixels[i].a);
                }
                for (let frame = 0; frame < N; frame++) {
                    frameData[(frame + Math.floor(index / w)) * w * 4 + index * 4 + 0] = points_r[frame];
                    frameData[(frame + Math.floor(index / w)) * w * 4 + index * 4 + 1] = points_g[frame];
                    frameData[(frame + Math.floor(index / w)) * w * 4 + index * 4 + 2] = points_b[frame];
                    frameData[(frame + Math.floor(index / w)) * w * 4 + index * 4 + 3] = points_a[frame];
                }
                for (let frame = 2; frame < N + 2; frame++) {
                    frameData[wh * 8 + ((frame % 2) + Math.floor(index / w)) * w * 4 + index * 4 + 0] = points_r[frame];
                    frameData[wh * 8 + ((frame % 2) + Math.floor(index / w)) * w * 4 + index * 4 + 1] = points_g[frame];
                    frameData[wh * 8 + ((frame % 2) + Math.floor(index / w)) * w * 4 + index * 4 + 2] = points_b[frame];
                    frameData[wh * 8 + ((frame % 2) + Math.floor(index / w)) * w * 4 + index * 4 + 3] = points_a[frame];
                }
            }
            console.log("Dobio sve nove pixele...");
            var rawImageData = {
                data: frameData,
                width: w * 2,
                height: h * 2,
            };

            var jpegImageData = jpeg.encode(rawImageData, 100);
            const src = URL.createObjectURL(new Blob([jpegImageData.data]));
            setState({ fileEncrypted: src });
            setState({ inProgressEncrypt: false, nextStage: "decryption" });
            console.log('Ende');
        };
    };

    const imageDecrypt = () => {
        setState({ inProgressEncrypt: true });
        const cv = document.querySelector("#cv2");
        const img1 = document.querySelector("#encrypted_image");

        let c = cv.getContext("2d");

        let img = new Image();
        img.src = fileEncrypted;
        img.onload = () => {
            const w = img.width;
            const h = img.height;

            c.canvas.width = w;
            c.canvas.height = h;
            c.drawImage(img1, 0, 0, w, h);

            var imgData = c.getImageData(0, 0, w, h);
            var frameData = new Buffer(w * h);
            let pixelPointer = 0;
            const wh = (w * h) / 4;
            console.log(`Image data length: ${imgData.data.length}`);
            console.log(`wh: ${wh} - w: ${w}, h: ${h}`);
            const oldW = w / 2;
            for (var pixelId = 0; pixelId < imgData.data.length / 16; pixelId++) {
                const pixelKeys_r = [];
                const pixelKeys_g = [];
                const pixelKeys_b = [];
                const pixelKeys_a = [];
                for (let frame = 0; frame < 2; frame++) {
                    pixelKeys_r.push(imgData.data[(frame + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 0]);
                    pixelKeys_g.push(imgData.data[(frame + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 1]);
                    pixelKeys_b.push(imgData.data[(frame + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 2]);
                    pixelKeys_a.push(imgData.data[(frame + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 3]);
                }
                for (let frame = 2; frame < 4; frame++) {
                    pixelKeys_r.push(imgData.data[wh * 8 + ((frame % 2) + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 0]);
                    pixelKeys_g.push(imgData.data[wh * 8 + ((frame % 2) + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 1]);
                    pixelKeys_b.push(imgData.data[wh * 8 + ((frame % 2) + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 2]);
                    pixelKeys_a.push(imgData.data[wh * 8 + ((frame % 2) + Math.floor(pixelId / oldW)) * oldW * 4 + pixelId * 4 + 3]);
                }
                if (pixelId === 14) {
                    console.log(pixelKeys_r, encryptKeys(pixelKeys_r));
                    console.log(pixelKeys_g, encryptKeys(pixelKeys_g));
                    console.log(pixelKeys_b, encryptKeys(pixelKeys_b));
                    console.log(pixelKeys_a);
                }

                frameData[pixelPointer++] = encryptKeys(pixelKeys_r);
                frameData[pixelPointer++] = encryptKeys(pixelKeys_g);
                frameData[pixelPointer++] = encryptKeys(pixelKeys_b);
                frameData[pixelPointer++] = 0;
            }
            var rawImageData = {
                data: frameData,
                width: w / 2,
                height: h / 2,
            };

            console.log(rawImageData);

            var jpegImageData = jpeg.encode(rawImageData);
            const src = URL.createObjectURL(new Blob([jpegImageData.data]));
            const data = {
                data: file.data,
                url: src,
            };
            setState({ file: data });
            setState({ inProgressEncrypt: false, nextStage: "encryption" });
        };
    };

    const pressInput = () => {
        const button = file_ref.current;
        button.click();
    };

    const removeImage = () => {
        file_ref.current.value = null;
        setState({ file: false, fileEncrypted: false });
    };

    return (
        <div style={{ flex: 1 }}>
            {file && (
                <div style={{ flexDirection: "row" }}>
                    <div style={{position:'relative'}}>
                        {inProgressEncrypt && <div style={{position: 'absolute', top: 0, bottom: 0, left: 0, right: 0}}>
                            <div className="donut" ></div>
                        </div>}
                        {nextStage === "encryption" && <img id="normal_image" className="App-logo" src={file?.url ? file?.url : undefined} alt="" style={{filter: inProgressEncrypt ? `blur(10px)` : 'unset'}} />}
                        {nextStage === "decryption" && (
                            <img id="encrypted_image" className="App-logo" src={fileEncrypted ? fileEncrypted : undefined} alt="" />
                        )}
                    </div>

                    <div style={{ flexDirection: "column", justifyContent: "space-between", flex: 1 }}>
                        <button style={{ marginRight: 5 }} onClick={removeImage}>
                            Remove image
                        </button>
                        <button
                            style={{ marginLeft: 5, marginRight: 5 }}
                            onClick={nextStage === "encryption" ? imageEncrypt : imageDecrypt}
                            disabled={inProgressEncrypt}>
                            {nextStage === "encryption" ? "Encrypt image" : "Decrypt image"}
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
                <input ref={file_ref} type="file" onChange={handleChange} style={{ display: "none" }} accept="image/*" />
                <canvas id="cv" style={{ display: "none" }} />
                <canvas id="cv2" style={{ display: "none" }} />
            </div>
            {/*  */}
        </div>
    );
};

export default ImageUploader;
