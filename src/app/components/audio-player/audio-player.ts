import { Component, Input, OnDestroy, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-audio-player',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './audio-player.html',
  styleUrls: ['./audio-player.css']
})
export class AudioPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() audioUrl!: string;
  @Input() title = 'Audio Libro';

  private audio = new Audio();
  isPlaying = false;
  currentTime = 0;
  duration = 0;
  volume = 1;

  ngOnInit() {
    if (this.audioUrl) {
      this.setupAudio();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['audioUrl'] && this.audioUrl) {
      this.setupAudio();
    }
  }

  ngOnDestroy() {
    this.audio.pause();
    this.audio = new Audio();
  }

  private setupAudio(): void {
    // Reset previous audio
    this.audio.pause();
    this.audio = new Audio();

    this.audio.src = this.audioUrl;
    this.audio.load();

    this.audio.ontimeupdate = () => {
      this.currentTime = this.audio.currentTime;
    };

    this.audio.onloadedmetadata = () => {
      this.duration = this.audio.duration;
    };

    this.audio.onended = () => {
      this.isPlaying = false;
    };

    this.audio.onerror = (error) => {
      console.error('Error en audio:', error);
      this.isPlaying = false;
    };
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.audio.pause();
    } else {
      this.audio.play().catch(error => {
        console.error('Error al reproducir:', error);
      });
    }
    this.isPlaying = !this.isPlaying;
  }

  stop(): void {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.isPlaying = false;
  }

  seekTo(event: Event): void {
    const target = event.target as HTMLInputElement;
    const newTime = parseFloat(target.value);
    this.audio.currentTime = newTime;
    this.currentTime = newTime;
  }

  setVolume(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.volume = parseFloat(target.value);
    this.audio.volume = this.volume;
  }

  get currentTimeFormatted(): string {
    return this.formatTime(this.currentTime);
  }

  get durationFormatted(): string {
    return this.formatTime(this.duration);
  }

  private formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}