function test(){
  let localVar = 10;
  function outerFunction(){
    let outerVar = 20;
    function innerFunction(){
      let innerVar = 30;
      console.log(innerVar);
    }
    function innerFunction2(){
      let innerVar2 = 40;
      console.log(innerVar2);
      innerFunction();
    }
    innerFunction2();
  }
  outerFunction();
}

test();