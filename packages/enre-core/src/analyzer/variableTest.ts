function test(){
  let a = 1;
  function inner(){
    let c = 10;
    let b = a + c + 2;
    console.log(b);
  }
  inner();
}

test();