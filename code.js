function main(a, b, c){
    let a1 = [a, b, c, 10, 5, "text"]; // what if i put if here)
    if (a > 5){
        let i = 1;
        while (i <= 5){
            a += (a1 + 5)**((2 - 4)/5);
            i += (5 - 4);
            console.log(a, 5, "abc");
            if (i == 2){
                break;
            };
        };
    };
    a1.push(10);
    a1.shift();
    a1.pop();
}
