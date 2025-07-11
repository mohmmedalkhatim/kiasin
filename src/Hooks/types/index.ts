import { Area } from '../../types/area';

interface requsetparms<T> {
  id?: string;
  item?: T;
  command?: string;
}

class requset<T = object> implements requsetparms<T> {
  id?: string;
  item?: T;
  command?: string | undefined;
  res?: T | undefined;
  constructor(id?: string, command?: string, item?: T) {
    this.id = id;
    this.item = item;
    this.command = command;
  }
  data() {}
  filtered() {}
}
