# Fetching Data in Angular2

**Angular2** has **Http** service which is used to make **get** calls to server.  **Http** service in **Angular2** returns **Observables**.

So, before we dive deeper into **Http** service, let's quickly have a glimpse at **Observables**:

To start off with, **Observables** are nothing but a stream of data.These data streams can be of anything - a stream of variables, properties, data structures or
even stream of events. One can react to the stream by listening to it. **Observables** are basically based on **Observer Design Pattern**. In **Observer Design Pattern** one-to-many dependency is maintained between the objects, when one object changes its state all other objects/dependents are notified. These dependents are known as **Observers**.

A stream can emit 3 different things:

1. Value
2. Error
3. Completed signal

Suppose that stream is a stream of events being observed. A function is defined that will be executed when a value is emitted, another function executes when an error is emitted and a third one once the complete signal is emitted.
One can capture these events by using these functions. These functions are known as **Observers** and the stream which is being emitted is the **Observable**.

**Observables** can be of two types:

**1.Hot** - **Hot observables** are those which produce values even before their subscription gets activated. One can consider **Hot Observables** as live performance. The **hot observable** sequence is shared among each **subscriber**, also each **subscriber** gets the next value 
 in the sequence.

**2.Cold** - **Cold observables** behave like standard **iterators**. They push values only when we subscribes to them and they reset when we subscribe again. One can consider **Cold Observables** as a movie.

**Angular2** has chosen **Rxjs** as its core async pattern. **Rxjs** provides a number of operators attached to a stream such as **map**, **filter**, **scan**, **flatMap**, **toPromise**, **catch**.


> We need to display a list of posts. The list of posts can be fetched through this API - http://jsonplaceholder.typicode.com/posts/.

To achieve the above scenario let's break this small app into parts:

1. `AppComponent` - This is parent component for our application.
2. `PostComponent` - This is child component inside our `AppComponent`. It will currently have `PostListComponent` as its child component. 
3. `Post` - We make `Post` **interface** to define the type of element that we will receive from the **GET** api.
4. `PostService` - This service will actually fetch the data via making **GET** call on the api.

Here is our `app.component.ts`:

```TypeScript
import {Component} from '@angular/core';
import {PostComponent} from './post/post.component'
import './rxjs-operators';

@Component({
    selector: 'my-app',
    template: `
        <h1>Fetching:</h1>
        <post-parent></post-parent>
    `,
    directives: <any>[PostComponent]
})

export class AppComponent {
}
```
   
and here is the `post.component.ts`:

```TypeScript
import {Component}  from '@angular/core';
import {PostListComponent} from './post-list.component';
import {PostService} from './post.service';

@Component({
    selector: 'post-parent',
    template: `
        <h2>View Posts</h2>
        <post-list></post-list>
    `,
    directives: <any>[PostListComponent],
    providers: <any>[PostService]
})
export class PostComponent {
}
```

We have injected `PostService`. We register it as a provider by doing `providers:[PostService]` so that its instance is available to all the child components of `PostComponent`.

Let's see the `post.ts`, where we define the `Post`:

```TypeScript
export interface Post {
    id:number;
    title:string;
    body:string
}
```

Now, let's have a look at our `post-list.component.ts` which exports the `PostListComponent`:

```TypeScript
import {Component} from '@angular/core';
import {PostService} from './post.service';
import {Post} from './post';

@Component({
    selector: 'post-list',
    template: `
        <div>
        </div>
    `
})

export class PostListComponent {
    constructor(private _postDataService:PostService) {
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';
     sort(property){
     //Sort posts data when user click on ID column
        this.posts.reverse();
    }

    getPosts() {
        //To Do: Fetch Posts here using PostsDataService
    }
}
```


1.I have written `post.service.ts` to fetch data using `getPosts()` function.



```TypeScript
import {Injectable} from "@angular/core";
import {Post} from './post';

@Injectable()
export class PostService {
}
```


2. First,I have  import **Http** and **Response** from `@angular/http` and also need to import **Observable** from `rxjs/Observable`.
So the `post.service.ts` would now be:
    ```TypeScript
    import {Injectable} from "@angular/core";
    import {Post} from './post';
    import { Http, Response } from '@angular/http';
    import { Observable } from 'rxjs/Observable';
    
    @Injectable()
    export class PostService {
    }
    ```

3. I have used a few operators in our `getData()` function so we need to import them in `rxjs-operators.ts` and then import this into our `app.component.ts`.

    **rxjs-operators.ts**:
    ```TypeScript
    import 'rxjs/add/operator/catch';
    import 'rxjs/add/operator/map';
    import 'rxjs/add/operator/toPromise';
    ```
    
    **app.components.ts**:
    ```TypeScript
    import {Component} from '@angular/core';
    import {PostComponent} from './post/post.component'
    import './rxjs-operators';
    
    @Component({
        selector: 'my-app',
        template: `
          <h1>Fetching:</h1>
          <post-parent></post-parent>
        `,
        directives:[PostComponent]
    })
    
    export class AppComponent {
    }
    ```

4. Now, the  `getData()` function which will get posts from the api. So the   `getData()` function should be like:
    ```TypeScript
    getData():Observable<Post[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .map(this.extractData)
            .catch(this.handleError);
    }
    ```

The api http://jsonplaceholder.typicode.com/posts/ returns  an array of post whereas  `http.get` would return  an **Observable**.
So I have used the **map** operator which transforms the response emitted by **Observable** by applying a function to it. So in case of success,flow 
would now move to `extractData()` function, which is:

```TypeScript
private extractData(res:Response) {
    let body = res.json();
    return body || [];
}
```

In the above snippet we are transforming response to the **json** format by doing `res.json()`.

But in case had we encountered an error,  flow would have moved to `catch` operator. The **catch** operator intercepts an **onError** notification 
from **Observable** and continues the sequence without error. `handleError()` function would have come into play in that case:

```TypeScript
Error message will be logged in console
    private handleError(error:any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console 
        return Observable.throw(errMsg);
    }
```

After joining all the parts, our `post.service.ts` would look like:

```TypeScript
import {Injectable} from "@angular/core";
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Post} from './post';

@Injectable()
export class PostService {
    constructor(private http:Http) {
    }

    getData():Observable<Post[]> {
        return this.http.get('http://jsonplaceholder.typicode.com/posts/')
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res:Response) {
        let body = res.json();
        return body || [];
    }

    private handleError(error:any) {
        let errMsg = (error.message) ? error.message :
        error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        console.error(errMsg); // log to console 
        return Observable.throw(errMsg);
    }
}
```

Above **Observable** is a **cold observable**. So one has to **subscribe** to it.

Now, let's move back to the `PostListComponent` 

5. Add definition part to our `getPosts()` function:
    ```TypeScript
    getPosts() {
        this._postDataService.getData()
            .subscribe(
                posts => this.posts = posts,
                error => this.errorMessage = <any>error);
    }
    ```    

   **subscribe** operator in the above snippet. In **Rxjs** one can **subscribe** to an **Observable** by passing 0 to 3 individual 
    functions `onNext`, `onError` and `onCompleted`.

6. Display the fetched `post` in this `PostListComponent`. So  template would like:
    ```HTML
     <table id="article">
    <tr>
      <th (click)="sort();">ID</th>
      <th>Title</th>
      <th>Body</th>
    </tr>
    <tr *ngFor="let post of posts">
    <td>{{post.id}}</td>
    <td>{{post.title}}</td>
    <td>{{post.body}}</td>
    </tr>
    </table>
    ```    

7. In oder to sort table while user clicks on Id collumn header I have witten  sort('ArticleID') function
So the `PostListComponent` would look like:

```TypeScript
import {Component} from '@angular/core';
import {PostService} from './post.service';
import {Post} from './post';

@Component({
    selector: 'post-list',
    template: `
    
    <table id="article">
    <tr>
      <th (click)="sort();">ID</th>
      <th>Title</th>
      <th>Body</th>
    </tr>
    <tr *ngFor="let post of posts">
    <td>{{post.id}}</td>
    <td>{{post.title}}</td>
    <td>{{post.body}}</td>
    </tr>
    </table>
        
    `
})

export class PostListComponent {
    constructor(private _postDataService:PostService) {
        
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';
    private index = 1;
    sort(property){
     //Sort posts data when user click on ID column
        this.posts.reverse();
    }

    getPosts() {
        this._postDataService.getData()
            .subscribe(
                posts => this.posts = posts,
                error => this.errorMessage = <any>error);
    }


}
```


