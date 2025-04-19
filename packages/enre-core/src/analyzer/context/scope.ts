import {ENREEntityCollectionScoping, ENREEntityFile, id,} from '@enre-ts/data';
import {logger} from '@enre-ts/core';

export class ENREScope extends Array<ENREEntityCollectionScoping> {
  public parent: ENREEntityCollectionScoping | null;
  public depth: number;
  constructor(file: ENREEntityFile) {
    super();
    this.push(file);
    this.parent  = null;
    this.depth = 0;
  }

  pushNewScope(entity: ENREEntityCollectionScoping){
    this.push(entity);
    entity.parent = this.last();
    this.depth = this.depth + 1;
  }

  popScope(){
    if (this.length >= 1) {
      this.pop();
      this.depth = this.depth - 1;
    } else {
      logger.error('The scope stack is empty, which indicates the scope management is broken.');
      process.exit();
    }
  }

  last = <T = ENREEntityCollectionScoping>() => {
    if (this.length >= 1) {
      return this.at(-1) as T;
    } else {
      logger.error('The scope stack is empty, which indicates the scope management is broken.');
      process.exit();
    }
  };
}
