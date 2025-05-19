const c = 4;

namespace A{
  import b = B.b;
  export const a = b + c;
}

namespace B{
  import c = C.c;
  export const b = 0;
}

namespace C{
  export const b = 1;
  export const c = b;
}
