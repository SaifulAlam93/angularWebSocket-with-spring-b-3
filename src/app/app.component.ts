import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { RouterOutlet } from '@angular/router';
import { Task } from './model/task';
import { WebsocketService } from './service/websocket.service';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ReactiveFormsModule, NgFor],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{


  //npm install @stomp/stompjs --save

  title = 'real-dashboard-client';

  tasks: Task[] = [];

  form: FormGroup = new FormGroup({
    name: new FormControl<string>('', Validators.required),
    days: new FormControl<number>(0 , Validators.required)
  });

  constructor(private webSocketService: WebsocketService) {
  }

  ngOnInit(): void {
    this.webSocketService.listen(task => {
      this.tasks.push(task);
    });
  }

  add(name: string, days: number): void {
    const task: Task = {
      name: name,
      days: days
    };
    this.webSocketService.send(task);
  }

  click(): void{
    this.add(this.form.value.name, this.form.value.days);
    this.form.reset({});
  }


}
