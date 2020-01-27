import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'import-poc';
  signupForm = new FormGroup({
    name: new FormControl(null, Validators.required),
    files: new FormControl(null, [Validators.required, this.requiredFileType('xlsx')])
  });
  data = [];

  requiredFileType(type: string) {
    return function (control: FormControl) {
      const files = control.value;
      if(files){
        files.forEach(file => {
          var splitName = file.name.split('.');
          const extension = splitName[splitName.length-1].toLowerCase();
          if (type.toLowerCase() !== extension.toLowerCase()) {
            return {
              requiredFileType: true
            };
          }
        });
      }
      return null;
    };
  }

  submit() {
    if(!this.signupForm.valid) return;
    var files: [File] = this.signupForm.value.files;

    files.forEach(file => {
    var reader: FileReader = new FileReader();
    reader.onload = (e: any) => this.onloadReader(e);
      reader.readAsBinaryString(file);
    });
  }

  onloadReader (e: any) {
    /* read workbook */
    const bstr: string = e.target.result;
    const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

    /* grab first sheet */
    const wsname: string = wb.SheetNames[0];
    const ws: XLSX.WorkSheet = wb.Sheets[wsname];

    /* save data */
    debugger;
    this.data.push(<any>(XLSX.utils.sheet_to_json(ws, { header: 1 })));
  };
}
