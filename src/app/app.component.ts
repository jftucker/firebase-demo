import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database';
import { ActionSequence } from 'protractor';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  courses$: Observable<any>;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.courses$ = this.db
      .list('/courses')
      .snapshotChanges()
      .pipe(
        map((action) =>
          action.map((a) => {
            return {
              key: a.payload.key,
              value: a.payload.val(),
              type: a.type,
              prevKey: a.prevKey,
            };
          })
        )
      );

    console.log(this.courses$);
  }

  add(course): void {
    this.db.list('/courses').push({
      name: course.value,
      price: 150,
      isLive: true,
      sections: [
        { title: 'Components' },
        { title: 'directives' },
        { title: 'templates' },
      ],
    });
    course.value = '';
  }

  update(course): void {
    this.db.object('/courses/' + course.key).set(course.value + ' UPDATED');
  }

  delete(course): void {
    this.db.object('/courses/' + course.key).remove();
  }
}
