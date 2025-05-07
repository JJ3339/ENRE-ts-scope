function test(){
  function outerFunction(){
    function innerFunction(){
      console.log('innerFunction');
    }
    function innerFunction2(){
      console.log('innerFunction2');
      innerFunction();
    }
    innerFunction2();
  }
  outerFunction();
}