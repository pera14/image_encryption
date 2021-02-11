
export const solveNewtonApproximation = (value, b, x) => {
    let retValue = 0;
    for(const i in b){
        let xProduct = 1;
        for(let j = 1;j<=i;j++){
            xProduct *=(value - x[j-1]) 
        }
        retValue += b[i]*xProduct;
    }
    return Math.round(retValue);
}