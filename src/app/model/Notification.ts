/**
 * Created by Avraham on 19/11/2017.
 */
export class Notification {
  Title: string;
  Message: string;
  Classes: string;
  Duration: number;

  constructor(mssag: string, title?: string, classes?: string, duration?: number) {
    this.Message = mssag;
    this.Title = title
    this.Classes = classes ? 'alert alert-' + classes : 'alert alert-success'
    this.Duration = duration ? duration : (this.Classes.includes('success') ? 2000 : 3000)
  }
}
