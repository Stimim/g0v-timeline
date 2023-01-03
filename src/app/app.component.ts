import { Component } from '@angular/core';
import {TranslateService} from '@ngx-translate/core';


const _DEFAULT_LANG = 'zh'


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(translate: TranslateService) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(_DEFAULT_LANG);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(_DEFAULT_LANG);
  }
}
