import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Board } from '../../models/board';

@Component({
  selector: 'app-board-card',
  templateUrl: './board-card.component.html',
  styleUrls: ['./board-card.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BoardCardComponent {
  @Input() item: Board | null = null;
}
