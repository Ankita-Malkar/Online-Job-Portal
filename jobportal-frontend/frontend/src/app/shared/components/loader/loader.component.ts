import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loader-wrap">
      <div class="spinner"></div>
      <span style="color:var(--text-2);font-size:14px">{{ message }}</span>
    </div>
  `
})
export class LoaderComponent {
  @Input() message = 'Loading...';
}
