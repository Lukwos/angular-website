import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-dot-background',
  templateUrl: './dot-background.component.html',
  styleUrls: ['./dot-background.component.scss']
})
export class DotBackgroundComponent implements AfterViewInit {

  @ViewChild('background') canvas: ElementRef;
  ctx: any;
  points: Array<Point>;
  backgroundColor: Color;

  constructor(public router: Router) {
    router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(e => {
      if (e['urlAfterRedirects'] === '/home') this.changeColor(colors[0]);
      if (e['urlAfterRedirects'] === '/about') this.changeColor(colors[1]);
      if (e['urlAfterRedirects'] === '/projects') this.changeColor(colors[2]);
      if (e['urlAfterRedirects'] === '/contact') this.changeColor(colors[3]);
      if (e['urlAfterRedirects'] === '/404') this.changeColor(colors[4]);
    });
  }

  ngAfterViewInit(): void {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.points = [];
    this.backgroundColor = new Color(6, 0, 15);

    window.addEventListener('resize', this.resize.bind(this));
    this.resize();
    this.loop();
  }

  resize() {

    let width = window.innerWidth;
    let height = window.innerHeight;

    this.canvas.nativeElement.width = width;
    this.canvas.nativeElement.height = height;

    let numberOfPoints = Math.round(width * height / 10000);
    while (this.points.length !== numberOfPoints) {
      if (this.points.length > numberOfPoints) {
        this.points.pop();
      }
      else {
        this.points.push(new Point(new Vector(Math.random() * width, Math.random() * height), colors[0]));
      }
    }
  }

  loop() {
    this.ctx.fillStyle = this.backgroundColor;
    this.ctx.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);

    for (let i = 0; i < this.points.length; i++) {
      for (let j = i + 1; j < this.points.length; j++) {
        let start = this.points[i];
        let end = this.points[j];
        let distance = Vector.SquareDistance(start.position, end.position);
        if (distance < 40000) {
          this.ctx.beginPath();
          this.ctx.moveTo(start.position.x, start.position.y);
          this.ctx.lineTo(end.position.x, end.position.y);
          this.ctx.strokeStyle = Color.lerp(Color.lerp(start.color, end.color, 0.5), this.backgroundColor, distance / 40000).toString();
          this.ctx.stroke();
        }
      }
    }

    this.points.forEach(point => {
      point.update(this);
      point.draw(this);
    });

    console.log(this.points.length);
    requestAnimationFrame(this.loop.bind(this));
  }

  changeColor(newColors) {
    this.points.forEach(point => {
      setTimeout(() => {
        point.color = (Math.random() < 0.7) ? newColors.primary : newColors.secondary;
      }, 1000 * point.position.x / this.canvas.nativeElement.width);
    });
  }
}

// Classes //

class Color {
  r: number;
  g: number;
  b: number;
  a: number;

  constructor(r: number, g: number, b: number, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  toString() {
    return 'rgba(' + this.r + ',' + this.g + ',' + this.b + ',' + this.a + ')';
  }

  static lerp(startColor: Color, endColor: Color, value: number) {
    if (value < 0) value = 0;
    if (value > 1) value = 1;

    return new Color(
      startColor.r * (1 - value) + endColor.r * value,
      startColor.g * (1 - value) + endColor.g * value,
      startColor.b * (1 - value) + endColor.b * value
    );
  }

  static equal(lhs: Color, rhs: Color) {
    return (lhs.r == rhs.r && lhs.g == rhs.g && lhs.b == rhs.b && lhs.a == rhs.a);
  }
};

class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static add(lhs: Vector, rhs: Vector) {
    return new Vector(lhs.x + rhs.x, lhs.y + rhs.y);
  }

  static mul(vector: Vector, value: number) {
    return new Vector(vector.x * value, vector.y * value);
  }

  static SquareDistance(lhs: Vector, rhs: Vector) {
    let dx = rhs.x - lhs.x;
    let dy = rhs.y - lhs.y;
    return dx * dx + dy * dy;
  }
};

class Point {
  position: Vector;
  size: number;
  color: Color;
  speed: Vector;

  constructor(position: Vector, color: any) {
    this.position = position
    this.size = 2;
    this.color = (Math.random() < 0.7) ? color.primary : color.secondary;

    let angle = Math.random() * 2 * Math.PI;
    this.speed = Vector.mul(new Vector(Math.cos(angle), Math.sin(angle)), 1);
  }

  draw(scene: DotBackgroundComponent) {
    scene.ctx.beginPath();
    scene.ctx.arc(this.position.x, this.position.y, this.size, 0, 2 * Math.PI);
    scene.ctx.fillStyle = this.color.toString();
    scene.ctx.fill();
  }

  update(scene: DotBackgroundComponent) {
    this.position = Vector.add(this.position, this.speed);

    if (this.position.x < 0) this.position.x += scene.canvas.nativeElement.width;
    else if (this.position.x > scene.canvas.nativeElement.width) this.position.x -= scene.canvas.nativeElement.width;

    if (this.position.y < 0) this.position.y += scene.canvas.nativeElement.height;
    else if (this.position.y > scene.canvas.nativeElement.height) this.position.y -= scene.canvas.nativeElement.height;
  }
};

// Settings //

let colors = [
  {
    primary: new Color(45, 226, 230),
    secondary: new Color(247, 6, 207)
  },
  {
    primary: new Color(250, 0, 0),
    secondary: new Color(0, 255, 255)
  },
  {
    primary: new Color(0, 250, 0),
    secondary: new Color(255, 0, 255)
  },
  {
    primary: new Color(0, 0, 250),
    secondary: new Color(255, 255, 0)
  },
  {
    primary: new Color(0, 0, 0),
    secondary: new Color(255, 255, 255)
  }
];