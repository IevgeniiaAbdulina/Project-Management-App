export class ModalFormResult {
  result?: string;
  payload?: any;

  constructor(result: string | undefined = undefined, payload: any = undefined) {
    this.result = result;
    this.payload = payload;
  }
}
