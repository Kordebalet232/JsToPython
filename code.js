function someFunc(arg){
    arg += 1;
};
let a = 3;
function main(a, b, c){
    b = [1, 2, 3, 4];
    a =  b[1];
    a = someFunc(b);
};
if (a > 5){
    for (let b = 6; b < 7; b+=1){
        if (a < 7){
            a = a + b;
        }
        while(a > 7){
            a -= 3;
        };
        if (a == 5){
            break
        }
        else{
            continue
        }
    };
}
else{
    console.log("Hello it's working!!!");
}
a = someFunc(5) + 2/4;
s = [2, 4, 5]
s.push(6);
s[2] = 3;