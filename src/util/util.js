export const insideScope = (coefficient) => {
    const step = 1;
    for(let i = 0; i < 10/step;i++){
        const value = getValueForX(i*step, coefficient);
        if(!(-10 <value || value > 270)){
            console.log("Promasena vrednost: "+value);
            return false;
        }
    }
    return true;
}


export const getValueForX = (x, x0, coefficients) => {
    let fx = 0;
    for(const i in coefficients){
        let bin = 0;
        // for(let j = 0; j < i; j++){
        //     bin += x - x0[j];
        // }
        fx += coefficients[i] * Math.pow(x, i) * bin;
    }
    return fx;
}