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
        //should be moved to ngOnInit lifecycle hook
        this.getPosts();
    }

    private posts:Post[] = [];
    private errorMessage:any = '';
    private index = 1;
    sort(){
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