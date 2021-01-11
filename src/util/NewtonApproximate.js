import { insideScope } from "./util";

const NewtonApproximate = (points, recursive = false) => {
    let n = points.length;
    let matrix = [];

    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(0);
        }
        matrix.push(row);
    }

    for (let i = 0; i < n; i++) {
        matrix[0][i] = points[i].y;
    }

    for (let row = 1; row < n; row++) {
        for (let col = 0; col < n - row; col++) {
            const x1 = points[col].x;
            const x2 = points[col + row].x;
            const y1 = matrix[row - 1][col];
            const y2 = matrix[row - 1][col + 1];
            const f = (y2 - y1) / (x2 - x1);
            matrix[row][col] = f;
        }
    }

    // console.log(matrix);
    const f0 = matrix.map(row => row[0])
    let coefficients = [matrix[0][0]];
    coefficients[0] += f0[1]*points[0];
    coefficients[0] += f0[2]*points[1]*points[0];

    coefficients[1] = f0[1]- points[1] - points[0];
    coefficients[2] = f0[2]- points[1] - points[0];
    
    // const coefficients = matrix.map(row => row[0]);

    if(!insideScope(coefficients) && !recursive){
        console.log("Promasio je");
        for(let i = 1; i < points.length; i++){
            const value = {
                x: i * 20,
                y: Math.random() * 255
            }
            points[i] = value;
        }
        return NewtonApproximate(points, true);
    }else
        return coefficients;
};

export default NewtonApproximate;
