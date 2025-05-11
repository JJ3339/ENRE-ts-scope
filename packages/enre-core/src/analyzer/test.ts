// 全局作用域变量
const globalVar = 10;

// 函数作用域
function outerFunction() {
    const outerVar = 20;

    // 嵌套函数作用域
    function innerFunction() {
        const innerVar = 30;
        console.log(innerVar);
        function innerMostFunction() {
            const innerMostVar = 70;
            console.log(innerMostVar);
        }
        innerMostFunction();
    }

    innerFunction();
    function innerFunction2() {
        const innerVar2 = 80;
        console.log(innerVar2);
    }
    function innerFunction3() {
        const innerVar3 = 90;
        console.log(innerVar3);
        function innerMostFunction2() {
            const innerMostVar2 = 110;
            console.log(innerMostVar2);
        }
        innerMostFunction2();
        class MyClass2 {
        }
    }
    innerFunction2();
    innerFunction3();
    }


outerFunction(); 

// 类作用域
class MyClass {
    private classProperty = 40;

    constructor() {
        this.classProperty = 50;
    }

    public classMethod() {
        const methodVar = 60;
        console.log(methodVar);
    }
}

