import NewtonApproximate from "./NewtonApproximate";
import { getValueForX } from "./util";


export const generateEncryptionKeys = (valueInZero = 255, n = 2) => {

    let points = [];
    const zero = {
        x: 0,
        y: valueInZero
    }
    points.push(zero);

    for(let i = 1; i < n + 1; i++){
        const roof = Math.min(valueInZero + 50, 255);
        const floor = Math.max(valueInZero + 50, 0);
        const value = {
            x: i * 20,
            y: Math.random() * roof + floor
        }
        points.push(value);
    }
    // console.log("Points: ",points);
    const coefficients = NewtonApproximate(points);

    // console.log("Koeficijenti: ",coefficients);
    const newPoints = []
    for(let i = 0; i < 4; i++){
        let x;
        let y;
        
        x = i * (n*20)/3;
        y = getValueForX(x, coefficients);
        if(y > 280 || y < -10)
            console.log("Omaseno: ",y);
        const point = {x, y}
        newPoints.push(point);
    }
    // console.log(points);
    return newPoints;
}


export const encryptKeys = (keys, n) => {
    let points = [];
    for(let i = 1; i < keys.length; i++){
        const value = {
            x: i * 20,
            y:  keys[i]
        }
        points.push(value);
    }
    // console.log(points);

    const coefficients = NewtonApproximate(points);
    
    return getValueForX(0, coefficients);
}


