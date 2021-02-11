import _ from 'lodash';

const NewtonApproximate = (points) => {
    let n = 3;
    let matrix = [];
    const chosenPoints = (_.sampleSize(points,n)).sort((a,b) => a.x - b.x);
    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            row.push(0);
        }
        matrix.push(row);
    }

    for (let i = 0; i < n; i++) {
        matrix[0][i] = chosenPoints[i].y;
    }

    for (let row = 1; row < n; row++) {
        for (let col = 0; col < n - row; col++) {
            const x1 = chosenPoints[col].x;
            const x2 = chosenPoints[col + row].x;
            const y1 = matrix[row - 1][col];
            const y2 = matrix[row - 1][col + 1];
            const f = (y2 - y1) / (x2 - x1);
            matrix[row][col] = f;
        }
    }
    let b = matrix.map(e => e[0]);
    return {b , x0: points.map(e => e.x)}
};

export default NewtonApproximate;
