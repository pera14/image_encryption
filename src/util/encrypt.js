import NewtonApproximate, {solveNewtonApproximation} from "./NewtonApproximate";

const endX = 170;
const dots = [74, 78, 85, 93]
export const generateEncryptionKeys = (valueInX0 = 160) => {  
    let points = [];
    let newPoints = []
    points[0] = {
        x: 0,
        y: valueInX0
    }
    points[1] = {
        x: endX / 2,
        y: Math.round(Math.random() * 255)
    }
    points[2] = {
        x: endX,
        y: valueInX0
    }
    const {b, x0} =  NewtonApproximate(points);
    for(let i = 0; i < 4; i++){
        const x = dots[i];
        const y = solveNewtonApproximation(x, b, x0);
        newPoints.push(y);
    }
    return newPoints;
}


export const encryptKeys = (keys) => {
    let points = [];
    for(let i = 1; i < keys.length; i++){
        const value = {
            x:  dots[i],
            y:  keys[i]
        }
        points.push(value);
    }
    const {b, x0} = NewtonApproximate(points);
    return Math.max(Math.min(solveNewtonApproximation(0, b,x0), 255),0);
}


