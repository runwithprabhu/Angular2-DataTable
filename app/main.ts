import {bootstrap}    from '@angular/platform-browser-dynamic';
import {AppComponent} from './app.component';
import {HTTP_PROVIDERS} from '@angular/http';
//Applying the route configuration when bootstrapping Angular2 app
bootstrap(<any>AppComponent, [HTTP_PROVIDERS])
    .catch(err => console.error(err));