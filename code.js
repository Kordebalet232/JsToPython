function someFunc(arg){
    arg += 1;
    return arg;
};
let a = 3;
function main(a, b, c){
    b = [1, 2, 3, 4];
    a =  b[1];
    a = someFunc(b);
    return b;
};
if (a > 5){
    for (let b = 6; b < 7; b+=1){
        if (a < 7){
            a = a + b;
        }
        while(a > 7){
            a -= 3 + 5 / (2 + 7)**2 + someFunc(7);
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
let s = [2, 4, 5]
s.length;
s.push(6);
s.pop();
s.shift();
s[2] = 3;
let dict = new Map();
dict.set(1, "smth");
dict.get(1);
dict.has(1);
dict.size;
dict.remove(1);
let set = new Set(1, 2, 3);
set.add(1);
set.has(1);
set.size;
set.delete(1);
set.clear();

