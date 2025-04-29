// 全局作用域变量
const globalVar = 10;

// 函数作用域
function outerFunction() {
    const outerVar = 20;

    // 嵌套函数作用域
    function innerFunction() {
        const innerVar = 30;
        console.log(innerVar);
    }

    innerFunction();
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

const myObject = new MyClass();
myObject.classMethod();